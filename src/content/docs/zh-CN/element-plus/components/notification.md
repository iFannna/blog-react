---
title: "Notification 通知"
description: "悬浮出现在页面角落，显示全局的通知提醒消息。"
group: 反馈组件
order: 70
---

# Notification 通知

悬浮出现在页面角落，显示全局的通知提醒消息。

## 基础用法

:::demo Element Plus 注册了 `$notify` 方法并且它接受一个 Object 作为其参数。在最简单的情况下，你可以通过设置 `title` 和 `message` 属性来设置通知的标题和正文内容。默认情况下，通知在4500毫秒后自动关闭，但你可以通过设置 `duration` 属性来自定义通知的展示时间。如果你将它设置为 `0`，那么通知将不会自动关闭。需要注意的是 `duration` 接收一个 `Number`，单位为毫秒。

notification/basic

:::

## 不同类型的通知

We provide five types: primary, success, warning, info and error.

:::demo Element Plus provides five notification types: `primary`, `success`, `warning`, `info` and `error`. 他们可以设置 `type` 字段来修改，除上述的四个值之外的值会被忽略。同时，我们也为 Notification 的各种 type 注册了单独的方法，可以在不传入 `type` 字段的情况下像 `open3` 和 `open4` 那样直接调用。 `primary` 已被添加到^(2.9.11)。

notification/different-types

:::

## 自定义消息弹出的位置

可以让 Notification 从屏幕四角中的任意一角弹出

:::demo 使用 `position` 属性设置 Notification 的弹出位置，支持四个选项：`top-right`、`top-left`、`bottom-right` 和 `bottom-left`，默认为 `top-right`。

notification/positioning

:::

## 有位置偏移的通知栏

能够设置偏移量来使 Notification 偏移默认位置。

:::demo Notification 提供设置偏移量的功能，通过设置 `offset` 字段，可以使弹出的消息距屏幕边缘偏移一段距离。注意在同一时刻，每一个的 Notification 实例应当具有一个相同的偏移量。

notification/offsetting

:::

## 使用 HTML 片段作为正文内容

`message` 支持传入 HTML 字符串来作为正文内容。

:::demo 将 `dangerouslyUseHTMLString` 属性设置为 true，`message` 属性就会被当作 HTML 片段处理。

notification/raw-html

:::

:::warning
`message` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。因此在 `dangerouslyUseHTMLString` 打开的情况下，请确保 `message` 的内容是可信的，**永远不要**将用户提交的内容赋值给 `message` 属性。

:::

## 函数形式的 message ^(2.9.0)

`message` 可以是 VNode。

在^(2.9.0)之后， `message` 支持返回值为 VNode的函数。

:::demo

notification/use-vnode

:::

## 使用进度条 ^(2.14.4)

显示进度条，指示通知自动关闭前的剩余时间。

:::demo 将 `progress` 设为 `true` 即可启用进度条。进度条将显示与 `duration` 匹配的倒计时。向 `progress` 传递一个对象，即可使用 [Progress](./progress.html#attributes) 的选项进行自定义，例如 `color`，该选项会覆盖基于 `type` 的状态颜色。当 `pauseOnHover` 为 `true`（默认值）时，将鼠标悬停在通知上会同时暂停计时器和进度条。

notification/progress-bar

:::

## 隐藏关闭按钮

通知的关闭按钮可以被设置为隐藏。

:::demo 将 `showClose` 属性设置为 `false` 即可隐藏关闭按钮。

notification/no-close

:::

## 全局方法

Element Plus 为 `app.config.globalProperties` 添加了全局方法 `$notify`。因此在 Vue instance 中可以采用本页面中的方式调用 `Notification`。

## 单独引用

```js
import { notification } from "@/components/element-plus/notification";

notification({
  title: "Title",
  message: "This is a message",
});
```

你可以在对应的处理函数内调用 `ElNotification(options)` 来呼出通知栏。我们也提前定义了多个 type 的单独调用方法，如 `ElNotification.success(options)`。当你需要关闭页面上所有的通知栏的时候，可以调用 `ElNotification.closeAll()` 来关闭所有的实例。在 ^(2.10.5) 版本中，你可以通过调用 `ElNotification.updateOffsets(position)` 手动更新所有通知实例在特定方向上的偏移量。

## 应用程序上下文继承 <span className="docs-version-tag">> 2.0.4</span>

现在 Notification 接受一条 `context` 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Notification 中，这将允许你继承应用程序的所有属性。

你可以像这样使用它：

:::tip
如果您全局注册了 ElNotification 组件，它将自动继承应用的上下文环境。

:::

## API

### 配置项

| 名称 | 说明 | 类型 | 默认 |
| --- | --- | --- | --- |
| title | title | ^[string] | '' |
| message | 通知栏正文内容 | ^[string] / ^[VNode] / ^[Function] | '' |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | ^[boolean] | false |
| type | 通知的类型 | ^[enum] | '' |
| icon | 自定义图标。若设置了 type，则 icon 会被覆盖 | ^[string] / ^[Component] | — |
| customClass | 自定义类名 | ^[string] | '' |
| duration | 显示时间，单位为毫秒。值为 0 则不会自动关闭 | ^[number] | 4500 |
| position | 自定义弹出位置 | ^[enum] | top-right |
| showClose | 是否显示关闭按钮 | ^[boolean] | true |
| onClose | 关闭时的回调函数 | ^[Function] | — |
| onClick | 点击 Notification 时的回调函数 | ^[Function] | — |
| offset | 相对屏幕顶部的偏移量偏移的距离，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 | ^[number] | 0 |
| appendTo | 设置 notification 的根元素，默认为 document.body | ^[CSSSelector] / ^[HTMLElement] | — |
| zIndex | 初始 zIndex | ^[number] | 0 |
| closeIcon <span class="docs-version-tag">2.9.8</span> | 自定义关闭图标 | ^[string] / ^[Component] | Close |
| progress <span class="docs-version-tag">2.14.4</span> | 进度条指示自动关闭倒计时。设为 true 可显示默认进度条，或传入一个包含 Progress 选项的对象进行自定义（percentage、type、duration、indeterminate 和 width 除外）。 | ^[boolean] / ^[object] | false |
| pauseOnHover <span class="docs-version-tag">2.14.4</span> | 悬停于通知上时是否暂停计时器。 | ^[boolean] | true |

### 方法

Notification 和 `this.$notify` 都返回当前的 Notification 实例。如果需要手动关闭实例，可以调用它的 `close` 方法。

| 名称 | 详情 | 类型 |
| --- | --- | --- |
| close | 关闭当前的 Notification | ^[Function] |
