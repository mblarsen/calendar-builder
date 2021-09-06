/* eslint-disable @typescript-eslint/no-non-null-assertion */
export type CalendarDayState = "valid" | "invalid";

export type CalendarDate =
  | { year: number; month: number; day?: number }
  | string
  | number
  | Date;

export type CalendarSheet = {
  config: CalendarBuilderConfig;
  current: Date;
  days: CalendarDay[];
  end: Date;
  next: Date;
  now: Date;
  prev: Date;
  start: Date;
};

export type CalendarDay = {
  state: CalendarDayState;
  day: number;
  dayOfWeek: number;
  date: Date;
  isToday: boolean;
  inMonth: boolean;
  selection: "start" | "end" | "included" | "single" | null;
};

type CalendarBuilderOptions = {
  firstDay: number;
  fillWeek: boolean;
  after: CalendarDate;
  before: CalendarDate;
  selection: [CalendarDate, CalendarDate];
  now: CalendarDate;
};

type CalendarBuilderConfig = {
  firstDay: number;
  fillWeek: boolean;
  after: Date | null;
  before: Date | null;
  selection: [Date, Date] | null;
  now: Date;
};

type DayMapper = (day: number, index: number) => CalendarDay;
type DayMapperFactory = (params: {
  indexOffset: number;
  date: Date;
  inMonth: boolean;
}) => DayMapper;

function createDayMapperFactory(now: Date, config: CalendarBuilderConfig) {
  return ({
      indexOffset,
      date: baseDate,
      inMonth,
    }: Parameters<DayMapperFactory>[0]) =>
    (day: number, index: number) => {
      const date = setMidnight(
        new Date(baseDate.getFullYear(), baseDate.getMonth(), day)
      );
      return {
        date,
        day,
        dayOfWeek: (index + indexOffset) % 7,
        isToday: now.getTime() == date.getTime(),
        selection: getSelectionState(date, config.selection),
        state: clampDate(date, config.after, config.before),
        inMonth,
      };
    };
}

export const create = (
  forDate?: CalendarDate | null | undefined,
  options?: Partial<CalendarBuilderOptions>
): CalendarSheet => {
  const current = setMidnight(fromCalendarDate(forDate || new Date()));
  if (!current || current.toString() === "Invalid Date") {
    throw new Error("Invalid Date");
  }
  const config = createConfig(options);
  const { firstDay, weeks, end, now, prev, next, start } = getMonthData(
    current,
    config
  );

  const dayMapper = createDayMapperFactory(now, config);

  const firstDays = getFirstDays(firstDay, config);
  const lastDays = getLastDays(weeks, firstDays, end);

  const days = fillDays(
    config.firstDay,
    dayMapper,
    [
      firstDays > 0 ? getDisplayDays(prev).slice(-firstDays) : [],
      { date: prev, inMonth: false },
    ],
    [
      Array.from(Array(end.getDate())).map((_, index) => index + 1),
      { date: current, inMonth: true },
    ],
    [getDisplayDays(next).slice(0, lastDays), { date: next, inMonth: false }]
  );

  return {
    config,
    next,
    prev,
    current,
    start,
    end,
    days,
    now,
  };
};

function getMonthData(current: Date, config: CalendarBuilderConfig) {
  const now = config.now;
  const start = setMidnight(
    new Date(current.getFullYear(), current.getMonth(), 1)
  );
  const end = setMidnight(
    new Date(current.getFullYear(), current.getMonth() + 1, 0)
  );
  const next = getNextMonth(current);
  const prev = getPrevMonth(current);
  const firstDay = start.getDay();
  const weeks = config.fillWeek ? 6 : Math.ceil(end.getDate() / 7);
  return { firstDay, weeks, end, now, prev, next, start };
}

function getLastDays(weeks: number, firstDays: number, end: Date) {
  return weeks * 7 - (firstDays + end.getDate());
}

function getFirstDays(firstDay: number, config: CalendarBuilderConfig) {
  return firstDay - config.firstDay < 0
    ? 7 + firstDay - config.firstDay
    : firstDay - config.firstDay;
}

function setMidnight(date: Date): Date {
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

function fromCalendarDate(forDate: CalendarDate): Date {
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

function createConfig(
  options?: Partial<CalendarBuilderOptions>
): CalendarBuilderConfig {
  return {
    after: options?.after
      ? setMidnight(fromCalendarDate(options?.after))
      : null,
    before: options?.before
      ? setMidnight(fromCalendarDate(options?.before))
      : null,
    fillWeek: options?.fillWeek ?? true,
    firstDay: options?.firstDay || 0,
    now: setMidnight(fromCalendarDate(options?.now || new Date())),
    selection: options?.selection
      ? [
          setMidnight(fromCalendarDate(options.selection[0])),
          setMidnight(fromCalendarDate(options.selection[1])),
        ]
      : null,
  };
}

function getPrevMonth(current: Date): Date {
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

function getNextMonth(current: Date): Date {
  const next = new Date(current);

  if (current.getMonth() === 11) {
    next.setFullYear(next.getFullYear() + 1);
    next.setMonth(1);
    next.setDate(1);
  } else {
    next.setMonth(next.getMonth() + 1);
    next.setDate(1);
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

function daysDelta(day: Date, delta: number) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() + delta);
}

function clampDate(
  date: Date,
  after: Date | null,
  before: Date | null
): CalendarDayState {
  if (!after && !before) return "valid";

  const maxTime = Number.MAX_SAFE_INTEGER;
  const val = date.getTime();
  const min = after ? daysDelta(after, 1).getTime() : 0;
  const max = before ? daysDelta(before, -1).getTime() : maxTime;

  const clamped = Math.min(Math.max(val, min), max);

  return clamped === date.getTime() ? "valid" : "invalid";
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

function fillDays(
  startIndex: number,
  mapper: DayMapperFactory,
  ...daysMapperPairs: [
    number[],
    Omit<Parameters<DayMapperFactory>[0], "indexOffset">
  ][]
) {
  let indexOffset = startIndex;
  return daysMapperPairs.reduce((days, [batch, params]) => {
    const mappedDays = batch.map(mapper({ ...params, indexOffset }));
    indexOffset += mappedDays.length;
    days.push(...mappedDays);
    return days;
  }, [] as CalendarDay[]);
}
