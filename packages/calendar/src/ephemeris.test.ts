import { describe, expect, it } from "vitest";
import { findSolarLongitudeCrossing, type EphemerisProvider } from "./ephemeris.js";

const provenance = {
  providerId: "test-linear-provider",
  providerVersion: "1.0.0",
  datasetId: "synthetic-test-only",
  datasetVersion: "1",
  datasetChecksum: null,
  sourceCitation: "Synthetic deterministic fixture; not an astronomical source.",
  license: "test-only",
  coordinateModel: "apparent_geocentric_ecliptic_of_date" as const,
  inputInstantScale: "UTC" as const,
  calculationTimeScale: "TT" as const,
  earthRotationTimeScale: "not_required" as const,
  timeConversionPolicy: "Synthetic test: input UTC passed through without physical time conversion.",
  deltaTModel: "not_applicable_synthetic",
  deltaTUncertaintySeconds: null,
  supportedFrom: "2025-01-01T00:00:00.000Z",
  supportedThrough: "2026-01-01T00:00:00.000Z",
  uncertaintySeconds: null
};

function linearProvider(startMs: number, startLongitude: number, degreesPerDay: number): EphemerisProvider {
  return {
    provenance,
    async getApparentSolarLongitude(instant: string) {
      const elapsedDays = (Date.parse(instant) - startMs) / 86_400_000;
      return {
        instant,
        longitudeDegrees: ((startLongitude + elapsedDays * degreesPerDay) % 360 + 360) % 360,
        provenance
      };
    }
  };
}

describe("findSolarLongitudeCrossing", () => {
  it("finds a target crossing in a deterministic synthetic fixture", async () => {
    const start = Date.parse("2025-01-01T00:00:00.000Z");
    const provider = linearProvider(start, 0, 1);
    const result = await findSolarLongitudeCrossing(provider, {
      targetLongitudeDegrees: 10,
      startInstant: new Date(start).toISOString(),
      endInstant: new Date(start + 20 * 86_400_000).toISOString(),
      toleranceMilliseconds: 500
    });

    expect(result.status).toBe("crossing_found");
    if (result.status === "crossing_found") {
      expect(Math.abs(Date.parse(result.instant) - (start + 10 * 86_400_000))).toBeLessThanOrEqual(1_000);
      expect(result.provenance.datasetId).toBe("synthetic-test-only");
      expect(result.provenance.calculationTimeScale).toBe("TT");
      expect(result.provenance.earthRotationTimeScale).toBe("not_required");
      expect(result.provenance.deltaTUncertaintySeconds).toBeNull();
      expect(result.validation).toBe("provider_dependent_not_independently_validated");
    }
  });

  it("handles a crossing through 360 degrees", async () => {
    const start = Date.parse("2025-01-01T00:00:00.000Z");
    const provider = linearProvider(start, 350, 1);
    const result = await findSolarLongitudeCrossing(provider, {
      targetLongitudeDegrees: 0,
      startInstant: new Date(start).toISOString(),
      endInstant: new Date(start + 20 * 86_400_000).toISOString()
    });
    expect(result.status).toBe("crossing_found");
  });

  it("reports a target outside the supplied bracket", async () => {
    const start = Date.parse("2025-01-01T00:00:00.000Z");
    const provider = linearProvider(start, 0, 1);
    const result = await findSolarLongitudeCrossing(provider, {
      targetLongitudeDegrees: 40,
      startInstant: new Date(start).toISOString(),
      endInstant: new Date(start + 20 * 86_400_000).toISOString()
    });
    expect(result.status).toBe("not_bracketed");
  });
});
