import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Ad, AdPlacement } from "@/types";
import { sampleAds } from "@/data/sampleAds";

const STORE_FILE = path.join(process.cwd(), ".data", "ads.json");

async function ensureStore() {
  const dir = path.dirname(STORE_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, "[]", "utf-8");
  }
}

export async function readAds(): Promise<Ad[]> {
  try {
    await ensureStore();
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Ad[];
    if (parsed.length === 0) return sampleAds;
    return parsed;
  } catch (err) {
    console.warn(
      "[adStore] read failed (likely read-only fs). Falling back to samples:",
      err instanceof Error ? err.message : err
    );
    return sampleAds;
  }
}

export async function getActiveAds(placement: AdPlacement): Promise<Ad[]> {
  const all = await readAds();
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
    console.warn(
      "[adStore] write failed (likely read-only fs). Ad NOT persisted:",
      err instanceof Error ? err.message : err
    );
  }
  return ad;
}

export async function updateAd(
  id: string,
  patch: Partial<Ad>
): Promise<Ad | null> {
  try {
    const ads = await readAds();
    const idx = ads.findIndex((a) => a.id === id);
    if (idx < 0) return null;
    ads[idx] = { ...ads[idx], ...patch };
    await fs.writeFile(STORE_FILE, JSON.stringify(ads, null, 2), "utf-8");
    return ads[idx];
  } catch (err) {
    console.warn(
      "[adStore] update failed:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

export async function deleteAd(id: string): Promise<boolean> {
  try {
    const ads = await readAds();
    const next = ads.filter((a) => a.id !== id);
    if (next.length === ads.length) return false;
    await fs.writeFile(STORE_FILE, JSON.stringify(next, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn(
      "[adStore] delete failed:",
      err instanceof Error ? err.message : err
    );
    return false;
  }
}
