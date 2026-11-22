import { describe, expect, it } from "vitest";
import { validateDayCycleReferenceFixtures, type DayCycleReferenceFixture } from "./day-cycle-fixtures.js";

const base: DayCycleReferenceFixture = {
  civilDate: "2000-01-07",
  jdn: 2_451_551,
  cycleIndex: 0,
  sourceId: "calendar-a",
  sourceTitle: "Reference calendar A",
  sourceUrl: "https://example.org/calendar-a",
  accessedOn: "2026-11-22",
  dateBasis: "proleptic_gregorian_civil_date",
  jdnConvention: "integer_jdn_gregorian"
};

describe("day-cycle reference fixture evidence gate", () => {
  it("accepts matching records from two separately identified sources as a candidate only", () => {
    const result = validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", sourceTitle: "Reference calendar B", sourceUrl: "https://example.net/calendar-b" }
    ]);
    expect(result.status).toBe("candidate_supported");
    if (result.status === "candidate_supported") {
      expect(result.independentSourceCount).toBe(2);
      expect(result.warnings).toHaveLength(2);
    }
  });

  it("rejects a single source even when duplicated", () => {
    const result = validateDayCycleReferenceFixtures([base, { ...base }]);
    expect(result.status).toBe("rejected");
  });

  it("rejects disagreement in cycle index or JDN", () => {
    expect(validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", cycleIndex: 1 }
    ]).status).toBe("rejected");
    expect(validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", jdn: base.jdn + 1 }
    ]).status).toBe("rejected");
  });

  it("rejects an attempt to lower the independent-source threshold below two", () => {
    expect(validateDayCycleReferenceFixtures([base], 1).status).toBe("rejected");
  });
});
