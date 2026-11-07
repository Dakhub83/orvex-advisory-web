import { getTranslations } from "next-intl/server";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { PageHeader } from "@/components/sections/PageHeader";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { COMPLIANCE_EMAIL, INQUIRIES_EMAIL } from "@/lib/site";

const NEXT_STEPS = ["next1", "next2", "next3"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/inquiry">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "/inquiry", "inquiry");
}

export default async function InquiryPage() {
  const t = await getTranslations("inquiryPage");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <section className="gutter bg-paper">
        <div className="wrap py-16 md:py-20 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 min-w-0 relative">
            <InquiryForm />
          </div>
          <aside className="lg:col-span-5 min-w-0 space-y-10">
            <div>
              <h2 className="text-[24px] leading-tight text-navy">{t("nextH2")}</h2>
              <ol className="mt-4">
                {NEXT_STEPS.map((key, index) => (
                  <li key={key} className="pillar py-3 flex gap-4 text-[15px] text-slate">
                    <span className="step-num text-[20px] leading-6">{index + 1}</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 bg-mist p-4 text-[14px] text-charcoal">{t("noDocs")}</p>
            </div>
            <div id="contact">
              <h2 className="text-[24px] leading-tight text-navy">{t("contactH2")}</h2>
              <dl className="mt-4 space-y-3 text-[15px]">
                <div>
                  <dt className="text-slate">{t("contactInquiries")}</dt>
                  <dd>
                    <a className="text-navy border-b border-gold break-all" href={`mailto:${INQUIRIES_EMAIL}`}>
                      {INQUIRIES_EMAIL}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate">{t("contactCompliance")}</dt>
                  <dd>
                    <a className="text-navy border-b border-gold break-all" href={`mailto:${COMPLIANCE_EMAIL}`}>
                      {COMPLIANCE_EMAIL}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
