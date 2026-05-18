import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Ad, AdPlacement } from "@/types";
import { sampleAds } from "@/data/sampleAds";
import { supabaseAdmin, isSupabaseAvailable } from "./supabaseServer";

const STORE_FILE = path.join(process.cwd(), ".data", "ads.json");

// ─── Supabase行 ⇄ Ad型 変換ヘルパー ───
type AdRow = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  placement: Ad["placement"];
  ad_type: Ad["adType"];
  sponsor_name: string | null;
  priority: number;
  is_active: boolean;
  start_at: string | null;
  end_at: string | null;
  impressions: number;
  clicks: number;
  created_at: string;
};

function rowToAd(r: AdRow): Ad {
  return {
    id: r.id,
    title: r.title,
    imageUrl: r.image_url,
    linkUrl: r.link_url,
    placement: r.placement,
    adType: r.ad_type,
    sponsorName: r.sponsor_name ?? undefined,
    priority: r.priority,
    isActive: r.is_active,
    startAt: r.start_at ?? undefined,
    endAt: r.end_at ?? undefined,
    createdAt: r.created_at,
  };
}

function adToRow(a: Partial<Ad>): Partial<AdRow> {
  return {
    ...(a.title !== undefined && { title: a.title }),
    ...(a.imageUrl !== undefined && { image_url: a.imageUrl }),
    ...(a.linkUrl !== undefined && { link_url: a.linkUrl }),
    ...(a.placement !== undefined && { placement: a.placement }),
    ...(a.adType !== undefined && { ad_type: a.adType }),
    ...(a.sponsorName !== undefined && { sponsor_name: a.sponsorName ?? null }),
    ...(a.priority !== undefined && { priority: a.priority }),
    ...(a.isActive !== undefined && { is_active: a.isActive }),
    ...(a.startAt !== undefined && { start_at: a.startAt ?? null }),
    ...(a.endAt !== undefined && { end_at: a.endAt ?? null }),
  };
}

// ─── ローカルJSONフォールバック ───
async function ensureStore() {
  const dir = path.dirname(STORE_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, "[]", "utf-8");
  }
}

async function readAdsFromFile(): Promise<Ad[]> {
  try {
    await ensureStore();
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Ad[];
    if (parsed.length === 0) return sampleAds;
    return parsed;
  } catch (err) {
    console.warn("[adStore] file read failed, fallback to samples:", err);
    return sampleAds;
  }
}

// ─── Public API ───
export async function readAds(): Promise<Ad[]> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("ads")
      .select("*")
      .order("priority", { ascending: false });
    if (error) {
      console.warn("[adStore] supabase read failed, fallback to file:", error.message);
      return readAdsFromFile();
    }
    // DBが空ならサンプルを返す（初回起動時の見栄え用）
    if ((data?.length ?? 0) === 0) return sampleAds;
    return (data as AdRow[]).map(rowToAd);
  }
  return readAdsFromFile();
}

export async function getActiveAds(placement: AdPlacement): Promise<Ad[]> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("ads")
      .select("*")
      .eq("placement", placement)
      .eq("is_active", true)
      .or(`start_at.is.null,start_at.lte.${nowIso}`)
      .or(`end_at.is.null,end_at.gte.${nowIso}`)
      .order("priority", { ascending: false });
    if (!error && data && data.length > 0) {
      return (data as AdRow[]).map(rowToAd);
    }
    if (error) {
      console.warn("[adStore] supabase getActive failed:", error.message);
    }
    // DBに該当広告が無い時もサンプルにフォールバック（MVPでの見栄え）
  }
  // ファイル/サンプルフォールバック
  const all = await readAdsFromFile();
  const now = Date.now();
  return all
    .filter((a) => a.placement === placement && a.isActive)
    .filter((a) => {
      const startOk = !a.startAt || new Date(a.startAt).getTime() <= now;
      const endOk = !a.endAt || new Date(a.endAt).getTime() >= now;
      return startOk && endOk;
    })
    .sort((a, b) => b.priority - a.priority);
}

export async function getFirstActiveAd(
  placement: AdPlacement
): Promise<Ad | null> {
  const list = await getActiveAds(placement);
  return list[0] ?? null;
}

export async function appendAd(
  data: Omit<Ad, "id" | "createdAt">
): Promise<Ad> {
  const ad: Ad = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  if (isSupabaseAvailable && supabaseAdmin) {
    const row = adToRow(ad);
    const { data: inserted, error } = await supabaseAdmin
      .from("ads")
      .insert(row)
      .select()
      .single();
    if (error) {
      console.warn("[adStore] supabase insert failed:", error.message);
      return ad;
    }
    return rowToAd(inserted as AdRow);
  }
  // ファイルフォールバック
  try {
    await ensureStore();
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const ads: Ad[] = (() => {
      try {
        return JSON.parse(raw) as Ad[];
      } catch {
        return [];
      }
    })();
    ads.unshift(ad);
    await fs.writeFile(STORE_FILE, JSON.stringify(ads, null, 2), "utf-8");
  } catch (err) {
    console.warn("[adStore] write failed:", err);
  }
  return ad;
}

export async function updateAd(
  id: string,
  patch: Partial<Ad>
): Promise<Ad | null> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const row = adToRow(patch);
    const { data, error } = await supabaseAdmin
      .from("ads")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.warn("[adStore] supabase update failed:", error.message);
      return null;
    }
    return data ? rowToAd(data as AdRow) : null;
  }
  try {
    const ads = await readAdsFromFile();
    const idx = ads.findIndex((a) => a.id === id);
    if (idx < 0) return null;
    ads[idx] = { ...ads[idx], ...patch };
    await fs.writeFile(STORE_FILE, JSON.stringify(ads, null, 2), "utf-8");
    return ads[idx];
  } catch (err) {
    console.warn("[adStore] update failed:", err);
    return null;
  }
}

export async function deleteAd(id: string): Promise<boolean> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("ads").delete().eq("id", id);
    if (error) {
      console.warn("[adStore] supabase delete failed:", error.message);
      return false;
    }
    return true;
  }
  try {
    const ads = await readAdsFromFile();
    const next = ads.filter((a) => a.id !== id);
    if (next.length === ads.length) return false;
    await fs.writeFile(STORE_FILE, JSON.stringify(next, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("[adStore] delete failed:", err);
    return false;
  }
}
