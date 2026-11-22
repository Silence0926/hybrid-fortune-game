import { EARTHLY_BRANCHES, type EarthlyBranchIndex } from "./core.js";

export type BranchRelationKind =
  | "six_harmony"
  | "three_harmony"
  | "half_harmony"
  | "three_meeting"
  | "six_clash"
  | "punishment"
  | "harm"
  | "break";

export interface BranchRelationMatch {
  kind: BranchRelationKind;
  /** Branch indices in the same order as their matching input positions. */
  branchIndices: EarthlyBranchIndex[];
  /** Zero-based positions in the caller's input array. */
  positions: number[];
  /** Traditional group/pair label, e.g. 寅午戌火局 or 子午冲. */
  label: string;
  /** Present for a half-harmony to identify the two positions in its trine. */
  phase?: "birth_middle" | "middle_grave" | "birth_grave";
}

type PairRule = {
  kind: "six_harmony" | "six_clash" | "punishment" | "harm" | "break";
  pair: readonly [EarthlyBranchIndex, EarthlyBranchIndex];
  label: string;
};

const PAIR_RULES: readonly PairRule[] = [
  { kind: "six_harmony", pair: [0, 1], label: "子丑合" },
  { kind: "six_harmony", pair: [2, 11], label: "寅亥合" },
  { kind: "six_harmony", pair: [3, 10], label: "卯戌合" },
  { kind: "six_harmony", pair: [4, 9], label: "辰酉合" },
  { kind: "six_harmony", pair: [5, 8], label: "巳申合" },
  { kind: "six_harmony", pair: [6, 7], label: "午未合" },

  { kind: "six_clash", pair: [0, 6], label: "子午冲" },
  { kind: "six_clash", pair: [1, 7], label: "丑未冲" },
  { kind: "six_clash", pair: [2, 8], label: "寅申冲" },
  { kind: "six_clash", pair: [3, 9], label: "卯酉冲" },
  { kind: "six_clash", pair: [4, 10], label: "辰戌冲" },
  { kind: "six_clash", pair: [5, 11], label: "巳亥冲" },

  { kind: "punishment", pair: [0, 3], label: "子卯刑" },
  { kind: "punishment", pair: [2, 5], label: "寅巳刑" },
  { kind: "punishment", pair: [2, 8], label: "寅申刑" },
  { kind: "punishment", pair: [5, 8], label: "巳申刑" },
  { kind: "punishment", pair: [1, 10], label: "丑戌刑" },
  { kind: "punishment", pair: [1, 7], label: "丑未刑" },
  { kind: "punishment", pair: [7, 10], label: "未戌刑" },

  { kind: "harm", pair: [0, 7], label: "子未害" },
  { kind: "harm", pair: [1, 6], label: "丑午害" },
  { kind: "harm", pair: [2, 5], label: "寅巳害" },
  { kind: "harm", pair: [3, 4], label: "卯辰害" },
  { kind: "harm", pair: [8, 11], label: "申亥害" },
  { kind: "harm", pair: [9, 10], label: "酉戌害" },

  { kind: "break", pair: [0, 9], label: "子酉破" },
  { kind: "break", pair: [1, 4], label: "丑辰破" },
  { kind: "break", pair: [2, 11], label: "寅亥破" },
  { kind: "break", pair: [3, 6], label: "卯午破" },
  { kind: "break", pair: [5, 8], label: "巳申破" },
  { kind: "break", pair: [7, 10], label: "未戌破" }
];

type GroupRule = {
  kind: "three_harmony" | "three_meeting" | "punishment";
  branches: readonly [EarthlyBranchIndex, EarthlyBranchIndex, EarthlyBranchIndex];
  label: string;
};

const GROUP_RULES: readonly GroupRule[] = [
  { kind: "three_harmony", branches: [8, 0, 4], label: "申子辰水局" },
  { kind: "three_harmony", branches: [11, 3, 7], label: "亥卯未木局" },
  { kind: "three_harmony", branches: [2, 6, 10], label: "寅午戌火局" },
  { kind: "three_harmony", branches: [5, 9, 1], label: "巳酉丑金局" },

  { kind: "three_meeting", branches: [2, 3, 4], label: "寅卯辰东方木会" },
  { kind: "three_meeting", branches: [5, 6, 7], label: "巳午未南方火会" },
  { kind: "three_meeting", branches: [8, 9, 10], label: "申酉戌西方金会" },
  { kind: "three_meeting", branches: [11, 0, 1], label: "亥子丑北方水会" },

  { kind: "punishment", branches: [2, 5, 8], label: "寅巳申三刑" },
  { kind: "punishment", branches: [1, 7, 10], label: "丑戌未三刑" }
];

