import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FreeListingForm } from "@/components/forms/FreeListingForm";

export const metadata: Metadata = {
  title: "無料掲載申請フォーム",
  description:
    "店舗・会社・施設の無料掲載申請フォームです。所要時間3〜5分。掲載内容と担当者情報をご入力ください。",
  robots: { index: false, follow: false },
};

export default function FreeListingApplyPage() {
  return (
    <div className="container-main py-8 md:py-12 max-w-4xl">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/free-listing", label: "無料掲載募集" },
          { label: "申請フォーム" },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">
        無料掲載申請フォーム
      </h1>
      <p className="mt-2 text-sm text-muted">
        所要時間：3〜5分。ご入力いただいた情報は掲載準備および確認のためにのみ使用します。
      </p>

      <div className="mt-8">
        <FreeListingForm />
      </div>
    </div>
  );
}
