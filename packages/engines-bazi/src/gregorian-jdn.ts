/**
 * Gregorian civil-date to integer Julian Day Number (JDN).
 *
 * Convention: the integer JDN labels the Gregorian civil date whose
 * astronomical Julian Date reaches noon UT. This date-level conversion is
 * independent of a timezone; callers must resolve the intended civil date
 * before calling it.
 */
export function gregorianCivilDateToJdn(civilDate: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(civilDate);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || year > 9999 || month < 1 || month > 12) return null;

  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthLengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > monthLengths[month - 1]!) return null;

  const a = Math.floor((14 - month) / 12);
  const adjustedYear = year + 4800 - a;
  const adjustedMonth = month + 12 * a - 3;
  return day
    + Math.floor((153 * adjustedMonth + 2) / 5)
    + 365 * adjustedYear
    + Math.floor(adjustedYear / 4)
    - Math.floor(adjustedYear / 100)
    + Math.floor(adjustedYear / 400)
    - 32045;
}
