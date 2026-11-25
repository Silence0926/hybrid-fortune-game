# Zi Wei Dou Shu Source Register & Textual Comparison V0.1

**Status:** Research register — source discovery and metadata comparison only. No school selected and no charting rule approved.
**Research date:** 2026-11-25

## 1. Research conclusion

The materials currently identified should be treated as at least three distinct textual objects, not merged into one generic “classical Zi Wei” ruleset:

1. **《新刻纂集紫微斗数捷览》** — a Ming Wanli 9 (1581) edition is described in modern catalog/transcription records. Its chapter structure includes explicit procedures for 命宫 / 身宫, 五行局, 紫微 / 天府 placement, 四化, auxiliary stars, and 大限. The online transcription is useful for locating candidate passages, but it is not a substitute for checking the original printed leaves.
2. **《紫微斗数全书》 / 《新鋟希夷陳先生紫微斗数全書》** — the National Archives of Japan catalog identifies a Ming printed, seven-volume, two-booklet item (request number 子060-0001). A separate research library describes a Nanyangtang seven-volume facsimile with 266 images. The relationship between the cataloged copy, the facsimile, and modern transcriptions must be recorded precisely rather than assumed.
3. **《續道藏》所收《紫微斗數》三卷** — a distinct 1607 Wanli 35 imperial edition, represented in National Library of China scan metadata as volumes 167–169. Scholarly discussion identifies its content as the 十八飛星 form and distinguishes it from the later/common 十四主星 charting system. It must remain a separate corpus unless a specific comparative study demonstrates a narrower relationship.

The current evidence therefore does **not** justify treating the three works as successive editions of one identical algorithm. The research baseline's rule against silently merging textual families remains necessary.

## 2. Source register

| Source ID | Work / record | Evidence class | What it establishes | Limitations / next verification |
|---|---|---|---|---|
| `zw-src-jielan-catalog-1581` | 《新刻纂集紫微斗数捷览》, described as a Ming Wanli 9 (1581) Jinling Wang Luochuan imprint, four volumes / four booklets | Modern bibliographic description of a primary edition | Gives a specific edition claim, imprint context, and a lead to the rare printed witness | Description is mediated through a modern research catalog; the original leaves and colophon must be inspected before treating date, imprint, and copy history as verified |
| `zw-src-jielan-tianji-transcription` | Tianji digital transcription of 《新刻纂集紫微斗数捷览》, 246 chapters | Modern transcription / discovery aid | Exposes candidate passages and chapter locations for 安身命诀 (ch.14), 定五行局诀 (ch.17), 安紫微天府诀 (ch.20), 四化诀 (ch.23), 定大限诀 (ch.51), and star-placement rules | Page states text is transcribed, but does not identify a facsimile page/leaf for each passage; not an independent witness and not sufficient as sole implementation authority |
| `zw-src-quanshu-na-japan-archives` | National Archives of Japan, 「新鋟希夷陳先生紫微斗数全書」, request no. 子060-0001 | Primary-edition catalog record | Catalog metadata: Ming printed edition, two booklets, seven volumes; attributed selector Chen Bo (宋) and reviser Pan Xiyin (明); record lists public use | Image viewer and item access conditions need separate confirmation; attribution metadata is not proof of authorship |
| `zw-src-quanshu-nanyangtang-facsimile-description` | Nanyangtang Ming-print facsimile description, seven volumes / 266 images | Modern facsimile description | Provides a route for page-level comparison against the Ming printed witness | Confirm that its photographed copy is exactly the National Archives item before treating the records as one physical witness; facsimile transcription and punctuation remain editorial |
| `zw-src-xudaozang-nlc-167` | 《續道藏》, volume 167, 「卷之一 紫微鬥數」, Ming Wanli 35 (1607), National Library of China scan metadata | Primary facsimile metadata | Identifies first volume of the three-volume 《紫微斗數》 item and gives collection / edition metadata | Need inspect printed leaves, not just Commons metadata; record exact folio references before quoting rules |
| `zw-src-xudaozang-nlc-168` | 《續道藏》, volume 168, 「卷之二 紫微鬥數」, Ming Wanli 35 (1607), National Library of China scan metadata | Primary facsimile metadata | Identifies second volume of the same three-volume item | Same verification requirement |
| `zw-src-xudaozang-nlc-169` | 《續道藏》, volume 169, 「卷之三 紫微鬥數」, Ming Wanli 35 (1607), National Library of China scan metadata | Primary facsimile metadata | Identifies third volume of the same three-volume item | Same verification requirement |
| `zw-src-yuntech-zhao-yiwu-2021` | 趙翊吾, 〈紫微斗數之起源與發展〉, 《雲科漢學學刊》第二十二期, 2021 | Scholarly secondary study | Discusses the 1581 《捷覽》, 1607 《續道藏》, and the distinction between the latter's 十八飛星 material and modern/common Zi Wei charting | Secondary argument; inspect the author's references and source handling. Do not convert its broad historical hypotheses into settled facts |
| `zw-src-foguang-liao-2020` | 廖維駿, 2020 master's thesis on Buddhist / Daoist / Yi-ology influence and 《紫微斗數全書》 textual history | Scholarly secondary study / thesis record | Provides a separate academic research route into textual history and lineage debates | The catalog abstract is not the full thesis; retrieve and assess the complete thesis before relying on specific claims |

