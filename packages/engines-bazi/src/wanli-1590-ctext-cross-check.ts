import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";
import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

/**
 * Single-day comparison candidate from the Chinese Text Project's
 * Wanli 18 date table. The source presents a modern Gregorian/Julian
 * conversion and Ganzhi label for the historical Chinese-calendar date.
 *
 * This is a digital calendar reference, not a transcription of the
 * contemporary 1590 Ming almanac. Its derivation lineage is not established.
 */
export const WANLI_1590_CTEXT_CROSS_CHECK = (() => {
  const civilDate = "1590-10-28";
  const jdn = gregorianCivilDateToJdn(civilDate);
  const project = jdn === null ? null : resolveSexagenaryDayFromJdn(jdn, {
    anchorJdn: 2_433_191,
    anchorCycleIndex: 0
  });

  return {
    historicalDate: {
      reign: "Wanli 18",
      lunarMonth: 10,
      lunarDay: 1,
      publishedGanzhi: "己巳",
      publishedGregorianDate: civilDate,
      publishedJulianDate: "1590-10-18"
    },
    arithmetic: {
      jdn,
      projectCycleIndex: project?.cycleIndex ?? null,
      projectGanzhi: project ? `${project.stem}${project.branch}` : null,
      matchesPublishedLabel: project?.cycleIndex === 5
        && project !== null
        && `${project.stem}${project.branch}` === "己巳"
    },
    source: {
      id: "ctext-wanli-18-month-10-day-1",
      title: "Chinese Text Project, Wanli 18, tenth lunar month, day 1",
      url: "https://ctext.org/date.pl?day=8&entityid=136592&if=en&month=10&remap=gb&year=18",
      sourceType: "modern_digital_calendar_table",
      contentStatus: "search-indexed-day-table-entry",
      accessedOn: "2026-11-26",
      derivationLineage: "not_established"
    },
    assessment: {
      status: "secondary_digital_calendar_cross_check_candidate",
      independentHistoricalWitness: false,
      independentDerivationVerified: false,
      historicalDayCycleGateCredit: false,
      originalMingDailyPageInspected: false,
      productionImpact: "none"
    }
  } as const;
})();
