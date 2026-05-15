import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { findCategory, getSubCategories } from "@/data/categories";
import { filterBusinesses } from "@/data/businesses";

type Params = Promise<{ main: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { main } = await props.params;
  const cat = findCategory(main);
  if (!cat || cat.level !== "main") return {};
  return {
    title: `${cat.name}の店舗・会社・施設一覧`,
    description: `${cat.name}の中カテゴリ一覧と、全国の${cat.name}を探せるページです。${cat.description ?? ""}`,
  };
}

export default async function MainCategoryPage(props: { params: Params }) {
  const { main } = await props.params;
  const cat = findCategory(main);
  if (!cat || cat.level !== "main") notFound();

  const subs = getSubCategories(cat.slug);
  const businesses = filterBusinesses({ mainCategorySlug: cat.slug }).slice(0, 12);

  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/categories", label: "業種から探す" },
          { label: cat.name },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">{cat.name}</h1>
      {cat.description && (
        <p className="mt-2 text-sm text-muted">{cat.description}</p>
      )}

      <section className="mt-8">
        <SectionHeader title="中カテゴリ一覧" />
        <div className="flex flex-wrap gap-2">
          {subs.map((s) => (
            <Link
              key={s.slug}
              href={`/categories/${cat.slug}/${s.slug}`}
              className="px-3 py-1.5 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          title={`${cat.name}の人気店舗・企業`}
          description={`全国の${cat.name}カテゴリから注目の事業者をピックアップ。`}
        />
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
    </div>
  );
}
