import type { Ad } from "@/types";

function isSafeAdUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * アフィリエイト風広告カード（正方形）
 * - PRラベル + ホットフック（赤バッジ）+ 広告主名 + 太字タイトル + CTAボタン
 * - 必ず rel="nofollow noopener noreferrer sponsored" を付与
 */
export function AdCard({
  ad,
  compact = false,
}: {
  ad: Ad;
  compact?: boolean;
}) {
  if (!isSafeAdUrl(ad.linkUrl) || !isSafeAdUrl(ad.imageUrl)) return null;

  return (
    <a
      href={ad.linkUrl}
      target="_blank"
      rel="nofollow noopener noreferrer sponsored"
      aria-label={`広告: ${ad.title}`}
      className="group block relative overflow-hidden rounded-lg bg-white border border-border hover:border-brand transition-colors shadow-sm"
    >
      <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/65 text-white tracking-wider">
        広告
      </span>
      <div className="relative aspect-square bg-surface-soft overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.imageUrl}
          alt={ad.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div className="absolute inset-x-2 bottom-2">
          <div className="text-[9px] font-bold text-white/90 tracking-wider uppercase line-clamp-1">
            {ad.sponsorName ?? "Sponsored"}
          </div>
        </div>
      </div>
      <div className={compact ? "p-2" : "p-2.5"}>
        <div className="text-[11px] font-bold text-foreground line-clamp-2 leading-snug min-h-[2.4em]">
          {ad.title}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-1">
          <span className="text-[9px] text-muted-soft">提供：{ad.sponsorName ?? "Sponsored"}</span>
          <span className="text-[10px] font-bold text-brand group-hover:underline shrink-0">
            公式 →
          </span>
        </div>
      </div>
    </a>
  );
}
