import { NextResponse } from "next/server";
import { freeListingSchema, claimBusinessSchema } from "@/lib/leadSchemas";
import { appendLead } from "@/lib/leadStore";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIpFromRequest } from "@/lib/getClientIp";

// 同一IPから 10分間で 5回まで許可
const FORM_RATE_LIMIT_MAX = 5;
const FORM_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // 同一オリジン送信ではOriginが付かない場合がある（許容）
  try {
    const originHost = new URL(origin).host;
    const reqHost = req.headers.get("host");
    if (!reqHost) return false;
    return originHost === reqHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // CSRF対策：自サイト以外からのPOSTを弾く
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  // レート制限（IP単位）
  const ip = await getClientIpFromRequest(request);
  const rl = rateLimit(
    `leads:${ip}`,
    FORM_RATE_LIMIT_MAX,
    FORM_RATE_LIMIT_WINDOW_MS
  );
  if (!rl.ok) {
    const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "rate_limited", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // honeypot：人間には見えないフィールドに値が入っていればbot判定。
  // 攻撃者に成功失敗を悟られないよう、200で「ok」だけ返してデータは破棄。
  const maybeBody = body as { honeypot_url?: string };
  if (maybeBody.honeypot_url && maybeBody.honeypot_url.length > 0) {
    console.warn("[api/leads] honeypot triggered. ip=", ip);
    return NextResponse.json({ ok: true });
  }

  const data = body as { kind?: string };
  if (data.kind === "free_listing") {
    const parsed = freeListingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation_failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const lead = await appendLead({
      leadType: "free_listing_application",
      companyName: d.companyName,
      contactName: d.contactName,
      contactRole: d.contactRole || undefined,
      decisionMakerName: d.decisionMakerName || undefined,
      decisionMakerRole: d.decisionMakerRole || undefined,
      email: d.email,
      phone: d.contactPhone,
      needs: [
        d.description ? `紹介文: ${d.description}` : "",
        d.address ? `所在地: ${d.address}` : "",
        d.priceRange ? `料金目安: ${d.priceRange}` : "",
        d.businessHours ? `営業時間: ${d.businessHours}` : "",
        d.features ? `特徴: ${d.features}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      hasWebsite:
        d.hasWebsite === "yes"
          ? true
          : d.hasWebsite === "no"
          ? false
          : undefined,
      hasGoogleBusinessProfile:
        d.hasGoogleBusinessProfile === "yes"
          ? true
          : d.hasGoogleBusinessProfile === "no"
          ? false
          : undefined,
      usesSns:
        d.usesSns === "yes" ? true : d.usesSns === "no" ? false : undefined,
      hasRecruitingIssue:
        d.hasRecruitingIssue === "yes"
          ? true
          : d.hasRecruitingIssue === "no"
          ? false
          : undefined,
      interestedServices: d.wantsDiagnosis
        ? Array.from(new Set([...(d.interestedServices ?? []), "diagnosis"]))
        : d.interestedServices ?? [],
      imageUrl: d.imageUrl || undefined,
    });
    return NextResponse.json({ ok: true, leadId: lead.id });
  }

  if (data.kind === "claim_business") {
    const parsed = claimBusinessSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation_failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const lead = await appendLead({
      businessId: d.businessId,
      leadType: "claim_business",
      companyName: d.businessName,
      contactName: d.contactName,
      contactRole: d.contactRole || undefined,
      decisionMakerName: d.decisionMakerName || undefined,
      decisionMakerRole: d.decisionMakerRole || undefined,
      email: d.email,
      phone: d.phone,
      needs: [
        `現在の情報は正しいか: ${
          d.isCurrentInfoCorrect === "yes" ? "正しい" : "修正あり"
        }`,
        d.correctionContent ? `修正内容: ${d.correctionContent}` : "",
        d.newDescription ? `紹介文追加: ${d.newDescription}` : "",
        d.websiteUrl ? `公式: ${d.websiteUrl}` : "",
        d.snsUrl ? `SNS: ${d.snsUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      interestedServices: d.wantsDiagnosis
        ? Array.from(new Set([...(d.interestedServices ?? []), "diagnosis"]))
        : d.interestedServices ?? [],
    });
    return NextResponse.json({ ok: true, leadId: lead.id });
  }

  return NextResponse.json({ error: "unknown_kind" }, { status: 400 });
}
