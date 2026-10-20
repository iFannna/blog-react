import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  DateTimePickerBasic,
  DateTimePickerCustomIcon,
  DateTimePickerDefaultTime,
  DateTimePickerFormats,
  DateTimePickerPanelFormats,
  DateTimePickerRange,
  DateTimePickerSinglePanel,
} from "@/components/element-plus/examples/datetime-picker";

export const metadata: Metadata = {
  title: "DateTimePicker 日期时间选择器",
};

const SOURCES = {
  dateAndTime: `const [value1, setValue1] = useState<DateModelValue>(null);
const [value2, setValue2] = useState<DateModelValue>(null);
const [value3, setValue3] = useState<DateModelValue>(null);
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);

const shortcuts: DateShortcut[] = [
  { text: "Today", value: new Date() },
  // ...
];

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="datetime"
  placeholder="Select date and time"
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="datetime"
  placeholder="Select date and time"
  shortcuts={shortcuts}
/>
<ElDatePicker
  value={value3}
  onChange={setValue3}
  type="datetime"
  placeholder="Select date and time"
  defaultTime={defaultTime}
/>`,

  formats: `const [value1, setValue1] = useState<DateModelValue>(null);
const [value2, setValue2] = useState<DateModelValue>(null);
const [value3, setValue3] = useState<DateModelValue>(null);

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="datetime"
  format="YYYY/MM/DD HH:mm:ss"
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="datetime"
  format="YYYY/MM/DD hh:mm:ss"
  valueFormat="YYYY-MM-DD h:m:s a"
/>
<ElDatePicker
  value={value3}
  onChange={setValue3}
  type="datetime"
  format="YYYY/MM/DD hh:mm:ss"
  valueFormat="x"
/>`,

  panelFormats: `<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="datetime"
  placeholder="Pick a Date"
  format="YYYY-MM-DD HH:mm:ss"
  dateFormat="MMM DD, YYYY"
  timeFormat="HH:mm"
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="datetimerange"
  startPlaceholder="Start date"
  endPlaceholder="End date"
  format="YYYY-MM-DD HH:mm:ss"
  dateFormat="YYYY/MM/DD ddd"
  timeFormat="A hh:mm:ss"
/>`,

  range: `const [value1, setValue1] = useState<DateModelValue>([
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
  // ...
];

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="datetimerange"
  rangeSeparator="To"
  startPlaceholder="Start date"
  endPlaceholder="End date"
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="datetimerange"
  shortcuts={shortcuts}
  rangeSeparator="To"
  startPlaceholder="Start date"
  endPlaceholder="End date"
/>`,

  singlePanel: `<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="datetimerange"
  singlePanel
/>`,

  defaultTime: `const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0);
const defaultTime2: [Date, Date] = [
  new Date(2000, 1, 1, 12, 0, 0),
  new Date(2000, 2, 1, 8, 0, 0),
];

<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="datetimerange"
  startPlaceholder="Start Date"
  endPlaceholder="End Date"
  defaultTime={defaultTime1}
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="datetimerange"
  startPlaceholder="Start Date"
  endPlaceholder="End Date"
  defaultTime={defaultTime2}
/>`,

  customIcon: `<ElDatePicker
  value={value1}
  onChange={setValue1}
  type="datetime"
  format="YYYY-MM-DD HH:mm:ss"
  dateFormat="MMM DD, YYYY"
  timeFormat="HH:mm"
  prevMonthIcon={<ElIcon><CaretLeft /></ElIcon>}
  nextMonthIcon={<ElIcon><CaretRight /></ElIcon>}
  prevYearIcon={<ElIcon><svg>...</svg></ElIcon>}
  nextYearIcon={<ElIcon><svg>...</svg></ElIcon>}
/>
<ElDatePicker
  value={value2}
  onChange={setValue2}
  type="datetimerange"
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
## DateTimePicker API

DateTimePicker 由 DatePicker 与 TimePicker 派生，属性可参考两者的完整说明。

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value；范围选择器应为长度为 2 的数组 | ^[number] / ^[string] / ^[Date] / ^[array]\`number[] \\| string[] \\| Date[]\` | '' |
| readonly | 是否只读 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| size | 输入框尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | default |
| placeholder | 非范围模式的占位文本 | ^[string] | — |
| startPlaceholder | 范围模式起始占位文本 | ^[string] | — |
| endPlaceholder | 范围模式结束占位文本 | ^[string] | — |
| arrowControl | 是否用箭头按钮选择时间 | ^[boolean] | false |
| type | 选择器类型 | ^[enum]\`'year' \\| 'month' \\| 'date' \\| 'datetime' \\| 'week' \\| 'datetimerange' \\| 'daterange'\` | date |
| format | 输入框显示格式 | ^[string] | YYYY-MM-DD HH:mm:ss |
| popperClass | 下拉面板自定义类名 | ^[string] | — |
| popperStyle | 下拉面板自定义样式 | ^[string] / ^[object] | — |
| fallbackPlacements | 浮层兜底方位 | ^[array]\`Placement[]\` | ['bottom', 'top', 'right', 'left'] |
| placement | 下拉位置 | \`Placement\` | bottom |
| rangeSeparator | 范围分隔符 | ^[string] | '-' |
| defaultValue | 日历默认显示日期 | ^[object]\`Date \\| [Date, Date]\` | — |
| defaultTime | 选择日期后的默认时间，未设置时为 00:00:00 | ^[object]\`Date \\| [Date, Date]\` | — |
| valueFormat | 绑定值格式，不传时绑定值为 Date | ^[string] | — |
| dateFormat | 面板中日期显示格式 | ^[string] | YYYY-MM-DD |
| timeFormat | 面板中时间显示格式 | ^[string] | HH:mm:ss |
| id | 原生 input 的 id | ^[string] / ^[array]\`[string, string]\` | — |
| name | 原生 input 的 name | ^[string] | — |
| unlinkPanels | 范围选择时左右面板不联动 | ^[boolean] | false |
| singlePanel | 范围选择时只显示一个面板 | ^[boolean] | false |
| prefixIcon | 自定义前缀图标 | ^[string] / \`Component\` | Date |
| clearIcon | 自定义清空图标 | ^[string] / \`Component\` | CircleClose |
| shortcuts | 快捷选项 | ^[array]\`Array<{ text: string, value: Date \\| Function }>\` | — |
| disabledDate | 判断日期是否禁用 | ^[Function]\`(data: Date) => boolean\` | — |
| disabledHours | 不可选小时 | ^[Function]\`(role: string, comparingDate?: Dayjs) => number[]\` | — |
| disabledMinutes | 不可选分钟 | ^[Function]\`(hour: number, role: string, comparingDate?: Dayjs) => number[]\` | — |
| disabledSeconds | 不可选秒 | ^[Function]\`(hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]\` | — |
| cellClassName | 自定义单元格类名 | ^[Function]\`(data: Date) => string\` | — |
| teleported | 下拉是否挂载到 body | ^[boolean] | true |
| emptyValues | 组件空值配置 | ^[array] | — |
| valueOnClear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| showNow | 是否显示此刻按钮 | ^[boolean] | true |
| showFooter | 是否显示底栏，仅 datetime / datetimerange | ^[boolean] | true |
| showConfirm | 是否显示确认按钮 | ^[boolean] | true |
| showWeekNumber | 是否显示周数 | ^[boolean] | false |

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
| separator | 自定义范围分隔符内容 |
| prevMonthIcon / nextMonthIcon | 上 / 下个月图标 |
| prevYearIcon / nextYearIcon | 上 / 下一年图标 |

### Exposes

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]\`() => void\` |
| blur | 输入框失焦 | ^[Function]\`() => void\` |
`;

export default function DateTimePickerPage() {
  return (
    <>
      <h1>DateTimePicker 日期时间选择器</h1>
      <p>在一个选择器中选择日期与时间。</p>

      <Heading level={2}>日期和时间</Heading>
      <p>
        设置 <code>type=&quot;datetime&quot;</code> 即可同时选择日期与时间，快捷选项的用法与
        DatePicker 一致。
      </p>
      <DemoBlock source={SOURCES.dateAndTime}>
        <DateTimePickerBasic />
      </DemoBlock>

      <Heading level={2}>日期时间格式</Heading>
      <p>
        通过 <code>format</code> 控制输入框显示格式，通过{" "}
        <code>valueFormat</code> 控制绑定值格式。默认绑定与返回值均为 Date
        对象。
      </p>
      <DemoBlock source={SOURCES.formats}>
        <DateTimePickerFormats />
      </DemoBlock>

      <Heading level={2}>面板中的日期时间格式</Heading>
      <p>
        通过 <code>dateFormat</code> 与 <code>timeFormat</code> 控制下拉面板中
        输入框的显示格式。
      </p>
      <DemoBlock source={SOURCES.panelFormats}>
        <DateTimePickerPanelFormats />
      </DemoBlock>

      <Heading level={2}>日期时间范围</Heading>
      <p>
        设置 <code>type=&quot;datetimerange&quot;</code> 即可选择日期时间范围。
      </p>
      <DemoBlock source={SOURCES.range}>
        <DateTimePickerRange />
      </DemoBlock>

      <Heading level={2}>单面板</Heading>
      <p>
        范围选择器默认显示两个面板，通过 <code>singlePanel</code>
        只显示一个面板。
      </p>
      <DemoBlock source={SOURCES.singlePanel}>
        <DateTimePickerSinglePanel />
      </DemoBlock>

      <Heading level={2}>范围默认时间</Heading>
      <p>
        选择 <code>datetimerange</code> 类型时，默认起止时间均为{" "}
        <code>00:00:00</code>，可通过 <code>defaultTime</code> 控制。
      </p>
      <DemoBlock source={SOURCES.defaultTime}>
        <DateTimePickerDefaultTime />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>通过对应 props 自定义导航图标。</p>
      <DemoBlock source={SOURCES.customIcon}>
        <DateTimePickerCustomIcon />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
