---
title: "Segmented 分段控制器"
description: "显示多个选项，并允许用户从中选择一项。"
group: 数据展示
order: 230
---

# Segmented 分段控制器

显示多个选项，并允许用户从中选择一项。

## 基础用法

:::demo `value` 为当前选中项的值，通过 `options` 提供选项数据。

segmented/basic

:::

## 方向

:::demo 设置 `direction` 为 `vertical` 可切换为纵向排列。

segmented/custom-direction

:::

## 禁用

:::demo 为 `ElSegmented` 或某个选项设置 `disabled` 可将其禁用。

segmented/disabled

:::

## 自定义字段别名

:::demo 当 `options` 的数据格式与默认格式不一致时，可用 `optionProps`  指定字段别名。

segmented/props

:::

## 块级显示

:::demo 设置 `block` 为 `true` 可撑满父元素宽度。

segmented/block

:::

## 自定义内容

:::demo 通过默认插槽渲染自定义内容。

segmented/custom-content

:::

## 自定义样式

:::demo 通过 CSS 变量自定义样式。

segmented/custom-style

:::

## Segmented API

### Segmented Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 v-model | ^[string] / ^[number] / ^[boolean] | — |
| options | 选项数据 | ^[array]`SegmentedOption[]` | [] |
| option-props | 选项字段别名，对应官方 props | ^[object]`{ value?, label?, disabled? }` | — |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | 'default' |
| block | 是否撑满父容器宽度 | ^[boolean] | false |
| disabled | 是否禁用整个组件 | ^[boolean] | false |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| name | 原生 `name` 属性 | ^[string] | — |
| id | 原生 `id` 属性 | ^[string] | — |
| aria-label | 原生 `aria-label` 属性 | ^[string] | — |
| direction | 排列方向 | ^[enum]`'horizontal' \| 'vertical'` | 'horizontal' |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### optionProps

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项对象里作为值的键名 | ^[string] | value |
| label | 选项对象里作为标签的键名 | ^[string] | label |
| disabled | 选项对象里作为禁用标记的键名 | ^[string] | disabled |

### Segmented Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化时触发，参数为当前选中值 | ^[Function]`(value: SegmentedValue) => void` |

### Segmented Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| children | 自定义选项内容，传入函数即生效 | ^[Function]`(item: SegmentedOption, index: number) => ReactNode` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法 |
| `props` | `optionProps` | 避开 React 内置的 `props` 命名，语义不变 |
| default 作用域插槽 | `children` 函数 | `(item, index) => ReactNode`，对应官方 `{ item }` |
| `class` | `className` | React 惯例 |

**实现说明**：DOM 与官网一致（`.el-segmented__group` / `.el-segmented__item-selected`
/ `.el-segmented__item` / `.el-segmented__item-input` / `.el-segmented__item-label`）。
滑动选中块的定位照搬官方：量取选中项的 `offsetLeft/offsetWidth`（纵向为
`offsetTop/offsetHeight`）后用 `transform` 平移，并用 `useLayoutEffect` +
`ResizeObserver` 在尺寸或选项变化时重算；`:focus-visible` 通过 `focusin/focusout`
后重算 `matches(':focus-visible')` 得到。

**表单校验**：`validate-event` 已接入 ElFormItem，值变化后触发 `change` 校验。
