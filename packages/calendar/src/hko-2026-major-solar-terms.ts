/**
 * Published HKO 2026 MAJOR solar-term comparison fixtures.
 *
 * Important: this is the 12 中气 (major terms) subset, NOT the 12 Jie
 * boundaries used for BaZi month changes. HKO publishes these at minute
 * precision in Hong Kong Time (UTC+08:00). The UTC values below are direct
 * fixed-offset conversions, not independent astronomical calculations.
 */
export interface HkoMajorSolarTermFixture {
  year: 2026;
  termZh: string;
  termEn: string;
  solarLongitudeDegrees: number;
  hongKongTime: string;
  utcInstant: string;
  publishedPrecision: "minute";
  termClass: "zhongqi_major";
}

export const HKO_2026_MAJOR_SOLAR_TERM_FIXTURES: readonly HkoMajorSolarTermFixture[] = [
  { year: 2026, termZh: "大寒", termEn: "Severe Cold", solarLongitudeDegrees: 300, hongKongTime: "2026-01-20T09:45:00+08:00", utcInstant: "2026-01-20T01:45:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "雨水", termEn: "Spring Showers", solarLongitudeDegrees: 330, hongKongTime: "2026-02-18T23:52:00+08:00", utcInstant: "2026-02-18T15:52:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "春分", termEn: "Vernal Equinox", solarLongitudeDegrees: 0, hongKongTime: "2026-03-20T22:46:00+08:00", utcInstant: "2026-03-20T14:46:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "穀雨", termEn: "Corn Rain", solarLongitudeDegrees: 30, hongKongTime: "2026-04-20T09:39:00+08:00", utcInstant: "2026-04-20T01:39:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "小滿", termEn: "Corn Forms", solarLongitudeDegrees: 60, hongKongTime: "2026-05-21T08:37:00+08:00", utcInstant: "2026-05-21T00:37:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "夏至", termEn: "Summer Solstice", solarLongitudeDegrees: 90, hongKongTime: "2026-06-21T16:25:00+08:00", utcInstant: "2026-06-21T08:25:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "大暑", termEn: "Great Heat", solarLongitudeDegrees: 120, hongKongTime: "2026-07-23T03:13:00+08:00", utcInstant: "2026-07-22T19:13:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "處暑", termEn: "End of Heat", solarLongitudeDegrees: 150, hongKongTime: "2026-08-23T10:19:00+08:00", utcInstant: "2026-08-23T02:19:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "秋分", termEn: "Autumnal Equinox", solarLongitudeDegrees: 180, hongKongTime: "2026-09-23T08:05:00+08:00", utcInstant: "2026-09-23T00:05:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "霜降", termEn: "Frost", solarLongitudeDegrees: 210, hongKongTime: "2026-10-23T17:38:00+08:00", utcInstant: "2026-10-23T09:38:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "小雪", termEn: "Light Snow", solarLongitudeDegrees: 240, hongKongTime: "2026-11-22T15:23:00+08:00", utcInstant: "2026-11-22T07:23:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" },
  { year: 2026, termZh: "冬至", termEn: "Winter Solstice", solarLongitudeDegrees: 270, hongKongTime: "2026-12-22T04:50:00+08:00", utcInstant: "2026-12-21T20:50:00.000Z", publishedPrecision: "minute", termClass: "zhongqi_major" }
] as const;

export const HKO_2026_MAJOR_SOLAR_TERM_SOURCE = {
  title: "Hong Kong Observatory Almanac 2026 — 24 Solar Terms",
  url: "https://www.hko.gov.hk/en/gts/astron2026/files/2026SolarTerms24.pdf",
  timeZone: "Asia/Hong_Kong",
  utcOffset: "+08:00",
  accessedOn: "2026-11-22",
  sourcePrecision: "minute",
  note: "HKO states the astronomical data are based on HM Nautical Almanac Office (UK) and US Naval Observatory data."
} as const;
