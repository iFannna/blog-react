---
title: "InputTag 标签输入框"
description: "InputTag 组件允许用户将输入内容添加为标签。"
group: 表单组件
order: 120
---

# InputTag 标签输入框

InputTag 组件允许用户添加内容作为标签

## 基础用法

按Enter回车键添加输入内容为标签

:::demo

input-tag/basic

:::

## 自定义触发器

您可以自定义用于触发输入标签的键位，默认是Enter 回车键

:::demo

input-tag/trigger

:::

## 最大标签数

您可以设置可以添加的标签数量限制。

:::demo

input-tag/max

:::

## 折叠标签^(2.11.0)

使用折叠标签属性将它们合并成一块文本。您可以使用折叠标签工具提示属性来启用悬停在折叠文本上的行为来显示特定的选定值。使用折叠标签工具提示属性会使最大属性无效。

:::demo

input-tag/collapse

:::

## 禁用状态

您可以设置 InputTag 被禁用。

:::demo

input-tag/disabled

:::

## 可清空

您可以设置是否显示清除按钮。

:::demo

input-tag/clearable

:::

## 自定义清除图标^(2.11.0)

你可以通过`clear-icon`属性自定义清除图标

:::demo

input-tag/clear-icon

:::

## 可拖放

您可以设置是否可以拖动标签。

:::demo

input-tag/draggable

:::

## 分隔符^(2.9.9)

当一个分隔符匹配时，您可以添加一个标签。

:::demo

input-tag/delimiter

:::

## 尺寸

使用 `size` 属性改变输入框大小。除了默认大小外，还有另外两个选项： `large`, `small`。

:::demo

input-tag/size

:::

## 自定义标签

您可以通过`tag`插槽自定义标签内容。

:::demo

input-tag/tag

:::

## 自定义前缀和后缀

您可以通过`prefix`和 `suffix` 插槽自定义 InputTag 的前缀和后缀。

:::demo

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
