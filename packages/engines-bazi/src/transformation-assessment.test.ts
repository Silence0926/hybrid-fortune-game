import { describe, expect, it } from "vitest";
import { assessBranchTransformation, type TransformationPolicy } from "./transformation-assessment.js";
import { detectBranchRelations } from "./branch-relations.js";

const harmony = detectBranchRelations([0, 1]).find(match => match.kind === "six_harmony")!;

const policy: TransformationPolicy = {
  id: "test-school-six-harmony",
  version: "0.0.1-test",
  school: "test-only",
  eligibleRelationKinds: ["six_harmony"],
  requiredEvidence: ["seasonal_support", "transforming_element_visible", "unopposed"],
  targetElement: "earth"
};

describe("branch transformation assessment boundary", () => {
  it("does not assess transformation without a selected policy", () => {
    expect(assessBranchTransformation(harmony, null, []).status).toBe("policy_not_configured");
  });

  it("rejects relationship kinds outside the selected policy", () => {
    const clash = detectBranchRelations([0, 6]).find(match => match.kind === "six_clash")!;
    expect(assessBranchTransformation(clash, policy, []).status).toBe("not_eligible");
  });

  it("reports incomplete evidence without assuming missing conditions", () => {
    expect(assessBranchTransformation(harmony, policy, [
      { key: "seasonal_support", value: "satisfied" },
      { key: "transforming_element_visible", value: "unknown" }
    ]).status).toBe("insufficient_evidence");
  });

  it("reports explicitly unmet conditions", () => {
    expect(assessBranchTransformation(harmony, policy, [
      { key: "seasonal_support", value: "satisfied" },
      { key: "transforming_element_visible", value: "satisfied" },
      { key: "unopposed", value: "not_satisfied" }
    ]).status).toBe("conditions_not_met");
  });

  it("never declares transformation complete, even when all policy evidence is satisfied", () => {
    const result = assessBranchTransformation(harmony, policy, [
      { key: "seasonal_support", value: "satisfied" },
      { key: "transforming_element_visible", value: "satisfied" },
      { key: "unopposed", value: "satisfied" }
    ]);
    expect(result.status).toBe("conditions_met_pending_domain_review");
    expect(result.policyId).toBe(policy.id);
    expect(result.targetElement).toBe("earth");
  });
});
