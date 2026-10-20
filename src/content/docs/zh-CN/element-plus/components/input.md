---
title: "Input 输入框"
description: "通过鼠标或键盘输入字符。"
group: 表单组件
order: 100
---

# Input 输入框

通过鼠标或键盘输入字符。

## 基础用法

:::demo

input/basic

:::

## 禁用状态

:::demo 通过 `disabled` 属性指定是否禁用 Input 组件， 也可以使用 `readOnly` 属性指定是否为只读。

input/disabled

:::

## 可清空

:::demo 使用 `clearable` 属性即可得到一个可清空的输入框， textarea 类型同样支持。

input/clearable

:::

## 自定义清除图标

:::demo 通过 `clearIcon` 属性自定义清除图标。

input/clear-icon

:::

## 格式化

:::demo 使用 `formatter` 格式化展示值，通常与 `parser`  一起使用以还原实际值。

input/formatter

:::

## 密码框

:::demo 使用 `showPassword` 属性即可得到一个可切换显示隐藏的密码框； 通过 `passwordIcon` 可以自定义图标。

input/password

:::

## 带图标

:::demo 使用 `prefixIcon` / `suffixIcon` 属性添加图标， 也可以使用 `prefix` / `suffix` 插槽。

input/with-icon

:::

## 文本域

:::demo 通过 `type="textarea"` 切换为原生 textarea， 使用 `rows` 控制高度。

input/textarea

:::

## 自适应文本域

:::demo 为 textarea 设置 `autosize` 属性可让高度随内容自适应， 也可以传入 `{ minRows, maxRows }` 限定行数范围。

input/auto-sizing-textarea

:::

## 复合输入框

:::demo 使用 `prepend` / `append` 在输入框前后放置标签、 选择器或按钮等内容。

input/mixed-input

:::

## 尺寸

:::demo 通过 `size` 属性设置 `large` /  `default` / `small` 尺寸，前后缀图标会同步缩放。

input/various-size

:::

## 输入长度限制

:::demo 使用 `maxlength` 和 `minlength` 限制输入长度， 配合 `showWordLimit` 显示字数统计；`wordLimitPosition`  可把统计放到输入框外部。

input/length-limiting

:::

## 字素计数

:::demo 设置 `countGraphemes` 后按自定义规则计算长度，此时原生  `maxlength` / `minlength` 不再生效。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法 |
| `model-modifiers` | `modelModifiers={{ trim: true }}` | 显式传对象 |
| `@input` / `@change` | `onChange` / `onValueChange` | 见事件表 |
| `resize` | `resizable` | 避开原生同名属性 |
| 具名插槽 | `prefix` / `suffix` / `prepend` / `append` / `passwordIcon` 属性 | 直接传 ReactNode |
| `defineExpose` | `ref` + `useImperativeHandle` | 实例类型为 `InputExpose` |
| `clear-icon` 等图标组件 | `ReactNode` | 直接传 `<CircleClose />` 等元素 |
| `input-style` 支持字符串 / 数组 | `CSSProperties` 对象 | React 样式写法 |
| `label`（已废弃） | `aria-label` | 使用原生 ARIA 属性 |
| `readonly` / `autofocus` | `readOnly` / `autoFocus` | React 原生属性命名 |
| `autocomplete` / `inputmode` | `autoComplete` / `inputMode` | React 原生属性命名 |
| `tabindex` | `tabIndex` | React 中仅接受 number |

说明：

- `countGraphemes` 已实现完整截断逻辑：优先使用 `Intl.Segmenter` 按字素簇插入，旧环境回退到码点迭代。
- `validateEvent`、`Form` / `FormItem` 的 `size` / `disabled` 继承以及校验状态图标（success / error / validating）均已接入。
- `validateEvent` 依赖 `ElFormItem` 上下文；脱离表单使用时不会触发校验。
