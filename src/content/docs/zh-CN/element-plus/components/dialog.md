---
title: "Dialog 对话框"
description: "在保留当前页面状态的情况下，告知用户并承载相关操作。"
group: 反馈组件
order: 20
---

# Dialog 对话框

在保留当前页面状态的情况下，告知用户并承载相关操作。

## 基础用法

:::demo 需要设置 `visible` 属性来控制对话框的显示与隐藏； `beforeClose` 可以拦截关闭。

dialog/basic-usage

:::

## 自定义内容

:::demo 对话框可以承载表格、表单等任意内容，内容区高度超出时滚动。

dialog/customization-content

:::

## 自定义头部

:::demo `header` 渲染函数接收 `close`、`titleId`、 `titleClass`，可在保留可访问性的同时自由排布头部。

dialog/customization-header

:::

## 嵌套对话框

:::demo 多层对话框通过焦点层栈协调焦点；内层对话框建议设置 `appendToBody`。

dialog/nested-dialog

:::

## 内容居中

:::demo `center` 只会让头部和底部居中，正文需自行处理。

dialog/centered-content

:::

## 垂直居中

:::demo `alignCenter` 让对话框在视口中水平垂直居中。

dialog/align-center

:::

## 关闭后销毁

:::demo `destroyOnClose` 在关闭动画结束后销毁内容，首次打开前也不渲染。

dialog/destroy-on-close

:::

## 可拖拽对话框

:::demo 设置 `draggable` 后可拖动头部移动；`overflow` 允许拖出视口。

dialog/draggable-dialog

:::

## 全屏

:::demo `fullscreen` 让对话框占满整个视口。

dialog/fullscreen

:::

## 遮罩

:::demo `modal` 控制遮罩显示；配合 `modalPenetrable` 可以让点击穿透到页面。

dialog/modal

:::

## 自定义动画

:::demo 通过 `transition` 指定过渡动画名。自定义名称需要自行提供对应 CSS。

dialog/custom-animation

:::

## 事件

:::demo 打开 / 关闭全过程都会触发事件，便于与外部状态同步。

dialog/events

:::

## Dialog API

### Dialog Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示 | ^[boolean] | false |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| width | 宽度 | ^[string] / ^[number] | 50% |
| top | 对话框 CSS 的 margin-top | ^[string] | 15vh |
| fullscreen | 是否为全屏 | ^[boolean] | false |
| align-center | 是否水平垂直居中（此时 top 无效） | ^[boolean] | false |
| center | 头部与底部是否居中 | ^[boolean] | false |
| show-close | 是否显示关闭按钮 | ^[boolean] | true |
| close-on-click-modal | 点击遮罩是否关闭 | ^[boolean] | true |
| close-on-press-escape | 按 ESC 是否关闭 | ^[boolean] | true |
| modal | 是否显示遮罩 | ^[boolean] | true |
| modal-penetrable | 遮罩是否可穿透（需 modal=false） | ^[boolean] | false |
| modal-class | 遮罩自定义类名 | ^[string] | — |
| lock-scroll | 显示时是否锁定 body 滚动 | ^[boolean] | true |
| destroy-on-close | 关闭后是否销毁内容 | ^[boolean] | false |
| open-delay / close-delay | 打开 / 关闭延迟（毫秒） | ^[number] | 0 |
| before-close | 关闭前钩子，调用 done 才真正关闭 | ^[Function]`(done: (cancel?: boolean) => void) => void` | — |
| draggable | 是否可拖拽移动 | ^[boolean] | false |
| overflow | 拖拽时是否允许超出视口 | ^[boolean] | false |
| trap-focus | 是否将焦点限制在对话框内 | ^[boolean] | true |
| header-aria-level | 头部 aria-level | ^[number] / ^[string] | 2 |
| transition | 过渡动画名 | ^[string] | dialog-fade |
| append-to | 挂载目标，优先于 append-to-body | ^[string] / ^[HTMLElement] | body |
| append-to-body | 是否挂载到 body | ^[boolean] | false |
| close-icon | 自定义关闭图标 | ^[ReactNode] | Close |
| header-class / body-class / footer-class | 各区域类名 | ^[string] | — |
| z-index | 层级 | ^[number] | — |
| header | 头部内容，可传渲染函数获取 `{ close, titleId, titleClass }` | ^[ReactNode] / ^[Function] | — |
| footer | 底部内容 | ^[ReactNode] | — |

### Dialog Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐变化 | ^[Function]`(visible: boolean) => void` |
| onOpen | 打开前触发 | ^[Function]`() => void` |
| onOpened | 打开动画结束后触发 | ^[Function]`() => void` |
| onClose | 关闭前触发 | ^[Function]`() => void` |
| onClosed | 关闭动画结束后触发 | ^[Function]`() => void` |
| onOpenAutoFocus | 打开并聚焦内容后触发 | ^[Function]`() => void` |
| onCloseAutoFocus | 关闭并恢复焦点后触发 | ^[Function]`() => void` |

### Dialog Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 对话框内容 | `children` |
| header | 头部内容；替换后 title 不再渲染，但关闭按钮保留 | `header` 属性或渲染函数 |
| footer | 底部内容 | `footer` 属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `visible` + `onVisibleChange` | React 惯用写法 |
| `<slot name="header">` | `header` 属性 / 渲染函数 | 渲染函数提供 `close`、`titleId`、`titleClass` |
| `<slot name="footer">` | `footer` 属性 | 传节点 |
| `resetPosition()` / `handleClose()` | 未导出 | 通过受控 `visible` 控制显隐 |
| `transition` 支持对象配置 | 仅字符串动画名 | 对象形式的自定义过渡未实现 |

**实现说明**：

- 结构分层与官方一致：`.el-overlay`（遮罩）→ `.el-overlay-dialog`（铺满视口、承载点击）→ `ElFocusTrap` → `.el-dialog`
- 点击遮罩的判定等价于官方 `useSameTarget`：**只有 mousedown 与 mouseup 都落在遮罩本身**才算点击遮罩，
  防止「在对话框内按下、拖到遮罩上松开」误关闭
- `destroyOnClose` 在关闭动画结束后卸载内容；再次打开时重新挂载
- 嵌套对话框通过焦点层栈协调，内层打开时外层暂停，不会互相抢焦点
- `draggable` 使用 header 作为拖拽手柄；开启 `overflow` 后不再限制在视口内
- 自定义 `transition` 需在样式中提供对应的 `*-enter-from` / `*-enter-active` 等类名，
  演示使用 theme-chalk 内置的 `dialog-fade`、`el-fade-in-linear`、`el-fade-in`
