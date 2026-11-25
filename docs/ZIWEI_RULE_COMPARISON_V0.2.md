# Zi Wei Dou Shu Rule Extraction & Textual Comparison V0.2

**Status:** Secondary-source-assisted extraction dossier. All extracted rules are provisional candidates; no school profile is approved and no chart calculation is enabled.
**Research date:** 2026-11-25
**Scope:** Compare the commonly used 十四主星 system with the separate 十八飛星 material, and identify exact verification work before implementation.

> **重要声明 / Important:** This document is not a ruleset selection. Formula summaries below are extracted from a modern technical research page that cites and compares transcriptions, facsimiles, and a Korean manuscript. Its own stated limitations are retained. A rule is not approved merely because a modern page gives a formula or reports internal consistency.

## 1. Material correction to the source register

The prior register used wording that could imply that the National Archives of Japan catalogue and the accessible online facsimile are the same access object. The distinction is:

- The National Archives of Japan catalog record for 《新鋟希夷陳先生紫微斗数全書》 confirms a Ming printed item, request number 子060-0001, two booklets and seven volumes, and catalogued attributions to 陳搏（宋） as selector and 潘希尹（明） as reviser.
- The catalogue record is publicly discoverable. Its image viewer currently labels access as limited to on-site viewing. A modern digital library separately states that it has reproduced 266 images from the same catalogue item and provides image-level provenance and checksums. These access claims should not be collapsed: the catalogue metadata, the official viewer, and the third-party image mirror are distinct records.
- For 《新刻纂集紫微斗數捷覽》, a book-collector discussion reports that the original print is not openly available as a complete digital facsimile and distinguishes modern punctuated editions / facsimile editions. This is a discovery lead, not definitive catalogue evidence. The exact 1581 witness and the facsimile / collation history remain to be independently confirmed.

Sources:
- National Archives of Japan catalogue: https://www.digital.archives.go.jp/file/1078787
- National Archives viewer: https://www.digital.archives.go.jp/img/1078787
- Third-party image mirror and provenance statement: https://sndmp.com/library/quanshu/scan
- Discussion about locating the 1581 《捷覽》 witness: https://www.shuge.org/meet/topic/22543/

## 2. The two systems must remain separate

A modern technical study distinguishes:
- **十四主星派:** the system represented by 《紫微斗數全書》, using 五行局 and birth day to place 紫微, then deriving the fourteen principal stars.
- **十八飛星派:** the three-volume 《紫微斗數》 in the 1607 《續道藏》, using a different star group and different 命宮 / 身宮 procedures.

The study explicitly finds that these are separate systems, not merely earlier and later stages of one algorithm. It also notes that shared star names do not imply shared placement rules.

**Engineering decision:** the current Zi Wei engine boundary remains a neutral engine contract. Do not merge the two star-placement systems into one default implementation. If both are ever supported, represent them as separate, versioned school profiles / calculation modes.

Reference: https://lhttjdr.github.io/calendar/docs/folk/ziwei

## 3. Provisional extraction — 《紫微斗數全書》 / 十四主星

The following is a rule extraction from the modern technical study's reading of 《全書》卷二 and related manuscript comparison. It is not yet independently verified against every original printed leaf.

### 3.1 命宮 / 身宮

Reported source passage: 《全書》卷二「安身命例」.

- Start from 寅 as the first lunar month; count forward to the birth month.
- From that month palace, count the birth double-hour backward for 命宮 and forward for 身宮.
- The study expresses this as (all palace arithmetic modulo 12):
  - 命宮 = 寅 + (lunarMonth - 1) - hourIndex
  - 身宮 = 寅 + (lunarMonth - 1) + hourIndex
- The study notes 子時 and 午時 result in 命宮 and 身宮 at the same palace.

**Unresolved:** the selected calendar's treatment of leap month, the definition of the birth hour when time is approximate or near a boundary, and whether the formula is identical across all editions.

### 3.2 闰月

The study quotes the 《全書》 text as directing a leap-month birth to use the following month for 命宮 / 身宮 calculation, including leap first month treated as second month.

The same study records alternative modern conventions (use the original month; or split at the 15th / 16th day) as lacking a verified original source in the materials it checked.

**Candidate only:** use the following month if and only if the selected profile is explicitly based on the cited 《全書》 reading and the original passage is verified. Do not silently treat modern split-month practice as equivalent.

### 3.3 十二宮

The study reports the palace order, laid out backward from 命宮:
命宮 → 兄弟 → 夫妻（the text's historical label is 妻妾）→ 子女 → 財帛 → 疾厄 → 遷移 → 奴僕 → 官祿 → 田宅 → 福德 → 父母.

A Korean manuscript comparison is reported to preserve the order but show variants such as 相貌 / 子息.

**Unresolved:** confirm exact words and ordering against the chosen edition, and define modern UI labels separately from historical source labels.

### 3.4 五行局

