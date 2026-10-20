---
title: "MessageBox 消息弹出框"
description: "模拟系统的消息提示框而实现的一组模态对话框。"
group: 反馈组件
order: 60
---

# MessageBox 消息弹出框

模拟系统的消息提示框而实现的一组模态对话框。

## 警示

:::demo 调用 `MessageBox.alert` 只能确认，不能通过 ESC 或点击遮罩关闭。

message-box/alert

:::

## 确认

:::demo `MessageBox.confirm` 有确定和取消，返回 Promise。

message-box/confirm

:::

## 输入

:::demo `MessageBox.prompt` 带输入框，支持正则与自定义校验， 校验失败会留在原地。

message-box/prompt

:::

## 使用 VNode

:::demo `message` 可以传 ReactNode，也可以传函数以延迟渲染。

message-box/use-vnode

:::

## 使用 VNode 与动作处理器

:::demo `message` 的函数形式会收到 `confirm`、 `cancel`、`close`，可用于自定义按钮。

message-box/use-vnode-with-action-handlers

:::

## 自定义

:::demo 通过 `beforeClose(action, instance, done)` 可以在关闭前 修改按钮文案与加载态，只有调用 `done()` 才真正关闭。

message-box/customization

:::

## 使用 HTML 片段

:::demo 设置 `dangerouslyUseHTMLString` 后正文会按 HTML 渲染。

message-box/use-html

:::

## 区分取消与关闭

:::demo 开启 `distinguishCancelAndClose` 后，取消按钮 reject `'cancel'`，关闭按钮 / 遮罩 / ESC reject `'close'`。

message-box/distinguishable-close-cancel

:::

## 内容居中

:::demo 设置 `center` 让内容居中。

message-box/centered-content

:::

## 自定义图标

:::demo 通过 `icon` 替换默认的类型图标。

message-box/customized-icon

:::

## 可拖拽

:::demo 设置 `draggable` 可拖动消息框；`overflow` 允许拖出视口。

message-box/draggable

:::

## MessageBox API

需在应用根部渲染 `<ElMessageBoxContainer />`（本站已全局挂载）。

### MessageBox 方法

| 方法 | 说明 | 返回 |
| --- | --- | --- |
| MessageBox(options) | 通用消息框 | ^[Promise]`MessageBoxData` |
| MessageBox.alert(message, title?, options?) | 只有确定按钮 | ^[Promise]`MessageBoxData` |
| MessageBox.confirm(message, title?, options?) | 有确定和取消 | ^[Promise]`MessageBoxData` |
| MessageBox.prompt(message, title?, options?) | 带输入框 | ^[Promise]`MessageBoxData` |
| MessageBox.closeAll() | 关闭全部 | — |

确认时 resolve 动作名 `'confirm'`（prompt 为 `{ value, action }`）；
取消 / 关闭时 **reject** `'cancel'` 或 `'close'`（开启
`distinguishCancelAndClose` 时点击关闭按钮为 `'close'`）。
传入 `callback` 后由回调接管，Promise 不再 resolve / reject。

### MessageBoxOptions

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题，传 null 不渲染头部 | ^[ReactNode] | 提示 |
| message | 正文，可为 ReactNode 或返回节点的函数 | ^[ReactNode] / ^[Function] | — |
| type | 图标类型 | ^[enum]`'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` | — |
| icon | 自定义图标 | ^[ReactNode] | — |
| show-confirm-button / show-cancel-button / show-close | 是否显示对应按钮 | ^[boolean] | true / false / true |
| confirm-button-text / cancel-button-text | 按钮文案 | ^[string] | OK / Cancel |
| confirm-button-type / cancel-button-type | 按钮类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text'` | primary / text |
| center | 内容居中 | ^[boolean] | false |
| modal | 是否显示遮罩 | ^[boolean] | true |
| close-on-click-modal | 点遮罩关闭 | ^[boolean] | true（快捷方法为 false） |
| close-on-press-escape | ESC 关闭 | ^[boolean] | true |
| distinguish-cancel-and-close | 区分取消与关闭 | ^[boolean] | false |
| show-input | 显示输入框 | ^[boolean] | false |
| input-placeholder | 输入框占位 | ^[string] | — |
| input-value | 输入框初始值 | ^[string] | — |
| input-type | 输入框类型 | ^[string] | text |
| input-pattern | 输入必须匹配的正则 | ^[RegExp] | — |
| input-validator | 输入校验，返回字符串即错误信息 | ^[Function]`(value) => string \| boolean` | — |
| input-error-message | 校验失败默认文案 | ^[string] | 输入的数据不合法! |
| dangerously-use-HTML-string | 以 HTML 渲染正文 | ^[boolean] | false |
| close-icon | 自定义关闭图标 | ^[ReactNode] | Close |
| draggable | 是否可拖拽 | ^[boolean] | false |
| overflow | 拖拽是否允许超出视口 | ^[boolean] | false |
| lock-scroll | 是否锁定 body 滚动 | ^[boolean] | true |
| close-on-hash-change | hash 变化时是否关闭 | ^[boolean] | true |
| callback | 关闭后的回调；传入后接管 Promise | ^[Function]`(result, instance) => void` | — |
| custom-class / custom-style | 自定义类名 / 样式 | ^[string] / ^[object] | — |
| modal-class | 遮罩类名 | ^[string] | — |
| confirm-button-class / cancel-button-class | 按钮类名 | ^[string] | — |
| btn-size | 按钮尺寸 | ^[enum]`'small' \| 'default' \| 'large'` | default |
| round-button | 是否圆角按钮 | ^[boolean] | false |
| append-to | 挂载目标 | ^[string] / ^[HTMLElement] | body |
| z-index | 层级 | ^[number] | — |
| before-close | 关闭前钩子 | ^[Function]`(action, instance, done) => void` | — |

### 实例 API（beforeClose 第二参数）

| 属性 / 方法 | 说明 |
| --- | --- |
| confirmButtonText / cancelButtonText | 可在关闭前动态改写按钮文案 |
| confirmButtonLoading / cancelButtonLoading | 按钮加载态 |
| confirmButtonDisabled | 确认按钮是否禁用 |
| doClose() | 关闭消息框 |
| setConfirmButtonLoading(loading) | 设置确认按钮加载态 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 命令式挂载 Vue 实例 | 模块级 store + 容器组件 | 需在根部渲染对应容器 |
| `v-model` / 组件式调用 | `MessageBox(options)` | 与官方命令式用法一致 |
| `beforeClose(action, instance, done)` | 同签名 | 兼容旧的两参 `(action, done)` 调用 |
| `message` 接收 VNode 或返回 VNode 的函数 | 接收 ReactNode 或返回 ReactNode 的函数 | 函数参数为 `{ confirm, cancel, close }` |
| `callback` | 支持 | 传入后 Promise 不再 settle |

**实现说明**：

- MessageBox 的三个快捷方法都支持 `(message, title, options)` 签名，
  与官方一致；prompt 确认前会先过 `inputPattern` / `inputValidator`，
  失败留在原地显示错误
- 自定义按钮或输入框会保持焦点与键盘可操作性，ESC、点击遮罩按选项生效
- 拖拽以整个消息框为手柄；`overflow` 允许拖出视口
