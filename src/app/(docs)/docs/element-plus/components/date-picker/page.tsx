import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  DatePickerCustomContent,
  DatePickerCustomIcon,
  DatePickerCustomPrefix,
  DatePickerDateRange,
  DatePickerDefaultTime,
  DatePickerDefaultValue,
  DatePickerEnterDate,
  DatePickerFormats,
  DatePickerMonthRange,
  DatePickerOtherMeasurements,
  DatePickerSinglePanel,
  DatePickerYearRange,
} from "@/components/element-plus/examples/date-picker";

export const metadata: Metadata = {
  title: "DatePicker 日期选择器",
};

const SOURCES = {
  enterDate: `const [size, setSize] = useState<"large" | "default" | "small">("default");
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
  // ...
];

const disabledDate = (time: Date) => time.getTime() > Date.now();

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="date"
  placeholder="Pick a day"
  size={size}
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="date"
  placeholder="Pick a day"
  disabledDate={disabledDate}
  shortcuts={shortcuts}
  size={size}
/>`,

  otherMeasurements: `const [value1, setValue1] = useState<DateModelValue>(null);
// ...

<ElDatePicker value={value1} onChange={setValue1} type="week" format="[Week] ww" />
<ElDatePicker value={value2} onChange={setValue2} type="dates" />
<ElDatePicker value={value3} onChange={setValue3} type="year" />
<ElDatePicker value={value4} onChange={setValue4} type="years" />
<ElDatePicker value={value5} onChange={setValue5} type="month" />
<ElDatePicker value={value6} onChange={setValue6} type="months" />`,

  dateRange: `const shortcuts: DateShortcut[] = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  // ...
];

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="daterange"
  rangeSeparator="To"
  startPlaceholder="Start date"
  endPlaceholder="End date"
  size={size}
/>
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
/>`,

  monthRange: `const shortcuts: DateShortcut[] = [
  { text: "This month", value: [new Date(), new Date()] },
  {
    text: "This year",
    value: () => [
      new Date(new Date().getFullYear(), 0),
      new Date(),
    ],
  },
  // ...
];

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="monthrange"
  rangeSeparator="To"
  startPlaceholder="Start month"
  endPlaceholder="End month"
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="monthrange"
  unlinkPanels
  rangeSeparator="To"
  startPlaceholder="Start month"
  endPlaceholder="End month"
  shortcuts={shortcuts}
/>`,

  yearRange: `const shortcuts: DateShortcut[] = [
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
  // ...
];

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="yearrange"
  rangeSeparator="To"
  startPlaceholder="Start Year"
  endPlaceholder="End Year"
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="yearrange"
  unlinkPanels
  rangeSeparator="To"
  startPlaceholder="Start Year"
  endPlaceholder="End Year"
  shortcuts={shortcuts}
/>`,

  singlePanel: `<ElDatePicker value={value1} onChange={setValue1} type="daterange" singlePanel />
<ElDatePicker value={value2} onChange={setValue2} type="monthrange" singlePanel />
<ElDatePicker value={value3} onChange={setValue3} type="yearrange" singlePanel />`,

  defaultValue: `<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="date"
  placeholder="Pick a date"
  defaultValue={new Date(2010, 9, 1)}
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="daterange"
  startPlaceholder="Start Date"
  endPlaceholder="End Date"
  defaultValue={[new Date(2010, 9, 1), new Date(2010, 10, 1)]}
/>`,

  formats: `const [value1, setValue1] = useState<DateModelValue>(null);
const [value2, setValue2] = useState<DateModelValue>(null);
const [value3, setValue3] = useState<DateModelValue>(null);

<ElDatePicker value={value1} onChange={setValue1} format="YYYY/MM/DD" />
<ElDatePicker
  value={value2}
  onChange={setValue2}
  format="YYYY/MM/DD"
  valueFormat="YYYY-MM-DD"
/>
<ElDatePicker
  value={value3}
  onChange={setValue3}
  format="YYYY/MM/DD"
  valueFormat="x"
/>`,

  defaultTime: `const [defaultTime] = useState<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);

<ElDatePicker
  value={value}
  onChange={setValue}
  type="daterange"
  startPlaceholder="Start date"
  endPlaceholder="End date"
  valueFormat="YYYY-MM-DD HH:mm:ss"
  defaultTime={defaultTime}
/>`,

  customPrefix: `<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="date"
  placeholder="Pick a day"
  prefixIcon={<p>pre</p>}
/>`,

  customContent: `<ElDatePicker
  value={value}
  onChange={setValue}
  type="date"
  format="YYYY/MM/DD"
  valueFormat="YYYY-MM-DD"
  renderCell={(cell) => (
    <div className="cell" style={{ height: 30, padding: "3px 0" }}>
      <span
        className="text"
        style={{
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
      {cell.dayjs && isHoliday(cell) && <span className="holiday" />}
    </div>
  )}
/>
<ElDatePicker
  value={month}
  onChange={setMonth}
  type="month"
  renderCell={(cell) => (
    <div className="el-date-table-cell">
      <span className="el-date-table-cell__text">{cell.text + 1}期</span>
    </div>
  )}
/>`,

  customIcon: `<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="date"
  placeholder="Pick a day"
  prevMonthIcon={<ElIcon><CaretLeft /></ElIcon>}
  nextMonthIcon={<ElIcon><CaretRight /></ElIcon>}
  prevYearIcon={<ElIcon><svg>...</svg></ElIcon>}
  nextYearIcon={<ElIcon><svg>...</svg></ElIcon>}
/>`,

  customIconRange: `<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="daterange"
  startPlaceholder="Start date"
  endPlaceholder="End date"
  unlinkPanels
  prevMonthIcon={<ElIcon><CaretLeft /></ElIcon>}
  nextMonthIcon={<ElIcon><CaretRight /></ElIcon>}
  prevYearIcon={<ElIcon><svg>...</svg></ElIcon>}
  nextYearIcon={<ElIcon><svg>...</svg></ElIcon>}
/>`,
};

