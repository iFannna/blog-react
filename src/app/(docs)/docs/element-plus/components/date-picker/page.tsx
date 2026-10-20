import type { Metadata } from "next";
import Link from "next/link";
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
  DatePickerQuarterRange,
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

  quarterRange: `const [value, setValue] = useState<DateModelValue>(null);

<ElDatePicker value={value} onChange={setValue} type="quarterrange" />`,

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
`;

export default function DatePickerPage() {
  return (
    <>
      <h1>DatePicker 日期选择器</h1>
      <p>用于选择或输入日期</p>

      <Heading level={2}>选择某一天</Heading>
      <p>以”日“为基本单位，基础的日期选择控件</p>
      <p>
        基本单位由 <code>type</code> 属性指定。通过 <code>shortcuts</code>{" "}
        配置快捷选项，通过 <code>disabledDate</code> 函数，来设置禁用掉的日期。
      </p>
      <DemoBlock source={SOURCES.enterDate}>
        <DatePickerEnterDate />
      </DemoBlock>

      <Heading level={2}>其他日期单位</Heading>
      <p>
        You can choose week, month, year, quarter or multiple dates by extending the
        standard date picker component.
      </p>
      <DemoBlock source={SOURCES.otherMeasurements}>
        <DatePickerOtherMeasurements />
      </DemoBlock>

      <Heading level={2}>选择一段时间</Heading>
      <p>你可以通过如下例子来学习如何设置一个日期范围选择器。</p>
      <p>
        在选择日期范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前月份，可以使用{" "}
        <code>unlink-panels</code> 属性解除联动。
      </p>
      <DemoBlock source={SOURCES.dateRange}>
        <DatePickerDateRange />
      </DemoBlock>

      <Heading level={2}>选择月份范围</Heading>
      <p>你当然还可以选择一个月的范围。</p>
      <p>
        在选择月份范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前年份，可以使用{" "}
        <code>unlink-panels</code> 属性解除联动。
      </p>
      <DemoBlock source={SOURCES.monthRange}>
        <DatePickerMonthRange />
      </DemoBlock>

      <Heading level={2} id="年份范围">
        年份范围 <span className="docs-version-tag">2.8.0</span>
      </Heading>
      <p>你可以通过如下例子来学习如何设置一个年份范围选择器。</p>
      <p>
        在选择范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前年份，可以使用{" "}
        <code>unlink-panels</code> 属性解除联动。
      </p>
      <DemoBlock source={SOURCES.yearRange}>
        <DatePickerYearRange />
      </DemoBlock>

      <Heading level={2} id="quarter-range">
        Quarter Range <span className="docs-version-tag">2.14.5</span>
      </Heading>
      <p>Picking a quarter range is supported.</p>
      <p>
        在选择范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前年份，可以使用{" "}
        <code>unlink-panels</code> 属性解除联动。
      </p>
      <DemoBlock source={SOURCES.quarterRange}>
        <DatePickerQuarterRange />
      </DemoBlock>

      <Heading level={2} id="单个面板">
        单个面板 <span className="docs-version-tag">2.14.0</span>
      </Heading>
      <p>
        默认日期选择器范围有两个面板。如果你想要一个面板设置{" "}
        <code>single-panel</code> 属性。
      </p>
      <DemoBlock source={SOURCES.singlePanel}>
        <DatePickerSinglePanel />
      </DemoBlock>

      <Heading level={2}>默认值</Heading>
      <p>
        日期选择器会在用户未选择任何日期的时候默认展示当天的日期。你也可以使用{" "}
        <code>default-value</code>{" "}
        来修改这个默认的日期。请注意该值需要是一个可以解析的{" "}
        <code>new Date()</code> 对象。
      </p>
      <p>
        如果类型是 <code>daterange</code>, <code>default-value</code>{" "}
        则会设置左边窗口的默认值。
      </p>
      <DemoBlock source={SOURCES.defaultValue}>
        <DatePickerDefaultValue />
      </DemoBlock>

      <Heading level={2}>日期格式</Heading>
      <p>
        使用<code>format</code>指定输入框的格式。使用 <code>value-format</code>{" "}
        指定绑定值的格式。
      </p>
      <p>
        默认情况下，组件接受并返回<code>Date</code>对象。
      </p>
      <p>
        在{" "}
        <a href="https://day.js.org/docs/en/display/format#list-of-all-available-formats">
          这里
        </a>{" "}
        查看 Day.js 支持的所有格式。
      </p>
      <DocsContent
        source={`:::warning

请一定要注意传入参数的大小写是否正确

:::`}
      />
      <DemoBlock source={SOURCES.formats}>
        <DatePickerFormats />
      </DemoBlock>

      <Heading level={2}>默认显示日期</Heading>
      <p>在选择日期范围时，你可以指定起始日期和结束日期的默认时间。</p>
      <p>
        默认情况下，开始日期和结束日期的时间部分都是选择日期当日的{" "}
        <code>00:00:00</code>。通过 <code>default-time</code>{" "}
        可以分别指定开始日期和结束日期的具体时刻。它接受最多两个日期对象的数组。其中第一项控制起始日期的具体时刻，第二项控制结束日期的具体时刻。
      </p>
      <DemoBlock source={SOURCES.defaultTime}>
        <DatePickerDefaultTime />
      </DemoBlock>

      <Heading level={2}>设置自定义前缀的内容</Heading>
      <p>前缀内容可以被自定义。</p>
      <p>
        当你从其他vue组件或由渲染函数生成的组件中导入组件时, 你可以设置{" "}
        <code>prefix-icon</code> 属性来定制前缀内容
      </p>
      <DemoBlock source={SOURCES.customPrefix}>
        <DatePickerCustomPrefix />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        弹出框的内容是可以自定义的，在插槽内你可以获取到当前单元格的数据请注意，自定义内容结构应与默认结构一致，否则可能风格会不一致。
      </p>
      <DemoBlock source={SOURCES.customContent}>
        <DatePickerCustomContent />
      </DemoBlock>

      <Heading level={2} id="自定义图标">
        自定义图标 <span className="docs-version-tag">2.8.0</span>
      </Heading>
      <p>使用插槽自定义图标。</p>
      <DemoBlock source={SOURCES.customIcon}>
        <DatePickerCustomIcon />
      </DemoBlock>

      <Heading level={2}>国际化</Heading>
      <p>
        由于 Element Plus 的默认语言为英语，如果你需要设置其它的语言，请参考
        <Link href="/zh-CN/guide/i18n">国际化</Link>文档。
      </p>
      <p>
        要注意的是：日期相关的文字（月份，每一周的第一天等等）也都是通过国际化来配置的。
      </p>

      <DocsContent source={API_MD} />
    </>
  );
}
