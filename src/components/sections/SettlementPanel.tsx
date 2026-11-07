import { useTranslations } from "next-intl";

export function SettlementPanel() {
  const t = useTranslations("flow");
  return (
    <div className="border border-gold/30 p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p id="flow-title" className="eyebrow text-gold">{t("title")}</p>
        <p className="text-[11px] tracking-[.14em] text-white/40 tabular-nums">12.37° N · 1.52° W</p>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <div className="flow-node px-4 py-4 flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[.14em] text-white/45">{t("from")}</p>
          <p className="font-serif text-[19px] mt-1 leading-tight">{t("buyer")}</p>
        </div>
        <div className="w-12 sm:w-16 flex items-center" aria-hidden="true"><span className="flow-arrow" /></div>
        <div className="flow-node border-gold/60 px-4 py-4 flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[.14em] text-white/45">{t("to")}</p>
          <p className="font-serif text-[19px] mt-1 leading-tight">{t("exporter")}</p>
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] text-gold/90 tracking-[.08em]">{t("direct")}</p>
      <div className="mt-7 border-t border-dashed border-white/20 pt-6 flex gap-4">
        <span className="font-serif italic text-gold text-[22px] leading-none mt-1" aria-hidden="true">O</span>
        <div>
          <p className="text-[14px] text-paper font-medium">{t("orvex")}</p>
          <p className="text-[13px] text-white/55 mt-1">{t("orvexSub")}</p>
        </div>
      </div>
      <dl className="mt-7 grid grid-cols-2 gap-px bg-white/10 text-[12px]">
        <div className="bg-navy p-3">
          <dt className="text-white/45 uppercase tracking-[.12em] text-[10px]">{t("terms")}</dt>
          <dd className="mt-1 text-paper">{t("termsValue")}</dd>
        </div>
        <div className="bg-navy p-3">
          <dt className="text-white/45 uppercase tracking-[.12em] text-[10px]">{t("assay")}</dt>
          <dd className="mt-1 text-paper">{t("assayValue")}</dd>
        </div>
      </dl>
    </div>
  );
}
