import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

const footerSections = [
  {
    title: "サービス",
    links: [
      { href: "/areas", label: "地域から探す" },
      { href: "/categories", label: "業種から探す" },
      { href: "/articles", label: "おすすめ記事" },
    ],
  },
  {
    title: "事業者の方へ",
    links: [
      { href: "/free-listing", label: "無料掲載について" },
      { href: "/free-listing/apply", label: "無料掲載申請" },
      { href: "/for-business", label: "事業者向けサービス" },
    ],
  },
  {
    title: "運営",
    links: [
      { href: "/about", label: "運営者情報" },
      { href: "/contact", label: "お問い合わせ" },
      { href: "/privacy", label: "プライバシーポリシー" },
      { href: "/terms", label: "利用規約" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="font-bold text-lg">{SITE_CONFIG.name}</div>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              全国のお店・会社・施設を、地域とジャンルから探せる総合ポータルサイト。
            </p>
          </div>

          {footerSections.map((s) => (
            <div key={s.title}>
              <div className="font-semibold text-sm mb-3">{s.title}</div>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border text-xs text-muted-soft text-center">
          © {new Date().getFullYear()} {SITE_CONFIG.company}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
