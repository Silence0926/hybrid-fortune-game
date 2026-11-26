/**
 * Alternative Chunqiu-calendar reconstruction cross-check.
 *
 * Source: Y. T. Liu, "Reconstruction of the Chunqiu Calendar" (first draft 2019),
 * which explicitly reconstructs the calendar using the method and Table 3-5
 * of Zhang Peiyu et al., Ancient Chinese Calendars and Almanacs (2008).
 *
 * These are New Year dates and cycle names from that reconstructed calendar.
 * This is a separate computational reconstruction, but not an independent
 * primary witness: its scholarly lineage overlaps the Zhang Peiyu research
 * used by other Chunqiu chronology studies. Do not count it as an independent
 * source family for release gating.
 */
import { astronomicalYearFromBceYear, julianAstronomicalDateToJdn } from "./julian-jdn.js";
import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

const SOURCE_ROWS = [
  { calendarYear: "N_-721", yearBce: 722, month: 1, day: 16, publishedGanzhi: "辛巳", publishedCycleIndex: 17 },
  { calendarYear: "N_-720", yearBce: 721, month: 1, day: 5, publishedGanzhi: "乙亥", publishedCycleIndex: 11 },
  { calendarYear: "N_-719", yearBce: 720, month: 1, day: 23, publishedGanzhi: "己亥", publishedCycleIndex: 35 },
  { calendarYear: "N_-718", yearBce: 719, month: 1, day: 12, publishedGanzhi: "癸巳", publishedCycleIndex: 29 },
  { calendarYear: "N_-717", yearBce: 718, month: 1, day: 2, publishedGanzhi: "戊子", publishedCycleIndex: 24 },
  { calendarYear: "N_-716", yearBce: 717, month: 1, day: 21, publishedGanzhi: "壬子", publishedCycleIndex: 48 },
  { calendarYear: "N_-649", yearBce: 651, month: 12, day: 31, publishedGanzhi: "癸未", publishedCycleIndex: 19 }
] as const;

export const CHUNQIU_CALENDAR_MODEL_CROSS_CHECKS = SOURCE_ROWS.map((row) => {
  const astronomicalYear = astronomicalYearFromBceYear(row.yearBce);
  const jdn = astronomicalYear === null
    ? null
    : julianAstronomicalDateToJdn(astronomicalYear, row.month, row.day);
  const resolved = jdn === null
    ? null
    : resolveSexagenaryDayFromJdn(jdn, { anchorJdn: 2_433_191, anchorCycleIndex: 0 });
  return {
    ...row,
    astronomicalYear,
    dateLabel: `${row.yearBce} BCE-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")} (Julian)`,
    jdn,
    computedGanzhi: resolved === null ? null : `${resolved.stem}${resolved.branch}`,
    computedCycleIndex: resolved?.cycleIndex ?? null,
    matchesModernAnchorArithmetic: resolved !== null
      && resolved.cycleIndex === row.publishedCycleIndex
      && `${resolved.stem}${resolved.branch}` === row.publishedGanzhi,
    sourceId: "yt-liu-2019-chunqiu-reconstruction",
    sourceLineageId: "zhang-peiyu-2008-chunqiu-calendar-reconstruction",
    sourceUrl: "https://ytliu0.github.io/ChineseCalendar/chunqiu.html"
  };
});

export const CHUNQIU_CALENDAR_MODEL_CROSS_CHECK_STATUS = {
  status: "alternative_model_matches_selected_dates_pending_source_lineage_review",
  modelBasis: "Zhang Peiyu et al., Ancient Chinese Calendars and Almanacs (2008), Section 3.5 / Table 3-7, reconstructed and recalculated by Y. T. Liu",
  independentPrimaryWitness: false,
  independentSourceGateCredit: false,
  notes: [
    "The source describes the reconstructed calendar as a model fitted to fragmented Chunqiu calendrical records.",
    "The reconstruction reports 45 inconsistencies among 393 calendrical dates discussed in the chronicle, with some potentially attributable to textual transmission or calendar-model limitations.",
    "The source identifies and corrects a sexagenary-day typo for N_-720: Yi-Hai (乙亥), not Ji-Hai (己亥).",
    "This module cross-checks a separately published reconstruction against the project's modern anchor; it does not approve the 1949 anchor or enable production calculation."
  ]
} as const;
