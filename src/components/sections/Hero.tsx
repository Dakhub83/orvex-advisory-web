import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GoldGrains } from "./GoldGrains";
import { GoldLeaf } from "./GoldLeaf";

export function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="bg-navy text-paper relative overflow-hidden">
      {/* Faint gold leaf across the whole banner, kept sparse so it does not compete with the grains. */}
      <GoldLeaf
        density={0.45}
        className="absolute inset-0 h-full w-full opacity-60 lg:mask-[linear-gradient(to_right,rgba(0,0,0,0.3),black_60%)]"
      />
      {/* Large screens: gold grains pouring onto a heap on the right, fading into the navy. */}
      <GoldGrains className="hidden lg:block absolute inset-y-0 right-0 h-full w-[56%] mask-[linear-gradient(to_right,transparent,black_40%)]" />

      <div className="gutter relative">
        <div className="wrap py-16 md:py-24">
          <div className="max-w-160 min-w-0 fade-in">
            {/* The page's main heading, styled as the small gold line. */}
            <h1 className="eyebrow text-gold">{t("eyebrow")}</h1>
            <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-white/75 measure font-light">
              {t("sub")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/inquiry" className="btn-gold text-[13px] uppercase px-7 py-4">{t("cta1")}</Link>
              <Link href="/compliance#protocol" className="btn-line text-[13px] uppercase px-7 py-4">{t("cta2")}</Link>
            </div>
            <p className="mt-8 text-[13px] text-white/55 measure flex gap-3">
              <span className="hairline mt-2.5 shrink-0" aria-hidden="true" />
              <span>{t("assure")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Smaller screens: a band of gold grains under the text. */}
      <GoldGrains className="lg:hidden relative h-72 sm:h-80 w-full mask-[linear-gradient(to_bottom,transparent,black_35%)]" />
    </section>
  );
}
