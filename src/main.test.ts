import { create } from "./main";

test("create > no now", () => {
  const now = new Date();
  const calendar = create();
  expect(calendar.current.getFullYear()).toBe(now.getFullYear());
  expect(calendar.current.getMonth()).toBe(now.getMonth());
  expect(calendar.current.getDate()).toBe(now.getDate());
});

test("create > now as date", () => {
  const now = new Date();
  const calendar = create(now);
  expect(calendar.current.getFullYear()).toBe(now.getFullYear());
  expect(calendar.current.getMonth()).toBe(now.getMonth());
  expect(calendar.current.getDate()).toBe(now.getDate());
});

test("create > now as date (fixed)", () => {
  const now = new Date();
  now.setDate(29);
  now.setMonth(4);
  now.setFullYear(2021);
  const calendar = create(now);
  expect(calendar.current.getFullYear()).toBe(now.getFullYear());
  expect(calendar.current.getMonth()).toBe(now.getMonth());
  expect(calendar.current.getDate()).toBe(now.getDate());
});

test("create > now as string", () => {
  const calendar = create("2021-05-29");
  expect(calendar.current.getFullYear()).toBe(2021);
  expect(calendar.current.getMonth()).toBe(4);
  expect(calendar.current.getDate()).toBe(29);
});

test("create > now as object", () => {
  const calendar = create({
    year: 2021,
    month: 5,
  });
  expect(calendar.current.getFullYear()).toBe(2021);
  expect(calendar.current.getMonth()).toBe(4);
  expect(calendar.current.getDate()).toBe(1);
});

test("config defaults", () => {
  const calendar = create();
  expect(calendar.config).toStrictEqual({
    after: undefined,
    before: undefined,
    fillWeek: true,
    firstDay: 0,
    otherDays: "show",
    selection: undefined,
  });
});

test("config simple", () => {
  const calendar = create(new Date(), {
    firstDay: 1,
    fillWeek: false,
    otherDays: "hide",
  });
  expect(calendar.config).toStrictEqual({
    after: undefined,
    before: undefined,
    fillWeek: false,
    firstDay: 1,
    otherDays: "hide",
    selection: undefined,
  });
});

test("start monday", () => {
  const calendar = create({ year: 2021, month: 9 }, { firstDay: 1 });

  expect(calendar.days.map((day) => day.day)).toStrictEqual([
    30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
});

test("start sunday", () => {
  const calendar = create({ year: 2021, month: 9 });

  expect(calendar.days.map((day) => day.day)).toStrictEqual([
    29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);
});

test("start sunday on 1st", () => {
  const calendar = create({ year: 2020, month: 11 });

  expect(calendar.days.map((day) => day.day)).toStrictEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
});

test("days after (start monday)", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { firstDay: 1, after: new Date(2021, 8, 5) }
  );

  expect(calendar.days.map((day) => day.state)).toStrictEqual([
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
  ]);
});

test("days before (start monday)", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { firstDay: 1, before: new Date(2021, 8, 28) }
  );

  expect(calendar.days.map((day) => day.state)).toStrictEqual([
    "show",
    "show",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
  ]);
});

test("days after and before (start monday)", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { firstDay: 1, after: new Date(2021, 8, 5), before: new Date(2021, 8, 28) }
  );

  expect(calendar.days.map((day) => day.state)).toStrictEqual([
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
    "show",
  ]);
});
test("fillWeek off (start monday)", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { fillWeek: false, firstDay: 1 }
  );

  expect(calendar.days.map((day) => day.day)).toStrictEqual([
    30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3,
  ]);
});

test("fillWeek off (start sunday)", () => {
  const calendar = create({ year: 2021, month: 9 }, { fillWeek: false });

  expect(calendar.days.map((day) => day.day)).toStrictEqual([
    29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2,
  ]);
});

test("selection > single", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { firstDay: 1, selection: [new Date(2021, 8, 2), new Date(2021, 8, 2)] }
  );

  expect(
    calendar.days
      .filter((day) => day.selection)
      .map((day) => `${day.day}-${day.selection}`)
  ).toStrictEqual(["2-single"]);
});

test("selection > short", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { firstDay: 1, selection: [new Date(2021, 8, 2), new Date(2021, 8, 3)] }
  );

  expect(
    calendar.days
      .filter((day) => day.selection)
      .map((day) => `${day.day}-${day.selection}`)
  ).toStrictEqual(["2-start", "3-end"]);
});

test("selection > long", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { firstDay: 1, selection: [new Date(2021, 8, 2), new Date(2021, 8, 5)] }
  );

  expect(
    calendar.days
      .filter((day) => day.selection)
      .map((day) => `${day.day}-${day.selection}`)
  ).toStrictEqual(["2-start", "3-included", "4-included", "5-end"]);
});

test("selection > from previous", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    { firstDay: 1, selection: [new Date(2021, 7, 20), new Date(2021, 8, 2)] }
  );

  expect(
    calendar.days
      .filter((day) => day.selection)
      .map((day) => `${day.day}-${day.selection}`)
  ).toStrictEqual(["30-included", "31-included", "1-included", "2-end"]);
});

test("selection > into next", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    {
      fillWeek: false,
      firstDay: 1,
      selection: [new Date(2021, 8, 29), new Date(2021, 9, 20)],
    }
  );

  expect(
    calendar.days
      .filter((day) => day.selection)
      .map((day) => `${day.day}-${day.selection}`)
  ).toStrictEqual([
    "29-start",
    "30-included",
    "1-included",
    "2-included",
    "3-included",
  ]);
});

test("selection > a miss", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    {
      fillWeek: false,
      firstDay: 1,
      selection: [new Date(2021, 9, 15), new Date(2021, 9, 16)],
    }
  );

  expect(
    calendar.days
      .filter((day) => day.selection)
      .map((day) => `${day.day}-${day.selection}`)
  ).toStrictEqual([]);
});

test("selection > all included", () => {
  const calendar = create(
    { year: 2021, month: 9 },
    {
      fillWeek: false,
      firstDay: 1,
      selection: [new Date(2021, 7, 15), new Date(2021, 9, 16)],
    }
  );

  expect(
    calendar.days.filter((day) => day.selection).map((day) => day.selection)
  ).toStrictEqual(Array(calendar.days.length).fill("included"));
});
