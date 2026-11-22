import { describe, expect, it } from "vitest";
import { getHiddenStems } from "./hidden-stems.js";

describe("Earthly Branch hidden stems", () => {
  it("retains the traditional ordered hidden-stem composition for all twelve branches", () => {
    const expected = [
      [["癸", "main_qi"]],
      [["己", "main_qi"], ["癸", "middle_qi"], ["辛", "residual_qi"]],
      [["甲", "main_qi"], ["丙", "middle_qi"], ["戊", "residual_qi"]],
      [["乙", "main_qi"]],
      [["戊", "main_qi"], ["乙", "middle_qi"], ["癸", "residual_qi"]],
      [["丙", "main_qi"], ["戊", "middle_qi"], ["庚", "residual_qi"]],
      [["丁", "main_qi"], ["己", "middle_qi"]],
      [["己", "main_qi"], ["丁", "middle_qi"], ["乙", "residual_qi"]],
      [["庚", "main_qi"], ["壬", "middle_qi"], ["戊", "residual_qi"]],
      [["辛", "main_qi"]],
      [["戊", "main_qi"], ["辛", "middle_qi"], ["丁", "residual_qi"]],
      [["壬", "main_qi"], ["甲", "middle_qi"]]
    ];
    for (let branch = 0; branch < 12; branch++) {
      expect(getHiddenStems(branch)?.map(entry => [entry.stem, entry.qiRole])).toEqual(expected[branch]);
    }
  });

  it("returns null for invalid branch indices", () => {
    expect(getHiddenStems(-1)).toBeNull();
    expect(getHiddenStems(12)).toBeNull();
    expect(getHiddenStems(1.5)).toBeNull();
  });
});
