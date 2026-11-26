/**
 * Contemporary Taiping calendar primary-source candidate (1861).
 *
 * NYPL catalogue metadata identifies a 1861 Taiping calendar and provides
 * unusually useful physical-layout details. Third-party mirrors expose
 * several page images associated with the NYPL item. A visible daily-table
 * fragment contains day numbers, Heavenly Stems, and 28 lunar-mansion names.
 * It does not visibly provide Earthly Branches in the same row. Full Ganzhi
 * pairs previously inferred from the stem sequence must not be represented
 * as direct transcription.
 *
 * The month heading and printed folio for the inspected fragment are not
 * established, and the target month-ten/day-one leaf has not been identified.
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
    pageSizeCm: { width: 10.5, height: 19 },
    printedLayout: {
      linesPerPage: 8,
      border: "single_border",
      fishTail: "single_black_fish_tail",
      mouth: "white_mouth",
      monthLabel: "engraved_at_top",
      yearLabel: "辛酉拾壹年_at_middle",
      pageNumber: "at_bottom",
      proclamationSupplement: {
        title: "天王詔旨",
        printing: "red_and_black",
        lines: 8,
        charactersPerLine: 20
      }
    },
    source: "NYPL catalogue item data"
  },
  nypl: {
    institution: "New York Public Library",
    division: "Rare Book Division",
    shelfmark: "*OVQ 09-87",
    itemUrl: "https://old-digitalcollections.nypl.org/items/6d7f2f1d-b7e1-ae9f-e040-e00a180648de",
    imageId: "1707705",
    uuid: "908e8c40-004e-0130-f94b-58d385a7bc34",
    digitizedOn: "2015",
    rightsStatement: "NYPL public domain statement; territorial copyright status must be checked for reuse",
    apiStatus: "legacy_repo_api_deprecated_2026_08_01"
  },
  britishLibrary: {
    institution: "British Library",
    shelfmark: "15297.d.33",
    catalogueTitle: "Taiping Calendar for 1861",
    catalogueRecordUrl: "https://rbook.ncl.edu.tw/NCLSearch/Search/SearchDetail",
    crossIdentificationStatus: "matching_title_and_year_catalogue_candidate"
  },
  imageCaptureCandidates: [
    {
      id: "picryl-nypl-capture-82c575",
      imageUrl: "https://cdn6.picryl.com/photo/1861/12/31/tai-ping-tian-guo-xin-you-shi-yi-nian-xin-li-ban-xing-tian-xia-82c575-640.jpg",
      role: "third_party_mirror_of_nypl_digitized_page",
      inspected: true,
      monthHeadingRead: false,
      printedFolioRead: false,
      dateMapping: "unresolved"
    },
    {
      id: "picryl-nypl-capture-28be45",
      imageUrl: "https://cdn6.picryl.com/photo/1861/01/01/tai-ping-tian-guo-xin-you-shi-yi-nian-xin-li-ban-xing-tian-xia-28be45-640.jpg",
      role: "third_party_mirror_of_nypl_digitized_page",
      inspected: true,
      monthHeadingRead: false,
      printedFolioRead: false,
      dateMapping: "unresolved"
    },
    {
      id: "picryl-nypl-capture-439a5e",
      imageUrl: "https://cdn6.picryl.com/photo/1861/12/31/tai-ping-tian-guo-xin-you-shi-yi-nian-xin-li-ban-xing-tian-xia-439a5e-640.jpg",
      role: "third_party_mirror_of_nypl_digitized_page",
      inspected: true,
      monthHeadingRead: false,
      printedFolioRead: false,
      dateMapping: "unresolved"
    }
  ],
  observedPageFragment: {
    sourceImageId: "picryl-nypl-capture-82c575",
    visibleDayEntries: [
      { day: 8, dayStem: "辛", lunarMansion: "柳" },
      { day: 9, dayStem: "壬", lunarMansion: "星" },
      { day: 10, dayStem: "癸", lunarMansion: "張" },
      { day: 11, dayStem: "甲", lunarMansion: "翼" },
      { day: 12, dayStem: "乙", lunarMansion: "軫" },
      { day: 13, dayStem: "丙", lunarMansion: "角" },
      { day: 14, dayStem: "丁", lunarMansion: "亢" },
      { day: 15, dayStem: "戊", lunarMansion: "氐" }
    ],
    transcriptionBasis: "visible_day_number_heavenly_stem_and_28_lunar_mansion_columns",
    earthlyBranchVisibleInTheseRows: false,
    monthHeadingRead: false,
    printedFolioIdentified: false,
    civilDateMapping: "unresolved",
    transcriptionStatus: "partial_visual_transcription_second_review_completed",
    correction: "Earlier full Ganzhi pairs such as 甲辰 were inferred from cycle continuity, not directly visible in this page fragment."
  },
  dateMappingResearch: {
    sourceId: "luo-ergang-1948-taiping-calendar-offset",
    proposedTaipingNewYear: "1861-02-09",
    targetTaipingDate: "month 10, day 1",
    candidateGanzhi: "乙丑",
    conventionalGregorianGanzhi: "甲子",
    status: "candidate_pending_original_month_ten_leaf_collation"
  },
  targetCheck: {
    civilDate: "1861-11-11",
    expectedGanzhiCandidate: "乙丑",
    originalDailyPageImageLocated: true,
    targetMonthTenDayOneLeafIdentified: false,
    originalCellTranscribed: false,
    pageCollationStatus: "partial_stem_and_lunar_mansion_transcription_only",
    note: "乙丑 remains a secondary-source/calendar-structure reconstruction candidate. The NYPL fragment does not display the target month-ten day-one cell or a complete Ganzhi pair."
  },
  assessment: {
    sourceClass: "contemporary_primary_calendar_candidate",
    itemLevelIdentity: "catalogued_and_digitized",
    dailyContentVerification: "partial_stem_and_lunar_mansion_transcription_only",
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
      url: "https://rbook.ncl.edu.tw/NCLSearch/Search/SearchDetail",
      role: "british_library_holding_and_shelfmark_catalogue_record"
    },
    {
      id: "nypl-repo-api-documentation",
      title: "NYPL Digital Collections API documentation and deprecation notice",
      url: "https://api.repo.nypl.org/",
      role: "access_method_status"
    }
  ]
} as const;
