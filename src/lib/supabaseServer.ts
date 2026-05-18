import { createClient } from "@supabase/supabase-js";

/**
 * サーバーサイド専用 Supabase クライアント
 * - service_role キーを使うのでブラウザに絶対渡さない
 * - RLS をバイパスして管理画面操作・書き込み等を行う
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const isSupabaseAvailable = Boolean(url && serviceKey);
