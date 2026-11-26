import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";

/**
 * Taiping Heavenly Kingdom calendar research for Xin-you year 11 (1861).
 *
 * Luo Ergang's 1948 study (Section VI) explicitly maps Taiping month 1,
 * day 1 庚寅 to Gregorian 1861-02-09 and Qing lunar month 12, day 30 己丑.
 * Its phrase "早一日" describes the calendar-date alignment: the Taiping
 * calendar date is one day earlier than the corresponding lunar/solar date.
 * It must not be implemented as subtracting one from the Ganzhi cycle index.
 *
 * A 1926 reproduction records a 366-day year with odd months of 31 days
 * and even months of 30 days. The NYPL digitized 1861 item has a partial
 * monthly page whose visible day 11 is stem 甲 and lunar mansion 翼; the
 * month heading, folio, and Earthly Branch are not legible.
 */

export const TAIPING_1861_MONTH_LENGTHS = [
  31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30
] as const;

export function getTaipingCalendarDayOfYear(month: number, day: number): number | null {
  if (!Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12) {
    return null;
  }
  const monthLength = TAIPING_1861_MONTH_LENGTHS[month - 1];
  if (monthLength === undefined || day < 1 || day > monthLength) return null;
  return TAIPING_1861_MONTH_LENGTHS.slice(0, month - 1).reduce((sum, length) => sum + length, 0) + day;
}

export function getTaipingCalendarCycleIndex(startCycleIndex: number, month: number, day: number): number | null {
  if (!Number.isInteger(startCycleIndex) || startCycleIndex < 0 || startCycleIndex >= 60) return null;
  const dayOfYear = getTaipingCalendarDayOfYear(month, day);
  if (dayOfYear === null) return null;
  return (startCycleIndex + dayOfYear - 1) % 60;
}

