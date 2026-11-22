import { describe, expect, it } from "vitest";
import {
  deriveHourStemIndex,
  deriveMonthStemIndex,
  getMonthBranchIndex,
  getEarthlyBranch,
  getHeavenlyStem,
  getMonthBranchIndex,
  isValidStemBranchPair
} from "./core.js";

describe("Gan-Zhi foundational tables", () => {
  it("maps all ten stems and twelve branches", () => {
    expect(Array.from({ length: 10 }, (_, i) => getHeavenlyStem(i))).toEqual(["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]);
    expect(Array.from({ length: 12 }, (_, i) => getEarthlyBranch(i))).toEqual(["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]);
    expect(getHeavenlyStem(10)).toBeNull();
    expect(getEarthlyBranch(-1)).toBeNull();
  });

  it("maps month numbers to 寅 through 丑", () => {
    expect(Array.from({ length: 12 }, (_, i) => getMonthBranchIndex(i + 1))).toEqual([2,3,4,5,6,7,8,9,10,11,0,1]);
    expect(getMonthBranchIndex(0)).toBeNull();
    expect(getMonthBranchIndex(13)).toBeNull();
  });
});

describe("Five Tigers formula (五虎遁)", () => {
  it("derives 寅月 stems for all year-stem groups", () => {
    expect(Array.from({ length: 10 }, (_, yearStem) => deriveMonthStemIndex(yearStem, 2))).toEqual([2,4,6,8,0,2,4,6,8,0]);
  });

  it("advances one stem for each month branch", () => {
    expect(Array.from({ length: 12 }, (_, i) => deriveMonthStemIndex(0, getMonthBranchIndex(i + 1)!))).toEqual([2,3,4,5,6,7,8,9,0,1,2,3]);
  });
});

describe("Five Rats formula (五鼠遁)", () => {
  it("derives 子时 stems for all day-stem groups", () => {
    expect(Array.from({ length: 10 }, (_, dayStem) => deriveHourStemIndex(dayStem, 0))).toEqual([0,2,4,6,8,0,2,4,6,8]);
  });

  it("advances one stem for each double-hour branch", () => {
    expect(Array.from({ length: 12 }, (_, i) => deriveHourStemIndex(0, i))).toEqual([0,1,2,3,4,5,6,7,8,9,0,1]);
  });
});

describe("stem-branch parity", () => {
  it("accepts same-polarity pairs and rejects impossible parity pairs", () => {
    expect(isValidStemBranchPair(0, 0)).toBe(true);
    expect(isValidStemBranchPair(1, 1)).toBe(true);
    expect(isValidStemBranchPair(0, 1)).toBe(false);
    expect(isValidStemBranchPair(10, 0)).toBe(false);
  });
});
