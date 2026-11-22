import { describe, expect, it } from "vitest";
import { calculateBazi } from "../src/index.js";

const birth = {
  localDate: "1995-06-15",
  localTime: "12:30",
  timeZone: "Asia/Kuala_Lumpur",
  calendar: "gregorian" as const,
  timePrecision: "minute" as const,
  confidence: "exact" as const
};

describe("BaZi engine bootstrap", () => {
  it("does not invent pillars before rules are validated", () => {
    const result = calculateBazi(birth);
    expect(result.status).toBe("not_implemented");
    expect(result.result).toBeUndefined();
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
