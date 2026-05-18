export type RegionType = "region" | "prefecture" | "city" | "area";

export type Region = {
  id: string;
  name: string;
  slug: string;
  type: RegionType;
  parentSlug?: string;
  description?: string;
};

export type CategoryLevel = "main" | "sub" | "detail";

export type Category = {
  id: string;
  name: string;
  slug: string;
  level: CategoryLevel;
  parentSlug?: string;
  description?: string;
  icon?: string;
};

export type BusinessStatus =
  | "draft"
  | "published"
  | "pending_review"
  | "claimed"
  | "archived";

export type Business = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  mainImageUrl: string;
  prefectureSlug: string;
  citySlug: string;
  areaSlug: string;
  mainCategorySlug: string;
  subCategorySlug: string;
  address: string;
  phone?: string;
  businessHours?: string;
  regularHoliday?: string;
  priceRange?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
  lineUrl?: string;
  googleMapUrl?: string;
  features: string[];
  recommendPoints: string[];
  services?: string[];
  status: BusinessStatus;
  isFeatured: boolean;
  isPaid: boolean;
  isClaimed: boolean;
  isPremium: boolean;
  displayOrder: number;
  createdAt: string;
};

export type LeadType =
  | "free_listing_application"
  | "claim_business"
  | "correction_request"
  | "diagnosis_request"
  | "contact";

export type SalesStatus =
  | "untouched"
  | "contacted"
  | "meeting_scheduled"
  | "proposed"
  | "won"
  | "lost"
  | "on_hold";

export type InterestedService =
  | "hp"
  | "lp"
  | "meo"
  | "sns"
  | "recruiting"
  | "diagnosis";

export type Lead = {
  id: string;
  businessId?: string;
  leadType: LeadType;
  companyName: string;
  contactName: string;
  contactRole?: string;
  decisionMakerName?: string;
  decisionMakerRole?: string;
  email: string;
  phone: string;
  needs?: string;
  hasWebsite?: boolean;
  hasGoogleBusinessProfile?: boolean;
  usesSns?: boolean;
  hasRecruitingIssue?: boolean;
  interestedServices: InterestedService[];
  salesStatus: SalesStatus;
  memo?: string;
  nextActionDate?: string;
  createdAt: string;
};

export type AdPlacement = "sidebar_left" | "sidebar_right";

export type AdType = "banner" | "premium_business";

export type Ad = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: AdPlacement;
  adType: AdType;
  sponsorName?: string;
  priority: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
  createdAt: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  mainImageUrl: string;
  prefectureSlug?: string;
  citySlug?: string;
  mainCategorySlug?: string;
  subCategorySlug?: string;
  relatedBusinessSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
};
