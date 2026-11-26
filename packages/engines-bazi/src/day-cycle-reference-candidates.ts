/**
 * Published 1949-10-01 Jiazi anchor records.
 *
 * These records deliberately share one derivation family: the Purple Mountain
 * Observatory's calendar publication states that its 1949–2025 calendar
 * follows GB/T 33661-2017. They corroborate the national-standard anchor but
 * are NOT independent sources and therefore must not pass the two-independent-
 * source release gate.
 */
import type { DayCycleReferenceFixture } from "./day-cycle-fixtures.js";

export const DAY_CYCLE_1949_ANCHOR_REFERENCE_RECORDS: readonly DayCycleReferenceFixture[] = [
  {
    civilDate: "1949-10-01",
    jdn: 2_433_191,
    cycleIndex: 0,
    sourceId: "cas-pmo-gbt-33661-interpretation",
    sourceTitle: "Chinese Academy of Sciences, Purple Mountain Observatory — GB/T 33661-2017 interpretation",
    sourceUrl: "https://pmo.cas.cn/xwdt2019/kpdt2019/202203/P020240201504886119982.pdf",
    accessedOn: "2026-11-26",
    dateBasis: "proleptic_gregorian_civil_date",
    jdnConvention: "integer_jdn_gregorian",
    sourceDerivationGroup: "gbt-33661-2017-pmo-calendar-model"
  },
  {
    civilDate: "1949-10-01",
    jdn: 2_433_191,
    cycleIndex: 0,
    sourceId: "cas-pmo-calendar-1900-2025",
    sourceTitle: "Chinese Academy of Sciences, Purple Mountain Observatory — 1900–2025 calendar",
    sourceUrl: "https://www.pmo.cas.cn/xwdt2019/kpdt2019/202203/P020250414456381274062.pdf",
    accessedOn: "2026-11-26",
    dateBasis: "proleptic_gregorian_civil_date",
    jdnConvention: "integer_jdn_gregorian",
    sourceDerivationGroup: "gbt-33661-2017-pmo-calendar-model"
  }
] as const;

export const DAY_CYCLE_1949_ANCHOR_RESEARCH_STATUS = {
  civilDate: "1949-10-01",
  publishedCycleName: "甲子",
  cycleIndex: 0,
  computedIntegerJdn: 2_433_191,
  status: "national_standard_anchor_identified_independent_source_validation_pending",
  limitation: "Both records belong to the same national-standard/Purple-Mountain-Observatory derivation family. They corroborate the published anchor but do not satisfy the project's independent-source requirement."
} as const;
