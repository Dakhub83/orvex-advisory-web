import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/sections/PageHeader";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("h1")} intro={t("body")} />
      <section className="gutter bg-paper">
        <div className="wrap py-14">
          <Link href="/" className="btn-navy text-[13px] uppercase px-7 py-4">{t("home")}</Link>
        </div>
      </section>
    </>
  );
}
