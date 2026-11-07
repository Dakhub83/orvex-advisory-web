import { useTranslations } from "next-intl";

const PILLARS = ["p1", "p2", "p3", "p4"] as const;

export function Pillars() {
  const t = useTranslations("pillars");
  return (
    <section className="gutter bg-paper">
      <div className="wrap py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 min-w-0">
            <p className="eyebrow text-gold">{t("eyebrow")}</p>
            <h2 className="mt-4 text-[32px] md:text-[42px] leading-[1.12] text-navy">{t("h2")}</h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 self-end text-[17px] text-slate measure min-w-0">{t("intro")}</p>
        </div>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {PILLARS.map((key) => (
            <article key={key} className="pillar pt-6 min-w-0">
              <h3 className="text-[22px] leading-snug text-navy">{t(`${key}.title`)}</h3>
              <p className="mt-3 text-[15px] text-slate">{t(`${key}.body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
