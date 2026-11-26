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


## IANA time-zone provenance implementation status

The local wall-time resolver now returns a structured `timeZoneProvenance` object alongside every non-invalid resolution result. It records the requested and canonicalized IANA identifier, the resolved Intl locale, calendar, numbering system, and hour cycle used by the resolver.

**Known platform limitation:** ECMAScript `Intl.DateTimeFormat` does not expose the underlying IANA tzdb release identifier. The result therefore explicitly reports `tzDatabaseVersion: null` and `tzDatabaseVersionStatus: not_exposed_by_ecmascript_intl`; it does not pretend that the exact database release is known. Reproducible production calculations will require a pinned server/runtime image or a separately versioned time-zone data provider, plus recorded runtime/build provenance. The current resolver continues to use the host runtime's ICU/IANA data and does not enable BaZi calculation.

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


## Transformation assessment framework (policy-driven, not yet a school ruleset)

The package now exposes `assessBranchTransformation(relation, policy, evidence)`. This is an assessment framework, not a built-in transformation doctrine.

A caller must provide a versioned policy containing:
- Policy ID, version, and named school/tradition.
- Relationship kinds eligible for assessment.
- Explicit required evidence keys.
- Optional target transformed element.

Each evidence item must be marked `satisfied`, `not_satisfied`, or `unknown`. Missing and unknown evidence remain distinguishable. The framework returns one of:

- `policy_not_configured`
- `not_eligible`
- `insufficient_evidence`
- `conditions_not_met`
- `conditions_met_pending_domain_review`

It deliberately never returns a final "transformed" state. Even when all configured evidence conditions are satisfied, a domain reviewer must validate the school-specific interpretation before the application may state that transformation occurred.

No default transformation policy has been selected. In particular, the framework does not hard-code month-command support, exposed transforming stems, clash interference, seasonal strength thresholds, or any other school-dependent doctrine. The production chart calculation gate remains disabled.


## Day-cycle reference fixture gate

The BaZi package now exports `validateDayCycleReferenceFixtures`. It checks that candidate reference records:
- Use the same Gregorian civil date, integer JDN and sexagenary index.
- Use the project's explicit proleptic-Gregorian date basis and integer JDN convention.
- Include traceable source title, URL, source ID and access date.
- Contain at least two distinct source IDs.

A `candidate_supported` result is not a validated anchor. Distinct source IDs do not establish genuine independence; human review must inspect whether the sources derive from the same underlying calendar table. The included tests use synthetic data solely to test the validator. No real-world day-cycle anchor has been approved.

## Solar-term provider research status

The existing calendar module already provides an `EphemerisProvider` interface and a bisection-based solar-longitude crossing solver. No production provider is configured.

Research identified the Hong Kong Observatory (HKO) as a useful modern comparison source:
- HKO defines the 24 solar terms at 15-degree intervals of solar ecliptic longitude.
- HKO states its published astronomical solar-term data are based on data from the HM Nautical Almanac Office (UK) and the US Naval Observatory.
- HKO publishes solar-term times in Hong Kong Time (UTC+8).

References:
- HKO, Date and Time of the 24 Solar Terms: https://www.hko.gov.hk/en/gts/astronomy/Solar_Term.htm
- HKO, The 24 Solar Terms: https://www.hko.gov.hk/en/gts/time/24solarterms.htm
- HKO Almanac 2026: https://www.hko.gov.hk/en/gts/astron2026/almanac2026_index.htm

HKO can provide comparison fixtures for modern dates, but its published values do not by themselves establish historical accuracy across the full birth-date range. Each fixture must preserve the original HKT timestamp, its UTC conversion, source edition/date, and displayed precision.

Swiss Ephemeris is a possible implementation candidate, not an adopted dependency. Its documentation describes an AGPL / Professional dual-license model. The project must resolve licensing before bundling it or activating a public service:
https://www.astro.com/swisseph-download/doc/swisseph.pdf

**Current decision:** retain the provider interface; do not hard-code solar-term timestamps, select a library, or enable BaZi calculation until coordinate conventions, time scales, Delta-T handling, supported historical range, license, and independent comparison fixtures are reviewed.


## Gregorian civil-date to JDN conversion and 1949 anchor evidence

The BaZi package now exposes `gregorianCivilDateToJdn`, an integer-arithmetic Gregorian date converter using the project's `integer_jdn_gregorian` convention. It validates impossible dates and does not apply a timezone: callers must first resolve the intended local civil date under the birth-time policy.