The reported process is:
1. Use 五虎遁 to derive the heavenly stem of the 命宮 from the birth-year stem.
2. Combine that stem with the 命宮 earthly branch.
3. Look up the 纳音 element of the 命宮 ganzhi.
4. Map 纳音 to bureau:
   - 水二局
   - 木三局
   - 金四局
   - 土五局
   - 火六局

The study cites the example: a 甲-year birth with 命宮 in 寅 has 丙寅 as the 命宮 ganzhi; 丙寅納音 is 爐中火, therefore 火六局.

**Unresolved:** independently validate the complete 60-pair 纳音 table and all five bureau outputs against the selected textual edition. The reason for the numerical labels 2–6 is not explained in the cited text.

### 3.5 紫微 placement

The study extracts an algorithm from the five bureau charts:
1. Divide the lunar birth day by the bureau number.
2. If not divisible, add the smallest positive number of days required to make it divisible.
3. Count the quotient from 寅 (quotient 1 at 寅, quotient 2 at 卯, etc.).
4. If the number of borrowed days is odd, move backward by that many palaces; if even, move forward by that many palaces.

The study reports comparing all 150 cells (five bureaus × 30 days) with the transcription: 147 match and three appear to be transcription omissions / corruptions.

**Critical gate:** do not implement the inferred arithmetic as authoritative until the original five placement diagrams are transcribed from a page-identifiable witness and all 150 entries are independently reconciled. The three reported discrepancies must be resolved from the scan, not silently corrected by code.

### 3.6 天府 and fourteen principal stars

The study reports:
- 天府 is placed symmetrically relative to 紫微 around the 寅申 axis.
- The other thirteen principal stars follow two sequences:
  - 紫微 group, stepping backward from 紫微 with specified gaps.
  - 天府 group, stepping forward from 天府 with specified gaps.
- The study reports checking 41 same-palace statements in the star descriptions against the derived 12 configurations, all consistent.

**Critical gate:** the offsets and gaps are candidate extracted data. They must be compared against the diagrams and original text, with explicit tests for all 12 紫微 placements.

### 3.7 Auxiliary and malefic stars

The study lists candidate source dependencies, including:
- 文昌 / 文曲 — birth hour.
- 左辅 / 右弼 — birth month.
- 天魁 / 天鉞, 祿存 — birth-year stem.
- 擎羊 / 陀羅 — relative to 祿存.
- 天马 — birth-year branch.
- 火星 / 鈴星 — year-group starting palace plus hour count.
- 地劫 / 天空 — hour.
- 天傷 / 天使 — 命宮.
- 天刑 / 天姚 — month.
- 三台 / 八座 — month and day.
- 天哭 / 天虛, 龍池 / 鳳閣 — year or hour, depending on star.
- 台輔 / 封誥 — hour.
- 紅鸞 / 天喜 — year branch.

The study explicitly flags at least one incompletely specified rule: the text gives the starting palace for 火星 / 鈴星 but does not explicitly state whether the hour count proceeds forward or backward. A modern convention must not be silently attributed to the source.

**Implementation boundary:** every star needs its own rule ID, source passage, input dependencies, direction, index convention, and boundary tests. No generic auxiliary-star formula.

### 3.8 生年四化

The study transcribes a ten-stem table for 化祿、化權、化科、化忌 from 《全書》卷二. It also identifies disagreements for at least 庚年 and 壬年 when compared with a Korean manuscript and modern practice.

Therefore:
- the table in the chosen edition must be stored as a named, versioned policy;
- the 庚、壬 variants must be recorded explicitly;
- no modern blended table should replace the textual reading without user approval.

### 3.9 大限、小限、流年

The study's 《全書》 extraction reports:
- 大限 starts at 命宮, uses 五行局 number as starting age (e.g. 水二局 begins at age two), then advances one palace per ten years.
- Direction depends on 陽男 / 陰女 versus 陰男 / 陽女.
- 小限 uses a separate sex and year-branch rule.
- 流年 introduces annual transformations / auxiliary stars and 斗君 rules.

**Unresolved:** exact age-count convention (虚岁 / 周岁), inclusive endpoints, calendar-year rollover, and whether the user wants 大限, 小限 and 流年 in the initial release. These must not be inferred from BaZi Da Yun conventions.

## 4. Variant ledger — differences that cannot be silently normalized

| Domain | Reported variants / textual issue | Required decision |
|---|---|---|
| Leap month | Following month; original month; split at day 15/16 | Name exact source and policy |
| 丙丁年天鉞 | 酉 vs 戌 | Inspect 《全書》 and manuscript witness |
| 辛年魁鉞 | 魁午鉞寅 vs reverse ordering | Resolve text and rule order |
| 庚年四化 | 化科太陰 vs 化科天府 in modern practice | Select text-specific mapping |
| 壬年四化 | 化科天府 vs 化科左輔 | Select text-specific mapping |
| 長生十二神 | Male-forward / female-reverse vs 陽男陰女-forward | Keep as separate policies |
| 巳酉丑火鈴 | 火卯鈴戌 vs 火戌鈴卯 | Inspect original sequence |
| 身主 | 辰戌文昌 vs 文曲 in manuscript | Resolve source variant |
| 廟旺 | table vs star-by-star prose vs Korean manuscript table | Do not select until original chart is inspected |

