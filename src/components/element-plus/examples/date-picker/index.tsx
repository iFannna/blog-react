"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import "./date-picker-demo.module.css";
import "./date-picker-icon.module.css";

import { ElConfigProvider, en } from "@/components/element-plus/config-provider";
import { ElDatePicker } from "@/components/element-plus/date-picker";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CaretLeft, CaretRight } from "@/components/element-plus/icons";
import type {
  DateModelValue,
  DatePickerType,
  DateShortcut,
} from "@/components/element-plus/date-picker";

const containerStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  padding: 0,
  flexWrap: "wrap",
};

const blockStyle: CSSProperties = {
  padding: "24px 0",
  textAlign: "center",
  borderRight: "solid 1px var(--el-border-color)",
  flex: 1,
  minWidth: 300,
};

const lastBlockStyle: CSSProperties = {
  ...blockStyle,
  borderRight: "none",
};

const demonstrationStyle: CSSProperties = {
  display: "block",
  color: "var(--el-text-color-secondary)",
  fontSize: 14,
  marginBottom: "16px",
};

const centerBlockStyle: CSSProperties = {
  ...blockStyle,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const sizeOptions: Array<"large" | "default" | "small"> = [
  "large",
  "default",
  "small",
];

function DatePickerEnterDateDemo() {
  const [size, setSize] = useState<"large" | "default" | "small">("default");
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  const shortcuts: DateShortcut[] = [
    { text: "Today", value: new Date() },
    {
      text: "Yesterday",
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return date;
      },
    },
    {
      text: "A week ago",
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        return date;
      },
    },
  ];

  const disabledDate = (time: Date) => time.getTime() > Date.now();

  return (
    <>
      <ElRadioGroup
        value={size}
        aria-label="size control"
        className="date-picker-radio-group"
        onChange={(next) => setSize(next as "large" | "default" | "small")}
      >
        {sizeOptions.map((item) => (
          <ElRadio key={item} value={item} button>
            {item}
          </ElRadio>
        ))}
      </ElRadioGroup>
      <div style={containerStyle}>
        <div style={blockStyle}>
          <span style={demonstrationStyle}>Default</span>
          <ElDatePicker
            value={value1}
            onChange={setValue1}
            type="date"
            placeholder="Pick a day"
            size={size}
          />
        </div>
        <div style={lastBlockStyle}>
          <span style={demonstrationStyle}>Picker with quick options</span>
          <ElDatePicker
            value={value2}
            onChange={setValue2}
            type="date"
            placeholder="Pick a day"
            disabledDate={disabledDate}
            shortcuts={shortcuts}
            size={size}
          />
        </div>
      </div>
    </>
  );
}

