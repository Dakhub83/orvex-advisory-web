import { Fragment } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { getGoldPrice } from "@/lib/gold-price";
import { GoldTickerRefresh } from "./GoldTickerRefresh";

/** How many copies of the item set make up half the tape; enough to span wide screens. */
const COPIES = 4;

/**
 * Slim ticker tape above the masthead with the indicative gold spot price.
 * The label and the provider credit stay fixed; the prices roll in between.
 */
export async function GoldTicker() {
  const [price, t, locale] = await Promise.all([getGoldPrice(), getTranslations("goldTicker"), getLocale()]);

  const usd = (value: number, digits: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  const time = price?.asOf
    ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(new Date(price.asOf))
    : null;

  const items = price
    ? [
        <>
          <span className="text-paper font-medium">{usd(price.perOunce, 2)}</span> {t("perOunce")}
        </>,
        <>
          <span className="text-paper">{usd(price.perGram, 2)}</span> {t("perGram")}
        </>,
        <>
          <span className="text-paper">{usd(price.perKilogram, 0)}</span> {t("perKilogram")}
        </>,
        ...(time ? [<span key="time" className="text-white/50">{t(price.stale ? "stale" : "updated", { time })}</span>] : []),
        <span key="disclaimer" className="text-white/50">{t("disclaimer")}</span>,
        <span key="offer" className="text-white/50">{t("notOffer")}</span>,
      ]
    : null;

  const itemSet = (copy: number) =>
    items?.map((item, i) => (
      <Fragment key={`${copy}-${i}`}>
        <span className="tabular-nums whitespace-nowrap">{item}</span>
        <span className="text-gold/70 text-[8px]" aria-hidden="true">◆</span>
      </Fragment>
    ));

  // Read once by screen readers, instead of the repeating tape.
  const summary = price
    ? [
        `${usd(price.perOunce, 2)} ${t("perOunce")}`,
        `${usd(price.perGram, 2)} ${t("perGram")}`,
        `${usd(price.perKilogram, 0)} ${t("perKilogram")}`,
        time ? t(price.stale ? "stale" : "updated", { time }) : "",
        t("disclaimer"),
        t("notOffer"),
      ]
        .filter(Boolean)
        .join(". ")
    : t("unavailable");

  return (
    <aside aria-label={t("label")} className="bg-[#071120] border-b border-gold/20 text-[12px] text-white/70">
      <div className="flex items-stretch h-9">
        <span className="eyebrow text-[10px] text-gold whitespace-nowrap flex items-center pl-4 md:pl-10 pr-4 border-r border-gold/20 bg-[#071120] relative z-10">
          <span className="hidden sm:inline">{t("label")}&nbsp;·&nbsp;</span>XAU/USD
        </span>

        <p className="sr-only">{summary}</p>
        {items ? (
          <div className="tape relative flex-1 min-w-0 overflow-hidden" aria-hidden="true">
            {/* Two identical halves: sliding by half the width loops seamlessly. */}
            <div className="tape-track flex items-center h-full">
              {[0, 1].map((half) => (
                <div key={half} className="flex items-center gap-x-5 pr-5 shrink-0">
                  {Array.from({ length: COPIES }, (_, copy) => itemSet(half * COPIES + copy))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <span className="flex-1 min-w-0 flex items-center px-4 truncate" aria-hidden="true">
            {t("unavailable")}
          </span>
        )}

        {/* Credit link required by goldprice.dev's free tier, next to the prices. Kept still so it is easy to read and click. */}
        <a
          href="https://goldprice.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap flex items-center pl-4 pr-4 md:pr-10 border-l border-gold/20 bg-[#071120] relative z-10 text-white/50 underline underline-offset-2 hover:text-paper"
        >
          {t("source")}
        </a>
      </div>
      <GoldTickerRefresh />
    </aside>
  );
}
