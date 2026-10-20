import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TimeSelectBasic,
  TimeSelectFormats,
  TimeSelectRange,
} from "@/components/element-plus/examples/time-select";

export const metadata: Metadata = { title: "TimeSelect 时间选择" };

const SOURCES = {
  basic: `const [value, setValue] = useState<string | null>("");

<ElTimeSelect
  value={value}
  onChange={setValue}
  start="08:30"
  step="00:15"
  end="18:30"
  placeholder="Select time"
  style={{ width: 240 }}
/>`,

  formats: `const [value, setValue] = useState<string | null>("");

<ElTimeSelect
  value={value}
  onChange={setValue}
  start="00:00"
  step="00:30"
  end="23:59"
  placeholder="Select time"
  format="hh:mm A"
  style={{ width: 240 }}
/>`,

  range: `const [startTime, setStartTime] = useState<string | null>("");
const [endTime, setEndTime] = useState<string | null>("");

<ElTimeSelect
  value={startTime}
  onChange={setStartTime}
  maxTime={endTime}
  placeholder="Start time"
  start="08:30"
  step="00:15"
  end="18:30"
/>
<ElTimeSelect
  value={endTime}
  onChange={setEndTime}
  minTime={startTime}
  placeholder="End time"
  start="08:30"
  step="00:15"
  end="18:30"
/>`,
};

const API_MD = `
## TimeSelect API

### TimeSelect Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[string] / ^[null] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| include-end-time | 是否把 \`end\` 也作为可选项 | ^[boolean] | false |
| size | 输入框尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | default |
| placeholder | 占位文本，缺省取语言包的 \`el.select.placeholder\` | ^[string] | — |
| name | 同原生 input 的 name | ^[string] | — |
| id | 原生 id，供 FormItem 的 label 关联 | ^[string] | — |
| effect | 主题，可选 \`dark\` / \`light\` | ^[string] / ^[enum]\`'dark' \\| 'light'\` | light |
| prefix-icon | 自定义前缀图标 | ^[ReactNode] | Clock |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| start | 起始时间 | ^[string] | 09:00 |
| end | 结束时间 | ^[string] | 18:00 |
| step | 时间步长 | ^[string] | 00:30 |
| min-time | 最小时间，之前的时间项禁用 | ^[string] | — |
| max-time | 最大时间，之后的时间项禁用 | ^[string] | — |
| format | 时间格式，支持 dayjs 的 HH/H/hh/h/mm/m/ss/s/A/a 与 [] 字面量 | ^[string] | HH:mm |
| empty-values | 空值集合，见 ConfigProvider | ^[array] | — |
| value-on-clear | 清空时返回的值，见 ConfigProvider | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| popper-class | 下拉的自定义类名 | ^[string] | '' |
| popper-style | 下拉的自定义样式 | ^[string] / ^[object] | — |
| placement | 下拉位置（React 补充） | ^[enum]\`Placement\` | bottom-start |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### TimeSelect Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化（含清空，清空时收到 \`value-on-clear\`，缺省为 null） | ^[Function]\`(value: string \\| null) => void\` |
| onBlur | 输入框失焦 | ^[Function]\`(event: FocusEvent) => void\` |
| onFocus | 输入框聚焦 | ^[Function]\`(event: FocusEvent) => void\` |
| onClear | 点击清空图标 | ^[Function]\`() => void\` |

### TimeSelect Exposes

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 让输入框聚焦 | ^[Function]\`() => void\` |
| blur | 让输入框失焦 | ^[Function]\`() => void\` |
`;

export default function TimeSelectPage() {
  return (
    <>
      <h1>TimeSelect 时间选择</h1>
      <p>用于选择或输入日期</p>
      <p>可用时间范围是 00:00-23:59</p>

      <Heading level={2}>固定时间点</Heading>
      <p>提供几个固定的时间点供用户选择</p>
      <p>
        使用 <code>el-time-select</code> 标签，然后通过<code>start</code>、
        <code>end</code>和<code>step</code>指定起始时间，结束时间和步长。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TimeSelectBasic />
      </DemoBlock>

      <Heading level={2}>时间格式</Heading>
      <p>
        使用 <code>format</code> 属性来控制时间格式 (小时以及分钟)。
      </p>
      <p>
        在{" "}
        <a href="https://day.js.org/docs/zh-CN/display/format">这里</a>{" "}
        查看 Day.js 支持的 format 参数。
      </p>
      <DemoBlock source={SOURCES.formats}>
        <TimeSelectFormats />
      </DemoBlock>
      <DocsContent
        source={`:::warning

请一定要注意传入参数的大小写是否正确

:::`}
      />

      <Heading level={2}>固定时间范围</Heading>
      <p>
        如果先选中了开始（或结束）时间，则结束（或开始）时间的状态也将会随之改变。
      </p>
      <DemoBlock source={SOURCES.range}>
        <TimeSelectRange />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
