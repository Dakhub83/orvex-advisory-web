import type { Metadata, Viewport } from "next";
import { Jost, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { FraudNotice } from "@/components/layout/FraudNotice";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0B192C",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("siteName"), template: `%s · ${t("siteName")}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale} className={`${newsreader.variable} ${jost.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
        >
          {nav("skip")}
        </a>
        {/* Only the namespaces that client components read are sent to the browser. */}
        <NextIntlClientProvider messages={{ nav: messages.nav, form: messages.form }}>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <FraudNotice />
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
