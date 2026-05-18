import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin, isSupabaseAvailable } from "@/lib/supabaseServer";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIpFromRequest } from "@/lib/getClientIp";

// ─── セキュリティ設定 ───
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp"];
const BUCKET = "business-images";

// 同一IPから10分20アップロードまで
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const reqHost = req.headers.get("host");
    if (!reqHost) return false;
    return originHost === reqHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // CSRF対策
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  // レート制限
  const ip = await getClientIpFromRequest(request);
  const rl = rateLimit(`upload:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429 }
    );
  }

  // Supabase未接続なら使えないと返す
  if (!isSupabaseAvailable || !supabaseAdmin) {
    return NextResponse.json(
      { error: "storage_unavailable", message: "画像アップロード機能はSupabase接続後にご利用いただけます" },
      { status: 503 }
    );
  }

  // multipart/form-data 取り出し
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file_missing" }, { status: 400 });
  }

  // ファイルサイズチェック
  if (file.size === 0) {
    return NextResponse.json({ error: "empty_file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "file_too_large", limit: MAX_SIZE_BYTES },
      { status: 413 }
    );
  }

  // MIMEタイプチェック（信頼度低いが第一バリア）
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: "invalid_mime", allowed: ALLOWED_MIME },
      { status: 400 }
    );
  }

  // 拡張子チェック（second バリア）
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    return NextResponse.json(
      { error: "invalid_ext", allowed: ALLOWED_EXT },
      { status: 400 }
    );
  }

  // ファイル名はランダム生成（XSS対策・予測不能化）
  const safeExt = ext === "jpeg" ? "jpg" : ext;
  const objectKey = `lead-uploads/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${safeExt}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(objectKey, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadErr) {
      console.warn("[api/upload] storage error:", uploadErr.message);
      // バケット未作成エラーは設定不備として返す
      if (uploadErr.message.toLowerCase().includes("bucket")) {
        return NextResponse.json(
          {
            error: "bucket_not_found",
            message:
              "Storageバケット 'business-images' が未作成です。migration 0004を実行してください。",
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: "upload_failed", message: uploadErr.message },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(objectKey);

    return NextResponse.json({ ok: true, url: publicUrl.publicUrl });
  } catch (err) {
    console.warn("[api/upload] unexpected error:", err);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

// GET, PUT, DELETEを明示的に拒否
export async function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