The 1949-10-01 day-cycle anchor has now been identified in the national standard material: GB/T 33661-2017 specifies that the Beijing-time Gregorian date 1949-10-01 corresponds to a 甲子 day. The integer JDN for the Gregorian civil date is 2433191, and the corresponding zero-based cycle index is 0.

Two corroborating records are stored in `day-cycle-reference-candidates.ts`:
- Chinese Academy of Sciences / Purple Mountain Observatory interpretation of GB/T 33661-2017.
- Purple Mountain Observatory's 1900–2025 calendar, whose preface states that 1949–2025 follows GB/T 33661-2017.

These are deliberately assigned the same derivation-family ID because the calendar publication explicitly follows the same national standard. They corroborate the anchor but are **not independent evidence**. The anchor is therefore identified but not approved for production.

The fixture gate has been strengthened:
- Recomputes JDN from the Gregorian civil date and rejects mismatches.
- Requires an explicit source derivation-family identifier.
- Counts distinct derivation families, not merely distinct URLs or source IDs.
- Keeps successful automated validation at candidate-only status.

References:
- CAS / Purple Mountain Observatory, *Interpretation of GB/T 33661-2017*: https://pmo.cas.cn/xwdt2019/kpdt2019/202203/P020240201504886119982.pdf
- Purple Mountain Observatory, *1900–2025 Calendar*: https://www.pmo.cas.cn/xwdt2019/kpdt2019/202203/P020250414456381274062.pdf
- NAOJ ECO, *Day number, weekday and sexagenary cycle* (additional independent comparison source to investigate): https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/cale2j.cgi

The project's own day-pillar convention still governs whether the date supplied to this converter is the preceding civil date for 23:00–23:59 or the current civil date otherwise. The converter itself does not alter that confirmed policy.


## Historical day-cycle cross-check: Chunqiu Duke Yin year 3

A long-range historical cross-check is now recorded in `historical-day-cycle-cross-check.ts`.

The primary text, *Chunqiu Zuo Zhuan · Duke Yin, year 3*, records: `春，王二月，己巳，日有食之。` The transmitted text supplies the sexagenary day 己巳 but does not itself give a Julian-calendar date.

F. Richard Stephenson and Kevin K. C. Yau, in *Astronomical Records in the Ch'un-ch'iu Chronicle* (Journal for the History of Astronomy 23, 1992), identify the eclipse as 22 February 720 BCE on the Julian calendar, identify 己巳 as cycle day 6, state that they verified the cyclical-day conversion, and report an eclipse visible near sunrise in eastern China. A later peer-reviewed study, *Solar Eclipses in the First Half of the Chunqiu Period* (PASJ 62(3), 2010), independently analyses the Chunqiu eclipse series and gives a Delta-T range for the eclipse around 720 BCE February 22.

The software explicitly converts historical 720 BCE to astronomical year -719 (there is no civil year zero), then converts Julian 720 BCE-02-22 to JDN 1,458,496. Applying the already identified modern anchor 1949-10-01 = JDN 2,433,191 = cycle index 0 gives cycle index 5, 己巳. This agrees with the historical record.

This is a strong long-range historical consistency check, but it is recorded as `candidate_only_pending_domain_review`, not as a production anchor approval. It validates one historical event and does not constitute a full independent day-cycle table. The primary text and the scholarly astronomical reconstruction have distinct evidentiary roles; their independence and the detailed historical date conversion still require domain review.

References:
- Primary text: https://ctext.org/chun-qiu-zuo-zhuan/yin-gong-san-nian/ens
- F. R. Stephenson & K. K. C. Yau (1992), *Astronomical Records in the Ch'un-ch'iu Chronicle*: https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf
- *Solar Eclipses in the First Half of the Chunqiu Period* (2010), PASJ 62(3): https://doi.org/10.1093/pasj/62.3.797

The new Julian-date conversion uses astronomical year numbering and is kept separate from the existing proleptic Gregorian date converter. It does not change the confirmed BaZi rule that the day-pillar date is selected using the user's local civil-midnight policy.


## 31 Chunqiu sexagenary-day historical fixtures

The 1992 Stephenson–Yau study's Table 3 lists 31 Chunqiu eclipse records with both a Julian-calendar date and a sexagenary cycle day. These entries have been transcribed into `chunqiu-eclipse-day-cycle-fixtures.ts` and independently recomputed by the project's Julian JDN converter and the 1949-10-01 Jiazi anchor.

