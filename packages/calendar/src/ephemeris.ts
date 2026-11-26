/**
 * Astronomical provider boundary for solar-term calculations.
 *
 * No ephemeris implementation is bundled here. A production provider must
 * document its source, model, release, coordinate frame, corrections and
 * time-scale conversion policy. Tests may inject deterministic mock providers;
 * mock output is never evidence of astronomical accuracy.
 */

/** Complete set of scales referenced by the calendar/ephemeris boundary. */
export type AstronomicalTimeScale = "UTC" | "UT1" | "TT" | "TDB";
export type AstronomicalInputTimeScale = "UTC";
export type EphemerisCalculationTimeScale = "TDB" | "TT";
export type EarthRotationTimeScale = "UT1" | "not_required";

export interface EphemerisProvenance {
  providerId: string;
  providerVersion: string;
  datasetId: string;
  datasetVersion: string;
  datasetChecksum: string | null;
  sourceCitation: string;
  license: string;
  coordinateModel: "apparent_geocentric_ecliptic_of_date";
  /** API timestamps are always ISO-8601 UTC instants. */
  inputInstantScale: AstronomicalInputTimeScale;
  /** Uniform time argument used by the ephemeris dynamics/evaluation. */
  calculationTimeScale: EphemerisCalculationTimeScale;
  /** Earth-rotation scale is separate; it is not the ephemeris dynamics time argument. */
  earthRotationTimeScale: EarthRotationTimeScale;
  /** Describes UTC-to-TT/TDB and, where needed, UT1 conversion without conflating them. */
  timeConversionPolicy: string;
  /** Model/version for classical Delta-T = TT - UT1; use an explicit not-applicable reason when unused. */
  deltaTModel: string;
  /** Model/version for converting the ephemeris time argument (TDB/TT) to Earth-rotation time (UT1/UTC). */
  dynamicalToEarthRotationModel: string;
  /** Estimated uncertainty of the historical ephemeris-to-Earth-rotation conversion, when applicable. */
  earthRotationConversionUncertaintySeconds: number | null;
  supportedFrom: string;
  supportedThrough: string;
  uncertaintySeconds: number | null;
}

export interface SolarLongitudeSample {
  /** Apparent geocentric ecliptic longitude, normalized to [0, 360). */
  longitudeDegrees: number;
  /** ISO-8601 UTC instant at which the longitude was evaluated. */
  instant: string;
  provenance: EphemerisProvenance;
}

export interface EphemerisProvider {
  readonly provenance: EphemerisProvenance;
  getApparentSolarLongitude(instant: string): Promise<SolarLongitudeSample>;
}

export type SolarLongitudeCrossingResult =
  | {
      status: "crossing_found";
      instant: string;
      targetLongitudeDegrees: number;
      lowerBound: string;
      upperBound: string;
      iterations: number;
      bracketWidthMilliseconds: number;
      provenance: EphemerisProvenance;
      validation: "provider_dependent_not_independently_validated";
    }
  | {
      status: "not_bracketed";
      targetLongitudeDegrees: number;
      startLongitudeDegrees: number;
      endLongitudeDegrees: number;
      provenance: EphemerisProvenance;
    }
  | { status: "invalid_input"; message: string };

/** Normalize any finite angle to [0, 360). */
export function normalizeDegrees(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

function forwardAngularDistance(from: number, to: number): number {
  return normalizeDegrees(to - from);
}

/**
 * Finds a forward (increasing solar longitude) crossing inside a supplied
 * time bracket. The provider must return apparent geocentric ecliptic
 * longitude consistently. Bisection assumes no reversal or multiple complete
 * revolutions inside the bracket; callers should use a bracket shorter than
 * one tropical year and inspect provider quality/provenance.
 */
export async function findSolarLongitudeCrossing(
  provider: EphemerisProvider,
  input: {
    targetLongitudeDegrees: number;
    startInstant: string;
    endInstant: string;
    toleranceMilliseconds?: number;
    maxIterations?: number;
  }
): Promise<SolarLongitudeCrossingResult> {
  const target = input.targetLongitudeDegrees;
  const startMs = Date.parse(input.startInstant);
  const endMs = Date.parse(input.endInstant);
  const tolerance = input.toleranceMilliseconds ?? 1_000;
  const maxIterations = input.maxIterations ?? 80;

  if (!Number.isFinite(target) || !Number.isFinite(startMs) || !Number.isFinite(endMs) ||
      endMs <= startMs || !Number.isFinite(tolerance) || tolerance <= 0 ||
      !Number.isInteger(maxIterations) || maxIterations < 1) {
    return { status: "invalid_input", message: "Provide a finite target angle, valid increasing ISO timestamps, positive tolerance, and positive integer iteration limit." };
  }

  const start = await provider.getApparentSolarLongitude(new Date(startMs).toISOString());
  const end = await provider.getApparentSolarLongitude(new Date(endMs).toISOString());
  const startLongitude = normalizeDegrees(start.longitudeDegrees);
  const endLongitude = normalizeDegrees(end.longitudeDegrees);
  if (!Number.isFinite(startLongitude) || !Number.isFinite(endLongitude)) {
    return { status: "invalid_input", message: "Ephemeris provider returned a non-finite longitude." };
  }

  const targetNormalized = normalizeDegrees(target);
  const totalProgress = forwardAngularDistance(startLongitude, endLongitude);
  const targetProgress = forwardAngularDistance(startLongitude, targetNormalized);
  if (totalProgress === 0 || targetProgress > totalProgress + 1e-10) {
    return {
      status: "not_bracketed",
      targetLongitudeDegrees: targetNormalized,
      startLongitudeDegrees: startLongitude,
      endLongitudeDegrees: endLongitude,
      provenance: provider.provenance
    };
  }

  let lowMs = startMs;
  let highMs = endMs;
  let lowLongitude = startLongitude;
  let iterations = 0;

  while (highMs - lowMs > tolerance && iterations < maxIterations) {
    const midMs = Math.floor((lowMs + highMs) / 2);
    const mid = await provider.getApparentSolarLongitude(new Date(midMs).toISOString());
    const midLongitude = normalizeDegrees(mid.longitudeDegrees);
    if (!Number.isFinite(midLongitude)) {
      return { status: "invalid_input", message: "Ephemeris provider returned a non-finite longitude during root search." };
    }

    const progressToMid = forwardAngularDistance(lowLongitude, midLongitude);
    const progressToTarget = forwardAngularDistance(lowLongitude, targetNormalized);
    if (progressToMid + 1e-10 >= progressToTarget) {
      highMs = midMs;
    } else {
      lowMs = midMs;
      lowLongitude = midLongitude;
    }
    iterations += 1;
  }

  const crossingMs = Math.floor((lowMs + highMs) / 2);
  return {
    status: "crossing_found",
    instant: new Date(crossingMs).toISOString(),
    targetLongitudeDegrees: targetNormalized,
    lowerBound: new Date(lowMs).toISOString(),
    upperBound: new Date(highMs).toISOString(),
    iterations,
    bracketWidthMilliseconds: highMs - lowMs,
    provenance: provider.provenance,
    validation: "provider_dependent_not_independently_validated"
  };
}
