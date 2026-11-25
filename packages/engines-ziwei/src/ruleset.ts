export const ZIWEI_REQUIRED_DECISIONS = [
  "textual_basis",
  "school_identity",
  "calendar_input",
  "leap_month",
  "birth_time",
  "solar_time_policy",
  "day_boundary",
  "life_body_palaces",
  "five_element_bureau",
  "ziwei_tianfu_placement",
  "main_auxiliary_stars",
  "four_transformations",
  "twelve_palaces",
  "decade_limits",
  "annual_layers",
  "interpretation_sources"
] as const;

export type ZiWeiDecisionId = (typeof ZIWEI_REQUIRED_DECISIONS)[number];

export interface ZiWeiRuleDecision {
  decisionId: ZiWeiDecisionId;
  status: "undecided" | "selected";
  policyId?: string;
  sourceIds: string[];
  rationale?: string;
}

export interface ZiWeiRulesetManifest {
  rulesetId: string;
  version: string;
  schoolId: string;
  schoolLabel: string;
  sourceEditionIds: string[];
  decisions: ZiWeiRuleDecision[];
}

export type ZiWeiRulesetAssessment =
  | {
      status: "blocked";
      reasons: string[];
      unresolvedDecisionIds: ZiWeiDecisionId[];
      decisionsMissingEvidence: ZiWeiDecisionId[];
    }
  | {
      status: "evidence_incomplete";
      reasons: string[];
      unresolvedDecisionIds: [];
      decisionsMissingEvidence: ZiWeiDecisionId[];
    }
  | {
      status: "candidate_for_domain_review";
      reasons: [];
      unresolvedDecisionIds: [];
      decisionsMissingEvidence: [];
      warnings: string[];
    };

/**
 * Checks whether a proposed school profile has enough explicit decisions and
 * source references to enter human domain review. It never validates doctrine,
 * approves source independence, or enables chart calculation.
 */
export function assessZiWeiRuleset(
  manifest: ZiWeiRulesetManifest
): ZiWeiRulesetAssessment {
  const reasons: string[] = [];
  const decisionsById = new Map<ZiWeiDecisionId, ZiWeiRuleDecision>();

  if (!manifest.rulesetId.trim()) reasons.push("rulesetId is required.");
  if (!manifest.version.trim()) reasons.push("version is required.");
  if (!manifest.schoolId.trim()) reasons.push("schoolId is required.");
  if (!manifest.schoolLabel.trim()) reasons.push("schoolLabel is required.");
  if (manifest.sourceEditionIds.length === 0) {
    reasons.push("At least one source edition must be registered.");
  }

  for (const decision of manifest.decisions) {
    if (decisionsById.has(decision.decisionId)) {
      reasons.push(`Duplicate decision: ${decision.decisionId}.`);
    } else {
      decisionsById.set(decision.decisionId, decision);
    }
  }

  const unresolvedDecisionIds = ZIWEI_REQUIRED_DECISIONS.filter((id) => {
    const decision = decisionsById.get(id);
    return !decision || decision.status === "undecided";
  });

  const decisionsMissingEvidence = ZIWEI_REQUIRED_DECISIONS.filter((id) => {
    const decision = decisionsById.get(id);
    return Boolean(
      decision &&
      decision.status === "selected" &&
      (!decision.policyId?.trim() || decision.sourceIds.length === 0)
    );
  });

  if (unresolvedDecisionIds.length > 0) {
    reasons.push("All required Zi Wei decisions must be explicitly selected before domain review.");
  }
  if (reasons.length > 0 || unresolvedDecisionIds.length > 0) {
    return {
      status: "blocked",
      reasons,
      unresolvedDecisionIds,
      decisionsMissingEvidence
    };
  }

  if (decisionsMissingEvidence.length > 0) {
    return {
      status: "evidence_incomplete",
      reasons: ["Every selected rule must identify a policy and at least one source record."],
      unresolvedDecisionIds: [],
      decisionsMissingEvidence
    };
  }

  return {
    status: "candidate_for_domain_review",
    reasons: [],
    unresolvedDecisionIds: [],
    decisionsMissingEvidence: [],
    warnings: [
      "This assessment does not establish source authority, textual accuracy, or independence.",
      "A domain reviewer must inspect each cited edition and rule passage.",
      "Candidate status does not enable production chart calculation."
    ]
  };
}
