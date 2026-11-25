import { describe, expect, it } from "vitest";
import { indexIiifManifest } from "./iiif-manifest.js";

describe("IIIF Presentation manifest indexer", () => {
  it("indexes ordered canvases and image services from a v2 manifest", () => {
    const result = indexIiifManifest({
      "@id": "https://archive.example/manifest/1",
      "@type": "sc:Manifest",
      label: "Test manuscript",
      sequences: [{
        "@id": "https://archive.example/sequence/normal",
        "@type": "sc:Sequence",
        canvases: [
          {
            "@id": "https://archive.example/canvas/cover",
            "@type": "sc:Canvas",
            label: "Cover",
            width: 1200,
            height: 1800,
            images: [{
              "@type": "oa:Annotation",
              resource: {
                "@id": "https://images.example/cover/full.jpg",
                "@type": "dctypes:Image",
                format: "image/jpeg",
                width: 1200,
                height: 1800,
                service: {
                  "@id": "https://images.example/cover",
                  "@type": "iiif:Image",
                  profile: "http://iiif.io/api/image/2/level1.json"
                }
              }
            }]
          },
          {
            "@id": "https://archive.example/canvas/page-1",
            label: "Image 2",
            images: [{
              resource: { "@id": "https://images.example/page-1.jpg" }
            }]
          }
        ]
      }]
    });

    expect(result.presentationVersion).toBe(2);
    expect(result.canvasCount).toBe(2);
    expect(result.canvases[0]?.canvasLabel).toBe("Cover");
    expect(result.canvases[0]?.images[0]?.serviceIds).toEqual(["https://images.example/cover"]);
    expect(result.canvases[1]?.canvasIndex).toBe(1);
    expect(result.warnings).toHaveLength(2);
  });

  it("indexes ordered canvases and multiple bodies from a v3 manifest", () => {
    const result = indexIiifManifest({
      id: "https://archive.example/manifest/3",
      type: "Manifest",
      label: { en: ["Volume A"] },
      items: [{
        id: "https://archive.example/canvas/1",
        type: "Canvas",
        label: { en: ["Digital image 1"] },
        width: 2400,
        height: 3600,
        items: [{
          id: "https://archive.example/page/1",
          type: "AnnotationPage",
          items: [{
            id: "https://archive.example/annotation/1",
            type: "Annotation",
            motivation: "painting",
            body: [{
              id: "https://images.example/page-1/full.jpg",
              type: "Image",
              format: "image/jpeg",
              width: 2400,
              height: 3600,
              service: [{
                id: "https://images.example/page-1",
                type: "ImageService3",
                profile: "level1"
              }]
            }]
          }]
        }]
      }]
    });

    expect(result.presentationVersion).toBe(3);
    expect(result.manifestLabel).toBe("Volume A");
    expect(result.canvases[0]?.canvasLabel).toBe("Digital image 1");
    expect(result.canvases[0]?.images[0]?.imageId).toBe("https://images.example/page-1/full.jpg");
    expect(result.canvases[0]?.images[0]?.serviceIds).toEqual(["https://images.example/page-1"]);
  });

  it("preserves a canvas even when it has no recognized image annotation", () => {
    const result = indexIiifManifest({
      id: "https://archive.example/manifest/empty",
      type: "Manifest",
      items: [{ id: "https://archive.example/canvas/blank", type: "Canvas", items: [] }]
    });
    expect(result.canvasCount).toBe(1);
    expect(result.canvases[0]?.images).toEqual([]);
  });

  it("rejects missing manifest identifiers and unsupported structures", () => {
    expect(() => indexIiifManifest({ sequences: [] })).toThrow("no id/@id");
    expect(() => indexIiifManifest({ id: "https://archive.example/manifest" })).toThrow("Unsupported IIIF");
    expect(() => indexIiifManifest(null)).toThrow("JSON object");
  });
});
