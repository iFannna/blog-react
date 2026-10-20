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
      <p>在同一个选择器里选择日期和时间</p>

      <DocsContent
        source={`:::tip

日期时间选择器来自日期选择器和时间选择器的组合。关于属性的更详细解释，请参阅日期选择器和时间选择器。

:::`}
      />

      <Heading level={2}>日期和时间点</Heading>
      <p>
        通过设置<code>type</code>属性为<code>datetime</code>
        ，即可在同一个选择器里同时进行日期和时间的选择。快捷方式的使用方法与 Date
        Picker 相同。
      </p>
      <DemoBlock source={SOURCES.dateAndTime}>
        <DateTimePickerBasic />
      </DemoBlock>

      <Heading level={2}>日期时间格式</Heading>
      <p>
        使用<code>format</code>指定输入框的格式。使用<code>value-format</code>
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
        <DateTimePickerFormats />
      </DemoBlock>

      <Heading level={2}>下拉列表中的日期和时间格式</Heading>
      <p>
        使用 <code>date-format</code> 和 <code>time-format</code>{" "}
        控制下拉列表面板输入框中显示的文本格式
      </p>
      <DemoBlock source={SOURCES.panelFormats}>
        <DateTimePickerPanelFormats />
      </DemoBlock>

      <Heading level={2}>日期和时间范围</Heading>
      <p>
        设置<code>type</code>为<code>datetimerange</code>即可选择日期和时间范围
      </p>
      <DemoBlock source={SOURCES.range}>
        <DateTimePickerRange />
      </DemoBlock>

      <Heading level={2} id="单个面板">
        单个面板 <span className="docs-version-tag">2.14.0</span>
      </Heading>
      <p>
        默认日期选择器范围有两个面板。如果你想要一个面板设置{" "}
        <code>single-panel</code> 属性。
      </p>
      <DemoBlock source={SOURCES.singlePanel}>
        <DateTimePickerSinglePanel />
      </DemoBlock>

      <Heading level={2}>默认的起始与结束时刻</Heading>
      <p>
        使用<code>datetimerange</code>
        进行范围选择时，在日期选择面板中选定起始与结束的日期，默认会使用该日期的
        <code>00:00:00</code>
        作为起始与结束的时刻；通过选项<code>default-time</code>
        可以控制选中起始与结束日期时所使用的具体时刻。我们可以使用{" "}
        <code>default-time</code> 属性来控制它。{" "}
        <code>default-time</code>
        接受一个数组，其中第一项控制起始日期的具体时刻，第二项控制结束日期的具体时刻。第一项控制开始日期的时间值，第二项控制结束日期的时间值。
      </p>
      <DemoBlock source={SOURCES.defaultTime}>
        <DateTimePickerDefaultTime />
      </DemoBlock>

      <Heading level={2} id="自定义图标">
        自定义图标 <span className="docs-version-tag">2.8.0</span>
      </Heading>
      <p>使用插槽自定义图标。</p>
      <DemoBlock source={SOURCES.customIcon}>
        <DateTimePickerCustomIcon />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
