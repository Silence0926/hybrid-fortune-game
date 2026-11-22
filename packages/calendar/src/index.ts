export interface CalendarNormalizationRequest {
  localDate: string;
  localTime?: string;
  timeZone: string;
  precision: "minute" | "hour" | "date_only" | "unknown";
}
export interface CalendarNormalizationResult {
  status: "not_implemented";
  utcInstant: null;
  warnings: string[];
}

/** Time-zone and lunisolar conversion must use a validated provider. */
export function normalizeBirthTime(_request: CalendarNormalizationRequest): CalendarNormalizationResult {
  return {
    status: "not_implemented",
    utcInstant: null,
    warnings: ["A validated time-zone and calendar conversion provider is not configured."]
  };
}
