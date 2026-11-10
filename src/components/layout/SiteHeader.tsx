"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_ITEMS = [
  { href: "/", label: "home" },
  { href: "/services", label: "services" },
  { href: "/compliance", label: "compliance" },
  { href: "/about", label: "about" },
  { href: "/inquiry", label: "portal" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return NAV_ITEMS.map(({ href, label }) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        className="navlink py-2 whitespace-nowrap"
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
      >
        {t(label)}
      </Link>
    );
  });
}

function LanguageSwitcher() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const current = useLocale();
  return (
    <div className="lang flex shrink-0 border border-white/20" role="group" aria-label={t("language")}>
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          scroll={false}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="masthead">
      <div className="gutter">
        <div className="wrap flex items-center justify-between gap-6 h-[72px]">
          <Link href="/" className="flex items-baseline gap-2 shrink-0" aria-label={t("brandHome")}>
            <span className="font-serif text-[24px] text-paper tracking-tight">Orvex</span>
            <span className="font-serif italic text-[18px] text-gold">&amp; Co.</span>
            <span className="hidden sm:inline eyebrow text-[10px] text-white/50 ml-1">{t("advisory")}</span>
          </Link>
          {/* Full menu only from 1280px: below that the French labels do not fit on one line. */}
          <nav className="hidden xl:flex items-center gap-8 min-w-0" aria-label={t("primary")}>
            <NavLinks />
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            <LanguageSwitcher />
            <Link
              href="/inquiry"
              className="btn-gold hidden md:inline-block text-[13px] px-5 py-3 uppercase whitespace-nowrap"
            >
              {t("cta")}
            </Link>
            <button
              type="button"
              className="xl:hidden text-paper p-2"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={t("menu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M3 6h16M3 11h16M3 16h16" stroke="#FFFFFF" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
        </div>
        <nav
          id="mobile-nav"
          className={`xl:hidden wrap pb-5 flex-col gap-1 ${menuOpen ? "flex" : "hidden"}`}
          aria-label={t("mobile")}
        >
          <NavLinks onNavigate={() => setMenuOpen(false)} />
          <Link
            href="/inquiry"
            className="btn-gold text-center text-[13px] px-5 py-3 mt-3 uppercase"
            onClick={() => setMenuOpen(false)}
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
