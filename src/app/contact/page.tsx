import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "お問い合わせ",
};

export default function ContactPage() {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl">
      <Breadcrumb
        items={[{ href: "/", label: "ホーム" }, { label: "お問い合わせ" }]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">お問い合わせ</h1>
      <p className="mt-3 text-sm text-muted">
        サービスに関するご質問、掲載に関するお問い合わせは下記までご連絡ください。
      </p>
      <div className="mt-6 bg-white rounded-2xl border border-border p-5 md:p-7 text-sm">
        <p>
          <strong>連絡先メール:</strong>{" "}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-brand underline"
          >
            {SITE_CONFIG.email}
          </a>
        </p>
        <p className="mt-3 text-muted">
          ※ 掲載に関するご相談は
          <a href="/free-listing" className="text-brand underline">
            無料掲載募集ページ
          </a>
          もご覧ください。
        </p>
      </div>
    </div>
  );
}
