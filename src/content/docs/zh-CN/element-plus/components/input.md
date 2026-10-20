---
title: "Input 输入框"
description: "通过鼠标或键盘输入字符。"
group: 表单组件
order: 100
---

# Input 输入框

通过鼠标或键盘输入字符

## 基础用法

:::demo

input/basic

:::

## 禁用状态

通过 `disabled` 属性指定是否禁用 input 组件

:::demo

input/disabled

:::

## 一键清空

使用`clearable`属性即可得到一个可一键清空的输入框在版本 ^(2.13.4) 之后，Input 的 textarea 类型也支持 clearable 功能。

:::demo

input/clearable

:::

## 自定义清除图标^(2.11.0)

你可以通过`clear-icon`属性自定义清除图标

:::demo

input/clear-icon

:::

## 格式化

在 `formatter`的情况下显示值，我们通常同时使用 `parser`

:::demo

input/formatter

:::

## 密码框

使用 `show-password` 属性即可得到一个可切换显示隐藏的密码框自 ^(2.13.6) 起，支持使用 `password-icon` 插槽覆盖默认图标。

:::demo

input/password

:::

## 带图标的输入框

带有图标标记输入类型

要在输入框中添加图标，你可以简单地使用 `prefix-icon` 和 `suffix-icon` 属性。另外， `prefix` 和 `suffix` 命名的插槽也能正常工作。

:::demo

input/with-icon

:::

## 文本域

用于输入多行文本信息可缩放的输入框。添加 `type="textarea"` 属性来将 `input` 元素转换为原生的 `textarea` 元素。

文本域高度可通过 `rows` 属性控制

:::demo

input/textarea

:::

## 自适应文本域

设置文字输入类型的 `autosize` 属性使得根据内容自动调整的高度。你可以给 `autosize` 提供一个包含有最大和最小高度的对象，让输入框自动调整。

:::demo

input/auto-sizing-textarea

:::

## 复合型输入框

可以在输入框中前置或后置一个元素，通常是标签或按钮。

可通过 `slot` 来指定在 Input 中分发的前置或者后置的内容。

:::demo

input/mixed-input

:::

## 尺寸

使用 `size` 属性改变输入框大小。除了默认大小外，还有另外两个选项： `large`, `small`。

:::demo

input/various-size

:::

## 输入长度限制

使用 `maxlength` 和 `minlength` 属性, 来控制输入内容的最大字数和最小字数。"字符数"使用JavaScript字符串长度来衡量。 为文本或文本输入类型设置 `maxlength` prop可以限制输入值的长度。 允许你通过设置 `show-word-limit` 到 `true` 来显示剩余字数。从 ^(2.11.5) 版本开始，你可以将 `word-limit-position` 设置为 `outside`，以在输入框外显示字数统计。

:::demo

input/length-limiting

:::

## 计数图形^(2.13.7)

设置 `count-graphemes` 以计算文本长度。如果设置了该属性，则不会使用原生的 `maxlength` 和 `minlength`。

:::tip

**浏览器支持 & 回退策略**

当使用 `count-graphemes` prop时，组件使用以下方法：

**主要**: 使用 `Intl.Segmenter` API (Chrome 87+, Firefox 125+, Safari 14.1+) 进行适当的图形集群处理。它能够正确处理复杂的表情符号、组合标记和0宽度连接符序列。

**回退**: 旧版浏览器会回退到 `Array.from()` 进行基于码点的迭代。请注意，这可能会拆分多码点字形序列（例如，带有肤色修饰符的表情符号）。

在实现自己的 `count-graphemes` 函数时，如果需要对复杂的 unicode 字符提供强大的支持，请考虑使用 `Intl.Segmenter`。

:::

:::demo

input/count-graphemes

:::

## Input API

