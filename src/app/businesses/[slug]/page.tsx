import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  ExternalLink,
  CheckCircle2,
  Wallet,
  Share2,
} from "lucide-react";
import { Breadcrumb, breadcrumbJsonLd } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { OwnerCTA } from "@/components/OwnerCTA";
import { findBusiness, businesses, filterBusinesses } from "@/data/businesses";
import { findRegion } from "@/data/regions";
import { findCategory, findCategoryByParent } from "@/data/categories";
import { SITE_CONFIG } from "@/lib/config";

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { slug } = await props.params;
  const b = findBusiness(slug);
  if (!b) return {};
  return {
    title: `${b.name}｜${b.address}`,
    description: b.shortDescription,
    alternates: {
      canonical: `${SITE_CONFIG.url}/businesses/${b.slug}`,
    },
    openGraph: {
      title: b.name,
      description: b.shortDescription,
      images: [b.mainImageUrl],
    },
  };
}

export async function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

export default async function BusinessDetailPage(props: { params: Params }) {
  const { slug } = await props.params;
  const b = findBusiness(slug);
  if (!b) notFound();

  const prefRegion = findRegion(b.prefectureSlug);
  const cityRegion = findRegion(b.citySlug);
  const areaRegion = findRegion(b.areaSlug);
  const mainCat = findCategory(b.mainCategorySlug);
  const subCat = findCategoryByParent(b.subCategorySlug, b.mainCategorySlug);

  const related = filterBusinesses({
    mainCategorySlug: b.mainCategorySlug,
    subCategorySlug: b.subCategorySlug,
  }).filter((x) => x.id !== b.id).slice(0, 3);

  const nearby = filterBusinesses({
    prefectureSlug: b.prefectureSlug,
    citySlug: b.citySlug,
    areaSlug: b.areaSlug,
  }).filter((x) => x.id !== b.id).slice(0, 3);

  const crumbs = [
    { href: "/", label: "ホーム" },
    ...(prefRegion
      ? [{ href: `/areas/${prefRegion.slug}`, label: prefRegion.name }]
      : []),
    ...(prefRegion && cityRegion
      ? [
          {
            href: `/areas/${prefRegion.slug}/${cityRegion.slug}`,
            label: cityRegion.name,
          },
        ]
      : []),
    ...(prefRegion && cityRegion && areaRegion
      ? [
          {
            href: `/areas/${prefRegion.slug}/${cityRegion.slug}/${areaRegion.slug}`,
            label: areaRegion.name,
          },
        ]
      : []),
    { label: b.name },
  ];

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: b.name,
    description: b.description,
    image: b.mainImageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressCountry: "JP",
    },
    ...(b.phone ? { telephone: b.phone } : {}),
    ...(b.websiteUrl ? { url: b.websiteUrl } : {}),
    ...(b.priceRange ? { priceRange: b.priceRange } : {}),
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />

      <Breadcrumb items={crumbs} />

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        {mainCat && (
          <Link
            href={`/categories/${mainCat.slug}`}
            className="px-2 py-0.5 rounded-full bg-brand-soft text-brand"
          >
            {mainCat.name}
          </Link>
        )}
        {subCat && mainCat && (
          <Link
            href={`/categories/${mainCat.slug}/${subCat.slug}`}
            className="px-2 py-0.5 rounded-full bg-surface-soft border border-border"
          >
            {subCat.name}
          </Link>
        )}
        {areaRegion && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            {areaRegion.name}
          </span>
        )}
      </div>

      <h1 className="mt-3 text-2xl md:text-3xl font-bold">{b.name}</h1>
      <p className="mt-2 text-sm text-muted">{b.shortDescription}</p>

      <div className="mt-6 relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-soft">
        <Image
          src={b.mainImageUrl}
          alt={b.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1180px"
          className="object-cover"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* 基本情報 */}
          <section className="bg-white rounded-2xl border border-border p-5 md:p-6">
            <SectionHeader title="基本情報" />
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
              <Info label="住所" value={b.address} icon={<MapPin size={16} />} />
              {b.phone && (
                <Info label="電話" value={b.phone} icon={<Phone size={16} />} />
              )}
              {b.businessHours && (
                <Info
                  label="営業時間"
                  value={b.businessHours}
                  icon={<Clock size={16} />}
                />
              )}
              {b.regularHoliday && (
                <Info label="定休日" value={b.regularHoliday} />
              )}
              {b.priceRange && (
                <Info
                  label="料金目安"
                  value={b.priceRange}
                  icon={<Wallet size={16} />}
                />
              )}
            </dl>

            <div className="mt-5 flex flex-wrap gap-3">
              {b.websiteUrl && (
                <CtaBtn
                  href={b.websiteUrl}
                  icon={<Globe size={14} />}
                  label="公式サイト"
                  external
                />
              )}
              {b.googleMapUrl && (
                <CtaBtn
                  href={b.googleMapUrl}
                  icon={<MapPin size={14} />}
                  label="Googleマップ"
                  external
                />
              )}
              {b.instagramUrl && (
                <CtaBtn
                  href={b.instagramUrl}
                  icon={<Share2 size={14} />}
                  label="Instagram"
                  external
                />
              )}
            </div>
          </section>

          {/* 紹介文 */}
          <section>
            <SectionHeader title="紹介" />
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {b.description}
            </p>
          </section>

          {/* おすすめポイント */}
          {b.recommendPoints.length > 0 && (
            <section>
              <SectionHeader title="おすすめポイント" />
              <ul className="space-y-2 text-sm">
                {b.recommendPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-brand mt-0.5 shrink-0"
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 特徴 */}
          {b.features.length > 0 && (
            <section>
              <SectionHeader title="特徴" />
              <div className="flex flex-wrap gap-2">
                {b.features.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 rounded-full bg-brand-soft text-brand text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* サービス */}
          {b.services && b.services.length > 0 && (
            <section>
              <SectionHeader title="メニュー・サービス" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {b.services.map((s) => (
                  <div
                    key={s}
                    className="px-3 py-2 bg-white rounded-xl border border-border"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <OwnerCTA businessId={b.id} />
        </aside>
      </div>

      {(related.length > 0 || nearby.length > 0) && (
        <section className="mt-14 space-y-10">
          {related.length > 0 && (
            <div>
              <SectionHeader title="同じカテゴリのおすすめ" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {related.map((r) => (
                  <BusinessCard key={r.id} business={r} />
                ))}
              </div>
            </div>
          )}
          {nearby.length > 0 && (
            <div>
              <SectionHeader title="同じ地域のおすすめ" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {nearby.map((r) => (
                  <BusinessCard key={r.id} business={r} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-muted-soft">{label}</dt>
      <dd className="mt-1 flex items-start gap-1.5 text-foreground">
        {icon && <span className="text-muted mt-0.5">{icon}</span>}
        <span>{value}</span>
      </dd>
    </div>
  );
}

function CtaBtn({
  href,
  icon,
  label,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-sm hover:border-brand hover:text-brand"
    >
      {icon}
      {label}
      {external && <ExternalLink size={12} />}
    </a>
  );
}
