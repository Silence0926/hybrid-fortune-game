import { describe, expect, it } from "vitest";
import {
  WANLI_1590_MONTH_START_CANDIDATES,
  WANLI_1590_MONTH_START_CROSS_CHECKS,
  WANLI_1590_MONTH_START_SOURCE_STATUS,
  WANLI_1590_TARGET_DATE_CROSS_CHECK
} from "./wanli-1590-month-start-cross-check.js";

describe("Wanli 18 (1590) month-start reconstruction cross-check", () => {
  it("contains twelve ordered month-start candidates", () => {
    expect(WANLI_1590_MONTH_START_CANDIDATES).toHaveLength(12);
    expect(WANLI_1590_MONTH_START_CANDIDATES.map((entry) => entry.month))
      .toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
  });

  it("checks each published month-start Ganzhi against configured JDN arithmetic", () => {
    expect(WANLI_1590_MONTH_START_CROSS_CHECKS).toHaveLength(12);
    for (const entry of WANLI_1590_MONTH_START_CROSS_CHECKS) {
      expect(entry.jdn).not.toBeNull();
      expect(entry.projectMatchesPublishedGanzhi).toBe(true);
      if (entry.month < 12) expect(entry.plausibleLunarMonthLength).toBe(true);
    }
  });

  it("preserves the 29/30-day intervals between consecutive new moons", () => {
    expect(WANLI_1590_MONTH_START_CROSS_CHECKS.slice(0, 11).map((entry) => entry.daysUntilNextMonth))
      .toEqual([29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30]);
  });

  it("cross-checks 1590-12-22 as 甲子 without treating it as primary evidence", () => {
    expect(WANLI_1590_TARGET_DATE_CROSS_CHECK.jdn).toBe(2_302_151);
    expect(WANLI_1590_TARGET_DATE_CROSS_CHECK.projectGanzhi).toBe("甲子");
    expect(WANLI_1590_TARGET_DATE_CROSS_CHECK.projectCycleIndex).toBe(0);
    expect(WANLI_1590_TARGET_DATE_CROSS_CHECK.daysAfterEleventhMonthStart).toBe(25);
    expect(WANLI_1590_TARGET_DATE_CROSS_CHECK.daysBeforeTwelfthMonthStart).toBe(5);
    expect(WANLI_1590_MONTH_START_SOURCE_STATUS.originalMingDailyPageInspected).toBe(false);
    expect(WANLI_1590_MONTH_START_SOURCE_STATUS.historicalDayCycleGateCredit).toBe(false);
  });
});
