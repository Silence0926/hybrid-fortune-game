/**
 * Canonical 24-term longitude taxonomy.
 *
 * Longitudes are apparent geocentric ecliptic longitude targets measured
 * forward from the vernal equinox. This table defines term identity only;
 * it does not calculate astronomical crossing instants.
 */
export type SolarTermClass = "jie" | "zhongqi";

export interface SolarTermDefinition {
  longitudeDegrees: number;
  nameZh: string;
  nameEn: string;
  class: SolarTermClass;
  isBaziMonthBoundary: boolean;
}

export const SOLAR_TERMS_24: readonly SolarTermDefinition[] = [
  { longitudeDegrees: 0, nameZh: "春分", nameEn: "Vernal Equinox", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 15, nameZh: "清明", nameEn: "Clear and Bright", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 30, nameZh: "穀雨", nameEn: "Grain Rain", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 45, nameZh: "立夏", nameEn: "Start of Summer", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 60, nameZh: "小滿", nameEn: "Grain Full", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 75, nameZh: "芒種", nameEn: "Grain in Ear", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 90, nameZh: "夏至", nameEn: "Summer Solstice", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 105, nameZh: "小暑", nameEn: "Minor Heat", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 120, nameZh: "大暑", nameEn: "Major Heat", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 135, nameZh: "立秋", nameEn: "Start of Autumn", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 150, nameZh: "處暑", nameEn: "End of Heat", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 165, nameZh: "白露", nameEn: "White Dew", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 180, nameZh: "秋分", nameEn: "Autumnal Equinox", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 195, nameZh: "寒露", nameEn: "Cold Dew", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 210, nameZh: "霜降", nameEn: "Frost Descent", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 225, nameZh: "立冬", nameEn: "Start of Winter", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 240, nameZh: "小雪", nameEn: "Minor Snow", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 255, nameZh: "大雪", nameEn: "Major Snow", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 270, nameZh: "冬至", nameEn: "Winter Solstice", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 285, nameZh: "小寒", nameEn: "Minor Cold", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 300, nameZh: "大寒", nameEn: "Major Cold", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 315, nameZh: "立春", nameEn: "Start of Spring", class: "jie", isBaziMonthBoundary: true },
  { longitudeDegrees: 330, nameZh: "雨水", nameEn: "Rain Water", class: "zhongqi", isBaziMonthBoundary: false },
  { longitudeDegrees: 345, nameZh: "驚蟄", nameEn: "Awakening of Insects", class: "jie", isBaziMonthBoundary: true }
] as const;

export function getSolarTermByLongitude(longitudeDegrees: number): SolarTermDefinition | null {
  if (!Number.isFinite(longitudeDegrees)) return null;
  const normalized = ((longitudeDegrees % 360) + 360) % 360;
  return SOLAR_TERMS_24.find((term) => term.longitudeDegrees === normalized) ?? null;
}

export function getBaziMonthBoundaryTerms(): readonly SolarTermDefinition[] {
  return SOLAR_TERMS_24.filter((term) => term.isBaziMonthBoundary);
}
