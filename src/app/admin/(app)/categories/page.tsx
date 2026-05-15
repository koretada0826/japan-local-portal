import { getMainCategories, getSubCategories } from "@/data/categories";

export default function AdminCategoriesPage() {
  const mains = getMainCategories();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">カテゴリ管理</h1>
        <p className="text-sm text-muted mt-1">
          大カテゴリと中カテゴリの一覧。今後の実装で追加・編集・削除に対応予定。
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {mains.map((m) => {
          const subs = getSubCategories(m.slug);
          return (
            <div
              key={m.slug}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <h2 className="font-bold">
                {m.name}{" "}
                <span className="text-xs text-muted ml-1">{m.slug}</span>
              </h2>
              <p className="text-xs text-muted mt-1">{m.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {subs.map((s) => (
                  <span
                    key={s.slug}
                    className="text-xs px-2 py-1 rounded-full bg-surface-soft border border-border"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
