/**
 * Evidence gate for selecting a JDN -> sexagenary-day anchor.
 *
 * This module validates provenance and agreement; it does not certify that
 * a cited source is authoritative. Human domain review remains mandatory.
 */
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
}

export type DayCycleFixtureValidation =
  | {
      status: "candidate_supported";
      civilDate: string;
      jdn: number;
      cycleIndex: number;
      independentSourceCount: number;
      sourceIds: string[];
      warnings: string[];
    }
  | {
      status: "rejected";
      reasons: string[];
    };

/**
 * Requires independent source identifiers to agree on the same civil date,
 * JDN convention and sexagenary index. A successful result is only a
 * candidate: source independence and domain authority require human review.
 */
export function validateDayCycleReferenceFixtures(
  fixtures: DayCycleReferenceFixture[],
  minimumIndependentSources = 2
): DayCycleFixtureValidation {
  const reasons: string[] = [];
  if (!Number.isInteger(minimumIndependentSources) || minimumIndependentSources < 2) {
    return { status: "rejected", reasons: ["At least two independent sources must be required."] };
  }
  if (fixtures.length < minimumIndependentSources) {
    return { status: "rejected", reasons: ["Not enough reference fixtures were supplied."] };
  }

  const first = fixtures[0]!;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(first.civilDate) ||
      !Number.isSafeInteger(first.jdn) ||
      !Number.isInteger(first.cycleIndex) || first.cycleIndex < 0 || first.cycleIndex > 59) {
    return { status: "rejected", reasons: ["The first fixture has invalid date, JDN, or sexagenary index fields."] };
  }

  const sourceIds = new Set<string>();
  for (const fixture of fixtures) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fixture.civilDate)) reasons.push("A fixture has an invalid ISO civil date.");
    if (!Number.isSafeInteger(fixture.jdn)) reasons.push("A fixture has an unsafe or non-integer JDN.");
    if (!Number.isInteger(fixture.cycleIndex) || fixture.cycleIndex < 0 || fixture.cycleIndex > 59) reasons.push("A fixture has an invalid sexagenary cycle index.");
    if (fixture.dateBasis !== "proleptic_gregorian_civil_date" || fixture.jdnConvention !== "integer_jdn_gregorian") reasons.push("A fixture uses an unsupported date or JDN convention.");
    if (!fixture.sourceId.trim() || !fixture.sourceTitle.trim() || !/^https:\/\//.test(fixture.sourceUrl) || !/^\d{4}-\d{2}-\d{2}$/.test(fixture.accessedOn)) reasons.push("A fixture is missing traceable source metadata.");
    if (fixture.civilDate !== first.civilDate || fixture.jdn !== first.jdn || fixture.cycleIndex !== first.cycleIndex) reasons.push("Reference fixtures disagree on date, JDN, or sexagenary index.");
    sourceIds.add(fixture.sourceId.trim());
  }

  if (sourceIds.size < minimumIndependentSources) reasons.push("The fixtures do not identify enough distinct sources.");
  if (reasons.length) return { status: "rejected", reasons: [...new Set(reasons)] };

  return {
    status: "candidate_supported",
    civilDate: first.civilDate,
    jdn: first.jdn,
    cycleIndex: first.cycleIndex,
    independentSourceCount: sourceIds.size,
    sourceIds: [...sourceIds].sort(),
    warnings: [
      "Distinct source IDs do not prove source independence; reviewers must inspect source ownership and derivation.",
      "This candidate is not an approved production anchor until a domain reviewer signs off on the calendar convention and source authority."
    ]
  };
}