const HALF_HARMONY_RULES: readonly {
  branches: readonly [EarthlyBranchIndex, EarthlyBranchIndex];
  label: string;
  phase: "birth_middle" | "middle_grave" | "birth_grave";
}[] = [
  { branches: [8, 0], label: "申子半合水", phase: "birth_middle" },
  { branches: [0, 4], label: "子辰半合水", phase: "middle_grave" },
  { branches: [8, 4], label: "申辰拱水", phase: "birth_grave" },
  { branches: [11, 3], label: "亥卯半合木", phase: "birth_middle" },
  { branches: [3, 7], label: "卯未半合木", phase: "middle_grave" },
  { branches: [11, 7], label: "亥未拱木", phase: "birth_grave" },
  { branches: [2, 6], label: "寅午半合火", phase: "birth_middle" },
  { branches: [6, 10], label: "午戌半合火", phase: "middle_grave" },
  { branches: [2, 10], label: "寅戌拱火", phase: "birth_grave" },
  { branches: [5, 9], label: "巳酉半合金", phase: "birth_middle" },
  { branches: [9, 1], label: "酉丑半合金", phase: "middle_grave" },
  { branches: [5, 1], label: "巳丑拱金", phase: "birth_grave" }
];

const SELF_PUNISHMENT_BRANCHES: readonly EarthlyBranchIndex[] = [4, 6, 9, 11];

function validBranch(value: number): value is EarthlyBranchIndex {
  return Number.isInteger(value) && value >= 0 && value < 12;
}

/**
 * Detects structural branch relationships only.
 * It deliberately does not judge transformation, seasonal strength, or auspiciousness.
 * Repeated input branches are treated as distinct chart positions.
 */
export function detectBranchRelations(branchIndices: readonly number[]): BranchRelationMatch[] {
  if (!branchIndices.every(validBranch)) return [];

  const matches: BranchRelationMatch[] = [];
  const addPair = (
    kind: BranchRelationKind,
    i: number,
    j: number,
    label: string,
    phase?: "birth_middle" | "middle_grave" | "birth_grave"
  ) => {
    const match: BranchRelationMatch = {
      kind,
      branchIndices: [branchIndices[i] as EarthlyBranchIndex, branchIndices[j] as EarthlyBranchIndex],
      positions: [i, j],
      label
    };
    if (phase) match.phase = phase;
    matches.push(match);
  };

  for (let i = 0; i < branchIndices.length; i++) {
    for (let j = i + 1; j < branchIndices.length; j++) {
      const a = branchIndices[i] as EarthlyBranchIndex;
      const b = branchIndices[j] as EarthlyBranchIndex;
      for (const rule of PAIR_RULES) {
        if ((a === rule.pair[0] && b === rule.pair[1]) || (a === rule.pair[1] && b === rule.pair[0])) {
          addPair(rule.kind, i, j, rule.label);
        }
      }
      for (const rule of HALF_HARMONY_RULES) {
        if ((a === rule.branches[0] && b === rule.branches[1]) || (a === rule.branches[1] && b === rule.branches[0])) {
          addPair("half_harmony", i, j, rule.label, rule.phase);
        }
      }
      if (a === b && SELF_PUNISHMENT_BRANCHES.includes(a)) {
        addPair("punishment", i, j, `${EARTHLY_BRANCHES[a]}${EARTHLY_BRANCHES[a]}自刑`);
      }
    }
  }

  for (const rule of GROUP_RULES) {
    const positionGroups = rule.branches.map(branch =>
      branchIndices.flatMap((value, position) => value === branch ? [position] : [])
    );
    if (positionGroups.every(group => group.length > 0)) {
      for (const first of positionGroups[0]!) {
        for (const second of positionGroups[1]!) {
          for (const third of positionGroups[2]!) {
            matches.push({
              kind: rule.kind,
              branchIndices: [
                branchIndices[first] as EarthlyBranchIndex,
                branchIndices[second] as EarthlyBranchIndex,
                branchIndices[third] as EarthlyBranchIndex
              ],
              positions: [first, second, third],
              label: rule.label
            });
          }
        }
      }
    }
  }

  return matches;
}
