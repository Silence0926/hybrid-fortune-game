import { describe, expect, it } from "vitest";
import { normalizeBirthProfile } from "../src/index.js";

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
  it("canonicalizes a valid time zone but does not invent a UTC instant", () => {
    const result = normalizeBirthProfile(base);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.profile.timeZone).toBe("Asia/Kuala_Lumpur");
    expect(result.profile.utcInstant).toBeNull();
    expect(result.profile.status).toBe("normalized_pending_timezone_resolution");
  });

  it("preserves Chinese lunisolar date semantics and leap-month state", () => {
    const result = normalizeBirthProfile({
      ...base,
      calendar: "chinese_lunisolar",
      leapMonth: true
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.profile.calendarDate).toBe("1995-06-15");
    expect(result.profile.leapMonth).toBe(true);
    expect(result.profile.warnings.some((warning) => warning.includes("Gregorian conversion"))).toBe(true);
  });

  it("does not fabricate a birth time when only the date is known", () => {
    const result = normalizeBirthProfile({
      ...base,
      localTime: undefined,
      timePrecision: "date_only",
      confidence: "approximate"
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.profile.localTime).toBeNull();
    expect(result.profile.warnings.some((warning) => warning.includes("hour-level"))).toBe(true);
  });

  it("rejects invalid dates and unknown time zones", () => {
    expect(normalizeBirthProfile({ ...base, localDate: "1995-02-30" }).success).toBe(false);
    expect(normalizeBirthProfile({ ...base, timeZone: "Mars/Olympus" }).success).toBe(false);
  });
});
