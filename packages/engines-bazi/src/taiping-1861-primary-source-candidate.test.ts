import { describe, expect, it } from "vitest";
import { TAIPING_1861_PRIMARY_SOURCE_CANDIDATE as record } from "./taiping-1861-primary-source-candidate.js";

describe("1861 Taiping primary calendar source candidate", () => {
  it("records a contemporary digitized calendar item without claiming daily-page collation", () => {
    expect(record.title).toContain("辛酉拾壹年新曆");
    expect(record.publication.year).toBe(1861);
    expect(record.nypl.institution).toBe("New York Public Library");
    expect(record.nypl.imageId).toBe("1707705");
    expect(record.britishLibrary.shelfmark).toBe("15297.d.33");
    expect(record.assessment.sourceClass).toBe("contemporary_primary_calendar_candidate");
    expect(record.assessment.itemLevelIdentity).toBe("catalogued_and_digitized");
    expect(record.assessment.dailyContentVerification).toBe("pending_original_leaf_collation");
    expect(record.observedPageFragment.visibleDayEntries).toHaveLength(8);
    expect(record.observedPageFragment.visibleDayEntries[0]).toEqual({ day: 8, ganzhi: "辛丑" });
    expect(record.observedPageFragment.visibleDayEntries[3]).toEqual({ day: 11, ganzhi: "甲辰" });
    expect(record.observedPageFragment.monthHeadingRead).toBe(false);
    expect(record.observedPageFragment.civilDateMapping).toBe("unresolved");
  });

  it("does not promote the expected day label into verified evidence", () => {
    expect(record.targetCheck.civilDate).toBe("1861-11-11");
    expect(record.targetCheck.expectedGanzhiCandidate).toBe("乙丑");
    expect(record.targetCheck.originalLeafIdentified).toBe(true);
    expect(record.dateMappingResearch.proposedTaipingNewYear).toBe("1861-02-09");
    expect(record.dateMappingResearch.targetTaipingDate).toBe("month 10, day 1");
    expect(record.dateMappingResearch.conventionalGregorianGanzhi).toBe("甲子");
    expect(record.targetCheck.originalCellTranscribed).toBe(false);
    expect(record.targetCheck.pageCollationStatus).toBe("partial_visual_transcription_month_mapping_pending");
    expect(record.assessment.independentDayCycleGateCredit).toBe(false);
    expect(record.assessment.productionImpact).toBe("none");
  });
});
