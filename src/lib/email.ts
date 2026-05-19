import { Resend } from "resend";
import type { Lead } from "@/types";

/**
 * メール送信ラッパー（Resend）
 * - RESEND_API_KEY が無い時は何もしない（dev・未設定時にエラーで落とさない）
 * - 送信失敗もログだけ・本体処理は止めない
 */
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// 送信先・送信元のデフォルト
const TO = process.env.NOTIFY_EMAIL_TO ?? "info@example.com";
// Resend 検証ドメイン未設定でも使える検証用送信元（本番では独自ドメイン推奨）
const FROM = process.env.NOTIFY_EMAIL_FROM ?? "onboarding@resend.dev";

const SITE_NAME = "まちセレクト";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://japan-local-portal.onrender.com";

const leadTypeLabels: Record<Lead["leadType"], string> = {
  free_listing_application: "無料掲載のお申込み",
  claim_business: "掲載店舗の確認・修正申請",
  correction_request: "情報修正依頼",
  diagnosis_request: "無料診断のご依頼",
  contact: "お問い合わせ",
};

/**
 * リード（申込み・問い合わせ）受信通知を運営者へ送信
 */
export async function notifyLeadReceived(lead: Lead): Promise<void> {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY 未設定のため通知メールはスキップしました"
    );
    return;
  }

  const subject = `[${SITE_NAME}] ${leadTypeLabels[lead.leadType]}：${lead.companyName}`;

  const html = `
<!DOCTYPE html>
<html lang="ja">
<body style="font-family:-apple-system,'Hiragino Sans',sans-serif;line-height:1.7;color:#1f2937;max-width:600px;margin:0 auto;padding:24px;background:#f7f7f5;">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <div style="border-left:5px solid #ff6b35;padding-left:.8em;margin-bottom:24px;">
      <div style="font-size:11px;color:#ff6b35;font-weight:700;letter-spacing:.1em;">${SITE_NAME} 通知</div>
      <h1 style="margin:.3em 0 0;font-size:20px;color:#1f2937;">${leadTypeLabels[lead.leadType]} を受信しました</h1>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#6b7280;width:30%;">企業・店舗名</td><td style="padding:8px 0;font-weight:600;">${escape(lead.companyName)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">担当者</td><td style="padding:8px 0;">${escape(lead.contactName || "—")}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">メール</td><td style="padding:8px 0;"><a href="mailto:${escape(lead.email)}" style="color:#ff6b35;">${escape(lead.email || "—")}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">電話</td><td style="padding:8px 0;">${escape(lead.phone || "—")}</td></tr>
      ${lead.decisionMakerName ? `<tr><td style="padding:8px 0;color:#6b7280;">決裁者</td><td style="padding:8px 0;">${escape(lead.decisionMakerName)}${lead.decisionMakerRole ? `（${escape(lead.decisionMakerRole)}）` : ""}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#6b7280;">興味あるサービス</td><td style="padding:8px 0;">${lead.interestedServices.length > 0 ? lead.interestedServices.map(escape).join("、") : "—"}</td></tr>
    </table>

    ${
      lead.needs
        ? `<div style="margin-top:16px;padding:16px;background:#fff4ee;border-left:3px solid #ff6b35;border-radius:6px;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">詳細メモ</div>
          <pre style="margin:0;font-family:inherit;font-size:13px;white-space:pre-wrap;">${escape(lead.needs)}</pre>
        </div>`
        : ""
    }

    ${
      lead.imageUrl
        ? `<div style="margin-top:16px;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">アップロード画像</div>
          <a href="${escape(lead.imageUrl)}" target="_blank" style="display:block;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;text-decoration:none;">
            <img src="${escape(lead.imageUrl)}" alt="${escape(lead.companyName)}" style="display:block;width:100%;max-width:400px;height:auto;" />
          </a>
        </div>`
        : ""
    }

    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
      <a href="${SITE_URL}/admin/leads/${lead.id}" style="display:inline-block;background:#ff6b35;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">管理画面で詳細を見る</a>
    </div>

    <div style="margin-top:24px;font-size:11px;color:#9ca3af;text-align:center;">
      受信日時: ${new Date(lead.createdAt).toLocaleString("ja-JP")}<br>
      ID: ${lead.id}
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const result = await resend.emails.send({
      from: `${SITE_NAME} <${FROM}>`,
      to: TO,
      subject,
      html,
    });
    if (result.error) {
      console.warn("[email] Resend 送信エラー:", result.error.message);
    } else {
      console.log("[email] 通知メール送信成功 id=", result.data?.id);
    }
  } catch (err) {
    console.warn(
      "[email] 通知メール送信失敗:",
      err instanceof Error ? err.message : err
    );
  }
}

// HTML特殊文字エスケープ（XSS対策）
function escape(s: string | null | undefined): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