function DatePickerOtherMeasurementsDemo() {
  const [week, setWeek] = useState<DateModelValue>(null);
  const [dates, setDates] = useState<DateModelValue>(null);
  const [year, setYear] = useState<DateModelValue>(null);
  const [years, setYears] = useState<DateModelValue>(null);
  const [month, setMonth] = useState<DateModelValue>(null);
  const [months, setMonths] = useState<DateModelValue>(null);
  const [quarter, setQuarter] = useState<DateModelValue>(null);
  const [quarters, setQuarters] = useState<DateModelValue>(null);

  const containerBlockStyle: CSSProperties = {
    flex: 1,
    minWidth: 300,
    borderRight: "solid 1px var(--el-border-color)",
  };

  const innerBlockStyle: CSSProperties = {
    padding: "24px 0",
    textAlign: "center",
  };

  const separatedBlockStyle: CSSProperties = {
    ...innerBlockStyle,
    borderTop: "solid 1px var(--el-border-color)",
  };

  return (
    <div style={containerStyle}>
      <div style={containerBlockStyle}>
        <div style={innerBlockStyle}>
          <span style={demonstrationStyle}>Week</span>
          <ElDatePicker
            value={week}
            onChange={setWeek}
            type="week"
            format="[Week] ww"
            placeholder="Pick a week"
          />
        </div>
        <div style={separatedBlockStyle}>
          <span style={demonstrationStyle}>Year</span>
          <ElDatePicker
            value={year}
            onChange={setYear}
            type="year"
            placeholder="Pick a year"
          />
        </div>
        <div style={separatedBlockStyle}>
          <span style={demonstrationStyle}>Month</span>
          <ElDatePicker
            value={month}
            onChange={setMonth}
            type="month"
            placeholder="Pick a month"
          />
        </div>
        <div style={separatedBlockStyle}>
          <span style={demonstrationStyle}>Quarter</span>
          <ElDatePicker
            value={quarter}
            onChange={setQuarter}
            type="quarter"
            placeholder="Pick a quarter"
          />
        </div>
      </div>
      <div style={{ ...containerBlockStyle, borderRight: "none" }}>
        <div style={innerBlockStyle}>
          <span style={demonstrationStyle}>Dates</span>
          <ElDatePicker
            value={dates}
            onChange={setDates}
            type="dates"
            placeholder="Pick one or more dates"
          />
        </div>
        <div style={separatedBlockStyle}>
          <span style={demonstrationStyle}>Years</span>
          <ElDatePicker
            value={years}
            onChange={setYears}
            type="years"
            placeholder="Pick one or more years"
          />
        </div>
        <div style={separatedBlockStyle}>
          <span style={demonstrationStyle}>Months</span>
          <ElDatePicker
            value={months}
            onChange={setMonths}
            type="months"
            placeholder="Pick one or more months"
          />
        </div>
        <div style={separatedBlockStyle}>
          <span style={demonstrationStyle}>Quarters</span>
          <ElDatePicker
            value={quarters}
            onChange={setQuarters}
            type="quarters"
            placeholder="Pick one or more quarters"
          />
        </div>
      </div>
    </div>
  );
}

function DatePickerDateRangeDemo() {
  const [size, setSize] = useState<"large" | "default" | "small">("default");
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  const shortcuts: DateShortcut[] = [
    {
      text: "Last week",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: "Last month",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      },
    },
    {
      text: "Last 3 months",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      },
    },
  ];

  const wideBlockStyle: CSSProperties = {
    ...centerBlockStyle,
    minWidth: 400,
  };

  return (
    <>
      <ElRadioGroup
        value={size}
        aria-label="size control"
        className="date-picker-radio-group"
        onChange={(next) => setSize(next as "large" | "default" | "small")}
      >
        {sizeOptions.map((item) => (
          <ElRadio key={item} value={item} button>
            {item}
          </ElRadio>
        ))}
      </ElRadioGroup>
      <div style={containerStyle}>
        <div style={wideBlockStyle}>
          <span style={demonstrationStyle}>Default</span>
          <ElDatePicker
            value={value1}
            onChange={setValue1}
            type="daterange"
            rangeSeparator="To"
            startPlaceholder="Start date"
            endPlaceholder="End date"
            size={size}
          />
        </div>
        <div style={{ ...wideBlockStyle, borderRight: "none" }}>
          <span style={demonstrationStyle}>With quick options</span>
          <ElDatePicker
            value={value2}
            onChange={setValue2}
            type="daterange"
            unlinkPanels
            rangeSeparator="To"
            startPlaceholder="Start date"
            endPlaceholder="End date"
            shortcuts={shortcuts}
            size={size}
          />
        </div>
      </div>
    </>
  );
}

function DatePickerMonthRangeDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  const shortcuts: DateShortcut[] = [
    { text: "This month", value: [new Date(), new Date()] },
    {
      text: "This year",
      value: () => {
        const end = new Date();
        const start = new Date(new Date().getFullYear(), 0);
        return [start, end];
      },
    },
    {
      text: "Last 6 months",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 6);
        return [start, end];
      },
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={blockStyle}>
        <span style={demonstrationStyle}>Default</span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="monthrange"
          rangeSeparator="To"
          startPlaceholder="Start month"
          endPlaceholder="End month"
        />
      </div>
      <div style={lastBlockStyle}>
        <span style={demonstrationStyle}>With quick options</span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="monthrange"
          unlinkPanels
          rangeSeparator="To"
          startPlaceholder="Start month"
          endPlaceholder="End month"
          shortcuts={shortcuts}
        />
      </div>
    </div>
  );
}

function DatePickerYearRangeDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  const shortcuts: DateShortcut[] = [
    { text: "This Year", value: [new Date(), new Date()] },
    {
      text: "Last 10 years",
      value: () => {
        const end = new Date();
        const start = new Date(
          new Date().setFullYear(new Date().getFullYear() - 10),
        );
        return [start, end];
      },
    },
    {
      text: "Next 50 years",
      value: () => {
        const start = new Date();
        const end = new Date(
          new Date().setFullYear(new Date().getFullYear() + 50),
        );
        return [start, end];
      },
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={blockStyle}>
        <span style={demonstrationStyle}>Default</span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="yearrange"
          rangeSeparator="To"
          startPlaceholder="Start Year"
          endPlaceholder="End Year"
        />
      </div>
      <div style={lastBlockStyle}>
        <span style={demonstrationStyle}>With quick options</span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="yearrange"
          unlinkPanels
          rangeSeparator="To"
          startPlaceholder="Start Year"
          endPlaceholder="End Year"
          shortcuts={shortcuts}
        />
      </div>
    </div>
  );
}


function DatePickerQuarterRangeDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  const shortcuts: DateShortcut[] = [
    {
      text: "This quarter",
      value: () => {
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        const start = new Date(now.getFullYear(), quarter * 3, 1);
        return [start, now];
      },
    },
    {
      text: "Last 4 quarters",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 12);
        return [start, end];
      },
    },
    {
      text: "Next 8 quarters",
      value: () => {
        const start = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + 24);
        return [start, end];
      },
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={blockStyle}>
        <span style={demonstrationStyle}>Default</span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="quarterrange"
          rangeSeparator="To"
          startPlaceholder="Start quarter"
          endPlaceholder="End quarter"
        />
      </div>
      <div style={lastBlockStyle}>
        <span style={demonstrationStyle}>With quick options</span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="quarterrange"
          unlinkPanels
          rangeSeparator="To"
          startPlaceholder="Start quarter"
          endPlaceholder="End quarter"
          shortcuts={shortcuts}
        />
      </div>
    </div>
  );
}

function DatePickerSinglePanelDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);
  const [value3, setValue3] = useState<DateModelValue>(null);
  const [value4, setValue4] = useState<DateModelValue>(null);

  const widthBlockStyle: CSSProperties = {
    ...centerBlockStyle,
    width: 300,
  };

  return (
    <div style={containerStyle} className="single-panels">
      <div style={widthBlockStyle}>
        <span style={{ ...demonstrationStyle, width: "100%" }}>date range</span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="daterange"
          singlePanel
        />
      </div>
      <div style={widthBlockStyle}>
        <span style={{ ...demonstrationStyle, width: "100%" }}>
          month range
        </span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="monthrange"
          singlePanel
        />
      </div>
      <div style={widthBlockStyle}>
        <span style={{ ...demonstrationStyle, width: "100%" }}>year range</span>
        <ElDatePicker
          value={value3}
          onChange={setValue3}
          type="yearrange"
          singlePanel
        />
      </div>
      <div style={{ ...widthBlockStyle, borderRight: "none" }}>
        <span style={{ ...demonstrationStyle, width: "100%" }}>
          quarter range
        </span>
        <ElDatePicker
          value={value4}
          onChange={setValue4}
          type="quarterrange"
          singlePanel
        />
      </div>
    </div>
  );
}

function DatePickerDefaultValueDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  return (
    <div style={containerStyle}>
      <div style={centerBlockStyle}>
        <span style={demonstrationStyle}>date</span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="date"
          placeholder="Pick a date"
          defaultValue={new Date(2010, 9, 1)}
        />
      </div>
      <div style={{ ...centerBlockStyle, borderRight: "none" }}>
        <span style={demonstrationStyle}>daterange</span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="daterange"
          startPlaceholder="Start Date"
          endPlaceholder="End Date"
          defaultValue={[new Date(2010, 9, 1), new Date(2010, 10, 1)]}
        />
      </div>
    </div>
  );
}

function DatePickerFormatsDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);
  const [value3, setValue3] = useState<DateModelValue>(null);

  return (
    <div style={containerStyle}>
      <div style={centerBlockStyle}>
        <span style={demonstrationStyle}>Emits Date object</span>
        <div style={{ ...demonstrationStyle, width: "100%" }}>
          Value: {String(value1 ?? "")}
        </div>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="date"
          placeholder="Pick a Date"
          format="YYYY/MM/DD"
        />
      </div>
      <div style={centerBlockStyle}>
        <span style={demonstrationStyle}>Use value-format</span>
        <div style={{ ...demonstrationStyle, width: "100%" }}>
          Value：{String(value2 ?? "")}
        </div>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="date"
          placeholder="Pick a Date"
          format="YYYY/MM/DD"
          valueFormat="YYYY-MM-DD"
        />
      </div>
      <div style={{ ...centerBlockStyle, borderRight: "none" }}>
        <span style={demonstrationStyle}>Timestamp</span>
        <div style={{ ...demonstrationStyle, width: "100%" }}>
          Value：{String(value3 ?? "")}
        </div>
        <ElDatePicker
          value={value3}
          onChange={setValue3}
          type="date"
          placeholder="Pick a Date"
          format="YYYY/MM/DD"
          valueFormat="x"
        />
      </div>
    </div>
  );
}

function DatePickerDefaultTimeDemo() {
  const [value, setValue] = useState<DateModelValue>(null);
  const [defaultTime] = useState<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
  ]);

  return (
    <div style={containerStyle}>
      <div style={{ ...blockStyle, flex: 1, padding: "30px 0", borderRight: "none" }}>
        <p style={{ margin: "0 0 16px" }}>
          Component value：{String(value ?? "")}
        </p>
        <ElDatePicker
          value={value}
          onChange={setValue}
          type="daterange"
          startPlaceholder="Start date"
          endPlaceholder="End date"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          defaultTime={defaultTime}
        />
      </div>
    </div>
  );
}

function DatePickerCustomPrefixDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);

  return (
    <div style={containerStyle}>
      <div style={{ ...blockStyle, padding: "30px 0", borderRight: "none" }}>
        <span style={{ ...demonstrationStyle, marginBottom: 20 }}>
          set prefix-icon
        </span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="date"
          placeholder="Pick a day"
          prefixIcon={<p style={{ margin: 0, lineHeight: "23.8px" }}>pre</p>}
        />
      </div>
    </div>
  );
}

const holidays = [
  "2021-10-01",
  "2021-10-02",
  "2021-10-03",
  "2021-10-04",
  "2021-10-05",
  "2021-10-06",
  "2021-10-07",
];

