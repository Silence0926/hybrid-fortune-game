# Ruleset Governance

## Required metadata

Each calculation engine must publish:
- Stable engine identifier and semantic engine version.
- Ruleset identifier, version, school/tradition, and boundary conventions.
- Reference sources, edition/version, retrieval date, license, and limitations.
- Dataset or ephemeris version and checksum where applicable.
- Golden fixtures and reproducible expected outputs.
- Time-scale, calendar, timezone database, and coordinate-frame conventions wherever time or astronomy is involved.

## Status lifecycle

draft -> reviewed -> validated -> released -> deprecated

A ruleset cannot become validated until domain review and boundary fixtures are recorded. Code review alone does not validate a traditional rule. Unverified sources remain draft or reviewed.

A successful automated fixture check is evidence of internal consistency, not proof that a source is authoritative or independent. The reviewer must inspect source ownership, derivation, edition, date basis, and licensing.

## Change policy

Changes to rules, reference data, calendar conventions, or interpretation mappings require a ruleset version increment and regression fixtures. Historical calculation records remain immutable.

## Output policy

Complete means the selected ruleset and required data passed the project's validation gate; it does not mean real-world prediction. Product language must communicate cultural and entertainment scope.

## JDN-to-sexagenary-day anchor gate

A production anchor must be supported by at least two genuinely independent reference sources that agree on:
- The same Gregorian civil date.
- The same integer JDN under `integer_jdn_gregorian`.
- The same sexagenary cycle index (0 = 甲子 through 59 = 癸亥).

Every fixture records source ID/title/URL, access date, date basis, and JDN convention. Two URLs or two websites are not automatically independent if they reproduce the same underlying table. A domain reviewer must document source independence and approve the anchor.

The package function `validateDayCycleReferenceFixtures` checks metadata completeness and agreement. Its `candidate_supported` result is deliberately not a release approval. Synthetic test fixtures validate the gate's logic only and must never be presented as calendar evidence.

## Solar-term / ephemeris gate

The calendar package defines an `EphemerisProvider` boundary and a solar-longitude crossing solver; it does not ship a production ephemeris provider.

The Hong Kong Observatory (HKO) is a suitable published comparison source for modern solar-term instants: its published times are in Hong Kong Time (UTC+8), and HKO states that its astronomical data are supplied by the HM Nautical Almanac Office and the US Naval Observatory. Its explanation defines the 24 terms as 15-degree increments of solar ecliptic longitude. Record this provenance and time zone when creating comparison fixtures.

An implementation provider must additionally declare:
- Provider and dataset version/checksum.
- Apparent geocentric ecliptic coordinate model and equinox/ecliptic convention.
- Native time scale and conversion to UTC (including Delta-T / UT1 / TT policy as applicable).
- Supported historical/future range and expected uncertainty.
- License and redistribution obligations.

Swiss Ephemeris is a technically capable candidate, but its published documentation describes dual licensing (AGPL or a Professional License). A distribution decision must be made before embedding or operating a public service; do not add it as a dependency until licensing is deliberately resolved.

A provider-backed crossing result is not independently validated merely because its numerical solver converged. Compare selected modern crossings against HKO fixtures, test immediately-before/at/after boundaries, and retain source precision and uncertainty. Do not infer exact instants from date-only almanac entries.

## Current validation status

- JDN arithmetic: implemented and covered by algorithmic tests; cycle anchor remains unapproved.
- JDN fixture evidence gate: implemented; no production source fixtures approved yet.
- Solar-longitude solver: implemented as a provider boundary; no production ephemeris provider selected.
- HKO modern solar-term data: identified as a comparison source; machine-readable, independently reviewed golden fixture set still pending.
- BaZi calculation remains disabled until all required gates and unresolved policy decisions are closed.


## HKO 2026 major-term comparison fixtures

The calendar package now contains a 12-record comparison set transcribed from the Hong Kong Observatory's *24 Solar Terms in 2026* PDF:
`packages/calendar/src/hko-2026-major-solar-terms.ts`.

