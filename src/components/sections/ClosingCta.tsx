import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ClosingCta() {
  const t = useTranslations("cta");
  return (
    <section className="gutter bg-navy text-paper">
      <div className="wrap py-20 md:py-24 grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-7 min-w-0">
          <div className="hairline mb-6" aria-hidden="true" />
          <h2 className="text-[32px] md:text-[44px] leading-[1.1]">{t("h2")}</h2>
          <p className="mt-5 text-[17px] text-white/70 measure font-light">{t("body")}</p>
        </div>
        <div className="lg:col-span-5 flex flex-wrap gap-4 lg:justify-end">
          <Link href="/inquiry" className="btn-gold text-[13px] uppercase px-7 py-4">{t("button1")}</Link>
          <Link href="/inquiry#contact" className="btn-line text-[13px] uppercase px-7 py-4">{t("button2")}</Link>
        </div>
      </div>
    </section>
  );
}
