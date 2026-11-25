import { describe, expect, it } from "vitest";
import {
  assessZiWeiRuleset,
  ZIWEI_REQUIRED_DECISIONS,
  type ZiWeiRulesetManifest,
  type ZiWeiSourceRecord
} from "./ruleset.js";

function buildManifest(): ZiWeiRulesetManifest {
  const sources: ZiWeiSourceRecord[] = [{
    sourceId: "edition-a",
    title: "Registered reference edition",
    sourceKind: "edition",
    evidenceClass: "primary_edition",
    lineageId: "lineage-a",
    url: "https://example.org/edition-a",
    accessedOn: "2026-11-25",
    editionLabel: "Test edition"
  }];

  return {
    rulesetId: "ziwei-candidate",
    version: "0.1.0",
    schoolId: "candidate-school",
    schoolLabel: "Candidate school profile",
    sourceEditionIds: ["edition-a"],
    sources,
    decisions: ZIWEI_REQUIRED_DECISIONS.map((decisionId) => ({
      decisionId,
      status: "selected",
      policyId: `policy-${decisionId}`,
      sourceIds: ["edition-a"]
    }))
  };
}

describe("Zi Wei ruleset assessment", () => {
  it("blocks an empty manifest and lists every unresolved decision", () => {
    const result = assessZiWeiRuleset({
      rulesetId: "draft",
      version: "0.1.0",
      schoolId: "unset",
      schoolLabel: "Unselected",
      sourceEditionIds: [],
      sources: [],
      decisions: []
    });
    expect(result.status).toBe("blocked");
    if (result.status !== "blocked") return;
    expect(result.unresolvedDecisionIds).toEqual([...ZIWEI_REQUIRED_DECISIONS]);
  });

  it("blocks a profile with unresolved school decisions", () => {
    const manifest = buildManifest();
    manifest.decisions[3] = {
      decisionId: "leap_month",
      status: "undecided",
      sourceIds: []
    };
    const result = assessZiWeiRuleset(manifest);
    expect(result.status).toBe("blocked");
    if (result.status !== "blocked") return;
    expect(result.unresolvedDecisionIds).toContain("leap_month");
  });

  it("blocks selected decisions that reference unregistered source IDs", () => {
    const manifest = buildManifest();
    manifest.decisions[5] = {
      decisionId: "solar_time_policy",
      status: "selected",
      policyId: "civil-time",
      sourceIds: ["missing-source"]
    };
    const result = assessZiWeiRuleset(manifest);
    expect(result.status).toBe("blocked");
    if (result.status !== "blocked") return;
    expect(result.decisionsMissingEvidence).toEqual(["solar_time_policy"]);
  });

  it("rejects a source edition ID that does not resolve to an edition record", () => {
    const manifest = buildManifest();
    manifest.sources[0] = {
      sourceId: "edition-a",
      title: "Not an edition",
      sourceKind: "scholarly_study",
      evidenceClass: "scholarly_secondary",
      lineageId: "lineage-a",
      url: "https://example.org/study",
      accessedOn: "2026-11-25"
    };
    const result = assessZiWeiRuleset(manifest);
    expect(result.status).toBe("blocked");
    if (result.status !== "blocked") return;
    expect(result.reasons.some((reason) => reason.includes("not an edition record"))).toBe(true);
  });

  it("rejects duplicate source IDs", () => {
    const manifest = buildManifest();
    manifest.sources.push({ ...manifest.sources[0]! });
    const result = assessZiWeiRuleset(manifest);
    expect(result.status).toBe("blocked");
    if (result.status !== "blocked") return;
    expect(result.reasons.some((reason) => reason.includes("Duplicate source record"))).toBe(true);
  });

  it("validates source access dates and edition metadata", () => {
    const manifest = buildManifest();
    manifest.sources[0]!.accessedOn = "2026-02-30";
    manifest.sources[0]!.editionLabel = " ";
    const result = assessZiWeiRuleset(manifest);
    expect(result.status).toBe("blocked");
    if (result.status !== "blocked") return;
    expect(result.reasons.some((reason) => reason.includes("invalid accessedOn"))).toBe(true);
    expect(result.reasons.some((reason) => reason.includes("requires editionLabel"))).toBe(true);
  });

  it("rejects duplicate decision entries", () => {
    const manifest = buildManifest();
    manifest.decisions.push(manifest.decisions[0]!);
    const result = assessZiWeiRuleset(manifest);
    expect(result.status).toBe("blocked");
    if (result.status !== "blocked") return;
    expect(result.reasons.some((reason) => reason.includes("Duplicate decision"))).toBe(true);
  });

  it("only reaches candidate-for-review and never claims doctrinal validation", () => {
    const result = assessZiWeiRuleset(buildManifest());
    expect(result.status).toBe("candidate_for_domain_review");
    if (result.status !== "candidate_for_domain_review") return;
    expect(result.warnings).toHaveLength(4);
    expect("validated" in result).toBe(false);
    expect("calculationEnabled" in result).toBe(false);
  });
});