const API_MD = `
## DatePicker API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value；范围选择器应为长度为 2 的数组 | ^[number] / ^[string] / ^[Date] / ^[array]\`number[] \\| string[] \\| Date[]\` | '' |
| readonly | 是否只读 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| size | 输入框尺寸 | ^[enum]\`'' \\| 'large' \\| 'default' \\| 'small'\` | — |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| placeholder | 非范围模式的占位文本 | ^[string] | '' |
| startPlaceholder | 范围模式起始占位文本 | ^[string] | — |
| endPlaceholder | 范围模式结束占位文本 | ^[string] | — |
| type | 选择器类型 | ^[enum]\`'year' \\| 'years' \\| 'month' \\| 'months' \\| 'date' \\| 'dates' \\| 'datetime' \\| 'week' \\| 'datetimerange' \\| 'daterange' \\| 'monthrange' \\| 'yearrange'\` | date |
| format | 输入框显示格式 | ^[string] | YYYY-MM-DD |
| popperClass | 下拉面板自定义类名 | ^[string] | — |
| popperStyle | 下拉面板自定义样式 | ^[string] / ^[object] | — |
| rangeSeparator | 范围分隔符 | ^[string] | '-' |
| defaultValue | 日历默认显示日期 | ^[object]\`Date \\| [Date, Date]\` | — |
| defaultTime | 选择范围时使用的时间值 | ^[object]\`Date \\| [Date, Date]\` | — |
| valueFormat | 绑定值格式，不传时绑定值为 Date | ^[string] | — |
| id | 原生 input 的 id | ^[string] / ^[array]\`[string, string]\` | — |
| name | 原生 input 的 name | ^[string] / ^[array]\`[string, string]\` | '' |
| unlinkPanels | 范围选择时左右面板不联动 | ^[boolean] | false |
| singlePanel | 范围选择时只显示一个面板 | ^[boolean] | false |
| prefixIcon | 自定义前缀图标 | ^[string] / ^[object]\`Component\` | '' |
| clearIcon | 自定义清空图标 | ^[string] / ^[object]\`Component\` | CircleClose |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| disabledDate | 判断日期是否禁用 | ^[Function]\`(data: Date) => boolean\` | — |
| shortcuts | 快捷选项 | ^[array]\`Array<{ text: string, value: Date \\| Function }>\` | [] |
| cellClassName | 自定义单元格类名 | ^[Function]\`(data: Date) => string\` | — |
| teleported | 下拉是否挂载到 body | ^[boolean] | true |
| emptyValues | 组件空值配置 | ^[array] | — |
| valueOnClear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| fallbackPlacements | 浮层兜底方位 | ^[array]\`Placement[]\` | ['bottom', 'top', 'right', 'left'] |
| placement | 下拉位置 | \`Placement\` | bottom |
| showFooter | 是否显示底栏 | ^[boolean] | true |
| showConfirm | 是否显示确认按钮 | ^[boolean] | true |
| showWeekNumber | 是否显示周数 | ^[boolean] | false |
| automaticDropdown | 聚焦输入框时是否自动弹出 | ^[boolean] | true |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 用户确认值或点击外部时触发 | ^[Function]\`(val: typeof v-model) => void\` |
| onBlur | 输入框失焦时触发 | ^[Function]\`(e: FocusEvent) => void\` |
| onFocus | 输入框聚焦时触发 | ^[Function]\`(e: FocusEvent) => void\` |
| onClear | 点击清空按钮时触发 | ^[Function]\`() => void\` |
| onCalendarChange | 日历选中日期变化时触发，仅范围模式 | ^[Function]\`(val: [Date, null \\| Date]) => void\` |
| onPanelChange | 点击导航按钮时触发 | ^[Function]\`(date: Date \\| [Date, Date], mode: 'month' \\| 'year', view?: string) => void\` |
| onVisibleChange | 下拉出现 / 消失时触发 | ^[Function]\`(visibility: boolean) => void\` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| renderCell | 自定义单元格内容，对应官方 default 插槽 |
| separator | 自定义范围分隔符内容，对应官方 range-separator 插槽 |
| prevMonthIcon | 上个月图标 |
| nextMonthIcon | 下个月图标 |
| prevYearIcon | 上一年图标 |
| nextYearIcon | 下一年图标 |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]\`() => void\` |
| blur | 输入框失焦 | ^[Function]\`() => void\` |
| handleOpen | 打开下拉面板 | ^[Function]\`() => void\` |
| handleClose | 关闭下拉面板 | ^[Function]\`() => void\` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\` | \`value\` + \`onChange\` | 受控用法 |
| \`@change\` / \`@calendar-change\` / \`@panel-change\` | \`onValueChange\` / \`onCalendarChange\` / \`onPanelChange\` | 事件改为 on 前缀 |
| 默认插槽 \`#default\` | \`renderCell\` | 作用域插槽改为 render prop |
| \`range-separator\` 插槽 | \`separator\` | 具名插槽改为 ReactNode prop |
| prev/next 图标插槽 | \`prevMonthIcon\` 等 props | 具名插槽改为 ReactNode prop |
| \`ref\` + defineExpose | \`ref\` + \`DatePickerExpose\` | 方法名保持一致 |
`;

