import { describe, expect, it } from "vitest";
import { ZIWEI_RESEARCH_SOURCES } from "./research-sources.js";
import { assessIiifPageCollation, type IiifPageCollationRecord } from "./iiif-collation.js";

function buildDraft(): IiifPageCollationRecord {
  return {
    recordId: "collation-draft-001",
    facsimileSourceId: "zw-src-quanshu-mirror-266-images",
    manifestSourceId: "zw-src-quanshu-na-upper-iiif",
    canvasId: "https://archive.example/canvas/1",
    imageId: "https://archive.example/image/1",
    digitalSequenceIndex: 0,
    physicalSide: "unknown",
    status: "draft"
  };
}

describe("IIIF page collation evidence gate", () => {
  it("accepts a draft mapping without inventing folio or passage details", () => {
    const result = assessIiifPageCollation(buildDraft(), ZIWEI_RESEARCH_SOURCES);
    expect(result.valid).toBe(true);
    expect(result.status).toBe("draft");
    expect(result.reasons).toEqual([]);
    expect(result.warnings).toHaveLength(2);
  });

  it("rejects a reviewed mapping without physical folio and transcription evidence", () => {
    const record = buildDraft();
    record.status = "reviewed";
    const result = assessIiifPageCollation(record, ZIWEI_RESEARCH_SOURCES);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("Reviewed collation requires printedFolioLabel.");
    expect(result.reasons).toContain("Reviewed collation requires a known physicalSide.");
    expect(result.reasons).toContain("Reviewed collation requires transcriptionSourceId.");
    expect(result.reasons).toContain("Reviewed collation requires passageLocator.");
    expect(result.reasons).toContain("Reviewed collation requires reviewer.");
    expect(result.reasons).toContain("Reviewed collation requires a valid reviewedOn date.");
  });

  it("accepts a fully referenced manual collation but warns that doctrine is not approved", () => {
    const record = buildDraft();
    record.status = "reviewed";
    record.transcriptionSourceId = "zw-src-quanshu-wikisource-vol2-rev1963110";
    record.printedFolioLabel = "test folio label";
    record.physicalSide = "recto";
    record.passageLocator = "test section locator";
    record.reviewer = "domain reviewer";
    record.reviewedOn = "2026-11-25";

    const result = assessIiifPageCollation(record, ZIWEI_RESEARCH_SOURCES);
    expect(result.valid).toBe(true);
    expect(result.status).toBe("reviewed");
    expect(result.warnings.some((warning) => warning.includes("does not validate"))).toBe(true);
  });

  it("rejects a manifest or transcription source with the wrong evidence kind", () => {
    const record = buildDraft();
    record.manifestSourceId = "zw-src-quanshu-wikisource-vol2-rev1963110";
    record.transcriptionSourceId = "zw-src-quanshu-na-upper-iiif";
    const result = assessIiifPageCollation(record, ZIWEI_RESEARCH_SOURCES);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("manifestSourceId must reference an archive_manifest source.");
    expect(result.reasons).toContain("transcriptionSourceId must reference an electronic_transcription source.");
  });

  it("requires inspected source content before allowing page collation", () => {
    const record = buildDraft();
    const sources = ZIWEI_RESEARCH_SOURCES.map((source) =>
      source.sourceId === "zw-src-quanshu-mirror-266-images"
        ? { ...source, verificationStatus: "discovery_only" as const }
        : source
    );
    const result = assessIiifPageCollation(record, sources);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("Facsimile source must be inspected before it can support a page collation.");
  });

  it("rejects invalid digital sequence indices", () => {
    const record = buildDraft();
    record.digitalSequenceIndex = -1;
    const result = assessIiifPageCollation(record, ZIWEI_RESEARCH_SOURCES);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("digitalSequenceIndex must be a non-negative integer.");
  });
});
