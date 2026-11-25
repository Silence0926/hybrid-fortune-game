import { describe, expect, it } from "vitest";
import {
  assessZiWeiRuleset,
  ZIWEI_REQUIRED_DECISIONS,
  type ZiWeiRulesetManifest
} from "./ruleset.js";

function buildManifest(): ZiWeiRulesetManifest {
  return {
    rulesetId: "ziwei-candidate",
    version: "0.1.0",
    schoolId: "candidate-school",
    schoolLabel: "Candidate school profile",
    sourceEditionIds: ["edition-a"],
    decisions: ZIWEI_REQUIRED_DECISIONS.map((decisionId) => ({
      decisionId,
      status: "selected",
      policyId: `policy-${decisionId}`,
      sourceIds: [`source-${decisionId}`]
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

  it("requires policy and source references for every selected decision", () => {
    const manifest = buildManifest();
    manifest.decisions[5] = {
      decisionId: "solar_time_policy",
      status: "selected",
      policyId: "civil-time",
      sourceIds: []
    };
    const result = assessZiWeiRuleset(manifest);
    expect(result.status).toBe("evidence_incomplete");
    if (result.status !== "evidence_incomplete") return;
    expect(result.decisionsMissingEvidence).toEqual(["solar_time_policy"]);
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
    expect(result.warnings).toHaveLength(3);
    expect("validated" in result).toBe(false);
    expect("calculationEnabled" in result).toBe(false);
  });
});
