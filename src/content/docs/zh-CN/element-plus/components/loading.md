---
title: "Loading 加载"
description: "加载数据时显示动效。"
group: 反馈组件
order: 40
---

# Loading 加载

加载数据时显示动效。

## 容器内加载

:::demo 传入 `target` 可把遮罩显示在指定容器内，默认覆盖整个页面。

loading/basic

:::

## 自定义

:::demo 通过 `text` 设置加载文案，`background` 设置遮罩背景色。

loading/customization

:::

## 全屏加载

:::demo `fullscreen` 让遮罩铺满视口；`lock` 可同时锁定页面滚动。

loading/fullscreen

:::

## Loading API

需在应用根部渲染 `<ElLoadingContainer />`。

### Loading 方法

| 方法 | 说明 | 返回 |
| --- | --- | --- |
| Loading.service(options) | 启动加载 | ^[object]`{ close, target }` |
| Loading.closeAll() | 关闭全部 | — |

`service` 返回的实例上 `close()` 可关闭本次加载；`target` 为解析后的目标元素。

### LoadingOptions

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 目标元素，字符串经 querySelector 解析 | ^[HTMLElement] / ^[string] | document.body |
| fullscreen | 是否全屏 | ^[boolean] | false |
| lock | 全屏时锁定页面滚动 | ^[boolean] | false |
| text | 加载文案 | ^[string] | — |
| background | 遮罩背景色 | ^[string] | — |
| spinner | 自定义图标 svg 字符串 | ^[boolean] / ^[string] | — |
| custom-class | 自定义类名 | ^[string] | — |
| z-index | 层级 | ^[number] | — |
| before-close | 关闭前钩子，返回 false 阻止 | ^[Function]`() => boolean` | — |
| closed | 完全关闭后的回调 | ^[Function]`() => void` | — |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-loading` 指令 | `Loading.service` | React 无指令，统一走命令式 API |
| 命令式挂载 Vue 实例 | 模块级 store + 容器组件 | 需在根部渲染 `<ElLoadingContainer />` |
| 全屏 Loading 单例 | 每次调用都是独立实例 | 通过引用计数协调定位类 |
| `svg` / `svgViewBox` | `spinner` | 传入 svg 字符串即可替换图标 |

**实现说明**：用 createPortal 把遮罩渲染进目标元素；引用计数用 `loading-number` 属性维护
（与官方一致），叠加多个时只有最后一个关闭才摘掉定位类。

**未实现的官方能力**：`v-loading` 指令及其 `element-loading-*` 属性。
命令式 API 不传 `target` 时即覆盖 body，因此无需官方的 `body` 选项。
