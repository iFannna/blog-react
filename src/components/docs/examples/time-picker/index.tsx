"use client";

import { type CSSProperties, useState } from "react";
import { ElTimePicker } from "@/components/ui/time-picker";

/** 官方示例用 .example-basic .el-date-editor { margin: 8px } 撑开间距，这里改为根节点上的 margin。 */
const pickerStyle: CSSProperties = { margin: 8 };

function makeRange(start: number, end: number) {
  const result: number[] = [];
  for (let i = start; i <= end; i++) result.push(i);
  return result;
}

/** 官方 time-picker/basic 示例。 */
export function TimePickerBasic() {
  const [value1, setValue1] = useState<Date | null>(null);
  const [value2, setValue2] = useState<Date | null>(null);

  return (
    <div className="example-basic">
      <ElTimePicker
        value={value1}
        onChange={(next) => setValue1(next as Date | null)}
        placeholder="Arbitrary time"
        style={pickerStyle}
      />
      <ElTimePicker
        value={value2}
        onChange={(next) => setValue2(next as Date | null)}
        arrowControl
        placeholder="Arbitrary time"
        style={pickerStyle}
      />
    </div>
  );
}

/** 官方 time-picker/basic-range 示例：按小时 / 分钟 / 秒分别限制可选范围。 */
export function TimePickerBasicRange() {
  const [value, setValue] = useState<Date | null>(
    new Date(2016, 9, 10, 18, 30),
  );

  const disabledHours = () => makeRange(0, 16).concat(makeRange(19, 23));

  const disabledMinutes = (hour: number) => {
    if (hour === 17) return makeRange(0, 29);
    if (hour === 18) return makeRange(31, 59);
    return [];
  };

  const disabledSeconds = (hour: number, minute: number) => {
    if (hour === 18 && minute === 30) return makeRange(1, 59);
    return [];
  };

  return (
    <div className="example-basic">
      <ElTimePicker
        value={value}
        onChange={(next) => setValue(next as Date | null)}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        placeholder="Arbitrary time"
        style={pickerStyle}
      />
    </div>
  );
}

/** 官方 time-picker/range 示例：is-range 选择时间范围。 */
export function TimePickerRange() {
  const [value1, setValue1] = useState<[Date, Date]>([
    new Date(2016, 9, 10, 8, 40),
    new Date(2016, 9, 10, 9, 40),
  ]);
  const [value2, setValue2] = useState<[Date, Date]>([
    new Date(2016, 9, 10, 8, 40),
    new Date(2016, 9, 10, 9, 40),
  ]);

  return (
    <div className="demo-range">
      <ElTimePicker
        value={value1}
        onChange={(next) => setValue1(next as [Date, Date])}
        isRange
        rangeSeparator="To"
        startPlaceholder="Start time"
        endPlaceholder="End time"
        style={pickerStyle}
      />
      <ElTimePicker
        value={value2}
        onChange={(next) => setValue2(next as [Date, Date])}
        isRange
        arrowControl
        rangeSeparator="To"
        startPlaceholder="Start time"
        endPlaceholder="End time"
        style={pickerStyle}
      />
    </div>
  );
}
