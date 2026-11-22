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
