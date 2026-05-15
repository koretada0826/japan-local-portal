/**
 * シンプルなインメモリレート制限。
 * - 単一プロセス内でのみ有効（複数Lambdaインスタンスをまたぐと別カウント）
 * - 本格運用ではUpstash Redis / Vercel KV へ差し替え
 * - bot・人力ブルートフォース対策には十分機能する
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cur = store.get(key);

  if (!cur || cur.resetAt < now) {
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, fresh);
    return { ok: true, remaining: max - 1, resetAt: fresh.resetAt };
  }

  if (cur.count >= max) {
    return { ok: false, remaining: 0, resetAt: cur.resetAt };
  }

  cur.count += 1;
  return { ok: true, remaining: max - cur.count, resetAt: cur.resetAt };
}

// 周期的な掃除（メモリリーク防止）
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) {
      if (v.resetAt < now) store.delete(k);
    }
  }, CLEANUP_INTERVAL_MS).unref?.();
}
