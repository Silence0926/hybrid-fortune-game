/**
 * Contemporary Taiping calendar primary-source candidate (1861).
 *
 * A digitized NYPL copy of the 1861 Taiping calendar has been located.
 * The NYPL catalogue describes the item as issued in 1861, likely Nanjing,
 * with 24 pages in traditional double-leaf format. Its physical description
 * says month labels appear at the top, the year in the middle, and page
 * numbers below. The British Library shelfmark 15297.d.33 independently
 * identifies a Taiping Calendar for 1861 with the same title.
 *
 * The item-level record and digitized cover/image record are not equivalent
 * to collation of the daily-calendar leaf. The target 1861-11-11 cell has
 * not yet been read from an original calendar page. No day-cycle evidence
 * or production gate credit is awarded at this stage.
 */
export const TAIPING_1861_PRIMARY_SOURCE_CANDIDATE = {
  title: "太平天國辛酉拾壹年新曆頒行天下",
  alternateTitle: "太平天國辛酉拾壹年新曆",
  publication: {
    year: 1861,
    place: "Nanjing",
    placeQualifier: "catalogue_uncertain",
    publisher: null
  },
  physicalDescription: {
    extent: "2, 2, 7, 24 p.",
    format: "traditional_double_leaf",
    heightCm: 23,
    layout: {
      linesPerPage: 8,
      monthLabel: "top",
      yearLabel: "middle",
      pageNumber: "bottom"
    }
  },
  nypl: {
    institution: "New York Public Library",
    division: "Rare Book Division",
    shelfmark: "*OVQ 09-87",
    itemUrl: "https://old-digitalcollections.nypl.org/items/6d7f2f1d-b7e1-ae9f-e040-e00a180648de",
    imageId: "1707705",
    uuid: "908e8c40-004e-0130-f94b-58d385a7bc34",
    digitizedOn: "2015",
    rightsStatement: "NYPL public domain statement; territorial copyright status must be checked for reuse"
  },
  britishLibrary: {
    institution: "British Library",
    shelfmark: "15297.d.33",
    catalogueTitle: "Taiping Calendar for 1861",
    catalogueRecordUrl: "https://rbook.ncl.edu.tw/NCLSearch/Search/SearchDetail",
    crossIdentificationStatus: "matching_title_and_year_catalogue_candidate"
  },
  targetCheck: {
    civilDate: "1861-11-11",
    expectedGanzhiCandidate: "甲子",
    originalLeafIdentified: false,
    originalCellTranscribed: false,
    pageCollationStatus: "not_started",
    note: "Do not treat the expected Ganzhi candidate as confirmed until the original leaf and date mapping are read directly."
  },
  assessment: {
    sourceClass: "contemporary_primary_calendar_candidate",
    itemLevelIdentity: "catalogued_and_digitized",
    dailyContentVerification: "pending_original_leaf_collation",
    independentDayCycleGateCredit: false,
    productionImpact: "none",
    accessedOn: "2026-11-26"
  },
  sources: [
    {
      id: "nypl-1861-taiping-calendar",
      title: "NYPL Digital Collections, Tai ping tian guo xin you shi yi nian xin li ban xing tian xia",
      url: "https://old-digitalcollections.nypl.org/items/6d7f2f1d-b7e1-ae9f-e040-e00a180648de",
      role: "digitized_item_catalogue_and_image_record"
    },
    {
      id: "ncl-union-catalogue-bl-15297-d-33",
      title: "National Central Library Chinese Rare Books Union Catalogue, record for 太平天國辛酉拾壹年新曆",
      url: "https://rbook.ncl.edu.tw/NCLSearch/Search/SearchDetail?HasImage=&SourceID=1&item=ea1c338af53b4760ae8356da69f4dedbfDczMjU0Mw2.bBlZTruLva8_oBoZpWGYOsEbXQ73KjTvsKq65m5zUpI_&page=6808",
      role: "british_library_holding_and_shelfmark_catalogue_record"
    }
  ]
} as const;
