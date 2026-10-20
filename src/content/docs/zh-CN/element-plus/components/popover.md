---
title: "Popover 弹出框"
description: "点击或悬停在元素上时弹出的气泡卡片。"
group: 反馈组件
order: 90
---

# Popover 弹出框

点击或悬停在元素上时弹出的气泡卡片。

## 弹出位置

:::demo 通过 `placement` 设置弹出位置，共 12 个方向。

popover/placement

:::

## 基础用法

:::demo 支持 hover / click / focus / contextmenu 与受控显隐，默认 `trigger` 为 click、`effect` 为 light。

popover/basic-usage

:::

## 虚拟触发

:::demo `virtualTriggering` 让弹层挂在任意元素旁，而不是必须包住触发元素。

popover/virtual-triggering

:::

## 嵌套信息

:::demo `content` 可以放表格、头像等复杂内容，`width` 控制宽度。

popover/nested-information

:::

## 嵌套操作

:::demo 使用受控模式在弹层内放置按钮，实现二次确认之类的操作。

popover/nested-operation

:::

## 指令式用法

:::demo 配合 `virtualTriggering` 与 `persistent`， 可以像官方 `v-popover` 指令一样把弹层绑定到元素上。

popover/directive-usage

:::

## Popover API

### Popover Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| content | 内容 | ^[string] / ^[ReactNode] | — |
| width | 宽度 | ^[string] / ^[number] | 150 |
| placement | 弹出位置 | ^[string] | bottom |
| effect | 主题 | ^[enum]`'dark' \| 'light'` | light |
| trigger | 触发方式 | ^[enum] / ^[array] | click |
| trigger-keys | 键盘触发键 | ^[array] | — |
| visible | 受控显示状态 | ^[boolean] | — |
| show-after / hide-after | 显示 / 隐藏延迟 | ^[number] | 0 / 200 |
| disabled | 是否禁用 | ^[boolean] | false |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| offset | 与触发元素的距离 | ^[number] | 12 |
| enterable | 鼠标是否可进入弹出内容 | ^[boolean] | true |
| popper-class / popper-style | 弹层类名 / 样式 | ^[string] / ^[object] | — |
| teleported | 是否挂载到 appendTo | ^[boolean] | true |
| append-to | 挂载目标 | ^[string] / ^[HTMLElement] | — |
| persistent | 不可见时是否保留 DOM | ^[boolean] | true |
| transition | 过渡动画名 | ^[string] | el-fade-in-linear |
| virtual-triggering | 虚拟触发 | ^[boolean] | false |
| virtual-ref | 虚拟触发参照物 | ^[HTMLElement] / ^[object] | — |
| z-index | 层级 | ^[number] | — |

### Popover Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐状态变化 | ^[Function]`(visible: boolean) => void` |
| onBeforeEnter | 进入动画前 | ^[Function]`() => void` |
| onAfterEnter | 进入动画后 | ^[Function]`() => void` |
| onBeforeLeave | 离开动画前 | ^[Function]`() => void` |
| onAfterLeave | 离开动画后 | ^[Function]`() => void` |

### Popover Exposes

| 方法 | 说明 |
| --- | --- |
| show() | 立即显示 |
| hide() | 立即隐藏 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="reference">` | 直接包住触发元素 | — |
| `<slot>` | `content` 属性 | 传节点 |
| `v-popover` 指令 | `virtualTriggering` + `virtualRef` | 用元素 ref 作为参照物 |

**实现说明**：Popover 本质是 Tooltip 的包装，与官方一致：
默认 `effect` 为 light、`trigger` 为 click；popperClass 为
`el-popover` + 用户类名 +（有 content 时）`el-popover--plain`，
`--plain` 去掉默认内边距，让内容自己控制留白。
