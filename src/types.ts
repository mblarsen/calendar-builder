export interface CalendarEvent<T = any> {
  date: Date;
  label: string;
  value?: T;
}

export type CalendarBuilderOptions = {
  /**
   * The first day of the week
   *
   * Default: 0
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
   */
  firstDay: number;
  /**
   * Add a fill week to the end even if not needed. This is useful to avoid
   * "flicker" when some months are 4-6 weeks only.
   *
   * Default: true
   */
  fillWeek: boolean;
  /**
   * Mark dates before this time invalid
   */
  after: CalendarDate;
  /**
   * Mark dates after this time invalid
   */
  before: CalendarDate;
  /**
   * Mark days in this range as selected. The selection state of the day may
   * vary if it is the first, last, middle, or only day in the selection.
   */
  selection: [CalendarDate, CalendarDate];
  /**
   * Optionally pas in date for when is 'now'.
   */
  now: CalendarDate;
  /**
   * Disable days of the week
   */
  disableDaysOfWeek: number[];
  /**
   * Disable specific days
   */
  disableDays: CalendarDate[];
  /**
   * A list of events to "bucket".
   */
  events: CalendarEvent[];
};

/**
 * A computed config based on options and defaults
 *
 * @see CalendarBuilderOptions
 */
export type CalendarBuilderConfig = {
  firstDay: number;
  fillWeek: boolean;
  after: Date | null;
  before: Date | null;
  selection: [Date, Date] | null;
  now: Date;
  disableDaysOfWeek: number[];
  disableDays: Date[];
  events: CalendarEvent[];
};

/**
 * Ways of specifying date inputs
 */
export type CalendarDate =
  | { year: number; month: number; day?: number }
  | string
  | number
  | Date;

export type CalendarSheet = {
  /**
   * The computed config based on options and defaults
   */
  config: CalendarBuilderConfig;
  /**
   * Date of current month
   */
  current: Date;
  /**
   * Array of calendar days to be used for rendering the calendar
   */
  days: CalendarDay[];
  /**
   * Date for last day of the month
   */
  end: Date;
  /**
   * Date for first day of next month. Ideal for creating calendar sheet for next month
   */
  next: Date;
  /**
   * Date of 'now'
   */
  now: Date;
  /**
   * Date for first day of previous month. Ideal for creating calendar sheet for previous month
   */
  prev: Date;
  /**
   * Date for first day of the current month
   */
  start: Date;
};

export type CalendarDay = {
  /**
   * State represent valid and invalid days, ie. days that are selectable and
   * should not be selectable
   */
  state: "valid" | "invalid";
  /**
   * The day of the month (referred to as 'date' in the Date api)
   */
  day: number;
  /**
   * The day of the week (referred to as 'day' in the Date api)
   */
  dayOfWeek: number;
  /**
   * Date instance for this day (all dates are midnight in local time)
   */
  date: Date;
  /**
   * Is this day today?
   */
  isToday: boolean;
  /**
   * Is this day in the current month?
   */
  inMonth: boolean;
  /**
   * Any non null values means that he day is within the provided selection
   *
   * - single: the day is the only day in the selection
   * - start: the day is the first day of the selection
   * - end: the day is the last day of the selection
   * - included: the day is included in the selection, but isn't the start or
   *   the end
   */
  selection: "start" | "end" | "included" | "single" | null;
  /**
   * Events on this day
   */
  events: CalendarEvent[];
};
