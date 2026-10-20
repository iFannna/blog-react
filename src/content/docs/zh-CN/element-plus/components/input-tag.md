---
title: "InputTag 标签输入框"
description: "InputTag 组件允许用户将输入内容添加为标签。"
group: 表单组件
order: 120
---

# InputTag 标签输入框

InputTag 组件允许用户将输入内容添加为标签。

## 基础用法

:::demo 按回车键即可把输入内容添加为标签。

input-tag/basic

:::

## 自定义触发键

:::demo 通过 `trigger` 指定触发新增标签的按键，默认是 `Enter`。

input-tag/trigger

:::

## 最多标签数

:::demo 用 `max` 限制可添加的标签数量。

input-tag/max

:::

## 折叠标签

:::demo 设置 `collapseTags` 后多余标签会合并成一段文本；开启  `collapseTagsTooltip` 后悬停该文本可查看全部标签， 但此时 `max` 会失效。`maxCollapseTags` 控制保留的标签数。

input-tag/collapse

:::

## 禁用状态

:::demo 设置 `disabled` 可禁用整个组件。

input-tag/disabled

:::

## 可清空

:::demo 设置 `clearable` 后会出现清空按钮。

input-tag/clearable

:::

## 自定义清空图标

:::demo 通过 `clearIcon` 自定义清空图标。

input-tag/clear-icon

:::

## 可拖拽

:::demo 设置 `draggable` 后标签可拖拽排序。

input-tag/draggable

:::

## 分隔符

:::demo 设置 `delimiter` 后，输入内容匹配到分隔符即创建标签。

input-tag/delimiter

:::

## 尺寸

:::demo 通过 `size` 改变尺寸，除默认外还有 `large`、 `small`。

input-tag/size

:::

## 自定义标签

:::demo 通过函数子节点自定义标签内容，等价官方的 `tag` 作用域插槽。

input-tag/tag

:::

## 自定义前缀与后缀

:::demo 通过 `prefix` 与 `suffix` 自定义输入框前后内容。

input-tag/prefix-suffix

:::

## InputTag API

### InputTag Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[array]`string[]` | — |
| max | 最多可输入的标签数 | ^[number] | — |
| tag-type | 标签类型 | ^[enum]`'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'` | info |
| tag-effect | 标签主题 | ^[enum]`'dark' \| 'light' \| 'plain'` | light |
| effect | 折叠提示浮层的主题 | ^[enum]`'dark' \| 'light'` / ^[string] | light |
| trigger | 触发新增标签的按键 | ^[enum]`'Enter' \| 'Space'` | Enter |
| draggable | 标签是否可拖拽 | ^[boolean] | false |
| delimiter | 匹配到分隔符即创建标签 | ^[string] / ^[regex] | — |
| size | 输入框尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| collapse-tags | 是否折叠多余标签 | ^[boolean] | false |
| collapse-tags-tooltip | 折叠时悬停展示全部标签，开启后 max 失效 | ^[boolean] | false |
| max-collapse-tags | 折叠时保留的标签数 | ^[number] | 1 |
| save-on-blur | 失焦时是否保存输入内容为标签 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | false |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| disabled | 是否禁用 | ^[boolean] | false |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| readonly | 原生只读 | ^[boolean] | false |
| autofocus | 原生自动聚焦 | ^[boolean] | false |
| id | 原生 id | ^[string] | — |
| tabindex | 原生 tabindex | ^[string] / ^[number] | 0 |
| maxlength | 原生 maxlength | ^[string] / ^[number] | — |
| minlength | 原生 minlength | ^[string] / ^[number] | — |
| placeholder | 占位文本 | ^[string] | — |
| autocomplete | 原生 autocomplete | ^[string] | off |
| aria-label | 原生 aria-label | ^[string] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### InputTag Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化（对应官方 v-model / change） | ^[Function]`(value: string[] \| undefined) => void` |
| onInput | 输入框文本变化 | ^[Function]`(value: string) => void` |
| onAddTag | 新增标签 | ^[Function]`(value: string \| string[]) => void` |
| onRemoveTag | 移除标签 | ^[Function]`(value: string, index: number) => void` |
| onDragTag | 拖拽结束改变顺序 | ^[Function]`(oldIndex: number, newIndex: number, value: string) => void` |
| onFocus / onBlur | 聚焦 / 失焦 | ^[Function]`(event: FocusEvent<HTMLInputElement>) => void` |
| onClear | 点击清空图标 | ^[Function]`() => void` |

### InputTag Slots

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 输入框前缀内容 | ^[ReactNode] |
| suffix | 输入框后缀内容 | ^[ReactNode] |
| children | 标签内容，传函数时等价官方 tag 作用域插槽 | ^[ReactNode] / ^[Function]`(value: string, index: number) => ReactNode` |

### InputTag Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]`() => void` |
| blur | 失焦输入框 | ^[Function]`() => void` |
