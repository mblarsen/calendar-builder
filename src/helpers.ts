import { CalendarBuilderConfig, CalendarDate } from "./types";

export function getLastDays(
  weeks: number,
  firstDays: number,
  end: Date
): number {
  return weeks * 7 - (firstDays + end.getDate());
}

export function getFirstDays(
  firstDay: number,
  config: CalendarBuilderConfig
): number {
  return firstDay - config.firstDay < 0
    ? 7 + firstDay - config.firstDay
    : firstDay - config.firstDay;
}

/**
 * @deprecated use setStartOfDay()
 */
export function setMidnight(date: Date): Date {
  return setStartOfDay(date);
}

export function setStartOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

export function setEndOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

export function fromCalendarDate(forDate: CalendarDate): Date {
  if (forDate instanceof Date) return forDate;
  if (typeof forDate === "number") return new Date(forDate);
  if (typeof forDate === "string") return new Date(forDate);
  if (
    forDate &&
    typeof forDate === "object" &&
    typeof forDate.year === "number" &&
    typeof forDate.month === "number"
  ) {
    return new Date(
      forDate.year,
      forDate.month - 1,
      forDate.day || 1,
      0,
      0,
      0,
      0
    );
  }
  throw new Error("Invalid Date");
}

export function getPrevMonth(current: Date): Date {
  const prev = new Date(current);

  if (current.getMonth() === 0) {
    prev.setFullYear(prev.getFullYear() - 1);
    prev.setMonth(11);
    prev.setDate(1);
  } else {
    prev.setMonth(prev.getMonth() - 1);
    prev.setDate(1);
  }

  return prev;
}

export function getNextMonth(current: Date): Date {
  const next = new Date(current);

  if (current.getMonth() === 11) {
    next.setFullYear(next.getFullYear() + 1);
    next.setMonth(0);
    next.setDate(1);
  } else {
    next.setMonth(next.getMonth() + 1);
    next.setDate(1);
  }

  return next;
}

export function getDisplayDays(current: Date): number[] {
  const days = new Date(
    current.getFullYear(),
    current.getMonth() + 1,
    0
  ).getDate();
  return Array.from({ length: days }).map((_, index: number) => index + 1);
}

export function daysDelta(day: Date, delta: number): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() + delta);
}

export function isDisabled(
  config: CalendarBuilderConfig
): (date: Date) => boolean {
  const disabledDays = config.disableDays.map((d) => d.getTime());

  return (date: Date) =>
    isDisabledDay(disabledDays, date) ||
    isDisabledDayOfWeek(config.disableDaysOfWeek, date);
}

function isDisabledDay(disabledDays: number[], date: Date): boolean {
  return disabledDays.some((disabled) => disabled === date.getTime());
}

function isDisabledDayOfWeek(
  disabledDaysOfWeek: number[],
  date: Date
): boolean {
  return disabledDaysOfWeek.includes(date.getDay());
}

export function inRange(
  after: Date | null,
  before: Date | null
): (date: Date) => boolean {
  if (!after && !before) return () => true;

  const maxTime = Number.MAX_SAFE_INTEGER;
  const min = after ? setStartOfDay(after).getTime() : 0;
  const max = before ? setEndOfDay(before).getTime() : maxTime;

  return (date: Date): boolean => {
    const val = date.getTime();
    const clamped = Math.min(Math.max(val, min), max);

    return clamped === date.getTime() ? true : false;
  };
}
