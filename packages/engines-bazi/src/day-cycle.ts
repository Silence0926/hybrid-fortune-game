import { getEarthlyBranch, getHeavenlyStem, isValidStemBranchPair } from "./core.js";

export interface SexagenaryCycleAnchor {
  /** Gregorian civil date's integer JDN, using the project's documented JDN convention. */
  anchorJdn: number;
  /** Sexagenary cycle index assigned to anchorJdn: 0 = 甲子, ... 59 = 癸亥. */
  anchorCycleIndex: number;
}

export interface SexagenaryDay {
  julianDayNumber: number;
  cycleIndex: number;
  stemIndex: number;
  branchIndex: number;
  stem: NonNullable<ReturnType<typeof getHeavenlyStem>>;
  branch: NonNullable<ReturnType<typeof getEarthlyBranch>>;
}

/**
 * Maps an already-resolved integer JDN to a sexagenary day using an explicit,
 * externally verified anchor. No default epoch/offset is assumed.
 */
export function resolveSexagenaryDayFromJdn(
  julianDayNumber: number,
  anchor: SexagenaryCycleAnchor
): SexagenaryDay | null {
  if (!Number.isSafeInteger(julianDayNumber) || !Number.isSafeInteger(anchor.anchorJdn)) return null;
  if (!Number.isInteger(anchor.anchorCycleIndex) || anchor.anchorCycleIndex < 0 || anchor.anchorCycleIndex > 59) return null;

  const offset = julianDayNumber - anchor.anchorJdn;
  const cycleIndex = ((anchor.anchorCycleIndex + offset) % 60 + 60) % 60;
  const stemIndex = cycleIndex % 10;
  const branchIndex = cycleIndex % 12;
  const stem = getHeavenlyStem(stemIndex);
  const branch = getEarthlyBranch(branchIndex);

  if (stem === null || branch === null || !isValidStemBranchPair(stemIndex, branchIndex)) return null;
  return { julianDayNumber, cycleIndex, stemIndex, branchIndex, stem, branch };
}
