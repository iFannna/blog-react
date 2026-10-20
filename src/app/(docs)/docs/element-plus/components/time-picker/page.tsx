import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TimePickerBasic,
  TimePickerBasicRange,
  TimePickerRange,
} from "@/components/element-plus/examples/time-picker";

export const metadata: Metadata = { title: "TimePicker 时间选择器" };

const SOURCES = {
  basic: `const [value1, setValue1] = useState<Date | null>(null);
const [value2, setValue2] = useState<Date | null>(null);

<ElTimePicker value={value1} onChange={(v) => setValue1(v as Date | null)} placeholder="Arbitrary time" />
<ElTimePicker value={value2} onChange={(v) => setValue2(v as Date | null)} arrowControl placeholder="Arbitrary time" />`,

  basicRange: `const [value, setValue] = useState<Date | null>(new Date(2016, 9, 10, 18, 30));

const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) result.push(i);
  return result;
};
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

<ElTimePicker
  value={value}
  onChange={(v) => setValue(v as Date | null)}
  disabledHours={disabledHours}
  disabledMinutes={disabledMinutes}
  disabledSeconds={disabledSeconds}
  placeholder="Arbitrary time"
/>`,

  range: `const [value1, setValue1] = useState<[Date, Date]>([
  new Date(2016, 9, 10, 8, 40),
  new Date(2016, 9, 10, 9, 40),
]);
const [value2, setValue2] = useState<[Date, Date]>([
  new Date(2016, 9, 10, 8, 40),
  new Date(2016, 9, 10, 9, 40),
]);

<ElTimePicker
  value={value1}
  onChange={(v) => setValue1(v as [Date, Date])}
  isRange
  rangeSeparator="To"
  startPlaceholder="Start time"
  endPlaceholder="End time"
/>
<ElTimePicker
  value={value2}
  onChange={(v) => setValue2(v as [Date, Date])}
  isRange
  arrowControl
  rangeSeparator="To"
  startPlaceholder="Start time"
  endPlaceholder="End time"
/>`,
};

const API_MD = `
## TimePicker API

### TimePicker Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，范围模式传长度为 2 的数组 | ^[Date] / ^[array]\\\`[Date, Date]\\\` / ^[number] / ^[string] | — |
| is-range | 是否选择时间范围 | ^[boolean] | false |
| format | 输入框显示格式 | ^[string] | HH:mm:ss |
| value-format | 绑定值格式，省略时绑定值是 Date | ^[string] | — |
| placeholder | 非范围模式的占位文本 | ^[string] | — |
| start-placeholder | 范围模式起始占位文本 | ^[string] | — |
| end-placeholder | 范围模式结束占位文本 | ^[string] | — |
| range-separator | 范围分隔符 | ^[string] | '-' |
| disabled | 是否禁用 | ^[boolean] | false |
| readonly | 是否只读 | ^[boolean] | false |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| size | 尺寸 | ^[enum]\\\`'large' \\| 'default' \\| 'small'\\\` | — |
| arrow-control | 是否用箭头按钮选择时间 | ^[boolean] | false |
| default-value | 面板默认时间 | ^[Date] / ^[array]\\\`[Date, Date]\\\` | — |
| disabled-hours | 不可选的小时 | ^[Function]\\\`(role: string, comparingDate?: Day) => number[]\\\` | — |
| disabled-minutes | 不可选的分钟 | ^[Function]\\\`(hour: number, role: string, comparingDate?: Day) => number[]\\\` | — |
| disabled-seconds | 不可选的秒 | ^[Function]\\\`(hour: number, minute: number, role: string, comparingDate?: Day) => number[]\\\` | — |
| id / name | 原生 id / name，范围模式可传数组 | ^[string] / ^[array] | — |
| aria-label | 同原生 aria-label | ^[string] | — |
| tabindex | 输入框 tabindex | ^[string] / ^[number] | 0 |
| prefix-icon | 自定义前缀图标 | ^[ReactNode] | Clock |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| popper-class | 浮层自定义类名 | ^[string] | — |
| popper-style | 浮层自定义样式 | ^[string] / ^[object] | — |
| teleported | 浮层是否挂载到 body | ^[boolean] | true |
| placement | 浮层位置 | ^[enum]\\\`Placement\\\` | bottom |
| fallback-placements | 翻转兜底位置列表 | ^[array] | ['bottom','top','right','left'] |
| save-on-blur | 失焦时未选值是否自动填入当前时间 | ^[boolean] | true |
| automatic-dropdown | 聚焦输入框时是否自动弹出面板 | ^[boolean] | true |
| empty-values | 空值集合 | ^[array] | — |
| value-on-clear | 清空时返回的值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### TimePicker Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化（对应 v-model） | ^[Function]\\\`(value: Date \\\\| [Date, Date] \\\\| string \\\\| number \\\\| null) => void\\\` |
| onValueChange | 面板关闭时，绑定值相对打开面板时发生变化（对应 change）；清空时无条件触发 | ^[Function]\\\`(value: Date \\\\| [Date, Date] \\\\| string \\\\| number \\\\| null) => void\\\` |
| visibleChange | 面板显隐变化（对应 visible-change） | ^[Function]\\\`(visible: boolean) => void\\\` |
| focus / blur | 输入框聚焦 / 失焦 | ^[Function]\\\`(event: FocusEvent) => void\\\` |
| clear | 点击清空图标 | ^[Function]\\\`() => void\\\` |

事件 prop 在 React 侧统一写成 \\\`onXxx\\\`：\\\`onChange\\\` / \\\`onValueChange\\\` / \\\`onVisibleChange\\\` / \\\`onFocus\\\` / \\\`onBlur\\\` / \\\`onClear\\\`。

### TimePicker Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 让输入框获得焦点 | ^[Function]\\\`() => void\\\` |
| blur | 让输入框失焦 | ^[Function]\\\`() => void\\\` |
| handleOpen | 打开面板 | ^[Function]\\\`() => void\\\` |
| handleClose | 关闭面板 | ^[Function]\\\`() => void\\\` |

通过 \\\`ref\\\` 传入即可取得上述方法。

### 子组件

| 组件 | 对应官方 | 说明 |
| --- | --- | --- |
| TimePanel | panel-time-pick.vue | 单点时间面板 |
| TimeRangePanel | panel-time-range.vue | 范围时间面板 |
| TimeSpinner | basic-time-spinner.vue | 时 / 分 / 秒三列选择器 |

`;

export default function TimePickerPage() {
  return (
    <>
      <h1>TimePicker 时间选择器</h1>
      <p>用于选择或输入时间。</p>

      <Heading level={2}>任意时间</Heading>
      <p>
        默认可以用鼠标滚轮选择时间，设置 <code>arrowControl</code> 后改用上下箭头按钮。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TimePickerBasic />
      </DemoBlock>

      <Heading level={2}>限制时间范围</Heading>
      <p>
        通过 <code>disabledHours</code>、<code>disabledMinutes</code>、
        <code>disabledSeconds</code> 限制可选时间。
      </p>
      <DemoBlock source={SOURCES.basicRange}>
        <TimePickerBasicRange />
      </DemoBlock>

      <Heading level={2}>任意时间范围</Heading>
      <p>
        添加 <code>isRange</code> 即可选择时间范围，范围模式同样支持{" "}
        <code>arrowControl</code>。
      </p>
      <DemoBlock source={SOURCES.range}>
        <TimePickerRange />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
