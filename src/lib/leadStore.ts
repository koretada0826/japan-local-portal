import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Lead } from "@/types";
import { sampleLeads } from "@/data/sampleLeads";

const STORE_FILE = path.join(process.cwd(), ".data", "leads.json");

async function ensureStore() {
  const dir = path.dirname(STORE_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, "[]", "utf-8");
  }
}

/**
 * ローカル(.data/leads.json)からリード一覧を読む。
 * Vercel等の読み取り専用FSでは読み込みに失敗するため、
 * フォールバックでサンプルリードを返す（管理画面のUIを見せるため）。
 */
export async function readLeads(): Promise<Lead[]> {
  try {
    await ensureStore();
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Lead[];
    if (parsed.length === 0) {
      // ローカル初回起動でファイルは空 → 開発用にサンプルを混ぜる
      return sampleLeads;
    }
    return parsed;
  } catch (err) {
    console.warn(
      "[leadStore] read failed (likely read-only fs). Falling back to samples:",
      err instanceof Error ? err.message : err
    );
    return sampleLeads;
  }
}

/**
 * リード追加。Vercel等の読み取り専用FSでは書き込みに失敗する。
 * その場合は警告ログを出して保存スキップ（API側でエラーは返さない）。
 */
export async function appendLead(
  data: Omit<Lead, "id" | "createdAt" | "salesStatus"> & {
    salesStatus?: Lead["salesStatus"];
  }
): Promise<Lead> {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    salesStatus: data.salesStatus ?? "untouched",
    ...data,
  };

  try {
    await ensureStore();
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const leads: Lead[] = (() => {
      try {
        return JSON.parse(raw) as Lead[];
      } catch {
        return [];
      }
    })();
    leads.unshift(lead);
    await fs.writeFile(STORE_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    // 本番Vercel等の読み取り専用環境。Supabase接続前提なのでログのみ。
    console.warn(
      "[leadStore] write failed (likely read-only fs). Lead NOT persisted:",
      err instanceof Error ? err.message : err,
      JSON.stringify(lead)
    );
  }

  return lead;
}

export async function updateLead(
  id: string,
  patch: Partial<Lead>
): Promise<Lead | null> {
  try {
    const leads = await readLeads();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx < 0) return null;
    leads[idx] = { ...leads[idx], ...patch };
    await fs.writeFile(STORE_FILE, JSON.stringify(leads, null, 2), "utf-8");
    return leads[idx];
  } catch (err) {
    console.warn(
      "[leadStore] update failed:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
