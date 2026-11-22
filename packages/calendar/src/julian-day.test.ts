import { describe, expect, it } from "vitest";
import { gregorianToJdn } from "./julian-day";

describe("gregorianToJdn", () => {
  it("matches the JDN epoch reference date", () => {
    expect(gregorianToJdn({ year: 2000, month: 1, day: 1 })).toMatchObject({
      status: "calculated",
      jdn: 2451545
    });
  });

  it("handles leap days and Gregorian century rules", () => {
    expect(gregorianToJdn({ year: 2000, month: 2, day: 29 })).toMatchObject({ status: "calculated", jdn: 2451604 });
    expect(gregorianToJdn({ year: 1900, month: 2, day: 29 }).status).toBe("invalid_date");
    expect(gregorianToJdn({ year: 2024, month: 2, day: 29 }).status).toBe("calculated");
  });

  it("increments exactly one JDN across consecutive civil dates", () => {
    const before = gregorianToJdn({ year: 2024, month: 12, day: 31 });
    const after = gregorianToJdn({ year: 2025, month: 1, day: 1 });
    expect(before.status).toBe("calculated");
    expect(after.status).toBe("calculated");
    if (before.status === "calculated" && after.status === "calculated") {
      expect(after.jdn - before.jdn).toBe(1);
    }
  });

  it("rejects impossible Gregorian dates", () => {
    expect(gregorianToJdn({ year: 2023, month: 2, day: 29 }).status).toBe("invalid_date");
    expect(gregorianToJdn({ year: 2024, month: 13, day: 1 }).status).toBe("invalid_date");
  });
});
