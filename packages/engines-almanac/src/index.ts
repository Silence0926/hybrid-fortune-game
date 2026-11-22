export interface AlmanacQuery {
  localDate: string;
  region: string;
  editionId: string;
}
export interface AlmanacResult {
  status: "not_implemented";
  date: string;
  activities: null;
  warnings: string[];
}
export function queryAlmanac(query: AlmanacQuery): AlmanacResult {
  return {
    status: "not_implemented",
    date: query.localDate,
    activities: null,
    warnings: [
      "No regional almanac edition has been approved.",
      "No licensed and versioned almanac dataset is configured."
    ]
  };
}
