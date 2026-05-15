import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getAdminPassword,
  getAdminUser,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export const metadata: Metadata = {
  title: "管理画面ログイン",
  robots: { index: false, follow: false },
};

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

async function loginAction(formData: FormData) {
  "use server";

  // ブルートフォース対策：同一IPから15分5回失敗でブロック
  const ip = await getClientIp();
  const rl = rateLimit(`login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
  if (!rl.ok) {
    redirect("/admin/login?error=locked");
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (username === getAdminUser() && password === getAdminPassword()) {
    await setAdminSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin");
  const { error } = await props.searchParams;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-surface-soft">
      <form
        action={loginAction}
        className="bg-white border border-border rounded-2xl shadow-sm w-full max-w-sm p-7"
      >
        <h1 className="text-xl font-bold">管理画面ログイン</h1>
        <p className="text-xs text-muted mt-1">
          まちセレクト 運営担当者向けログイン
        </p>

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="text-sm font-semibold">ユーザー名</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">パスワード</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </label>
        </div>

        {error === "locked" && (
          <p className="mt-3 text-xs text-accent">
            連続失敗のため、15分間ログイン試行を停止しました。時間をおいて再度お試しください。
          </p>
        )}
        {error === "1" && (
          <p className="mt-3 text-xs text-accent">
            ユーザー名またはパスワードが正しくありません。
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover"
        >
          ログイン
        </button>

        <p className="mt-4 text-[11px] text-muted-soft leading-relaxed">
          初期値: admin / machi2026（環境変数 ADMIN_USERNAME / ADMIN_PASSWORD で変更可能）
        </p>
      </form>
    </div>
  );
}
