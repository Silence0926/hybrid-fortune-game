import { describe, expect, it } from "vitest";
import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";
import {
  LIU_2019_FORMULA_CROSS_CHECK,
  LIU_2019_FORMULA_SOURCE_STATUS,
  publishedSexagenaryIndexFromJdn
} from "./day-cycle-independent-formula-cross-check.js";

describe("published sexagenary JDN formula cross-check", () => {
  it("reproduces the published 2019 Jiazi formula anchor", () => {
    expect(gregorianCivilDateToJdn("2019-01-27")).toBe(2_458_511);
    expect(publishedSexagenaryIndexFromJdn(2_458_511)).toBe(1);
  });

  it("reproduces the published 1781 Ren-Xu worked example", () => {
    expect(gregorianCivilDateToJdn("1781-03-13")).toBe(2_371_629);
    expect(publishedSexagenaryIndexFromJdn(2_371_629)).toBe(59);
  });

  it("matches both independent published examples with the project's 1949 anchor", () => {
    expect(LIU_2019_FORMULA_CROSS_CHECK).toHaveLength(2);
    expect(LIU_2019_FORMULA_CROSS_CHECK.every((item) => item.publishedFormulaMatchesReference)).toBe(true);
    expect(LIU_2019_FORMULA_CROSS_CHECK.every((item) => item.projectMatchesReference)).toBe(true);
    expect(LIU_2019_FORMULA_CROSS_CHECK.every((item) => item.formulaAndProjectAgree)).toBe(true);
    expect(LIU_2019_FORMULA_CROSS_CHECK.map((item) => item.projectGanzhi)).toEqual(["甲子", "壬戌"]);
  });

  it("does not misclassify a published formula as an independent historical witness", () => {
    expect(LIU_2019_FORMULA_SOURCE_STATUS.independentHistoricalWitness).toBe(false);
    expect(LIU_2019_FORMULA_SOURCE_STATUS.verificationStatus)
      .toBe("published_formula_and_examples_reproduced");
  });

  it("rejects unsafe JDN input", () => {
    expect(publishedSexagenaryIndexFromJdn(Number.NaN)).toBeNull();
    expect(publishedSexagenaryIndexFromJdn(1.5)).toBeNull();
  });
});