All 31 Table 3 date/cycle-day pairs reproduce their published 1-based cycle-day indices. This is a broader historical consistency test than the single 720 BCE example. It remains one scholarly source's table and is not counted as 31 independent sources or a complete independent calendar. The underlying historical records and the paper's date reductions still require specialist review.

The paper also identifies one event-level discrepancy: for the 525 BCE record, Table 3 gives 525-08-22 (Julian), cycle day 11, while Table 4's eclipse computation places the actual eclipse on 525-08-21, cycle day 10. The repository preserves this explicitly rather than silently normalizing it. It is a discrepancy between the chronicle's recorded event date and the astronomical eclipse reconstruction, not a failure of the JDN arithmetic for the stated 525-08-22 calendar date.

Source: F. R. Stephenson & K. K. C. Yau (1992), *Astronomical Records in the Ch'un-ch'iu Chronicle*, Journal for the History of Astronomy 23, Tables 3–4: https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf

The fixture tests establish arithmetic reproducibility against the transcribed published table. They do not approve the historical anchor for production.


## Alternative Chunqiu-calendar reconstruction cross-check

A second computational reconstruction has been added as a comparison dataset: Y. T. Liu, *Reconstruction of the Chunqiu Calendar* (first draft, 2019), https://ytliu0.github.io/ChineseCalendar/chunqiu.html.

The author explicitly states that the reconstruction follows Section 3.5 / Table 3-7 of Zhang Peiyu et al., *Ancient Chinese Calendars and Almanacs* (2008), and reconstructs the Lu-state calendar using a lunar-cycle model and inferred intercalations. Selected New Year date/sexagenary-day pairs are recorded in `chunqiu-calendar-model-cross-check.ts` and recomputed with the project's Julian JDN converter and 1949-10-01 Jiazi anchor.

Seven selected pairs match the modern-anchor arithmetic, including the source's corrected N_-720 reading (721 BCE-01-05 = 乙亥, not the apparent table typo 己亥). This is an alternate computational reconstruction, not a new primary historical witness. Its lineage is conservatively grouped with the Zhang Peiyu 2008 reconstruction; it receives no independent-source release-gate credit.

The source itself cautions that the Chunqiu calendar is a reconstruction model fitted to fragmented records. It reports 45 inconsistencies among 393 calendrical dates, discusses possible textual transmission errors and model limitations, and notes that alternative reconstructions can differ by a month. Therefore these seven matches demonstrate arithmetic consistency with a separate published reconstruction, not definitive historical validation.

Source: Y. T. Liu, *Reconstruction of the Chunqiu Calendar*, especially the opening-year table, the N_-720 correction, and the reliability discussion: https://ytliu0.github.io/ChineseCalendar/chunqiu.html


## Independent published JDN formula cross-check

A separate published computational exposition has been added as `day-cycle-independent-formula-cross-check.ts`: Y. T. Liu, *Sexagenary Cycle (六十干支)*, first draft October 2018, last major update 7 July 2019.

The page derives the one-based sexagenary index from its 2019 calendar entry 2019-01-27 = 甲子, JDN 2,458,511:
`S = 1 + mod(JD_noon - 11, 60)`.
It also gives a worked example: 1781-03-13, JDN 2,371,629 = 壬戌.

The repository now independently recomputes both Gregorian JDNs, evaluates the published formula, and compares both results with the project's 1949-10-01 = 甲子 anchor. Both examples match: 2019-01-27 = 甲子 and 1781-03-13 = 壬戌.

This is useful as an independently published computational exposition and an alternate modern anchor/example pair. It is not a primary historical witness: the 2019 anchor is taken from the author's 2019 calendar page. The source record therefore explicitly sets `independentHistoricalWitness=false`. This strengthens implementation cross-checking but does not satisfy the independent historical-source release gate.

Source: https://ytliu0.github.io/ChineseCalendar/sexagenary.html


## External day-table dataset review: Chinese Calendar Open Datasets v1.1.0

A public third-party dataset was reviewed as a candidate cross-check:
- Repository: https://github.com/Kuangchujia/chinese-calendar-dataset
- Dataset DOI: https://doi.org/10.5281/zenodo.22788686
- Version stated in the repository: v1.1.0
- Licence: CC BY 4.0
- A3 coverage: 55,883 daily rows, 1900-01-01 through 2052-12-31.

