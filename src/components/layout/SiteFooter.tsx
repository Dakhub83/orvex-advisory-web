import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { COMPLIANCE_EMAIL, INQUIRIES_EMAIL } from "@/lib/site";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  return (
    <footer className="gutter bg-charcoal text-white/70">
      <div className="wrap py-14 grid sm:grid-cols-2 lg:grid-cols-12 gap-10 text-[14px]">
        <div className="lg:col-span-4 min-w-0">
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-[22px] text-paper">Orvex</span>
            <span className="font-serif italic text-gold text-[17px]">&amp; Co. Advisory</span>
          </p>
          <p className="mt-3 max-w-[34ch]">{t("line")}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="eyebrow text-gold text-[11px]">{t("services")}</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-paper" href="/services#dore">{t("s1")}</Link></li>
            <li><Link className="hover:text-paper" href="/services#permit">{t("s2")}</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="eyebrow text-gold text-[11px]">{t("firm")}</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-paper" href="/about">{nav("about")}</Link></li>
            <li><Link className="hover:text-paper" href="/compliance">{nav("compliance")}</Link></li>
            <li><Link className="hover:text-paper" href="/inquiry">{nav("portal")}</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-4 min-w-0">
          <p className="eyebrow text-gold text-[11px]">{t("contact")}</p>
          <ul className="mt-3 space-y-2 break-words">
            <li><a className="hover:text-paper" href={`mailto:${INQUIRIES_EMAIL}`}>{INQUIRIES_EMAIL}</a></li>
            <li><a className="hover:text-paper" href={`mailto:${COMPLIANCE_EMAIL}`}>{COMPLIANCE_EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap border-t border-white/10 py-8 text-[12px] leading-relaxed text-white/45">
        <p className="max-w-[110ch]">{t("legal")}</p>
        <p className="mt-4">
          {t("copyright")} · <Link className="hover:text-paper" href="/privacy">{t("privacy")}</Link> ·{" "}
          <Link className="hover:text-paper" href="/terms">{t("terms")}</Link>
        </p>
      </div>
    </footer>
  );
}
