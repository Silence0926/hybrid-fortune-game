import type { BirthInput, EngineResult } from "@hybrid-fortune/domain";

export const BAZI_RULESET_V1 = {
  id: "bazi-hybrid-v1",
  version: "1.0.0",
  status: "reviewed_rules_data_pending",
  calculationEnabled: false,
  luckCycle: {
    daysPerYear: 3,
    monthsPerDay: 4,
    daysPerDoubleHour: 10,
    doubleHourMinutes: 120,
    forward: ["yang_year_male", "yin_year_female"],
    reverse: ["yin_year_male", "yang_year_female"],
    precision: "preserve_without_premature_rounding",
    display: ["years", "months", "days"],
    forwardAnchor: "birth_to_next_of_twelve_jie",
    reverseAnchor: "previous_of_twelve_jie_to_birth",
    unresolved: [
      "fractional_remainder_conversion",
      "interval_shorter_than_one_double_hour",
      "gregorian_start_date_arithmetic",
      "month_end_leap_year_leap_day_behavior",
      "first_da_yun_pillar_order"
    ]
  },
  time: {
    timeZoneDatabase: "historical_iana",
    timeBasis: "apparent_solar_time",
    civilAndApparentSolarTime: "independent_branches_from_same_birth_instant",
    requiresLatitude: true,
    requiresLongitude: true,
    apparentSolarTimeFormula: "T_AST = T_UTC + longitude/15 + E/60",
    longitudeSign: "east_positive_west_negative",
    equationOfTimeDefinition: "apparent_solar_time_minus_local_mean_solar_time",
    unresolved: [
      "missing_seconds_precision",
      "dst_repeated_or_nonexistent_local_time",
      "astronomical_model_and_time_scales",
      "historical_birth_time_confidence",
      "manual_historical_timezone_correction"
    ]
  },
  pillars: {
    yearBoundary: "actual_lichun_crossing",
    monthBoundary: "actual_twelve_jie_crossings",
    dayPillarMethod: "julian_day_number",
    dayBoundary: "local_civil_midnight_00_00",
    lateZiHour: "23_00_to_23_59_previous_civil_date",
    earlyZiHour: "00_00_to_00_59_current_civil_date",
    hourBranches: "traditional_twelve_double_hours",
    monthStemMethod: "five_tigers_formula",
    hourStemMethod: "five_rats_formula",
    branchResolution: "resolve_each_time_branch_independently"
  },
  hiddenStems: ["main_qi", "middle_qi", "residual_qi"],
  tenGods: ["day_master", "five_element_generation_control", "yin_yang_polarity"],
  branchRelations: [
    "six_harmonies", "three_harmonies", "half_harmonies", "three_meetings",
    "six_clashes", "punishments", "harms", "breaks"
  ],
  branchRelationAndTransformation: "separate_stages",
  analysisLayers: [
    "traditional_comprehensive_strength",
    "month_command_structure_selection",
    "integrated_useful_god_and_favorable_unfavorable_elements"
  ]
} as const;

export interface BaziChart {
  pillars: null;
  note: "Chart calculation is blocked until validated astronomical and calendar data are configured.";
}

export function calculateBazi(_input: BirthInput): EngineResult<BaziChart> {
  return {
    engineId: "bazi",
    engineVersion: "0.1.0",
    rulesetId: BAZI_RULESET_V1.id,
    rulesetVersion: BAZI_RULESET_V1.version,
    status: "not_implemented",
    inputDigest: "not-computed",
    warnings: [
      "The user's confirmed BaZi V1.0 conventions are encoded in BAZI_RULESET_V1.",
      "Calculation is gated on a validated solar-term/JDN provider and unresolved edge-case policies."
    ],
    provenance: [],
    calculatedAt: new Date().toISOString()
  };
}

export {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  getHeavenlyStem,
  getEarthlyBranch,
  getMonthBranchIndex,
  deriveMonthStemIndex,
  deriveHourStemIndex,
  isValidStemBranchPair
} from "./core.js";
export type { HeavenlyStemIndex, EarthlyBranchIndex, StemBranch } from "./core.js";
