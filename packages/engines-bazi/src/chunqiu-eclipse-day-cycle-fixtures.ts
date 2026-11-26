import { julianAstronomicalDateToJdn, astronomicalYearFromBceYear } from "./julian-jdn.js";
import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

const SOURCE_ROWS = [[1,720,2,22,6],[2,709,7,17,29],[5,669,5,27,8],[6,668,11,10,60],[7,664,8,28,7],[8,655,8,19,45],[9,648,4,6,7],[11,626,2,3,60],[12,612,4,28,38],[13,601,9,20,1],[14,599,3,6,53],[16,575,5,9,3],[17,574,10,22,54],[18,559,1,14,32],[19,558,5,31,54],[21,552,8,20,47],[23,550,1,5,10],[24,549,6,19,1],[25,549,7,18,30],[26,546,10,13,12],[27,535,3,18,41],[28,527,4,18,54],[29,525,8,22,11],[30,521,6,10,19],[31,520,11,23,10],[32,518,4,9,32],[33,511,11,14,48],[34,505,2,16,48],[35,498,9,22,3],[36,495,7,22,17],[37,481,4,19,57]] as const;

/**
 * 31 dated sexagenary-day entries transcribed from Table 3 of Stephenson & Yau
 * (1992). These are historical research fixtures, not an independent complete
 * calendar or production anchor approval.
 */
export const CHUNQIU_ECLIPSE_DAY_CYCLE_RECORDS = SOURCE_ROWS.map(
  ([referenceNumber, yearBce, month, day, publishedCycleDayIndex1Based]) => {
    const astronomicalYear = astronomicalYearFromBceYear(yearBce);
    const jdn = astronomicalYear === null ? null : julianAstronomicalDateToJdn(astronomicalYear, month, day);
    const resolved = jdn === null
      ? null
      : resolveSexagenaryDayFromJdn(jdn, { anchorJdn: 2_433_191, anchorCycleIndex: 0 });
    return {
      referenceNumber,
      yearBce,
      astronomicalYear,
      month,
      day,
      dateLabel: `${yearBce} BCE-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} (Julian)`,
      jdn,
      publishedCycleDayIndex1Based,
      computedCycleDayIndex1Based: resolved === null ? null : resolved.cycleIndex + 1,
      computedGanzhi: resolved === null ? null : `${resolved.stem}${resolved.branch}`,
      matchesPublishedCycleDay: resolved !== null && resolved.cycleIndex + 1 === publishedCycleDayIndex1Based,
      sourceId: "stephenson-yau-1992-jha-table-3",
      sourceUrl: "https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf"
    };
  }
);

export const CHUNQIU_525_BCE_ECLIPSE_DATE_DISCREPANCY = {
  referenceNumber: 29,
  recordedDate: "525 BCE-08-22 (Julian)",
  recordedCycleDayIndex1Based: 11,
  calculatedEclipseDate: "525 BCE-08-21 (Julian)",
  calculatedEclipseJdn: 1_529_900,
  calculatedEclipseCycleDayIndex1Based: 10,
  note: "Stephenson & Yau identify this as the one Chunqiu eclipse whose recorded cyclical day does not match the actual astronomical eclipse date. The record's date/day pair remains internally consistent as a calendar date; the observed event is placed one day earlier by the eclipse computation."
} as const;
