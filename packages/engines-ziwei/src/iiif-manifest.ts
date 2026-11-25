export interface IiifImageResource {
  imageId: string;
  serviceIds: string[];
  width?: number;
  height?: number;
  format?: string;
}

export interface IiifCanvasRecord {
  canvasIndex: number;
  canvasId: string;
  canvasLabel?: string;
  width?: number;
  height?: number;
  images: IiifImageResource[];
}

export interface IiifManifestIndex {
  manifestId: string;
  manifestLabel?: string;
  presentationVersion: 2 | 3;
  canvasCount: number;
  canvases: IiifCanvasRecord[];
  warnings: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readId(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  if (!isRecord(value)) return undefined;
  const id = value.id ?? value["@id"];
  return typeof id === "string" && id.trim() ? id : undefined;
}

function readLabel(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  if (!isRecord(value)) return undefined;

  const direct = value["@value"];
  if (typeof direct === "string" && direct.trim()) return direct;

  for (const candidate of Object.values(value)) {
    if (typeof candidate === "string" && candidate.trim()) return candidate;
    if (Array.isArray(candidate)) {
      const first = candidate.find((item) => typeof item === "string" && item.trim());
      if (typeof first === "string") return first;
    }
  }
  return undefined;
}

function readDimension(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function readServices(value: unknown): string[] {
  const values = Array.isArray(value) ? value : value === undefined ? [] : [value];
  return values.map(readId).filter((id): id is string => Boolean(id));
}

function parseV2Canvas(canvas: Record<string, unknown>, canvasIndex: number): IiifCanvasRecord {
  const canvasId = readId(canvas);
  if (!canvasId) throw new TypeError(`IIIF v2 canvas at index ${canvasIndex} has no @id.`);

  const annotations = Array.isArray(canvas.images) ? canvas.images : [];
  const images: IiifImageResource[] = [];

  for (const annotation of annotations) {
    if (!isRecord(annotation) || !isRecord(annotation.resource)) continue;
    const resource = annotation.resource;
    const imageId = readId(resource);
    if (!imageId) continue;
    images.push({
      imageId,
      serviceIds: readServices(resource.service),
      width: readDimension(resource.width),
      height: readDimension(resource.height),
      format: typeof resource.format === "string" ? resource.format : undefined
    });
  }

  return {
    canvasIndex,
    canvasId,
    canvasLabel: readLabel(canvas.label),
    width: readDimension(canvas.width),
    height: readDimension(canvas.height),
    images
  };
}

function parseV3Canvas(canvas: Record<string, unknown>, canvasIndex: number): IiifCanvasRecord {
  const canvasId = readId(canvas);
  if (!canvasId) throw new TypeError(`IIIF v3 canvas at index ${canvasIndex} has no id.`);

  const annotationPages = Array.isArray(canvas.items) ? canvas.items : [];
  const images: IiifImageResource[] = [];

  for (const page of annotationPages) {
    if (!isRecord(page) || !Array.isArray(page.items)) continue;
    for (const annotation of page.items) {
      if (!isRecord(annotation)) continue;
      const bodies = Array.isArray(annotation.body)
        ? annotation.body
        : annotation.body === undefined
          ? []
          : [annotation.body];

      for (const body of bodies) {
        if (!isRecord(body)) continue;
        const imageId = readId(body);
        if (!imageId) continue;
        images.push({
          imageId,
          serviceIds: readServices(body.service),
          width: readDimension(body.width),
          height: readDimension(body.height),
          format: typeof body.format === "string" ? body.format : undefined
        });
      }
    }
  }

  return {
    canvasIndex,
    canvasId,
    canvasLabel: readLabel(canvas.label),
    width: readDimension(canvas.width),
    height: readDimension(canvas.height),
    images
  };
}

/**
 * Extracts ordered canvas and image identifiers from IIIF Presentation API v2
 * or v3 manifests. It does not infer printed folio numbers or identify textual
 * passages; those require visual collation against the physical page.
 */
export function indexIiifManifest(input: unknown): IiifManifestIndex {
  if (!isRecord(input)) throw new TypeError("IIIF manifest must be a JSON object.");

  const manifestId = readId(input);
  if (!manifestId) throw new TypeError("IIIF manifest has no id/@id.");

  if (Array.isArray(input.sequences)) {
    const sequence = input.sequences[0];
    if (!isRecord(sequence) || !Array.isArray(sequence.canvases)) {
      throw new TypeError("IIIF v2 manifest has no default sequence with canvases.");
    }
    const canvases = sequence.canvases.map((canvas, index) => {
      if (!isRecord(canvas)) throw new TypeError(`IIIF v2 canvas at index ${index} is invalid.`);
      return parseV2Canvas(canvas, index);
    });
    return {
      manifestId,
      manifestLabel: readLabel(input.label),
      presentationVersion: 2,
      canvasCount: canvases.length,
      canvases,
      warnings: [
        "Canvas order is the digital presentation order, not proof of original printed foliation.",
        "Image identifiers do not identify textual passages without page-level visual collation."
      ]
    };
  }

  if (Array.isArray(input.items)) {
    const canvases = input.items.map((canvas, index) => {
      if (!isRecord(canvas)) throw new TypeError(`IIIF v3 canvas at index ${index} is invalid.`);
      return parseV3Canvas(canvas, index);
    });
    return {
      manifestId,
      manifestLabel: readLabel(input.label),
      presentationVersion: 3,
      canvasCount: canvases.length,
      canvases,
      warnings: [
        "Canvas order is the digital presentation order, not proof of original printed foliation.",
        "Image identifiers do not identify textual passages without page-level visual collation."
      ]
    };
  }

  throw new TypeError("Unsupported IIIF Presentation manifest: expected v2 sequences or v3 items.");
}
