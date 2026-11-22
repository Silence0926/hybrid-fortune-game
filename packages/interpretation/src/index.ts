export interface InterpretationSource {
  engineId: string;
  engineVersion: string;
  rulesetId: string;
  rulesetVersion: string;
  status: string;
  summary: string;
}
export interface SynthesisResult {
  status: "insufficient_verified_sources" | "ready_for_review";
  sources: InterpretationSource[];
  note: string;
}

/** Synthesis never upgrades an unverified engine result to a verified claim. */
export function synthesize(sources: InterpretationSource[]): SynthesisResult {
  const verified = sources.filter((source) => source.status === "complete");
  return {
    status: verified.length > 0 ? "ready_for_review" : "insufficient_verified_sources",
    sources,
    note: "Interpretations must preserve source attribution and cultural context."
  };
}
