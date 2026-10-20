---
title: "Drawer 抽屉"
description: "有些对话框要提供额外的操作，但保留当前页面状态，Drawer 就是这样的组件。"
group: 反馈组件
order: 30
---

# Drawer 抽屉

有些对话框要提供额外的操作，但保留当前页面状态，Drawer 就是这样的组件。

## 基础用法

:::demo 通过 `visible` 控制显示；`direction` 支持四个方向， `beforeClose` 可以拦截关闭。

drawer/basic-usage

:::

## 无标题

:::demo 设置 `withHeader` 为 `false` 可以移除头部区域。

drawer/no-title

:::

## 自定义内容

:::demo 抽屉内可以放置表格、表单等任意内容。

drawer/customization-content

:::

## 自定义头部

:::demo `header` 渲染函数接收 `close`、`titleId`、 `titleClass`，可自由排布头部。

drawer/customization-header

:::

## 可调整尺寸

:::demo 设置 `resizable` 后可通过边缘手柄拖拽调整尺寸。

drawer/resizable

:::

## 嵌套抽屉

:::demo 内层抽屉建议设置 `appendToBody`，避免层级与焦点问题。

drawer/nested-drawer

:::

## 遮罩

:::demo `modal` 控制遮罩显示；配合 `modalPenetrable` 可以让点击穿透到页面。

drawer/modal

:::

## Drawer API

### Drawer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示 | ^[boolean] | false |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| direction | 打开方向 | ^[enum]`'ltr' \| 'rtl' \| 'ttb' \| 'btt'` | rtl |
| size | 尺寸。横向方向对应宽度，纵向对应高度；数字以 px 计 | ^[string] / ^[number] | 30% |
| with-header | 是否渲染头部 | ^[boolean] | true |
| show-close | 是否显示关闭按钮 | ^[boolean] | true |
| modal | 是否显示遮罩 | ^[boolean] | true |
| modal-penetrable | 遮罩是否可穿透（需 modal=false） | ^[boolean] | false |
| modal-class | 遮罩自定义类名 | ^[string] | — |
| lock-scroll | 显示时是否锁定 body 滚动 | ^[boolean] | true |
| close-on-click-modal | 点击遮罩是否关闭 | ^[boolean] | true |
| close-on-press-escape | 按 ESC 是否关闭 | ^[boolean] | true |
| destroy-on-close | 关闭后是否销毁内容 | ^[boolean] | false |
| open-delay / close-delay | 打开 / 关闭延迟（毫秒） | ^[number] | 0 |
| resizable | 是否可拖拽调整尺寸 | ^[boolean] | false |
| before-close | 关闭前钩子，调用 done 才真正关闭 | ^[Function]`(done: (cancel?: boolean) => void) => void` | — |
| append-to | 挂载目标，优先于 append-to-body | ^[string] / ^[HTMLElement] | body |
| append-to-body | 是否挂载到 body，嵌套抽屉需开启 | ^[boolean] | false |
| trap-focus | 是否将焦点限制在抽屉内 | ^[boolean] | true |
| header-aria-level | 头部 aria-level | ^[number] / ^[string] | 2 |
| header-class / body-class / footer-class | 各区域类名 | ^[string] | — |
| z-index | 层级 | ^[number] | — |
| header | 头部内容，可传渲染函数获取 `{ close, titleId, titleClass }` | ^[ReactNode] / ^[Function] | — |
| footer | 底部内容 | ^[ReactNode] | — |

### Drawer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐变化 | ^[Function]`(visible: boolean) => void` |
| onOpen | 打开动画前触发 | ^[Function]`() => void` |
| onOpened | 打开动画结束后触发 | ^[Function]`() => void` |
| onClose | 关闭动画前触发 | ^[Function]`() => void` |
| onClosed | 关闭动画结束后触发 | ^[Function]`() => void` |
| onOpenAutoFocus | 打开并聚焦内容后触发 | ^[Function]`() => void` |
| onCloseAutoFocus | 关闭并恢复焦点后触发 | ^[Function]`() => void` |
| onResizeStart | 开始拖拽调整尺寸 | ^[Function]`(event: MouseEvent, size: number) => void` |
| onResize | 拖拽调整中 | ^[Function]`(event: MouseEvent, size: number) => void` |
| onResizeEnd | 结束拖拽调整 | ^[Function]`(event: MouseEvent, size: number) => void` |

### Drawer Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 抽屉内容 | `children` |
| header | 头部内容；替换后 title 不再渲染，但关闭按钮保留 | `header` 属性或渲染函数 |
| footer | 底部内容 | `footer` 属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `visible` + `onVisibleChange` | React 惯用写法 |
| `<slot name="header">` | `header` 属性 / 渲染函数 | 渲染函数提供 `close`、`titleId`、`titleClass` |
| `<slot name="footer">` | `footer` 属性 | 传节点 |
| `handleClose()` | 未导出 | 通过受控 `visible` 控制显隐 |
| `custom-class`（已废弃） | `className` | 与官方 `class` 对应 |

**实现说明**：结构与 Dialog 一致，`.el-overlay` 内套 `ElFocusTrap` 与 `.el-drawer`；
方向决定 size 作用于宽度还是高度；`resizable` 通过边缘手柄拖拽，
支持 `onResizeStart` / `onResize` / `onResizeEnd` 三个事件；
关闭动画结束后按 `destroyOnClose` 卸载内容。
