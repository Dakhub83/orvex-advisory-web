import { getTranslations } from "next-intl/server";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHeader } from "@/components/sections/PageHeader";
import { Pillars } from "@/components/sections/Pillars";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const MANDATES = ["dore", "permit"] as const;
const POINTS = ["b1", "b2", "b3", "b4"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "/services", "services");
}

export default async function ServicesPage() {
  const t = await getTranslations("servicesPage");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <section className="gutter bg-mist">
        <div className="wrap py-20 md:py-24">
          <div className="grid lg:grid-cols-2 gap-px bg-rule border border-rule">
            {MANDATES.map((mandate) => (
              <article key={mandate} id={mandate} className="bg-paper p-8 md:p-10 min-w-0">
                <p className="eyebrow text-slate">
                  {t("forLabel")} · {t(`${mandate}.audience`)}
                </p>
                <h2 className="mt-4 text-[30px] md:text-[34px] leading-tight text-navy">{t(`${mandate}.title`)}</h2>
                <p className="mt-4 text-[16px] text-slate">{t(`${mandate}.body`)}</p>
                <ul className="mt-6 space-y-3">
                  {POINTS.map((point) => (
                    <li key={point} className="pillar pt-3 text-[15px] text-charcoal">
                      {t(`${mandate}.${point}`)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Pillars />
      <ClosingCta />
    </>
  );
}
