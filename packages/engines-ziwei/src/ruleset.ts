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

export type ZiWeiSourceKind =
  | "edition"
  | "archive_catalog"
  | "archive_manifest"
  | "digital_facsimile"
  | "electronic_transcription"
  | "facsimile_description"
  | "scholarly_study"
  | "school_manual"
  | "practitioner_reference"
  | "software_observation";

export type ZiWeiEvidenceClass =
  | "primary_edition"
  | "critical_edition"
  | "catalog_metadata"
  | "digital_facsimile"
  | "electronic_transcription"
  | "technical_manifest"
  | "scholarly_secondary"
  | "lineage_specific"
  | "modern_secondary"
  | "software_output";

export type ZiWeiSourceVerificationStatus =
  | "discovery_only"
  | "metadata_recorded"
  | "url_accessible"
  | "content_inspected"
  | "page_collated";

export interface ZiWeiSourceRecord {
  sourceId: string;
  title: string;
  sourceKind: ZiWeiSourceKind;
  evidenceClass: ZiWeiEvidenceClass;
  lineageId: string;
  url: string;
  accessedOn: string;
  verificationStatus: ZiWeiSourceVerificationStatus;
  editionLabel?: string;
  versionLabel?: string;
  authorOrCompiler?: string;
  publisherOrRepository?: string;
  publicationDate?: string;
  volume?: string;
  chapter?: string;
  pageOrFolio?: string;
  passageNote?: string;
}

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
  sources: ZiWeiSourceRecord[];
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

function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month! - 1 &&
    date.getUTCDate() === day
  );
}

function isValidHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

/**
 * Checks whether a proposed school profile has enough explicit decisions and
 * registered source references to enter human domain review. It never validates
 * doctrine, approves source independence, or enables chart calculation.
 */
export function assessZiWeiRuleset(
  manifest: ZiWeiRulesetManifest
): ZiWeiRulesetAssessment {
  const reasons: string[] = [];
  const decisionsById = new Map<ZiWeiDecisionId, ZiWeiRuleDecision>();
  const sourcesById = new Map<string, ZiWeiSourceRecord>();

  if (!manifest.rulesetId.trim()) reasons.push("rulesetId is required.");
  if (!manifest.version.trim()) reasons.push("version is required.");
  if (!manifest.schoolId.trim()) reasons.push("schoolId is required.");
  if (!manifest.schoolLabel.trim()) reasons.push("schoolLabel is required.");

  for (const source of manifest.sources) {
    if (!source.sourceId.trim()) {
      reasons.push("Every source record requires a non-empty sourceId.");
      continue;
    }
    if (sourcesById.has(source.sourceId)) {
      reasons.push(`Duplicate source record: ${source.sourceId}.`);
      continue;
    }
    sourcesById.set(source.sourceId, source);

    if (!source.title.trim()) reasons.push(`Source ${source.sourceId} requires a title.`);
    if (!source.lineageId.trim()) reasons.push(`Source ${source.sourceId} requires a lineageId.`);
    if (!["discovery_only", "metadata_recorded", "url_accessible", "content_inspected", "page_collated"].includes(source.verificationStatus)) {
      reasons.push(`Source ${source.sourceId} has an invalid verificationStatus.`);
    }
    if (!isValidHttpsUrl(source.url)) {
      reasons.push(`Source ${source.sourceId} must use a valid HTTPS URL with a hostname.`);
    }
    if (!isValidCalendarDate(source.accessedOn)) {
      reasons.push(`Source ${source.sourceId} has an invalid accessedOn date.`);
    }
    if (source.sourceKind === "edition" && !source.editionLabel?.trim()) {
      reasons.push(`Edition source ${source.sourceId} requires editionLabel.`);
    }
  }

  if (manifest.sourceEditionIds.length === 0) {
    reasons.push("At least one source edition must be registered.");
  }
  if (new Set(manifest.sourceEditionIds).size !== manifest.sourceEditionIds.length) {
    reasons.push("Source edition IDs must not contain duplicates.");
  }

  for (const editionId of manifest.sourceEditionIds) {
    const edition = sourcesById.get(editionId);
    if (!edition) {
      reasons.push(`Referenced source edition does not exist: ${editionId}.`);
    } else if (edition.sourceKind !== "edition") {
      reasons.push(`Source edition reference is not an edition record: ${editionId}.`);
    }
  }

  for (const decision of manifest.decisions) {
    if (!ZIWEI_REQUIRED_DECISIONS.includes(decision.decisionId)) {
      reasons.push(`Unknown decision ID: ${String(decision.decisionId)}.`);
      continue;
    }
    if (decisionsById.has(decision.decisionId)) {
      reasons.push(`Duplicate decision: ${decision.decisionId}.`);
    } else {
      decisionsById.set(decision.decisionId, decision);
    }
    if (new Set(decision.sourceIds).size !== decision.sourceIds.length) {
      reasons.push(`Decision ${decision.decisionId} contains duplicate source IDs.`);
    }
  }

  const unresolvedDecisionIds = ZIWEI_REQUIRED_DECISIONS.filter((id) => {
    const decision = decisionsById.get(id);
    return !decision || decision.status === "undecided";
  });

  const decisionsMissingEvidence = ZIWEI_REQUIRED_DECISIONS.filter((id) => {
    const decision = decisionsById.get(id);
    if (!decision || decision.status !== "selected") return false;
    return (
      !decision.policyId?.trim() ||
      decision.sourceIds.length === 0 ||
      decision.sourceIds.some((sourceId) => !sourcesById.has(sourceId))
    );
  });

  if (unresolvedDecisionIds.length > 0) {
    reasons.push("All required Zi Wei decisions must be explicitly selected before domain review.");
  }
  if (decisionsMissingEvidence.length > 0) {
    reasons.push("Every selected rule must identify a policy and source IDs present in the source registry.");
  }
  if (reasons.length > 0 || unresolvedDecisionIds.length > 0) {
    return {
      status: "blocked",
      reasons,
      unresolvedDecisionIds,
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
      "A shared lineageId means records must not be counted as independent evidence without human review.",
      "A domain reviewer must inspect each cited edition and rule passage.",
      "Candidate status does not enable production chart calculation."
    ]
  };
}
