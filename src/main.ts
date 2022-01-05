export * from "./types";

import {
  inRange,
  fromCalendarDate,
  getDisplayDays,
  getFirstDays,
  getLastDays,
  getNextMonth,
  getPrevMonth,
  isDisabled,
  setStartOfDay,
  setEndOfDay,
  daysDelta,
} from "./helpers";
import {
  CalendarBuilderConfig,
  CalendarBuilderOptions,
  CalendarDate,
  CalendarDay,
  CalendarSheet,
} from "./types";

type DayMapper = (day: number, index: number) => CalendarDay;

type DayMapperFactory = (params: {
  indexOffset: number;
  date: Date;
  inMonth: boolean;
}) => DayMapper;

export const create = (
  forDate?: CalendarDate | null | undefined,
  options?: Partial<CalendarBuilderOptions>
): CalendarSheet => {
  const current = setStartOfDay(fromCalendarDate(forDate || new Date()));
  if (!current || current.toString() === "Invalid Date") {
    throw new Error("Invalid Date");
  }
  const config = createConfig(options);
  const { firstDay, weeks, end, now, prev, next, start } = getMonthData(
    current,
    config
  );

  const firstDays = getFirstDays(firstDay, config);
  const lastDays = getLastDays(weeks, firstDays, end);

  const days = fillDays(
    config.firstDay,
    createDayMapperFactory(now, config),
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

function createConfig(
  options?: Partial<CalendarBuilderOptions>
): CalendarBuilderConfig {
  return {
    after: options?.after
      ? setStartOfDay(fromCalendarDate(options?.after))
      : null,
    before: options?.before
      ? setStartOfDay(fromCalendarDate(options?.before))
      : null,
    fillWeek: options?.fillWeek ?? true,
    firstDay: options?.firstDay || 0,
    now: setStartOfDay(fromCalendarDate(options?.now || new Date())),
    selection: options?.selection
      ? [
          setStartOfDay(fromCalendarDate(options.selection[0])),
          setStartOfDay(fromCalendarDate(options.selection[1])),
        ]
      : null,
    disableDaysOfWeek: options?.disableDaysOfWeek || [],
    disableDays: (options?.disableDays || []).map((day) =>
      setStartOfDay(fromCalendarDate(day))
    ),
    events: options?.events || [],
  };
}

function isDayValid(config: CalendarBuilderConfig): (date: Date) => boolean {
  const isDisabled_ = isDisabled(config);
  const dayAfter = config.after ? daysDelta(config.after, 1) : null;
  const dayBefore = config.before ? daysDelta(config.before, -1) : null;
  const inRange_ = inRange(dayAfter, dayBefore);
  return (date: Date) => inRange_(date) && !isDisabled_(date);
}

function createDayMapperFactory(now: Date, config: CalendarBuilderConfig) {
  const isValid = isDayValid(config);
  return ({
      indexOffset,
      date: baseDate,
      inMonth,
    }: Parameters<DayMapperFactory>[0]) =>
    (day: number, index: number) => {
      const date = setStartOfDay(
        new Date(baseDate.getFullYear(), baseDate.getMonth(), day)
      );
      const endDate = setEndOfDay(date);

      const inRange_ = inRange(date, endDate);
      const eventsForDay = config.events.filter((event) => {
        return inRange_(event.date);
      });

      return {
        date,
        day,
        dayOfWeek: (index + indexOffset) % 7,
        isToday: now.getTime() == date.getTime(),
        selection: getSelectionState(date, config.selection),
        state: (isValid(date) ? "valid" : "invalid") as "valid" | "invalid",
        inMonth,
        events: eventsForDay,
      };
    };
}

function getMonthData(current: Date, config: CalendarBuilderConfig) {
  const now = config.now;
  const start = setStartOfDay(
    new Date(current.getFullYear(), current.getMonth(), 1)
  );
  const end = setStartOfDay(
    new Date(current.getFullYear(), current.getMonth() + 1, 0)
  );
  const next = getNextMonth(current);
  const prev = getPrevMonth(current);
  const firstDay = start.getDay();
  const weeks = config.fillWeek ? 6 : Math.ceil(end.getDate() / 7);
  return { firstDay, weeks, end, now, prev, next, start };
}

function getSelectionState(
  current: Date,
  selection: CalendarBuilderConfig["selection"] | undefined
): CalendarDay["selection"] {
  const [from, to] = selection || [];
  if (!from || !to) return null;

  const min = setStartOfDay(from)?.getTime();
  const val = current.getTime();
  const max = setStartOfDay(to)?.getTime();

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
