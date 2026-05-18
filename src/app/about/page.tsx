import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "運営者情報",
};

export default function AboutPage() {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl">
      <Breadcrumb
        items={[{ href: "/", label: "ホーム" }, { label: "運営者情報" }]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">運営者情報</h1>
      <div className="mt-6 bg-white rounded-2xl border border-border p-5 md:p-7 text-sm">
        <dl className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-y-3">
          <dt className="text-muted">サイト名</dt>
          <dd className="font-semibold">{SITE_CONFIG.name}</dd>
          <dt className="text-muted">運営会社</dt>
          <dd className="font-semibold">{SITE_CONFIG.company}</dd>
          <dt className="text-muted">サービス内容</dt>
          <dd>
            全国のお店・会社・施設を、地域とジャンルから探せる総合ポータルサイト
          </dd>
          <dt className="text-muted">連絡先</dt>
          <dd>{SITE_CONFIG.email}</dd>
        </dl>
      </div>
    </div>
  );
}
