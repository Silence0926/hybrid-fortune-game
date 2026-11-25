import { describe, expect, it } from "vitest";
import { ZIWEI_RESEARCH_SOURCES } from "./research-sources.js";

describe("Zi Wei research source registry", () => {
  it("uses unique source IDs and valid HTTPS links", () => {
    const ids = ZIWEI_RESEARCH_SOURCES.map((source) => source.sourceId);
    expect(new Set(ids).size).toBe(ids.length);

    for (const source of ZIWEI_RESEARCH_SOURCES) {
      expect(() => new URL(source.url)).not.toThrow();
      expect(new URL(source.url).protocol).toBe("https:");
      expect(source.title.trim().length).toBeGreaterThan(0);
      expect(source.lineageId.trim().length).toBeGreaterThan(0);
      expect(source.accessedOn).toBe("2026-11-25");
    }
  });

  it("groups the two archive IIIF manifests under the same physical witness", () => {
    const upper = ZIWEI_RESEARCH_SOURCES.find((source) => source.sourceId === "zw-src-quanshu-na-upper-iiif");
    const lower = ZIWEI_RESEARCH_SOURCES.find((source) => source.sourceId === "zw-src-quanshu-na-lower-iiif");
    expect(upper).toBeDefined();
    expect(lower).toBeDefined();
    expect(upper!.lineageId).toBe(lower!.lineageId);
  });

  it("keeps the three-volume Xu Daozang corpus distinct from the Quanshu witness", () => {
    const xuDaoZang = ZIWEI_RESEARCH_SOURCES.filter((source) => source.sourceId.startsWith("zw-src-xudaozang-"));
    const quanshu = ZIWEI_RESEARCH_SOURCES.find((source) => source.sourceId === "zw-src-quanshu-na-japan-archives");
    expect(xuDaoZang).toHaveLength(3);
    expect(new Set(xuDaoZang.map((source) => source.lineageId)).size).toBe(1);
    expect(quanshu).toBeDefined();
    expect(xuDaoZang.every((source) => source.lineageId !== quanshu!.lineageId)).toBe(true);
  });

  it("labels transcriptions and technical manifests as non-primary evidence classes", () => {
    const transcription = ZIWEI_RESEARCH_SOURCES.find((source) => source.sourceId === "zw-src-quanshu-wikisource-vol2-rev1963110");
    const manifest = ZIWEI_RESEARCH_SOURCES.find((source) => source.sourceId === "zw-src-quanshu-na-upper-iiif");
    expect(transcription?.evidenceClass).toBe("electronic_transcription");
    expect(manifest?.evidenceClass).toBe("technical_manifest");
    expect(transcription?.lineageId).not.toBe(manifest?.lineageId);
  });
});
