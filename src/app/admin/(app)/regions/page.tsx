import {
  getPrefectures,
  getCitiesByPref,
  getAreasByCity,
  regions,
} from "@/data/regions";

export default function AdminRegionsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">地域管理</h1>
        <p className="text-sm text-muted mt-1">
          地方・都道府県・市区町村・駅エリアの一覧。今後の実装で追加・編集に対応予定。
        </p>
      </header>

      <div className="text-xs text-muted">
        登録総数: {regions.length} 件
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {getPrefectures().map((p) => {
          const cities = getCitiesByPref(p.slug);
          return (
            <div
              key={p.slug}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <h2 className="font-bold">
                {p.name}{" "}
                <span className="text-xs text-muted ml-1">{p.slug}</span>
              </h2>
              <div className="mt-2 text-sm">
                {cities.map((c) => {
                  const areas = getAreasByCity(c.slug);
                  return (
                    <div key={c.slug} className="mt-2">
                      <div className="font-semibold">{c.name}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {areas.map((a) => (
                          <span
                            key={a.slug}
                            className="text-xs px-2 py-0.5 rounded-full bg-surface-soft border border-border"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
