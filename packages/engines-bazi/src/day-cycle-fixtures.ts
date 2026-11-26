import { gregorianCivilDateToJdn } from "./gregorian-jdn.js";

/** Evidence gate for selecting a JDN -> sexagenary-day anchor. */
export interface DayCycleReferenceFixture {
  civilDate: string;
  jdn: number;
  cycleIndex: number;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  accessedOn: string;
  dateBasis: "proleptic_gregorian_civil_date";
  jdnConvention: "integer_jdn_gregorian";
  /** Shared derivation lineage; records in the same group are not independent. */
  sourceDerivationGroup: string;
}

export type DayCycleFixtureValidation =
  | {
      status: "candidate_supported";
      civilDate: string;
      jdn: number;
      cycleIndex: number;
      independentSourceCount: number;
      sourceIds: string[];
      derivationGroups: string[];
      warnings: string[];
    }
  | { status: "rejected"; reasons: string[] };

/**
 * Requires at least two distinct derivation groups to agree on the same
 * Gregorian date, computed JDN and sexagenary index. A successful result is
 * still only a candidate; domain review and source-authority assessment remain
 * mandatory.
 */
export function validateDayCycleReferenceFixtures(
  fixtures: DayCycleReferenceFixture[],
  minimumIndependentSources = 2
): DayCycleFixtureValidation {
  if (!Number.isInteger(minimumIndependentSources) || minimumIndependentSources < 2) {
    return { status: "rejected", reasons: ["At least two independent source families must be required."] };
  }
  if (fixtures.length < minimumIndependentSources) {
    return { status: "rejected", reasons: ["Not enough reference fixtures were supplied."] };
  }

  const first = fixtures[0]!;
  const expectedJdn = gregorianCivilDateToJdn(first.civilDate);
  if (expectedJdn === null || !Number.isSafeInteger(first.jdn) ||
      !Number.isInteger(first.cycleIndex) || first.cycleIndex < 0 || first.cycleIndex > 59) {
    return { status: "rejected", reasons: ["The first fixture has invalid date, JDN, or sexagenary index fields."] };
  }

  const reasons: string[] = [];
  const sourceIds = new Set<string>();
  const derivationGroups = new Set<string>();

  for (const fixture of fixtures) {
    const calculatedJdn = gregorianCivilDateToJdn(fixture.civilDate);
    if (calculatedJdn === null) reasons.push("A fixture has an invalid Gregorian civil date.");
    if (!Number.isSafeInteger(fixture.jdn)) reasons.push("A fixture has an unsafe or non-integer JDN.");
    if (calculatedJdn !== null && fixture.jdn !== calculatedJdn) {
      reasons.push("A fixture's supplied JDN does not match its Gregorian civil date.");
    }
    if (!Number.isInteger(fixture.cycleIndex) || fixture.cycleIndex < 0 || fixture.cycleIndex > 59) {
      reasons.push("A fixture has an invalid sexagenary cycle index.");
    }
    if (fixture.dateBasis !== "proleptic_gregorian_civil_date" || fixture.jdnConvention !== "integer_jdn_gregorian") {
      reasons.push("A fixture uses an unsupported date or JDN convention.");
    }
    if (!fixture.sourceId.trim() || !fixture.sourceTitle.trim() ||
        !/^https:\/\//.test(fixture.sourceUrl) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fixture.accessedOn) ||
        !fixture.sourceDerivationGroup.trim()) {
      reasons.push("A fixture is missing traceable source or derivation-lineage metadata.");
    }
    if (fixture.civilDate !== first.civilDate || fixture.jdn !== first.jdn || fixture.cycleIndex !== first.cycleIndex) {
      reasons.push("Reference fixtures disagree on date, JDN, or sexagenary index.");
    }
    sourceIds.add(fixture.sourceId.trim());
    derivationGroups.add(fixture.sourceDerivationGroup.trim());
  }

  if (derivationGroups.size < minimumIndependentSources) {
    reasons.push("The fixtures do not identify enough distinct source derivation groups.");
  }
  if (reasons.length) return { status: "rejected", reasons: [...new Set(reasons)] };

  return {
    status: "candidate_supported",
    civilDate: first.civilDate,
    jdn: expectedJdn,
    cycleIndex: first.cycleIndex,
    independentSourceCount: derivationGroups.size,
    sourceIds: [...sourceIds].sort(),
    derivationGroups: [...derivationGroups].sort(),
    warnings: [
      "Distinct derivation-group labels are metadata claims and still require human verification against source ownership and computational lineage.",
      "A candidate is not a production anchor until a domain reviewer signs off on the calendar convention and source authority."
    ]
  };
}