## 3. Candidate rule-passage map — 《捷覽》 transcription only

The following chapter map is a **research locator**, not a rules approval:

| Domain | Digital chapter / passage | Research question |
|---|---|---|
| 命宫 / 身宫 | 卷一·第14章《安身命诀》 | Verify month indexing, hour counting, reverse/forward direction, and boundary cases against the printed page |
| 五行局 | 卷一·第17章《定五行局诀》 and following 《定五局例》 / 《定五局长生例》 | Determine whether the text uses 命宫干支纳音 and exactly how each bureau is assigned |
| 紫微 / 天府 | 卷一·第20章《安紫微天府诀》 and following 《安紫府图》 | Transcribe the complete bureau/day mapping tables; prose alone is insufficient |
| Main / auxiliary stars | 卷一·第22章《布南北二斗诸星诀》 and chapters 24 onward | Enumerate stars and placement dependencies; compare text, diagrams, and examples |
| 四化 | 卷一·第23章《安禄权科忌四化诀》 | Preserve the complete ten-stem mapping and verify variants against the printed witness |
| 大限 | 卷一·第51章《定大限诀》 | Verify direction, bureau-based starting age, ten-year palace progression, and age boundary convention |
| 小限 / 流年斗君 | Chapters 52–53 | Decide whether these layers belong in product V1; do not include them by assumption |

Important: the chapter numbers above refer to the modern Tianji transcription's 246-chapter navigation, not original printed foliation. A later source record must include the original volume and leaf/page.

## 4. Preliminary comparison and non-equivalence warnings

### 4.1 《捷览》 and 《全书》

The 《捷览》 transcription contains a compact, explicit procedural sequence. The 《全书》 source family has a separate seven-volume printed witness with its own volume structure and contents. The 《全书》 research library currently exposes a three-volume electronic text range and separately describes a seven-volume facsimile. These are not interchangeable evidence objects.

The next comparison must align passages by topic (for example 安身命, 五行局, 安紫微天府, 四化, 大限), then record:
- exact wording and variant characters;
- whether a diagram/table is present or omitted;
- sequence and dependency differences;
- additions or omissions;
- volume and original leaf references;
- whether a modern editor has combined passages from multiple works.

### 4.2 《續道藏》 and the mainstream 十四主星 chart

The 1607 《續道藏》 three-volume item is separately cataloged and has National Library of China scan metadata. The Yuntech study describes its content as 十八飛星 and notes differences in star names and charting procedure from the modern/common Zi Wei system. Therefore it is a comparison corpus, not a default ruleset source for the mainstream engine.

### 4.3 Author attribution

Traditional title-page attributions to 陳希夷 / 陳摶 and 白玉蟾 must be preserved as textual attributions, not stated as verified authorship. The currently available catalog and research material do not justify asserting that the extant printed texts were directly authored by those historical figures.

### 4.4 Date handling

The bibliographic material identifies Wanli 9 as 1581 and Wanli 35 as 1607. A secondary web result elsewhere gave 1617 for Wanli 35; that conflicts with the era-year conversion and the National Library scan metadata. The project records 1607 as the current candidate date but retains the need to verify the original edition's colophon and catalog provenance.

