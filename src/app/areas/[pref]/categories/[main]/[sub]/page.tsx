import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, breadcrumbJsonLd } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FAQ, faqJsonLd } from "@/components/FAQ";
import { FreeListingBanner } from "@/components/OwnerCTA";
import { findRegion, getCitiesByPref, getAreasByCity } from "@/data/regions";
import {
  findCategory,
  findCategoryByParent,
  getSubCategories,
} from "@/data/categories";
import { filterBusinesses } from "@/data/businesses";
import { SITE_CONFIG } from "@/lib/config";

type Params = Promise<{ pref: string; main: string; sub: string }>;

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { pref, main, sub } = await props.params;
  const prefRegion = findRegion(pref);
  const subCat = findCategoryByParent(sub, main);
  if (!prefRegion || !subCat) return {};

  const matches = filterBusinesses({
    prefectureSlug: pref,
    mainCategorySlug: main,
    subCategorySlug: sub,
  });

  const title = `${prefRegion.name}でおすすめの${subCat.name}【${CURRENT_YEAR}年最新】`;
  const description = `${prefRegion.name}全域で${subCat.name}をお探しの方向け。市区町村別の${subCat.name}を一覧比較。営業時間・料金目安・特徴・公式情報を確認できます。${CURRENT_YEAR}年最新版。`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/areas/${pref}/categories/${main}/${sub}`,
    },
    openGraph: { title, description, type: "website" },
    robots:
      matches.length === 0
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function PrefSubCategoryPage(props: {
  params: Params;
}) {
  const { pref, main, sub } = await props.params;
  const prefRegion = findRegion(pref);
  const mainCat = findCategory(main);
  const subCat = findCategoryByParent(sub, main);
  if (!prefRegion || prefRegion.type !== "prefecture" || !mainCat || !subCat)
    notFound();

  const businesses = filterBusinesses({
    prefectureSlug: pref,
    mainCategorySlug: main,
    subCategorySlug: sub,
  });

  const cities = getCitiesByPref(pref);
  const relatedSubs = getSubCategories(main)
    .filter((s) => s.slug !== sub)
    .slice(0, 10);

  const crumbs = [
    { href: "/", label: "ホーム" },
    { href: "/areas", label: "地域から探す" },
    { href: `/areas/${pref}`, label: prefRegion.name },
    { label: subCat.name },
  ];

  const faqs = [
    {
      q: `${prefRegion.name}で${subCat.name}を選ぶときのポイントは？`,
      a: `市区町村ごとに駅近・予約可・特徴などを比較するのがおすすめです。${SITE_CONFIG.name}では、${prefRegion.name}内のエリア別に${subCat.name}を比較できるので、ご自宅や勤務先からアクセスしやすい一軒が見つかります。`,
    },
    {
      q: `${prefRegion.name}で人気の${subCat.name}エリアは？`,
      a: `主要駅周辺や繁華街には${subCat.name}が集まる傾向があります。本ページ下部の市区町村リストから、ご希望のエリア別に絞り込めます。`,
    },
    {
      q: "掲載情報は正確ですか？",
      a: "掲載情報は公式サイトや公開情報をもとに作成し、事業者からの修正依頼を受け付けています。最新情報は公式サイトもあわせてご確認ください。",
    },
  ];

  const itemListLd =
    businesses.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${prefRegion.name}でおすすめの${subCat.name}`,
          numberOfItems: businesses.length,
          itemListElement: businesses.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_CONFIG.url}/businesses/${b.slug}`,
            name: b.name,
          })),
        }
      : null;

  return (
    <div className="container-main py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_CONFIG.url)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(faqs)),
        }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}

      <Breadcrumb items={crumbs} />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold leading-snug">
        {prefRegion.name}でおすすめの{subCat.name}
        <span className="block text-base font-semibold text-muted mt-1">
          【{CURRENT_YEAR}年最新】市区町村別に比較
        </span>
      </h1>
      <p className="mt-4 text-sm text-foreground leading-relaxed max-w-3xl">
        {prefRegion.name}全域で{subCat.name}を探している方に向けて、市区町村・駅エリア別に厳選した{subCat.name}をまとめました。料金目安・営業時間・特徴・公式情報を比較しながら、お住まいや勤務地に近い一軒を見つけてください。
      </p>

      <section className="mt-8">
        <SectionHeader
          title={`${prefRegion.name}の${subCat.name}一覧（${businesses.length}件）`}
        />
        {businesses.length === 0 ? (
          <div className="bg-surface-soft rounded-2xl border border-border p-8 text-center">
            <p className="text-sm text-muted">
              この都道府県×ジャンルでの掲載はまだありません。
            </p>
            <p className="text-xs text-muted-soft mt-2">
              掲載をご希望の事業者様は無料掲載申請からお問合せください。
            </p>
            <Link
              href="/free-listing/apply"
              className="mt-4 inline-flex px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold"
            >
              無料で掲載申請する
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </section>

      {cities.length > 0 && (
        <section className="mt-12">
          <SectionHeader
            title={`${prefRegion.name}内の市区町村から探す`}
            description={`市区町村別の${subCat.name}が表示されます`}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {cities.map((c) => {
              const areas = getAreasByCity(c.slug);
              const firstArea = areas[0];
              const href = firstArea
                ? `/areas/${pref}/${c.slug}/${firstArea.slug}/categories/${main}/${sub}`
                : `/areas/${pref}/${c.slug}`;
              return (
                <Link
                  key={c.slug}
                  href={href}
                  className="bg-white rounded-xl border border-border px-3 py-2 text-sm hover:border-brand hover:text-brand"
                >
                  {c.name}の{subCat.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-12">
        <SectionHeader title="よくある質問" />
        <FAQ items={faqs} />
      </section>

      <section className="mt-10">
        <SectionHeader title={`${prefRegion.name}の関連カテゴリ`} />
        <div className="flex flex-wrap gap-2">
          {relatedSubs.map((s) => (
            <Link
              key={s.slug}
              href={`/areas/${pref}/categories/${main}/${s.slug}`}
              className="px-3 py-1.5 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand"
            >
              {prefRegion.name}の{s.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <FreeListingBanner />
      </section>
    </div>
  );
}
