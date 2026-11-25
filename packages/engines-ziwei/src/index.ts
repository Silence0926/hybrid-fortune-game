export {
  assessZiWeiRuleset,
  ZIWEI_REQUIRED_DECISIONS
} from "./ruleset.js";
export type {
  ZiWeiDecisionId,
  ZiWeiEvidenceClass,
  ZiWeiRuleDecision,
  ZiWeiRulesetAssessment,
  ZiWeiRulesetManifest,
  ZiWeiSourceKind,
  ZiWeiSourceRecord
} from "./ruleset.js";

export const ziWeiEngineStatus = {
  engineId: "ziwei",
  engineVersion: "0.1.0",
  status: "not_implemented" as const,
  reason: "No school profile, source-verified calendar policy, or reviewed placement ruleset has been approved."
};
