import { describe, expect, it } from "vitest";
import { assessIiifPageCollationAgainstManifest } from "./iiif-manifest-collation.js";
import type { IiifManifestIndex } from "./iiif-manifest.js";
import type { IiifPageCollationRecord } from "./iiif-collation.js";

const manifest: IiifManifestIndex = {
  manifestId: "https://archive.example/manifest",
  presentationVersion: 3,
  canvasCount: 2,
  canvases: [
    { canvasIndex: 0, canvasId: "https://archive.example/canvas/0", images: [
      { imageId: "https://archive.example/image/0", serviceIds: ["https://archive.example/service/0"] }
    ] },
    { canvasIndex: 1, canvasId: "https://archive.example/canvas/1", images: [
      { imageId: "https://archive.example/image/1", serviceIds: ["https://archive.example/service/1"] }
    ] }
  ],
  warnings: []
};

function record(): IiifPageCollationRecord {
  return {
    recordId: "collation-1",
    facsimileSourceId: "facsimile",
    manifestSourceId: "manifest",
    canvasId: "https://archive.example/canvas/1",
    imageId: "https://archive.example/image/1",
    digitalSequenceIndex: 1,
    physicalSide: "unknown",
    status: "draft"
  };
}

describe("IIIF manifest-backed page collation", () => {
  it("accepts a canvas, image and sequence index that match the parsed manifest", () => {
    const result = assessIiifPageCollationAgainstManifest(record(), manifest);
    expect(result.valid).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it("rejects a canvas identifier absent from the manifest", () => {
    const item = record();
    item.canvasId = "https://archive.example/canvas/missing";
    const result = assessIiifPageCollationAgainstManifest(item, manifest);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("canvasId does not exist in the supplied IIIF manifest.");
  });

  it("rejects an image not attached to the cited canvas", () => {
    const item = record();
    item.imageId = "https://archive.example/image/0";
    const result = assessIiifPageCollationAgainstManifest(item, manifest);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("imageId is not listed as an image resource on the cited canvas.");
  });

  it("rejects a digital sequence index that differs from manifest order", () => {
    const item = record();
    item.digitalSequenceIndex = 0;
    const result = assessIiifPageCollationAgainstManifest(item, manifest);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("digitalSequenceIndex does not match the canvas position in the supplied IIIF manifest.");
  });
});
