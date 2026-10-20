import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  InputOtpBasic,
  InputOtpCustomLength,
  InputOtpDisabled,
  InputOtpMask,
  InputOtpSeparator,
  InputOtpSizes,
  InputOtpTypes,
  InputOtpValidator,
} from "@/components/element-plus/examples/input-otp";

export const metadata: Metadata = { title: "InputOtp 一次性密码输入框" };

const SOURCES = {
  basic: `const [otp, setOtp] = useState("123");

<ElInputOtp value={otp} onChange={setOtp} />`,

  customLength: `const [otp1, setOtp1] = useState("");
const [otp2, setOtp2] = useState("");

<ElInputOtp value={otp1} onChange={setOtp1} length={4} />
<ElInputOtp value={otp2} onChange={setOtp2} length={8} />`,

  types: `<ElInputOtp value={otp1} onChange={setOtp1} type="outlined" />
<ElInputOtp value={otp2} onChange={setOtp2} type="filled" />
<ElInputOtp value={otp3} onChange={setOtp3} type="underlined" />`,

  sizes: `<ElInputOtp value={otp1} onChange={setOtp1} size="large" />
<ElInputOtp value={otp2} onChange={setOtp2} size="default" />
<ElInputOtp value={otp3} onChange={setOtp3} size="small" />`,

  disabled: `<ElInputOtp value={otp1} disabled />
<ElInputOtp value={otp1} disabled type="filled" />
<ElInputOtp value={otp1} disabled type="underlined" />

<ElInputOtp value={otp2} readonly />
<ElInputOtp value={otp2} readonly type="filled" />
<ElInputOtp value={otp2} readonly type="underlined" />`,

  mask: `const [otp, setOtp] = useState("123");

<ElInputOtp value={otp} onChange={setOtp} mask />`,

  separator: `<ElInputOtp separator="/" />
<ElInputOtp separator={(index) => (index & 1 ? "—" : "")} />
<ElInputOtp separatorSlot={() => "•"} />`,

  validator: `const onlyAllowNumber = (value: string) => /^\\d$/.test(value);
const onlyAllowLetter = (value: string) => /^[a-zA-Z]$/.test(value);

<ElInputOtp
  value={otp1}
  onChange={setOtp1}
  validator={onlyAllowNumber}
  inputmode="numeric"
/>
<ElInputOtp value={otp2} onChange={setOtp2} validator={onlyAllowLetter} />`,
};

const API_MD = `
## InputOtp API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | OTP 各框的值。数字不能有前导零，官方仅允许初始化时传数字 | ^[string] / ^[number] | undefined |
| length | OTP 输入框数量 | ^[number] | 6 |
| validator | 自定义校验函数，返回 false 时该字符不写入 | ^[Function]\`(char: string, index: number) => boolean\` | \`() => true\` |
| inputmode | 原生 \`inputmode\` 属性 | ^[string] | — |
| type | 输入框类型 | ^[enum]\`'outlined' \\| 'filled' \\| 'underlined'\` | outlined |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| mask | 是否密码模式（掩码显示） | ^[boolean] | — |
| disabled | 是否禁用 | ^[boolean] | undefined |
| readonly | 同原生 \`readonly\` | ^[boolean] | false |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| id | 原生 \`id\` 属性 | ^[string] | — |
| aria-label | 原生 \`aria-label\` 属性 | ^[string] | — |
| separator | 框之间的分隔符，字符串 / ReactNode / \`(index) => ReactNode\` | ^[string] / ^[ReactNode] / ^[Function] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| separator | 框之间的分隔符，作用域参数为当前框下标；提供即渲染 | \`separatorSlot={(index) => ReactNode}\` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 值更新，对应官方 \`update:modelValue\` | ^[Function]\`(value: string) => void\` |
| onValueChange | 失焦且值相比获焦时变化时触发，对应官方 \`change\` | ^[Function]\`(value: string) => void\` |
| onFinish | 所有框填满时触发，对应官方 \`finish\` | ^[Function]\`(value: string) => void\` |
| onFocus | 获焦时触发（跳过内部框之间的焦点转移） | ^[Function]\`(event: FocusEvent) => void\` |
| onBlur | 失焦时触发（跳过内部框之间的焦点转移） | ^[Function]\`(event: FocusEvent) => void\` |

### Exposes

通过 \`ref\` 获取，对应官方 \`defineExpose\`。

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| inputRefs | HTML input 元素数组 | ^[array]\`(HTMLInputElement \\| undefined)[]\` |
| focus | 聚焦到指定 OTP 框 | ^[Function]\`(index?: number) => void\` |
| blur | 让当前聚焦的 OTP 框失焦 | ^[Function]\`() => void\` |

## 未实现的官方能力

- \`separator\` 传 VNode（如官方示例 \`h('span', null, '—')\`）时的动态组件渲染：
  React 直接接收 ReactNode，语义一致，只是不再有 VNode 概念。
- \`separator\` 的默认插槽回退链（\`$slots.separator || separators[index]\`）在本实现里
  拆成 \`separatorSlot\` 与 \`separator\` 两个 prop，提供 \`separatorSlot\` 时优先且始终渲染。
`;

export default function InputOtpPage() {
  return (
    <>
      <h1>InputOtp 一次性密码输入框 ^(beta)</h1>
      <p>用于输入一次性密码（OTP）。</p>

      <Heading level={2}>基础用法</Heading>
      <DemoBlock source={SOURCES.basic}>
        <InputOtpBasic />
      </DemoBlock>

      <Heading level={2}>自定义长度</Heading>
      <p>
        通过 <code>length</code> 自定义输入框的数量。
      </p>
      <DemoBlock source={SOURCES.customLength}>
        <InputOtpCustomLength />
      </DemoBlock>

      <Heading level={2}>类型</Heading>
      <p>支持三种类型：outlined（默认）、filled、underlined。</p>
      <DemoBlock source={SOURCES.types}>
        <InputOtpTypes />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        支持三种尺寸：<code>large</code>、<code>default</code>、<code>small</code>。
      </p>
      <DemoBlock source={SOURCES.sizes}>
        <InputOtpSizes />
      </DemoBlock>

      <Heading level={2}>禁用与只读</Heading>
      <p>
        支持 <code>disabled</code> 与 <code>readonly</code> 状态。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <InputOtpDisabled />
      </DemoBlock>

      <Heading level={2}>掩码</Heading>
      <p>
        通过 <code>mask</code> 隐藏输入的字符。
      </p>
      <DemoBlock source={SOURCES.mask}>
        <InputOtpMask />
      </DemoBlock>

      <Heading level={2}>分隔符</Heading>
      <p>自定义 OTP 输入框之间的分隔符。</p>
      <DemoBlock source={SOURCES.separator}>
        <InputOtpSeparator />
      </DemoBlock>

      <Heading level={2}>自定义校验</Heading>
      <p>
        通过 <code>validator</code> 校验输入的字符，并用 <code>inputmode</code> 指定键盘类型。
      </p>
      <DemoBlock source={SOURCES.validator}>
        <InputOtpValidator />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