The repository publishes its generator and an anchor verification table. Its day sequence is generated from the modern ordering anchor 1949-10-01 = 甲子 using Gregorian/Julian JDN conversion and modulo-60 arithmetic. Its verification table lists 1590-12-22, 1861-11-11, 2025-12-21 and the Chunqiu 720 BCE-02-22 己巳 record; it also explicitly rejects a conflicting 1965-12-22 = 甲子 claim as erroneous.

Source-lineage assessment:
- The 1949 anchor is supported in the dataset README by modern calendar/teaching references, but those references are not fully itemized there.
- The 720 BCE historical check is the same Chunqiu eclipse record already covered by this project; it is not a new historical witness.
- The listed 1590 and 1861 entries are useful candidates, but their underlying primary documentary citations have not yet been established from the dataset's verification table.
- The 2025 entry is modern and is corroborated by a media report citing the Wuyang Astronomical Museum, but it remains a modern calendar cross-check rather than a historical witness.
- The dataset's published generator is valuable for reproducibility, but it uses the same general JDN/modulo-60 architecture and the same 1949 anchor. It is not an independent derivation of the absolute sequence.

Decision: record as a useful external implementation/data candidate, but do not import the 55,883 rows as authoritative fixtures and do not award independent historical-source gate credit. The separate Y. T. Liu published formula cross-check is recorded in `day-cycle-independent-formula-cross-check.ts`; it checks the same modular mapping against the 2019 calendar anchor and a 1781 worked example.

References:
- Repository and README: https://github.com/Kuangchujia/chinese-calendar-dataset
- Dataset DOI: https://doi.org/10.5281/zenodo.22788686
- Generator: https://github.com/Kuangchujia/chinese-calendar-dataset/blob/main/code/gen_dataset_ganzhi.py
- Verification anchors: https://github.com/Kuangchujia/chinese-calendar-dataset/blob/main/03-%E5%B9%B2%E6%94%AF%E7%BA%AA%E6%97%A5%E5%AF%B9%E7%85%A7%E8%A1%A8/data/verification_anchors.csv


## Chunqiu 525 BCE eclipse-date convention discrepancy

A dedicated evidence record now preserves a one-day discrepancy for the 525 BCE Chunqiu eclipse without normalizing it away.

- Stephenson & Yau (1992), Table 3: the chronicle date is 525 BCE-08-22 (proleptic Julian), with the recorded day 甲戌 (cycle index 11).
- Stephenson & Yau, Table 4: their computed astronomical eclipse date is 525 BCE-08-21.
- Tanikawa, Yamamoto & Sôma (2011), Table 1: lists the Julian eclipse date as 525 BCE-08-21 while retaining the Chunqiu period designation 甲戌 [11].
- Tschang (2004), Table 1: lists 525 BCE-08-21 and quotes the record 夏六月甲戌朔，日有食之。

Using the project's 1949-10-01 = 甲子 anchor and proleptic Julian JDN arithmetic, 525 BCE-08-21 maps to 癸酉 (cycle index 10), while 525 BCE-08-22 maps to 甲戌 (cycle index 11). Thus the sources appear to attach the historical Ganzhi designation to a different date field than the reconstructed astronomical event date.

This module deliberately keeps (a) the transmitted chronicle date, (b) the astronomical event date, and (c) the reported Ganzhi label separate. It does not assert a cause. Candidate explanations to review include ancient local day boundary, astronomical event-date convention, calendar reconstruction, and source/transcription differences.

Tschang and Tanikawa provide separate astronomical reconstructions, but neither is a new primary historical witness for the Ganzhi label. No independent day-cycle anchor credit is awarded, and production calculation remains disabled.

References:
- Stephenson & Yau (1992): https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf
- Tanikawa et al. (2011): https://doi.org/10.1007/978-1-4419-8161-5_2
- Tschang (2004): https://sino-platonic.org/complete/spp141_chinese_calendar.pdf


## Astronomical time-scale governance — JPL Horizons review

The solar-longitude ephemeris boundary now separates three distinct time concepts:

- API timestamps are normalized UTC instants. This is an interchange representation, not a claim that UTC is historically defined for ancient epochs.
- Ephemeris evaluation uses a uniform dynamical/terrestrial argument: TDB or TT. UT1 must not be labelled as the ephemeris dynamics time argument.
- Earth-rotation conversion is separately declared as UT1 when required, or `not_required` when the provider's calculation does not require an Earth-rotation conversion.

