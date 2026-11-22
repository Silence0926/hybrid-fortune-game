import { BirthInputSchema, type BirthInput } from "@hybrid-fortune/domain";

export interface NormalizedBirthProfile {
  status: "normalized_pending_timezone_resolution";
  calendar: BirthInput["calendar"];
  calendarDate: string;
  leapMonth: boolean | null;
  localTime: string | null;
  timePrecision: BirthInput["timePrecision"];
  confidence: BirthInput["confidence"];
  timeZone: string;
  coordinates: { latitude: number; longitude: number } | null;
  trueSolarTimePolicy: BirthInput["trueSolarTimePolicy"];
  utcInstant: null;
  warnings: string[];
}

export type BirthNormalizationResult =
  | { success: true; profile: NormalizedBirthProfile }
  | { success: false; issues: Array<{ path: string; message: string }> };

export type LocalTimeResolution =
  | { status: "resolved"; timeZone: string; localDateTime: string; utcInstant: string; offsetMinutes: number; method: "iana_offset_candidate_validation"; warnings: string[] }
  | { status: "ambiguous"; timeZone: string; localDateTime: string; candidates: Array<{ utcInstant: string; offsetMinutes: number }>; warnings: string[] }
  | { status: "nonexistent"; timeZone: string; localDateTime: string; candidates: []; warnings: string[] }
  | { status: "insufficient_precision"; timeZone: string; localDateTime: string | null; candidates: []; warnings: string[] }
  | { status: "unsupported_calendar"; timeZone: string; localDateTime: string | null; candidates: []; warnings: string[] };

/** Validates and canonicalizes input without guessing a UTC instant. */
export function normalizeBirthProfile(input: unknown): BirthNormalizationResult {
  const parsed = BirthInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    };
  }

  const birth = parsed.data;
  const canonicalTimeZone = new Intl.DateTimeFormat("en-US", {
    timeZone: birth.timeZone
  }).resolvedOptions().timeZone;
  const coordinates = birth.latitude !== undefined && birth.longitude !== undefined
    ? { latitude: birth.latitude, longitude: birth.longitude }
    : null;
  const warnings = [
    "UTC conversion is a separate operation; no instant is inferred during profile normalization."
  ];

  if (birth.calendar === "chinese_lunisolar") {
    warnings.push("The supplied date remains a Chinese lunisolar date; Gregorian conversion has not been performed.");
  }
  if (birth.timePrecision === "date_only" || birth.timePrecision === "unknown") {
    warnings.push("Birth time is unavailable; hour-level calculations must remain disabled.");
  }
  if (birth.trueSolarTimePolicy !== "disabled" && coordinates === null) {
    warnings.push("Apparent Solar Time is requested but coordinates are unavailable.");
  }

  return {
    success: true,
    profile: {
      status: "normalized_pending_timezone_resolution",
      calendar: birth.calendar,
      calendarDate: birth.localDate,
      leapMonth: birth.calendar === "chinese_lunisolar" ? birth.leapMonth ?? false : null,
      localTime: birth.localTime ?? null,
      timePrecision: birth.timePrecision,
      confidence: birth.confidence,
      timeZone: canonicalTimeZone,
      coordinates,
      trueSolarTimePolicy: birth.trueSolarTimePolicy,
      utcInstant: null,
      warnings
    }
  };
}

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
}

function partsAt(formatter: Intl.DateTimeFormat, instantMs: number): {
  year: number; month: number; day: number; hour: number; minute: number; second: number;
} {
  const values = Object.fromEntries(
    formatter.formatToParts(new Date(instantMs))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );
  return {
    year: values.year ?? 0,
    month: values.month ?? 0,
    day: values.day ?? 0,
    hour: values.hour ?? 0,
    minute: values.minute ?? 0,
    second: values.second ?? 0
  };
}

function offsetAt(formatter: Intl.DateTimeFormat, instantMs: number): number {
  const parts = partsAt(formatter, instantMs);
  const representedAsUtc = Date.UTC(
    parts.year, parts.month - 1, parts.day,
    parts.hour, parts.minute, parts.second
  );
  return representedAsUtc - Math.floor(instantMs / 1000) * 1000;
}

