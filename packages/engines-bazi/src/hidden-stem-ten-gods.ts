import { getHiddenStems } from "./hidden-stems.js";
import { deriveTenGod, type TenGod } from "./ten-gods.js";
import type { HiddenStemEntry } from "./hidden-stems.js";

export interface HiddenStemTenGodEntry extends HiddenStemEntry {
  tenGod: TenGod;
}

/** Assigns Ten Gods to a branch's ordered hidden stems relative to a Day Master. */
export function deriveHiddenStemTenGods(
  dayMasterStemIndex: number,
  branchIndex: number
): HiddenStemTenGodEntry[] | null {
  if (!Number.isInteger(dayMasterStemIndex) || dayMasterStemIndex < 0 || dayMasterStemIndex > 9) return null;
  const hiddenStems = getHiddenStems(branchIndex);
  if (hiddenStems === null) return null;

  return hiddenStems.map(entry => ({
    ...entry,
    tenGod: deriveTenGod(dayMasterStemIndex, entry.stemIndex)!
  }));
}
