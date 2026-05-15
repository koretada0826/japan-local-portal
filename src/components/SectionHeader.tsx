import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeader({
  title,
  description,
  href,
  hrefLabel = "もっと見る",
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-0.5 text-sm text-brand font-semibold hover:text-brand-hover whitespace-nowrap"
        >
          {hrefLabel}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
