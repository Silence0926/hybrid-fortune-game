import { describe, expect, it } from "vitest";
import {
  TAIPING_1861_MIRROR_PAGE_FRAGMENTS,
  TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS
} from "./taiping-1861-mirror-page-fragments.js";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

function cycleIndex(ganzhi: string): number {
  const stem = STEMS.indexOf(ganzhi[0] as (typeof STEMS)[number]);
  const branch = BRANCHES.indexOf(ganzhi[1] as (typeof BRANCHES)[number]);
  if (stem < 0 || branch < 0 || stem % 2 !== branch % 2) return -1;
  for (let index = 0; index < 60; index += 1) {
    if (index % 10 === stem && index % 12 === branch) return index;
  }
  return -1;
}

describe("Taiping 1861 third-party mirror daily-table fragments", () => {
  it("records four separately surfaced image candidates with full visible Ganzhi pairs", () => {
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENTS).toHaveLength(4);
    for (const fragment of TAIPING_1861_MIRROR_PAGE_FRAGMENTS) {
      expect(fragment.imageUrl).toContain("cache.getarchive.net");
      expect(fragment.visibleEntries.length).toBeGreaterThanOrEqual(7);
      expect(fragment.visibleEntries.every((entry) => cycleIndex(entry.ganzhi) >= 0)).toBe(true);
    }
  });

  it("checks that each transcribed fragment follows consecutive sexagenary-day order", () => {
    for (const fragment of TAIPING_1861_MIRROR_PAGE_FRAGMENTS) {
      fragment.visibleEntries.forEach((entry, offset) => {
        expect(cycleIndex(entry.ganzhi)).toBe((fragment.expectedCycleStartIndex + offset) % 60);
        if (offset > 0) {
          expect(entry.dayNumber).toBe(fragment.visibleEntries[offset - 1]!.dayNumber + 1);
        }
      });
    }
  });

  it("does not infer month identity, printed folio, or civil-date mapping from mirror thumbnails", () => {
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS.directNyplImageHostVerified).toBe(false);
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS.monthHeadingsSecurelyRead).toBe(false);
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS.printedFoliosIdentified).toBe(false);
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS.civilDateMapping).toBe("unresolved");
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS.originalMonthTenDayOneLeafIdentified).toBe(false);
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS.independentHistoricalDayCycleGateCredit).toBe(false);
    expect(TAIPING_1861_MIRROR_PAGE_FRAGMENT_STATUS.productionImpact).toBe("none");
  });
});
