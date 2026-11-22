import { describe, expect, it } from "vitest";
import { deriveHiddenStemTenGods } from "./hidden-stem-ten-gods.js";

describe("Ten Gods assigned to hidden stems", () => {
  it("derives each hidden stem's Ten God relative to the Day Master", () => {
    expect(deriveHiddenStemTenGods(0, 2)).toEqual([
      { stemIndex: 0, stem: "甲", qiRole: "main_qi", tenGod: "比肩" },
      { stemIndex: 2, stem: "丙", qiRole: "middle_qi", tenGod: "食神" },
      { stemIndex: 4, stem: "戊", qiRole: "residual_qi", tenGod: "偏财" }
    ]);
  });

  it("preserves qi order and rejects invalid inputs", () => {
    expect(deriveHiddenStemTenGods(0, 0)?.map(item => item.tenGod)).toEqual(["正印"]);
    expect(deriveHiddenStemTenGods(-1, 0)).toBeNull();
    expect(deriveHiddenStemTenGods(0, 12)).toBeNull();
  });
});
