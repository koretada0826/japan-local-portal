import type { Region } from "@/types";

const r = (
  id: string,
  name: string,
  slug: string,
  type: Region["type"],
  parentSlug?: string,
  description?: string
): Region => ({ id, name, slug, type, parentSlug, description });

export const regions: Region[] = [
  // ─── 地方 (region) ─────────────────────────────────────────
  r("r-hokkaido", "北海道", "hokkaido-region", "region"),
  r("r-tohoku", "東北", "tohoku", "region"),
  r("r-kanto", "関東", "kanto", "region"),
  r("r-chubu", "中部", "chubu", "region"),
  r("r-kansai", "関西", "kansai", "region"),
  r("r-chugoku", "中国", "chugoku", "region"),
  r("r-shikoku", "四国", "shikoku", "region"),
  r("r-kyushu", "九州", "kyushu", "region"),
  r("r-okinawa-region", "沖縄", "okinawa-region", "region"),

  // ─── 都道府県 (prefecture) ─────────────────────────────────
  r("p-hokkaido", "北海道", "hokkaido", "prefecture", "hokkaido-region"),

  r("p-aomori", "青森県", "aomori", "prefecture", "tohoku"),
  r("p-iwate", "岩手県", "iwate", "prefecture", "tohoku"),
  r("p-miyagi", "宮城県", "miyagi", "prefecture", "tohoku"),
  r("p-akita", "秋田県", "akita", "prefecture", "tohoku"),
  r("p-yamagata", "山形県", "yamagata", "prefecture", "tohoku"),
  r("p-fukushima", "福島県", "fukushima", "prefecture", "tohoku"),

  r("p-ibaraki", "茨城県", "ibaraki", "prefecture", "kanto"),
  r("p-tochigi", "栃木県", "tochigi", "prefecture", "kanto"),
  r("p-gunma", "群馬県", "gunma", "prefecture", "kanto"),
  r("p-saitama", "埼玉県", "saitama", "prefecture", "kanto"),
  r("p-chiba", "千葉県", "chiba", "prefecture", "kanto"),
  r("p-tokyo", "東京都", "tokyo", "prefecture", "kanto"),
  r("p-kanagawa", "神奈川県", "kanagawa", "prefecture", "kanto"),

  r("p-niigata", "新潟県", "niigata", "prefecture", "chubu"),
  r("p-toyama", "富山県", "toyama", "prefecture", "chubu"),
  r("p-ishikawa", "石川県", "ishikawa", "prefecture", "chubu"),
  r("p-fukui", "福井県", "fukui", "prefecture", "chubu"),
  r("p-yamanashi", "山梨県", "yamanashi", "prefecture", "chubu"),
  r("p-nagano", "長野県", "nagano", "prefecture", "chubu"),
  r("p-gifu", "岐阜県", "gifu", "prefecture", "chubu"),
  r("p-shizuoka", "静岡県", "shizuoka", "prefecture", "chubu"),
  r("p-aichi", "愛知県", "aichi", "prefecture", "chubu"),

  r("p-mie", "三重県", "mie", "prefecture", "kansai"),
  r("p-shiga", "滋賀県", "shiga", "prefecture", "kansai"),
  r("p-kyoto", "京都府", "kyoto", "prefecture", "kansai"),
  r("p-osaka", "大阪府", "osaka", "prefecture", "kansai"),
  r("p-hyogo", "兵庫県", "hyogo", "prefecture", "kansai"),
  r("p-nara", "奈良県", "nara", "prefecture", "kansai"),
  r("p-wakayama", "和歌山県", "wakayama", "prefecture", "kansai"),

  r("p-tottori", "鳥取県", "tottori", "prefecture", "chugoku"),
  r("p-shimane", "島根県", "shimane", "prefecture", "chugoku"),
  r("p-okayama", "岡山県", "okayama", "prefecture", "chugoku"),
  r("p-hiroshima", "広島県", "hiroshima", "prefecture", "chugoku"),
  r("p-yamaguchi", "山口県", "yamaguchi", "prefecture", "chugoku"),

  r("p-tokushima", "徳島県", "tokushima", "prefecture", "shikoku"),
  r("p-kagawa", "香川県", "kagawa", "prefecture", "shikoku"),
  r("p-ehime", "愛媛県", "ehime", "prefecture", "shikoku"),
  r("p-kochi", "高知県", "kochi", "prefecture", "shikoku"),

  r("p-fukuoka", "福岡県", "fukuoka", "prefecture", "kyushu"),
  r("p-saga", "佐賀県", "saga", "prefecture", "kyushu"),
  r("p-nagasaki", "長崎県", "nagasaki", "prefecture", "kyushu"),
  r("p-kumamoto", "熊本県", "kumamoto", "prefecture", "kyushu"),
  r("p-oita", "大分県", "oita", "prefecture", "kyushu"),
  r("p-miyazaki", "宮崎県", "miyazaki", "prefecture", "kyushu"),
  r("p-kagoshima", "鹿児島県", "kagoshima", "prefecture", "kyushu"),

  r("p-okinawa", "沖縄県", "okinawa", "prefecture", "okinawa-region"),

  // ─── 市区町村 (city) ───────────────────────────────────────
  // 北海道
  r("c-sapporo", "札幌市", "sapporo", "city", "hokkaido"),
  r("c-hakodate", "函館市", "hakodate", "city", "hokkaido"),
  r("c-asahikawa", "旭川市", "asahikawa", "city", "hokkaido"),
  // 青森
  r("c-aomori", "青森市", "aomori-city", "city", "aomori"),
  r("c-hachinohe", "八戸市", "hachinohe", "city", "aomori"),
  // 岩手
  r("c-morioka", "盛岡市", "morioka", "city", "iwate"),
  // 宮城
  r("c-sendai", "仙台市", "sendai", "city", "miyagi"),
  // 秋田
  r("c-akita", "秋田市", "akita-city", "city", "akita"),
  // 山形
  r("c-yamagata", "山形市", "yamagata-city", "city", "yamagata"),
  // 福島
  r("c-fukushima-city", "福島市", "fukushima-city", "city", "fukushima"),
  r("c-iwaki", "いわき市", "iwaki", "city", "fukushima"),
  r("c-koriyama", "郡山市", "koriyama", "city", "fukushima"),
  // 茨城
  r("c-mito", "水戸市", "mito", "city", "ibaraki"),
  r("c-tsukuba", "つくば市", "tsukuba", "city", "ibaraki"),
  // 栃木
  r("c-utsunomiya", "宇都宮市", "utsunomiya", "city", "tochigi"),
  // 群馬
  r("c-maebashi", "前橋市", "maebashi", "city", "gunma"),
  r("c-takasaki", "高崎市", "takasaki", "city", "gunma"),
  // 埼玉
  r("c-saitama", "さいたま市", "saitama-city", "city", "saitama"),
  r("c-kawagoe", "川越市", "kawagoe", "city", "saitama"),
  r("c-kawaguchi", "川口市", "kawaguchi", "city", "saitama"),
  // 千葉
  r("c-chiba", "千葉市", "chiba-city", "city", "chiba"),
  r("c-funabashi", "船橋市", "funabashi", "city", "chiba"),
  r("c-kashiwa", "柏市", "kashiwa", "city", "chiba"),
  // 東京 (23区中心)
  r("c-toshima", "豊島区", "toshima", "city", "tokyo"),
  r("c-shinjuku", "新宿区", "shinjuku", "city", "tokyo"),
  r("c-shibuya", "渋谷区", "shibuya", "city", "tokyo"),
  r("c-minato", "港区", "minato", "city", "tokyo"),
  r("c-chuo", "中央区", "chuo", "city", "tokyo"),
  r("c-chiyoda", "千代田区", "chiyoda", "city", "tokyo"),
  r("c-bunkyo", "文京区", "bunkyo", "city", "tokyo"),
  r("c-taito", "台東区", "taito", "city", "tokyo"),
  r("c-koto", "江東区", "koto", "city", "tokyo"),
  r("c-shinagawa", "品川区", "shinagawa", "city", "tokyo"),
  r("c-meguro", "目黒区", "meguro", "city", "tokyo"),
  r("c-setagaya", "世田谷区", "setagaya", "city", "tokyo"),
  r("c-nakano", "中野区", "nakano", "city", "tokyo"),
  r("c-suginami", "杉並区", "suginami", "city", "tokyo"),
  r("c-nerima", "練馬区", "nerima", "city", "tokyo"),
  r("c-itabashi", "板橋区", "itabashi", "city", "tokyo"),
  r("c-ota", "大田区", "ota", "city", "tokyo"),
  r("c-hachioji", "八王子市", "hachioji", "city", "tokyo"),
  r("c-tachikawa", "立川市", "tachikawa", "city", "tokyo"),
  r("c-machida", "町田市", "machida", "city", "tokyo"),
  // 神奈川
  r("c-yokohama", "横浜市", "yokohama", "city", "kanagawa"),
  r("c-kawasaki", "川崎市", "kawasaki", "city", "kanagawa"),
  r("c-sagamihara", "相模原市", "sagamihara", "city", "kanagawa"),
  r("c-kamakura", "鎌倉市", "kamakura", "city", "kanagawa"),
  r("c-fujisawa", "藤沢市", "fujisawa", "city", "kanagawa"),
  // 新潟
  r("c-niigata", "新潟市", "niigata-city", "city", "niigata"),
  r("c-nagaoka", "長岡市", "nagaoka", "city", "niigata"),
  // 富山
  r("c-toyama", "富山市", "toyama-city", "city", "toyama"),
  // 石川
  r("c-kanazawa", "金沢市", "kanazawa", "city", "ishikawa"),
  // 福井
  r("c-fukui", "福井市", "fukui-city", "city", "fukui"),
  // 山梨
  r("c-kofu", "甲府市", "kofu", "city", "yamanashi"),
  // 長野
  r("c-nagano", "長野市", "nagano-city", "city", "nagano"),
  r("c-matsumoto", "松本市", "matsumoto", "city", "nagano"),
  // 岐阜
  r("c-gifu", "岐阜市", "gifu-city", "city", "gifu"),
  // 静岡
  r("c-shizuoka", "静岡市", "shizuoka-city", "city", "shizuoka"),
  r("c-hamamatsu", "浜松市", "hamamatsu", "city", "shizuoka"),
  // 愛知
  r("c-nagoya", "名古屋市", "nagoya", "city", "aichi"),
  r("c-toyota", "豊田市", "toyota", "city", "aichi"),
  r("c-okazaki", "岡崎市", "okazaki", "city", "aichi"),
  // 三重
  r("c-tsu", "津市", "tsu", "city", "mie"),
  r("c-yokkaichi", "四日市市", "yokkaichi", "city", "mie"),
  // 滋賀
  r("c-otsu", "大津市", "otsu", "city", "shiga"),
  // 京都
  r("c-kyoto", "京都市", "kyoto-city", "city", "kyoto"),
  // 大阪
  r("c-osaka", "大阪市", "osaka-city", "city", "osaka"),
  r("c-sakai", "堺市", "sakai", "city", "osaka"),
  r("c-suita", "吹田市", "suita", "city", "osaka"),
  r("c-higashiosaka", "東大阪市", "higashiosaka", "city", "osaka"),
  // 兵庫
  r("c-kobe", "神戸市", "kobe", "city", "hyogo"),
  r("c-himeji", "姫路市", "himeji", "city", "hyogo"),
  r("c-nishinomiya", "西宮市", "nishinomiya", "city", "hyogo"),
  r("c-ashiya", "芦屋市", "ashiya", "city", "hyogo"),
  // 奈良
  r("c-nara", "奈良市", "nara-city", "city", "nara"),
  // 和歌山
  r("c-wakayama", "和歌山市", "wakayama-city", "city", "wakayama"),
  // 鳥取
  r("c-tottori", "鳥取市", "tottori-city", "city", "tottori"),
  // 島根
  r("c-matsue", "松江市", "matsue", "city", "shimane"),
  // 岡山
  r("c-okayama", "岡山市", "okayama-city", "city", "okayama"),
  r("c-kurashiki", "倉敷市", "kurashiki", "city", "okayama"),
  // 広島
  r("c-hiroshima", "広島市", "hiroshima-city", "city", "hiroshima"),
  r("c-fukuyama", "福山市", "fukuyama", "city", "hiroshima"),
  // 山口
  r("c-yamaguchi", "山口市", "yamaguchi-city", "city", "yamaguchi"),
  r("c-shimonoseki", "下関市", "shimonoseki", "city", "yamaguchi"),
  // 徳島
  r("c-tokushima", "徳島市", "tokushima-city", "city", "tokushima"),
  // 香川
  r("c-takamatsu", "高松市", "takamatsu", "city", "kagawa"),
  // 愛媛
  r("c-matsuyama", "松山市", "matsuyama", "city", "ehime"),
  // 高知
  r("c-kochi", "高知市", "kochi-city", "city", "kochi"),
  // 福岡
  r("c-fukuoka-city", "福岡市", "fukuoka-city", "city", "fukuoka"),
  r("c-kitakyushu", "北九州市", "kitakyushu", "city", "fukuoka"),
  r("c-kurume", "久留米市", "kurume", "city", "fukuoka"),
  // 佐賀
  r("c-saga", "佐賀市", "saga-city", "city", "saga"),
  // 長崎
  r("c-nagasaki", "長崎市", "nagasaki-city", "city", "nagasaki"),
  r("c-sasebo", "佐世保市", "sasebo", "city", "nagasaki"),
  // 熊本
  r("c-kumamoto", "熊本市", "kumamoto-city", "city", "kumamoto"),
  // 大分
  r("c-oita", "大分市", "oita-city", "city", "oita"),
  r("c-beppu", "別府市", "beppu", "city", "oita"),
  // 宮崎
  r("c-miyazaki", "宮崎市", "miyazaki-city", "city", "miyazaki"),
  // 鹿児島
  r("c-kagoshima", "鹿児島市", "kagoshima-city", "city", "kagoshima"),
  // 沖縄
  r("c-naha", "那覇市", "naha", "city", "okinawa"),
  r("c-okinawa", "沖縄市", "okinawa-city", "city", "okinawa"),

  // ─── 駅・エリア (area) ─────────────────────────────────────
  // 東京
  r("a-ikebukuro", "池袋", "ikebukuro", "area", "toshima"),
  r("a-mejiro", "目白", "mejiro", "area", "toshima"),
  r("a-otsuka", "大塚", "otsuka", "area", "toshima"),
  r("a-shinjuku-st", "新宿", "shinjuku-station", "area", "shinjuku"),
  r("a-shinjuku-3", "新宿三丁目", "shinjuku-sanchome", "area", "shinjuku"),
  r("a-takadanobaba", "高田馬場", "takadanobaba", "area", "shinjuku"),
  r("a-shibuya-st", "渋谷", "shibuya-station", "area", "shibuya"),
  r("a-harajuku", "原宿", "harajuku", "area", "shibuya"),
  r("a-omotesando", "表参道", "omotesando", "area", "minato"),
  r("a-roppongi", "六本木", "roppongi", "area", "minato"),
  r("a-azabu", "麻布十番", "azabu-juban", "area", "minato"),
  r("a-ginza", "銀座", "ginza", "area", "chuo"),
  r("a-tsukiji", "築地", "tsukiji", "area", "chuo"),
  r("a-akihabara", "秋葉原", "akihabara", "area", "chiyoda"),
  r("a-tokyo-st", "東京駅", "tokyo-station", "area", "chiyoda"),
  r("a-yurakucho", "有楽町", "yurakucho", "area", "chiyoda"),
  r("a-ueno", "上野", "ueno", "area", "taito"),
  r("a-asakusa", "浅草", "asakusa", "area", "taito"),
  r("a-shinagawa-st", "品川", "shinagawa-station", "area", "shinagawa"),
  r("a-shimokitazawa", "下北沢", "shimokitazawa", "area", "setagaya"),
  r("a-sangenjaya", "三軒茶屋", "sangenjaya", "area", "setagaya"),
  r("a-jiyugaoka", "自由が丘", "jiyugaoka", "area", "meguro"),
  r("a-nakameguro", "中目黒", "nakameguro", "area", "meguro"),
  // 神奈川
  r("a-yokohama-st", "横浜", "yokohama-station", "area", "yokohama"),
  r("a-minatomirai", "みなとみらい", "minatomirai", "area", "yokohama"),
  r("a-kawasaki-st", "川崎", "kawasaki-station", "area", "kawasaki"),
  // 大阪
  r("a-umeda", "梅田", "umeda", "area", "osaka-city"),
  r("a-namba", "難波", "namba", "area", "osaka-city"),
  r("a-shinsaibashi", "心斎橋", "shinsaibashi", "area", "osaka-city"),
  r("a-tennoji", "天王寺", "tennoji", "area", "osaka-city"),
  r("a-kyobashi", "京橋", "kyobashi", "area", "osaka-city"),
  // 京都
  r("a-kyoto-st", "京都駅", "kyoto-station", "area", "kyoto-city"),
  r("a-kawaramachi", "河原町", "kawaramachi", "area", "kyoto-city"),
  // 兵庫
  r("a-sannomiya", "三宮", "sannomiya", "area", "kobe"),
  // 愛知
  r("a-sakae", "栄", "sakae", "area", "nagoya"),
  r("a-nagoya-st", "名古屋駅", "nagoya-station", "area", "nagoya"),
  // 福岡
  r("a-hakata", "博多", "hakata", "area", "fukuoka-city"),
  r("a-tenjin", "天神", "tenjin", "area", "fukuoka-city"),
  r("a-nakasu", "中洲", "nakasu", "area", "fukuoka-city"),
  // 北海道
  r("a-sapporo-st", "札幌駅", "sapporo-station", "area", "sapporo"),
  r("a-susukino", "すすきの", "susukino", "area", "sapporo"),
  // 宮城
  r("a-sendai-st", "仙台駅", "sendai-station", "area", "sendai"),
  // 広島
  r("a-hiroshima-st", "広島駅", "hiroshima-station", "area", "hiroshima-city"),
];

export const popularAreas = [
  "ikebukuro",
  "shinjuku-station",
  "shibuya-station",
  "roppongi",
  "ginza",
  "akihabara",
  "ueno",
  "yokohama-station",
  "umeda",
  "namba",
  "sannomiya",
  "sakae",
  "nagoya-station",
  "tenjin",
  "hakata",
  "sapporo-station",
  "kyoto-station",
  "sendai-station",
];

export const findRegion = (slug: string) =>
  regions.find((r) => r.slug === slug);

export const getRegionGroups = () =>
  regions.filter((r) => r.type === "region");

export const getPrefectures = () =>
  regions.filter((r) => r.type === "prefecture");

export const getPrefecturesByRegion = (regionSlug: string) =>
  regions.filter((r) => r.type === "prefecture" && r.parentSlug === regionSlug);

export const getCitiesByPref = (prefSlug: string) =>
  regions.filter((r) => r.type === "city" && r.parentSlug === prefSlug);

export const getAreasByCity = (citySlug: string) =>
  regions.filter((r) => r.type === "area" && r.parentSlug === citySlug);
