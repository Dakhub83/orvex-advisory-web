import { getTranslations } from "next-intl/server";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHeader } from "@/components/sections/PageHeader";
import { SettlementPanel } from "@/components/sections/SettlementPanel";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const DOES = ["does1", "does2", "does3", "does4"] as const;
const DOES_NOT = ["doesNot1", "doesNot2", "doesNot3", "doesNot4"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "/about", "about");
}

export default async function AboutPage() {
  const t = await getTranslations("aboutPage");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />

      <section className="gutter bg-paper">
        <div className="wrap py-20 md:py-28 grid md:grid-cols-2 gap-x-16 gap-y-12">
          {[
            { title: t("doesH2"), items: DOES },
            { title: t("doesNotH2"), items: DOES_NOT },
          ].map(({ title, items }) => (
            <div key={title} className="min-w-0">
              <h2 className="text-[30px] md:text-[34px] leading-tight text-navy">{title}</h2>
              <ul className="mt-6">
                {items.map((key) => (
                  <li key={key} className="pillar py-4 text-[16px] text-slate">
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="gutter bg-charcoal text-paper">
        <div className="wrap py-20 md:py-24 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-6 min-w-0 self-center">
            <p className="eyebrow text-gold">{t("pathEyebrow")}</p>
            <h2 className="mt-4 text-[30px] md:text-[38px] leading-tight">{t("pathH2")}</h2>
            <p className="mt-5 text-[17px] text-white/70 measure font-light">{t("pathBody")}</p>
          </div>
          <div className="lg:col-span-6 min-w-0 bg-navy">
            <SettlementPanel />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
