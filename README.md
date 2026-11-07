# Orvex & Co. Advisory website

Bilingual (EN/FR) marketing site with an inquiry form, built with Next.js (App Router), Tailwind CSS 4 and next-intl.

## Getting started

Requires Node.js 22 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Visitors are redirected to `/en` or `/fr` based on their saved choice, then their browser language.

| Command         | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Start the development server                     |
| `npm run build` | Create a production build                        |
| `npm run start` | Serve the production build                       |
| `npm run lint`  | Run ESLint                                       |
| `npm test`      | Run unit tests, including EN/FR translation parity |

## Project structure

```text
messages/                 All site copy: en.json and fr.json
src/app/[locale]/         Pages: home, services, compliance, about, inquiry, privacy, terms
src/app/[locale]/inquiry/actions.ts   Server action behind the form
src/components/layout/    Header, footer, fraud notice
src/components/sections/  Page sections shared between pages
src/components/inquiry/   Inquiry form
src/i18n/                 Locale routing and message loading
src/lib/inquiry/          Validation, rate limit and email delivery
src/app/globals.css       Brand tokens and component styles
docs/prototype/           The original exported prototype, for reference
```

## Editing copy

All visible text is in `messages/en.json` and `messages/fr.json`. Add every new key to both files; `npm test` fails if they differ.

## Inquiry form

Submissions are validated on the server and emailed through [Resend](https://resend.com) to `inquiries@orvexco.com`, with the visitor as reply-to. Nothing is stored by the site. To enable delivery:

1. Create a Resend account and verify the `orvexco.com` sending domain.
2. Set `RESEND_API_KEY` (see `.env.example`) in the hosting environment.

Without a key, development logs inquiries to the terminal, and production shows the visitor an error with the email address to write to. To change provider, edit `src/lib/inquiry/deliver.ts`.

The rate limit (5 submissions per IP per 10 minutes) is held in memory, so it applies per server instance. Use a shared store if the form attracts abuse.

## Deployment

The form needs a Node.js server, so the site cannot be deployed as a purely static export. Any host that runs Next.js works, such as Vercel. Set the variables from `.env.example` there.
