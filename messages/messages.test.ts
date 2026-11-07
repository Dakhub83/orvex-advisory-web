import { describe, expect, it } from "vitest";
import en from "./en.json";
import fr from "./fr.json";

function keys(node: object, prefix = ""): string[] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === "object" ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe("translations", () => {
  it("defines the same keys in English and French", () => {
    expect(keys(fr).sort()).toEqual(keys(en).sort());
  });
});
