import Link from "next/link";
import { readLeads } from "@/lib/leadStore";
import { businesses } from "@/data/businesses";

export default async function AdminDashboardPage() {
  const leads = await readLeads();
  const total = businesses.length;
  const published = businesses.filter((b) => b.status === "published").length;
  const featured = businesses.filter((b) => b.isFeatured).length;

  const untouched = leads.filter((l) => l.salesStatus === "untouched").length;
  const won = leads.filter((l) => l.salesStatus === "won").length;
  const lost = leads.filter((l) => l.salesStatus === "lost").length;

  const interestCount = (key: string) =>
    leads.filter((l) => l.interestedServices.includes(key as never)).length;

  const thisMonth = (type: string) =>
    leads.filter(
      (l) =>
        l.leadType === type &&
        new Date(l.createdAt).getMonth() === new Date().getMonth() &&
        new Date(l.createdAt).getFullYear() === new Date().getFullYear()
    ).length;

  const stats = [
    { label: "総掲載店舗数", value: total },
    { label: "公開中", value: published },
    { label: "おすすめ表示", value: featured },
    { label: "総リード数", value: leads.length },
    { label: "未対応リード", value: untouched, accent: true },
    { label: "受注件数", value: won },
    { label: "失注件数", value: lost },
    { label: "今月の掲載申請", value: thisMonth("free_listing_application") },
    { label: "今月の掲載確認", value: thisMonth("claim_business") },
    { label: "HP制作に興味あり", value: interestCount("hp") },
    { label: "MEOに興味あり", value: interestCount("meo") },
    { label: "SNS運用に興味あり", value: interestCount("sns") },
    { label: "採用支援に興味あり", value: interestCount("recruiting") },
    { label: "無料診断希望", value: interestCount("diagnosis") },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-sm text-muted mt-1">
          掲載状況と営業リードの全体像を把握できます。
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-border p-4"
          >
            <div className="text-xs text-muted">{s.label}</div>
            <div
              className={`mt-1 text-2xl font-bold ${
                s.accent ? "text-brand" : "text-foreground"
              }`}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold">直近のリード</h2>
          <div className="mt-3 space-y-2 text-sm">
            {leads.slice(0, 5).map((l) => (
              <Link
                key={l.id}
                href={`/admin/leads/${l.id}`}
                className="flex items-center justify-between border-b border-border py-2 hover:text-brand"
              >
                <span className="truncate">
                  {l.companyName}
                  <span className="text-muted-soft text-xs ml-2">
                    {l.leadType}
                  </span>
                </span>
                <span className="text-xs text-muted shrink-0 ml-2">
                  {new Date(l.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </Link>
            ))}
            {leads.length === 0 && (
              <p className="text-muted-soft text-sm">
                まだリードはありません。フォーム送信が入るとここに表示されます。
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold">クイックリンク</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/admin/businesses"
              className="px-3 py-2 rounded-xl border border-border hover:border-brand hover:text-brand"
            >
              店舗管理
            </Link>
            <Link
              href="/admin/leads"
              className="px-3 py-2 rounded-xl border border-border hover:border-brand hover:text-brand"
            >
              リード管理
            </Link>
            <Link
              href="/admin/leads?export=csv"
              className="px-3 py-2 rounded-xl border border-border hover:border-brand hover:text-brand"
            >
              リードCSV出力
            </Link>
            <Link
              href="/"
              className="px-3 py-2 rounded-xl border border-border hover:border-brand hover:text-brand"
            >
              公開サイトを見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