export const TAIPING_1861_CALENDAR_OFFSET_RESEARCH = {
  calendarYear: "Taiping Xin-you year 11 (1861)",
  publishedYearStartCrosswalk: {
    taipingDate: "month 1, day 1",
    taipingGanzhi: "庚寅",
    gregorianDate: "1861-02-09",
    qingLunarDate: "Xianfeng year 10, month 12, day 30",
    qingLunarGanzhi: "己丑",
    sourceSection: "Section VI, Taiping-calendar / lunar-solar-calendar comparison table",
    sourceId: "luo-ergang-1948-taiping-calendar-offset",
    evidenceClass: "published_secondary_historical_crosswalk"
  },
  proposedNewYear: {
    gregorianDate: "1861-02-09",
    taipingDate: "month 1, day 1",
    taipingGanzhi: "庚寅",
    taipingCycleIndex: 26,
    conventionalGregorianCycleIndex: 25,
    conventionalGregorianGanzhi: "己丑",
    labelOffset: "one_cycle_index_higher_on_the_same_gregorian_date",
    calendarDateAlignment: "taiping_new_year_is_one_day_earlier_than_the_corresponding_qing_lunar_date",
    sourceId: "luo-ergang-1948-taiping-calendar-offset"
  },
  calendarStructure: {
    daysPerYear: 366,
    monthLengths: [...TAIPING_1861_MONTH_LENGTHS],
    rule: "odd_months_31_days_even_months_30_days",
    sourceId: "liu-fu-1926-reproduction-of-1861-taiping-calendar"
  },
  targetDateMapping: {
    gregorianDate: "1861-11-11",
    taipingMonth: 10,
    taipingDay: 1,
    dayOfTaipingYear: getTaipingCalendarDayOfYear(10, 1),
    daysSinceTaipingNewYear: (getTaipingCalendarDayOfYear(10, 1) ?? 0) - 1,
    candidateGanzhi: "乙丑",
    candidateCycleIndex: getTaipingCalendarCycleIndex(26, 10, 1),
    conventionalGregorianGanzhi: "甲子",
    conventionalGregorianCycleIndex: (((gregorianCivilDateToJdn("1861-11-11") ?? 0) - 2_433_191) % 60 + 60) % 60,
    status: "candidate_pending_original_month_ten_leaf_collation"
  },
  pageFragmentCompatibilityCheck: {
    observedDay: 11,
    observedDayStem: "甲",
    observedLunarMansion: "翼",
    derivedCandidateGanzhi: "甲辰",
    candidateTaipingMonth: 9,
    candidateGregorianDate: "1861-10-21",
    candidateCycleIndex: getTaipingCalendarCycleIndex(26, 9, 11),
    monthHeadingRead: false,
    folioRead: false,
    earthlyBranchVisible: false,
    civilDateMappingIndependentlyConfirmed: false,
    interpretation: "The visible 甲 is a Heavenly Stem and 翼 is a lunar mansion. 甲辰 is the reconstructed cycle label, not a complete pair printed on this page.",
    status: "day_stem_matches_candidate_branch_unverified"
  },
  independentHistoricalCrossCheck: {
    taipingMonth: 11,
    taipingDay: 10,
    publishedGanzhi: "甲辰",
    publishedGregorianDate: "1861-12-20",
    calculatedCycleIndex: getTaipingCalendarCycleIndex(26, 11, 10),
    sourceId: "luo-ergang-1948-shen-zi-diary-cross-check",
    note: "Luo Ergang reports this diary correspondence; the underlying diary is cited as an unpublished manuscript and has not yet been directly inspected."
  },
  sources: [
    {
      id: "luo-ergang-1948-taiping-calendar-offset",
      title: "羅爾綱, 天曆與陰陽曆對照考, 學原, Second Volume, Issue 6 (1948)",
      url: "https://upload.wikimedia.org/wikipedia/commons/5/54/NLC404-01J001344-36791_%E5%AD%B8%E5%8E%9F_1948%E5%B9%B42%E5%8D%B76%E6%9C%9F.pdf",
      role: "secondary_historical_study_with_diary_and_foreign_correspondence_cross_checks",
      authorAttribution: {
        normalizedName: "羅爾綱",
        visualTitlePageReading: "羅爾綱",
        searchIndexOcrVariant: "羅衛綱",
        note: "The PDF text extraction misreads the author's name in some places; the title-page image and body references support 羅爾綱."
      },
      issueMetadata: {
        coverAndArticleRunningHeader: "學原第二卷第六期",
        anomalousContentsHeader: "學原第十一卷第六期",
        resolution: "Use volume 2 issue 6 from the cover and article running headers; preserve the anomalous contents heading as a cataloguing/transcription note."
      },
      relevantSection: "Section VI, comparison tables"
    },
    {
      id: "liu-fu-1926-reproduction-of-1861-taiping-calendar",
      title: "劉復輯, 太平天國有趣文件十六種 (1926), reproduction of the 1861 calendar",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/NLC511-027032013013759-17435_%E5%A4%AA%E5%B9%B3%E5%A4%A9%E5%9C%8B%E6%9C%89%E8%B6%A3%E6%96%87%E4%BB%B6%E5%8D%81%E5%85%AD%E7%A8%AE.pdf",
      role: "facsimile_reproduction_and_calendar_structure_witness",
      relevantPdfLines: [282, 515, 580]
    },
    {
      id: "nypl-1861-taiping-calendar-page-fragment",
      title: "NYPL digitized 1861 Taiping calendar item, partial monthly page image",
      url: "https://cdn6.picryl.com/photo/1861/12/31/tai-ping-tian-guo-xin-you-shi-yi-nian-xin-li-ban-xing-tian-xia-82c575-640.jpg",
      role: "partial_daily_leaf_image_third_party_mirror",
      relevantVisibleEntry: "day 11 shows Heavenly Stem 甲 and lunar mansion 翼; Earthly Branch is not visible; month heading and folio unresolved"
    }
  ],
  assessment: {
    status: "candidate_mapping_supported_by_secondary_study_and_calendar_reproduction",
    originalMonthTenLeafCollated: false,
    originalDayLabelForGregorianTargetVerified: false,
    independentPrimaryWitnessDirectlyInspected: false,
    historicalDayCycleGateCredit: false,
    productionImpact: "none",
    requiredNextEvidence: [
      "Inspect the NYPL original month-ten leaf and read day 1 directly.",
      "Read the month heading and printed folio on the visible day-11 甲 / 翼 page; locate an independent source for its Earthly Branch.",
      "Inspect Luo Ergang's cited Shen Zi diary witness or an independently preserved contemporary copy.",
      "Keep the Taiping calendar's internal day labels separate from the conventional Gregorian sexagenary day resolver."
    ]
  }
} as const;
