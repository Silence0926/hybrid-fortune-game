/**
 * 2027 BaZi Jie-boundary reference candidates.
 *
 * Two institutional publications are represented per term:
 * - Taipei City Government 2027 Astronomical Almanac (UTC+08:00 at 120°E mean solar time).
 * - National Astronomical Observatory of Japan ECO (Japan Civil Standard Time, UTC+09:00).
 *
 * Both publish minute precision. The normalized UTC instants are identical
 * after offset conversion. These are candidate comparison fixtures only:
 * institutional difference does not, by itself, prove independent source
 * derivation or domain approval. Do not use as a production ephemeris.
 */
import type { JieTermReferenceFixture } from "./jie-term-fixtures.js";

export const JIE_2027_REFERENCE_FIXTURES: readonly JieTermReferenceFixture[] = [
  {
    "year": 2027,
    "termZh": "小寒",
    "solarLongitudeDegrees": 285,
    "publishedLocalDateTime": "2027-01-05T22:10:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-01-05T14:10:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "小寒",
    "solarLongitudeDegrees": 285,
    "publishedLocalDateTime": "2027-01-05T23:10:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-01-05T14:10:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立春",
    "solarLongitudeDegrees": 315,
    "publishedLocalDateTime": "2027-02-04T09:46:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-02-04T01:46:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立春",
    "solarLongitudeDegrees": 315,
    "publishedLocalDateTime": "2027-02-04T10:46:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-02-04T01:46:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "驚蟄",
    "solarLongitudeDegrees": 345,
    "publishedLocalDateTime": "2027-03-06T03:40:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-03-05T19:40:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "驚蟄",
    "solarLongitudeDegrees": 345,
    "publishedLocalDateTime": "2027-03-06T04:40:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-03-05T19:40:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "清明",
    "solarLongitudeDegrees": 15,
    "publishedLocalDateTime": "2027-04-05T08:17:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-04-05T00:17:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "清明",
    "solarLongitudeDegrees": 15,
    "publishedLocalDateTime": "2027-04-05T09:17:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-04-05T00:17:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立夏",
    "solarLongitudeDegrees": 45,
    "publishedLocalDateTime": "2027-05-06T01:25:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-05-05T17:25:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立夏",
    "solarLongitudeDegrees": 45,
    "publishedLocalDateTime": "2027-05-06T02:25:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-05-05T17:25:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "芒種",
    "solarLongitudeDegrees": 75,
    "publishedLocalDateTime": "2027-06-06T05:26:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-06-05T21:26:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "芒種",
    "solarLongitudeDegrees": 75,
    "publishedLocalDateTime": "2027-06-06T06:26:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-06-05T21:26:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "小暑",
    "solarLongitudeDegrees": 105,
    "publishedLocalDateTime": "2027-07-07T15:37:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-07-07T07:37:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "小暑",
    "solarLongitudeDegrees": 105,
    "publishedLocalDateTime": "2027-07-07T16:37:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-07-07T07:37:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立秋",
    "solarLongitudeDegrees": 135,
    "publishedLocalDateTime": "2027-08-08T01:27:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-08-07T17:27:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立秋",
    "solarLongitudeDegrees": 135,
    "publishedLocalDateTime": "2027-08-08T02:27:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-08-07T17:27:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "白露",
    "solarLongitudeDegrees": 165,
    "publishedLocalDateTime": "2027-09-08T04:28:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-09-07T20:28:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "白露",
    "solarLongitudeDegrees": 165,
    "publishedLocalDateTime": "2027-09-08T05:28:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-09-07T20:28:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "寒露",
    "solarLongitudeDegrees": 195,
    "publishedLocalDateTime": "2027-10-08T20:17:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-10-08T12:17:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "寒露",
    "solarLongitudeDegrees": 195,
    "publishedLocalDateTime": "2027-10-08T21:17:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-10-08T12:17:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立冬",
    "solarLongitudeDegrees": 225,
    "publishedLocalDateTime": "2027-11-07T23:39:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-11-07T15:39:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "立冬",
    "solarLongitudeDegrees": 225,
    "publishedLocalDateTime": "2027-11-08T00:39:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-11-07T15:39:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "大雪",
    "solarLongitudeDegrees": 255,
    "publishedLocalDateTime": "2027-12-07T16:38:00+08:00",
    "timeZone": "Etc/GMT-8",
    "utcInstant": "2027-12-07T08:38:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "mean_solar_time",
    "sourceId": "taipei-2027-astronomical-almanac",
    "sourceTitle": "Taipei City Government — 2027 Astronomical Almanac",
    "sourceUrl": "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf",
    "accessedOn": "2026-11-26"
  },
  {
    "year": 2027,
    "termZh": "大雪",
    "solarLongitudeDegrees": 255,
    "publishedLocalDateTime": "2027-12-07T17:38:00+09:00",
    "timeZone": "Asia/Tokyo",
    "utcInstant": "2027-12-07T08:38:00Z",
    "publishedPrecision": "minute",
    "publishedTimeBasis": "standard_time",
    "sourceId": "naoj-eco-2027-solar-terms",
    "sourceTitle": "National Astronomical Observatory of Japan — 24 Solar Terms 2027",
    "sourceUrl": "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027",
    "accessedOn": "2026-11-26"
  }
] as const;

export const JIE_2027_REFERENCE_SOURCE_NOTES = {
  taipei: {
    sourceId: "taipei-2027-astronomical-almanac",
    timeBasis: "The publication states 東經120度平均太陽時; the listed meridian time is represented with the fixed IANA offset zone Etc/GMT-8 (UTC+08:00), not mislabelled as a regional civil-time observation.",
    url: "https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf"
  },
  naoj: {
    sourceId: "naoj-eco-2027-solar-terms",
    timeBasis: "The ECO result explicitly reports LST = UT+9 hours (Japan Civil Standard Time).",
    deltaTSecondsReported: 69,
    url: "https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027"
  },
  reviewStatus: "candidate_only_pending_source_independence_and_ephemeris_convention_review"
} as const;
