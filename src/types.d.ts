declare type CalendarBuilderOptions = {
  firstDay: number;
  fillWeek: boolean;
  after: CalendarDate;
  before: CalendarDate;
  selection: [CalendarDate, CalendarDate];
  now: CalendarDate;
};

declare type CalendarDayState = "valid" | "invalid";

declare type CalendarDate =
  | { year: number; month: number; day?: number }
  | string
  | number
  | Date;

declare type CalendarSheet = {
  config: CalendarBuilderConfig;
  current: Date;
  days: CalendarDay[];
  end: Date;
  next: Date;
  now: Date;
  prev: Date;
  start: Date;
};

declare type CalendarDay = {
  state: CalendarDayState;
  day: number;
  dayOfWeek: number;
  date: Date;
  isToday: boolean;
  inMonth: boolean;
  selection: "start" | "end" | "included" | "single" | null;
};
