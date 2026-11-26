import { describe, expect, it } from "vitest";
import { TENSHO_1590_DAY_CYCLE_CROSS_CHECK as record } from "./tensho-1590-day-cycle-cross-check.js";
import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";

describe("Tensho 18 (1590) day-cycle cross-check", () => {
  it("preserves the published daily-calendar row and date/JDN identity", () => {
    expect(record.civilDate).toBe("1590-12-22");
    expect(record.historicalCalendarDate).toBe("Tensho 18, month 11, day 26");
    expect(record.publishedDayGanzhi).toBe("甲子");
    expect(record.publishedJulianDayNumber).toBe(2_302_151);
    expect(gregorianCivilDateToJdn(record.civilDate)).toBe(2_302_151);
    expect(gregorianCivilDateToJdn(record.civilDate)).toBe(record.projectComputedJdn);
    expect(record.source.pdfPageIndex).toBe(4);
    expect(record.source.publishedRow).toContain("1590.12.22");
  });

  it("matches the project's 1949 anchor arithmetic without granting historical gate credit", () => {
    const computedJdn = gregorianCivilDateToJdn(record.civilDate);
    expect(computedJdn).not.toBeNull();
    const offset = computedJdn! - record.projectAnchor.jdn;
    const cycleIndex = ((offset % 60) + 60) % 60;

    expect(cycleIndex).toBe(0);
    expect(record.assessment.status).toBe("computational_calendar_cross_check_candidate");
    expect(record.assessment.sourceDerivationIndependentlyVerified).toBe(false);
    expect(record.assessment.contemporaryMingPrimaryWitness).toBe(false);
    expect(record.assessment.historicalDayCycleGateCredit).toBe(false);
    expect(record.assessment.productionImpact).toBe("none");
  });
});