Important classification boundary:
- The published 2026 PDF table lists the 12 **major solar terms (中氣 / zhongqi)** only.
- These records are not the 12 **Jie (節)** instants used by the project's BaZi month-boundary policy.
- They are useful for checking the 30-degree major-term longitude sequence and UTC+08:00 to UTC conversion, but they cannot validate the 12 Jie month boundaries.
- The source publishes times to the minute. Tests preserve that precision and must not imply second-level accuracy.
- UTC values are deterministic fixed-offset conversions from HKT; they are not a second independent astronomical calculation.

The fixtures and tests intentionally make no claim that a production ephemeris provider has passed astronomical validation.

Source:
- Hong Kong Observatory, *24 Solar Terms in 2026*: https://www.hko.gov.hk/en/gts/astron2026/files/2026SolarTerms24.pdf
- HKO states the annual astronomical solar-term data are based on HM Nautical Almanac Office (UK) and US Naval Observatory data, and its published times are Hong Kong Time (UTC+8): https://www.hko.gov.hk/en/gts/astronomy/Solar_Term.htm
- HKO's explanation gives the 15-degree spacing of the 24 solar-term longitudes: https://www.hko.gov.hk/en/gts/time/24solarterms.htm

## Ephemeris provenance contract update

`EphemerisProvenance` now requires explicit:
- UTC input timestamp semantics.
- Internal calculation time scale (UT1 or TT).
- Time conversion policy and Delta-T model.
- Supported date range.
- Dataset checksum field (nullable only when the provider cannot publish one).
- License, source citation, and uncertainty field.

The synthetic test provider declares these fields explicitly. It is not a real ephemeris and its test success is not an accuracy claim. Production provider selection remains blocked pending time-scale, Delta-T, licensing, range, uncertainty, and independent comparison review.


## 24-term taxonomy and BaZi month-boundary classification

The calendar package now exposes `SOLAR_TERMS_24`, `getSolarTermByLongitude`, and `getBaziMonthBoundaryTerms`.

- The taxonomy defines the 24 apparent solar-longitude targets at 15-degree intervals.
- It explicitly distinguishes the 12 Jie (節) from the 12 Zhongqi (中氣).
- Only Jie are marked as BaZi month-boundary terms under the project's confirmed policy.
- This is a classification table, not an ephemeris: it provides no dates or crossing instants.
- The HKO 2026 fixture set contains Zhongqi only and therefore must not be used as a direct test of month-boundary instants.

The longitude taxonomy is based on HKO's explanation that the 24 terms divide the ecliptic into 24 equal 15-degree segments. The exact tradition-specific month-boundary rule remains governed by the user's approved BaZi V1.0 policy and its 12-Jie convention.

## Jie crossing fixture evidence gate

The calendar package now exposes `validateJieTermReferenceFixtures` and the `JieTermReferenceFixture` contract.

- Every candidate year must contain all twelve Jie terms defined by the project's 24-term taxonomy.
- Each Jie must have at least two separately identified reference sources.
- Each record preserves the published local timestamp, its explicit UTC offset, normalized UTC instant, IANA time-zone label, and source precision (minute or second).
- The validator checks term-to-longitude mapping, local-to-UTC consistency, precision preservation, source metadata, and per-term source multiplicity.
- A `candidate_supported` result is not proof of independent astronomical derivation or domain approval. Reviewers must verify source ownership, ephemeris/time-scale conventions, and whether the sources derive independently.
- Synthetic fixtures in the unit tests validate only the gate logic. No 2026 Jie crossing instant is approved or added as a production comparison fixture yet.

The HKO 2026 almanac PDF calendar pages identify the civil dates on which Jie terms occur, but the 2026 24 Solar Terms table publishes the 12 major terms (中氣) only. Date-only calendar cells must not be upgraded into exact crossing instants. HKO's general astronomy page explains that its 24-term astronomical information is based on HM Nautical Almanac Office (UK) and US Naval Observatory data and that published times are Hong Kong Time (UTC+8). A separately retrieved all-24-term table is useful as a secondary cross-check, but its values require direct source verification before they become approved fixtures.

References:
- HKO 2026 almanac: https://www.hko.gov.hk/en/gts/astron2026/files/HKO_almanac_2026.pdf
- HKO 2026 major solar terms: https://www.hko.gov.hk/en/gts/astron2026/files/2026SolarTerms24.pdf
- HKO astronomical solar-term data and time zone: https://www.hko.gov.hk/en/gts/astronomy/Solar_Term.htm
- HKO 24-term taxonomy and 15-degree longitude intervals: https://www.hko.gov.hk/en/gts/time/24solarterms.htm


