/**
 * Tensho 18 (1590) published daily-calendar cross-check.
 *
 * The source explicitly lists 1590-12-22 as Tensho 18, month 11, day 26,
 * day Ganzhi 甲子, with a Julian-day value of 2,302,151.
 *
 * This is a modern compiled Japanese historical-calendar table, not a
 * contemporary Ming primary witness. Its derivation lineage is not
 * sufficiently documented to award independent historical-source credit.
 */
export const TENSHO_1590_DAY_CYCLE_CROSS_CHECK = {
  civilDate: "1590-12-22",
  historicalCalendarDate: "Tensho 18, month 11, day 26",
  publishedDayGanzhi: "甲子",
  publishedJulianDayNumber: 2_302_151,
  projectComputedJdn: 2_302_151,
  projectAnchor: {
    civilDate: "1949-10-01",
    dayGanzhi: "甲子",
    jdn: 2_433_191,
    cycleIndex: 0
  },
  source: {
    id: "ishino-tensho-1590-calendar",
    title: "Tetsu Ishino, No. 8 — Tensho 18 (1590)",
    url: "https://inoh-ken.org/Application/nengo/0008.pdf",
    pdfPageIndex: 4,
    publishedRow: "Tensho 18.11.26 / 1590.12.22 / 甲子 / 2302151",
    accessedOn: "2026-11-26"
  },
  assessment: {
    status: "computational_calendar_cross_check_candidate",
    sourceDerivationIndependentlyVerified: false,
    contemporaryMingPrimaryWitness: false,
    historicalDayCycleGateCredit: false,
    productionImpact: "none",
    notes: [
      "The source explicitly prints the date, day Ganzhi, and Julian-day value on one row.",
      "The project Gregorian JDN conversion agrees with the published Julian-day value.",
      "The project 1949-10-01 = 甲子 anchor maps this JDN to cycle index 0 (甲子).",
      "Agreement confirms arithmetic consistency but does not prove independent derivation or contemporary historical authority.",
      "The National Library of Taiwan catalogue identifies a 1590 Wanli 18 Da Tong calendar, but its original page has not yet been collated to this Gregorian date."
    ]
  }
} as const;
