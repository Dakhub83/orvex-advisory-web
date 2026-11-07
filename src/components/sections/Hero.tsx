import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SettlementPanel } from "./SettlementPanel";

export function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="bg-navy text-paper gutter relative overflow-hidden">
      <div className="wrap grid lg:grid-cols-12 gap-12 lg:gap-16 py-16 md:py-24">
        <div className="lg:col-span-7 min-w-0 fade-in">
          <p className="eyebrow text-gold">{t("eyebrow")}</p>
          <h1 className="mt-6 text-[40px] leading-[1.06] sm:text-[54px] lg:text-[66px] font-light">{t("h1")}</h1>
          <p className="mt-7 text-[17px] md:text-[18px] leading-relaxed text-white/75 measure font-light">{t("sub")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/inquiry" className="btn-gold text-[13px] uppercase px-7 py-4">{t("cta1")}</Link>
            <Link href="/compliance#protocol" className="btn-line text-[13px] uppercase px-7 py-4">{t("cta2")}</Link>
          </div>
          <p className="mt-8 text-[13px] text-white/55 measure flex gap-3">
            <span className="hairline mt-[10px] shrink-0" aria-hidden="true" />
            <span>{t("assure")}</span>
          </p>
        </div>
        <aside className="lg:col-span-5 min-w-0 self-center fade-in d2" aria-labelledby="flow-title">
          <SettlementPanel />
        </aside>
      </div>
    </section>
  );
}
