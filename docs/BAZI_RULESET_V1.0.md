# BaZi Ruleset V1.0 — Confirmed Convention Baseline

**Status:** User-confirmed conventions; implementation is gated by astronomical data validation and unresolved edge-case decisions.  
**Language:** Chinese rules with English technical terminology.  
**Engine:** `@hybrid-fortune/engine-bazi`

This document is the binding source of truth for the six previously confirmed BaZi rule groups. Do not replace these conventions with library defaults or alternative school assumptions.

## Group 1 — 大运起运 (Da Yun Start Age and Direction)

### Confirmed rules
1. Three days correspond to one year: 3 days = 1 year.
2. One day corresponds to four months: 1 day = 4 months.
3. One traditional double-hour (two hours) corresponds to ten days: 1 shichen = 10 days.
4. Direction is determined by year-stem polarity and the gender used for luck-cycle direction:
   - Yang year + male: forward.
   - Yin year + female: forward.
   - Yin year + male: reverse.
   - Yang year + female: reverse.
5. Do not round the start-age result prematurely. Preserve calculation precision.
6. Display the result in years, months, and days (Y/M/D).
7. Forward calculation measures from birth to the next of the twelve Jie (十二节).
8. Reverse calculation measures from the previous of the twelve Jie to birth.

### Unresolved implementation decisions
- Exact conversion of fractional remainders after applying the three-day/year ratio.
- Handling an interval shorter than one double-hour.
- Conversion from the derived duration to a Gregorian start date.
- Month-end, leap-year, and leap-day arithmetic.
- Arrangement/order of the first Da Yun pillar.

These details must remain configurable or explicitly pending. Do not silently choose a rounding or date-arithmetic convention.

## Group 2 — 出生时间与视太阳时 (Birth Time and Apparent Solar Time)

### Confirmed rules
1. Use historical IANA time-zone rules for the birth location and date.
2. Use Apparent Solar Time (AST / 视太阳时), not a simple Mean Solar Time approximation.
3. Geographic coordinates, including longitude and latitude, are required for the solar-time calculation.
4. Civil time and Apparent Solar Time are independent calculation branches derived from the same birth instant. Do not overwrite one with the other.

Confirmed relation:

`T_AST = T_UTC + longitude/15 + E/60`

- Longitude is positive east and negative west.
- E is the equation-of-time term, defined here as apparent solar time minus local mean solar time.
- Time units must be normalized consistently before arithmetic.

### Unresolved implementation decisions
- Input precision when seconds are missing.
- DST repeated and nonexistent local times.
- Astronomical model, ephemeris, and time scales used to calculate E.
- Reliability/confidence treatment for historical birth-time records.
- Whether and how a user may apply a manual historical time-zone correction.

## Group 3 — 干支历法与柱位 (Gan-Zhi Calendar and Pillars)

### Confirmed rules
1. Use astronomical solar-term instants, not fixed calendar-date approximations.
2. The year pillar changes at the actual instant of Li Chun (立春).
3. The month pillar changes at the twelve Jie (十二节), not at lunar month boundaries.
4. Calculate the day pillar using the Julian Day Number (JDN) method.
5. The day boundary is local civil midnight (00:00):
   - 23:00–23:59 belongs to the previous civil date.
   - 00:00–00:59 belongs to the current civil date.
6. Use the traditional twelve double-hours (十二时辰) for the hour branch.
7. Use the Five Tigers formula (五虎遁) for month-stem derivation.
8. Use the Five Rats formula (五鼠遁) for hour-stem derivation.
9. The civil-time branch and AST branch independently resolve:
   - Year and month pillars by comparing the relevant astronomical instant with solar-term crossings.
   - Day pillar by that branch's local date and 00:00 day boundary.
   - Hour branch by that branch's local time.
   - Hour stem from the corresponding day stem under the Five Rats rule.

The two branches must be stored and auditable side by side. Do not collapse them into one adjusted timestamp.

## Group 4 — 藏干结构 (Hidden Stems)

Every Earthly Branch must retain its complete hidden-stem composition:
- Main Qi (本气)
- Middle Qi (中气)
- Residual Qi (余气)

Do not reduce a branch to only its main hidden stem. The data model must preserve stem identity and its role/order.

