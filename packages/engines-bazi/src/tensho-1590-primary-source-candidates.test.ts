import { describe, expect, it } from "vitest";
import { TENSHO_1590_PRIMARY_SOURCE_CANDIDATES as record } from "./tensho-1590-primary-source-candidates.js";

describe("Tensho 18 (1590) primary-source catalogue leads", () => {
  it("records the NCL facsimile-compendium access route and catalogue alternatives", () => {
    expect(record.year).toBe(1590);
    expect(record.candidates[0].holdingIdentifier).toBe("FB.108.15(7)");
    expect(record.candidates[0].reprintPage).toBe(195);
    expect(record.candidates[1].institution).toBe("Nanjing Library");
    expect(record.candidates[2].catalogueDescription).toContain("Ming Wanli-period block print");
    expect(record.candidates[2].holdingIdentifier).toBe("entry 265");
    expect(record.candidates[3].catalogueDescription).toContain("Ming Wanli-period block print");
    expect(record.candidates[4].catalogueDescription).toContain("明萬曆間刻本");
    expect(record.assessment.catalogueVariantAssessment).toContain("Wanli 19 (1591)");
    expect(record.assessment.reprintPageBoundary).toContain("not an original Ming folio");
    expect(record.corroboratingBibliography.visualCatalogueEntry.edition).toBe("明萬曆刻本");
    expect(record.corroboratingBibliography.relatedGoogleBooksRecord.relevance).toContain("not the required volume 4");
  });

  it("does not confuse catalogue discovery with original-page collation", () => {
    expect(record.assessment.original1590PageInspected).toBe(false);
    expect(record.assessment.dateGanzhiCellCollated).toBe(false);
    expect(record.assessment.independentHistoricalDayCycleGateCredit).toBe(false);
    expect(record.assessment.productionImpact).toBe("none");
  });
});
