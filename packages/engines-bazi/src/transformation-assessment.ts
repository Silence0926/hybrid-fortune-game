import type { BranchRelationKind, BranchRelationMatch } from "./branch-relations.js";

export type TransformationEvidenceValue = "satisfied" | "not_satisfied" | "unknown";

export interface TransformationEvidence {
  /** Stable evidence key defined by the selected, versioned interpretation school. */
  key: string;
  value: TransformationEvidenceValue;
  /** Optional audit note; must describe evidence, not assert an unconfigured rule. */
  note?: string;
}

export interface TransformationPolicy {
  id: string;
  version: string;
  school: string;
  /** Relationship kinds eligible for consideration under this policy. */
  eligibleRelationKinds: readonly BranchRelationKind[];
  /** Every listed evidence key must be explicitly satisfied. */
  requiredEvidence: readonly string[];
  /** Target transformed element, if defined by the policy. */
  targetElement?: "wood" | "fire" | "earth" | "metal" | "water";
}

export type TransformationAssessmentStatus =
  | "policy_not_configured"
  | "not_eligible"
  | "insufficient_evidence"
  | "conditions_not_met"
  | "conditions_met_pending_domain_review";

export interface TransformationAssessment {
  status: TransformationAssessmentStatus;
  relation: Pick<BranchRelationMatch, "kind" | "branchIndices" | "positions" | "label">;
  policyId: string | null;
  policyVersion: string | null;
  school: string | null;
  targetElement: TransformationPolicy["targetElement"] | null;
  requiredEvidence: string[];
  evidence: TransformationEvidence[];
  explanation: string;
}

/**
 * Evaluates evidence against a caller-supplied, versioned school policy.
 *
 * No built-in school policy is provided. Even when all configured conditions
 * are satisfied, the result is pending domain review rather than a claim that
 * transformation has objectively occurred.
 */
export function assessBranchTransformation(
  relation: BranchRelationMatch,
  policy: TransformationPolicy | null,
  evidence: readonly TransformationEvidence[]
): TransformationAssessment {
  const relationSnapshot = {
    kind: relation.kind,
    branchIndices: [...relation.branchIndices],
    positions: [...relation.positions],
    label: relation.label
  };

  if (!policy) {
    return {
      status: "policy_not_configured",
      relation: relationSnapshot,
      policyId: null,
      policyVersion: null,
      school: null,
      targetElement: null,
      requiredEvidence: [],
      evidence: [...evidence],
      explanation: "No interpretation-school policy is configured; transformation is not assessed."
    };
  }

  if (!policy.eligibleRelationKinds.includes(relation.kind)) {
    return {
      status: "not_eligible",
      relation: relationSnapshot,
      policyId: policy.id,
      policyVersion: policy.version,
      school: policy.school,
      targetElement: policy.targetElement ?? null,
      requiredEvidence: [...policy.requiredEvidence],
      evidence: [...evidence],
      explanation: "This relationship kind is not eligible under the selected policy."
    };
  }

  const evidenceByKey = new Map<string, TransformationEvidence>();
  for (const item of evidence) {
    if (!evidenceByKey.has(item.key)) evidenceByKey.set(item.key, item);
  }

  const missing = policy.requiredEvidence.filter(key => !evidenceByKey.has(key));
  const unknown = policy.requiredEvidence.filter(key => evidenceByKey.get(key)?.value === "unknown");
  const unmet = policy.requiredEvidence.filter(key => evidenceByKey.get(key)?.value === "not_satisfied");

  let status: TransformationAssessmentStatus;
  let explanation: string;

  if (unmet.length > 0) {
    status = "conditions_not_met";
    explanation = `The selected policy has explicitly unmet conditions: ${unmet.join(", ")}.`;
  } else if (missing.length > 0 || unknown.length > 0) {
    status = "insufficient_evidence";
    explanation = `Evidence is incomplete or unknown. Missing: ${missing.join(", ") || "none"}; unknown: ${unknown.join(", ") || "none"}.`;
  } else {
    status = "conditions_met_pending_domain_review";
    explanation = "All configured evidence conditions are marked satisfied; domain review is still required before asserting transformation.";
  }

  return {
    status,
    relation: relationSnapshot,
    policyId: policy.id,
    policyVersion: policy.version,
    school: policy.school,
    targetElement: policy.targetElement ?? null,
    requiredEvidence: [...policy.requiredEvidence],
    evidence: [...evidence],
    explanation
  };
}
