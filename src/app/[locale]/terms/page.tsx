import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { COMPLIANCE_EMAIL } from "@/lib/site";

const SECTIONS = ["role", "noOffer", "info"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "/terms", "terms");
}

export default async function TermsPage() {
  const t = await getTranslations("termsPage");

  return (
    <>
      <PageHeader title={t("h1")} intro={t("intro")} />
      <section className="gutter bg-paper">
        <div className="wrap py-14 md:py-16">
          <div className="prose-legal measure">
            {SECTIONS.map((key) => (
              <div key={key}>
                <h2>{t(`${key}H2`)}</h2>
                <p>{t(key)}</p>
              </div>
            ))}
            <h2>{t("fraudH2")}</h2>
            <p>
              {t("fraud")} <a href={`mailto:${COMPLIANCE_EMAIL}`}>{COMPLIANCE_EMAIL}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
