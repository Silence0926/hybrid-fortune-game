import type { BirthInput, EngineResult } from "@hybrid-fortune/domain";

export interface BaziChart {
  pillars: null;
  note: "Chart calculation is blocked until calendar data and boundary rules are validated.";
}

export interface BaziRuleset {
  id: string;
  version: string;
  school: string;
  yearBoundary: "lichun" | "lunar_new_year" | "unconfirmed";
  monthBoundary: "solar_terms" | "other" | "unconfirmed";
  dayBoundary: "midnight" | "zi_hour" | "unconfirmed";
  status: "draft" | "reviewed" | "validated";
}

/** Safe bootstrap behavior: no fabricated pillars before validation. */
export function calculateBazi(_input: BirthInput): EngineResult<BaziChart> {
  return {
    engineId: "bazi",
    engineVersion: "0.1.0",
    rulesetId: "bazi-pending-convention",
    rulesetVersion: "0.0.0",
    status: "not_implemented",
    inputDigest: "not-computed",
    warnings: [
      "BaZi school and boundary conventions have not been approved.",
      "A validated solar-term/calendar provider is not configured."
    ],
    provenance: [],
    calculatedAt: new Date().toISOString()
  };
}
