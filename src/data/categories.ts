import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "m-food", name: "飲食店", slug: "food", level: "main", description: "カフェ・ラーメン・居酒屋など", icon: "UtensilsCrossed" },
  { id: "m-beauty", name: "美容・サロン", slug: "beauty", level: "main", description: "美容室・ネイル・エステなど", icon: "Scissors" },
  { id: "m-medical", name: "医療・健康", slug: "medical", level: "main", description: "クリニック・整体・歯科など", icon: "HeartPulse" },
  { id: "m-fitness", name: "フィットネス", slug: "fitness", level: "main", description: "パーソナルジム・ヨガなど", icon: "Dumbbell" },
  { id: "m-life", name: "暮らし", slug: "life", level: "main", description: "不動産・リフォーム・家事代行など", icon: "Home" },
  { id: "m-education", name: "教育", slug: "education", level: "main", description: "学習塾・英会話・資格スクール", icon: "BookOpen" },
  { id: "m-professional", name: "士業・専門家", slug: "professional", level: "main", description: "税理士・行政書士・弁護士など", icon: "Briefcase" },
  { id: "m-care", name: "介護・福祉", slug: "care", level: "main", description: "老人ホーム・デイサービスなど", icon: "Hand" },
  { id: "m-housing", name: "住宅・建築", slug: "housing", level: "main", description: "工務店・リフォーム・外壁塗装など", icon: "Hammer" },
  { id: "m-car", name: "車・バイク", slug: "car", level: "main", description: "中古車・車検・整備など", icon: "Car" },
  { id: "m-btob", name: "法人向けサービス", slug: "btob", level: "main", description: "Web制作・採用・コンサルなど", icon: "Building2" },
  { id: "m-leisure", name: "娯楽・レジャー", slug: "leisure", level: "main", description: "カラオケ・観光・ホテルなど", icon: "Music" },

  ...sub("food", [
    ["cafe", "カフェ"], ["ramen", "ラーメン"], ["izakaya", "居酒屋"], ["yakiniku", "焼肉"],
    ["sushi", "寿司"], ["washoku", "和食"], ["yoshoku", "洋食"], ["chinese", "中華"],
    ["italian", "イタリアン"], ["french", "フレンチ"], ["bar", "バー"], ["sweets", "スイーツ"],
    ["takeout", "テイクアウト"], ["family-restaurant", "ファミレス"], ["curry", "カレー"],
    ["udon-soba", "うどん・そば"], ["korean", "韓国料理"], ["asian", "アジア料理"],
  ]),
  ...sub("beauty", [
    ["hair-salon", "美容室"], ["barber", "理容室"], ["mens-hair", "メンズ美容室"],
    ["nail", "ネイルサロン"], ["eyelash", "まつ毛サロン"], ["esthetic", "エステ"],
    ["hair-removal", "脱毛"], ["mens-hair-removal", "メンズ脱毛"], ["whitening", "ホワイトニング"],
    ["beauty-clinic", "美容クリニック"], ["relaxation", "リラクゼーション"],
    ["head-spa", "ヘッドスパ"], ["seitai-salon", "整体サロン"],
  ]),
  ...sub("medical", [
    ["internal-medicine", "内科"], ["dentist", "歯科"], ["dermatology", "皮膚科"],
    ["orthopedics", "整形外科"], ["ophthalmology", "眼科"], ["ent", "耳鼻科"],
    ["pediatrics", "小児科"], ["obstetrics", "産婦人科"], ["psychiatry", "心療内科"],
    ["seitai", "整体"], ["sekkotsuin", "接骨院"], ["acupuncture", "鍼灸院"],
    ["pharmacy", "薬局"], ["checkup", "健康診断"],
  ]),
  ...sub("fitness", [
    ["personal-gym", "パーソナルジム"], ["fitness-gym", "フィットネスジム"],
    ["yoga", "ヨガ"], ["pilates", "ピラティス"], ["kickboxing", "キックボクシング"],
    ["dance", "ダンススクール"], ["sports-club", "スポーツクラブ"], ["stretch", "ストレッチ専門店"],
  ]),
  ...sub("life", [
    ["real-estate", "不動産"], ["reform", "リフォーム"], ["house-cleaning", "ハウスクリーニング"],
    ["benriya", "便利屋"], ["kaitori", "買取店"], ["photo-studio", "写真館"],
    ["pet-salon", "ペットサロン"], ["cleaning", "クリーニング"], ["repair", "修理サービス"],
    ["key-repair", "鍵修理"], ["water-repair", "水道修理"], ["pest", "害虫駆除"],
    ["moving", "引越し"], ["housekeeping", "家事代行"],
  ]),
  ...sub("education", [
    ["juku", "学習塾"], ["kobetsu-juku", "個別指導塾"], ["english", "英会話"],
    ["programming", "プログラミングスクール"], ["music", "音楽教室"], ["dance-school", "ダンススクール"],
    ["preschool", "幼児教室"], ["license", "資格スクール"], ["tutor", "家庭教師"],
    ["exam-prep", "受験対策"],
  ]),
  ...sub("professional", [
    ["zeirishi", "税理士"], ["gyoseishoshi", "行政書士"], ["shihoshoshi", "司法書士"],
    ["lawyer", "弁護士"], ["sharoshi", "社労士"], ["consultant", "中小企業診断士"],
    ["fp", "FP"], ["surveyor", "土地家屋調査士"], ["cpa", "公認会計士"], ["benrishi", "弁理士"],
  ]),
  ...sub("care", [
    ["nursing-home", "老人ホーム"], ["day-service", "デイサービス"], ["visit-care", "訪問介護"],
    ["visit-nursing", "訪問看護"], ["welfare-tool", "福祉用具"], ["disability", "障害福祉サービス"],
    ["care-consult", "介護相談"], ["group-home", "グループホーム"], ["care-support", "居宅介護支援"],
    ["paid-nursing", "住宅型有料老人ホーム"],
  ]),
  ...sub("housing", [
    ["koumuten", "工務店"], ["reform-company", "リフォーム会社"], ["paint", "外壁塗装"],
    ["roof-repair", "屋根修理"], ["interior", "内装工事"], ["water-construction", "水道工事"],
    ["electric", "電気工事"], ["realestate-sale", "不動産売買"], ["realestate-rent", "賃貸仲介"],
    ["demolition", "解体工事"], ["landscape", "造園"], ["house-maker", "ハウスメーカー"],
  ]),
  ...sub("car", [
    ["used-car", "中古車販売"], ["car-inspection", "車検"], ["car-maintenance", "自動車整備"],
    ["body-paint", "板金塗装"], ["rental-car", "レンタカー"], ["motorbike", "バイク販売"],
    ["car-parts", "カー用品"], ["gas-station", "ガソリンスタンド"], ["car-wash", "洗車"],
    ["car-insurance", "自動車保険"],
  ]),
  ...sub("btob", [
    ["web", "Web制作"], ["ad-agency", "広告代理店"], ["sns-agency", "SNS運用"],
    ["recruiting", "採用支援"], ["sales-agency", "営業代行"], ["accounting", "経理代行"],
    ["subsidy", "補助金支援"], ["consulting", "コンサルティング"], ["system-dev", "システム開発"],
    ["video", "動画制作"], ["printing", "印刷会社"], ["office-cleaning", "オフィス清掃"],
    ["jinzai", "人材紹介"], ["training", "研修会社"],
  ]),
  ...sub("leisure", [
    ["karaoke", "カラオケ"], ["game-center", "ゲームセンター"], ["movie", "映画館"],
    ["bowling", "ボウリング"], ["sports-facility", "スポーツ施設"], ["sightseeing", "観光施設"],
    ["hotel", "ホテル"], ["ryokan", "旅館"], ["onsen", "温泉"],
    ["camp", "キャンプ場"], ["rental-space", "レンタルスペース"],
  ]),
];

function sub(mainSlug: string, items: [string, string][]): Category[] {
  return items.map(([slug, name]) => ({
    id: `${mainSlug}-${slug}`,
    name,
    slug,
    level: "sub" as const,
    parentSlug: mainSlug,
  }));
}

export const findCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const findCategoryByParent = (slug: string, parentSlug: string) =>
  categories.find((c) => c.slug === slug && c.parentSlug === parentSlug);

export const getMainCategories = () =>
  categories.filter((c) => c.level === "main");

export const getSubCategories = (mainSlug: string) =>
  categories.filter((c) => c.level === "sub" && c.parentSlug === mainSlug);
