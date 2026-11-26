import { describe, expect, it } from "vitest";
import { validateDayCycleReferenceFixtures, type DayCycleReferenceFixture } from "./day-cycle-fixtures.js";
import { DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS } from "./day-cycle-reference-candidates.js";
import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";

const base: DayCycleReferenceFixture = {
  civilDate: "2000-01-07",
  jdn: 2_451_551,
  cycleIndex: 0,
  sourceId: "calendar-a",
  sourceTitle: "Reference calendar A",
  sourceUrl: "https://example.org/calendar-a",
  accessedOn: "2026-11-22",
  dateBasis: "proleptic_gregorian_civil_date",
  jdnConvention: "integer_jdn_gregorian",
  sourceDerivationGroup: "independent-calendar-a"
};

describe("Gregorian civil date to integer JDN", () => {
  it("converts known Gregorian dates including the 1949 anchor", () => {
    expect(gregorianCivilDateToJdn("2000-01-07")).toBe(2_451_551);
    expect(gregorianCivilDateToJdn("1949-10-01")).toBe(2_433_191);
    expect(gregorianCivilDateToJdn("2000-02-29")).toBe(2_451_604);
  });

  it("rejects malformed and impossible dates", () => {
    expect(gregorianCivilDateToJdn("1900-02-29")).toBeNull();
    expect(gregorianCivilDateToJdn("2026-13-01")).toBeNull();
    expect(gregorianCivilDateToJdn("2026-02-30")).toBeNull();
    expect(gregorianCivilDateToJdn("0000-01-01")).toBeNull();
    expect(gregorianCivilDateToJdn("2026-2-01")).toBeNull();
  });
});

describe("day-cycle reference fixture evidence gate", () => {
  it("accepts matching records from two declared derivation groups as a candidate only", () => {
    const result = validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", sourceTitle: "Reference calendar B", sourceUrl: "https://example.net/calendar-b", sourceDerivationGroup: "independent-calendar-b" }
    ]);
    expect(result.status).toBe("candidate_supported");
    if (result.status === "candidate_supported") {
      expect(result.independentSourceCount).toBe(2);
      expect(result.warnings).toHaveLength(2);
    }
  });

  it("rejects duplicate source records from one derivation family", () => {
    const result = validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", sourceTitle: "Republished calendar A", sourceUrl: "https://example.net/calendar-b" }
    ]);
    expect(result.status).toBe("rejected");
    if (result.status === "rejected") {
      expect(result.reasons).toContain("The fixtures do not identify enough distinct source derivation groups.");
    }
  });

  it("rejects a single source even when duplicated", () => {
    expect(validateDayCycleReferenceFixtures([base, { ...base }]).status).toBe("rejected");
  });

  it("rejects disagreement in cycle index or JDN", () => {
    expect(validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", cycleIndex: 1, sourceDerivationGroup: "independent-b" }
    ]).status).toBe("rejected");
    expect(validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", jdn: base.jdn + 1, sourceDerivationGroup: "independent-b" }
    ]).status).toBe("rejected");
  });

  it("rejects a JDN that does not correspond to the stated Gregorian date", () => {
    expect(validateDayCycleReferenceFixtures([
      base,
      { ...base, sourceId: "calendar-b", jdn: base.jdn + 1, sourceDerivationGroup: "independent-b" }
    ]).status).toBe("rejected");
  });

  it("identifies the 1949 national-standard anchor but correctly rejects non-independent corroboration", () => {
    expect(DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS).toHaveLength(2);
    expect(DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS[0]?.jdn).toBe(2_433_191);
    expect(DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS[0]?.cycleIndex).toBe(0);
    expect(DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS[0]?.sourceDerivationGroup)
      .toBe(DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS[1]?.sourceDerivationGroup);
    expect(validateDayCycleReferenceFixtures([...DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS]).status).toBe("rejected");
  });

  it("rejects an attempt to lower the independent-source threshold below two", () => {
    expect(validateDayCycleReferenceFixtures([base], 1).status).toBe("rejected");
  });
});
