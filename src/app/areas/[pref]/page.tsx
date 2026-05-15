import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { findRegion, getCitiesByPref, getAreasByCity } from "@/data/regions";
import { filterBusinesses } from "@/data/businesses";

type Params = Promise<{ pref: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { pref } = await props.params;
  const r = findRegion(pref);
  if (!r || r.type !== "prefecture") return {};
  return {
    title: `${r.name}のお店・会社・施設一覧`,
    description: `${r.name}の市区町村・エリア別に、地域のお店・会社・施設を探せます。`,
  };
}

export default async function PrefPage(props: { params: Params }) {
  const { pref } = await props.params;
  const prefRegion = findRegion(pref);
  if (!prefRegion || prefRegion.type !== "prefecture") notFound();

  const cities = getCitiesByPref(prefRegion.slug);
  const businesses = filterBusinesses({ prefectureSlug: prefRegion.slug }).slice(0, 9);

  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/areas", label: "地域から探す" },
          { label: prefRegion.name },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">
        {prefRegion.name}のお店・会社・施設
      </h1>
      <p className="mt-2 text-sm text-muted">
        {prefRegion.name}の市区町村・エリアから、地域のお店・会社・施設を探せます。
      </p>

      <section className="mt-8">
        <SectionHeader title="市区町村から探す" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cities.map((c) => {
            const areas = getAreasByCity(c.slug);
            return (
              <div
                key={c.slug}
                className="bg-white rounded-2xl border border-border p-4"
              >
                <Link
                  href={`/areas/${prefRegion.slug}/${c.slug}`}
                  className="font-bold hover:text-brand"
                >
                  {c.name}
                </Link>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {areas.slice(0, 5).map((a) => (
                    <Link
                      key={a.slug}
                      href={`/areas/${prefRegion.slug}/${c.slug}/${a.slug}`}
                      className="text-xs px-2 py-1 rounded-full bg-surface-soft border border-border hover:border-brand hover:text-brand"
                    >
                      {a.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {businesses.length > 0 && (
        <section className="mt-12">
          <SectionHeader title={`${prefRegion.name}のおすすめ`} />
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
