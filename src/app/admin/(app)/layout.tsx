import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "管理画面",
  robots: { index: false, follow: false },
};

const adminNav = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/businesses", label: "店舗管理" },
  { href: "/admin/leads", label: "リード管理" },
  { href: "/admin/categories", label: "カテゴリ管理" },
  { href: "/admin/regions", label: "地域管理" },
];

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-surface-soft -mx-1 md:-mx-2">
      <div className="bg-foreground text-white">
        <div className="container-main flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-white">
              まちセレクト 管理画面
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              {adminNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-white/80 hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="text-xs text-white/70 hover:text-white"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>

      <div className="md:hidden border-b border-border bg-white overflow-x-auto">
        <div className="container-main flex gap-3 py-2 text-xs whitespace-nowrap">
          {adminNav.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted hover:text-brand">
              {n.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-main py-6 md:py-10">{children}</div>
    </div>
  );
}
