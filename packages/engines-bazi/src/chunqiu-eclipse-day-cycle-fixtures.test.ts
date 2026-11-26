import { describe, expect, it } from "vitest";
import {
  CHUNQIU_ECLIPSE_DAY_CYCLE_RECORDS,
  CHUNQIU_525_BCE_ECLIPSE_DATE_DISCREPANCY
} from "./chunqiu-eclipse-day-cycle-fixtures.js";

describe("Chunqiu historical day-cycle reference set", () => {
  it("contains all 31 dated cyclical-day records transcribed from the 1992 study", () => {
    expect(CHUNQIU_ECLIPSE_DAY_CYCLE_RECORDS).toHaveLength(31);
    expect(CHUNQIU_ECLIPSE_DAY_CYCLE_RECORDS.every((record) => record.jdn !== null)).toBe(true);
  });

  it("matches every published Table 3 cycle-day index against the 1949 Jiazi anchor", () => {
    const mismatches = CHUNQIU_ECLIPSE_DAY_CYCLE_RECORDS.filter(
      (record) => !record.matchesPublishedCycleDay
    );
    expect(mismatches).toEqual([]);
  });

  it("reproduces the first historical record as 720 BCE February 22, JDN 1458496, 己巳", () => {
    const first = CHUNQIU_ECLIPSE_DAY_CYCLE_RECORDS.find((record) => record.referenceNumber === 1);
    expect(first?.astronomicalYear).toBe(-719);
    expect(first?.jdn).toBe(1_458_496);
    expect(first?.publishedCycleDayIndex1Based).toBe(6);
    expect(first?.computedGanzhi).toBe("己巳");
  });

  it("preserves the paper's one-day eclipse-event discrepancy for 525 BCE", () => {
    expect(CHUNQIU_525_BCE_ECLIPSE_DATE_DISCREPANCY.recordedCycleDayIndex1Based).toBe(11);
    expect(CHUNQIU_525_BCE_ECLIPSE_DATE_DISCREPANCY.calculatedEclipseCycleDayIndex1Based).toBe(10);
    expect(CHUNQIU_525_BCE_ECLIPSE_DATE_DISCREPANCY.note).toContain("one Chunqiu eclipse");
  });
});
