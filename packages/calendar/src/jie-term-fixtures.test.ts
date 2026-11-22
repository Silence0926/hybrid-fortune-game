import { describe, expect, it } from "vitest";
import { getBaziMonthBoundaryTerms } from "./solar-terms.js";
import { validateJieTermReferenceFixtures, type JieTermReferenceFixture } from "./jie-term-fixtures.js";

function buildSyntheticFixtures(): JieTermReferenceFixture[] {
  return getBaziMonthBoundaryTerms().flatMap((term, index) => {
    const day = String(index + 1).padStart(2, "0");
    const local = `2026-01-${day}T12:00:00+08:00`;
    const utc = `2026-01-${day}T04:00:00Z`;
    const base: JieTermReferenceFixture = {
      year: 2026,
      termZh: term.nameZh,
      solarLongitudeDegrees: term.longitudeDegrees,
      publishedLocalDateTime: local,
      timeZone: "Asia/Hong_Kong",
      utcInstant: utc,
      publishedPrecision: "minute",
      sourceId: "reference-a",
      sourceTitle: "Synthetic source A",
      sourceUrl: "https://example.org/source-a",
      accessedOn: "2026-11-22"
    };
    return [
      base,
      { ...base, sourceId: "reference-b", sourceTitle: "Synthetic source B", sourceUrl: "https://example.net/source-b" }
    ];
  });
}

describe("Jie-term reference fixture evidence gate", () => {
  it("accepts full twelve-term coverage with two source IDs as a candidate only", () => {
    const result = validateJieTermReferenceFixtures(buildSyntheticFixtures());
    expect(result.status).toBe("candidate_supported");
    if (result.status === "candidate_supported") {
      expect(result.termCount).toBe(12);
      expect(Object.values(result.sourceCountByTerm)).toEqual(Array(12).fill(2));
      expect(result.warnings).toHaveLength(2);
    }
  });

  it("rejects missing terms and insufficient sources", () => {
    const fixtures = buildSyntheticFixtures();
    expect(validateJieTermReferenceFixtures(fixtures.slice(0, -2)).status).toBe("rejected");
    expect(validateJieTermReferenceFixtures(fixtures.map((fixture) => ({
      ...fixture, sourceId: "same-source"
    }))).status).toBe("rejected");
  });

  it("rejects mismatched longitude and local-to-UTC conversion", () => {
    const fixtures = buildSyntheticFixtures();
    fixtures[0] = { ...fixtures[0]!, solarLongitudeDegrees: 30 };
    expect(validateJieTermReferenceFixtures(fixtures).status).toBe("rejected");

    const secondSet = buildSyntheticFixtures();
    secondSet[0] = { ...secondSet[0]!, utcInstant: "2026-01-01T05:00:00Z" };
    expect(validateJieTermReferenceFixtures(secondSet).status).toBe("rejected");
  });

  it("rejects minute-precision records that imply seconds or fractions", () => {
    const fixtures = buildSyntheticFixtures();
    fixtures[0] = {
      ...fixtures[0]!,
      publishedLocalDateTime: "2026-01-01T12:00:01+08:00",
      utcInstant: "2026-01-01T04:00:01Z"
    };
    expect(validateJieTermReferenceFixtures(fixtures).status).toBe("rejected");
  });

  it("does not permit weakening the two-source minimum", () => {
    expect(validateJieTermReferenceFixtures(buildSyntheticFixtures(), 1).status).toBe("rejected");
  });
});
