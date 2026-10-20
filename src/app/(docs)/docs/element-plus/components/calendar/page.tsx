import type { Metadata } from "next";
import Link from "next/link";
import DemoBlock from "../../../../_components/DemoBlock";
import DocsContent from "../../../../_components/DocsContent";
import { Heading } from "../../../../_components/Heading";
import {
  CalendarExampleLocale,
  CalendarBasic,
  CalendarController,
  CalendarCustomize,
  CalendarHeader,
  CalendarRange,
} from "@/components/element-plus/examples/calendar";

export const metadata: Metadata = { title: "Calendar 日历" };

const SOURCES = {
  basic: `const [value, setValue] = useState(new Date())

<ElCalendar value={value} onChange={setValue} />`,
  controller: `const [controllerType, setControllerType] = useState<'select' | 'button'>('select')
const [value, setValue] = useState(new Date())

<ElRadioGroup value={controllerType} onChange={setControllerType}>
  <ElRadio value="select" button>select</ElRadio>
  <ElRadio value="button" button>button</ElRadio>
</ElRadioGroup>
<ElCalendar value={value} onChange={setValue} controllerType={controllerType} />`,
  customize: `<ElCalendar
  renderDateCell={(data) => (
    <p className={data.isSelected ? 'is-selected' : ''}>
      {data.day.split('-').slice(1).join('-')}
      {data.isSelected && <Check />}
    </p>
  )}
/>`,
  range: `<ElCalendar range={[new Date(2019, 2, 4), new Date(2019, 2, 24)]} />`,
  header: `const calendar = useRef<CalendarRef>(null)
const selectDate = (type: CalendarDateType) => calendar.current?.selectDate(type)

<ElCalendar ref={calendar} renderHeader={(date) => <>
  <span>Custom header content</span>
  <span>{date}</span>
  <ElButtonGroup>
    <ElButton size="small" onClick={() => selectDate('prev-year')}>Previous Year</ElButton>
    <ElButton size="small" onClick={() => selectDate('prev-month')}>Previous Month</ElButton>
    <ElButton size="small" onClick={() => selectDate('today')}>Today</ElButton>
    <ElButton size="small" onClick={() => selectDate('next-month')}>Next Month</ElButton>
    <ElButton size="small" onClick={() => selectDate('next-year')}>Next Year</ElButton>
  </ElButtonGroup>
</>} />`,
};

const API_MD = `
## Calendar API

### Calendar Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[Date] | — |
| onChange | 选中日期变化 | ^[Function]\`(value: Date) => void\` | — |
| range | 时间范围，开始日期必须为周起始日，结束日期必须为周结束日，跨度不能超过两个月 | ^[array]\`[Date, Date]\` | — |
| controller-type | 日历头部控制器类型 | ^[enum]\`'button' \\| 'select'\` | button |
| formatter | controller-type 为 select 时格式化选项标签 | ^[Function]\`(value: number, type: 'year' \\| 'month') => string \\| number\` | — |
| render-date-cell | 自定义日期单元格 | ^[Function]\`(data: CalendarDateCellData) => ReactNode\` | — |
| render-header | 自定义头部 | ^[Function]\`(date: string, api: CalendarRef) => ReactNode\` | — |

### Calendar Date Cell Data

| 属性名 | 说明 | 类型 |
| --- | --- | --- |
| type | 日期所属月份 | ^[enum]\`'prev-month' \\| 'current-month' \\| 'next-month'\` |
| isSelected | 是否为当前选中日期 | ^[boolean] |
| day | YYYY-MM-DD 格式日期 | ^[string] |
| date | 单元格对应日期 | ^[Date] |

### Calendar Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| selectedDay | 当前选中日期 | ^[Date] / ^[undefined] |
| pickDay | 选择指定日期 | ^[Function]\`(day: Date) => void\` |
| selectDate | 切换到指定相对日期 | ^[Function]\`(type: CalendarDateType) => void\` |
| calculateValidatedDateRange | 根据开始与结束日期计算有效区间 | ^[Function]\`(start: Date, end: Date) => [Date, Date][]\` |

`;

export default function CalendarPage() {
  return <>
    <h1>Calendar 日历</h1>
    <p>显示日期</p>

    <Heading level={2}>基础用法</Heading>
    <p>
      设置 <code>value</code> 来指定当前显示的月份。如果 <code>value</code>{" "}
      未指定，则显示当月。 <code>value</code> 支持 <code>v-model</code> 双向绑定。
    </p>
    <DemoBlock source={SOURCES.basic}><CalendarExampleLocale><CalendarBasic /></CalendarExampleLocale></DemoBlock>

    <Heading level={2} id="控制器类型">
      控制器类型 <span className="docs-version-tag">2.13.1</span>
    </Heading>
    <p>
      您可以设置日历头部的控制器类型。设置 <code>select</code>时，您可以使用{" "}
      <code>formatter</code> 自定义 <code>label</code>。
    </p>
    <DemoBlock source={SOURCES.controller}><CalendarExampleLocale><CalendarController /></CalendarExampleLocale></DemoBlock>

    <Heading level={2}>自定义内容</Heading>
    <p>
      通过设置名为 <code>date-cell</code> 的 <code>scoped-slot</code>{" "}
      来自定义日历单元格中显示的内容。在 <code>scoped-slot</code> 可以获取到
      date（当前单元格的日期）, data（包括 type，isSelected，day
      属性）。详情解释参考下方的 API 文档。
    </p>
    <DemoBlock source={SOURCES.customize}><CalendarExampleLocale><CalendarCustomize /></CalendarExampleLocale></DemoBlock>

    <Heading level={2}>范围</Heading>
    <p>
      设置 <code>range</code>{" "}
      属性指定日历的显示范围。开始时间必须是周起始日，结束时间必须是周结束日，且时间跨度不能超过两个月。
    </p>
    <DemoBlock source={SOURCES.range}><CalendarExampleLocale><CalendarRange /></CalendarExampleLocale></DemoBlock>

    <Heading level={2}>自定义日历头部</Heading>
    <DemoBlock source={SOURCES.header}><CalendarExampleLocale><CalendarHeader /></CalendarExampleLocale></DemoBlock>

    <Heading level={2}>国际化</Heading>
    <p>
      由于 Element Plus 的默认语言为英语，如果你需要设置其它的语言，请参考<Link href="/zh-CN/guide/i18n">国际化</Link>文档。
    </p>
    <p>
      要注意的是：日期相关的文字（月份，每一周的第一天等等）也都是通过国际化来配置的。
    </p>

    <DocsContent source={API_MD} />
  </>;
}
