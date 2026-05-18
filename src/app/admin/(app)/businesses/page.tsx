import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { readAllBusinesses } from "@/lib/businessStore";
import { findRegion } from "@/data/regions";
import { findCategory, findCategoryByParent } from "@/data/categories";

export default async function AdminBusinessesPage() {
  const businesses = await readAllBusinesses();
  return (
    <div>
      <header className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">店舗管理</h1>
          <p className="text-sm text-muted mt-1">
            掲載中の店舗・会社・施設の一覧。「新規追加」から店舗を追加できます。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-soft">全 {businesses.length} 件</div>
          <Link
            href="/admin/businesses/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-hover"
          >
            <Plus size={14} />
            新規追加
          </Link>
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
              // UUID形式のIDは管理画面で編集可能（Supabase保存分）
              const isEditable = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(b.id);
              return (
                <tr key={b.id} className="hover:bg-surface-soft">
                  <td className="px-4 py-3 font-semibold">
                    <Link
                      href={`/businesses/${b.slug}`}
                      className="hover:text-brand"
                      target="_blank"
                    >
                      {b.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {main?.name ?? "—"} / {sub?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{area?.name ?? "—"}</td>
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
                      {b.isPremium && (
                        <span className="px-1.5 py-0.5 bg-foreground text-white rounded">
                          PR
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/businesses/${b.slug}`}
                      target="_blank"
                      className="text-xs text-brand hover:text-brand-hover mr-3"
                    >
                      表示
                    </Link>
                    {isEditable ? (
                      <Link
                        href={`/admin/businesses/${b.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs text-foreground hover:text-brand"
                      >
                        <Pencil size={12} />
                        編集
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-soft">サンプル</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-soft">
        ※ 「サンプル」はデモ用のデータです。「新規追加」で登録した店舗は編集・削除できます。
      </p>
    </div>
  );
}
