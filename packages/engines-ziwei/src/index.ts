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
  ZiWeiSourceRecord,
  ZiWeiSourceVerificationStatus
} from "./ruleset.js";

export { ZIWEI_RESEARCH_SOURCES } from "./research-sources.js";

export const ziWeiEngineStatus = {
  engineId: "ziwei",
  engineVersion: "0.1.0",
  status: "not_implemented" as const,
  reason: "No school profile, source-verified calendar policy, or reviewed placement ruleset has been approved."
};

export { indexIiifManifest } from "./iiif-manifest.js";
export type {
  IiifCanvasRecord,
  IiifImageResource,
  IiifManifestIndex
} from "./iiif-manifest.js";

export { assessIiifPageCollation } from "./iiif-collation.js";
export type {
  IiifCollationAssessment,
  IiifPageCollationRecord
} from "./iiif-collation.js";
\nexport { assessIiifPageCollationAgainstManifest } from "./iiif-manifest-collation.js";\n