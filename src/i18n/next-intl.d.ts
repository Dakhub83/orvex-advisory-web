import type messages from "../../messages/en.json";
import type { routing } from "./routing";

// Makes translation keys type-checked against messages/en.json.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
