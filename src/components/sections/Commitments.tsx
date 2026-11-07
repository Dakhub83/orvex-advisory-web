import { useTranslations } from "next-intl";

const COMMITMENTS = ["c1", "c2", "c3", "c4", "c5"] as const;

export function Commitments() {
  const t = useTranslations("commitments");
  return (
    <section className="gutter bg-charcoal text-paper">
      <div className="wrap py-20 md:py-24">
        <p className="eyebrow text-gold">{t("eyebrow")}</p>
        <h2 className="mt-4 text-[30px] md:text-[38px] leading-tight">{t("h2")}</h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10">
          {COMMITMENTS.map((key) => (
            <div key={key} className="commit pt-5 min-w-0">
              <p className="font-serif text-[20px] text-gold">{t(`${key}.title`)}</p>
              <p className="mt-2 text-[14px] text-white/65">{t(`${key}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