## Group 5 — 十神 (Ten Gods)

Ten-God relationships are derived from all three inputs:
1. Day Master (日主).
2. Five-Element generating/controlling relationships (五行生克).
3. Yin/Yang polarity (阴阳).

Do not derive Ten Gods from element identity alone; polarity is part of the mapping.

## Group 6 — 地支关系与命理分析 (Branch Relations and Interpretation)

### Branch relationship detection
Recognize and represent each relationship independently:
- Six Harmonies (六合)
- Three Harmonies (三合)
- Half Harmonies (半合)
- Three Meetings (三会)
- Six Clashes (六冲)
- Punishments (刑)
- Harms (害)
- Breaks (破)

**Relationship detection and transformation judgment must be separate stages.** Detecting a combination does not automatically mean transformation has occurred. Transformation requires its own explicit rules and evidence.

### Analysis layers
- Traditional comprehensive strength assessment (Traditional 综合旺衰).
- Month-command structure selection (月令取格).
- Integrated useful-god and favorable/unfavorable element analysis (Integrated 用神喜忌).

The system must retain the selected analysis method and its rule version. Do not silently blend analysis schools.

## Implementation and validation requirements

- Every result records engine version, ruleset version, time-zone database version, astronomical dataset/version, and input digest.
- Solar-term boundary tests must include instants immediately before, at, and after actual crossing times.
- JDN tests must include date transitions and leap-year cases.
- Time tests must cover civil-time and AST branches independently, including longitude sign.
- Golden fixtures must cite the authoritative reference and its edition/version.
- A calculation is not marked complete until the relevant data source and boundary fixtures have passed review.

## Release gate

The convention baseline above is fixed. The engine remains non-production until the unresolved decisions are resolved and the astronomical/time data provider is validated. No synthetic pillar values may be returned as a substitute.


## Solar-time pipeline implementation status

The calendar package currently contains a research-stage NOAA fractional-year approximation for the Equation of Time. It implements:

- East-positive longitude correction: longitude × 4 minutes per degree.
- Local Mean Solar Time = UTC + longitude correction.
- Apparent Solar Time = Local Mean Solar Time + Equation of Time.
- Explicit UTC-offset timestamp validation and longitude range validation.
- Separate output fields for Local Mean Solar Time and Apparent Solar Time, including date rollover.

**This is not a production astronomical ephemeris.** The approximation is exposed with model provenance and warnings. It must not be treated as a validated historical solar-time source for BaZi chart calculation until accuracy is benchmarked against an authoritative ephemeris, time-scale conventions are fixed, and historical fixtures are reviewed. Civil time remains independently represented by the IANA-resolved local wall time; this solar-time function does not overwrite it or apply DST a second time.

## Day-pillar civil-date resolver implementation status

The calendar package now exposes `resolveDayPillarDate(date, localTime)`. It applies the confirmed civil-date convention before JDN lookup:

- 23:00–23:59 resolves to the preceding Gregorian civil date.
- 00:00–00:59 remains on the supplied Gregorian civil date.
- Other valid local times remain on the supplied Gregorian civil date.
- The result retains the original date, resolved day-pillar date, and integer JDN for auditability.

Automated tests cover the 23:00/00:00 boundaries, month/year rollover, leap-day rollover, JDN output, and invalid input.

**Scope limitation:** this resolver does not map JDN to a sexagenary day index or return a day stem/branch. The cycle anchor and independent authoritative golden fixtures must be verified before that mapping is enabled.

## Gan-Zhi foundational formula module

The BaZi package now exposes the ten Heavenly Stems and twelve Earthly Branches as ordered, zero-based tables, plus validated index lookups.

Implemented pure functions:

- `getMonthBranchIndex(monthNumber)`: maps solar month number 1–12 to 寅 through 丑. It does not determine the solar-month number from a timestamp.
- `deriveMonthStemIndex(yearStemIndex, monthBranchIndex)`: Five Tigers formula (五虎遁), deriving the month stem from a previously established year stem and month branch.
- `deriveHourStemIndex(dayStemIndex, hourBranchIndex)`: Five Rats formula (五鼠遁), deriving the hour stem from a previously established day stem and hour branch.
- `isValidStemBranchPair(stemIndex, branchIndex)`: checks the required Yin/Yang parity compatibility of a stem-branch pair.

