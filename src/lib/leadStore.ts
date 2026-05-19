import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Lead } from "@/types";
import { sampleLeads } from "@/data/sampleLeads";
import { supabaseAdmin, isSupabaseAvailable } from "./supabaseServer";
import { notifyLeadReceived } from "./email";

const STORE_FILE = path.join(process.cwd(), ".data", "leads.json");

// ─── Supabase行 ⇄ Lead型 変換ヘルパー ───
type LeadRow = {
  id: string;
  business_id: string | null;
  lead_type: Lead["leadType"];
  company_name: string;
  contact_name: string | null;
  contact_role: string | null;
  decision_maker_name: string | null;
  decision_maker_role: string | null;
  email: string | null;
  phone: string | null;
  needs: string | null;
  has_website: boolean | null;
  has_google_business_profile: boolean | null;
  uses_sns: boolean | null;
  has_recruiting_issue: boolean | null;
  interested_services: string[];
  sales_status: Lead["salesStatus"];
  memo: string | null;
  next_action_date: string | null;
  image_url: string | null;
  created_at: string;
};

function rowToLead(r: LeadRow): Lead {
  return {
    id: r.id,
    businessId: r.business_id ?? undefined,
    leadType: r.lead_type,
    companyName: r.company_name,
    contactName: r.contact_name ?? "",
    contactRole: r.contact_role ?? undefined,
    decisionMakerName: r.decision_maker_name ?? undefined,
    decisionMakerRole: r.decision_maker_role ?? undefined,
    email: r.email ?? "",
    phone: r.phone ?? "",
    needs: r.needs ?? undefined,
    hasWebsite: r.has_website ?? undefined,
    hasGoogleBusinessProfile: r.has_google_business_profile ?? undefined,
    usesSns: r.uses_sns ?? undefined,
    hasRecruitingIssue: r.has_recruiting_issue ?? undefined,
    interestedServices: (r.interested_services ?? []) as Lead["interestedServices"],
    salesStatus: r.sales_status,
    memo: r.memo ?? undefined,
    nextActionDate: r.next_action_date ?? undefined,
    imageUrl: r.image_url ?? undefined,
    createdAt: r.created_at,
  };
}

function leadToRow(l: Partial<Lead>): Partial<LeadRow> {
  return {
    ...(l.businessId !== undefined && { business_id: l.businessId || null }),
    ...(l.leadType !== undefined && { lead_type: l.leadType }),
    ...(l.companyName !== undefined && { company_name: l.companyName }),
    ...(l.contactName !== undefined && { contact_name: l.contactName }),
    ...(l.contactRole !== undefined && { contact_role: l.contactRole }),
    ...(l.decisionMakerName !== undefined && { decision_maker_name: l.decisionMakerName }),
    ...(l.decisionMakerRole !== undefined && { decision_maker_role: l.decisionMakerRole }),
    ...(l.email !== undefined && { email: l.email }),
    ...(l.phone !== undefined && { phone: l.phone }),
    ...(l.needs !== undefined && { needs: l.needs }),
    ...(l.hasWebsite !== undefined && { has_website: l.hasWebsite }),
    ...(l.hasGoogleBusinessProfile !== undefined && { has_google_business_profile: l.hasGoogleBusinessProfile }),
    ...(l.usesSns !== undefined && { uses_sns: l.usesSns }),
    ...(l.hasRecruitingIssue !== undefined && { has_recruiting_issue: l.hasRecruitingIssue }),
    ...(l.interestedServices !== undefined && { interested_services: l.interestedServices }),
    ...(l.salesStatus !== undefined && { sales_status: l.salesStatus }),
    ...(l.memo !== undefined && { memo: l.memo }),
    ...(l.nextActionDate !== undefined && { next_action_date: l.nextActionDate }),
    ...(l.imageUrl !== undefined && { image_url: l.imageUrl ?? null }),
  };
}

// ─── ローカルJSONストア（fallback） ───
async function ensureStore() {
  const dir = path.dirname(STORE_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, "[]", "utf-8");
  }
}

async function readLeadsFromFile(): Promise<Lead[]> {
  try {
    await ensureStore();
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Lead[];
    if (parsed.length === 0) return sampleLeads;
    return parsed;
  } catch (err) {
    console.warn("[leadStore] file read failed, fallback to samples:", err);
    return sampleLeads;
  }
}

// ─── Public API ───
export async function readLeads(): Promise<Lead[]> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[leadStore] supabase read failed, fallback to file:", error.message);
      return readLeadsFromFile();
    }
    return (data as LeadRow[]).map(rowToLead);
  }
  return readLeadsFromFile();
}

export async function appendLead(
  data: Omit<Lead, "id" | "createdAt" | "salesStatus"> & {
    salesStatus?: Lead["salesStatus"];
  }
): Promise<Lead> {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    salesStatus: data.salesStatus ?? "untouched",
    ...data,
  };

  if (isSupabaseAvailable && supabaseAdmin) {
    const row = leadToRow(lead);
    const { data: inserted, error } = await supabaseAdmin
      .from("leads")
      .insert(row)
      .select()
      .single();
    if (error) {
      console.warn("[leadStore] supabase insert failed, lead NOT persisted:", error.message);
      return lead;
    }
    const created = rowToLead(inserted as LeadRow);
    // メール通知（失敗してもリード保存自体は成功扱い）
    notifyLeadReceived(created).catch((e) =>
      console.warn("[leadStore] notify failed:", e)
    );
    return created;
  }

  // ファイルフォールバック
  try {
    await ensureStore();
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const leads: Lead[] = (() => {
      try {
        return JSON.parse(raw) as Lead[];
      } catch {
        return [];
      }
    })();
    leads.unshift(lead);
    await fs.writeFile(STORE_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.warn("[leadStore] write failed:", err);
  }
  // ファイル保存時もメール通知（Supabaseなしでも通知だけは出す）
  notifyLeadReceived(lead).catch((e) =>
    console.warn("[leadStore] notify failed:", e)
  );
  return lead;
}

export async function updateLead(
  id: string,
  patch: Partial<Lead>
): Promise<Lead | null> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const row = leadToRow(patch);
    const { data, error } = await supabaseAdmin
      .from("leads")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.warn("[leadStore] supabase update failed:", error.message);
      return null;
    }
    return data ? rowToLead(data as LeadRow) : null;
  }

  // ファイルフォールバック
  try {
    const leads = await readLeadsFromFile();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx < 0) return null;
    leads[idx] = { ...leads[idx], ...patch };
    await fs.writeFile(STORE_FILE, JSON.stringify(leads, null, 2), "utf-8");
    return leads[idx];
  } catch (err) {
    console.warn("[leadStore] update failed:", err);
    return null;
  }
}
