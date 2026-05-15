"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, MapPin, Search } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/articles", label: "おすすめ記事" },
  { href: "/free-listing", label: "無料掲載" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="container-main flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-foreground"
        >
          <MapPin className="text-brand" size={22} aria-hidden />
          {SITE_CONFIG.name}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-foreground hover:text-brand transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label="検索"
            className="text-foreground/70 hover:text-brand"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/free-listing/apply"
            className="ml-1 inline-flex items-center px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors"
          >
            無料で掲載する
          </Link>
        </nav>

        <button
          type="button"
          aria-label="メニューを開く"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2 text-foreground"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-border bg-white overflow-hidden transition-[max-height] duration-200",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container-main py-3 flex flex-col gap-1">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-foreground border-b border-border last:border-0"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/free-listing/apply"
            onClick={() => setOpen(false)}
            className="mt-3 mb-2 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-brand text-white text-sm font-semibold"
          >
            無料で掲載する
          </Link>
        </div>
      </div>
    </header>
  );
}
