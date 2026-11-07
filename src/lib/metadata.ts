import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

type PageKey = "services" | "compliance" | "about" | "inquiry" | "privacy" | "terms";

/** Builds a page's title, plus canonical and hreflang links for both languages. */
export async function pageMetadata(locale: Locale, path: string, page?: PageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: page ? t(page) : { absolute: t("siteName") },
    description: t("description"),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    },
  };
}
