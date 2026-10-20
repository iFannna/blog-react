---
title: "Rate 评分"
description: "用于对事物进行评级操作。"
group: 表单组件
order: 160
---

# Rate 评分

用于对事物进行评级操作。

## 基础用法

:::demo 分为三个等级，默认各级同色。用 `colors` 传入三个元素的数组可 按等级分色，等级边界由 `lowThreshold` 与  `highThreshold` 指定；也可以传对象，键为阈值，值为对应颜色。

rate/basic-usage

:::

## 尺寸

:::demo 通过 `size` 改变尺寸，除默认外还有 `large`、 `small`。

rate/sizes

:::

## 允许半选

:::demo 设置 `allowHalf` 后可以选中半颗星。

rate/allow-half

:::

## 辅助文字

:::demo 设置 `showText` 在右侧显示辅助文字，用 `texts`  为不同分值指定文本，数组长度应与 `max` 相同。

rate/text

:::

## 可清空

:::demo 设置 `clearable` 后，再次点击当前分值可重置为 0。

rate/clearable

:::

## 更多图标

:::demo 用 `icons` 传入三个元素的数组或对象来自定义图标，配合  `voidIcon` 设置未选中时的图标。

rate/more-icons

:::

## 只读

:::demo 只读用于展示评分，支持半星。设置 `disabled` 进入只读， `showScore` 在右侧显示分值，`scoreTemplate`  自定义模板，必须包含 `{value}`。

rate/readonly

:::

## 自定义样式

通过 CSS 变量 `--el-rate-void-color`、 `--el-rate-fill-color`、 `--el-rate-disabled-void-color`、 `--el-rate-text-color` 全局或局部改色。

## Rate API

### Rate Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前分值，对应官方 model-value / v-model | ^[number] | 0 |
| max | 最大分值 | ^[number] | 5 |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| disabled | 是否只读 | ^[boolean] | false |
| allow-half | 是否允许半选 | ^[boolean] | false |
| low-threshold | 低分与中分的阈值，阈值本身算低分 | ^[number] | 2 |
| high-threshold | 中分与高分的阈值，阈值本身算高分 | ^[number] | 4 |
| colors | 图标颜色。数组需 3 个元素；对象以阈值为键 | ^[array]`string[]` / ^[object]`Record<number, string>` | ['#f7ba2a', '#f7ba2a', '#f7ba2a'] |
| void-color | 未选中图标的颜色 | ^[string] | #c6d1de |
| disabled-void-color | 只读时未选中图标的颜色 | ^[string] | #eff2f7 |
| icons | 图标，形态同 colors | ^[array] / ^[object]`Record<number, IconPropType>` | [StarFilled, StarFilled, StarFilled] |
| void-icon | 未选中时的图标 | ^[Component] / ^[ReactNode] | Star |
| disabled-void-icon | 只读时未选中图标 | ^[Component] / ^[ReactNode] | StarFilled |
| show-text | 是否显示辅助文字 | ^[boolean] | false |
| show-score | 是否显示当前分值，与 show-text 互斥 | ^[boolean] | false |
| text-color | 辅助文字颜色 | ^[string] | '' |
| texts | 辅助文字数组 | ^[array]`string[]` | ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] |
| score-template | 分值模板，必须含 `{value}` | ^[string] | {value} |
| clearable | 再次点击相同值是否清空为 0 | ^[boolean] | false |
| id | 原生 `id` | ^[string] | — |
| aria-label | 原生 `aria-label` | ^[string] | rating |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Rate Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 分值变化时触发 | ^[Function]`(value: number) => void` |

### Rate Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| setCurrentValue | 设置当前高亮值，不回写 value | ^[Function]`(value: number) => void` |
| resetCurrentValue | 重置高亮为 value 对应值，不回写 value | ^[Function]`() => void` |

### CSS 变量

| 变量 | 默认值 |
| --- | --- |
| --el-rate-void-color | var(--el-border-color-darker) |
| --el-rate-fill-color | #f7ba2a |
| --el-rate-disabled-void-color | var(--el-fill-color) |
| --el-rate-text-color | var(--el-text-color-primary) |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法 |
| `update:modelValue` 与 `change` 两个事件 | 合并为 `onChange` | `onChange` 对齐官方 `change` 的触发条件：只在值确实变化时触发 |
| `ref.setCurrentValue()` | `ref.current.setCurrentValue()` | 用 `useImperativeHandle` 暴露，需 `forwardRef` |
| `useFormDisabled` / `useFormSize` | 同名 hook | 与官方一致：组件自身 disabled / size 优先，其次 FormItem、Form、ConfigProvider |
| `aria-labelledby` 关联 FormItem label | 同左 | 位于 FormItem 内且只有一个输入时，用 label 的 id 关联；否则回退 `aria-label` |
| `icons` 接受字符串组件名 | 只接受组件或节点 | 无 Vue 的全局组件注册机制 |
| `label` (a11y, 已废弃) | 未实现 | 官方已标记 deprecated |

**实现说明**：分值映射完全照搬官方 `getValueFromMap`，带 `excluded` 的键
要求 `value < key` 命中，否则 `value <= key`；`.el-rate__decimal--box`
与 `.el-rate__decimal` 的宽度裁切、`is-focus-visible` 的键盘焦点态、
`hover` 的放大态均与官方一致。颜色通过根元素上的
`--el-rate-void-color` / `--el-rate-disabled-void-color` / `--el-rate-fill-color`
下发，等价官方 `rateStyles` 的 `cssVarBlock`。

**未实现的官方能力**：`label`（已废弃的 a11y prop）。

**行为差异**：官方在挂载时若 `modelValue` 为假值会立刻补抛一次
`update:modelValue`（0），React 用受控 props，无需该同步动作，故未实现。
