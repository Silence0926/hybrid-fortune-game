import type { IiifManifestIndex } from "./iiif-manifest.js";
import type { IiifPageCollationRecord, IiifCollationAssessment } from "./iiif-collation.js";

/**
 * Adds a structural check against a parsed IIIF manifest. This verifies that
 * the cited canvas and image actually occur at the declared digital sequence
 * index; it does not establish printed foliation or doctrinal correctness.
 */
export function assessIiifPageCollationAgainstManifest(
  record: IiifPageCollationRecord,
  manifest: IiifManifestIndex
): IiifCollationAssessment {
  const reasons: string[] = [];
  const canvas = manifest.canvases.find((item) => item.canvasId === record.canvasId);

  if (!canvas) {
    reasons.push("canvasId does not exist in the supplied IIIF manifest.");
  } else {
    if (canvas.canvasIndex !== record.digitalSequenceIndex) {
      reasons.push("digitalSequenceIndex does not match the canvas position in the supplied IIIF manifest.");
    }
    if (!canvas.images.some((image) => image.imageId === record.imageId)) {
      reasons.push("imageId is not listed as an image resource on the cited canvas.");
    }
  }

  return {
    valid: reasons.length === 0,
    status: record.status,
    reasons,
    warnings: [
      "Manifest membership verifies digital identifiers only; it does not establish printed folio labels or recto/verso orientation.",
      "A structurally valid manifest mapping does not validate the historical or doctrinal correctness of the passage."
    ]
  };
}
