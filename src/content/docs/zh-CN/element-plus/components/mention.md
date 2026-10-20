---
title: "Mention 提及"
description: "用于在输入中提及某人或某事。"
group: 表单组件
order: 140
---

# Mention 提及

用于在输入中提及某人或某事。

## 基础用法

最简单的用法。

:::demo

mention/basic

:::

## Props ^(2.11.3)

你可以通过 `props` 属性自定义 `options` 的别名。

:::demo

mention/props

:::

## Textarea

输入类型可以设置为 `textarea` 。

:::demo

mention/textarea

:::

## 自定义标签

使用 "label" 自定义标签。

:::demo

mention/label

:::

## 加载远程选项

异步加载选项。

:::demo

mention/loading

:::

## 自定义触发字段

通过 `prefix` 属性 自定义触发字段。默认为 `@`, `Array<string>` 。

:::demo

mention/prefix

:::

## 整体删除

将`whole`属性设置为 `true`，当您按下退格键时，此处的 mention 区域将作为一个整体被删除。设置 "check-is-whole" 属性来自定义检查逻辑。

:::demo

mention/whole

:::

## 在表单里使用

与 `el-form` 一起使用

:::tip

由于这个组件是基于[`el-input`](./input#attributes)派生的，他们的原始属性未被更改，故不在此重复。请跳转查看原组件的相应文档。

:::

:::demo

mention/form

:::

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