## 5. Evidence status and next actions

1. Obtain and inspect the original 《捷覽》 printed witness or a complete, page-identifiable facsimile.
2. Confirm whether the Nanyangtang facsimile description refers to the exact National Archives cataloged 《全書》 copy.
3. Inspect the three National Library of China 《續道藏》 volumes and capture original folio references for passages used in comparison.
4. Retrieve the full Yuntech article and Fo Guang thesis; record author, title, publication metadata, references, and methodological limitations.
5. Build a passage-by-passage comparison table before proposing any candidate school profile.
6. Ask the project owner to approve a school/profile only after presenting the comparison and explicit consequences for calendar, leap-month, time, star placement, transformations, and limits.
7. Only then create golden chart fixtures and implement a calculation pipeline.

## 6. Research links

- National Archives of Japan catalog record, 《新鋟希夷陳先生紫微斗数全書》: https://www.digital.archives.go.jp/file/1078787
- National Archives of Japan item viewer / record: https://www.digital.archives.go.jp/img/4468520
- Nanyangtang facsimile / edition description: https://changxianyi.com/guji/ziwei/
- 《捷覽》 transcription and chapter index: https://www.tianjihq.com/zh-CN/learn/books/ziwei-jielan
- 《捷覽》 edition description and editorial history: https://qiankunyoushu.com/library/ziwei-doushu-jielan
- National Library of China scan metadata, 《續道藏》 volume 167: https://commons.wikimedia.org/wiki/File:NLC892-411999007380-139580_%E7%BA%8C%E9%81%93%E8%97%8F_%E7%AC%AC167%E5%86%8A.pdf
- National Library of China scan metadata, 《續道藏》 volume 168: https://commons.wikimedia.org/wiki/File:NLC892-411999007380-139581_%E7%BA%8C%E9%81%93%E8%97%8F_%E7%AC%AC168%E5%86%8A.pdf
- National Library of China scan metadata, 《續道藏》 volume 169: https://commons.wikimedia.org/wiki/File:NLC892-411999007380-139582_%E7%BA%8C%E9%81%93%E8%97%8F_%E7%AC%AC169%E5%86%8A.pdf
- 趙翊吾, 〈紫微斗數之起源與發展〉, 《雲科漢學學刊》第二十二期: https://ghc.yuntech.edu.tw/images/Journal/Journal22.pdf
- 廖維駿 (2020) thesis catalog record: https://dlbs.liberal.ntu.edu.tw/DLMBS/jp/search/search_detail.jsp?seq=595725

## 7. Current decision

**No school selected. No rule approved. No calculation enabled.** This register narrows the source search and identifies candidate passages; it does not authorize implementation.


## 8. Access and collation clarification (2026-11-25)

The access status of the 《全書》 witness must be described at three separate levels:

1. **Catalogue metadata:** the National Archives of Japan record is publicly discoverable and identifies request number 子060-0001, two booklets, seven volumes, and its catalogued attributions.
2. **Official image viewer:** the official viewer currently displays an on-site viewing restriction. Public catalogue metadata does not imply that the official page images are downloadable by every remote visitor.
3. **Third-party image mirror:** a modern research site states that it has reproduced 266 images from the same National Archives item and supplies image provenance / checksum information. This is a distinct secondary access route; its completeness and image integrity still require independent verification.

The three-volume searchable electronic text is also a separate object. Its host explicitly says that it is not the complete collation of the seven-volume Ming print and that its arrangement differs from the original image set.

For 《捷覽》, a book-collector discussion reports uncertainty about public access to a complete original facsimile and distinguishes punctuated editions from the printed witness. Treat this as a research lead only. The 1581 edition's physical witness, complete foliation, and collation must be confirmed from a library or publisher catalogue and inspectable images.

A detailed provisional rule extraction and variant ledger is now in [ZIWEI_RULE_COMPARISON_V0.2.md](ZIWEI_RULE_COMPARISON_V0.2.md). It records the exact boundary between reported textual rules, modern reconstruction, and unresolved evidence. None of its extracted formulas is approved for production.

## 9. IIIF access identifiers and image-rights metadata (2026-11-25)

