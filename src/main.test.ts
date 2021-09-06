import { create } from "./main";

describe("create", () => {
  test("no now", () => {
    const now = new Date();
    const calendar = create();
    expect(calendar.current.getFullYear()).toBe(now.getFullYear());
    expect(calendar.current.getMonth()).toBe(now.getMonth());
    expect(calendar.current.getDate()).toBe(now.getDate());
  });

  test("now as date", () => {
    const now = new Date();
    const calendar = create(now);
    expect(calendar.current.getFullYear()).toBe(now.getFullYear());
    expect(calendar.current.getMonth()).toBe(now.getMonth());
    expect(calendar.current.getDate()).toBe(now.getDate());
  });

  test("now as date (fixed)", () => {
    const now = new Date();
    now.setDate(29);
    now.setMonth(4);
    now.setFullYear(2021);
    const calendar = create(now);
    expect(calendar.current.getFullYear()).toBe(now.getFullYear());
    expect(calendar.current.getMonth()).toBe(now.getMonth());
    expect(calendar.current.getDate()).toBe(now.getDate());
  });

  test("now as string", () => {
    const calendar = create("2021-05-29");
    expect(calendar.current.getFullYear()).toBe(2021);
    expect(calendar.current.getMonth()).toBe(4);
    expect(calendar.current.getDate()).toBe(29);
  });

  test("now as object", () => {
    const calendar = create({
      year: 2021,
      month: 5,
    });
    expect(calendar.current.getFullYear()).toBe(2021);
    expect(calendar.current.getMonth()).toBe(4);
    expect(calendar.current.getDate()).toBe(1);
  });
});

describe("config", () => {
  test("defaults", () => {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    const calendar = create();
    expect(calendar.config).toStrictEqual({
      after: null,
      before: null,
      fillWeek: true,
      firstDay: 0,
      selection: null,
      now,
    });
  });

  test("simple", () => {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    const calendar = create(new Date(), {
      firstDay: 1,
      fillWeek: false,
    });
    expect(calendar.config).toStrictEqual({
      after: null,
      before: null,
      fillWeek: false,
      firstDay: 1,
      selection: null,
      now,
    });
  });
});

describe("start on", () => {
  test("monday", () => {
    const calendar = create({ year: 2021, month: 9 }, { firstDay: 1 });

    expect(calendar.days.map((day) => day.day)).toStrictEqual([
      30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  test("sunday", () => {
    const calendar = create({ year: 2021, month: 9 });

    expect(calendar.days.map((day) => day.day)).toStrictEqual([
      29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  test("sunday 1st", () => {
    const calendar = create({ year: 2020, month: 11 });

    expect(calendar.days.map((day) => day.day)).toStrictEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });
});

describe("start on (batch)", () => {
  const batch = [
    // Start on 1
    {
      startOn: 1,
      year: 2021,
      month: 8,
      days: [
        26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1,
        2, 3, 4, 5,
      ],
    },
    {
      startOn: 1,
      year: 2021,
      month: 9,
      days: [
        30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8,
        9, 10,
      ],
    },
    {
      startOn: 1,
      year: 2021,
      month: 10,
      days: [
        27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4,
        5, 6, 7,
      ],
    },
    {
      startOn: 1,
      year: 2021,
      month: 11,
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12,
      ],
    },
    {
      startOn: 1,
      year: 2021,
      month: 12,
      days: [
        29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7,
        8, 9,
      ],
    },
    {
      startOn: 1,
      year: 2022,
      month: 1,
      days: [
        27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3,
        4, 5, 6,
      ],
    },
    {
      startOn: 1,
      year: 2022,
      month: 2,
      days: [
        31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        12, 13,
      ],
    },
    {
      startOn: 1,
      year: 2022,
      month: 3,
      days: [
        28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8,
        9, 10,
      ],
    },
    // Start on 0
    {
      startOn: 0,
      year: 2021,
      month: 8,
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11,
      ],
    },
    {
      startOn: 0,
      year: 2021,
      month: 10,
      days: [
        26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3,
        4, 5, 6,
      ],
    },
    {
      startOn: 0,
      year: 2021,
      month: 11,
      days: [
        31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11,
      ],
    },
    {
      startOn: 0,
      year: 2021,
      month: 12,
      days: [
        28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5,
        6, 7, 8,
      ],
    },
    {
      startOn: 0,
      year: 2022,
      month: 1,
      days: [
        26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1,
        2, 3, 4, 5,
      ],
    },
    {
      startOn: 0,
      year: 2022,
      month: 2,
      days: [
        30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12,
      ],
    },
    {
      startOn: 0,
      year: 2022,
      month: 3,
      days: [
        27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7,
        8, 9,
      ],
    },
    // Start on 2
    {
      startOn: 2,
      year: 2021,
      month: 9,
      days: [
        31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11,
      ],
    },
  ];

  batch.forEach(({ year, month, startOn, days }) => {
    test(`${year}-${month} start on ${startOn}`, () => {
      const calendar = create({ year, month }, { firstDay: startOn });
      // console.log(
      //   "calendar",
      //   calendar.days.map((d) => d.day)
      // );
      expect(calendar.days.map((day) => day.day)).toStrictEqual(days);
    });
  });
});

describe("limit days", () => {
  test("days after (start monday)", () => {
    const calendar = create(
      { year: 2021, month: 9 },
      { firstDay: 1, after: new Date(2021, 8, 5) }
    );

    expect(calendar.days.map((day) => day.state)).toStrictEqual([
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
    ]);
  });

  test("days before (start monday)", () => {
    const calendar = create(
      { year: 2021, month: 9 },
      { firstDay: 1, before: new Date(2021, 8, 28) }
    );

    expect(calendar.days.map((day) => day.state)).toStrictEqual([
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
    ]);
  });

  test("days after and before (start monday)", () => {
    const calendar = create(
      { year: 2021, month: 9 },
      {
        firstDay: 1,
        after: new Date(2021, 8, 5),
        before: new Date(2021, 8, 28),
      }
    );

    expect(calendar.days.map((day) => day.state)).toStrictEqual([
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "valid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
      "invalid",
    ]);
  });
});

describe("fillWeek", () => {
  test("off (start monday)", () => {
    const calendar = create(
      { year: 2021, month: 9 },
      { fillWeek: false, firstDay: 1 }
    );

    expect(calendar.days.map((day) => day.day)).toStrictEqual([
      30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3,
    ]);
  });

  test("off (start sunday)", () => {
    const calendar = create({ year: 2021, month: 9 }, { fillWeek: false });

    expect(calendar.days.map((day) => day.day)).toStrictEqual([
      29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2,
    ]);
  });
});

describe("selection", () => {
  test("single", () => {
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

  test("short", () => {
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

  test("long", () => {
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

  test("from previous", () => {
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

  test("into next", () => {
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

  test("a miss", () => {
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

  test("all included", () => {
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
});
