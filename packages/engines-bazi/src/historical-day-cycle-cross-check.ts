/**
 * Historical cross-check: the Chunqiu Duke Yin year 3 solar-eclipse record.
 *
 * The primary text records the sexagenary day 己巳. Historical-astronomy
 * scholarship converts the eclipse to 22 February 720 BCE on the Julian
 * calendar and independently checks the cyclical-day conversion against the
 * chronology and eclipse visibility. This is a valuable long-range
 * corroboration candidate, not an automatic production-anchor approval.
 */
import { astronomicalYearFromBceYear, julianAstronomicalDateToJdn } from "./julian-jdn.js";
import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

const historicalYearBce = 720;
const astronomicalYear = astronomicalYearFromBceYear(historicalYearBce);
const jdn = astronomicalYear === null ? null : julianAstronomicalDateToJdn(astronomicalYear, 2, 22);
const resolved = jdn === null
  ? null
  : resolveSexagenaryDayFromJdn(jdn, { anchorJdn: 2_433_191, anchorCycleIndex: 0 });

export const CHUNQIU_720_BCE_DAY_CYCLE_CROSS_CHECK = {
  historicalReference: {
    chronicle: "春秋",
    ruler: "鲁隐公",
    regnalYear: 3,
    entry: "春，王二月，己巳，日有食之。",
    cycleName: "己巳",
    cycleIndexZeroBased: 5
  },
  dateReconstruction: {
    historicalYearBce,
    astronomicalYear,
    noYearZeroConvention: "1 BCE = astronomical year 0; 720 BCE = astronomical year -719",
    calendar: "proleptic_julian",
    month: 2,
    day: 22,
    jdn
  },
  computedFromModernAnchor: {
    anchorDate: "1949-10-01",
    anchorJdn: 2_433_191,
    anchorCycleIndex: 0,
    cycleIndex: resolved?.cycleIndex ?? null,
    ganzhi: resolved ? `${resolved.stem}${resolved.branch}` : null
  },
  sources: [
    {
      sourceId: "chunqiu-duke-yin-year-3-primary-text",
      sourceRole: "primary_historical_text",
      title: "春秋左传·隐公三年",
      url: "https://ctext.org/chun-qiu-zuo-zhuan/yin-gong-san-nian/ens",
      evidence: "The transmitted text records the solar eclipse on a 己巳 day; it does not itself state the Julian-calendar date."
    },
    {
      sourceId: "stephenson-yau-1992-journal-history-astronomy",
      sourceRole: "peer_reviewed_historical_astronomy",
      title: "F. Richard Stephenson and Kevin K. C. Yau, Astronomical Records in the Ch'un-ch'iu Chronicle, Journal for the History of Astronomy 23 (1992)",
      url: "https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf",
      evidence: "The authors identify the earliest Duke Yin eclipse as 22 February 720 BCE (Julian calendar), identify 己巳 as cycle day 6, report verifying the cyclical-day conversion, and calculate that an eclipse was visible near sunrise in eastern China."
    },
    {
      sourceId: "sato-et-al-2010-pasj-chunqiu-eclipses",
      sourceRole: "peer_reviewed_eclipse_reconstruction",
      title: "Solar Eclipses in the First Half of the Chunqiu Period, Publications of the Astronomical Society of Japan 62(3) (2010)",
      url: "https://doi.org/10.1093/pasj/62.3.797",
      evidence: "The study independently analyses the Chunqiu eclipse series and gives a Delta-T range for the eclipse around 720 BCE February 22."
    }
  ],
  arithmeticStatus: jdn === 1_458_496 && resolved?.cycleIndex === 5 && resolved?.stem === "己" && resolved?.branch === "巳"
    ? "matches_historical_record"
    : "does_not_match_historical_record",
  reviewStatus: "candidate_only_pending_domain_review",
  limitations: [
    "The absolute date is a Julian-calendar historical date, not a proleptic Gregorian date.",
    "The primary chronicle supplies the cyclical day; the Julian date is a scholarly historical/astronomical reconstruction.",
    "The academic studies are evidence for this one historical event, not a complete independent day-cycle table.",
    "This cross-check does not by itself authorize production calculation or change the project's confirmed local-civil-midnight day-boundary rule."
  ]
} as const;