/**
 * Resolves minute-precision Gregorian wall time against the runtime's IANA tz database.
 * It detects DST overlaps and gaps rather than silently choosing an offset.
 * Hour-only/date-only inputs deliberately do not produce an exact instant.
 */
export function resolveLocalBirthTime(input: unknown): LocalTimeResolution | { status: "invalid_input"; issues: Array<{ path: string; message: string }> } {
  const parsed = BirthInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "invalid_input",
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    };
  }

  const birth = parsed.data;
  const timeZone = new Intl.DateTimeFormat("en-US", { timeZone: birth.timeZone }).resolvedOptions().timeZone;
  const localDateTime = birth.localTime ? `${birth.localDate}T${birth.localTime}` : null;

  if (birth.calendar !== "gregorian") {
    return {
      status: "unsupported_calendar", timeZone, localDateTime, candidates: [],
      warnings: ["Convert the Chinese lunisolar date with a validated calendar dataset before resolving its local time."]
    };
  }
  if (birth.timePrecision !== "minute" || birth.localTime === undefined) {
    return {
      status: "insufficient_precision", timeZone, localDateTime, candidates: [],
      warnings: ["An exact UTC instant requires minute-level birth-time precision; no representative time has been fabricated."]
    };
  }

  const exactLocalDateTime = `${birth.localDate}T${birth.localTime}`;
  const [year, month, day] = birth.localDate.split("-").map(Number);
  const [hour, minute] = birth.localTime.split(":").map(Number);
  const naiveUtc = Date.UTC(year!, month! - 1, day!, hour!, minute!, 0);
  const formatter = formatterFor(timeZone);
  const offsets = new Set<number>();

  // Sample a broad window around the wall-clock value to discover offsets on either
  // side of nearby transitions. Candidate instants are then validated by round-trip.
  for (let delta = -36 * 60; delta <= 36 * 60; delta += 30) {
    offsets.add(offsetAt(formatter, naiveUtc + delta * 60_000));
  }

  const expected = { year: year!, month: month!, day: day!, hour: hour!, minute: minute!, second: 0 };
  const candidates = [...offsets]
    .map((offset) => ({ instantMs: naiveUtc - offset, offsetMinutes: offset / 60_000 }))
    .filter(({ instantMs }) => {
      const actual = partsAt(formatter, instantMs);
      return actual.year === expected.year &&
        actual.month === expected.month &&
        actual.day === expected.day &&
        actual.hour === expected.hour &&
        actual.minute === expected.minute &&
        actual.second === expected.second;
    })
    .sort((a, b) => a.instantMs - b.instantMs)
    .filter((candidate, index, all) => index === 0 || candidate.instantMs !== all[index - 1]!.instantMs);

  if (candidates.length === 0) {
    return {
      status: "nonexistent", timeZone, localDateTime: exactLocalDateTime, candidates: [],
      warnings: ["This local wall time does not exist in the selected time zone, commonly because clocks moved forward."]
    };
  }

  if (candidates.length > 1) {
    return {
      status: "ambiguous", timeZone, localDateTime: exactLocalDateTime,
      candidates: candidates.map(({ instantMs, offsetMinutes }) => ({
        utcInstant: new Date(instantMs).toISOString(),
        offsetMinutes
      })),
      warnings: ["This local wall time maps to multiple UTC instants; the user must select or clarify the intended occurrence."]
    };
  }

  const candidate = candidates[0]!;
  return {
    status: "resolved",
    timeZone,
    localDateTime: exactLocalDateTime,
    utcInstant: new Date(candidate.instantMs).toISOString(),
    offsetMinutes: candidate.offsetMinutes,
    method: "iana_offset_candidate_validation",
    warnings: ["Resolution uses the host runtime's ICU/IANA time-zone database; record runtime and tzdb provenance before production use."]
  };
}


export interface SolarTimeResult {
  status: "calculated_approximation";
  utcInstant: string;
  longitudeDegreesEastPositive: number;
  equationOfTimeMinutes: number;
  localMeanSolarTime: string;
  apparentSolarTime: string;
  longitudeCorrectionMinutes: number;
  model: "noaa_fractional_year_approximation";
  warnings: string[];
}

