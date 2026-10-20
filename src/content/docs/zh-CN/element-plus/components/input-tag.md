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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法，清空时回传 `undefined` |
| `@change` | `onChange` | 与 v-model 合并为同一个回调 |
| `tag` 作用域插槽 | `children` 传函数 | JSX 无法用具名插槽，函数子节点等价 |
| `prefix` / `suffix` 插槽 | `prefix` / `suffix` props | 传 ReactNode |
| `clear-icon` 传组件对象 | `clearIcon` 传 ReactNode | `clearIcon={<CloseBold />}` |
| `tabindex` 默认 0 | `tabindex` 默认 0 | 一致 |
| `focus` / `blur` expose | `ref` 上的 `focus()` / `blur()` | `useImperativeHandle` |
| 标签由 ElTag 承载 | 复用本项目 `ElTag` | 类名与主题行为一致 |

**实现说明**：
- DOM 结构对齐官方 `.el-input-tag__wrapper > __inner > __input-wrapper`，折叠计数用本项目
  `ElTooltip`（placement=bottom、fallback 为 bottom/top/right/left）包 `.el-input-tag__collapse-tag`。
- 分隔符、退格删除、粘贴拆分、组合输入（中文输入法）与 Android 上 Space 走 keyup 的逻辑均按官方实现。
- 输入框宽度跟随文本：官方用 `useCalcInputWidth` + `.el-input-tag__input-calculator` 测量，这里用
  `ResizeObserver` 监听同一个测量节点，写入 `min-width` 内联样式（与官方写法一致）。
- 折叠时标签最大宽度按官方公式 `inner 宽度 - 折叠块宽度 - gap - (gap + 11)` 计算。
- 按官方做法手动写 `input.value`（不绑定 value 属性），因为受控 value 配 onInput 会触发
  React 的只读告警。

## 未实现的官方能力

- **校验状态图标**：与 ElInput 一致，Form 开启 `status-icon` 时在 suffix 里渲染
  `el-input__validateIcon`（validating / success / error 三种），状态取 FormItem 的
  `validateState`；未开启时不渲染。
- **拖拽时的 DOM 层级**：官方把 `draggable` 与 dragstart/dragover/dragend 直接挂在 `el-tag` 元素上；
  本项目的 `ElTag` 不转发任意 DOM 属性，故在 `draggable && closable` 时给标签外套一层
  `draggable` 的 `span`。拖拽排序、`el-input-tag__drop-indicator` 指示条与 `drag-tag` 事件
  与官方一致，仅 DOM 多一层包裹。
- **`clear-icon` 传组件对象**：官方类型是 `IconPropType`（组件对象或字符串组件名），
  这里只接受 ReactNode，即 `clearIcon={<CloseBold />}`。
- **折叠提示的浮层动画**：官方用 ElTooltip 的过渡动画，本项目 ElTooltip 无过渡，弹出为瞬时显示。
