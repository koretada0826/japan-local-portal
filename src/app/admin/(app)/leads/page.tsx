import Link from "next/link";
import { readLeads } from "@/lib/leadStore";
import type { LeadType, SalesStatus } from "@/types";

const leadTypeLabel: Record<LeadType, string> = {
  free_listing_application: "無料掲載申請",
  claim_business: "掲載確認",
  correction_request: "修正依頼",
  diagnosis_request: "診断希望",
  contact: "問い合わせ",
};

const salesStatusLabel: Record<SalesStatus, string> = {
  untouched: "未対応",
  contacted: "連絡済み",
  meeting_scheduled: "商談予定",
  proposed: "提案済み",
  won: "受注",
  lost: "失注",
  on_hold: "保留",
};

const salesStatusColor: Record<SalesStatus, string> = {
  untouched: "bg-brand text-white",
  contacted: "bg-foreground text-white",
  meeting_scheduled: "bg-amber-500 text-white",
  proposed: "bg-blue-500 text-white",
  won: "bg-emerald-500 text-white",
  lost: "bg-zinc-400 text-white",
  on_hold: "bg-zinc-300 text-foreground",
};

export default async function AdminLeadsPage(props: {
  searchParams: Promise<{ export?: string; type?: string }>;
}) {
  const { type } = await props.searchParams;
  const leads = await readLeads();
  const filtered = type ? leads.filter((l) => l.leadType === type) : leads;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">リード管理</h1>
          <p className="text-sm text-muted mt-1">
            フォームから入ったリードを営業ステータスとあわせて管理できます。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/admin/leads"
            className="px-3 py-1.5 rounded-full border border-border bg-white hover:border-brand"
          >
            全件
          </Link>
          <Link
            href="/admin/leads?type=free_listing_application"
            className="px-3 py-1.5 rounded-full border border-border bg-white hover:border-brand"
          >
            掲載申請
          </Link>
          <Link
            href="/admin/leads?type=claim_business"
            className="px-3 py-1.5 rounded-full border border-border bg-white hover:border-brand"
          >
            掲載確認
          </Link>
          <a
            href="/api/admin/leads/export"
            className="px-3 py-1.5 rounded-full bg-brand text-white hover:bg-brand-hover"
          >
            CSVエクスポート
          </a>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-soft text-xs uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-3">日時</th>
              <th className="text-left px-4 py-3">企業/店舗名</th>
              <th className="text-left px-4 py-3">担当者</th>
              <th className="text-left px-4 py-3">決裁者</th>
              <th className="text-left px-4 py-3">連絡先</th>
              <th className="text-left px-4 py-3">種別</th>
              <th className="text-left px-4 py-3">興味サービス</th>
              <th className="text-left px-4 py-3">ステータス</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-surface-soft">
                <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                  {new Date(l.createdAt).toLocaleString("ja-JP")}
                </td>
                <td className="px-4 py-3 font-semibold">
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="hover:text-brand"
                  >
                    {l.companyName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs">
                  {l.contactName}
                  {l.contactRole && (
                    <span className="text-muted-soft block">
                      {l.contactRole}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {l.decisionMakerName || "—"}
                  {l.decisionMakerRole && (
                    <span className="text-muted-soft block">
                      {l.decisionMakerRole}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {l.email}
                  <span className="block text-muted-soft">{l.phone}</span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {leadTypeLabel[l.leadType]}
                </td>
                <td className="px-4 py-3 text-xs">
                  {l.interestedServices.length === 0
                    ? "—"
                    : l.interestedServices.join(", ")}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      salesStatusColor[l.salesStatus]
                    }`}
                  >
                    {salesStatusLabel[l.salesStatus]}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-soft text-sm"
                >
                  リードはまだありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