### Input Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 原生 input 的 id | ^[string] | — |
| value | 绑定值 | ^[string] / ^[number] / ^[null] | — |
| modelModifiers | v-model 修饰符，React 中用对象显式传入 | ^[object]`{ lazy?: true, number?: true, trim?: true }` | — |
| type | 类型，支持原生 input 类型与 textarea | ^[string]`'text' \| 'textarea' \| 'number' \| 'password' \| 'email' \| 'search' \| 'tel' \| 'url'` | text |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| maxlength | 最大输入长度 | ^[string] / ^[number] | — |
| minlength | 最小输入长度 | ^[string] / ^[number] | — |
| showWordLimit | 是否显示字数统计，仅在 type 为 text 或 textarea 时生效 | ^[boolean] | false |
| wordLimitPosition | 字数统计的位置 | ^[enum]`'inside' \| 'outside'` | inside |
| placeholder | 输入框占位文本 | ^[string] | — |
| clearable | 是否可清空，textarea 同样支持 | ^[boolean] | false |
| clearIcon | 自定义清除图标 | ^[ReactNode] | CircleClose |
| formatter | 指定输入值的格式化函数 | ^[Function]`(value: string) => string` | — |
| parser | 从 formatter 格式化后的值还原为实际值 | ^[Function]`(value: string) => string` | — |
| showPassword | 是否显示切换密码图标 | ^[boolean] | false |
| passwordIcon | 自定义密码可见性图标，参数为当前是否明文 | ^[Function]`(visible: boolean) => ReactNode` | — |
| disabled | 是否禁用 | ^[boolean] | false |
| readOnly | 是否只读 | ^[boolean] | false |
| prefixIcon | 前缀图标 | ^[ReactNode] | — |
| suffixIcon | 后缀图标 | ^[ReactNode] | — |
| rows | 输入框行数，仅 type 为 textarea 时有效 | ^[number] | 2 |
| autosize | 自适应内容高度，仅 type 为 textarea 时有效 | ^[boolean] / ^[object]`{ minRows?: number, maxRows?: number }` | false |
| resizable | 控制 textarea 是否能被用户缩放，对应官方 resize | ^[enum]`'none' \| 'both' \| 'horizontal' \| 'vertical'` | — |
| autoComplete | 原生 autocomplete 属性 | ^[string] | off |
| name | 原生 name 属性 | ^[string] | — |
| form | 原生 form 属性 | ^[string] | — |
| autoFocus | 是否自动聚焦 | ^[boolean] | false |
| aria-label | 原生 aria-label 属性 | ^[string] | — |
| tabIndex | 输入框的 tabindex | ^[number] | 0 |
| inputMode | 原生 inputmode 属性 | ^[string] | — |
| validateEvent | 值变化与失焦时是否触发 FormItem 校验 | ^[boolean] | true |
| inputStyle | 应用到内部 input / textarea 的样式 | ^[object]`CSSProperties` | {} |
| countGraphemes | 自定义字素计数函数；设置后不再使用原生 maxlength / minlength | ^[Function]`(value: string) => number` | — |
| containerRole | 容器 role，供内部组件使用 | ^[string] | — |

### Input Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 输入值改变时触发，对应官方 v-model 与 input 事件 | ^[Function]`(value: string) => void` |
| onValueChange | 输入框失去焦点或用户按下回车时触发，对应官方 change 事件 | ^[Function]`(value: string, event?: Event) => void` |
| onFocus | 输入框获得焦点时触发 | ^[Function]`(event: FocusEvent) => void` |
| onBlur | 输入框失去焦点时触发 | ^[Function]`(event: FocusEvent) => void` |
| onClear | 点击 clearable 生成的清空按钮时触发 | ^[Function]`() => void` |
| onKeyDown | 在输入框中按下按键时触发 | ^[Function]`(event: KeyboardEvent) => void` |
| onMouseEnter | 鼠标移入时触发 | ^[Function]`(event: MouseEvent) => void` |
| onMouseLeave | 鼠标移出时触发 | ^[Function]`(event: MouseEvent) => void` |
| onCompositionStart | 输入法组合输入开始时触发 | ^[Function]`(event: CompositionEvent) => void` |
| onCompositionUpdate | 输入法组合输入更新时触发 | ^[Function]`(event: CompositionEvent) => void` |
| onCompositionEnd | 输入法组合输入结束时触发 | ^[Function]`(event: CompositionEvent) => void` |

原生 input 的其余属性（如 `onPaste`、`onCopy`、`max`、`min`、`step`）会透传到内部元素。

### Input Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| prefix | 输入框头部内容，仅 type 不为 textarea 时生效 | `prefix` |
| suffix | 输入框尾部内容，仅 type 不为 textarea 时生效 | `suffix` |
| prepend | 输入框前置内容，仅 type 不为 textarea 时生效 | `prepend` |
| append | 输入框后置内容，仅 type 不为 textarea 时生效 | `append` |
| password-icon | 自定义密码图标，参数为当前是否明文 | `passwordIcon` |

### Input Exposes

通过 `ref` 获取，类型为 `InputExpose`：

```tsx
const inputRef = useRef<InputExpose>(null);
<ElInput ref={inputRef} />;
inputRef.current?.focus();
```

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 使输入框获得焦点 | ^[Function]`() => void` |
| blur | 使输入框失去焦点 | ^[Function]`() => void` |
| select | 选中输入框中的文本 | ^[Function]`() => void` |
| clear | 清空输入值 | ^[Function]`() => void` |
| resizeTextarea | 重新计算 textarea 高度 | ^[Function]`() => void` |
| input | 原生 input 元素 | ^[object]`HTMLInputElement \| null` |
| textarea | 原生 textarea 元素 | ^[object]`HTMLTextAreaElement \| null` |
| ref | 原生 input 或 textarea 元素 | ^[object]`HTMLInputElement \| HTMLTextAreaElement \| null` |
| textareaStyle | 应用到 textarea 的样式 | ^[object]`CSSProperties` |
| autosize | 当前 autosize 配置 | ^[boolean] / ^[object] |
| isComposing | 是否处于输入法组合输入中 | ^[boolean] |
| passwordVisible | 密码是否明文显示 | ^[boolean] |
| `tabindex` | `tabIndex` | React 中仅接受 number |

说明：

- `countGraphemes` 已实现完整截断逻辑：优先使用 `Intl.Segmenter` 按字素簇插入，旧环境回退到码点迭代。
- `validateEvent`、`Form` / `FormItem` 的 `size` / `disabled` 继承以及校验状态图标（success / error / validating）均已接入。
- `validateEvent` 依赖 `ElFormItem` 上下文；脱离表单使用时不会触发校验。
