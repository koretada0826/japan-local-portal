import { z } from "zod";

export const interestedServiceEnum = z.enum([
  "hp",
  "lp",
  "meo",
  "sns",
  "recruiting",
  "diagnosis",
]);

export const freeListingSchema = z.object({
  // bot対策ハニーポット。CSSで非表示にした項目で人間は触らない。
  // 中身が空でなければbotとみなしてサーバー側で破棄する。
  honeypot_url: z.string().max(0).optional().or(z.literal("")),
  companyName: z.string().min(1, "店舗名・企業名を入力してください").max(200),
  categorySlug: z.string().min(1, "業種を選択してください"),
  address: z.string().min(1, "所在地を入力してください").max(300),
  phone: z.string().max(40).optional().or(z.literal("")),
  websiteUrl: z
    .string()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^https?:\/\//.test(v),
      "URLはhttp://またはhttps://で入力してください"
    ),
  instagramUrl: z.string().max(300).optional().or(z.literal("")),
  googleMapUrl: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  imageUrl: z.string().max(500).optional().or(z.literal("")),
  businessHours: z.string().max(200).optional().or(z.literal("")),
  regularHoliday: z.string().max(100).optional().or(z.literal("")),
  priceRange: z.string().max(100).optional().or(z.literal("")),
  features: z.string().max(500).optional().or(z.literal("")),
  contactName: z.string().min(1, "ご担当者名を入力してください").max(100),
  contactRole: z.string().max(100).optional().or(z.literal("")),
  email: z.string().email("正しいメールアドレスを入力してください").max(200),
  contactPhone: z.string().min(1, "ご連絡先電話番号を入力してください").max(40),
  decisionMakerName: z.string().max(100).optional().or(z.literal("")),
  decisionMakerRole: z.string().max(100).optional().or(z.literal("")),
  decisionMakerSame: z.enum(["same", "different"]).optional(),
  decisionMakerContactable: z.enum(["yes", "no"]).optional(),
  hasWebsite: z.enum(["yes", "no", "unknown"]).optional(),
  hasGoogleBusinessProfile: z.enum(["yes", "no", "unknown"]).optional(),
  usesSns: z.enum(["yes", "no", "unknown"]).optional(),
  hasRecruitingIssue: z.enum(["yes", "no", "unknown"]).optional(),
  interestedServices: z.array(interestedServiceEnum).optional(),
  wantsDiagnosis: z.boolean().optional(),
  agreePrivacy: z.literal(true, {
    error: "個人情報の取り扱いに同意してください",
  }),
  agreeContact: z.literal(true, {
    error: "確認連絡を受けることに同意してください",
  }),
  agreeProposal: z.boolean().optional(),
});

export type FreeListingInput = z.infer<typeof freeListingSchema>;

export const claimBusinessSchema = z.object({
  honeypot_url: z.string().max(0).optional().or(z.literal("")),
  businessId: z.string().min(1),
  businessName: z.string().min(1).max(200),
  isCurrentInfoCorrect: z.enum(["yes", "no"]),
  correctionContent: z.string().max(2000).optional().or(z.literal("")),
  newImageUrl: z.string().max(500).optional().or(z.literal("")),
  newDescription: z.string().max(2000).optional().or(z.literal("")),
  websiteUrl: z.string().max(300).optional().or(z.literal("")),
  snsUrl: z.string().max(300).optional().or(z.literal("")),
  contactName: z.string().min(1, "ご担当者名を入力してください").max(100),
  contactRole: z.string().max(100).optional().or(z.literal("")),
  decisionMakerName: z.string().max(100).optional().or(z.literal("")),
  decisionMakerRole: z.string().max(100).optional().or(z.literal("")),
  email: z.string().email("正しいメールアドレスを入力してください").max(200),
  phone: z.string().min(1, "電話番号を入力してください").max(40),
  interestedServices: z.array(interestedServiceEnum).optional(),
  wantsDiagnosis: z.boolean().optional(),
  agreePrivacy: z.literal(true, {
    error: "個人情報の取り扱いに同意してください",
  }),
});

export type ClaimBusinessInput = z.infer<typeof claimBusinessSchema>;
