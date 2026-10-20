import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  InputNumberBasic,
  InputNumberControlled,
  InputNumberCustom,
  InputNumberDisabled,
  InputNumberFormatter,
  InputNumberPrecision,
  InputNumberSize,
  InputNumberStepStrictly,
  InputNumberSteps,
  InputNumberWithPrefixSuffix,
} from "@/components/element-plus/examples/input-number";

export const metadata: Metadata = { title: "Input Number 数字输入框" };

const SOURCES = {
  basic: `const [num, setNum] = useState<number | null>(1);

<ElInputNumber value={num} onChange={setNum} min={1} max={10} />`,

  disabled: `<ElInputNumber value={1} disabled />`,

  steps: `const [num, setNum] = useState<number | null>(5);

<ElInputNumber value={num} onChange={setNum} step={2} />`,

  stepStrictly: `const [num, setNum] = useState<number | null>(2);

<ElInputNumber value={num} onChange={setNum} step={2} stepStrictly />`,

  precision: `const [num, setNum] = useState<number | null>(1);

<ElInputNumber value={num} onChange={setNum} precision={2} step={0.1} max={10} />`,

  size: `<ElInputNumber value={num1} onChange={setNum1} size="large" />
<ElInputNumber value={num2} onChange={setNum2} />
<ElInputNumber value={num3} onChange={setNum3} size="small" />`,

  controlled: `<ElInputNumber
  value={num}
  onChange={setNum}
  min={1}
  max={10}
  controlsPosition="right"
  size="large"
/>
<ElInputNumber
  value={num}
  onChange={setNum}
  min={1}
  max={10}
  controlsPosition="right"
/>
<ElInputNumber
  value={num}
  onChange={setNum}
  min={1}
  max={10}
  controlsPosition="right"
  size="small"
/>`,

  custom: `<ElInputNumber value={num} onChange={setNum} />
<ElInputNumber
  value={num}
  onChange={setNum}
  decreaseIcon={<ElIcon><ArrowDown /></ElIcon>}
  increaseIcon={<ElIcon><ArrowUp /></ElIcon>}
/>`,

  withPrefixSuffix: `<ElInputNumber value={num} onChange={setNum} min={1} max={10} prefix={<span>￥</span>} />
<ElInputNumber value={num} onChange={setNum} min={1} max={10} suffix={<span>RMB</span>} />`,

  formatter: `<ElInputNumber
  value={input}
  onChange={setInput}
  formatter={(value) => \`$ \${value}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}
  parser={(value) => value.replace(/\\$\\s?|(,*)/g, "")}
/>`,
};

const API_MD = `
## InputNumber API

### InputNumber Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[number] / ^[null] | — |
| min | 允许的最小值 | ^[number] | Number.MIN_SAFE_INTEGER |
| max | 允许的最大值 | ^[number] | Number.MAX_SAFE_INTEGER |
| step | 增量步长 | ^[number] | 1 |
| step-strictly | 输入值只能为 step 的整数倍 | ^[boolean] | false |
| precision | 数值精度 | ^[number] | — |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | default |
| readonly | 同原生 readonly | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| controls | 是否显示控制按钮 | ^[boolean] | true |
| controls-position | 控制按钮的位置 | ^[enum]\`'' \\| 'right'\` | — |
| name | 原生 name | ^[string] | — |
| aria-label | 原生 aria-label | ^[string] | — |
| placeholder | 同原生 placeholder | ^[string] | — |
| id | 原生 id | ^[string] | — |
| value-on-clear | 输入框清空时赋的值 | ^[number] / ^[null] / ^[enum]\`'min' \\| 'max'\` | — |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| inputmode | 同原生 inputmode | ^[string] | — |
| align | 内部输入框的对齐方式 | ^[enum]\`'left' \\| 'center' \\| 'right'\` | 'center' |
| disabled-scientific | 是否禁用科学计数法输入（如 'e'） | ^[boolean] | false |
| tabindex | 同原生 tabindex | ^[string] / ^[number] | 0 |
| formatter | 展示值的格式化函数 | ^[Function]\`(value: string) => string\` | — |
| parser | 从格式化后的输入中还原值的函数 | ^[Function]\`(value: string) => string\` | — |

### InputNumber Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 值变化 | ^[Function]\`(currentValue: number \\| null, oldValue: number \\| null) => void\` |
| onBlur | 内部输入框失焦 | ^[Function]\`(event: FocusEvent) => void\` |
| onFocus | 内部输入框聚焦 | ^[Function]\`(event: FocusEvent) => void\` |

### InputNumber Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| decrease-icon | 自定义减少按钮图标 | \`decreaseIcon\` |
| increase-icon | 自定义增加按钮图标 | \`increaseIcon\` |
| prefix | 内部输入框前缀 | \`prefix\` |
| suffix | 内部输入框后缀 | \`suffix\` |

### InputNumber Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 使内部输入框获得焦点 | ^[Function]\`() => void\` |
| blur | 使内部输入框失去焦点 | ^[Function]\`() => void\` |
`;