The provider provenance contract records the calculation time scale, Earth-rotation time scale, Delta-T model, conversion policy, and Delta-T/UT1 uncertainty. A null uncertainty means unknown/not supplied; it must not be interpreted as zero.

JPL Horizons documentation states that its planetary ephemeris dynamics use TDB; TT and TDB differ by no more than about 0.002 seconds. For observer-time output, Horizons uses UT1 before 1962 and UTC after 1962. Its historical TDB-to-UT conversion relies on reconstructed Delta-T, and the stated uncertainty generally increases toward earlier epochs: a few minutes around AD 948 and about four hours around 3000 BCE. UTC is explicitly not well-defined before 1962 in the Horizons documentation.

Project consequences:
1. Solar-term longitude evaluation and historical Earth-rotation conversion are separate operations.
2. Never feed an ancient civil date to a modern UTC/DST conversion as though it were a well-defined UTC instant.
3. Any provider must declare the ephemeris time argument, Delta-T model/version, supported epoch range, uncertainty, and calendar convention.
4. A numerically precise crossing timestamp does not override uncertainty in converting that instant to a historical local date/time.
5. This governance change does not select a production ephemeris or enable BaZi calculations.

Reference: JPL Horizons System Manual, “Specification of Time”, “Universal Time (TDB -> UT Conversion)”, and “Statement of Ephemeris Limitations”: https://ssd.jpl.nasa.gov/horizons/manual.html

Implementation status: the TypeScript provider provenance now uses `TDB | TT` for ephemeris calculation time and a separate `UT1 | not_required` field for Earth-rotation time. The synthetic provider test explicitly declares its non-astronomical time conversion and null Delta-T uncertainty. This is a contract clarification only; no real ephemeris provider has been integrated or validated.


## 1861-11-11 candidate anchor — source inspection update

The external Chinese-calendar dataset lists 1861-11-11 as a 甲子 verification anchor. A targeted source review found relevant historical-calendar material, but the exact date-to-Ganzhi cell is not yet independently verified:

- Xie Xingyao, *太平天國史事論叢*, National Central Library digitized copy (accessed through a Wikimedia-hosted PDF mirror), printed page 98: the page is a 1861 calendar crosswalk with September, October, and November sections and columns for Gregorian date, Chinese lunar date, and the New Taiping calendar. The available extracted text preserves the table headers and page identity but not the complete cell-level alignment for 1861-11-11. This is a useful source lead, not a verified 甲子 witness.
- Chinese Text Project, 同治元年 date table: search-indexed text lists sexagenary-day sequences for lunar months nine through twelve, but the retrieved excerpt does not establish the exact Gregorian-date alignment for 1861-11-11. The page was not directly inspectable during this review.
- The 1861-11-11 = 甲子 claim also appears in the previously reviewed Chinese Calendar Open Dataset verification anchors. Its derivation is not itemized sufficiently to count as independent historical evidence.

Assessment: retain 1861-11-11 = 甲子 as a candidate cross-check only. No new independent primary witness or independent source-derivation group has been established. Do not add historical day-cycle gate credit and do not enable production day-pillar calculation on this basis.

References:
- Xie Xingyao, *太平天國史事論叢* (NCL digitized copy mirror): https://upload.wikimedia.org/wikipedia/commons/5/58/NCL-9900010708_%E5%A4%AA%E5%B9%B3%E5%A4%A9%E5%9C%8B%E5%8F%B2%E4%BA%8B%E8%AB%96%E5%8F%A2.pdf
- Chinese Text Project, 同治元年 date table: https://ctext.org/date.pl?day=&entityid=705201&if=gb&month=&year=1
- Chinese Calendar Open Dataset verification anchors: https://github.com/Kuangchujia/chinese-calendar-dataset/blob/main/03-%E5%B9%B2%E6%94%AF%E7%BA%AA%E6%97%A5%E5%AF%B9%E7%85%A7%E8%A1%A8/data/verification_anchors.csv


## 1590-12-22 甲子 candidate — additional calendar cross-check

A Japanese historical-calendar table for Tensho 18 (1590), compiled by Tetsu Ishino and published on inoh-ken.org, explicitly lists:

- Gregorian date: 1590-12-22
- Japanese lunisolar date: Tensho 18, month 11, day 26
- Day Ganzhi: 甲子
- Julian Day Number shown by the table: 2,302,151

