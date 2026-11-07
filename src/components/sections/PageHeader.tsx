export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="bg-navy text-paper gutter">
      <div className="wrap py-16 md:py-20 fade-in">
        {eyebrow && <p className="eyebrow text-gold mb-5">{eyebrow}</p>}
        <h1 className="text-[36px] leading-[1.08] sm:text-[46px] lg:text-[54px] font-light max-w-[22ch]">{title}</h1>
        {intro && (
          <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-white/75 measure font-light">{intro}</p>
        )}
      </div>
    </section>
  );
}
