import type { ZiWeiSourceRecord } from "./ruleset.js";

export interface IiifPageCollationRecord {
  recordId: string;
  facsimileSourceId: string;
  manifestSourceId: string;
  transcriptionSourceId?: string;
  canvasId: string;
  imageId: string;
  digitalSequenceIndex: number;
  printedFolioLabel?: string;
  physicalSide: "recto" | "verso" | "cover" | "blank" | "unknown";
  passageLocator?: string;
  passageHeading?: string;
  status: "draft" | "reviewed";
  reviewer?: string;
  reviewedOn?: string;
  notes?: string;
}

export interface IiifCollationAssessment {
  valid: boolean;
  status: "draft" | "reviewed";
  reasons: string[];
  warnings: string[];
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month! - 1 &&
    date.getUTCDate() === day;
}

/**
 * Validates the evidence links required for a manually reviewed page mapping.
 * A reviewed mapping means image-to-folio/text collation only; it does not
 * validate the doctrinal correctness of any rule found on that page.
 */
export function assessIiifPageCollation(
  record: IiifPageCollationRecord,
  sources: readonly ZiWeiSourceRecord[]
): IiifCollationAssessment {
  const reasons: string[] = [];
  const sourceById = new Map(sources.map((source) => [source.sourceId, source]));

  if (!record.recordId.trim()) reasons.push("recordId is required.");
  if (!record.canvasId.trim()) reasons.push("canvasId is required.");
  if (!record.imageId.trim()) reasons.push("imageId is required.");
  if (!Number.isInteger(record.digitalSequenceIndex) || record.digitalSequenceIndex < 0) {
    reasons.push("digitalSequenceIndex must be a non-negative integer.");
  }

  const facsimile = sourceById.get(record.facsimileSourceId);
  if (!facsimile) {
    reasons.push(`Facsimile source is not registered: ${record.facsimileSourceId}.`);
  } else if (facsimile.sourceKind !== "digital_facsimile") {
    reasons.push("facsimileSourceId must reference a digital_facsimile source.");
  }

  const manifest = sourceById.get(record.manifestSourceId);
  if (!manifest) {
    reasons.push(`Manifest source is not registered: ${record.manifestSourceId}.`);
  } else if (manifest.sourceKind !== "archive_manifest") {
    reasons.push("manifestSourceId must reference an archive_manifest source.");
  }

  if (record.transcriptionSourceId) {
    const transcription = sourceById.get(record.transcriptionSourceId);
    if (!transcription) {
      reasons.push(`Transcription source is not registered: ${record.transcriptionSourceId}.`);
    } else if (transcription.sourceKind !== "electronic_transcription") {
      reasons.push("transcriptionSourceId must reference an electronic_transcription source.");
    }
  }

  if (record.status === "reviewed") {
    if (!record.printedFolioLabel?.trim()) reasons.push("Reviewed collation requires printedFolioLabel.");
    if (record.physicalSide === "unknown") reasons.push("Reviewed collation requires a known physicalSide.");
    if (!record.transcriptionSourceId) reasons.push("Reviewed collation requires transcriptionSourceId.");
    if (!record.passageLocator?.trim()) reasons.push("Reviewed collation requires passageLocator.");
    if (!record.reviewer?.trim()) reasons.push("Reviewed collation requires reviewer.");
    if (!record.reviewedOn || !isValidDate(record.reviewedOn)) {
      reasons.push("Reviewed collation requires a valid reviewedOn date.");
    }
  }

  return {
    valid: reasons.length === 0,
    status: record.status,
    reasons,
    warnings: [
      "Digital sequence index is not an original printed folio number.",
      "A reviewed image-to-text mapping does not validate the historical or doctrinal correctness of the passage."
    ]
  };
}
