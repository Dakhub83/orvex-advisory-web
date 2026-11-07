import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export const STAGES = [
  { key: "s1", numeral: "I" },
  { key: "s2", numeral: "II" },
  { key: "s3", numeral: "III" },
  { key: "s4", numeral: "IV" },
  { key: "s5", numeral: "V" },
] as const;

/** Five-column summary for the home page; the full protocol is on /compliance. */
export function Stages() {
  const t = useTranslations("stages");
  return (
    <section className="gutter bg-mist">
      <div className="wrap py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[30px] md:text-[40px] leading-tight text-navy max-w-[22ch]">{t("h2")}</h2>
          <Link
            href="/compliance#protocol"
            className="text-[13px] uppercase tracking-[.12em] text-navy border-b border-gold pb-1"
          >
            {t("link")}
          </Link>
        </div>
        <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-rule border border-rule">
          {STAGES.map(({ key, numeral }) => (
            <li key={key} className="bg-paper p-6 min-w-0">
              <span className="step-num text-[34px]">{numeral}</span>
              <p className="mt-4 font-medium text-navy">{t(`${key}.title`)}</p>
              <p className="mt-1 text-[14px] text-slate">{t(`${key}.body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