The facsimile reader now exposes the official archive IIIF manifest endpoints for the two booklets:

- Upper booklet manifest: https://www.digital.archives.go.jp/api/iiif/4468520/manifest.json
- Lower booklet manifest: https://www.digital.archives.go.jp/api/iiif/4469314/manifest.json
- Upper booklet official viewer: https://www.digital.archives.go.jp/img/4468520
- The reader identifies the upper booklet as 129 image-sequence pages and the complete set as 266 images. The sequence number is an archive digital-image sequence, not an original folio number.
- The first image in the upper-booklet sequence is the outer cover/title label, not a rule-bearing text leaf. It is therefore not a valid mapping target for the 《安身命例》 passage.

The facsimile reader states that the archive supplies 2000-pixel IIIF thumbnails and links to 6300-pixel official originals. It also states that the archive permits copying, adaptation, and redistribution, including commercial use, provided that the collection, data name, request number, and official link are retained. The reader records image dimensions, file sizes, official source links, and SHA-256 values. These are statements made by the mirror's access page; the underlying official secondary-use terms and per-image checksums should still be independently captured before production asset ingestion.

**Important implementation boundary:** the IIIF manifest IDs provide a stable route to the archive's digital object metadata and page sequence. They do not by themselves establish the original printed foliation or align an image to the Wikisource electronic text. Page-level passage mapping remains pending until the relevant canvas/image and printed leaf are visually identified and recorded.

The web research tool could open the manifest endpoints as JSON resources but did not expose their full one-line JSON payload for extraction. No page-to-passage mapping has therefore been claimed in this update.

## 10. Machine-readable evidence registry

The research records are now also represented in `packages/engines-ziwei/src/research-sources.ts` and exported from the Zi Wei package. The registry separates:

- archive catalogue metadata;
- archive IIIF manifests;
- digital facsimiles and facsimile descriptions;
- electronic transcriptions;
- scholarly secondary studies.

Each record carries a `lineageId`. Records sharing a lineage are related evidence objects and must not be counted as independent witnesses. In particular, the upper/lower IIIF manifests and the mirror are grouped with the same National Archives physical item; the three 《續道藏》 volume records are grouped as one corpus; and the Wikisource electronic transcription remains a separate derivative text lineage.

This registry is a research inventory, not a selected ruleset source list. It deliberately does not nominate a default school, approve any placement formula, or enable chart calculation.

## 11. Verification depth is explicit

Each machine-readable source record now has a `verificationStatus`:

- `discovery_only`: a lead has been identified, but its metadata/content has not been sufficiently inspected.
- `metadata_recorded`: catalogue or bibliographic metadata has been inspected; the underlying text is not thereby verified.
- `url_accessible`: the endpoint has been reached, but its full payload or underlying image content has not been independently inspected.
- `content_inspected`: the relevant web text or facsimile-reader content has been inspected, but not collated against a printed leaf.
- `page_collated`: a specific passage has been visually matched to a specific facsimile image/printed leaf and recorded with reproducible identifiers.

No current source is marked `page_collated`. The IIIF manifests are marked only `url_accessible`, because their JSON endpoints can be reached but their complete one-line payloads were not available for reliable extraction in the current research interface. The Wikisource transcription and the mirror reader are marked `content_inspected`, not as primary-edition verification.

This distinction prevents an accessible URL, a catalogue description, or a derivative transcription from being mistaken for a page-level primary-source collation.

## 12. IIIF manifest indexing utility

A format-only adapter is now available at `packages/engines-ziwei/src/iiif-manifest.ts`.

It accepts IIIF Presentation API v2 and v3 JSON and extracts:

- manifest identifier and label;
- presentation API version;
- ordered canvas identifiers, digital labels, and dimensions;
- image resource identifiers, dimensions, formats, and Image API service identifiers.

The adapter intentionally preserves the canvas sequence exactly as supplied. It does **not** infer original folio numbers, recto/verso order, chapter boundaries, or rule passages. Those require visual collation and a separate reviewed mapping record.

Synthetic tests cover v2 and v3 shapes, multiple image bodies, canvases without recognized image annotations, and malformed/unsupported manifests. These tests validate the parser contract only; they do not claim that the National Archives manifests have been fully extracted or that any page has been matched to the electronic transcription.
