import { describe, expect, it } from "vitest";
import { calculateDailyReflectionScore } from "../src/index.js";

describe("daily reflection score", () => {
  it("remains disabled until a model is approved", () => {
    const result = calculateDailyReflectionScore(
      [{ id: "sample", sourceSystem: "bazi", value: 80, weight: 1, explanation: "fixture" }],
      { version: "draft-0", approved: false, minWeight: 0, maxWeight: 1 }
    );
    expect(result.status).toBe("unconfigured");
    expect(result.value).toBeNull();
  });

  it("normalizes over valid available factors", () => {
    const result = calculateDailyReflectionScore(
      [
        { id: "a", sourceSystem: "bazi", value: 80, weight: 1, explanation: "a" },
        { id: "b", sourceSystem: "almanac", value: 60, weight: 1, explanation: "b" }
      ],
      { version: "test-1", approved: true, minWeight: 0, maxWeight: 1 }
    );
    expect(result.value).toBe(70);
    expect(result.status).toBe("available");
  });
});

it("excludes I Ching as a scoring source at runtime", () => {
  const result = calculateDailyReflectionScore(
    [
      { id: "bazi-factor", sourceSystem: "bazi", value: 80, weight: 1, explanation: "approved source" },
      { id: "iching-factor", sourceSystem: "iching" as "bazi", value: 100, weight: 1, explanation: "must be excluded" }
    ],
    { version: "test-2", approved: true, minWeight: 0, maxWeight: 1 }
  );
  expect(result.value).toBe(80);
  expect(result.includedFactors).toEqual(["bazi-factor"]);
  expect(result.excludedFactors).toContain("iching-factor");
});
