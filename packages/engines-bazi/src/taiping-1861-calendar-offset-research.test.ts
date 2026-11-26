import { describe, expect, it } from "vitest";
import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";
import {
  getTaipingCalendarCycleIndex,
  getTaipingCalendarDayOfYear,
  TAIPING_1861_CALENDAR_OFFSET_RESEARCH as research
} from "./taiping-1861-calendar-offset-research.js";

describe("Taiping 1861 calendar one-day offset research", () => {
  it("preserves the published 1861 year-start crosswalk and distinguishes date offset from cycle-index offset", () => {
    expect(research.publishedYearStartCrosswalk.taipingGanzhi).toBe("庚寅");
    expect(research.publishedYearStartCrosswalk.gregorianDate).toBe("1861-02-09");
    expect(research.publishedYearStartCrosswalk.qingLunarGanzhi).toBe("己丑");
    expect(research.proposedNewYear.taipingCycleIndex).toBe(26);
    expect(research.proposedNewYear.conventionalGregorianCycleIndex).toBe(25);
    expect(research.proposedNewYear.labelOffset).toBe("one_cycle_index_higher_on_the_same_gregorian_date");
    expect(research.proposedNewYear.calendarDateAlignment).toContain("one_day_earlier");
    expect(research.calendarStructure.daysPerYear).toBe(366);
    expect(research.calendarStructure.monthLengths.reduce((sum, length) => sum + length, 0)).toBe(366);
  });

  it("maps the Gregorian target date to the candidate Taiping month/day under the revised year start", () => {
    expect(research.proposedNewYear.gregorianDate).toBe("1861-02-09");
    expect(research.proposedNewYear.taipingGanzhi).toBe("庚寅");
    expect(research.proposedNewYear.conventionalGregorianGanzhi).toBe("己丑");
    expect(getTaipingCalendarDayOfYear(10, 1)).toBe(276);
    expect(research.targetDateMapping.taipingMonth).toBe(10);
    expect(research.targetDateMapping.taipingDay).toBe(1);
    expect(research.targetDateMapping.candidateGanzhi).toBe("乙丑");
    expect(research.targetDateMapping.candidateCycleIndex).toBe(1);
    expect(gregorianCivilDateToJdn("1861-11-11")).toBe(2_401_091);
    expect(research.targetDateMapping.conventionalGregorianGanzhi).toBe("甲子");
    expect(research.targetDateMapping.conventionalGregorianCycleIndex).toBe(0);
  });

  it("reproduces the two historical day-label cross-checks without granting source-gate credit", () => {
    expect(getTaipingCalendarCycleIndex(26, 9, 11)).toBe(40);
    expect(research.pageFragmentCompatibilityCheck.observedDayStem).toBe("甲");
    expect(research.pageFragmentCompatibilityCheck.observedLunarMansion).toBe("翼");
    expect(research.pageFragmentCompatibilityCheck.derivedCandidateGanzhi).toBe("甲辰");
    expect(research.pageFragmentCompatibilityCheck.earthlyBranchVisible).toBe(false);
    expect(research.pageFragmentCompatibilityCheck.interpretation).toContain("not a complete pair printed");
    expect(research.pageFragmentCompatibilityCheck.candidateGregorianDate).toBe("1861-10-21");
    expect(getTaipingCalendarCycleIndex(26, 11, 10)).toBe(40);
    expect(research.independentHistoricalCrossCheck.publishedGregorianDate).toBe("1861-12-20");
    expect(research.assessment.originalMonthTenLeafCollated).toBe(false);
    expect(research.assessment.originalDayLabelForGregorianTargetVerified).toBe(false);
    expect(research.assessment.historicalDayCycleGateCredit).toBe(false);
    expect(research.assessment.productionImpact).toBe("none");
  });

  it("rejects dates outside the 366-day calendar's month/day bounds", () => {
    expect(getTaipingCalendarDayOfYear(13, 1)).toBeNull();
    expect(getTaipingCalendarDayOfYear(1, 32)).toBeNull();
    expect(getTaipingCalendarCycleIndex(60, 1, 1)).toBeNull();
  });
});
