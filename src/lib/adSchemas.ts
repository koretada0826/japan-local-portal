import { z } from "zod";

const PLACEMENTS = ["sidebar_left", "sidebar_right"] as const;

const AD_TYPES = ["banner", "premium_business"] as const;

const safeUrl = z
  .string()
  .url({ message: "URLの形式が正しくありません" })
  .refine((u) => /^https?:\/\//i.test(u), {
    message: "http(s)://で始まるURLのみ使用できます",
  });

export const adInputSchema = z.object({
  title: z.string().trim().min(1, "タイトルは必須です").max(120),
  imageUrl: safeUrl,
  linkUrl: safeUrl,
  placement: z.enum(PLACEMENTS),
  adType: z.enum(AD_TYPES),
  sponsorName: z.string().trim().max(80).optional().or(z.literal("")),
  priority: z.coerce.number().int().min(0).max(1000).default(0),
  isActive: z.coerce.boolean().default(true),
  startAt: z.string().optional().or(z.literal("")),
  endAt: z.string().optional().or(z.literal("")),
});

export type AdInput = z.infer<typeof adInputSchema>;
