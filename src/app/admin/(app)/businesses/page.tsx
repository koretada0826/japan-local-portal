import Link from "next/link";
import { businesses } from "@/data/businesses";
import { findRegion } from "@/data/regions";
import { findCategory, findCategoryByParent } from "@/data/categories";

export default function AdminBusinessesPage() {
  return (
    <div>
      <header className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">店舗管理</h1>
          <p className="text-sm text-muted mt-1">
            掲載中の店舗・会社・施設の一覧。ダミーデータをご覧いただけます。
          </p>
        </div>
        <div className="text-xs text-muted-soft">
          全 {businesses.length} 件
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-soft text-xs uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-3">店舗名</th>
              <th className="text-left px-4 py-3">カテゴリ</th>
              <th className="text-left px-4 py-3">地域</th>
              <th className="text-left px-4 py-3">状態</th>
              <th className="text-left px-4 py-3">フラグ</th>
              <th className="text-right px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {businesses.map((b) => {
              const main = findCategory(b.mainCategorySlug);
              const sub = findCategoryByParent(
                b.subCategorySlug,
                b.mainCategorySlug
              );
              const area = findRegion(b.areaSlug);
              return (
                <tr key={b.id} className="hover:bg-surface-soft">
                  <td className="px-4 py-3 font-semibold">
                    <Link
                      href={`/businesses/${b.slug}`}
                      className="hover:text-brand"
                    >
                      {b.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {main?.name} / {sub?.name}
                  </td>
                  <td className="px-4 py-3 text-muted">{area?.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand text-xs">
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap text-[11px]">
                      {b.isFeatured && (
                        <span className="px-1.5 py-0.5 bg-brand text-white rounded">
                          おすすめ
                        </span>
                      )}
                      {b.isPaid && (
                        <span className="px-1.5 py-0.5 bg-accent text-white rounded">
                          有料
                        </span>
                      )}
                      {b.isClaimed && (
                        <span className="px-1.5 py-0.5 bg-foreground text-white rounded">
                          認証済
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/businesses/${b.slug}`}
                      className="text-xs text-brand hover:text-brand-hover"
                    >
                      表示
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-soft">
        ※ 編集・削除・CSVインポート機能は今後の実装対象です。現在はダミーデータの閲覧のみ可能です。
      </p>
    </div>
  );
}
