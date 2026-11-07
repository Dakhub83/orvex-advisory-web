import { getTranslations } from "next-intl/server";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Commitments } from "@/components/sections/Commitments";
import { PageHeader } from "@/components/sections/PageHeader";
import { STAGES } from "@/components/sections/Stages";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const REQUIREMENTS = ["r1", "r2", "r3"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/compliance">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "/compliance", "compliance");
}

export default async function CompliancePage() {
  const t = await getTranslations("compliancePage");
  const stages = await getTranslations("stages");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />

      <section id="protocol" className="gutter bg-paper">
        <div className="wrap py-20 md:py-28">
          <p className="eyebrow text-gold">{t("protocolEyebrow")}</p>
          <h2 className="mt-4 text-[30px] md:text-[40px] leading-tight text-navy max-w-[22ch]">{stages("h2")}</h2>
          <ol className="mt-12">
            {STAGES.map(({ key, numeral }) => (
              <li key={key} className="pillar py-7 grid md:grid-cols-12 gap-x-8 gap-y-2">
                <span className="step-num text-[34px] leading-none md:col-span-1">{numeral}</span>
                <h3 className="text-[24px] leading-tight text-navy md:col-span-4">{stages(`${key}.title`)}</h3>
                <p className="text-[16px] text-slate md:col-span-7 measure">{stages(`${key}.detail`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gutter bg-mist">
        <div className="wrap py-20 md:py-24 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 min-w-0">
            <p className="eyebrow text-gold">{t("requirementsEyebrow")}</p>
            <h2 className="mt-4 text-[30px] md:text-[38px] leading-tight text-navy">{t("requirementsH2")}</h2>
          </div>
          <ul className="lg:col-span-6 lg:col-start-7 self-end">
            {REQUIREMENTS.map((key) => (
              <li key={key} className="pillar py-4 font-serif text-[22px] text-navy">
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Commitments />
      <ClosingCta />
    </>
  );
}
