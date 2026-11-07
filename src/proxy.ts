import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Sends unprefixed URLs to /en or /fr, based on the visitor's saved choice and
// then their browser language.
export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