function formatSolarWallTime(instantMs: number): string {
  const date = new Date(instantMs);
  const pad = (value: number) => String(value).padStart(2, "0");
  const millis = date.getUTCMilliseconds();
  const base = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
  return millis === 0 ? base : `${base}.${String(millis).padStart(3, "0")}`;
}

/**
 * NOAA fractional-year equation-of-time approximation.
 * E is apparent solar time minus local mean solar time, in minutes.
 * This is a research-stage approximation, not a validated historical ephemeris.
 */
export function calculateApparentSolarTime(
  utcInstant: string,
  longitudeDegreesEastPositive: number
): SolarTimeResult | { status: "invalid_input"; message: string } {
  const instantMs = Date.parse(utcInstant);
  if (!Number.isFinite(instantMs) || !/(Z|[+-]\\d{2}:?\\d{2})$/i.test(utcInstant)) {
    return { status: "invalid_input", message: "utcInstant must be a valid ISO-8601 timestamp with an explicit UTC offset." };
  }
  if (!Number.isFinite(longitudeDegreesEastPositive) ||
      longitudeDegreesEastPositive < -180 || longitudeDegreesEastPositive > 180) {
    return { status: "invalid_input", message: "Longitude must be a finite value from -180 to +180 degrees; east is positive." };
  }

  const utc = new Date(instantMs);
  const year = utc.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((Date.UTC(year, utc.getUTCMonth(), utc.getUTCDate()) - startOfYear) / 86_400_000) + 1;
  const daysInYear = (Date.UTC(year + 1, 0, 1) - startOfYear) / 86_400_000;
  const utcHour = utc.getUTCHours() + utc.getUTCMinutes() / 60 +
    utc.getUTCSeconds() / 3600 + utc.getUTCMilliseconds() / 3_600_000;
  const gamma = 2 * Math.PI / daysInYear * (dayOfYear - 1 + (utcHour - 12) / 24);
  const equationOfTimeMinutes = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );
  const longitudeCorrectionMinutes = longitudeDegreesEastPositive * 4;
  const localMeanMs = instantMs + longitudeCorrectionMinutes * 60_000;
  const apparentMs = localMeanMs + equationOfTimeMinutes * 60_000;

  return {
    status: "calculated_approximation",
    utcInstant: utc.toISOString(),
    longitudeDegreesEastPositive,
    equationOfTimeMinutes,
    localMeanSolarTime: formatSolarWallTime(localMeanMs),
    apparentSolarTime: formatSolarWallTime(apparentMs),
    longitudeCorrectionMinutes,
    model: "noaa_fractional_year_approximation",
    warnings: [
      "Equation of Time uses a NOAA fractional-year approximation; it is not a high-precision ephemeris.",
      "This result is a solar-time coordinate, not a civil time-zone timestamp; do not apply DST or a time-zone offset again.",
      "Latitude is not used in this longitude-based solar-time conversion.",
      "Historical precision, TT/UT1 handling, Delta-T, and an authoritative ephemeris remain to be validated before production BaZi calculations."
    ]
  };
}

// Public calendar-core exports.
export { resolveDayPillarDate } from "./day-pillar-date.js";
export type { DayPillarDateResult } from "./day-pillar-date.js";
export { gregorianToJdn } from "./julian-day.js";
export type { GregorianDate, JdnResult } from "./julian-day.js";
export { findSolarLongitudeCrossing, normalizeDegrees } from "./ephemeris.js";
export type {
  AstronomicalTimeScale,
  EphemerisProvenance,
  EphemerisProvider,
  SolarLongitudeSample,
  SolarLongitudeCrossingResult
} from "./ephemeris.js";

export { HKO_2026_MAJOR_SOLAR_TERM_FIXTURES, HKO_2026_MAJOR_SOLAR_TERM_SOURCE } from "./hko-2026-major-solar-terms.js";
export type { HkoMajorSolarTermFixture } from "./hko-2026-major-solar-terms.js";

export { SOLAR_TERMS_24, getSolarTermByLongitude, getBaziMonthBoundaryTerms } from "./solar-terms.js";
export type { SolarTermClass, SolarTermDefinition } from "./solar-terms.js";
