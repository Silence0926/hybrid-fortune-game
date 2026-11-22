import { describe, expect, it } from "vitest";
import { resolveSexagenaryDayFromJdn } from "./day-cycle.js";

describe("JDN to sexagenary day mapping", () => {
  const anchor = { anchorJdn: 2_451_551, anchorCycleIndex: 0 };

  it("maps the configured anchor to its configured cycle index", () => {
    expect(resolveSexagenaryDayFromJdn(anchor.anchorJdn, anchor)).toEqual({
      julianDayNumber: 2_451_551,
      cycleIndex: 0,
      stemIndex: 0,
      branchIndex: 0,
      stem: "甲",
      branch: "子"
    });
  });

  it("advances and wraps through the 60-day cycle", () => {
    expect(resolveSexagenaryDayFromJdn(anchor.anchorJdn + 1, anchor)?.cycleIndex).toBe(1);
    expect(resolveSexagenaryDayFromJdn(anchor.anchorJdn + 60, anchor)?.cycleIndex).toBe(0);
    expect(resolveSexagenaryDayFromJdn(anchor.anchorJdn - 1, anchor)?.cycleIndex).toBe(59);
  });

  it("rejects unsafe JDNs and invalid anchors", () => {
    expect(resolveSexagenaryDayFromJdn(Number.NaN, anchor)).toBeNull();
    expect(resolveSexagenaryDayFromJdn(2_451_551, { anchorJdn: 2_451_551, anchorCycleIndex: 60 })).toBeNull();
  });
});