The formulas are implemented as pure functions and tested across all ten year/day stems and twelve branches. The tests do not assert any unverified date-to-year-stem, date-to-month-branch, or JDN-to-day-stem mapping.

**Boundary:** solar-term resolution, sexagenary cycle anchoring, and birth-time-to-hour-branch conversion remain separate tasks. These utilities do not enable the BaZi chart endpoint or change `calculationEnabled: false`.

## Ten-God derivation module

A pure Ten-God resolver is now implemented in `packages/engines-bazi/src/ten-gods.ts`.

Inputs are the Day Master's Heavenly Stem index and the target Heavenly Stem index. The resolver applies both:

1. Five-Element relationship: same element, Day Master generates target, Day Master controls target, target controls Day Master, or target generates Day Master.
2. Yin/Yang polarity: same polarity selects the偏 (indirect) relation where applicable; opposite polarity selects the正 (direct) relation. For same-element relations this distinguishes 比肩 from 劫财; for output relations it distinguishes 食神 from 伤官.

The test matrix checks all ten target stems relative to 甲木 and validates invalid indices. The module does not infer the Day Master from a birth date and does not assign Ten Gods to hidden stems until hidden-stem data is implemented and validated.


## Hidden-stem data module implementation status

The BaZi package now exposes `getHiddenStems(branchIndex)` for all twelve Earthly Branches. Each entry retains the Heavenly Stem index/name and its ordered qi role (`main_qi`, `middle_qi`, or `residual_qi`). Branches traditionally containing one or two hidden stems return only those entries; the implementation does not fabricate missing qi slots.

The current ordered data table is encoded as a conventional reference dataset and covered by a twelve-branch regression test. Before production use, this table should be reviewed against the project's selected classical reference edition and documented source provenance. Hidden-stem Ten-God derivation can now consume this data, but no full chart interpretation is enabled.

## Earthly Branch relationship detector implementation status

The BaZi package now exposes `detectBranchRelations(branchIndices)`. It detects:

- Six Harmonies (六合)
- Three Harmonies (三合) and the three pairwise half-harmony forms (半合/拱合)
- Three Meetings (三会)
- Six Clashes (六冲)
- Punishments (刑), including the two three-branch punishment groups and repeated self-punishment branches
- Six Harms (六害)
- Six Breaks (六破)

Every match records its relationship kind, matching branch indices, source positions, and a traditional label. Multiple relationships may be returned for the same pair because traditional relationship systems can overlap (for example, 寅亥六合 and 寅亥破). This is intentional: the detector reports structural matches without resolving priority or transformation.

**Important boundary:** this module does not decide whether a combination transforms, whether transformation conditions are satisfied, or whether a relationship is favorable/unfavorable. Pairwise half-harmony classifications and overlapping punishment conventions must be governed by a selected reference school before production release. The chart calculation gate remains disabled.


## Hidden-stem Ten-God integration

The package now exposes `deriveHiddenStemTenGods(dayMasterStemIndex, branchIndex)`. It preserves each hidden stem's Main/Middle/Residual Qi role and order, then derives the Ten God from the Day Master's element relationship and Yin/Yang polarity. It does not infer the Day Master or decide the weight of each qi layer.

## Configurable JDN-to-sexagenary-day resolver

The package now exposes `resolveSexagenaryDayFromJdn(jdn, anchor)`. The caller must provide both:

- `anchorJdn`: the integer JDN of a reference civil date.
- `anchorCycleIndex`: the verified sexagenary index assigned to that date (0 = 甲子 through 59 = 癸亥).

The resolver applies forward/backward modulo-60 arithmetic and returns the corresponding stem/branch indices and labels. It rejects invalid or unsafe integer inputs.

**Critical validation gate:** the resolver intentionally has no built-in anchor. Tests use a synthetic configured anchor to validate arithmetic only; they do not assert that the anchor is a historically verified 甲子 date. A production anchor must be established from multiple independent authoritative calendar fixtures and checked against the project's exact JDN integer convention before date-to-day-pillar calculation can be enabled.