The modern study reports 69 comparisons between the 《全書》 廟旺 table and prose, with 27 discrepancies. This is a major release blocker for any feature that displays brightness states or relies on them in interpretation.

## 5. Eighteen Flying Stars — separate profile only

The study's extraction of the 1607 《續道藏》 material reports a distinct system:
- A twelve-star 紫微 group is placed by birth year from 未, then distributed in reverse.
- A 杖 group and several additional stars are placed from birth month / hour / year.
- 命宮 is derived from the 天杖 palace and birth hour, counting to 卯.
- 身宮 uses a different day-based rule: two and a half days per palace, with explicit 午 / 未 boundary handling on specified dates.
- The source's sexagenary-stem polarity statement appears reversed relative to the usual convention; the study preserves the printed reading rather than normalizing it.
- Its twelve-palace names and 运限 procedures differ from the 十四主星 system.

**Engineering decision:** do not add these formulas to the 十四主星 implementation. If supported later, create a separate 十八飛星 profile and its own test fixtures.

## 6. Source quality and access status

| Evidence object | What is currently supported | What is not yet supported |
|---|---|---|
| National Archives of Japan catalogue | Ming print metadata, title, request number, two booklets / seven volumes, attributed selector and reviser | Attribution authenticity; full page-level transcription |
| National Archives image viewer | Viewer record exists; current page indicates on-site viewing limitation | General public downloadable access |
| Third-party 266-image mirror | Claims images derive from the National Archives item and provides source / checksum metadata | Independent confirmation that every image is complete and unaltered |
| Three-volume electronic transcription | Provides searchable text and chapter structure | Exact correspondence to the seven-volume Ming print |
| Modern technical study | Provides explicit formula extraction, variant ledger and internal consistency tests | Independent primary-source proof; it cites some transcriptions whose base edition is unspecified |
| 1581 《捷覽》 discussion / modern editions | Leads for locating the printed witness and editorial history | Definitive proof of the exact surviving copy, collation, and page-level rules |

## 7. Proposed verification protocol

For each rule:
1. Capture the original printed page / folio or a complete facsimile image.
2. Record the source ID, edition, volume, original folio, and image checksum.
3. Transcribe the complete passage, preserving original characters and line breaks.
4. Produce a normalized reading separately; never overwrite the transcription.
5. Compare at least one independent manuscript / edition where available.
6. Extract the rule as pseudocode and identify every input and boundary.
7. Create fixtures from explicit worked examples in the source.
8. Independently derive additional fixtures and test all finite states (for example all 150 紫微 bureau/day cells).
9. Record unresolved variants and ask for explicit profile selection.
10. Only after domain review, mark the policy selected; only after golden fixtures pass, consider enabling calculation.

## 8. Current recommendation (not a decision)

The most practical first candidate for a mainstream chart engine is a **named 十四主星 / 《紫微斗數全書》-based profile**, because its reported procedures cover 命身宮, 五行局, 紫微 / 天府, fourteen principal stars, auxiliary stars, 四化 and 大限. This is a scope recommendation only, not a claim that the source is historically definitive or that the user has selected it.

The 1607 十八飛星 material should remain a separately documented comparative system. 《捷覽》 should remain a parallel source for textual history and rule comparison until its original witness and collation are confirmed.

## 9. Release status

- School selected: **No**
- Source edition fully collated: **No**
- 命身宮 approved: **No**
- 五行局 / 紫微 placement approved: **No**
- Main / auxiliary star rules approved: **No**
- 四化 variants resolved: **No**
- 廟旺 discrepancies resolved: **No**
- 大限 / 小限 / 流年 approved: **No**
- Chart calculation enabled: **No**

## References

1. Technical research and rule comparison, “紫微斗数”, https://lhttjdr.github.io/calendar/docs/folk/ziwei
2. National Archives of Japan catalogue, https://www.digital.archives.go.jp/file/1078787
3. National Archives of Japan viewer, https://www.digital.archives.go.jp/img/1078787
4. Third-party source / facsimile mirror, https://sndmp.com/library/quanshu/scan
5. 《紫微斗數全書》 electronic text and edition distinction, https://sndmp.com/library/quanshu
6. 《捷覽》 edition discussion, https://www.shuge.org/meet/topic/22543/
7. Research baseline, [ZIWEI_RULESET_RESEARCH_V0.1.md](ZIWEI_RULESET_RESEARCH_V0.1.md)
8. Source register, [ZIWEI_SOURCE_REGISTER_V0.1.md](ZIWEI_SOURCE_REGISTER_V0.1.md)
