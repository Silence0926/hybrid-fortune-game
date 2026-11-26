import { describe, expect, it } from "vitest";
import { WANLI_1590_CTEXT_CROSS_CHECK as record } from "./wanli-1590-ctext-cross-check.js";
import { WANLI_1590_MONTH_START_CANDIDATES } from "./wanli-1590-month-start-cross-check.js";

describe("Wanli 18 Chinese Text Project date cross-check", () => {
  it("checks the published tenth-month first-day label against configured JDN arithmetic", () => {
    expect(record.historicalDate.lunarMonth).toBe(10);
    expect(record.historicalDate.lunarDay).toBe(1);
    expect(record.historicalDate.publishedGregorianDate).toBe("1590-10-28");
    expect(record.historicalDate.publishedGanzhi).toBe("己巳");
    expect(record.arithmetic.jdn).toBe(2_302_096);
    expect(record.arithmetic.projectCycleIndex).toBe(5);
    expect(record.arithmetic.projectGanzhi).toBe("己巳");
    expect(record.arithmetic.matchesPublishedLabel).toBe(true);
    const reconstructedMonthStart = WANLI_1590_MONTH_START_CANDIDATES.find((entry) => entry.month === 10);
    expect(reconstructedMonthStart?.civilDate).toBe(record.historicalDate.publishedGregorianDate);
    expect(reconstructedMonthStart?.ganzhi).toBe(record.historicalDate.publishedGanzhi);
  });

  it("does not promote a modern digital calendar table to primary historical evidence", () => {
    expect(record.source.derivationLineage).toBe("not_established");
    expect(record.assessment.independentHistoricalWitness).toBe(false);
    expect(record.assessment.independentDerivationVerified).toBe(false);
    expect(record.assessment.historicalDayCycleGateCredit).toBe(false);
    expect(record.assessment.originalMingDailyPageInspected).toBe(false);
    expect(record.assessment.productionImpact).toBe("none");
  });
});
