import { describe, expect, it } from "vitest";
import { deriveTenGod, deriveTenGodByStem } from "./ten-gods.js";

describe("Ten-God derivation", () => {
  it("uses element relationship and Yin/Yang polarity together", () => {
    // 甲木 Day Master
    expect(deriveTenGod(0, 0)).toBe("比肩");
    expect(deriveTenGod(0, 1)).toBe("劫财");
    expect(deriveTenGod(0, 2)).toBe("食神");
    expect(deriveTenGod(0, 3)).toBe("伤官");
  });

  it("derives all ten relationship categories from a 甲木 Day Master", () => {
    expect(Array.from({ length: 10 }, (_, i) => deriveTenGod(0, i))).toEqual([
      "比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"
    ]);
  });

  it("returns stem labels with the derived relation", () => {
    expect(deriveTenGodByStem(0, 2)).toEqual({ dayMaster: "甲", target: "丙", tenGod: "食神" });
  });

  it("rejects invalid stem indices", () => {
    expect(deriveTenGod(-1, 0)).toBeNull();
    expect(deriveTenGod(0, 10)).toBeNull();
  });
});
