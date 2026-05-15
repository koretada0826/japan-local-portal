import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "machi_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8時間

// セッション署名鍵。本番は必ず ADMIN_SESSION_SECRET を環境変数で設定すること。
const SECRET =
  process.env.ADMIN_SESSION_SECRET ??
  "CHANGE_ME_machi_select_default_dev_secret_do_not_use_in_prod";

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function getAdminUser() {
  return process.env.ADMIN_USERNAME || "admin";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "machi2026";
}

/**
 * 管理画面ログイン中かを判定。
 * Cookie値: `${issuedAtMs}.${hmacBase64Url}` の形式。
 * HMAC検証 + 有効期限チェックを両方通過した場合のみ true。
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const dotIdx = raw.indexOf(".");
  if (dotIdx <= 0) return false;
  const ts = raw.slice(0, dotIdx);
  const sig = raw.slice(dotIdx + 1);
  if (!ts || !sig) return false;

  const expected = sign(`admin:${ts}`);
  if (!timingSafeEqual(sig, expected)) return false; // 改ざん検出

  const issuedAt = Number(ts);
  if (!Number.isFinite(issuedAt)) return false;
  const ageMs = Date.now() - issuedAt;
  if (ageMs < 0 || ageMs > MAX_AGE_SECONDS * 1000) return false; // 期限切れ

  return true;
}

export async function setAdminSession() {
  const c = await cookies();
  const ts = Date.now().toString();
  const sig = sign(`admin:${ts}`);
  const value = `${ts}.${sig}`;

  c.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
