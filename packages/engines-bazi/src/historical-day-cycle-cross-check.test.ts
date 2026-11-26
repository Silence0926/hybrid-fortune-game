import { describe, expect, it } from "vitest";
import { astronomicalYearFromBceYear, julianAstronomicalDateToJdn } from "./julian-jdn.js";
import { CHUNQIU_720_BCE_DAY_CYCLE_CROSS_CHECK } from "./historical-day-cycle-cross-check.js";

describe("proleptic Julian JDN with astronomical year numbering", () => {
  it("converts the Chunqiu eclipse date to the published JDN", () => {
    expect(astronomicalYearFromBceYear(720)).toBe(-719);
    expect(julianAstronomicalDateToJdn(-719, 2, 22)).toBe(1_458_496);
  });

  it("rejects invalid BCE year and Julian civil dates", () => {
    expect(astronomicalYearFromBceYear(0)).toBeNull();
    expect(astronomicalYearFromBceYear(720.5)).toBeNull();
    expect(julianAstronomicalDateToJdn(-719, 2, 30)).toBeNull();
    expect(julianAstronomicalDateToJdn(-719, 13, 1)).toBeNull();
    expect(julianAstronomicalDateToJdn(-719, 2, 22.5)).toBeNull();
  });
});

describe("Chunqiu historical sexagenary-day cross-check", () => {
  it("matches the primary 己巳 record through the modern 1949 Jiazi anchor", () => {
    const evidence = CHUNQIU_720_BCE_DAY_CYCLE_CROSS_CHECK;
    expect(evidence.dateReconstruction.astronomicalYear).toBe(-719);
    expect(evidence.dateReconstruction.jdn).toBe(1_458_496);
    expect(evidence.historicalReference.cycleIndexZeroBased).toBe(5);
    expect(evidence.computedFromModernAnchor.cycleIndex).toBe(5);
    expect(evidence.computedFromModernAnchor.ganzhi).toBe("己巳");
    expect(evidence.arithmeticStatus).toBe("matches_historical_record");
    expect(evidence.reviewStatus).toBe("candidate_only_pending_domain_review");
    expect(evidence.sources).toHaveLength(3);
  });

  it("keeps the primary text and astronomical date reconstruction distinct", () => {
    const sources = CHUNQIU_720_BCE_DAY_CYCLE_CROSS_CHECK.sources;
    expect(sources[0]?.sourceRole).toBe("primary_historical_text");
    expect(sources[0]?.evidence).toContain("does not itself state the Julian-calendar date");
    expect(sources[1]?.sourceRole).toBe("peer_reviewed_historical_astronomy");
    expect(sources[2]?.sourceRole).toBe("peer_reviewed_eclipse_reconstruction");
  });
});
