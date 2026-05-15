import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ClaimBusinessForm } from "@/components/forms/ClaimBusinessForm";
import { businesses } from "@/data/businesses";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: "掲載情報の確認・修正",
  description: "店舗・企業の掲載情報の確認・修正フォームです。",
  robots: { index: false, follow: false },
};

export default async function ClaimBusinessPage(props: { params: Params }) {
  const { id } = await props.params;
  const business = businesses.find((b) => b.id === id);
  if (!business) notFound();

  return (
    <div className="container-main py-8 md:py-12 max-w-4xl">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          {
            href: `/businesses/${business.slug}`,
            label: business.name,
          },
          { label: "掲載情報の確認・修正" },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">
        掲載情報の確認・修正
      </h1>
      <p className="mt-3 text-sm text-muted leading-relaxed">
        掲載内容に誤りがある場合や、写真・紹介文・公式リンクを追加したい場合は、こちらのフォームから無料で申請できます。
      </p>

      <div className="mt-8">
        <ClaimBusinessForm
          businessId={business.id}
          businessName={business.name}
        />
      </div>
    </div>
  );
}