export default function DatePickerPage() {
  return (
    <>
      <h1>DatePicker 日期选择器</h1>
      <p>用于选择或输入日期，支持年、月、周、日期、日期时间与范围选择。</p>

      <Heading level={2}>输入日期</Heading>
      <p>
        通过 <code>type</code> 属性决定度量单位。通过 <code>shortcuts</code>
        启用快捷选项，通过 <code>disabledDate</code> 禁用日期。
      </p>
      <DemoBlock source={SOURCES.enterDate}>
        <DatePickerEnterDate />
      </DemoBlock>

      <Heading level={2}>其他度量</Heading>
      <p>扩展标准日期选择器，可以选择周、月、年或多选日期。</p>
      <DemoBlock source={SOURCES.otherMeasurements}>
        <DatePickerOtherMeasurements />
      </DemoBlock>

      <Heading level={2}>日期范围</Heading>
      <p>
        支持选择日期范围。范围模式下左右面板默认联动，可通过{" "}
        <code>unlinkPanels</code> 取消联动。
      </p>
      <DemoBlock source={SOURCES.dateRange}>
        <DatePickerDateRange />
      </DemoBlock>

      <Heading level={2}>月份范围</Heading>
      <p>
        支持选择月份范围。范围模式下左右面板默认联动，可通过{" "}
        <code>unlinkPanels</code> 取消联动。
      </p>
      <DemoBlock source={SOURCES.monthRange}>
        <DatePickerMonthRange />
      </DemoBlock>

      <Heading level={2}>年份范围</Heading>
      <p>
        支持选择年份范围。范围模式下左右面板默认联动，可通过{" "}
        <code>unlinkPanels</code> 取消联动。
      </p>
      <DemoBlock source={SOURCES.yearRange}>
        <DatePickerYearRange />
      </DemoBlock>

      <Heading level={2}>单面板</Heading>
      <p>
        范围选择器默认显示两个面板，通过 <code>singlePanel</code>
        只显示一个面板。
      </p>
      <DemoBlock source={SOURCES.singlePanel}>
        <DatePickerSinglePanel />
      </DemoBlock>

      <Heading level={2}>默认值</Heading>
      <p>
        未选择日期时默认显示当天日历，可通过 <code>defaultValue</code>{" "}
        指定其他日期。类型为 <code>daterange</code> 时，它设置左侧日历。
      </p>
      <DemoBlock source={SOURCES.defaultValue}>
        <DatePickerDefaultValue />
      </DemoBlock>

      <Heading level={2}>日期格式</Heading>
      <p>
        通过 <code>format</code> 控制输入框显示格式，通过{" "}
        <code>valueFormat</code> 控制绑定值格式。默认绑定与返回值均为 Date
        对象。
      </p>
      <DemoBlock source={SOURCES.formats}>
        <DatePickerFormats />
      </DemoBlock>

      <Heading level={2}>范围默认时间</Heading>
      <p>
        选择日期范围时可以指定起止日期的时间部分。默认均为{" "}
        <code>00:00:00</code>。
      </p>
      <DemoBlock source={SOURCES.defaultTime}>
        <DatePickerDefaultTime />
      </DemoBlock>

      <Heading level={2}>自定义前缀内容</Heading>
      <p>
        通过 <code>prefixIcon</code> 自定义前缀内容。
      </p>
      <DemoBlock source={SOURCES.customPrefix}>
        <DatePickerCustomPrefix />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        通过 <code>renderCell</code> 自定义单元格内容。自定义内容的结构应与默认结构一致，
        否则可能出现样式错位。
      </p>
      <DemoBlock source={SOURCES.customContent}>
        <DatePickerCustomContent />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>通过对应 props 自定义导航图标。</p>
      <DemoBlock source={SOURCES.customIcon}>
        <DatePickerCustomIcon />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
