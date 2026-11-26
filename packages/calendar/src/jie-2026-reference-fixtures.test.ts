import { describe, expect, it } from "vitest";
import { JIE_2026_REFERENCE_FIXTURES, JIE_2026_REFERENCE_SOURCE_NOTES } from "./jie-2026-reference-fixtures.js";
import { validateJieTermReferenceFixtures } from "./jie-term-fixtures.js";

describe("2026 institutional Jie reference candidates", () => {
  it("covers all twelve Jie with two institutional records per term", () => {
    expect(JIE_2026_REFERENCE_FIXTURES).toHaveLength(24);
    const result = validateJieTermReferenceFixtures([...JIE_2026_REFERENCE_FIXTURES]);
    expect(result.status).toBe("candidate_supported");
    if (result.status === "candidate_supported") {
      expect(result.year).toBe(2026);
      expect(result.termCount).toBe(12);
      expect(Object.values(result.sourceCountByTerm)).toEqual(Array(12).fill(2));
    }
  });

  it("normalizes Taipei and Japan publication times to identical UTC instants", () => {
    for (let index = 0; index < 12; index += 1) {
      const taipei = JIE_2026_REFERENCE_FIXTURES[index * 2]!;
      const japan = JIE_2026_REFERENCE_FIXTURES[index * 2 + 1]!;
      expect(taipei.termZh).toBe(japan.termZh);
      expect(taipei.solarLongitudeDegrees).toBe(japan.solarLongitudeDegrees);
      expect(Date.parse(taipei.publishedLocalDateTime)).toBe(Date.parse(japan.publishedLocalDateTime));
      expect(taipei.utcInstant).toBe(japan.utcInstant);
      expect(taipei.timeZone).toBe("Etc/GMT-8");
      expect(taipei.publishedTimeBasis).toBe("mean_solar_time");
      expect(japan.timeZone).toBe("Asia/Tokyo");
      expect(japan.publishedTimeBasis).toBe("standard_time");
      expect(taipei.publishedPrecision).toBe("minute");
      expect(japan.publishedPrecision).toBe("minute");
    }
  });

  it("retains source clock conventions and review limitations", () => {
    expect(JIE_2026_REFERENCE_SOURCE_NOTES.taipei.timeBasis).toContain("東經120度平均太陽時");
    expect(JIE_2026_REFERENCE_SOURCE_NOTES.naoj.timeBasis).toContain("UT+9");
    expect(JIE_2026_REFERENCE_SOURCE_NOTES.naoj.deltaTSecondsReported).toBe(69);
    expect(JIE_2026_REFERENCE_SOURCE_NOTES.reviewStatus)
      .toBe("candidate_only_pending_source_independence_and_ephemeris_convention_review");
  });
});
