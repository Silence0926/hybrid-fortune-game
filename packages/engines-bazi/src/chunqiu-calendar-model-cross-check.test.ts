import { describe, expect, it } from "vitest";
import {
  CHUNQIU_CALENDAR_MODEL_CROSS_CHECKS,
  CHUNQIU_CALENDAR_MODEL_CROSS_CHECK_STATUS
} from "./chunqiu-calendar-model-cross-check.js";

describe("alternative Chunqiu calendar reconstruction cross-check", () => {
  it("matches the selected published New Year date/cycle pairs against the modern anchor", () => {
    expect(CHUNQIU_CALENDAR_MODEL_CROSS_CHECKS).toHaveLength(7);
    expect(CHUNQIU_CALENDAR_MODEL_CROSS_CHECKS.every((row) => row.jdn !== null)).toBe(true);
    expect(CHUNQIU_CALENDAR_MODEL_CROSS_CHECKS.every((row) => row.matchesModernAnchorArithmetic)).toBe(true);
  });

  it("preserves the source's corrected N_-720 reading as Yi-Hai", () => {
    const row = CHUNQIU_CALENDAR_MODEL_CROSS_CHECKS.find((item) => item.calendarYear === "N_-720");
    expect(row?.publishedGanzhi).toBe("乙亥");
    expect(row?.computedGanzhi).toBe("乙亥");
    expect(row?.yearBce).toBe(721);
    expect(row?.astronomicalYear).toBe(-720);
  });

  it("does not count the alternative reconstruction as an independent primary witness", () => {
    expect(CHUNQIU_CALENDAR_MODEL_CROSS_CHECK_STATUS.independentPrimaryWitness).toBe(false);
    expect(CHUNQIU_CALENDAR_MODEL_CROSS_CHECK_STATUS.independentSourceGateCredit).toBe(false);
    expect(CHUNQIU_CALENDAR_MODEL_CROSS_CHECK_STATUS.status)
      .toBe("alternative_model_matches_selected_dates_pending_source_lineage_review");
  });
});
