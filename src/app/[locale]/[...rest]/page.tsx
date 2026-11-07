import { notFound } from "next/navigation";

// Routes unknown paths under a locale to the translated [locale]/not-found page.
export default function CatchAllPage() {
  notFound();
}
