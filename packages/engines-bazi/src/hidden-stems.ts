import { getHeavenlyStem, type HeavenlyStemIndex, type EarthlyBranchIndex } from "./core.js";

export type HiddenStemQiRole = "main_qi" | "middle_qi" | "residual_qi";

export interface HiddenStemEntry {
  stemIndex: HeavenlyStemIndex;
  stem: NonNullable<ReturnType<typeof getHeavenlyStem>>;
  qiRole: HiddenStemQiRole;
}

/**
 * Traditional hidden-stem order, from strongest/main qi to residual qi.
 * Branches with fewer than three traditionally assigned stems retain only
 * their attested entries; no placeholder stem is fabricated.
 */
const HIDDEN_STEM_INDEX_TABLE: readonly (readonly { stemIndex: HeavenlyStemIndex; qiRole: HiddenStemQiRole }[])[] = [
  [{ stemIndex: 9, qiRole: "main_qi" }], // 子：癸
  [{ stemIndex: 5, qiRole: "main_qi" }, { stemIndex: 9, qiRole: "middle_qi" }, { stemIndex: 7, qiRole: "residual_qi" }], // 丑：己癸辛
  [{ stemIndex: 0, qiRole: "main_qi" }, { stemIndex: 2, qiRole: "middle_qi" }, { stemIndex: 4, qiRole: "residual_qi" }], // 寅：甲丙戊
  [{ stemIndex: 1, qiRole: "main_qi" }], // 卯：乙
  [{ stemIndex: 4, qiRole: "main_qi" }, { stemIndex: 1, qiRole: "middle_qi" }, { stemIndex: 9, qiRole: "residual_qi" }], // 辰：戊乙癸
  [{ stemIndex: 2, qiRole: "main_qi" }, { stemIndex: 4, qiRole: "middle_qi" }, { stemIndex: 6, qiRole: "residual_qi" }], // 巳：丙戊庚
  [{ stemIndex: 3, qiRole: "main_qi" }, { stemIndex: 5, qiRole: "middle_qi" }], // 午：丁己
  [{ stemIndex: 5, qiRole: "main_qi" }, { stemIndex: 3, qiRole: "middle_qi" }, { stemIndex: 1, qiRole: "residual_qi" }], // 未：己丁乙
  [{ stemIndex: 6, qiRole: "main_qi" }, { stemIndex: 8, qiRole: "middle_qi" }, { stemIndex: 4, qiRole: "residual_qi" }], // 申：庚壬戊
  [{ stemIndex: 7, qiRole: "main_qi" }], // 酉：辛
  [{ stemIndex: 4, qiRole: "main_qi" }, { stemIndex: 7, qiRole: "middle_qi" }, { stemIndex: 3, qiRole: "residual_qi" }], // 戌：戊辛丁
  [{ stemIndex: 8, qiRole: "main_qi" }, { stemIndex: 0, qiRole: "middle_qi" }] // 亥：壬甲
];

/** Returns ordered hidden stems for a branch, or null for an invalid index. */
export function getHiddenStems(branchIndex: number): readonly HiddenStemEntry[] | null {
  if (!Number.isInteger(branchIndex) || branchIndex < 0 || branchIndex > 11) return null;
  return HIDDEN_STEM_INDEX_TABLE[branchIndex]!.map(({ stemIndex, qiRole }) => ({
    stemIndex,
    stem: getHeavenlyStem(stemIndex)!,
    qiRole
  }));
}
