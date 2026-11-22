/** Foundational Gan-Zhi tables and derivation formulas.
 *
 * Indices are zero-based:
 * Heavenly Stems: 甲乙丙丁戊己庚辛壬癸 (0..9)
 * Earthly Branches: 子丑寅卯辰巳午未申酉戌亥 (0..11)
 *
 * This module only derives stems from already-resolved indices. It does not
 * determine a year stem, month branch, day stem, or hour branch from a date/time.
 */
export const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export type HeavenlyStemIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type EarthlyBranchIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type StemBranch = { stemIndex: HeavenlyStemIndex; branchIndex: EarthlyBranchIndex; stem: typeof HEAVENLY_STEMS[number]; branch: typeof EARTHLY_BRANCHES[number] };

export function getHeavenlyStem(index: number): typeof HEAVENLY_STEMS[number] | null {
  return Number.isInteger(index) && index >= 0 && index < 10 ? HEAVENLY_STEMS[index as HeavenlyStemIndex]! : null;
}

export function getEarthlyBranch(index: number): typeof EARTHLY_BRANCHES[number] | null {
  return Number.isInteger(index) && index >= 0 && index < 12 ? EARTHLY_BRANCHES[index as EarthlyBranchIndex]! : null;
}

/** Month branch indices: 寅=2 through 丑=1 in calendar order. */
export function getMonthBranchIndex(monthNumber: number): EarthlyBranchIndex | null {
  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) return null;
  return ((monthNumber + 1) % 12) as EarthlyBranchIndex;
}

/** Five Tigers formula (五虎遁): derive 寅月's stem from the year stem. */
export function deriveMonthStemIndex(yearStemIndex: number, monthBranchIndex: number): HeavenlyStemIndex | null {
  if (!Number.isInteger(yearStemIndex) || yearStemIndex < 0 || yearStemIndex > 9) return null;
  if (!Number.isInteger(monthBranchIndex) || monthBranchIndex < 0 || monthBranchIndex > 11) return null;
  const yinMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10;
  const monthsAfterYin = (monthBranchIndex - 2 + 12) % 12;
  return ((yinMonthStem + monthsAfterYin) % 10) as HeavenlyStemIndex;
}

/** Five Rats formula (五鼠遁): derive 子时's stem from the day stem. */
export function deriveHourStemIndex(dayStemIndex: number, hourBranchIndex: number): HeavenlyStemIndex | null {
  if (!Number.isInteger(dayStemIndex) || dayStemIndex < 0 || dayStemIndex > 9) return null;
  if (!Number.isInteger(hourBranchIndex) || hourBranchIndex < 0 || hourBranchIndex > 11) return null;
  const ziHourStem = ((dayStemIndex % 5) * 2) % 10;
  return ((ziHourStem + hourBranchIndex) % 10) as HeavenlyStemIndex;
}

/** Validate a sexagenary pillar's stem/branch parity without assigning a cycle day. */
export function isValidStemBranchPair(stemIndex: number, branchIndex: number): boolean {
  return Number.isInteger(stemIndex) && stemIndex >= 0 && stemIndex <= 9 &&
    Number.isInteger(branchIndex) && branchIndex >= 0 && branchIndex <= 11 &&
    stemIndex % 2 === branchIndex % 2;
}
