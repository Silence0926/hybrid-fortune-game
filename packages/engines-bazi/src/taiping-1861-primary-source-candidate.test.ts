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
  });

  it("does not promote the expected day label into verified evidence", () => {
    expect(record.targetCheck.civilDate).toBe("1861-11-11");
    expect(record.targetCheck.expectedGanzhiCandidate).toBe("甲子");
    expect(record.targetCheck.originalLeafIdentified).toBe(false);
    expect(record.targetCheck.originalCellTranscribed).toBe(false);
    expect(record.targetCheck.pageCollationStatus).toBe("not_started");
    expect(record.assessment.independentDayCycleGateCredit).toBe(false);
    expect(record.assessment.productionImpact).toBe("none");
  });
});
