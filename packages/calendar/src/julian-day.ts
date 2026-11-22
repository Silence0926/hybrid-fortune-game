/**
 * Gregorian civil date -> integer Julian Day Number (JDN).
 *
 * Convention: JDN is the integer number assigned to the civil date at
 * noon-based Julian Date boundaries. This function accepts a Gregorian
 * calendar date only; it does not convert timestamps or local time zones.
 *
 * Algorithm: Fliegel–Van Flandern, using integer arithmetic.
 */
export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export type JdnResult =
  | { status: "calculated"; jdn: number; date: GregorianDate; convention: "integer_jdn_gregorian" }
  | { status: "invalid_date"; message: string };

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month - 1] ?? 0;
}

/** Converts a proleptic Gregorian date to its integer JDN. */
export function gregorianToJdn(input: GregorianDate): JdnResult {
  const { year, month, day } = input;
  if (!Number.isInteger(year) || year < -4_800 || year > 10_000) {
    return { status: "invalid_date", message: "Year must be an integer from -4800 through 10000." };
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { status: "invalid_date", message: "Month must be an integer from 1 through 12." };
  }
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(year, month)) {
    return { status: "invalid_date", message: "Day is not valid for the supplied Gregorian month and year." };
  }

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;

  return {
    status: "calculated",
    jdn,
    date: { year, month, day },
    convention: "integer_jdn_gregorian"
  };
}
