import { useTranslations } from "next-intl";

function BankNode({ label, name, beneficiary }: { label: string; name: string; beneficiary?: boolean }) {
  return (
    <div className={`flow-node px-4 py-4 min-w-0 ${beneficiary ? "border-gold/60" : ""}`}>
      <p className="text-[11px] uppercase tracking-[.14em] text-white/45">{label}</p>
      <p className="font-serif text-[19px] mt-1 leading-tight">{name}</p>
    </div>
  );
}

function OrvexNode({ name, role }: { name: string; role: string }) {
  return (
    <div className="border border-dashed border-gold/70 bg-gold/[.06] px-5 py-3 text-center min-w-0">
      <p className="font-serif text-[17px] leading-tight">{name}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[.14em] text-gold">{role}</p>
    </div>
  );
}

/**
 * Funds move on the solid line, bank to bank. Orvex sits on a dashed branch
 * off that line: it coordinates, and its fee is paid under the IMFPA at
 * settlement, but no capital passes through it.
 *
 * The diagram runs left to right when its box is wide enough for the French
 * labels, and top to bottom when it is not (phones, and the narrow hero column
 * on smaller desktops).
 */
export function SettlementPanel() {
  const t = useTranslations("flow");
  const buyer = <BankNode label={t("from")} name={t("buyer")} />;
  const exporter = <BankNode label={t("to")} name={t("exporter")} beneficiary />;
  const orvex = <OrvexNode name={t("orvexNode")} role={t("orvexRole")} />;

  return (
    <div className="border border-gold/30 p-6 sm:p-8">
      <p id="flow-title" className="eyebrow text-gold">{t("title")}</p>

      <figure className="@container mt-8" aria-describedby="flow-legend">
        {/* Wide: buyer → exporter, with Orvex below the arrow. */}
        <div className="hidden @sm:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
            {buyer}
            <div className="relative w-16 flex items-center" aria-hidden="true">
              <span className="flow-arrow" />
              <span className="absolute left-1/2 top-1/2 bottom-0 border-l border-dashed border-gold/70" />
            </div>
            {exporter}
          </div>
          <div className="flex flex-col items-center">
            <span className="h-5 border-l border-dashed border-gold/70" aria-hidden="true" />
            {orvex}
          </div>
        </div>

        {/* Narrow: buyer above exporter, with Orvex beside the arrow. */}
        <div className="@sm:hidden">
          {buyer}
          <div className="grid grid-cols-[40px_1fr] items-center">
            <div className="relative h-24 flex justify-center" aria-hidden="true">
              <span className="flow-arrow-down" />
              <span className="absolute left-1/2 right-0 top-1/2 border-t border-dashed border-gold/70" />
            </div>
            <div className="flex items-center min-w-0">
              <span className="w-3 shrink-0 border-t border-dashed border-gold/70" aria-hidden="true" />
              {orvex}
            </div>
          </div>
          {exporter}
        </div>

        <figcaption id="flow-legend" className="mt-6 grid gap-2 text-[12px] text-white/65">
          <p className="flex items-center gap-3">
            <span className="w-8 h-px bg-gold shrink-0" aria-hidden="true" />
            <span className="min-w-0">{t("legendFunds")}</span>
          </p>
          <p className="flex items-center gap-3">
            <span className="w-8 border-t border-dashed border-gold/70 shrink-0" aria-hidden="true" />
            <span className="min-w-0">{t("legendOrvex")}</span>
          </p>
        </figcaption>
      </figure>

      <p className="mt-5 border-t border-dashed border-white/20 pt-5 text-[13px] text-white/55">
        {t.rich("orvexSub", {
          imfpa: (chunks) => (
            <abbr title={t("imfpaFull")} className="no-underline">
              {chunks}
            </abbr>
          ),
        })}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-px bg-white/10 text-[12px]">
        <div className="bg-navy p-3 min-w-0">
          <dt className="text-white/45 uppercase tracking-[.12em] text-[10px]">{t("terms")}</dt>
          <dd className="mt-1 text-paper">{t("termsValue")}</dd>
        </div>
        <div className="bg-navy p-3 min-w-0">
          <dt className="text-white/45 uppercase tracking-[.12em] text-[10px]">{t("assay")}</dt>
          <dd className="mt-1 text-paper">{t("assayValue")}</dd>
        </div>
      </dl>
    </div>
  );
}
