"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { ElConfigProvider, en } from "@/components/element-plus/config-provider";
import { ElDatePicker } from "@/components/element-plus/date-picker";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CaretLeft, CaretRight } from "@/components/element-plus/icons";
import type {
  DateModelValue,
  DateShortcut,
} from "@/components/element-plus/date-picker";

const containerStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  padding: 0,
  flexWrap: "wrap",
};

const blockStyle: CSSProperties = {
  padding: "30px 0",
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
  marginBottom: 20,
};

function DateTimePickerBasicDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);
  const [value3, setValue3] = useState<DateModelValue>(null);
  const defaultTime = new Date(2000, 1, 1, 12, 0, 0);

  const shortcuts: DateShortcut[] = [
    { text: "Today", value: new Date() },
    {
      text: "Yesterday",
      value: () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
      },
    },
    {
      text: "A week ago",
      value: () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
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
          type="datetime"
          placeholder="Select date and time"
        />
      </div>
      <div style={blockStyle}>
        <span style={demonstrationStyle}>With shortcuts</span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="datetime"
          placeholder="Select date and time"
          shortcuts={shortcuts}
        />
      </div>
      <div style={lastBlockStyle}>
        <span style={demonstrationStyle}>With default time</span>
        <ElDatePicker
          value={value3}
          onChange={setValue3}
          type="datetime"
          placeholder="Select date and time"
          defaultTime={defaultTime}
        />
      </div>
    </div>
  );
}

function DateTimePickerRangeDemo() {
  const [value1, setValue1] = useState<DateModelValue>([
    new Date(2000, 10, 10, 10, 10),
    new Date(2000, 10, 11, 10, 10),
  ]);
  const [value2, setValue2] = useState<DateModelValue>(null);

  const shortcuts: DateShortcut[] = [
    {
      text: "Last week",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return [start, end];
      },
    },
    {
      text: "Last month",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        return [start, end];
      },
    },
    {
      text: "Last 3 months",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
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
          type="datetimerange"
          rangeSeparator="To"
          startPlaceholder="Start date"
          endPlaceholder="End date"
        />
      </div>
      <div style={lastBlockStyle}>
        <span style={demonstrationStyle}>With shortcuts</span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="datetimerange"
          shortcuts={shortcuts}
          rangeSeparator="To"
          startPlaceholder="Start date"
          endPlaceholder="End date"
        />
      </div>
    </div>
  );
}

function DateTimePickerDefaultTimeDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0);
  const defaultTime2: [Date, Date] = [
    new Date(2000, 1, 1, 12, 0, 0),
    new Date(2000, 2, 1, 8, 0, 0),
  ];

  return (
    <div style={containerStyle}>
      <div style={blockStyle}>
        <span style={demonstrationStyle}>Start and end date time 12:00:00</span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="datetimerange"
          startPlaceholder="Start Date"
          endPlaceholder="End Date"
          defaultTime={defaultTime1}
        />
      </div>
      <div style={lastBlockStyle}>
        <span style={demonstrationStyle}>
          Start date time 12:00:00, end date time 08:00:00
        </span>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="datetimerange"
          startPlaceholder="Start Date"
          endPlaceholder="End Date"
          defaultTime={defaultTime2}
        />
      </div>
    </div>
  );
}

function DateTimePickerFormatsDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);
  const [value3, setValue3] = useState<DateModelValue>(null);

  return (
    <div style={containerStyle}>
      <div style={blockStyle}>
        <span style={demonstrationStyle}>Emits Date object</span>
        <div style={demonstrationStyle}>Value: {String(value1 ?? "")}</div>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD HH:mm:ss"
        />
      </div>
      <div style={blockStyle}>
        <span style={demonstrationStyle}>Use value-format</span>
        <div style={demonstrationStyle}>Value：{String(value2 ?? "")}</div>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD hh:mm:ss"
          valueFormat="YYYY-MM-DD h:m:s a"
        />
      </div>
      <div style={lastBlockStyle}>
        <span style={demonstrationStyle}>Timestamp</span>
        <div style={demonstrationStyle}>Value：{String(value3 ?? "")}</div>
        <ElDatePicker
          value={value3}
          onChange={setValue3}
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD hh:mm:ss"
          valueFormat="x"
        />
      </div>
    </div>
  );
}

function DateTimePickerPanelFormatsDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  return (
    <div
      style={{
        ...containerStyle,
        justifyContent: "space-around",
        alignItems: "stretch",
      }}
    >
      <div style={{ ...blockStyle, borderRight: "none" }}>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY-MM-DD HH:mm:ss"
          dateFormat="MMM DD, YYYY"
          timeFormat="HH:mm"
        />
      </div>
      <div
        style={{ width: 1, backgroundColor: "var(--el-border-color)" }}
      />
      <div style={{ ...blockStyle, borderRight: "none" }}>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="datetimerange"
          startPlaceholder="Start date"
          endPlaceholder="End date"
          format="YYYY-MM-DD HH:mm:ss"
          dateFormat="YYYY/MM/DD ddd"
          timeFormat="A hh:mm:ss"
        />
      </div>
    </div>
  );
}

function DateTimePickerSinglePanelDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);

  return (
    <div style={containerStyle}>
      <div style={{ ...blockStyle, borderRight: "none" }}>
        <span style={demonstrationStyle}>single-panel</span>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="datetimerange"
          singlePanel
        />
      </div>
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

function DateTimePickerCustomIconDemo() {
  const [value1, setValue1] = useState<DateModelValue>(null);
  const [value2, setValue2] = useState<DateModelValue>(null);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        padding: 0,
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "stretch",
      }}
    >
      <div style={{ ...blockStyle, borderRight: "none" }}>
        <ElDatePicker
          value={value1}
          onChange={setValue1}
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY-MM-DD HH:mm:ss"
          dateFormat="MMM DD, YYYY"
          timeFormat="HH:mm"
          {...customIcons}
        />
      </div>
      <div style={{ width: 1, backgroundColor: "var(--el-border-color)" }} />
      <div style={{ ...blockStyle, borderRight: "none" }}>
        <ElDatePicker
          value={value2}
          onChange={setValue2}
          type="datetimerange"
          startPlaceholder="Start date"
          endPlaceholder="End date"
          format="YYYY-MM-DD HH:mm:ss"
          dateFormat="YYYY/MM/DD ddd"
          timeFormat="A hh:mm:ss"
          unlinkPanels
          {...customIcons}
        />
      </div>
    </div>
  );
}

/** 官方文档 demo 运行在 en 语言环境，与站点正文语言无关。 */
function withEn(Component: () => ReactNode) {
  return function Demo() {
    return (
      <ElConfigProvider locale={en}>
        <Component />
      </ElConfigProvider>
    );
  };
}
export const DateTimePickerBasic = withEn(DateTimePickerBasicDemo);
export const DateTimePickerRange = withEn(DateTimePickerRangeDemo);
export const DateTimePickerDefaultTime = withEn(DateTimePickerDefaultTimeDemo);
export const DateTimePickerFormats = withEn(DateTimePickerFormatsDemo);
export const DateTimePickerPanelFormats = withEn(DateTimePickerPanelFormatsDemo);
export const DateTimePickerSinglePanel = withEn(DateTimePickerSinglePanelDemo);
export const DateTimePickerCustomIcon = withEn(DateTimePickerCustomIconDemo);