The same table lists the surrounding dates and their day Ganzhi in sequence. This is a useful additional computational/calendar cross-check for the dataset's 1590-12-22 = 甲子 candidate. However, the accessible source does not fully document the derivation lineage of its day-cycle assignment. It must not be assumed to be independent of the project's JDN/modulo-60 arithmetic, and it is not a contemporary Ming primary witness.

A catalogue for the *國家圖書館藏明代大統曆日彙編* identifies a Ming Wanli 18 (1590) printed almanac, *大明萬曆十八年歲次庚寅大統曆*, as item FB.108.15(7) in volume four. This is a concrete primary-source retrieval lead. The catalogue listing itself does not expose the original calendar pages or verify the 1590-12-22 cell; that collation remains pending.

Assessment: add the Japanese calendar table as a computational cross-check candidate, not as an independent historical witness. The Ming almanac is a primary-source retrieval target, not yet inspected evidence. No historical day-cycle gate credit is granted, and production day-pillar calculation remains disabled.

References:
- Tetsu Ishino, *No. 8 — Tensho 18 (1590)*, historical calendar table: https://inoh-ken.org/Application/nengo/0008.pdf
- Catalogue, *國家圖書館藏明代大統曆日彙編*: https://ytliu0.github.io/ChineseCalendar/MingCalendar_index.html


## Precision correction: Delta-T is not the same field as JPL's TDB-UT conversion

The time-scale provenance contract was refined after checking the current JPL Horizons manual. Classical astronomical Delta-T is defined as TT - UT1. JPL Horizons describes its historical output conversion as TDB - UT, where UT is UT1 before 1962 and UTC after 1962. TDB and TT are close but not identical; Horizons states their periodic distinction is at most about 0.002 seconds in the documented modern model, and notes that this distinction is not maintained for sufficiently early dates where the historical data do not support it.

These are related but not interchangeable quantities. The provider provenance therefore records them separately:
- `deltaTModel`: the classical TT - UT1 model/version, or an explicit not-applicable reason.
- `dynamicalToEarthRotationModel`: the model/version used to map the ephemeris calculation time (TDB/TT) to UT1/UTC.
- `earthRotationConversionUncertaintySeconds`: uncertainty of that historical ephemeris-to-Earth-rotation conversion. Null means unknown/not supplied, never zero.

This avoids incorrectly labelling a provider's TDB-UT conversion model as a Delta-T model. The change is a provenance-contract refinement only; it does not add an ephemeris provider or alter any calendar rule.

Reference: JPL Horizons System Manual, “Specification of Time” and “Universal Time (TDB -> UT Conversion)”: https://ssd.jpl.nasa.gov/horizons/manual.html


## Tensho 18 (1590) daily row inspected — exact cross-check

The six-page Tetsu Ishino historical-calendar PDF was inspected directly. On PDF page index 4 (the fifth page), the row at lines 366–368 explicitly reads:

- 1590-12-22
- Tensho 18, month 11, day 26
- Day Ganzhi 甲子
- Published Julian-day value 2,302,151

The next row is 1590-12-23 = 乙丑, and the previous row is 1590-12-21 = 癸亥, so the daily sequence is continuous across the target date. The project's proleptic-Gregorian civil-date-to-JDN routine also gives 2,302,151. Relative to the project's provisional 1949-10-01 = 甲子 anchor (JDN 2,433,191), the offset is an exact multiple of 60 and maps to cycle index 0 (甲子).

A dedicated source record and regression test were added in:
- `packages/engines-bazi/src/tensho-1590-day-cycle-cross-check.ts`
- `packages/engines-bazi/src/tensho-1590-day-cycle-cross-check.test.ts`

This improves traceability and catches arithmetic drift. It does not establish independent derivation: the Japanese table is a modern compilation and its source lineage for the Ganzhi assignment is not fully disclosed. It is not a contemporary Ming witness. The National Library of Taiwan catalogue lists the original *大明萬曆十八年歲次庚寅大統曆* (FB.108.15(7)), but the original page has not yet been inspected or collated against the modern Gregorian date. No historical-source gate credit is awarded; production day-pillar calculation remains disabled.

References:
- Tetsu Ishino, *No. 8 — Tensho 18 (1590)*, PDF page 5, row for 1590-12-22: https://inoh-ken.org/Application/nengo/0008.pdf
- National Library of Taiwan Ming almanac catalogue, fourth volume, entry FB.108.15(7): https://ytliu0.github.io/ChineseCalendar/MingCalendar_index.html
