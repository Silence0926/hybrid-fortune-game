# Zi Wei Dou Shu Research & Ruleset Specification V0.1

**Status:** Research baseline — no school selected, no production ruleset, no chart calculation enabled.  
**Scope:** Establish a traceable decision framework before implementing a Zi Wei Dou Shu chart engine.

## 1. Product and engineering boundary

Zi Wei Dou Shu is an independent traditional charting system in this product. It must not inherit BaZi pillar rules, solar-term boundaries, day-boundary conventions, or interpretation mappings unless a Zi Wei-specific source and an explicit ruleset decision justify that dependency.

The engine is a calendar-and-rule-driven symbolic chart construction system. Do not describe its star placements as measured astronomical positions unless a future feature actually computes physical celestial coordinates.

The V0.1 milestone produces a source and edition register, a list of decisions required to define one coherent school/profile, a machine-readable ruleset manifest contract, and a release gate that prevents incomplete or merely selected rules from being presented as validated.

It does not produce a chart, interpretive prediction, or a default school.

## 2. Historical and textual caution

A 2020 master's thesis catalogued by Fo Guang University's Buddhist Digital Library examines the formation and textual history of Zi Wei Dou Shu. Its abstract notes that the available pre-Ming documentary record is incomplete, that the term appears in Ming-period materials, and that the relationship among Zi Wei Dou Shu Quan Shu, Xu Dao Zang materials, and later schools is not a single uncontested lineage. This is a research argument, not a final consensus, but it is sufficient reason not to treat the traditional attribution to Chen Tuan as independently established historical fact.

Reference: Liao, Wei-Juin (廖維駿), 2020, The Influence of Buddhist Sutras, Daoist Canons, and Yi-ology Succession in the Tang and Sung Dynasties on The Encyclopedia of Zi-Wei-Dou-Shu, master's thesis, Fo Guang University. Bibliographic record:
https://dlbs.liberal.ntu.edu.tw/DLMBS/jp/search/search_detail.jsp?seq=595725

The following textual families must be registered separately rather than merged by title similarity:
- Zi Wei Dou Shu Quan Shu (《紫微斗數全書》), including the exact edition / facsimile used.
- Zi Wei Dou Shu Quan Ji (《紫微斗數全集》), including the exact edition / facsimile used.
- Xin Ke Zuan Ji Zi Wei Dou Shu Jie Lan (《新刻纂集紫微斗數捷覽》 / 《紫微斗數捷覽》), including the exact edition / facsimile used.
- Xu Dao Zang / Wanli Xu Dao Zang materials concerning Shi Ba Fei Xing (十八飛星), which must not automatically be treated as identical to the later mainstream Zi Wei Dou Shu chart system.
- Later commentaries, school manuals, and modern software conventions, each recorded as secondary or lineage-specific evidence.

Online transcriptions and modern paraphrases are discovery aids. Before a rule is approved, verify it against a named edition or scan, record volume / chapter / page or folio, and preserve variant readings.

## 3. Source hierarchy and evidence record

Every source record must include:
- Stable source ID and exact title.
- Author / compiler / attributed author, preserving uncertainty.
- Edition, publisher / repository, publication date if known.
- Volume, chapter, page / folio, and exact rule passage or a concise paraphrase.
- Stable URL or catalogue identifier, access date, and rights / license status.
- Evidence class: primary edition / facsimile, scholarly study, modern school text, or software observation.
- Whether the source is independent of other cited sources.

A charting rule must not be accepted merely because multiple websites repeat it. Reproductions of the same table count as one underlying evidence lineage.

Recommended evidence order:
1. Verifiable historical edition or facsimile with precise location.
2. Critical edition / scholarly study that identifies its textual basis.
3. Named school manual with an explicit lineage and version.
4. Modern practitioner explanation.
5. Software output, used only as a differential test target—not as the authority for the rule.

## 4. Rule decisions required before a school profile can be implemented

| Decision ID | Domain | Required decision | Why it matters |
|---|---|---|---|
| ZW-01 | Textual basis | Select the primary text family, edition, and any supplementary manual | Prevents mixing rules from different textual lineages |
| ZW-02 | School identity | Name the school / tradition and define which variants are in scope | A generic label such as “traditional Zi Wei” is insufficient |
| ZW-03 | Calendar input | Define supported calendar type and the exact lunar-calendar conversion authority / dataset | Lunar date and leap-month handling affect chart construction |
| ZW-04 | Leap month | Specify the selected school's leap-month treatment, including any split-month or other convention | Different conventions can change the chart |
| ZW-05 | Birth time | Define civil-time interpretation, timezone history, precision, and handling of unknown / approximate time | Prevents silently inventing a birth hour |
| ZW-06 | Solar-time policy | Decide independently whether the selected Zi Wei school uses civil time, local mean solar time, apparent solar time, or another convention | BaZi's confirmed AST policy must not be copied into Zi Wei by default |
| ZW-07 | Day boundary | Define the date rollover rule for births near midnight and the evidence for it | Affects date-based placements |
| ZW-08 | Life / body palaces | Specify month, hour, direction, and indexing rules for 命宫 and 身宫 | Must be testable at every boundary |
| ZW-09 | Five-element bureau | Specify how 五行局 is derived, including stem-branch / 纳音 mapping and any exceptions | Controls later placement steps |
| ZW-10 | Zi Wei / Tian Fu systems | Specify 紫微星 placement, 天府系 derivation, sequence direction, and all boundary cases | Core star-placement dependency |
| ZW-11 | Main and auxiliary stars | Enumerate every included star and its placement formula, dependencies, and source | “All stars” is not a testable scope |
| ZW-12 | Four transformations | Specify natal 四化 mapping and whether / how decade and annual transformations are supported | Transformation tables and scope vary across schools |
| ZW-13 | Twelve palaces | Specify palace order, placement direction, naming, and opposite / trine relationships | Needed for deterministic palace indexing |
| ZW-14 | Decade limits | Specify 大限 start, direction, age convention, and boundary inclusion | Avoids importing BaZi Da Yun rules |
| ZW-15 | Annual / monthly / daily layers | Define whether these are in V1 and each layer's calendar and transformation rules | Prevents silently expanding scope |
| ZW-16 | Interpretation | Identify which source text governs star meanings, combinations, brightness states, and interpretive precedence | Keeps calculation separate from interpretation |

