import { describe, expect, it } from "vitest";
import { TAIPING_1861_PRIMARY_SOURCE_CANDIDATE as record } from "./taiping-1861-primary-source-candidate.js";

describe("1861 Taiping primary calendar source candidate", () => {
  it("records the contemporary NYPL item and its physical layout", () => {
    expect(record.title).toContain("辛酉拾壹年新曆");
    expect(record.publication.year).toBe(1861);
    expect(record.nypl.institution).toBe("New York Public Library");
    expect(record.nypl.imageId).toBe("1707705");
    expect(record.britishLibrary.shelfmark).toBe("15297.d.33");
    expect(record.physicalDescription.pageSizeCm).toEqual({ width: 10.5, height: 19 });
    expect(record.physicalDescription.printedLayout.linesPerPage).toBe(8);
    expect(record.physicalDescription.printedLayout.monthLabel).toBe("engraved_at_top");
    expect(record.assessment.itemLevelIdentity).toBe("catalogued_and_digitized");
  });

  it("transcribes only what is visibly present on the inspected daily-page fragment", () => {
    expect(record.imageCaptureCandidates).toHaveLength(3);
    expect(record.observedPageFragment.visibleDayEntries).toHaveLength(8);
    expect(record.observedPageFragment.visibleDayEntries[0]).toEqual({
      day: 8, dayStem: "辛", lunarMansion: "柳"
    });
    expect(record.observedPageFragment.visibleDayEntries[3]).toEqual({
      day: 11, dayStem: "甲", lunarMansion: "翼"
    });
    expect(record.observedPageFragment.earthlyBranchVisibleInTheseRows).toBe(false);
    expect(record.observedPageFragment.monthHeadingRead).toBe(false);
    expect(record.observedPageFragment.civilDateMapping).toBe("unresolved");
    expect(record.observedPageFragment.correction).toContain("not directly visible");
  });

  it("keeps the target date mapping provisional and separate from page transcription", () => {
    expect(record.targetCheck.civilDate).toBe("1861-11-11");
    expect(record.targetCheck.expectedGanzhiCandidate).toBe("乙丑");
    expect(record.targetCheck.originalDailyPageImageLocated).toBe(true);
    expect(record.targetCheck.targetMonthTenDayOneLeafIdentified).toBe(false);
    expect(record.targetCheck.originalCellTranscribed).toBe(false);
    expect(record.targetCheck.pageCollationStatus).toBe("partial_stem_and_lunar_mansion_transcription_only");
    expect(record.assessment.independentDayCycleGateCredit).toBe(false);
    expect(record.assessment.productionImpact).toBe("none");
  });
});