function DatePickerCustomContentDemo() {
  const [value, setValue] = useState<DateModelValue>("2021-10-29");
  const [month, setMonth] = useState<DateModelValue>(null);
  const [year, setYear] = useState<DateModelValue>(null);
  const [quarter, setQuarter] = useState<DateModelValue>(null);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <ElDatePicker
        value={value}
        onChange={setValue}
        type="date"
        placeholder="Pick a day"
        format="YYYY/MM/DD"
        valueFormat="YYYY-MM-DD"
        renderCell={(cell) => (
          <div
            style={{
              height: 30,
              padding: "3px 0",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                display: "block",
                margin: "0 auto",
                lineHeight: "24px",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "50%",
                background: cell.isCurrent ? "#626aef" : undefined,
                color: cell.isCurrent ? "#fff" : undefined,
              }}
            >
              {cell.text}
            </span>
            {cell.dayjs && holidays.includes(cell.dayjs.format("YYYY-MM-DD")) && (
              <span
                style={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  background: "var(--el-color-danger)",
                  borderRadius: "50%",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            )}
          </div>
        )}
      />
      <ElDatePicker
        value={month}
        onChange={setMonth}
        type="month"
        placeholder="Pick a month"
        renderCell={(cell) => (
          <div
            className="el-date-table-cell"
            style={cell.isCurrent ? { color: "#626aef" } : undefined}
          >
            <span className="el-date-table-cell__text">
              {(cell.text ?? 0) + 1}期
            </span>
          </div>
        )}
      />
      <ElDatePicker
        value={year}
        onChange={setYear}
        type="year"
        placeholder="Pick a year"
        renderCell={(cell) => (
          <div
            className="el-date-table-cell"
            style={cell.isCurrent ? { color: "#626aef" } : undefined}
          >
            <span className="el-date-table-cell__text">
              {(cell.text ?? 0) + 1}y
            </span>
          </div>
        )}
      />
      <ElDatePicker
        value={quarter}
        onChange={setQuarter}
        type="quarter"
        placeholder="Pick a quarter"
        renderCell={(cell) => (
          <div
            className="el-date-table-cell"
            style={cell.isCurrent ? { color: "#626aef" } : undefined}
          >
            <span className="el-date-table-cell__text">
              Q{(cell.text ?? 0) + 1}
            </span>
          </div>
        )}
      />
    </div>
  );
}

function PrevYearSvg() {
  return (
    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth="1" fillRule="evenodd">
        <g fill="currentColor">
          <path d="M8.73171,16.7949 C9.03264,17.0795 9.50733,17.0663 9.79196,16.7654 C10.0766,16.4644 10.0634,15.9897 9.76243,15.7051 L4.52339,10.75 L17.2471,10.75 C17.6613,10.75 17.9971,10.4142 17.9971,10 C17.9971,9.58579 17.6613,9.25 17.2471,9.25 L4.52112,9.25 L9.76243,4.29275 C10.0634,4.00812 10.0766,3.53343 9.79196,3.2325 C9.50733,2.93156 9.03264,2.91834 8.73171,3.20297 L2.31449,9.27241 C2.14819,9.4297 2.04819,9.62981 2.01448,9.8386 C2.00308,9.89058 1.99707,9.94459 1.99707,10 C1.99707,10.0576 2.00356,10.1137 2.01585,10.1675 C2.05084,10.3733 2.15039,10.5702 2.31449,10.7254 L8.73171,16.7949 Z" />
        </g>
      </g>
    </svg>
  );
}

function NextYearSvg() {
  return (
    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth="1" fillRule="evenodd">
        <g fill="currentColor">
          <path d="M11.2654,3.20511 C10.9644,2.92049 10.4897,2.93371 10.2051,3.23464 C9.92049,3.53558 9.93371,4.01027 10.2346,4.29489 L15.4737,9.25 L2.75,9.25 C2.33579,9.25 2,9.58579 2,10.0000012 C2,10.4142 2.33579,10.75 2.75,10.75 L15.476,10.75 L10.2346,15.7073 C9.93371,15.9919 9.92049,16.4666 10.2051,16.7675 C10.4897,17.0684 10.9644,17.0817 11.2654,16.797 L17.6826,10.7276 C17.8489,10.5703 17.9489,10.3702 17.9826,10.1614 C17.994,10.1094 18,10.0554 18,10.0000012 C18,9.94241 17.9935,9.88633 17.9812,9.83246 C17.9462,9.62667 17.8467,9.42976 17.6826,9.27455 L11.2654,3.20511 Z" />
        </g>
      </g>
    </svg>
  );
}

