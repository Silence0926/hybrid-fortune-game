/**
 * Proleptic Julian-calendar civil date to integer Julian Day Number (JDN).
 *
 * The year parameter uses astronomical year numbering:
 * 1 BCE = year 0, 2 BCE = year -1, ..., 720 BCE = year -719.
 * The integer JDN labels the Julian civil date whose Julian Date reaches noon UT.
 */
export function julianAstronomicalDateToJdn(
  astronomicalYear: number,
  month: number,
  day: number
): number | null {
  if (!Number.isInteger(astronomicalYear) || astronomicalYear < -4799 || astronomicalYear > 9999) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day)) return null;

  const leap = astronomicalYear % 4 === 0;
  const monthLengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > monthLengths[month - 1]!) return null;

  const a = Math.floor((14 - month) / 12);
  const adjustedYear = astronomicalYear + 4800 - a;
  const adjustedMonth = month + 12 * a - 3;
  return day
    + Math.floor((153 * adjustedMonth + 2) / 5)
    + 365 * adjustedYear
    + Math.floor(adjustedYear / 4)
    - 32083;
}

/** Converts a historical BCE year to astronomical year numbering (no civil year zero). */
export function astronomicalYearFromBceYear(bceYear: number): number | null {
  if (!Number.isInteger(bceYear) || bceYear < 1) return null;
  return 1 - bceYear;
}
