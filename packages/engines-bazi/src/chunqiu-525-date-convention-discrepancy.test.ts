import { describe, expect, it } from "vitest";
import { CHUNQIU_525_DATE_CONVENTION_DISCREPANCY as discrepancy } from "./chunqiu-525-date-convention-discrepancy.js";

describe("Chunqiu 525 BCE date convention discrepancy", () => {
  it("preserves the chronicle date and computed eclipse date as separate facts", () => {
    expect(discrepancy.chronicleRecord.stephensonYauTable3Date).toBe("525 BCE-08-22");
    expect(discrepancy.astronomicalEventReconstructions.map((item) => item.date))
      .toEqual(["525 BCE-08-21", "525 BCE-08-21", "525 BCE-08-21"]);
    expect(discrepancy.chronicleRecord.reportedGanzhi).toBe("甲戌");
  });

  it("exposes the one-day arithmetic distinction without rewriting the source", () => {
    expect(discrepancy.projectModernAnchorArithmetic.august21.cycleIndexOneBased).toBe(10);
    expect(discrepancy.projectModernAnchorArithmetic.august21.ganzhi).toBe("癸酉");
    expect(discrepancy.projectModernAnchorArithmetic.august22.cycleIndexOneBased).toBe(11);
    expect(discrepancy.projectModernAnchorArithmetic.august22.ganzhi).toBe("甲戌");
  });

  it("does not award historical-anchor release-gate credit", () => {
    expect(discrepancy.assessment.status).toBe("unresolved_historical_date_convention_discrepancy");
    expect(discrepancy.assessment.independentAstronomicalReconstructions).toBe(true);
    expect(discrepancy.assessment.independentPrimaryWitness).toBe(false);
    expect(discrepancy.assessment.dayCycleAnchorGateCredit).toBe(false);
    expect(discrepancy.assessment.productionImpact).toBe("none");
  });
});
