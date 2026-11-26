/**
 * Catalogue-level leads for the original Wanli 18 (1590) Da Tong calendar.
 *
 * No original 1590 page has yet been inspected or collated to the modern
 * Gregorian daily row. These are access leads only, not day-cycle evidence.
 */
export const TENSHO_1590_PRIMARY_SOURCE_CANDIDATES = {
  calendarTitle: "大明萬曆十八年歲次庚寅大統曆",
  year: 1590,
  candidates: [
    {
      id: "ncl-2007-facsimile-compendium-fb-108-15-7",
      institution: "National Library of Taiwan",
      holdingIdentifier: "FB.108.15(7)",
      catalogueDescription: "Wanli 18, Gengyin year Da Tong calendar; printed copy",
      accessRoute: "國家圖書館藏明代大統曆日彙編, volume 4",
      reprintPage: 195,
      reprintPublisher: "北京圖書館出版社",
      reprintYear: 2007,
      catalogueUrl: "https://ytliu0.github.io/ChineseCalendar/MingCalendar_index.html",
      status: "catalogued_in_2007_facsimile_compendium_original_page_not_collated"
    },
    {
      id: "nanjing-library-ming-wanli-imprint",
      institution: "Nanjing Library",
      holdingIdentifier: null,
      catalogueDescription: "大明萬曆十八年歲次庚寅大統曆一卷; Ming Wanli-period block print",
      catalogueSource: "中國古籍善本書目",
      catalogueUrl: "https://www.guoxuedashi.com/shumu/gj-1919658yz.html",
      status: "secondary_catalogue_lead_no_digitized_facsimile_confirmed"
    },
    {
      id: "chinese-rare-books-bibliography-wanli-1590-entry-265",
      institution: "Chinese Rare Books Bibliography (中國古籍善本書目)",
      holdingIdentifier: "entry 265",
      catalogueDescription: "大明萬曆十八年歲次庚寅大統曆一卷; Ming Wanli-period block print",
      catalogueSource: "中國古籍善本書目, 子部",
      catalogueScanUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f1/SSID-13990656_%E4%B8%AD%E5%9C%8B%E5%8F%A4%E7%B1%8D%E5%96%84%E6%9C%AC%E6%9B%B8%E7%9B%AE_%E5%AD%90%E9%83%A8_2.pdf",
      status: "scanned_bibliography_entry_candidate_not_daily_calendar_content"
    },
    {
      id: "guoxuedashi-wanli-1590-generic-imprint-record",
      institution: "Guoxuedashi catalogue index",
      holdingIdentifier: null,
      catalogueDescription: "大明萬曆十八年歲次庚寅大統曆一卷; 明萬曆間刻本 (generic Ming Wanli-period imprint)",
      catalogueUrl: "https://www.guoxuedashi.com/shumu/186654r.html",
      status: "secondary_catalogue_record_generic_imprint_date_not_specified"
    },
    {
      id: "ncl-wanli-19-printing-variant",
      institution: "National Library of China",
      holdingIdentifier: null,
      catalogueDescription: "大明萬曆十八年歲次庚寅大統曆; catalogued as a Wanli 19 (1591) imprint",
      catalogueUrl: "https://www.guoxuedashi.com/shumu/gj-998872wi.html",
      status: "secondary_catalogue_lead_printing_year_requires_copy_level_verification"
    }
  ],
  accessAndCollationPlan: {
    firstTarget: "2007 compendium volume 4, printed page 195",
    nextTarget: "identify the 1590 monthly leaf containing 1590-12-22 or adjacent dates",
    requiredFields: [
      "original calendar title and year",
      "printed page/folio identity",
      "month heading and day row",
      "Ganzhi label",
      "edition/imprint details",
      "whether the 2007 reprint page is complete and legible"
    ]
  },
  corroboratingBibliography: {
    title: "中國古籍善本書目, 子部",
    scanUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f1/SSID-13990656_%E4%B8%AD%E5%9C%8B%E5%8F%A4%E7%B1%8D%E5%96%84%E6%9C%AC%E6%9B%B8%E7%9B%AE_%E5%AD%90%E9%83%A8_2.pdf",
    visualCatalogueEntry: {
      calendarTitle: "大明萬曆十八年歲次庚寅大統曆一卷",
      edition: "明萬曆刻本",
      catalogueEntryNumber: "二六五",
      note: "Catalogue scan visual entry; does not expose the calendar's daily tables."
    },
    relatedGoogleBooksRecord: {
      title: "國家圖書館藏明代大統曆日彙編, Volume 1",
      url: "https://books.google.com/books?id=VRTlAAAAMAAJ",
      digitizedCopy: "University of Michigan copy digitized 2009",
      relevance: "confirms the six-volume set exists, but this record is volume 1 and is not the required volume 4 scan"
    }
  },
  assessment: {
    status: "primary_source_catalogue_leads_found",
    original1590PageInspected: false,
    dateGanzhiCellCollated: false,
    independentHistoricalDayCycleGateCredit: false,
    productionImpact: "none",
    note: "The 2007 facsimile anthology and scanned rare-books bibliography provide stronger access and edition-identification routes, but no daily page or target Ganzhi cell has been inspected. Google Books currently surfaced only volume 1, not the required volume 4.",
    catalogueVariantAssessment: "One secondary catalogue describes a Wanli-period imprint without an exact year, while another describes a Wanli 19 (1591) imprint. The scanned rare-books bibliography labels the item 明萬曆刻本. These descriptions are not sufficient to identify the printing year of the specific surviving copy; copy-level collation is required.",
    reprintPageBoundary: "Volume 4, page 195 is the 2007 facsimile-compendium pagination, not an original Ming folio number."
  },
  accessedOn: "2026-11-26"
} as const;