## Zi Wei Dou Shu ruleset gate

Zi Wei Dou Shu is governed independently from BaZi. The project must not inherit BaZi's solar-term, day-boundary, apparent-solar-time, or Da Yun rules without a Zi Wei-specific source and an explicit ruleset decision.

No school, textual edition, leap-month policy, birth-time policy, 命宫 / 身宫 formula, 五行局 mapping, star-placement formula, 四化 table, or 大限 convention is selected by default. See `docs/ZIWEI_RULESET_RESEARCH_V0.1.md` and ADR-007.

The Zi Wei package exposes a typed ruleset manifest and an assessment gate. Its strongest positive status is `candidate_for_domain_review`; this is not doctrinal validation and never enables production chart calculation. Automated tests verify the gate's behavior only.


## 2027 institutional Jie reference candidates

A real-world candidate set is now recorded in `packages/calendar/src/jie-2027-reference-fixtures.ts`. It contains 24 source records: all twelve BaZi month-boundary Jie, each represented by two institutional publications.

Sources:
- Taipei City Government, *2027 Astronomical Almanac* (2027 曆象表). The publication states that its calendar times use mean solar time at longitude 120°E. The records preserve those values using the fixed IANA offset zone Etc/GMT-8 (UTC+08:00), explicitly tagged as mean solar time rather than regional civil time: https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/26a88cec-7828-4623-995c-ea7b402723cc.pdf
- National Astronomical Observatory of Japan, ECO *24 Solar Terms (Equinoxes, Solstices) Long Term Edition*, year 2027. The page explicitly reports Japan Civil Standard Time (UT+9h) and ΔT = 69 seconds: https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenomena_sy_en.cgi?year=2027

The records preserve each source's local wall time, IANA time zone, normalized UTC instant, minute precision, URL, and access date. The two institutions' published values normalize to the same UTC minute for each of the twelve Jie. This is a useful cross-publication consistency check, but it is **not yet proof of independent ephemeris derivation**: the source algorithms, underlying ephemerides, time-scale conventions, and publication dependencies still require review.

The fixture validator returns only `candidate_supported`; it does not approve the values for production or certify the sources as independent. No seconds are inferred from minute-level publications. The 2027 records are comparison candidates only and do not enable BaZi calculation.

Automated tests verify twelve-term coverage, two source records per term, timezone normalization, minute-precision preservation, and source time-basis metadata. They validate data integrity and the evidence-gate contract, not astronomical accuracy.


## 2026 institutional Jie reference candidates

A second year of real-world comparison candidates is recorded in `packages/calendar/src/jie-2026-reference-fixtures.ts`. It contains 24 source records: all twelve BaZi month-boundary Jie, each represented by Taipei City Government's 2026 Astronomical Almanac and the National Astronomical Observatory of Japan (NAOJ) ECO 2026 solar-term table.

Sources:
- Taipei City Government, *2026 Astronomical Almanac* (2026 曆象表). The publication states that its values use mean solar time at longitude 120°E. The fixtures retain this basis using the fixed offset zone `Etc/GMT-8`: https://www-ws.gov.taipei/001/Upload/439/relfile/21703/3425086/28f5213a-4834-4958-a452-81477e358e73.pdf
- National Astronomical Observatory of Japan, ECO *24 Solar Terms (Equinoxes, Solstices)*, 2026. The page reports Japan Civil Standard Time (UT+9h) and ΔT = 69 seconds: https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/phenom_sekki_en.cgi

All twelve pairs normalize to the same UTC minute. The comparison includes a local-date rollover at 芒種: Taipei publishes 2026-06-05 23:48 at UTC+8, while NAOJ publishes 2026-06-06 00:48 at UTC+9; both normalize to 2026-06-05 15:48Z.

This is a cross-publication consistency result only. It does not establish independent ephemeris derivation, second-level accuracy, or production validity. The fixture validator returns only `candidate_supported`; no BaZi calculation is enabled. Tests verify source count, twelve-term coverage, local-time normalization, declared time bases, and minute precision—not astronomical accuracy.


