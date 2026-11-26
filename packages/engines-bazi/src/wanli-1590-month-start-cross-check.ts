import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";
import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

/**
 * Modern reconstruction cross-check of the twelve 1590 Wanli 18 lunar
 * month starts. Dates are the modern Gregorian projection published by
 * Y. T. Liu's historical Chinese-calendar tables; Ganzhi labels are the
 * source's listed day-cycle labels on each new-moon date.
 *
 * This is not a transcription of the 1590 Ming almanac daily pages.
 * It checks internal arithmetic and calendar-structure consistency only.
 */
export const WANLI_1590_MONTH_START_CANDIDATES = [
  { month: 1, civilDate: "1590-02-05", ganzhi: "甲辰", cycleIndex: 40 },
  { month: 2, civilDate: "1590-03-06", ganzhi: "癸酉", cycleIndex: 9 },
  { month: 3, civilDate: "1590-04-04", ganzhi: "壬寅", cycleIndex: 38 },
  { month: 4, civilDate: "1590-05-04", ganzhi: "壬申", cycleIndex: 8 },
  { month: 5, civilDate: "1590-06-02", ganzhi: "辛丑", cycleIndex: 37 },
  { month: 6, civilDate: "1590-07-02", ganzhi: "辛未", cycleIndex: 7 },
  { month: 7, civilDate: "1590-07-31", ganzhi: "庚子", cycleIndex: 36 },
  { month: 8, civilDate: "1590-08-30", ganzhi: "庚午", cycleIndex: 6 },
  { month: 9, civilDate: "1590-09-29", ganzhi: "庚子", cycleIndex: 36 },
  { month: 10, civilDate: "1590-10-28", ganzhi: "己巳", cycleIndex: 5 },
  { month: 11, civilDate: "1590-11-27", ganzhi: "己亥", cycleIndex: 35 },
  { month: 12, civilDate: "1590-12-27", ganzhi: "己巳", cycleIndex: 5 }
] as const;

export const WANLI_1590_MONTH_START_CROSS_CHECKS = WANLI_1590_MONTH_START_CANDIDATES.map((entry, index, entries) => {
  const jdn = gregorianCivilDateToJdn(entry.civilDate);
  const project = jdn === null ? null : resolveSexagenaryDayFromJdn(jdn, {
    anchorJdn: 2_433_191,
    anchorCycleIndex: 0
  });
  const next = entries[index + 1];
  const nextJdn = next ? gregorianCivilDateToJdn(next.civilDate) : null;
  const intervalDays = jdn !== null && nextJdn !== null ? nextJdn - jdn : null;
  return {
    ...entry,
    jdn,
    projectCycleIndex: project?.cycleIndex ?? null,
    projectGanzhi: project ? `${project.stem}${project.branch}` : null,
    projectMatchesPublishedGanzhi: project !== null
      && project.cycleIndex === entry.cycleIndex
      && `${project.stem}${project.branch}` === entry.ganzhi,
    daysUntilNextMonth: intervalDays,
    plausibleLunarMonthLength: next ? intervalDays === 29 || intervalDays === 30 : null
  };
});

export const WANLI_1590_TARGET_DATE_CROSS_CHECK = (() => {
  const jdn = gregorianCivilDateToJdn("1590-12-22");
  const project = jdn === null ? null : resolveSexagenaryDayFromJdn(jdn, {
    anchorJdn: 2_433_191,
    anchorCycleIndex: 0
  });
  return {
    civilDate: "1590-12-22",
    jdn,
    expectedGanzhiFromPublishedMonthStartSequence: "甲子",
    projectGanzhi: project ? `${project.stem}${project.branch}` : null,
    projectCycleIndex: project?.cycleIndex ?? null,
    daysAfterEleventhMonthStart: 25,
    daysBeforeTwelfthMonthStart: 5,
    status: "modern_calendar_reconstruction_cross_check_only"
  };
})();

export const WANLI_1590_MONTH_START_SOURCE_STATUS = {
  sourceId: "yt-liu-ming-calendar-table-1590",
  title: "Y. T. Liu, Chinese Calendar Tables — Ming Period",
  url: "https://ytliu0.github.io/ChineseCalendar/table_period_chinese.html?period=ming",
  sourceType: "modern_historical_calendar_reconstruction",
  originalMingDailyPageInspected: false,
  independentPrimaryWitness: false,
  historicalDayCycleGateCredit: false,
  notes: [
    "The twelve month-start dates and Ganzhi labels are transcribed from the modern reconstruction table, not from the 1590 Ming almanac.",
    "Month-to-month intervals are checked as 29 or 30 days and each published Ganzhi label is checked against the configured 1949 arithmetic anchor.",
    "The target 1590-12-22 = 甲子 is also reported by the modern Japanese calendar compilation, but agreement between modern reconstructions is not a contemporary Ming primary witness.",
    "The original 1590 almanac leaf still requires direct collation."
  ]
} as const;
