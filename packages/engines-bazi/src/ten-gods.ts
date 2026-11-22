import { getHeavenlyStem } from "./core.js";

export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";
export type TenGod =
  | "比肩" | "劫财"
  | "食神" | "伤官"
  | "偏财" | "正财"
  | "七杀" | "正官"
  | "偏印" | "正印";

const STEM_ELEMENTS: readonly FiveElement[] = [
  "wood", "wood", "fire", "fire", "earth",
  "earth", "metal", "metal", "water", "water"
];

function polarity(index: number): "yang" | "yin" {
  return index % 2 === 0 ? "yang" : "yin";
}

/** Returns the Ten-God relation of a target stem relative to the Day Master. */
export function deriveTenGod(dayMasterStemIndex: number, targetStemIndex: number): TenGod | null {
  if (!Number.isInteger(dayMasterStemIndex) || dayMasterStemIndex < 0 || dayMasterStemIndex > 9 ||
      !Number.isInteger(targetStemIndex) || targetStemIndex < 0 || targetStemIndex > 9) return null;

  const dmElement = STEM_ELEMENTS[dayMasterStemIndex]!;
  const targetElement = STEM_ELEMENTS[targetStemIndex]!;
  const samePolarity = polarity(dayMasterStemIndex) === polarity(targetStemIndex);

  if (dmElement === targetElement) return samePolarity ? "比肩" : "劫财";
  if (generates(dmElement) === targetElement) return samePolarity ? "食神" : "伤官";
  if (controls(dmElement) === targetElement) return samePolarity ? "偏财" : "正财";
  if (controls(targetElement) === dmElement) return samePolarity ? "七杀" : "正官";
  if (generates(targetElement) === dmElement) return samePolarity ? "偏印" : "正印";
  return null;
}

export function deriveTenGodByStem(
  dayMasterStemIndex: number,
  targetStemIndex: number
): { dayMaster: NonNullable<ReturnType<typeof getHeavenlyStem>>; target: NonNullable<ReturnType<typeof getHeavenlyStem>>; tenGod: TenGod } | null {
  const tenGod = deriveTenGod(dayMasterStemIndex, targetStemIndex);
  if (tenGod === null) return null;

  const dayMaster = getHeavenlyStem(dayMasterStemIndex);
  const target = getHeavenlyStem(targetStemIndex);
  if (dayMaster === null || target === null) return null;

  return { dayMaster, target, tenGod };
}

function generates(element: FiveElement): FiveElement {
  const next: Record<FiveElement, FiveElement> = {
    wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood"
  };
  return next[element];
}

function controls(element: FiveElement): FiveElement {
  const next: Record<FiveElement, FiveElement> = {
    wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood"
  };
  return next[element];
}
