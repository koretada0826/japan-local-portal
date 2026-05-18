import type { Metadata } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdShell } from "@/components/AdShell";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <AdShell>{children}</AdShell>
        <Footer />
      </body>
    </html>
  );
}
