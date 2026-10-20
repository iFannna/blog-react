---
title: "Notification 通知"
description: "悬浮出现在页面角落，显示全局的通知提醒消息。"
group: 反馈组件
order: 70
---

# Notification 通知

悬浮出现在页面角落，显示全局的通知提醒消息。

## 基础用法

:::demo 设置 `duration` 控制自动关闭时长，设为 `0` 则不自动关闭。

notification/basic

:::

## 不同类型

:::demo 提供 `primary`、`success`、`info`、 `warning`、`error` 五种类型。

notification/different-types

:::

## 自定义位置

:::demo `position` 定义通知滑入的角落，默认 `top-right`。

notification/positioning

:::

## 偏移量

:::demo 通过 `offset` 自定义通知距屏幕边缘的距离。

notification/offsetting

:::

## 使用 HTML 片段

:::demo 设置 `dangerouslyUseHTMLString` 后 `message` 会按 HTML 渲染。

notification/raw-html

:::

## 使用 VNode

:::demo `message` 可以是 ReactNode，也可以是返回 ReactNode 的函数以延迟渲染。

notification/use-vnode

:::

## 带进度条

:::demo `progress` 为 `true` 时显示自动关闭倒计时进度条； 传对象可自定义颜色，`pauseOnHover` 控制悬停是否暂停。

notification/progress-bar

:::

## 隐藏关闭按钮

:::demo 设置 `showClose` 为 `false` 可隐藏关闭按钮。

notification/no-close

:::

## Notification API

需在应用根部渲染 `<ElNotificationContainer />`（本站已全局挂载）。

### Notification 方法

| 方法 | 说明 |
| --- | --- |
| notification(options) / notification(string) | 显示通知，字符串等价于只设 message |
| notification.primary(options) | 主要通知 |
| notification.success(options) | 成功通知 |
| notification.info(options) | 信息通知 |
| notification.warning(options) | 警告通知 |
| notification.error(options) | 错误通知 |
| notification.closeAll() | 关闭全部 |

返回实例上的 `close()` 可手动关闭单条。

### NotificationOptions

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[ReactNode] | — |
| message | 正文，可为函数以延迟求值 | ^[ReactNode] / ^[Function] | — |
| type | 类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'info' \| 'error'` | — |
| icon | 自定义图标 | ^[ReactNode] | — |
| close-icon | 自定义关闭图标 | ^[ReactNode] | Close |
| duration | 自动关闭时长（毫秒），0 不自动关 | ^[number] | 4500 |
| position | 位置 | ^[enum]`'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | top-right |
| offset | 距视口边缘偏移（px） | ^[number] | 0 |
| show-close | 显示关闭按钮 | ^[boolean] | true |
| progress | 显示自动关闭进度条；传对象可自定义颜色等 | ^[boolean] / ^[ProgressProps] | false |
| pause-on-hover | 悬停暂停倒计时与进度条 | ^[boolean] | true |
| dangerously-use-HTML-string | 以 HTML 渲染 message | ^[boolean] | false |
| append-to | 挂载目标，默认 body | ^[string] / ^[HTMLElement] | — |
| custom-class | 自定义类名 | ^[string] | — |
| z-index | 初始层级 | ^[number] | — |
| on-close | 关闭时回调 | ^[Function]`() => void` | — |
| on-click | 点击通知时回调 | ^[Function]`() => void` | — |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 命令式挂载 Vue 实例 | 模块级 store + 容器组件 | 需在根部渲染 `<ElNotificationContainer />` |
| `message` 支持 VNode / 返回 VNode 的函数 | `message` 支持 ReactNode / 返回 ReactNode 的函数 | — |
| `progress` 对象透传给 ElProgress | 同 | 支持 color / status / strokeWidth / type 等 |
| `this.$notify` | `notification(...)` | 直接调用函数 |

**实现说明**：同位置堆叠间距 16px（与官方一致）；progress 复用 ElProgress；
悬停暂停按剩余时长继续，进度条与倒计时同步。
