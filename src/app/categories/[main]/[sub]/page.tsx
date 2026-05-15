import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FreeListingBanner } from "@/components/OwnerCTA";
import { findCategoryByParent, findCategory } from "@/data/categories";
import { filterBusinesses } from "@/data/businesses";

type Params = Promise<{ main: string; sub: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { main, sub } = await props.params;
  const subCat = findCategoryByParent(sub, main);
  if (!subCat) return {};
  return {
    title: `${subCat.name}の店舗・会社一覧｜全国対応`,
    description: `全国の${subCat.name}を地域別にまとめたページです。営業時間や特徴、公式情報を比較してお探しください。`,
  };
}

export default async function SubCategoryPage(props: { params: Params }) {
  const { main, sub } = await props.params;
  const mainCat = findCategory(main);
  const subCat = findCategoryByParent(sub, main);
  if (!mainCat || !subCat) notFound();

  const businesses = filterBusinesses({
    mainCategorySlug: main,
    subCategorySlug: sub,
  });

  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/categories", label: "業種から探す" },
          { href: `/categories/${mainCat.slug}`, label: mainCat.name },
          { label: subCat.name },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">
        全国の{subCat.name}
      </h1>
      <p className="mt-3 text-sm text-muted leading-relaxed max-w-3xl">
        全国の{subCat.name}を地域別に探せるページです。営業時間や特徴、公式情報を比較しながら、ご希望に合うお店・会社を見つけてください。
      </p>

      <section className="mt-8">
        <SectionHeader title={`${subCat.name}の掲載一覧`} />
        {businesses.length === 0 ? (
          <p className="text-sm text-muted-soft">
            このカテゴリの掲載店舗はまだありません。
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <FreeListingBanner />
      </section>
    </div>
  );
}
