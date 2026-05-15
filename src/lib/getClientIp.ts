import { headers } from "next/headers";

/**
 * リクエストの送信元IPを抽出する。
 * Vercel/プロキシ経由なら x-forwarded-for の先頭値、
 * 直接接続なら x-real-ip。fallbackは "unknown"。
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = h.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

export async function getClientIpFromRequest(req: Request): Promise<string> {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}
