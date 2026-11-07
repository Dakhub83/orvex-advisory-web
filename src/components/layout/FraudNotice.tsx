import { useTranslations } from "next-intl";
import { COMPLIANCE_EMAIL } from "@/lib/site";

export function FraudNotice() {
  const t = useTranslations("fraud");
  return (
    <div className="gutter bg-gold text-navy">
      <p className="wrap py-3 text-[13px] leading-snug">
        <span className="font-semibold uppercase tracking-[.12em] mr-2">{t("label")}</span>
        <span>{t("body")}</span>{" "}
        <a className="font-medium underline underline-offset-2" href={`mailto:${COMPLIANCE_EMAIL}`}>
          {COMPLIANCE_EMAIL}
        </a>
      </p>
    </div>
  );
}
