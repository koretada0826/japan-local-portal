import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { findRegion, getAreasByCity } from "@/data/regions";
import { filterBusinesses } from "@/data/businesses";

type Params = Promise<{ pref: string; city: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { pref, city } = await props.params;
  const cityRegion = findRegion(city);
  const prefRegion = findRegion(pref);
  if (!cityRegion || !prefRegion) return {};
  return {
    title: `${prefRegion.name}${cityRegion.name}のお店・会社・施設一覧`,
    description: `${prefRegion.name}${cityRegion.name}のエリア別に、地域のお店・会社・施設を探せます。`,
  };
}

export default async function CityPage(props: { params: Params }) {
  const { pref, city } = await props.params;
  const prefRegion = findRegion(pref);
  const cityRegion = findRegion(city);
  if (!prefRegion || !cityRegion || cityRegion.parentSlug !== pref) notFound();

  const areas = getAreasByCity(city);
  const businesses = filterBusinesses({
    prefectureSlug: pref,
    citySlug: city,
  }).slice(0, 9);

  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/areas", label: "地域から探す" },
          { href: `/areas/${prefRegion.slug}`, label: prefRegion.name },
          { label: cityRegion.name },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">
        {prefRegion.name}{cityRegion.name}のお店・会社・施設
      </h1>

      {areas.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="駅・エリアから探す" />
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/areas/${prefRegion.slug}/${cityRegion.slug}/${a.slug}`}
                className="px-3 py-1.5 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {businesses.length > 0 && (
        <section className="mt-10">
          <SectionHeader title={`${cityRegion.name}のおすすめ`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
