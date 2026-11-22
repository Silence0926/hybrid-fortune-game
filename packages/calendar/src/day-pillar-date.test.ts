import { describe, expect, it } from "vitest";
import { resolveDayPillarDate } from "./day-pillar-date.js";

describe("resolveDayPillarDate", () => {
  it("assigns 23:00–23:59 to the previous civil date", () => {
    expect(resolveDayPillarDate({ year: 2025, month: 6, day: 15 }, "23:00")).toMatchObject({
      status: "resolved",
      dayPillarDate: { year: 2025, month: 6, day: 14 },
      rule: "23_hour_uses_previous_civil_date"
    });
    expect(resolveDayPillarDate({ year: 2025, month: 6, day: 15 }, "23:59")).toMatchObject({
      status: "resolved",
      dayPillarDate: { year: 2025, month: 6, day: 14 }
    });
  });

  it("keeps 00:00–00:59 on the current civil date", () => {
    expect(resolveDayPillarDate({ year: 2025, month: 6, day: 15 }, "00:00")).toMatchObject({
      status: "resolved",
      dayPillarDate: { year: 2025, month: 6, day: 15 }
    });
    expect(resolveDayPillarDate({ year: 2025, month: 6, day: 15 }, "00:59")).toMatchObject({
      status: "resolved",
      dayPillarDate: { year: 2025, month: 6, day: 15 }
    });
  });

  it("keeps ordinary daytime and evening hours on the current date", () => {
    expect(resolveDayPillarDate({ year: 2025, month: 6, day: 15 }, "12:30")).toMatchObject({
      status: "resolved",
      dayPillarDate: { year: 2025, month: 6, day: 15 }
    });
  });

  it("handles month, year, and leap-day rollovers", () => {
    expect(resolveDayPillarDate({ year: 2025, month: 1, day: 1 }, "23:15")).toMatchObject({
      status: "resolved",
      dayPillarDate: { year: 2024, month: 12, day: 31 }
    });
    expect(resolveDayPillarDate({ year: 2024, month: 3, day: 1 }, "23:15")).toMatchObject({
      status: "resolved",
      dayPillarDate: { year: 2024, month: 2, day: 29 }
    });
  });

  it("returns the JDN of the resolved date and rejects invalid inputs", () => {
    const result = resolveDayPillarDate({ year: 2000, month: 1, day: 1 }, "23:30");
    expect(result).toMatchObject({ status: "resolved", jdn: 2451544 });
    expect(resolveDayPillarDate({ year: 2025, month: 2, day: 30 }, "23:30").status).toBe("invalid_input");
    expect(resolveDayPillarDate({ year: 2025, month: 1, day: 1 }, "24:00").status).toBe("invalid_input");
  });
});
