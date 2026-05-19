import Link from "next/link";
import { notFound } from "next/navigation";
import { readLeads, updateLead } from "@/lib/leadStore";
import type { SalesStatus } from "@/types";
import { revalidatePath } from "next/cache";

type Params = Promise<{ id: string }>;

const statusOptions: { value: SalesStatus; label: string }[] = [
  { value: "untouched", label: "未対応" },
  { value: "contacted", label: "連絡済み" },
  { value: "meeting_scheduled", label: "商談予定" },
  { value: "proposed", label: "提案済み" },
  { value: "won", label: "受注" },
  { value: "lost", label: "失注" },
  { value: "on_hold", label: "保留" },
];

async function updateStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as SalesStatus;
  const memo = String(formData.get("memo") ?? "");
  await updateLead(id, { salesStatus: status, memo });
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath(`/admin/leads`);
}

export default async function AdminLeadDetailPage(props: { params: Params }) {
  const { id } = await props.params;
  const leads = await readLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) notFound();

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/leads"
          className="text-xs text-muted hover:text-brand"
        >
          ← リード一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold mt-2">{lead.companyName}</h1>
        <p className="text-xs text-muted mt-1">
          {new Date(lead.createdAt).toLocaleString("ja-JP")} 受信
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card title="担当者情報">
            <Row label="担当者名" value={lead.contactName} />
            <Row label="役職" value={lead.contactRole} />
            <Row label="メール" value={lead.email} />
            <Row label="電話" value={lead.phone} />
          </Card>

          <Card title="決裁者情報">
            <Row label="決裁者名" value={lead.decisionMakerName} />
            <Row label="決裁者役職" value={lead.decisionMakerRole} />
          </Card>

          <Card title="興味のあるサービス・課題">
            <Row
              label="興味サービス"
              value={
                lead.interestedServices.length === 0
                  ? "—"
                  : lead.interestedServices.join(", ")
              }
            />
            <Row
              label="HPの有無"
              value={
                lead.hasWebsite === undefined
                  ? "—"
                  : lead.hasWebsite
                  ? "あり"
                  : "なし"
              }
            />
            <Row
              label="Googleビジネスプロフィール"
              value={
                lead.hasGoogleBusinessProfile === undefined
                  ? "—"
                  : lead.hasGoogleBusinessProfile
                  ? "管理中"
                  : "未管理"
              }
            />
            <Row
              label="SNS運用"
              value={
                lead.usesSns === undefined
                  ? "—"
                  : lead.usesSns
                  ? "運用中"
                  : "未運用"
              }
            />
            <Row
              label="採用課題"
              value={
                lead.hasRecruitingIssue === undefined
                  ? "—"
                  : lead.hasRecruitingIssue
                  ? "あり"
                  : "なし"
              }
            />
          </Card>

          <Card title="ご要望・備考">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
              {lead.needs ?? "—"}
            </pre>
          </Card>

          {(lead.imageUrls?.length || lead.imageUrl) && (
            <Card title={`アップロード画像（${lead.imageUrls?.length ?? (lead.imageUrl ? 1 : 0)}枚）`}>
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(lead.imageUrls?.length
                    ? lead.imageUrls
                    : lead.imageUrl
                      ? [lead.imageUrl]
                      : []
                  ).map((u, i) => (
                    <a
                      key={u}
                      href={u}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative block rounded-xl overflow-hidden border-2 bg-surface-soft hover:border-brand transition-colors ${
                        i === 0 ? "border-brand" : "border-border"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u}
                        alt={`${lead.companyName} #${i + 1}`}
                        className="w-full aspect-square object-cover"
                        loading="lazy"
                      />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand text-white">
                          メイン
                        </span>
                      )}
                    </a>
                  ))}
                </div>
                {lead.uploadSessionId && (
                  <p className="mt-3 text-[11px] text-muted-soft break-all">
                    Storage フォルダ: <code>lead-uploads/{lead.uploadSessionId}/</code>
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>

        <aside>
          <form
            action={updateStatus}
            className="bg-white rounded-2xl border border-border p-5 space-y-4"
          >
            <input type="hidden" name="id" value={lead.id} />

            <div>
              <label className="block text-sm font-semibold">
                営業ステータス
              </label>
              <select
                name="status"
                defaultValue={lead.salesStatus}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-border text-sm"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold">営業メモ</label>
              <textarea
                name="memo"
                rows={6}
                defaultValue={lead.memo ?? ""}
                placeholder="例：1回目連絡済み。MEO提案資料送付予定。"
                className="mt-1 w-full px-3 py-2 rounded-xl border border-border text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover"
            >
              保存する
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-border p-5">
      <h2 className="font-bold">{title}</h2>
      <dl className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
        {children}
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-soft">{label}</dt>
      <dd className="mt-0.5">{value || "—"}</dd>
    </div>
  );
}
