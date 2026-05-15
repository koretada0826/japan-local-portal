import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, breadcrumbJsonLd } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FAQ, faqJsonLd } from "@/components/FAQ";
import { FreeListingBanner } from "@/components/OwnerCTA";
import { findRegion, getAreasByCity } from "@/data/regions";
import {
  findCategoryByParent,
  findCategory,
  getSubCategories,
} from "@/data/categories";
import { filterBusinesses } from "@/data/businesses";
import { SITE_CONFIG } from "@/lib/config";

type Params = Promise<{
  pref: string;
  city: string;
  area: string;
  main: string;
  sub: string;
}>;

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { pref, city, area, main, sub } = await props.params;
  const a = findRegion(area);
  const subCat = findCategoryByParent(sub, main);
  if (!a || !subCat) return {};

  const matches = filterBusinesses({
    prefectureSlug: pref,
    citySlug: city,
    areaSlug: area,
    mainCategorySlug: main,
    subCategorySlug: sub,
  });

  const title = `${a.name}でおすすめの${subCat.name}【${CURRENT_YEAR}年最新】`;
  const description = `${a.name}で${subCat.name}をお探しの方向けに、駅近・予約可・口コミなど目的別におすすめの${subCat.name}をまとめました。営業時間・料金目安・公式情報・特徴タグで横断比較できます。${CURRENT_YEAR}年最新の情報を掲載中。`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/areas/${pref}/${city}/${area}/categories/${main}/${sub}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    // thin pageはGoogleにインデックスさせない（薄い内容でSEOペナルティを受けないため）
    robots:
      matches.length === 0
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function AreaCategoryPage(props: { params: Params }) {
  const { pref, city, area, main, sub } = await props.params;
  const prefRegion = findRegion(pref);
  const cityRegion = findRegion(city);
  const areaRegion = findRegion(area);
  const mainCat = findCategory(main);
  const subCat = findCategoryByParent(sub, main);
  if (!prefRegion || !cityRegion || !areaRegion || !mainCat || !subCat)
    notFound();

  const businesses = filterBusinesses({
    prefectureSlug: pref,
    citySlug: city,
    areaSlug: area,
    mainCategorySlug: main,
    subCategorySlug: sub,
  });

  const cityWideBusinesses = filterBusinesses({
    prefectureSlug: pref,
    citySlug: city,
    mainCategorySlug: main,
    subCategorySlug: sub,
  }).filter((b) => b.areaSlug !== area);

  const prefWideBusinesses = filterBusinesses({
    prefectureSlug: pref,
    mainCategorySlug: main,
    subCategorySlug: sub,
  }).filter((b) => b.citySlug !== city);

  const relatedSubs = getSubCategories(main)
    .filter((s) => s.slug !== sub)
    .slice(0, 8);
  const nearbyAreas = getAreasByCity(city).filter((a) => a.slug !== area);

  const crumbs = [
    { href: "/", label: "ホーム" },
    { href: "/areas", label: "地域から探す" },
    { href: `/areas/${pref}`, label: prefRegion.name },
    { href: `/areas/${pref}/${city}`, label: cityRegion.name },
    { href: `/areas/${pref}/${city}/${area}`, label: areaRegion.name },
    { label: `${subCat.name}` },
  ];

  const faqs = [
    {
      q: `${areaRegion.name}で${subCat.name}を選ぶときのポイントは？`,
      a: `駅からの距離、営業時間、特徴、料金目安、公式情報の有無などを比較すると選びやすくなります。${SITE_CONFIG.name}では、各店舗の特徴やおすすめポイント、料金目安、公式リンクを横断比較できるので、ご希望に合う${subCat.name}を効率よく探せます。`,
    },
    {
      q: `${areaRegion.name}周辺で${subCat.name}を探すおすすめの方法は？`,
      a: `エリア×業種ページで一覧比較した後、気になる店舗の詳細ページから公式サイト・Googleマップで最新情報を確認するのがおすすめです。当サイトの店舗詳細には公式リンクも掲載しています。`,
    },
    {
      q: "掲載情報は正確ですか？",
      a: "掲載情報は公式サイトや公開情報をもとに作成し、事業者からの修正依頼を受け付けています。最新情報は公式サイトもあわせてご確認ください。",
    },
    {
      q: "店舗情報を修正できますか？",
      a: "店舗オーナー様・ご担当者様は無料で掲載情報の修正申請が可能です。各店舗詳細ページに「掲載内容を確認・修正する」ボタンがあります。",
    },
  ];

  // ItemList（SEO用）— Googleが「おすすめ◯◯選」を理解しやすくなる
  const itemListLd =
    businesses.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${areaRegion.name}でおすすめの${subCat.name}`,
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
        {areaRegion.name}でおすすめの{subCat.name}
        <span className="block text-base font-semibold text-muted mt-1">
          【{CURRENT_YEAR}年最新】駅近・予約可・特徴で比較
        </span>
      </h1>
      <p className="mt-4 text-sm text-foreground leading-relaxed max-w-3xl">
        {areaRegion.name}（{prefRegion.name}{cityRegion.name}）で
        {subCat.name}を探している方に向けて、駅近・予約可・口コミ・料金目安など、目的別に選びやすい店舗を厳選してまとめました。営業時間・特徴・料金・公式リンクを比較しながら、ご希望に合うお店・会社を効率よく見つけられます。{CURRENT_YEAR}年最新の掲載情報をご覧ください。
      </p>

      <section className="mt-8">
        <SectionHeader
          title={`${areaRegion.name}の${subCat.name}一覧（${businesses.length}件）`}
          description={
            businesses.length > 0
              ? `新着・おすすめの${subCat.name}を掲載しています`
              : ""
          }
        />
        {businesses.length === 0 ? (
          <div className="bg-surface-soft rounded-2xl border border-border p-8 text-center">
            <p className="text-sm text-muted">
              このエリア×ジャンルでの掲載はまだありません。
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

      {cityWideBusinesses.length > 0 && (
        <section className="mt-12">
          <SectionHeader
            title={`${cityRegion.name}全体の${subCat.name}`}
            description={`${areaRegion.name}周辺の掲載店舗もご覧いただけます`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cityWideBusinesses.slice(0, 6).map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </section>
      )}

      {prefWideBusinesses.length > 0 && (
        <section className="mt-12">
          <SectionHeader
            title={`${prefRegion.name}の${subCat.name}（広域）`}
            description={`${cityRegion.name}外の${prefRegion.name}内の店舗です`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {prefWideBusinesses.slice(0, 6).map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <SectionHeader title="このジャンルの選び方" />
        <div className="bg-white rounded-2xl border border-border p-5 md:p-7 text-sm text-foreground leading-relaxed">
          <p>
            {areaRegion.name}で{subCat.name}を選ぶ際は、以下のポイントを意識すると失敗しにくくなります。
          </p>
          <ul className="mt-4 list-disc list-inside text-muted space-y-1.5">
            <li>駅からのアクセス・徒歩分数</li>
            <li>営業時間・定休日があなたの生活と合うか</li>
            <li>料金目安と公式サイト・SNSの情報量</li>
            <li>特徴タグ（個室、予約可、駅近など）</li>
            <li>口コミや公式情報の更新頻度</li>
            <li>支払い方法（現金・クレジット・電子マネー対応）</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title="よくある質問" />
        <FAQ items={faqs} />
      </section>

      <section className="mt-12">
        <SectionHeader title="関連カテゴリ" />
        <div className="flex flex-wrap gap-2">
          {relatedSubs.map((s) => (
            <Link
              key={s.slug}
              href={`/areas/${pref}/${city}/${area}/categories/${main}/${s.slug}`}
              className="px-3 py-1.5 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {nearbyAreas.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="近隣エリアで探す" />
          <div className="flex flex-wrap gap-2">
            {nearbyAreas.map((a) => (
              <Link
                key={a.slug}
                href={`/areas/${pref}/${city}/${a.slug}/categories/${main}/${sub}`}
                className="px-3 py-1.5 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand"
              >
                {a.name}の{subCat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <SectionHeader title={`他の${prefRegion.name}内エリアで探す`} />
        <Link
          href={`/areas/${pref}/categories/${main}/${sub}`}
          className="inline-flex px-4 py-2 rounded-xl border border-border bg-white text-sm hover:border-brand hover:text-brand"
        >
          {prefRegion.name}全体の{subCat.name}を見る
        </Link>
      </section>

      <section className="mt-12">
        <FreeListingBanner />
      </section>
    </div>
  );
}
