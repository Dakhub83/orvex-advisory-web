import { ClosingCta } from "@/components/sections/ClosingCta";
import { Commitments } from "@/components/sections/Commitments";
import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { Stages } from "@/components/sections/Stages";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "");
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <Commitments />
      <Stages />
      <ClosingCta />
    </>
  );
}