## JDN arithmetic and sexagenary-day anchor evidence update

`gregorianCivilDateToJdn` now computes the integer JDN from a validated proleptic Gregorian civil date. The day-cycle evidence gate independently recomputes this value and rejects records whose stated JDN does not match the date.

The national-standard anchor is identified as 1949-10-01 = 甲子 (zero-based cycle index 0), JDN 2433191. The CAS / Purple Mountain Observatory interpretation material states this anchor under GB/T 33661-2017. Its 1900–2025 calendar also shows 1949-10-01 as 甲子 and explicitly states that 1949–2025 follows the national standard. Since these records share the same derivation lineage, they are not counted as independent sources. The new candidate records are intentionally rejected by the two-independent-source gate.

The validator now requires `sourceDerivationGroup` metadata and counts distinct derivation families rather than distinct URLs/source IDs. This prevents a mirrored or standard-derived publication from being mistaken for independent corroboration. A second genuinely independent computation or primary published calendar record is still required before approving the anchor.


## Historical Julian-date cross-check for the sexagenary day sequence

The BaZi package now includes a separate proleptic Julian-calendar JDN converter using astronomical year numbering. This is required for historical records before the Gregorian calendar and avoids silently treating a Julian date as a Gregorian date.

A cross-check record is stored in `packages/engines-bazi/src/historical-day-cycle-cross-check.ts`:
- Primary record: *Chunqiu Zuo Zhuan · Duke Yin, year 3* records a solar eclipse on a 己巳 day.
- Historical/astronomical reconstruction: Stephenson and Yau (1992), *Journal for the History of Astronomy*, identifies the event as 22 February 720 BCE (Julian calendar), cycle day 6, and reports that the cyclical-day conversion was checked and the eclipse was visible near sunrise in eastern China.
- Additional peer-reviewed eclipse reconstruction: *Solar Eclipses in the First Half of the Chunqiu Period* (PASJ, 2010) analyses the Chunqiu eclipse series and gives a Delta-T range for the eclipse around 720 BCE February 22.

The code converts 720 BCE to astronomical year -719, converts Julian -719-02-22 to JDN 1458496, and applies the 1949-10-01 = JDN 2433191 = 甲子 anchor. The resulting zero-based cycle index is 5 = 己巳, matching the primary record.

This evidence is marked `candidate_only_pending_domain_review`. It is a strong long-range historical consistency check, not a production approval and not a full independent day-cycle table. The primary text and modern astronomical reconstruction have different evidentiary roles; a reviewer must assess the chronology, date conversion, source independence and historical calendar conventions before approving the anchor.


## 31 Chunqiu sexagenary-day historical fixtures

The 1992 Stephenson–Yau study's Table 3 lists 31 Chunqiu eclipse records with both a Julian-calendar date and a sexagenary cycle day. These entries have been transcribed into `chunqiu-eclipse-day-cycle-fixtures.ts` and independently recomputed by the project's Julian JDN converter and the 1949-10-01 Jiazi anchor.

All 31 Table 3 date/cycle-day pairs reproduce their published 1-based cycle-day indices. This is a broader historical consistency test than the single 720 BCE example. It remains one scholarly source's table and is not counted as 31 independent sources or a complete independent calendar. The underlying historical records and the paper's date reductions still require specialist review.

The paper also identifies one event-level discrepancy: for the 525 BCE record, Table 3 gives 525-08-22 (Julian), cycle day 11, while Table 4's eclipse computation places the actual eclipse on 525-08-21, cycle day 10. The repository preserves this explicitly rather than silently normalizing it. It is a discrepancy between the chronicle's recorded event date and the astronomical eclipse reconstruction, not a failure of the JDN arithmetic for the stated 525-08-22 calendar date.

Source: F. R. Stephenson & K. K. C. Yau (1992), *Astronomical Records in the Ch'un-ch'iu Chronicle*, Journal for the History of Astronomy 23, Tables 3–4: https://caeno.org/pdf/Stephenson_Yau%20Chun%20chiu.pdf

The fixture tests establish arithmetic reproducibility against the transcribed published table. They do not approve the historical anchor for production.
