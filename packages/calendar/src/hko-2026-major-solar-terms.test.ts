import { describe, expect, it } from "vitest";
import { HKO_2026_MAJOR_SOLAR_TERM_FIXTURES, HKO_2026_MAJOR_SOLAR_TERM_SOURCE } from "./hko-2026-major-solar-terms.js";

describe("HKO 2026 major solar-term comparison fixtures", () => {
  it("contains the twelve published major terms in increasing solar longitude", () => {
    expect(HKO_2026_MAJOR_SOLAR_TERM_FIXTURES).toHaveLength(12);
    expect(HKO_2026_MAJOR_SOLAR_TERM_FIXTURES.map((fixture) => fixture.solarLongitudeDegrees))
      .toEqual([300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270]);
    expect(HKO_2026_MAJOR_SOLAR_TERM_FIXTURES.every((fixture) => fixture.termClass === "zhongqi_major")).toBe(true);
  });

  it("converts every published Hong Kong timestamp to the recorded UTC instant", () => {
    for (const fixture of HKO_2026_MAJOR_SOLAR_TERM_FIXTURES) {
      expect(new Date(fixture.hongKongTime).toISOString()).toBe(fixture.utcInstant);
      expect(fixture.publishedPrecision).toBe("minute");
    }
  });

  it("retains source and timezone provenance and does not claim Jie coverage", () => {
    expect(HKO_2026_MAJOR_SOLAR_TERM_SOURCE.timeZone).toBe("Asia/Hong_Kong");
    expect(HKO_2026_MAJOR_SOLAR_TERM_SOURCE.utcOffset).toBe("+08:00");
    expect(HKO_2026_MAJOR_SOLAR_TERM_SOURCE.url).toContain("hko.gov.hk");
    expect(HKO_2026_MAJOR_SOLAR_TERM_FIXTURES.every((fixture) => fixture.termClass !== ("jie" as never))).toBe(true);
  });
});
