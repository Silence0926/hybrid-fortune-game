import { getBaziMonthBoundaryTerms } from "./solar-terms.js";

/**
 * A published Jie crossing instant from one reference source.
 * Local publication time retains its explicit UTC offset; utcInstant is the
 * normalized comparison instant. Precision must never be silently increased.
 */
export interface JieTermReferenceFixture {
  year: number;
  termZh: string;
  solarLongitudeDegrees: number;
  publishedLocalDateTime: string;
  timeZone: string;
  utcInstant: string;
  publishedPrecision: "minute" | "second";
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  accessedOn: string;
}

export type JieTermFixtureValidation =
  | {
      status: "candidate_supported";
      year: number;
      termCount: 12;
      sourceCountByTerm: Record<string, number>;
      warnings: string[];
    }
  | {
      status: "rejected";
      reasons: string[];
    };

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isValidGregorianDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month! - 1 &&
    date.getUTCDate() === day;
}

function isValidIanaTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks coverage of all twelve BaZi Jie boundaries, time normalization,
 * source metadata and per-term source multiplicity. It cannot prove that
 * sources are independent or authoritative; human review remains mandatory.
 */
export function validateJieTermReferenceFixtures(
  fixtures: JieTermReferenceFixture[],
  minimumSourcesPerTerm = 2
): JieTermFixtureValidation {
  if (!Number.isInteger(minimumSourcesPerTerm) || minimumSourcesPerTerm < 2) {
    return { status: "rejected", reasons: ["At least two independent sources per Jie must be required."] };
  }
  if (fixtures.length === 0) {
    return { status: "rejected", reasons: ["No Jie reference fixtures were supplied."] };
  }

  const reasons: string[] = [];
  const expectedTerms = getBaziMonthBoundaryTerms();
  const year = fixtures[0]!.year;
  const sourceIdsByTerm = new Map<string, Set<string>>();
  const sourceRecordsByTerm = new Set<string>();

  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    return { status: "rejected", reasons: ["The fixture year is invalid."] };
  }

  for (const fixture of fixtures) {
    const term = expectedTerms.find((item) => item.nameZh === fixture.termZh);
    if (fixture.year !== year) reasons.push("Fixtures must belong to one reference year.");
    if (!term) {
      reasons.push(`Unknown or non-Jie term: ${fixture.termZh}.`);
      continue;
    }
    if (fixture.solarLongitudeDegrees !== term.longitudeDegrees) {
      reasons.push(`Solar longitude does not match ${fixture.termZh}.`);
    }

    if (!ISO_WITH_OFFSET.test(fixture.publishedLocalDateTime) ||
        !Number.isFinite(Date.parse(fixture.publishedLocalDateTime))) {
      reasons.push(`Published local time for ${fixture.termZh} must be ISO-8601 with an explicit UTC offset.`);
    } else {
      const localDate = fixture.publishedLocalDateTime.slice(0, 10);
      if (!isValidGregorianDate(localDate) || Number(localDate.slice(0, 4)) !== fixture.year) {
        reasons.push(`Published local date for ${fixture.termZh} must be a valid Gregorian date in fixture year ${fixture.year}.`);
      }
    }

    if (!ISO_UTC.test(fixture.utcInstant) || !Number.isFinite(Date.parse(fixture.utcInstant))) {
      reasons.push(`UTC instant for ${fixture.termZh} must be an ISO-8601 UTC timestamp.`);
    } else if (Date.parse(fixture.publishedLocalDateTime) !== Date.parse(fixture.utcInstant)) {
      reasons.push(`Published local time and UTC instant disagree for ${fixture.termZh}.`);
    }

    if (fixture.publishedPrecision === "minute") {
      const localSeconds = fixture.publishedLocalDateTime.slice(17, 19);
      const utcSeconds = fixture.utcInstant.slice(17, 19);
      if (localSeconds !== "00" || utcSeconds !== "00" ||
          /\.\d+/.test(fixture.publishedLocalDateTime) || /\.\d+/.test(fixture.utcInstant)) {
        reasons.push(`Minute-precision fixture ${fixture.termZh} contains unsupported seconds or fractions.`);
      }
    } else if (fixture.publishedPrecision === "second") {
      if (/\.\d+/.test(fixture.publishedLocalDateTime) || /\.\d+/.test(fixture.utcInstant)) {
        reasons.push(`Second-precision fixture ${fixture.termZh} must not imply sub-second precision.`);
      }
    } else {
      reasons.push(`Unsupported publication precision for ${fixture.termZh}.`);
    }

    if (!isValidIanaTimeZone(fixture.timeZone) || !fixture.sourceId.trim() ||
        !fixture.sourceTitle.trim() || !/^https:\/\//.test(fixture.sourceUrl) ||
        !isValidGregorianDate(fixture.accessedOn)) {
      reasons.push(`Traceable source metadata is incomplete or invalid for ${fixture.termZh}.`);
    }

    const sourceId = fixture.sourceId.trim();
    const sourceRecordKey = `${fixture.termZh}::${sourceId}`;
    if (sourceRecordsByTerm.has(sourceRecordKey)) {
      reasons.push(`Duplicate source record for ${fixture.termZh}: ${sourceId}.`);
    }
    sourceRecordsByTerm.add(sourceRecordKey);

    const sourceIds = sourceIdsByTerm.get(fixture.termZh) ?? new Set<string>();
    sourceIds.add(sourceId);
    sourceIdsByTerm.set(fixture.termZh, sourceIds);
  }

  for (const term of expectedTerms) {
    const sourceCount = sourceIdsByTerm.get(term.nameZh)?.size ?? 0;
    if (sourceCount < minimumSourcesPerTerm) {
      reasons.push(`${term.nameZh} has only ${sourceCount} distinct source(s); ${minimumSourcesPerTerm} required.`);
    }
  }

  if (reasons.length) return { status: "rejected", reasons: [...new Set(reasons)] };

  return {
    status: "candidate_supported",
    year,
    termCount: 12,
    sourceCountByTerm: Object.fromEntries(
      expectedTerms.map((term) => [term.nameZh, sourceIdsByTerm.get(term.nameZh)!.size])
    ),
    warnings: [
      "Distinct source IDs do not prove independent astronomical derivation; inspect source ownership and calculation provenance.",
      "The candidate preserves each source's stated precision and is not an approved ephemeris or BaZi ruleset fixture until domain review."
    ]
  };
}
