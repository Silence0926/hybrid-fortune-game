import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

/**
 * Independent published formula cross-check.
 *
 * Y. T. Liu's Sexagenary Cycle page derives a one-based sexagenary number
 * from the 2019 calendar entry 2019-01-27 = Jiazi, JDN 2458511:
 *   S = 1 + mod(JD_noon - 11, 60)
 *
 * The page also gives 1781-03-13, JDN 2371629 = Ren-Xu as a worked example.
 * These are published computational references, not primary historical
 * records. They are kept separate from the project's 1949 anchor.
 */
export function publishedSexagenaryIndexFromJdn(julianDayNumber: number): number | null {
  if (!Number.isSafeInteger(julianDayNumber)) return null;
  return ((julianDayNumber - 11) % 60 + 60) % 60 + 1;
}

export const LIU_2019_SEXAGENARY_FORMULA_REFERENCES = [
  {
    id: "liu-2019-01-27-jiazi",
    civilDate: "2019-01-27",
    jdn: 2_458_511,
    publishedCycleIndexOneBased: 1,
    publishedGanzhi: "甲子",
    role: "formula_anchor_example"
  },
  {
    id: "liu-2019-03-13-renxu",
    civilDate: "1781-03-13",
    jdn: 2_371_629,
    publishedCycleIndexOneBased: 59,
    publishedGanzhi: "壬戌",
    role: "worked_example"
  }
] as const;

export const LIU_2019_FORMULA_CROSS_CHECK = LIU_2019_SEXAGENARY_FORMULA_REFERENCES.map((reference) => {
  const publishedIndex = publishedSexagenaryIndexFromJdn(reference.jdn);
  const projectResult = resolveSexagenaryDayFromJdn(reference.jdn, {
    anchorJdn: 2_433_191,
    anchorCycleIndex: 0
  });
  return {
    ...reference,
    publishedFormulaIndexOneBased: publishedIndex,
    projectCycleIndexOneBased: projectResult === null ? null : projectResult.cycleIndex + 1,
    projectGanzhi: projectResult === null ? null : `${projectResult.stem}${projectResult.branch}`,
    publishedFormulaMatchesReference: publishedIndex === reference.publishedCycleIndexOneBased,
    projectMatchesReference: projectResult !== null
      && projectResult.cycleIndex + 1 === reference.publishedCycleIndexOneBased
      && `${projectResult.stem}${projectResult.branch}` === reference.publishedGanzhi,
    formulaAndProjectAgree: publishedIndex !== null
      && projectResult !== null
      && publishedIndex === projectResult.cycleIndex + 1
  };
});

export const LIU_2019_FORMULA_SOURCE_STATUS = {
  sourceId: "yt-liu-sexagenary-cycle-2019",
  title: "Y. T. Liu, Sexagenary Cycle (六十干支)",
  url: "https://ytliu0.github.io/ChineseCalendar/sexagenary.html",
  firstDraft: "2018-10",
  lastMajorUpdate: "2019-07-07",
  verificationStatus: "published_formula_and_examples_reproduced",
  independentHistoricalWitness: false,
  independentAnchorLineage: "2019_calendar_page",
  notes: [
    "The page derives its formula from its own 2019 calendar entry for 2019-01-27 = Jiazi, JDN 2458511.",
    "The page supplies a separate worked example: 1781-03-13, JDN 2371629 = Ren-Xu.",
    "The formula is an independently published computational exposition, but its 2019 calendar entry is not a primary historical document.",
    "Agreement with the project's 1949 anchor validates formula consistency across two modern computational references; it does not replace historical source review or prove the anchor independently."
  ]
} as const;
