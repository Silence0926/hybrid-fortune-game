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
