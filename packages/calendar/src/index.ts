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

/**
 * Validates and canonicalizes a birth profile without guessing a UTC instant.
 * Local wall times can be ambiguous or nonexistent around historical DST changes;
 * conversion must be performed by a separately validated IANA time-zone provider.
 */
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
    "No UTC instant has been calculated; historical IANA/DST ambiguity resolution is a separate validated step."
  ];

  if (birth.calendar === "chinese_lunisolar") {
    warnings.push(
      "The supplied date remains a Chinese lunisolar calendar date; Gregorian conversion has not been performed."
    );
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
