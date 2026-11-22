import { describe, expect, it } from "vitest";
import { normalizeBirthProfile, resolveLocalBirthTime } from "../src/index.js";

const base = {
  localDate: "1995-06-15",
  localTime: "12:30",
  timeZone: "Asia/Kuala_Lumpur",
  calendar: "gregorian" as const,
  timePrecision: "minute" as const,
  confidence: "exact" as const,
  trueSolarTimePolicy: "disabled" as const
};

describe("birth profile normalization", () => {
  it("canonicalizes a valid time zone without inventing a UTC instant", () => {
    const result = normalizeBirthProfile(base);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.profile.timeZone).toBe("Asia/Kuala_Lumpur");
    expect(result.profile.utcInstant).toBeNull();
  });

  it("preserves Chinese lunisolar date semantics and leap-month state", () => {
    const result = normalizeBirthProfile({ ...base, calendar: "chinese_lunisolar", leapMonth: true });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.profile.calendarDate).toBe("1995-06-15");
    expect(result.profile.leapMonth).toBe(true);
    expect(result.profile.warnings.some((warning) => warning.includes("Gregorian conversion"))).toBe(true);
  });

  it("does not fabricate a birth time when only the date is known", () => {
    const result = normalizeBirthProfile({
      ...base, localTime: undefined, timePrecision: "date_only", confidence: "approximate"
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.profile.localTime).toBeNull();
  });

  it("rejects invalid dates and unknown time zones", () => {
    expect(normalizeBirthProfile({ ...base, localDate: "1995-02-30" }).success).toBe(false);
    expect(normalizeBirthProfile({ ...base, timeZone: "Mars/Olympus" }).success).toBe(false);
  });
});

describe("historical IANA local-time resolution", () => {
  it("resolves an unambiguous Kuala Lumpur wall time", () => {
    const result = resolveLocalBirthTime(base);
    expect(result.status).toBe("resolved");
    if (result.status !== "resolved") return;
    expect(result.utcInstant).toBe("1995-06-15T04:30:00.000Z");
    expect(result.offsetMinutes).toBe(480);
  });

  it("detects a spring-forward nonexistent time", () => {
    const result = resolveLocalBirthTime({
      ...base, localDate: "2024-03-10", localTime: "02:30", timeZone: "America/New_York"
    });
    expect(result.status).toBe("nonexistent");
  });

  it("detects both occurrences of a fall-back ambiguous time", () => {
    const result = resolveLocalBirthTime({
      ...base, localDate: "2024-11-03", localTime: "01:30", timeZone: "America/New_York"
    });
    expect(result.status).toBe("ambiguous");
    if (result.status !== "ambiguous") return;
    expect(result.candidates).toHaveLength(2);
    expect(result.candidates.map((candidate) => candidate.utcInstant)).toEqual([
      "2024-11-03T05:30:00.000Z",
      "2024-11-03T06:30:00.000Z"
    ]);
  });

  it("does not turn hour-only or Chinese lunisolar inputs into exact instants", () => {
    expect(resolveLocalBirthTime({
      ...base, timePrecision: "hour", localTime: "12:00"
    }).status).toBe("insufficient_precision");
    expect(resolveLocalBirthTime({
      ...base, calendar: "chinese_lunisolar", leapMonth: false
    }).status).toBe("unsupported_calendar");
  });
});


describe("apparent solar time pipeline", () => {
  it("applies east-positive longitude and exposes both mean and apparent solar time", async () => {
    const { calculateApparentSolarTime } = await import("../src/index.js");
    const result = calculateApparentSolarTime("2024-03-20T04:00:00.000Z", 120);
    expect(result.status).toBe("calculated_approximation");
    if (result.status !== "calculated_approximation") return;
    expect(result.longitudeCorrectionMinutes).toBe(480);
    expect(result.localMeanSolarTime).toBe("2024-03-20T12:00:00");
    expect(result.apparentSolarTime).not.toBe(result.localMeanSolarTime);
    expect(result.model).toBe("noaa_fractional_year_approximation");
  });

  it("supports west longitude and date rollover", async () => {
    const { calculateApparentSolarTime } = await import("../src/index.js");
    const result = calculateApparentSolarTime("2024-01-01T02:00:00Z", -150);
    expect(result.status).toBe("calculated_approximation");
    if (result.status !== "calculated_approximation") return;
    expect(result.longitudeCorrectionMinutes).toBe(-600);
    expect(result.localMeanSolarTime.startsWith("2023-12-31T16:00:00")).toBe(true);
  });

  it("rejects timestamps without explicit offset and invalid longitude", async () => {
    const { calculateApparentSolarTime } = await import("../src/index.js");
    expect(calculateApparentSolarTime("2024-03-20T04:00:00", 120).status).toBe("invalid_input");
    expect(calculateApparentSolarTime("2024-03-20T04:00:00Z", 181).status).toBe("invalid_input");
  });
});
