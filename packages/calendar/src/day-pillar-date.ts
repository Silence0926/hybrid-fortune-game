import { gregorianToJdn, type GregorianDate, type JdnResult } from "./julian-day.js";

export type DayPillarDateResult =
  | {
      status: "resolved";
      originalDate: GregorianDate;
      localTime: string;
      dayPillarDate: GregorianDate;
      jdn: number;
      rule: "23_hour_uses_previous_civil_date";
    }
  | { status: "invalid_input"; message: string };

/**
 * Resolves the Gregorian civil date used by the day-pillar calculation.
 *
 * Confirmed convention:
 * - 23:00–23:59 belongs to the previous civil date.
 * - 00:00–00:59 belongs to the current civil date.
 * - All other local times belong to the current civil date.
 *
 * The function deliberately does not map JDN to a sexagenary day index;
 * the authoritative cycle anchor remains a separate validation decision.
 */
export function resolveDayPillarDate(
  date: GregorianDate,
  localTime: string
): DayPillarDateResult {
  const validated: JdnResult = gregorianToJdn(date);
  if (validated.status !== "calculated") {
    return { status: "invalid_input", message: validated.message };
  }

  if (!/^([01]\\d|2[0-3]):[0-5]\\d$/.test(localTime)) {
    return { status: "invalid_input", message: "localTime must use 24-hour HH:mm format." };
  }

  const hour = Number(localTime.slice(0, 2));
  let dayPillarDate: GregorianDate = { ...date };

  if (hour === 23) {
    if (date.day > 1) {
      dayPillarDate.day -= 1;
    } else if (date.month > 1) {
      dayPillarDate.month -= 1;
      dayPillarDate.day = daysInMonth(date.year, dayPillarDate.month);
    } else {
      dayPillarDate.year -= 1;
      dayPillarDate.month = 12;
      dayPillarDate.day = 31;
    }
  }

  const result = gregorianToJdn(dayPillarDate);
  if (result.status !== "calculated") {
    return { status: "invalid_input", message: "Resolved day-pillar date is outside the supported Gregorian range." };
  }

  return {
    status: "resolved",
    originalDate: { ...date },
    localTime,
    dayPillarDate,
    jdn: result.jdn,
    rule: "23_hour_uses_previous_civil_date"
  };
}

function daysInMonth(year: number, month: number): number {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month - 1] ?? 0;
}
