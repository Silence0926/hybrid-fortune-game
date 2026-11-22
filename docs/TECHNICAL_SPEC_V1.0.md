# Technical Specification V1.0

Status: Baseline architecture. Calculation conventions remain subject to approval and source validation.

## 1. Product definition
A web-first cultural-computing application integrating five independently governed systems: BaZi (Four Pillars), Zi Wei Dou Shu, I Ching, Chinese Almanac, and Western Astrology. It supports cultural learning, entertainment, and reflection. It does not claim scientifically validated prediction.

Goals:
- Capture birth context with calendar, time-zone, location, and uncertainty metadata.
- Execute engines independently with declared ruleset and engine versions.
- Preserve inputs, intermediate results, provenance, and reproducibility metadata.
- Keep I Ching as a separate, user-initiated workflow.
- Provide a configurable daily reflection score using only approved non-I-Ching inputs.

MVP non-goals:
- Scientific or deterministic prediction of future events.
- Medical, legal, financial, or safety advice.
- Mixing incompatible schools without disclosure.
- Fabricating lunar dates, solar terms, ephemerides, placements, or divination results.
- Native mobile apps; Web/PWA is first.

## 2. Five-system boundaries

| System | MVP boundary | Decisions / validation required |
|---|---|---|
| BaZi | Input normalization and engine contract first; chart calculation after validation | School; year/month/day boundary; solar-time policy; hour handling; strength and ten-god interpretation |
| Zi Wei Dou Shu | Versioned adapter contract; no authoritative chart output yet | School; leap-month handling; placement rules; transformations |
| I Ching | Separate explicit casting session | Casting method; changing-line conventions; text edition and licensing |
| Chinese Almanac | Date-query contract and provenance model | Regional edition; activity categories; source data and license |
| Western Astrology | Adapter contract; no chart output yet | Tropical/sidereal; house system; geocentric/topocentric; ephemeris and license |

Every engine declares engineId, engineVersion, rulesetId, rulesetVersion, status, and provenance. Unverified engines must not be presented as completed authoritative calculations.

## 3. Birth-time and calendar normalization
Canonical input retains:
- Local civil date and time as entered.
- IANA time-zone identifier, such as Asia/Kuala_Lumpur.
- Birthplace coordinates and location source when available.
- Calendar type: Gregorian or Chinese lunisolar; leap-month flag when applicable.
- Time precision: minute, hour, date-only, or unknown.
- Confidence: exact, approximate, or unknown.
- Explicit true-solar-time policy.

Pipeline:
1. Validate date/time and calendar-specific fields.
2. Resolve historical time-zone offset for the birth instant.
3. Convert to canonical UTC while retaining original local input.
4. Resolve coordinates when supplied.
5. Apply true-solar-time correction only with an approved algorithm and source data.
6. Preserve uncertainty; never invent a birth hour.
7. Pass normalized context and policy identifiers to engines.

DST gaps/overlaps, leap months, unknown time, boundary instants, and missing coordinates require explicit validation or uncertainty states. Calendar conversions and solar-term boundaries require validated datasets and documented licenses.

## 4. MVP calculation pipeline
User input -> validation -> calendar normalization -> engine execution -> provenance capture -> interpretation -> presentation.

MVP can deliver validation, normalization interfaces, provenance, and independent engine contracts before validated domain datasets are integrated. Placeholder engines return not_implemented or unverified, never fabricated chart data.

## 5. Engine and synthesis contract
Each engine returns status (complete, partial, unverified, not_implemented, invalid_input, error), engine/ruleset versions, input digest, result when available, warnings, and provenance. The interpretation layer consumes explicit engine results and retains attribution.

I Ching is a separate user action/session. It is excluded from the daily score input contract and cannot be invoked implicitly by a daily summary.

## 6. Daily reflection score
The score is an optional configurable reflection index, not a probability or factual forecast. Initial weights are unapproved hypotheses. Each factor declares scale, direction, weight, source engine, and explanation. Normalize only over available approved factors; expose missing factors and model version. Never include I Ching. Avoid false precision and show explanations with any number.

## 7. Persistence and reproducibility
Persist profile input snapshots, normalized time context, engine execution records, ruleset versions, source dataset versions, warnings, and output payloads. Hash canonical inputs and ruleset metadata. Algorithm changes create new versions; historical results are immutable.

## 8. API baseline
- POST /v1/profiles — create or update birth profile.
- POST /v1/calculations/bazi — request BaZi execution.
- POST /v1/calculations/almanac — query almanac date.
- POST /v1/divinations/iching — explicitly create a casting session.
- GET /v1/engines — list engine status and supported rulesets.
- GET /health — health metadata.

Requests are schema-validated. Responses include request ID, status, version, warnings, and provenance. Unimplemented engines return a documented non-success status rather than synthetic output.

## 9. Database baseline
PostgreSQL entities: profiles, birth_inputs, engine_versions, rulesets, calculation_runs, divination_sessions, source_datasets. Use UUID keys, UTC timestamps, JSONB snapshots, unique constraints on engine/version and ruleset/version, and indexes on profile/time, engine/status, and input digest. Prisma schema is scheduled for the API persistence milestone.

## 10. Validation and acceptance
- Boundary fixtures: solar-term boundaries, midnight/day-boundary policy, time-zone transitions, leap-month input, unknown birth time, invalid coordinates.
- Golden fixtures record expected output, engine version, ruleset version, source citation, and numeric tolerance where applicable.
- Same canonical input + engine/ruleset/data versions must reproduce equivalent output.
- I Ching is never called by daily-score tests.
- No production engine returns complete without approved rules and verified source data.

## 11. MVP milestones
1. Repository foundation, domain contracts, CI, documentation.
2. Input/calendar normalization with explicit uncertainty and tests.
3. BaZi ruleset selection and validated reference fixtures.
4. Almanac data-source evaluation and adapter.
5. Independent I Ching casting workflow.
6. Web profile and result views.
7. Zi Wei Dou Shu and Western Astrology after validation.
8. Interpretation and daily reflection score after factor/weight approval.

## 12. Decisions required
1. BaZi school and year/month/day boundary conventions.
2. True-solar-time default: disabled, optional, or mandatory.
3. Birth-time uncertainty behavior and date-only chart support.
4. I Ching casting method and text edition.
5. Regional almanac edition and permitted source.
6. Western astrology zodiac, house system, and ephemeris source.
7. Whether to approve daily scoring and its factors/weights.
8. Privacy, retention, account, and deletion requirements for birth data.
