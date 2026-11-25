# ADR-007 — Zi Wei Dou Shu Ruleset Selection and Isolation

- **Status:** Accepted as a governance constraint; no Zi Wei school or calculation convention selected.
- **Date:** 2026-11-25

## Context

Zi Wei Dou Shu has multiple textual witnesses, later compilations, and modern school-specific conventions. Historical research indicates that the surviving documentary record and the relationship between early texts and later systems are not sufficiently uniform to justify one undocumented “default traditional” implementation.

The product also has a separately governed BaZi engine. Reusing BaZi time, calendar, day-boundary, or interpretation rules inside Zi Wei would silently conflate two distinct systems.

## Decision

1. Zi Wei Dou Shu remains an independent engine with its own ruleset ID, version, school identifier, calendar policy, time policy, and provenance.
2. No school, edition, leap-month convention, day-boundary rule, solar-time policy, star-placement formula, 四化 table, or 大限 convention is selected by default.
3. A rule is not implemented as production logic until its source edition and exact location are recorded and the selected school profile is reviewed.
4. BaZi rules and datasets may be reused only through an explicit, documented dependency where the Zi Wei profile independently justifies that reuse.
5. A passing software test does not constitute doctrinal validation.
6. The engine must return not_implemented until the required ruleset and golden fixtures pass governance review.

## Consequences

- The engine can develop typed rule manifests and validation infrastructure without generating unsupported charts.
- Different schools can later be represented as separate immutable ruleset profiles.
- The initial release may support one fully documented profile rather than pretending to cover all Zi Wei traditions.
- Chart output must retain rule IDs, edition provenance, calendar data version, normalized input, and warnings.

## References

- Liao, Wei-Juin (2020), The Influence of Buddhist Sutras, Daoist Canons, and Yi-ology Succession in the Tang and Sung Dynasties on The Encyclopedia of Zi-Wei-Dou-Shu, Fo Guang University master's thesis, bibliographic record: https://dlbs.liberal.ntu.edu.tw/DLMBS/jp/search/search_detail.jsp?seq=595725
- Research specification: [ZIWEI_RULESET_RESEARCH_V0.1.md](../ZIWEI_RULESET_RESEARCH_V0.1.md)
