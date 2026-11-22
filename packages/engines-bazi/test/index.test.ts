import { describe, expect, it } from "vitest";
import { BAZI_RULESET_V1, calculateBazi } from "../src/index.js";

const birth = {
  localDate: "1995-06-15",
  localTime: "12:30",
  timeZone: "Asia/Kuala_Lumpur",
  calendar: "gregorian" as const,
  timePrecision: "minute" as const,
  confidence: "exact" as const
};

describe("BaZi engine bootstrap", () => {
  it("preserves the confirmed BaZi V1.0 conventions", () => {
    expect(BAZI_RULESET_V1.pillars.yearBoundary).toBe("actual_lichun_crossing");
    expect(BAZI_RULESET_V1.pillars.monthBoundary).toBe("actual_twelve_jie_crossings");
    expect(BAZI_RULESET_V1.pillars.dayPillarMethod).toBe("julian_day_number");
    expect(BAZI_RULESET_V1.luckCycle.daysPerYear).toBe(3);
    expect(BAZI_RULESET_V1.luckCycle.monthsPerDay).toBe(4);
    expect(BAZI_RULESET_V1.luckCycle.daysPerDoubleHour).toBe(10);
    expect(BAZI_RULESET_V1.branchRelationAndTransformation).toBe("separate_stages");
  });

  it("does not invent pillars before data is validated", () => {
    const result = calculateBazi(birth);
    expect(result.status).toBe("not_implemented");
    expect(result.result).toBeUndefined();
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
