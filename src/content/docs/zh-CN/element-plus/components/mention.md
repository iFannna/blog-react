---
title: "Mention 提及"
description: "用于在输入中提及某人或某事。"
group: 表单组件
order: 140
---

# Mention 提及

用于在输入中提及某人或某事。

## 基础用法

:::demo 最简单的用法。输入 `@` 触发提及，选项来自 `options`。

mention/basic

:::

## 自定义选项字段

:::demo 通过 `props` 自定义 `options` 的字段别名。

mention/props

:::

## 文本域

:::demo 将输入类型设为 `textarea`。

mention/textarea

:::

## 自定义标签

:::demo 通过 `labelSlot` 自定义选项内容。

mention/label

:::

## 远程加载选项

:::demo 异步加载选项。命中前缀时触发 `onSearch`，配合 `loading` 显示加载态。

mention/loading

:::

## 自定义触发字符

:::demo 通过 `prefix` 自定义触发字符，默认 `@`，也支持字符串数组。

mention/prefix

:::

## 整体删除

:::demo 设置 `whole` 为 `true` 后，按退格会把提及内容作为整体删除； `checkIsWhole` 可自定义「整词」判定逻辑。

mention/whole

:::

## 配合表单

:::demo 与 `ElForm` 一起使用。

mention/form

:::

该组件基于 `ElInput` 开发，输入框原有的属性、事件与插槽均可直接使用，此处不再赘述。

## Mention API

### Mention Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 输入值 | ^[string] | — |
| options | 提及选项列表 | ^[array]`MentionOption[]` | [] |
| props | 选项字段别名配置 | ^[object]`MentionOptionProps` | `{ value: 'value', label: 'label', disabled: 'disabled' }` |
| prefix | 触发提及的前缀字符，长度必须为 1，可传数组 | ^[string] / ^[array]`string[]` | '@' |
| split | 分隔提及的字符，长度必须为 1 | ^[string] | ' ' |
| filter-option | 自定义过滤逻辑，传 false 关闭过滤 | ^[false] / ^[Function]`(pattern, option) => boolean` | 内置包含匹配 |
| placement | 弹出位置 | ^[enum]`'bottom' \| 'top'` | 'bottom' |
| show-arrow | 弹层是否带箭头 | ^[boolean] | false |
| offset | 弹层偏移 | ^[number] | 0 |
| whole | 退格时是否把整个提及词作为一个整体删除 | ^[boolean] | false |
| check-is-whole | 自定义「整词」判定 | ^[Function]`(pattern, prefix) => boolean` | — |
| loading | 下拉是否处于加载中 | ^[boolean] | false |
| popper-class | 弹层自定义类名 | ^[string] | — |
| popper-style | 弹层自定义样式 | ^[object] | — |
| popper-options | 透传给 popper.js 的配置 | ^[object] | — |
| [input props](./input) | ElInput 的属性全部支持（size / placeholder / clearable / maxlength / type 等） | — | — |

### Mention Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 输入值变化 | ^[Function]`(value: string) => void` |
| onSearch | 命中前缀时触发 | ^[Function]`(pattern: string, prefix: string) => void` |
| onSelect | 选中选项时触发 | ^[Function]`(option: MentionOption, prefix: string) => void` |
| onWholeRemove | 整体删除提及词时触发 | ^[Function]`(pattern: string, prefix: string) => void` |
| [input events](./input) | ElInput 的事件全部支持 | — |

### Mention Slots

React 里插槽以 render 函数形式的 props 提供。

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| labelSlot | 自定义选项内容 | ^[Function]`({ item, index }) => ReactNode` |
| loadingSlot | 自定义加载内容 | ^[ReactNode] |
| headerSlot | 下拉顶部内容 | ^[ReactNode] |
| footerSlot | 下拉底部内容 | ^[ReactNode] |
| input slots | 通过 prefix / suffix / prepend / append / prefixIcon / suffixIcon 传入 | — |

### Mention Exposes（ref）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| input | 原生 input 元素，对应官方的 el-input 实例入口 | ^[object]`HTMLInputElement \| null` |
| textarea | 原生 textarea 元素（type 为 textarea 时） | ^[object]`HTMLTextAreaElement \| null` |
| dropdownVisible | 下拉是否可见 | ^[boolean]（只读） |

### MentionOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项值 | ^[string] | — |
| label | 选项显示文本，省略时显示 value | ^[string] | — |
| disabled | 是否禁用该项 | ^[boolean] | false |
| [key: string] | 其它任意字段，供 labelSlot 使用 | ^[any] | — |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法 |
| `@search` / `@select` / `@whole-remove` | `onSearch` / `onSelect` / `onWholeRemove` | 事件名改为 onXxx |
| 具名插槽 `#label` / `#header` / `#footer` / `#loading` | `labelSlot` / `headerSlot` / `footerSlot` / `loadingSlot` | 插槽改为 render 函数 props |
| `filter-option` | `filterOption` | 命名保持一致，仅传参风格为 camelCase |
| `check-is-whole` | `checkIsWhole` | camelCase |
| `popper-class` / `popper-style` | `popperClass` / `popperStyle` | camelCase |
| `exposes: input / tooltip / dropdownVisible` | `ref` 上的 `input` / `textarea` / `dropdownVisible` | `input` 为原生元素而非 el-input 实例；官方 `tooltip` 实例无 React 等价物，未暴露 |

## 未实现的官方能力

- 未暴露 `tooltip` 实例：官方通过 defineExpose 暴露 tooltip 实例，React 侧无对应组件实例；`dropdownVisible` 与原生 `input` / `textarea` 已通过 ref 暴露。
- `popper-options` 仅接收不生效：弹层未走 popper.js，而是按官方「纯定位」路径用光标坐标直接换算位置，因此该属性不会改变定位行为。
- 未实现弹层的翻转与溢出裁剪：官方由 popper.js 的 flip / preventOverflow 处理，本实现固定贴在光标下方（或在 `placement='top'` 时上方），接近视口边缘时不会自动翻转。
- 未做过渡动画：官方弹层有 el-fade-in-linear 过渡，本实现直接显隐。
- 光标定位对复杂排版的还原度有限：镜像 div 方案在 input 场景精确，textarea 中制表符、双向文本等边界情况可能偏移。
