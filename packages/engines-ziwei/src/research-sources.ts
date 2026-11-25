import type { ZiWeiSourceRecord } from "./ruleset.js";

/**
 * Research sources are registered as evidence objects, not as approved rule
 * authorities. lineageId groups records that must not be counted as
 * independent witnesses without manual provenance review.
 */
export const ZIWEI_RESEARCH_SOURCES: ZiWeiSourceRecord[] = [
  {
    sourceId: "zw-src-jielan-catalog-1581",
    title: "Bibliographic description of 《新刻纂集紫微斗数捷览》",
    sourceKind: "archive_catalog",
    evidenceClass: "catalog_metadata",
    lineageId: "jielan-bibliographic-description",
    url: "https://qiankunyoushu.com/library/ziwei-doushu-jielan",
    accessedOn: "2026-11-25",
    passageNote: "Modern bibliographic description; original printed witness and colophon still require inspection."
  },
  {
    sourceId: "zw-src-jielan-tianji-transcription",
    title: "Tianji digital transcription of 《新刻纂集紫微斗数捷览》",
    sourceKind: "electronic_transcription",
    evidenceClass: "electronic_transcription",
    lineageId: "jielan-tianji-transcription",
    url: "https://www.tianjihq.com/zh-CN/learn/books/ziwei-jielan",
    accessedOn: "2026-11-25",
    passageNote: "Discovery aid for chapter and passage locations; not a verified facsimile transcription."
  },
  {
    sourceId: "zw-src-quanshu-na-japan-archives",
    title: "National Archives of Japan catalogue record for 《新鋟希夷陳先生紫微斗数全書》",
    sourceKind: "archive_catalog",
    evidenceClass: "catalog_metadata",
    lineageId: "quanshu-na-archives-item",
    url: "https://www.digital.archives.go.jp/file/1078787",
    accessedOn: "2026-11-25",
    volume: "Seven volumes in two booklets",
    passageNote: "Request number 子060-0001; catalogued attribution is metadata, not verified authorship."
  },
  {
    sourceId: "zw-src-quanshu-na-upper-iiif",
    title: "National Archives of Japan IIIF manifest — upper booklet",
    sourceKind: "archive_manifest",
    evidenceClass: "technical_manifest",
    lineageId: "quanshu-na-archives-item",
    url: "https://www.digital.archives.go.jp/api/iiif/4468520/manifest.json",
    accessedOn: "2026-11-25",
    volume: "Upper booklet",
    passageNote: "Official digital-object manifest; image sequence identifiers do not establish original foliation."
  },
  {
    sourceId: "zw-src-quanshu-na-lower-iiif",
    title: "National Archives of Japan IIIF manifest — lower booklet",
    sourceKind: "archive_manifest",
    evidenceClass: "technical_manifest",
    lineageId: "quanshu-na-archives-item",
    url: "https://www.digital.archives.go.jp/api/iiif/4469314/manifest.json",
    accessedOn: "2026-11-25",
    volume: "Lower booklet",
    passageNote: "Official digital-object manifest; image sequence identifiers do not establish original foliation."
  },
  {
    sourceId: "zw-src-quanshu-nanyangtang-facsimile-description",
    title: "Nanyangtang description of a seven-volume 《紫微斗數全書》 facsimile",
    sourceKind: "facsimile_description",
    evidenceClass: "modern_secondary",
    lineageId: "quanshu-nanyangtang-witness-unverified",
    url: "https://changxianyi.com/guji/ziwei/",
    accessedOn: "2026-11-25",
    volume: "Seven volumes",
    passageNote: "Relationship to the National Archives physical witness is not independently established."
  },
  {
    sourceId: "zw-src-quanshu-mirror-266-images",
    title: "266-image facsimile reader for the National Archives 《紫微斗數全書》 item",
    sourceKind: "digital_facsimile",
    evidenceClass: "digital_facsimile",
    lineageId: "quanshu-na-archives-item",
    url: "https://sndmp.com/library/quanshu/scan",
    accessedOn: "2026-11-25",
    volume: "Two booklets; 266 digital images",
    passageNote: "Mirror identifies archive provenance and checksums; its image sequence is not original foliation and page-level collation is incomplete."
  },
  {
    sourceId: "zw-src-xudaozang-nlc-167",
    title: "National Library of China scan metadata — 《續道藏》 volume 167",
    sourceKind: "archive_catalog",
    evidenceClass: "catalog_metadata",
    lineageId: "xudaozang-nlc-collection",
    url: "https://commons.wikimedia.org/wiki/File:NLC892-411999007380-139580_%E7%BA%8C%E9%81%93%E8%97%8F_%E7%AC%AC167%E5%86%8A.pdf",
    accessedOn: "2026-11-25",
    volume: "167",
    passageNote: "Metadata for the first volume of a distinct three-volume 十八飛星 corpus."
  },
  {
    sourceId: "zw-src-xudaozang-nlc-168",
    title: "National Library of China scan metadata — 《續道藏》 volume 168",
    sourceKind: "archive_catalog",
    evidenceClass: "catalog_metadata",
    lineageId: "xudaozang-nlc-collection",
    url: "https://commons.wikimedia.org/wiki/File:NLC892-411999007380-139581_%E7%BA%8C%E9%81%93%E8%97%8F_%E7%AC%AC168%E5%86%8A.pdf",
    accessedOn: "2026-11-25",
    volume: "168",
    passageNote: "Metadata for the second volume of a distinct three-volume 十八飛星 corpus."
  },
  {
    sourceId: "zw-src-xudaozang-nlc-169",
    title: "National Library of China scan metadata — 《續道藏》 volume 169",
    sourceKind: "archive_catalog",
    evidenceClass: "catalog_metadata",
    lineageId: "xudaozang-nlc-collection",
    url: "https://commons.wikimedia.org/wiki/File:NLC892-411999007380-139582_%E7%BA%8C%E9%81%93%E8%97%8F_%E7%AC%AC169%E5%86%8A.pdf",
    accessedOn: "2026-11-25",
    volume: "169",
    passageNote: "Metadata for the third volume of a distinct three-volume 十八飛星 corpus."
  },
  {
    sourceId: "zw-src-yuntech-zhao-yiwu-2021",
    title: "趙翊吾, 〈紫微斗數之起源與發展〉, 《雲科漢學學刊》第二十二期",
    sourceKind: "scholarly_study",
    evidenceClass: "scholarly_secondary",
    lineageId: "yuntech-zhao-yiwu-2021",
    url: "https://ghc.yuntech.edu.tw/images/Journal/Journal22.pdf",
    accessedOn: "2026-11-25",
    publicationDate: "2021",
    passageNote: "Secondary historical and textual analysis; claims require inspection of its cited primary sources."
  },
  {
    sourceId: "zw-src-foguang-liao-2020",
    title: "廖維駿, 2020 thesis catalogue record",
    sourceKind: "scholarly_study",
    evidenceClass: "scholarly_secondary",
    lineageId: "foguang-liao-2020-thesis",
    url: "https://dlbs.liberal.ntu.edu.tw/DLMBS/jp/search/search_detail.jsp?seq=595725",
    accessedOn: "2026-11-25",
    publicationDate: "2020",
    passageNote: "Catalogue abstract only; retrieve and assess the full thesis before relying on detailed claims."
  },
  {
    sourceId: "zw-src-quanshu-wikisource-vol2-rev1963110",
    title: "Wikisource fixed revision of 《紫微斗數全書》卷二",
    sourceKind: "electronic_transcription",
    evidenceClass: "electronic_transcription",
    lineageId: "wikisource-quanshu-revision-1963110",
    url: "https://zh.wikisource.org/wiki/紫微斗數全書/卷二",
    accessedOn: "2026-11-25",
    editionLabel: "Fixed revision 1963110",
    volume: "Electronic transcription volume 2",
    passageNote: "Derivative electronic text; base print is unspecified and it is not collated character-by-character against the Ming facsimile."
  }
];
