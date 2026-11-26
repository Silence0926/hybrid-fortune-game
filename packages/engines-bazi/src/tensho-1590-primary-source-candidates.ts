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
  assessment: {
    status: "primary_source_catalogue_leads_found",
    original1590PageInspected: false,
    dateGanzhiCellCollated: false,
    independentHistoricalDayCycleGateCredit: false,
    productionImpact: "none",
    note: "The 2007 facsimile anthology is a route to a reproduced original calendar; catalogue records alone do not establish the contents of the target daily cell."
  },
  accessedOn: "2026-11-26"
} as const;
