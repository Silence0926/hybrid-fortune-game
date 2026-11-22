import { describe, expect, it } from "vitest";
import { calculateDailyReflectionScore } from "../src/index.js";

describe("daily reflection score", () => {
  it("remains disabled until a model is approved", () => {
    const result = calculateDailyReflectionScore(
      [{ id: "sample", value: 80, weight: 1, explanation: "fixture" }],
      { version: "draft-0", approved: false, minWeight: 0, maxWeight: 1 }
    );
    expect(result.status).toBe("unconfigured");
    expect(result.value).toBeNull();
  });

  it("normalizes over valid available factors", () => {
    const result = calculateDailyReflectionScore(
      [
        { id: "a", value: 80, weight: 1, explanation: "a" },
        { id: "b", value: 60, weight: 1, explanation: "b" }
      ],
      { version: "test-1", approved: true, minWeight: 0, maxWeight: 1 }
    );
    expect(result.value).toBe(70);
    expect(result.status).toBe("available");
  });
});
