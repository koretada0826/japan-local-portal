import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag } from "lucide-react";
import type { Business } from "@/types";
import { findCategoryByParent } from "@/data/categories";
import { findRegion } from "@/data/regions";

export function BusinessCard({ business }: { business: Business }) {
  const sub = findCategoryByParent(
    business.subCategorySlug,
    business.mainCategorySlug
  );
  const area = findRegion(business.areaSlug);

  return (
    <Link
      href={`/businesses/${business.slug}`}
      className="card-hover block bg-white rounded-2xl border border-border overflow-hidden"
    >
      <div className="relative aspect-[16/10] bg-surface-soft">
        <Image
          src={business.mainImageUrl}
          alt={business.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {business.isPremium && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-accent text-white shadow">
            PR
          </span>
        )}
      </div>
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          {sub && (
            <span className="inline-flex items-center gap-1">
              <Tag size={12} />
              {sub.name}
            </span>
          )}
          {area && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              {area.name}
            </span>
          )}
        </div>
        <h3 className="mt-2 font-bold text-base text-foreground line-clamp-1">
          {business.name}
        </h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">
          {business.shortDescription}
        </p>
        {business.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {business.features.slice(0, 4).map((f) => (
              <span
                key={f}
                className="text-[11px] px-2 py-0.5 rounded-full bg-brand-soft text-brand"
              >
                {f}
              </span>
            ))}
          </div>
        )}
        {business.priceRange && (
          <div className="mt-3 text-sm text-foreground">
            <span className="text-muted text-xs">料金目安: </span>
            {business.priceRange}
          </div>
        )}
      </div>
    </Link>
  );
}
