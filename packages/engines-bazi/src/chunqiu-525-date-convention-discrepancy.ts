import {
  astronomicalYearFromBceYear,
  julianAstronomicalDateToJdn
} from "./julian-jdn.js";
import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

const year = astronomicalYearFromBceYear(525);
const jdnAugust21 = year === null ? null : julianAstronomicalDateToJdn(year, 8, 21);
const jdnAugust22 = year === null ? null : julianAstronomicalDateToJdn(year, 8, 22);
const anchor = { anchorJdn: 2_433_191, anchorCycleIndex: 0 };
const dayAugust21 = jdnAugust21 === null ? null : resolveSexagenaryDayFromJdn(jdnAugust21, anchor);
const dayAugust22 = jdnAugust22 === null ? null : resolveSexagenaryDayFromJdn(jdnAugust22, anchor);

/**
 * A preserved source discrepancy, not a correction.
 *
 * Stephenson & Yau Table 3 separates the Chunqiu recorded date (Aug 22,
 * Jia-Xu) from the computed eclipse date (Aug 21). Tanikawa et al. Table 1
 * and Tschang Table 1 list the eclipse under Aug 21 while retaining the
 * historical Jia-Xu designation. The repository's modern-anchor arithmetic
 * maps Aug 21 to Gui-You and Aug 22 to Jia-Xu.
 *
 * These are different evidence fields. Do not silently move the chronicle
 * Ganzhi label onto the astronomical event date or change the primary record.
 */
export const CHUNQIU_525_DATE_CONVENTION_DISCREPANCY = {
  historicalYearBce: 525,
  astronomicalYear: year,
  calendar: "proleptic_julian",
  chronicleRecord: {
    originalText: "夏六月甲戌朔，日有食之。",
    reportedGanzhi: "甲戌",
    reportedCycleIndexOneBased: 11,
    stephensonYauTable3Date: "525 BCE-08-22",
    sourceId: "stephenson-yau-1992-jha-table-3",
    sourceUrl: "https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf"
  },
  astronomicalEventReconstructions: [
    {
      sourceId: "stephenson-yau-1992-jha-table-4",
      date: "525 BCE-08-21",
      sourceUrl: "https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf",
      evidenceRole: "computed_eclipse_date",
      note: "Their Table 4 places the astronomical eclipse one Julian date before the Table 3 chronicle date."
    },
    {
      sourceId: "tanikawa-yamamoto-soma-2011-table-1",
      date: "525 BCE-08-21",
      sourceUrl: "https://doi.org/10.1007/978-1-4419-8161-5_2",
      evidenceRole: "computed_eclipse_date_with_chronicle_ganzhi",
      reportedGanzhi: "甲戌",
      reportedCycleIndexOneBased: 11,
      note: "Table 1 lists the Julian eclipse date as Aug 21 while retaining the Chunqiu period day designation Jia-Xu [11]."
    },
    {
      sourceId: "tschang-2004-table-1",
      date: "525 BCE-08-21",
      sourceUrl: "https://sino-platonic.org/complete/spp141_chinese_calendar.pdf",
      evidenceRole: "independent_calendar_reconstruction_eclipse_date",
      reportedGanzhiText: "甲戌朔",
      note: "The author lists Aug 21, 525 BCE and quotes the Chunqiu record; this is a separate computational reconstruction, not a new primary witness."
    }
  ],
  projectModernAnchorArithmetic: {
    anchorDate: "1949-10-01",
    anchorJdn: 2_433_191,
    august21: {
      jdn: jdnAugust21,
      cycleIndexOneBased: dayAugust21 === null ? null : dayAugust21.cycleIndex + 1,
      ganzhi: dayAugust21 === null ? null : `${dayAugust21.stem}${dayAugust21.branch}`
    },
    august22: {
      jdn: jdnAugust22,
      cycleIndexOneBased: dayAugust22 === null ? null : dayAugust22.cycleIndex + 1,
      ganzhi: dayAugust22 === null ? null : `${dayAugust22.stem}${dayAugust22.branch}`
    }
  },
  assessment: {
    status: "unresolved_historical_date_convention_discrepancy",
    independentAstronomicalReconstructions: true,
    independentPrimaryWitness: false,
    dayCycleAnchorGateCredit: false,
    productionImpact: "none",
    resolutionRequired: [
      "Inspect original Chunqiu text and transmission variants.",
      "Compare the exact date conventions and astronomical day assignment in each paper.",
      "Determine whether the discrepancy is caused by event-date convention, ancient local day boundary, calendar reconstruction, or a source/transcription issue.",
      "Do not alter the 525 BCE record or the 1949 anchor until domain review."
    ]
  }
} as const;