No decision above is selected by this document. The table is a requirements register, not a claim that all schools use the same rule.

## 5. Proposed calculation pipeline (architecture only)

1. Validate the user's original birth input and retain its precision / confidence.
2. Resolve local civil time using historical IANA timezone data, without assuming this is the final Zi Wei time convention.
3. Convert the birth date into the selected calendar representation using a named, versioned dataset.
4. Apply the selected school's leap-month, day-boundary, and time policies.
5. Derive 命宫 / 身宫.
6. Derive 五行局.
7. Place 紫微 and derive the related main-star sequence.
8. Place explicitly enumerated auxiliary / miscellaneous stars.
9. Derive the twelve palaces and any selected 四化 / 大限 / 流年 layers.
10. Emit an auditable chart with intermediate values, rule IDs, source references, warnings, and uncertainty.

The order above is a dependency outline only. It does not prescribe formula details or assert that every school follows an identical sequence.

## 6. Canonical output and audit requirements

A future chart result must carry engine ID and semantic version; ruleset ID, version, and school; exact text editions / source records used; calendar conversion dataset, version, checksum, and license; original birth input and normalized time context; each intermediate value needed to reproduce the chart; per-rule identifiers and provenance; warnings for approximate, ambiguous, missing, or manually corrected input; and a deterministic input digest.

Do not persist or expose a “complete” chart if required inputs or rule decisions are unresolved. An incomplete chart may be offered only as an explicitly partial result with the missing dependencies named.

## 7. Release gates

A Zi Wei ruleset may progress through:
- **draft:** decisions and source register are being assembled.
- **reviewed:** a coherent school profile has been selected and source passages have been checked.
- **validated:** domain review is recorded and golden fixtures cover all supported placements and boundaries.
- **released:** implementation, reproducibility, licensing, and regression gates pass.

Code tests prove implementation consistency, not historical authenticity or doctrinal correctness. A validator returning a candidate state must never itself approve a ruleset.

Minimum golden fixtures before validation:
- all supported lunar months and leap-month cases;
- every birth-hour branch and both sides of each time boundary;
- month / year rollover and leap-year cases;
- all 命宫 / 身宫 positions;
- every 五行局;
- every 紫微 placement index and derived main-star sequence;
- every supported auxiliary star formula;
- all supported 四化 mappings;
- 大限 start / direction boundaries;
- at least one independently reviewed reference chart per supported school profile.

## 8. Explicit non-goals for V0.1

- No automatic choice of a “correct” Zi Wei school.
- No conversion of BaZi AST or BaZi day-pillar logic into Zi Wei.
- No hard-coded leap-month convention.
- No unreferenced star-placement formulas.
- No interpretation engine or auspicious / inauspicious scoring.
- No use of software-generated charts as sole ground truth.
- No claim of scientific predictive validity.

## 9. Current status

| Area | Status |
|---|---|
| Historical source review | Initial research only |
| Exact primary edition / facsimile selected | Pending |
| School profile selected | Pending |
| Calendar / leap-month policy | Pending |
| 命宫 / 身宫 formulas | Pending |
| 五行局 and star placement | Pending |
| 四化 / 大限 conventions | Pending |
| Golden reference charts | None approved |
| Production chart calculation | Disabled |

## 10. Research references

- Liao, Wei-Juin (2020), Fo Guang University master's thesis bibliographic record, hosted by the Buddhist Digital Library, NTU: https://dlbs.liberal.ntu.edu.tw/DLMBS/jp/search/search_detail.jsp?seq=595725
- Zi Wei Dou Shu Quan Shu text discovery page (modern transcription; verify against a facsimile before rule approval): https://shixingji.club/public/ziweidoushuquanshu
- Xin Ke Zuan Ji Zi Wei Dou Shu Jie Lan text discovery page (modern transcription / edition description; verify catalogue and facsimile): https://shixingji.club/public/ziweidoushujielan
- The above online text repositories are research entry points, not substitutes for edition-level verification.
