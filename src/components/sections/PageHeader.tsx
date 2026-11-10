import { GoldLeaf } from "./GoldLeaf";

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="bg-navy text-paper gutter relative overflow-hidden">
      <GoldLeaf density={0.6} className="absolute inset-0 h-full w-full opacity-70 lg:opacity-100 lg:mask-[linear-gradient(to_right,rgba(0,0,0,0.3),black_60%)]" />
      <div className="wrap py-16 md:py-20 fade-in relative">
        {eyebrow && <p className="eyebrow text-gold mb-5">{eyebrow}</p>}
        <h1 className="text-[36px] leading-[1.08] sm:text-[46px] lg:text-[54px] font-light max-w-[22ch]">{title}</h1>
        {intro && (
          <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-white/75 measure font-light">{intro}</p>
        )}
      </div>
    </section>
  );
}
