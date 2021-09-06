export type CalendarBuilderOptions = {
  firstDay: number;
  fillWeek: boolean;
  after: CalendarDate;
  before: CalendarDate;
  selection: [CalendarDate, CalendarDate];
  now: CalendarDate;
};

export type CalendarBuilderConfig = {
  firstDay: number;
  fillWeek: boolean;
  after: Date | null;
  before: Date | null;
  selection: [Date, Date] | null;
  now: Date;
};

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
