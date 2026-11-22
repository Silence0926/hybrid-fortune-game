export interface ScoreFactor {
  id: string;
  sourceSystem: "bazi" | "ziwei" | "almanac" | "western_astrology";
  value: number;
  weight: number;
  explanation: string;
}
export interface DailyReflectionScore {
  value: number | null;
  status: "unconfigured" | "available";
  modelVersion: string;
  includedFactors: string[];
  excludedFactors: string[];
  disclaimer: string;
}

/** No weights are approved in V1.0. I Ching is not accepted as an input. */
export function calculateDailyReflectionScore(
  factors: ScoreFactor[],
  model: { version: string; approved: boolean; minWeight: number; maxWeight: number }
): DailyReflectionScore {
  if (!model.approved || factors.length === 0) {
    return {
      value: null, status: "unconfigured", modelVersion: model.version,
      includedFactors: [], excludedFactors: factors.map((factor) => factor.id),
      disclaimer: "Cultural reflection aid only; not a scientific prediction."
    };
  }
  const allowedSources = new Set(["bazi", "ziwei", "almanac", "western_astrology"]);
  const valid = factors.filter((factor) =>
    allowedSources.has(factor.sourceSystem) && Number.isFinite(factor.value) && Number.isFinite(factor.weight) &&
    factor.weight >= model.minWeight && factor.weight <= model.maxWeight
  );
  const totalWeight = valid.reduce((sum, factor) => sum + factor.weight, 0);
  if (valid.length === 0 || totalWeight <= 0) {
    return {
      value: null, status: "unconfigured", modelVersion: model.version,
      includedFactors: [], excludedFactors: factors.map((factor) => factor.id),
      disclaimer: "Cultural reflection aid only; not a scientific prediction."
    };
  }
  const weighted = valid.reduce((sum, factor) => sum + factor.value * factor.weight, 0) / totalWeight;
  return {
    value: Math.round(weighted * 10) / 10, status: "available",
    modelVersion: model.version, includedFactors: valid.map((factor) => factor.id),
    excludedFactors: factors.filter((factor) => !valid.includes(factor)).map((factor) => factor.id),
    disclaimer: "Cultural reflection aid only; not a scientific prediction."
  };
}
