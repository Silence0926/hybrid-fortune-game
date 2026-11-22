import { describe, expect, it } from "vitest";
import { getBaziMonthBoundaryTerms, getSolarTermByLongitude, SOLAR_TERMS_24 } from "./solar-terms.js";

describe("24 solar-term taxonomy", () => {
  it("defines 24 terms at 15-degree intervals", () => {
    expect(SOLAR_TERMS_24).toHaveLength(24);
    expect(SOLAR_TERMS_24.map((term) => term.longitudeDegrees))
      .toEqual(Array.from({ length: 24 }, (_, index) => index * 15));
  });

  it("identifies twelve Jie terms as BaZi month boundaries", () => {
    const jie = getBaziMonthBoundaryTerms();
    expect(jie).toHaveLength(12);
    expect(jie.every((term) => term.class === "jie" && term.isBaziMonthBoundary)).toBe(true);
    expect(jie.map((term) => term.longitudeDegrees)).toEqual([15,45,75,105,135,165,195,225,255,285,315,345]);
    expect(jie.find((term) => term.nameZh === "立春")?.longitudeDegrees).toBe(315);
  });

  it("normalizes wrapped longitudes and rejects non-finite input", () => {
    expect(getSolarTermByLongitude(675)?.nameZh).toBe("立春");
    expect(getSolarTermByLongitude(-45)?.nameZh).toBe("立春");
    expect(getSolarTermByLongitude(Number.NaN)).toBeNull();
  });
});
