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


## Alternative Chunqiu calendar reconstruction evidence

The project now records selected date/day pairs from Y. T. Liu's *Reconstruction of the Chunqiu Calendar* (first draft 2019). The author explicitly bases the reconstruction on Zhang Peiyu et al., *Ancient Chinese Calendars and Almanacs* (2008), Section 3.5 / Table 3-7. The page describes a lunar-cycle reconstruction, provides proleptic Julian New Year dates and sexagenary day names, and identifies several errors in the source table, including N_-720 (corrected to 乙亥).

Seven selected pairs were recomputed using the repository's Julian JDN conversion and the 1949 Jiazi anchor; all match. This is an alternate computational reconstruction, not an independent primary witness. The registry explicitly sets `independentPrimaryWitness=false` and `independentSourceGateCredit=false`, with a conservative shared lineage ID for Zhang Peiyu's reconstruction family.

The source warns that the Chunqiu calendar reconstruction is a model fitted to fragmented historical records; it reports 45 inconsistencies among 393 calendrical dates and discusses uncertainties in textual transmission and leap-month reconstruction. This evidence is useful for independent implementation testing and model comparison, but not for production approval.

Reference: https://ytliu0.github.io/ChineseCalendar/chunqiu.html


## Published sexagenary JDN formula cross-check

The project now reproduces Y. T. Liu's published formula from *Sexagenary Cycle (六十干支)*:
`S = 1 + mod(JD_noon - 11, 60)`, derived from the page's 2019-01-27 = 甲子, JDN 2458511. The page also supplies 1781-03-13 = 壬戌, JDN 2371629 as a worked example.

Both dates are independently converted by the project's Gregorian JDN implementation. The published formula and the project's 1949 anchor both reproduce the published day names and cycle indices. The evidence is classified as an independent computational exposition, not an independent historical witness; the 2019 anchor originates from the same author's calendar page. It does not receive historical-source release-gate credit.

Reference: https://ytliu0.github.io/ChineseCalendar/sexagenary.html


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