const customIcons = {
  prevMonthIcon: (
    <ElIcon>
      <CaretLeft />
    </ElIcon>
  ),
  nextMonthIcon: (
    <ElIcon>
      <CaretRight />
    </ElIcon>
  ),
  prevYearIcon: (
    <ElIcon>
      <PrevYearSvg />
    </ElIcon>
  ),
  nextYearIcon: (
    <ElIcon>
      <NextYearSvg />
    </ElIcon>
  ),
};

function DatePickerCustomIconDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);
  const [value3, setValue3] = useState<DateModelValue>(null);
  const [value4, setValue4] = useState<DateModelValue>(null);
  const [value5, setValue5] = useState<DateModelValue>(null);

  return (
    <div className="date-picker-icon-demo">
      <div className="icon-block">
        <div style={{ ...demonstrationStyle, width: "100%" }}>date</div>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="date"
          placeholder="Pick a day"
          format="YYYY/MM/DD"
          valueFormat="YYYY-MM-DD"
          {...customIcons}
        />
      </div>
      <div className="icon-block">
        <div style={{ ...demonstrationStyle, width: "100%" }}>date range</div>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="daterange"
          startPlaceholder="Start date"
          endPlaceholder="End date"
          format="YYYY/MM/DD"
          valueFormat="YYYY-MM-DD"
          unlinkPanels
          {...customIcons}
        />
      </div>
      <div className="icon-block">
        <div style={{ ...demonstrationStyle, width: "100%" }}>
          month range
        </div>
        <ElDatePicker
          value={value3}
          onChange={setValue3}
          type="monthrange"
          startPlaceholder="Start date"
          endPlaceholder="End date"
          format="YYYY/MM/DD"
          valueFormat="YYYY-MM-DD"
          unlinkPanels
          {...customIcons}
        />
      </div>
      <div className="icon-block">
        <div style={{ ...demonstrationStyle, width: "100%" }}>year range</div>
        <ElDatePicker
          value={value4}
          onChange={setValue4}
          type="yearrange"
          rangeSeparator="To"
          startPlaceholder="Start Year"
          endPlaceholder="End Year"
          {...customIcons}
        />
      </div>
      <div className="icon-block">
        <div style={{ ...demonstrationStyle, width: "100%" }}>
          quarter range
        </div>
        <ElDatePicker
          value={value5}
          onChange={setValue5}
          type="quarterrange"
          rangeSeparator="To"
          startPlaceholder="Start quarter"
          endPlaceholder="End quarter"
          {...customIcons}
        />
      </div>
    </div>
  );
}

function withEn(Component: () => ReactNode) {
  return function Demo() {
    return (
      <ElConfigProvider locale={en}>
        <Component />
      </ElConfigProvider>
    );
  };
}
export const DatePickerEnterDate = withEn(DatePickerEnterDateDemo);
export const DatePickerOtherMeasurements = withEn(DatePickerOtherMeasurementsDemo);
export const DatePickerDateRange = withEn(DatePickerDateRangeDemo);
export const DatePickerMonthRange = withEn(DatePickerMonthRangeDemo);
export const DatePickerYearRange = withEn(DatePickerYearRangeDemo);
export const DatePickerQuarterRange = withEn(DatePickerQuarterRangeDemo);
export const DatePickerSinglePanel = withEn(DatePickerSinglePanelDemo);
export const DatePickerDefaultValue = withEn(DatePickerDefaultValueDemo);
export const DatePickerFormats = withEn(DatePickerFormatsDemo);
export const DatePickerDefaultTime = withEn(DatePickerDefaultTimeDemo);
export const DatePickerCustomPrefix = withEn(DatePickerCustomPrefixDemo);
export const DatePickerCustomContent = withEn(DatePickerCustomContentDemo);
export const DatePickerCustomIcon = withEn(DatePickerCustomIconDemo);
