import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FreeListingBanner } from "@/components/OwnerCTA";
import { findRegion } from "@/data/regions";
import { filterBusinesses } from "@/data/businesses";
import { getMainCategories, getSubCategories } from "@/data/categories";

type Params = Promise<{ pref: string; city: string; area: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { pref, city, area } = await props.params;
  const a = findRegion(area);
  const c = findRegion(city);
  const p = findRegion(pref);
  if (!a || !c || !p) return {};
  return {
    title: `${a.name}のおすすめのお店・会社・施設`,
    description: `${a.name}（${p.name}${c.name}）でおすすめのお店・会社・施設をまとめました。業種別に絞り込んでご覧いただけます。`,
  };
}

export default async function AreaPage(props: { params: Params }) {
  const { pref, city, area } = await props.params;
  const prefRegion = findRegion(pref);
  const cityRegion = findRegion(city);
  const areaRegion = findRegion(area);
  if (!prefRegion || !cityRegion || !areaRegion) notFound();

  const businesses = filterBusinesses({
    prefectureSlug: pref,
    citySlug: city,
    areaSlug: area,
  });

  const mains = getMainCategories();

  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/areas", label: "地域から探す" },
          { href: `/areas/${prefRegion.slug}`, label: prefRegion.name },
          {
            href: `/areas/${prefRegion.slug}/${cityRegion.slug}`,
            label: cityRegion.name,
          },
          { label: areaRegion.name },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">
        {areaRegion.name}のおすすめのお店・会社・施設
      </h1>
      <p className="mt-3 text-sm text-muted leading-relaxed max-w-3xl">
        {areaRegion.name}（{prefRegion.name}{cityRegion.name}）でおすすめのお店・会社・施設をまとめました。業種別に絞り込んでご覧いただけます。
      </p>

      <section className="mt-8">
        <SectionHeader title="業種から絞り込む" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mains.map((m) => {
            const subs = getSubCategories(m.slug);
            const firstSub = subs[0];
            if (!firstSub) return null;
            return (
              <Link
                key={m.slug}
                href={`/areas/${pref}/${city}/${area}/categories/${m.slug}/${firstSub.slug}`}
                className="card-hover bg-white rounded-2xl border border-border p-4 text-sm font-semibold hover:text-brand"
              >
                {m.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title={`${areaRegion.name}の掲載店舗`} />
        {businesses.length === 0 ? (
          <p className="text-sm text-muted-soft">
            このエリアの掲載店舗はまだありません。
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