export default function InputNumberPage() {
  return (
    <>
      <h1>Input Number 数字输入框</h1>
      <p>仅允许输入标准的数字值，可定义范围。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        绑定 <code>value</code> 与 <code>onChange</code> 即可使用，
        <code>min</code> 与 <code>max</code> 控制可输入的范围。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <InputNumberBasic />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        <code>disabled</code> 接受一个 boolean，设为 true 即可禁用整个组件。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <InputNumberDisabled />
      </DemoBlock>

      <Heading level={2}>步长</Heading>
      <p>
        通过 <code>step</code> 属性设置每次改变的步长。
      </p>
      <DemoBlock source={SOURCES.steps}>
        <InputNumberSteps />
      </DemoBlock>

      <Heading level={2}>严格步长</Heading>
      <p>
        <code>stepStrictly</code> 接受一个 boolean，设为 true 后输入值只能是
        <code>step</code> 的整数倍。
      </p>
      <DemoBlock source={SOURCES.stepStrictly}>
        <InputNumberStepStrictly />
      </DemoBlock>

      <Heading level={2}>精度</Heading>
      <p>
        通过 <code>precision</code> 属性设置数值精度。<code>precision</code> 必须是非负整数，
        且不能小于 <code>step</code> 的小数位数。
      </p>
      <DemoBlock source={SOURCES.precision}>
        <InputNumberPrecision />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        通过 <code>size</code> 属性设置尺寸，除默认外还有 <code>large</code>、
        <code>small</code>。
      </p>
      <DemoBlock source={SOURCES.size}>
        <InputNumberSize />
      </DemoBlock>

      <Heading level={2}>按钮位置</Heading>
      <p>
        设置 <code>controlsPosition</code> 决定控制按钮的位置，设为
        <code>right</code> 后按钮固定在右侧。
      </p>
      <DemoBlock source={SOURCES.controlled}>
        <InputNumberControlled />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>
        使用 <code>decreaseIcon</code> 与 <code>increaseIcon</code> 自定义控制按钮的图标。
      </p>
      <DemoBlock source={SOURCES.custom}>
        <InputNumberCustom />
      </DemoBlock>

      <Heading level={2}>前缀与后缀</Heading>
      <p>
        使用 <code>prefix</code> 与 <code>suffix</code> 为内部输入框添加前后缀。
      </p>
      <DemoBlock source={SOURCES.withPrefixSuffix}>
        <InputNumberWithPrefixSuffix />
      </DemoBlock>

      <Heading level={2}>格式化</Heading>
      <p>
        设置 <code>formatter</code> 展示格式化后的值，通常与 <code>parser</code> 搭配使用。
        设置 <code>formatter</code> 后内部输入框的 <code>type</code> 会变为
        <code>text</code>，允许输入非数字字符；组件内部用 <code>Number.parseFloat</code>
        解析，解析成功时把数值写回，解析为 NaN 时写入 <code>null</code>。
      </p>
      <DemoBlock source={SOURCES.formatter}>
        <InputNumberFormatter />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
