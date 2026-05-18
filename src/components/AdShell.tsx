import { getActiveAds } from "@/lib/adStore";
import { AdCard } from "./AdCard";

/**
 * 広告レイアウトシェル
 * - PC (≥1280px): [左広告列 | コンテンツ | 右広告列] の3カラム構造
 * - それ未満: コンテンツ上部にコンパクトなグリッド表示（モバイルでも見える）
 */
export async function AdShell({ children }: { children: React.ReactNode }) {
  const [leftAds, rightAds] = await Promise.all([
    getActiveAds("sidebar_left"),
    getActiveAds("sidebar_right"),
  ]);

  const showLeft = leftAds.length > 0;
  const showRight = rightAds.length > 0;
  const mobileBottomAds = [...leftAds.slice(0, 2), ...rightAds.slice(0, 2)];

  return (
    <div className="flex-1 flex flex-col">
      {/* PC (≥1280px): 3カラム ─ 左広告列 / コンテンツ / 右広告列 */}
      <div className="flex-1 mx-auto w-full max-w-[1640px] xl:flex xl:gap-5 xl:px-4">
        {showLeft && (
          <aside
            aria-label="左サイド広告"
            className="hidden xl:block xl:w-[160px] 2xl:w-[180px] shrink-0 pt-6 pb-10"
          >
            <div className="sticky top-20 space-y-3">
              <div className="text-[10px] text-muted-soft uppercase tracking-wider font-bold pl-0.5">
                広告 / Sponsored
              </div>
              {leftAds.slice(0, 4).map((ad) => (
                <AdCard key={`l-${ad.id}`} ad={ad} />
              ))}
              <div className="text-[9px] text-muted-soft pl-0.5 leading-snug">
                ※ 表示は広告です。クリック先は各広告主の運営する外部サイトです。
              </div>
            </div>
          </aside>
        )}

        <main className="flex-1 min-w-0">{children}</main>

        {showRight && (
          <aside
            aria-label="右サイド広告"
            className="hidden xl:block xl:w-[160px] 2xl:w-[180px] shrink-0 pt-6 pb-10"
          >
            <div className="sticky top-20 space-y-3">
              <div className="text-[10px] text-muted-soft uppercase tracking-wider font-bold pl-0.5">
                広告 / Sponsored
              </div>
              {rightAds.slice(0, 4).map((ad) => (
                <AdCard key={`r-${ad.id}`} ad={ad} />
              ))}
              <div className="text-[9px] text-muted-soft pl-0.5 leading-snug">
                ※ 表示は広告です。クリック先は各広告主の運営する外部サイトです。
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* モバイル・タブレット (<1280px): コンテンツ閲覧後のフッター直前にだけ広告 */}
      {mobileBottomAds.length > 0 && (
        <section
          aria-label="広告"
          className="xl:hidden container-main pt-10 pb-6 border-t border-border mt-6"
        >
          <div className="text-[10px] text-muted-soft mb-2 uppercase tracking-wider font-bold text-center">
            広告 / Sponsored
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {mobileBottomAds.map((ad) => (
              <AdCard key={`m-${ad.id}`} ad={ad} compact />
            ))}
          </div>
          <p className="mt-3 text-[9px] text-muted-soft text-center leading-snug">
            ※ 表示は広告です。クリック先は各広告主の運営する外部サイトです。
          </p>
        </section>
      )}
    </div>
  );
}
