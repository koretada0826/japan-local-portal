import type { NextConfig } from "next";

// セキュリティHTTPヘッダー
// 各ヘッダーの役割：
//  X-Frame-Options: クリックジャッキング対策（iframe埋め込み禁止）
//  X-Content-Type-Options: MIME sniffing対策
//  Referrer-Policy: 外部にリファラを過剰に渡さない
//  Permissions-Policy: 不要なブラウザAPI(camera等)を全面禁止
//  Strict-Transport-Security: HTTPS強制（Vercel本番でのみ有効）
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
