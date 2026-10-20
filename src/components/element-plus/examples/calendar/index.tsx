"use client";

import { useRef, useState } from "react";
import { ElButton, ElButtonGroup } from "@/components/element-plus/button";
import { ElCalendar, type CalendarDateType, type CalendarRef } from "@/components/element-plus/calendar";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElConfigProvider, en } from "@/components/element-plus/config-provider";
import { Check } from "@/components/element-plus/icons";
import type { ReactNode } from "react";

export function CalendarExampleLocale({ children }: { children: ReactNode }) {
  return <ElConfigProvider locale={en}>{children}</ElConfigProvider>;
}

export function CalendarBasic() {
  const [value, setValue] = useState(new Date());
  return (
    <CalendarExampleLocale>
      <ElCalendar value={value} onChange={setValue} />
    </CalendarExampleLocale>
  );
}

export function CalendarController() {
  const [controllerType, setControllerType] = useState<"select" | "button">("select");
  const [value, setValue] = useState(new Date());
  return (
    <CalendarExampleLocale>
      <ElRadioGroup value={controllerType} onChange={(next) => setControllerType(next as "select" | "button")}>
        <ElRadio value="select" button>select</ElRadio>
        <ElRadio value="button" button>button</ElRadio>
      </ElRadioGroup>
      <ElCalendar value={value} onChange={setValue} controllerType={controllerType} />
    </CalendarExampleLocale>
  );
}

export function CalendarCustomize() {
  return (
    <CalendarExampleLocale>
      <ElCalendar renderDateCell={(data) => (
        <p className={data.isSelected ? "is-selected" : ""}>
          {data.day.split("-").slice(1).join("-")}
          {data.isSelected && <Check width="1em" height="1em" />}
        </p>
      )} />
    </CalendarExampleLocale>
  );
}

export function CalendarRange() {
  return (
    <CalendarExampleLocale>
      <ElCalendar range={[new Date(2019, 2, 4), new Date(2019, 2, 24)]} />
    </CalendarExampleLocale>
  );
}

export function CalendarHeader() {
  const calendar = useRef<CalendarRef>(null);
  const selectDate = (type: CalendarDateType) => calendar.current?.selectDate(type);
  return (
    <CalendarExampleLocale>
      <ElCalendar ref={calendar} renderHeader={(date) => <>
        <span>Custom header content</span>
        <span>{date}</span>
        <ElButtonGroup>
          <ElButton size="small" onClick={() => selectDate("prev-year")}>Previous Year</ElButton>
          <ElButton size="small" onClick={() => selectDate("prev-month")}>Previous Month</ElButton>
          <ElButton size="small" onClick={() => selectDate("today")}>Today</ElButton>
          <ElButton size="small" onClick={() => selectDate("next-month")}>Next Month</ElButton>
          <ElButton size="small" onClick={() => selectDate("next-year")}>Next Year</ElButton>
        </ElButtonGroup>
      </>} />
    </CalendarExampleLocale>
  );
}
