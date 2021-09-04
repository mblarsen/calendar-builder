export type CalendarDayState = "hide" | "show" | "active";

export type CalendarSheet = {
  config: CalendarBuilderConfig;
  nextMonth: Date;
  prevMonth: Date;
  current: Date;
  start: Date;
  end: Date;
  days: CalendarDay[];
};

export type CalendarDay = {
  state: CalendarDayState;
  day: number;
  dayOfWeek: number;
  selection: "start" | "end" | "included" | "single" | null;
};

type CalendarBuilderConfig = {
  firstDay: number;
  otherDays: CalendarDayState;
  fillWeek: boolean;
  after: Date | undefined;
  before: Date | undefined;
  selection: [Date, Date] | undefined;
};

export const create = (
  now?:
    | { year: number; month: number }
    | string
    | number
    | Date
    | null
    | undefined,
  options?: Partial<CalendarBuilderConfig>
): CalendarSheet => {
  const current = setMidnight(getCurrent(now));
  if (!current || current.toString() === "Invalid Date") {
    throw new Error("Invalid Date");
  }
  const start = new Date(current.getFullYear(), current.getMonth(), 1);
  const end = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  const nextMonth = getNextMonth(current);
  const prevMonth = getPrevMonth(current);

  const config = createConfig(options);

  const firstDay = start.getDay();

  const weeks = config.fillWeek ? 6 : Math.ceil(end.getDate() / 7);

  const firstDays = firstDay - config.firstDay;
  const lastDays = weeks * 7 - (firstDays + end.getDate());

  let indexOffset = 0;

  const firstDaysFill = (
    firstDays > 0 ? getDisplayDays(prevMonth).slice(-firstDays) : []
  ).map((day, index) => {
    const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
    return {
      day,
      dayOfWeek: (index + indexOffset) % 7,
      state: config.otherDays,
      selection: getSelectionState(date, config.selection),
    };
  });

  indexOffset += firstDaysFill.length;

  const monthDaysFill = Array.from({ length: end.getDate() })
    .map((_, index) => index + 1)
    .map((day, index) => {
      const date = new Date(current.getFullYear(), current.getMonth(), day);
      return {
        day,
        dayOfWeek: (index + indexOffset) % 7,
        state: clampDate(date, config.after, config.before),
        selection: getSelectionState(date, config.selection),
      };
    });

  indexOffset += monthDaysFill.length;

  const lastDaysFill = getDisplayDays(nextMonth)
    .slice(0, lastDays)
    .map((day, index) => {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
      return {
        day,
        dayOfWeek: (index + indexOffset) % 7,
        state: config.otherDays,
        selection: getSelectionState(date, config.selection),
      };
    });

  const days: CalendarDay[] = [
    ...firstDaysFill,
    ...monthDaysFill,
    ...lastDaysFill,
  ];

  return {
    config,
    nextMonth,
    prevMonth,
    current,
    start,
    end,
    days,
  };
};

function setMidnight(date?: Date): Date | null | undefined {
  if (!date) return;
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

function getCurrent(
  now?:
    | { year: number; month: number }
    | string
    | number
    | Date
    | null
    | undefined
): Date {
  if (now instanceof Date) return now;
  if (typeof now === "number") return new Date(now);
  if (typeof now === "string") return new Date(now);
  if (
    now &&
    typeof now === "object" &&
    typeof now.year === "number" &&
    typeof now.month === "number"
  ) {
    return new Date(now.year, now.month - 1, 1, 0, 0, 0, 0);
  }
  return new Date();
}

function createConfig(
  options?: Partial<CalendarBuilderConfig>
): CalendarBuilderConfig {
  return {
    selection: options?.selection,
    before: options?.before,
    fillWeek: options?.fillWeek ?? true,
    after: options?.after,
    otherDays: options?.otherDays || "show",
    firstDay: options?.firstDay || 0,
  };
}

function getPrevMonth(current: Date): Date {
  const prev = new Date(current);

  if (current.getMonth() === 0) {
    prev.setFullYear(prev.getFullYear() - 1);
    prev.setMonth(11);
  } else {
    prev.setMonth(prev.getMonth() - 1);
  }

  return prev;
}

function getNextMonth(current: Date): Date {
  const next = new Date(current);

  if (current.getMonth() === 11) {
    next.setFullYear(next.getFullYear() + 1);
    next.setMonth(1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }

  return next;
}

function getDisplayDays(current: Date): number[] {
  const days = new Date(
    current.getFullYear(),
    current.getMonth() + 1,
    0
  ).getDate();
  return Array.from({ length: days }).map((_, index: number) => index + 1);
}

function clampDate(
  current: Date,
  after: Date | undefined,
  before: Date | undefined,
  positiveState: CalendarDayState = "active",
  negativeState: CalendarDayState = "show"
): CalendarDayState {
  if (!after && !before) return "active";

  const val = current.getTime();

  const min = after
    ? new Date(
        after.getFullYear(),
        after.getMonth(),
        after.getDate() + 1
      ).getTime()
    : 0;

  const max = before
    ? new Date(
        before.getFullYear(),
        before.getMonth(),
        before.getDate() - 1
      ).getTime()
    : Number.MAX_SAFE_INTEGER;

  const clampedDate = Math.min(Math.max(val, min), max);

  return clampedDate === current.getTime() ? positiveState : negativeState;
}

function getSelectionState(
  current: Date,
  selection: CalendarBuilderConfig["selection"] | undefined
): CalendarDay["selection"] {
  const [from, to] = selection || [];
  if (!from || !to) return null;

  const min = setMidnight(from)?.getTime();
  const val = current.getTime();
  const max = setMidnight(to)?.getTime();

  if (!min || !max) return null;

  if (min === val && val === max) return "single";
  if (min === val) return "start";
  if (max === val) return "end";
  if (min < val && val < max) return "included";

  return null;
}
