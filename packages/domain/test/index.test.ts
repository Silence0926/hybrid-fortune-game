import { describe, expect, it } from "vitest";
import { BirthInputSchema, IChingSessionRequestSchema } from "../src/index.js";

describe("birth input contract", () => {
  it("accepts a valid Gregorian date and local time", () => {
    const result = BirthInputSchema.safeParse({
      localDate: "1995-06-15",
      localTime: "12:30",
      timeZone: "Asia/Kuala_Lumpur",
      calendar: "gregorian",
      timePrecision: "minute",
      confidence: "exact"
    });
    expect(result.success).toBe(true);
  });

  it("requires explicit leap-month state for Chinese lunisolar input", () => {
    const result = BirthInputSchema.safeParse({
      localDate: "1995-06-15",
      localTime: "12:30",
      timeZone: "Asia/Kuala_Lumpur",
      calendar: "chinese_lunisolar",
      timePrecision: "minute",
      confidence: "exact"
    });
    expect(result.success).toBe(false);
  });

  it("does not accept a time when precision is unknown", () => {
    const result = BirthInputSchema.safeParse({
      localDate: "1995-06-15",
      localTime: "12:30",
      timeZone: "Asia/Kuala_Lumpur",
      calendar: "gregorian",
      timePrecision: "unknown",
      confidence: "unknown"
    });
    expect(result.success).toBe(false);
  });
});

describe("I Ching request contract", () => {
  it("requires explicit user initiation", () => {
    expect(IChingSessionRequestSchema.safeParse({ method: "three_coins" }).success).toBe(false);
    expect(IChingSessionRequestSchema.safeParse({ method: "three_coins", initiatedByUser: true }).success).toBe(true);
  });
});
