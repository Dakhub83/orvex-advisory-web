import { describe, expect, it } from "vitest";
import en from "./en.json";
import fr from "./fr.json";

function keys(node: object, prefix = ""): string[] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === "object" ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

function entries(node: object, prefix = ""): [string, string][] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === "object" ? entries(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value as string]],
  );
}

describe("translations", () => {
  it("defines the same keys in English and French", () => {
    expect(keys(fr).sort()).toEqual(keys(en).sort());
  });

  // In ICU messages a single apostrophe before "<" or "{" starts an escape, so
  // "l'<tag>" shows the tag as text. Write "l''<tag>" instead.
  it("has no apostrophe that would escape a tag or placeholder", () => {
    const broken = [...entries(en), ...entries(fr)]
      .filter(([, text]) => /(^|[^'])'[<{]/.test(text))
      .map(([key]) => key);
    expect(broken).toEqual([]);
  });
});
