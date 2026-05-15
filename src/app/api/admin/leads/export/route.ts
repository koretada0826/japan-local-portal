import { NextResponse } from "next/server";
import { readLeads } from "@/lib/leadStore";
import { isAdminAuthenticated } from "@/lib/adminAuth";

function csvEscape(v: string | undefined | null) {
  if (v === undefined || v === null) return "";
  const s = String(v).replace(/"/g, '""');
  if (/[",\n]/.test(s)) return `"${s}"`;
  return s;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return new NextResponse("unauthorized", { status: 401 });
  }
  const leads = await readLeads();
  const headers = [
    "id",
    "createdAt",
    "leadType",
    "companyName",
    "contactName",
    "contactRole",
    "decisionMakerName",
    "decisionMakerRole",
    "email",
    "phone",
    "interestedServices",
    "hasWebsite",
    "hasGoogleBusinessProfile",
    "usesSns",
    "hasRecruitingIssue",
    "salesStatus",
    "memo",
    "needs",
  ];
  const rows = leads.map((l) =>
    [
      l.id,
      l.createdAt,
      l.leadType,
      l.companyName,
      l.contactName,
      l.contactRole,
      l.decisionMakerName,
      l.decisionMakerRole,
      l.email,
      l.phone,
      l.interestedServices.join("|"),
      l.hasWebsite === undefined ? "" : l.hasWebsite ? "yes" : "no",
      l.hasGoogleBusinessProfile === undefined
        ? ""
        : l.hasGoogleBusinessProfile
        ? "yes"
        : "no",
      l.usesSns === undefined ? "" : l.usesSns ? "yes" : "no",
      l.hasRecruitingIssue === undefined
        ? ""
        : l.hasRecruitingIssue
        ? "yes"
        : "no",
      l.salesStatus,
      l.memo,
      l.needs,
    ]
      .map(csvEscape)
      .join(",")
  );
  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
    },
  });
}
