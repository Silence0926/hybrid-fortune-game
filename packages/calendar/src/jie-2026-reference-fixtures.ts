/**
 * 2026 BaZi Jie-boundary reference candidates.
 *
 * Taipei City Government publishes mean solar time at 120°E; NAOJ ECO
 * publishes Japan Civil Standard Time (UTC+09:00). Both are preserved with
 * their distinct clock conventions and normalized to UTC for comparison.
 *
 * Agreement to the published minute is a cross-publication consistency check,
 * not proof of independent ephemeris derivation or production accuracy.
 */
import type { JieTermReferenceFixture } from "./jie-term-fixtures.js";

const TERMS = [
  { termZh: "小寒", longitude: 285, date: "2026-01-05", taipei: "16:23", naoj: "17:23" },
  { termZh: "立春", longitude: 315, date: "2026-02-04", taipei: "04:02", naoj: "05:02" },
  { termZh: "驚蟄", longitude: 345, date: "2026-03-05", taipei: "21:59", naoj: "22:59" },
  { termZh: "清明", longitude: 15, date: "2026-04-05", taipei: "02:40", naoj: "03:40" },
  { termZh: "立夏", longitude: 45, date: "2026-05-05", taipei: "19:49", naoj: "20:49" },
  { termZh: "芒種", longitude: 75, date: "2026-06-05", taipei: "23:48", naoj: "2026-06-06T00:48" },
  { termZh: "小暑", longitude: 105, date: "2026-07-07", taipei: "09:57", naoj: "10:57" },
  { termZh: "立秋", longitude: 135, date: "2026-08-07", taipei: "19:43", naoj: "20:43" },
  { termZh: "白露", longitude: 165, date: "2026-09-07", taipei: "22:41", naoj: "23:41" },
  { termZh: "寒露", longitude: 195, date: "2026-10-08", taipei: "14:29", naoj: "15:29" },
  { termZh: "立冬", longitude: 225, date: "2026-11-07", taipei: "17:52", naoj: "18:52" },
  { termZh: "大雪", longitude: 255, date: "2026-12-07", taipei: "10:53", naoj: "11:53" }
] as const;

function toUtc(date: string, time: string, offsetHours: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!, hour! - offsetHours, minute!)).toISOString().replace(".000", "");
}

export const JIE_2026_REFERENCE_FIXTURES: readonly JieTermReferenceFixture[] =
  TERMS.flatMap((term) => {
    const naojDate = term.naoj.includes("T") ? term.naoj.slice(0, 10) : term.date;
    const naojTime = term.naoj.includes("T") ? term.naoj.slice(11) : term.naoj;
    const utcTaipei = toUtc(term.date, term.taipei, 8);
    const utcNaoj = toUtc(naojDate, naojTime, 9);
    return [
      {
        year: 2026,
        termZh: term.termZh,
        solarLongitudeDegrees: term.longitude,
        publishedLocalDateTime: `${term.date}T${term.taipei}:00+08:00`,
        timeZone: "Etc/GMT-8",
        utcInstant: utcTaipei,
        publishedPrecision: "minute" as const,
        publishedTimeBasis: "mean_solar_time" as const,
        sourceId: "taipei-2026-astronomical-almanac",
        sourceTitle: "Taipei City Government — 2026 Astronomical Almanac",
        sourceUrl: "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/28f5213a-4834-4958-a452-81477e358e73.pdf",
        accessedOn: "2026-11-26"
      },
      {
        year: 2026,
        termZh: term.termZh,
        solarLongitudeDegrees: term.longitude,
        publishedLocalDateTime: `${naojDate}T${naojTime}:00+09:00`,
        timeZone: "Asia/Tokyo",
        utcInstant: utcNaoj,
        publishedPrecision: "minute" as const,
        publishedTimeBasis: "standard_time" as const,
        sourceId: "naoj-eco-2026-solar-terms",
        sourceTitle: "National Astronomical Observatory of Japan — 24 Solar Terms 2026",
        sourceUrl: "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenom_sekki_en.cgi",
        accessedOn: "2026-11-26"
      }
    ];
  });

export const JIE_2026_REFERENCE_SOURCE_NOTES = {
  taipei: {
    sourceId: "taipei-2026-astronomical-almanac",
    timeBasis: "The publication explicitly states 東經120度平均太陽時. Values are represented with fixed offset Etc/GMT-8, not mislabeled as Taipei regional civil time.",
    url: "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/28f5213a-4834-4958-a452-81477e358e73.pdf"
  },
  naoj: {
    sourceId: "naoj-eco-2026-solar-terms",
    timeBasis: "The NAOJ ECO page explicitly reports LST = UT+9 hours (Japan Civil Standard Time).",
    deltaTSecondsReported: 69,
    url: "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenom_sekki_en.cgi"
  },
  reviewStatus: "candidate_only_pending_source_independence_and_ephemeris_convention_review"
} as const;
