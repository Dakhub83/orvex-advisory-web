@AGENTS.md

# Orvex & Co. Advisory website

Bilingual (EN/FR) marketing site with an inquiry form. Next.js 16 App Router, Tailwind CSS 4, next-intl 4. See [README.md](README.md) for setup and project structure.

## Commands

```bash
npm run dev     # development server
npm test        # unit tests, including EN/FR key parity
npm run lint
npx tsc --noEmit
npm run build
```

Run tests, type checks and lint before committing. Run a build as well when changing layouts, routing or i18n: a broken provider or locale setup passes type checks and only fails when pages are prerendered.

## Content rules

This site makes regulated-sounding claims for a high-scrutiny business, so copy needs care.

- All visible text belongs in `messages/en.json` and `messages/fr.json`. Never hardcode it in components, and add every key to both files.
- Never invent firm facts: team members, offices, licences, client names, statistics or track record. Use only what the owner has supplied, and ask if something is missing.
- Keep the non-custodial position consistent. Orvex never takes title to metal, never holds funds and is not a party to any sale.
- The home page copy, EN and FR, comes verbatim from the prototype in `docs/prototype/`. Copy on other pages, including legal pages, is draft until the owner confirms it has been reviewed.

## i18n

- `src/i18n/request.ts` reads the locale from `next/root-params`. Do not add `setRequestLocale`, which is deprecated.
- `next/root-params` does not work in Server Actions. An action receives the locale as a form field, and client components translate the error codes it returns.
- Add new pages to the `NAV_ITEMS` list in `SiteHeader.tsx` if they need a nav link, and to `PATHS` in `src/app/sitemap.ts`.
- Give each page a `generateMetadata` that calls `pageMetadata` from `src/lib/metadata.ts`, for canonical and hreflang links.
- `NextIntlClientProvider` must wrap all page content, including the footer: next-intl's `Link` uses it even when rendered from a Server Component.
- The provider only receives the `nav` and `form` namespaces. A new client component that uses another namespace must add it in `src/app/[locale]/layout.tsx`.
- Use `Link` from `@/i18n/navigation`, not `next/link`, for internal links.

## Inquiry form

- Never show the success message unless the email was accepted by the provider. `deliverInquiry` throws on failure, and in production it throws when `RESEND_API_KEY` is missing. Keep this behaviour.
- The form must keep working without JavaScript, so keep submitting through the server action in `src/app/[locale]/inquiry/actions.ts`.
- Field errors are codes, such as `required`, and are translated under `form.errors`.
- The form must not collect KYC documents or bank details.
- Inquiries contain personal data. Do not log them in production, and do not persist them in the repository.

## Gold price strip

The strip above the menu shows the goldprice.dev XAU/USD spot price ([gold-price.ts](src/lib/gold-price.ts)). Their terms set these rules:

- Keep the "Data: goldprice.dev" link next to the prices while on a free plan or keyless.
- Do not expose the price through a public API route of our own: that counts as redistribution. Render it on the server.
- Never present it as an official benchmark or as Orvex's price. Keep the "indicative" and "not an offer" labels.
- Never show a placeholder or invented price. If the provider fails, show the unavailable message.
- The "delayed 15 min" wording assumes a free plan. Update it if a paid, live plan is used.

## Styling

- Brand tokens and shared component classes are in `src/app/globals.css`. Prefer them over new colours.
- The site has one fixed light look, so there is no dark theme.

## Next.js configuration

`cacheComponents` and `partialPrefetching` are deliberately off: pages are statically generated, and they are not needed. Both become mandatory in the next major version of Next.js, so that upgrade will need a migration.

## Local verification

- Only one `next dev` can run per project; a second one exits and reports the existing server.
- If `next start` reports `EADDRINUSE`, an older server is still answering on that port and will serve the old build. Confirm that the served HTML contains the change before trusting a browser check.
- When stopping a server, target its exact PID.
