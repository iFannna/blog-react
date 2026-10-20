---
title: "Infinite Scroll 无限滚动"
description: "滚动到页面底部时加载更多数据。"
group: 数据展示
order: 100
---

# Infinite Scroll 无限滚动

滚动到页面底部时加载更多数据。

## 基础用法

:::demo 把 `useInfiniteScroll` 的 ref 挂到列表上（列表需可滚动）， 滚动到底部时自动执行 `onLoad`。

infinite-scroll/basic

:::

## 禁用加载

:::demo 通过 `disabled` 控制是否允许继续加载。

infinite-scroll/disable-loading

:::

## Infinite Scroll API

### useInfiniteScroll

`useInfiniteScroll(ref, options)` 对应官方 `v-infinite-scroll` 指令。React 没有指令，
用 hook 承担同一职责：把同一个 ref 挂到滚动元素上即可。

### Options

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| onLoad | 滚动到底部时执行的回调，对应 `v-infinite-scroll` 的绑定值 | ^[Function]`() => void` | — |
| disabled | 是否禁用 | ^[boolean] | false |
| delay | 节流延迟（ms） | ^[number] | 200 |
| distance | 触发距离（px） | ^[number] | 0 |
| immediate | 初始化时若内容未撑满是否立即执行加载 | ^[boolean] | true |

### ElInfiniteScroll

`useInfiniteScroll` 的可选包装组件：内置 ref 并渲染一个滚动容器（不额外加语义属性，与官方指令一致）。

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| on-load / disabled / delay / distance / immediate | 同 useInfiniteScroll 的 options | 同上 | 同上 |
| aria-label | 容器无障碍标签 | ^[string] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-infinite-scroll="load"` 指令 | `useInfiniteScroll(ref, { onLoad })` | React 无指令，改用 hook；绑定的加载函数改为 `onLoad` 选项 |
| `infinite-scroll-disabled` 属性 | `disabled` 选项 | 没有指令属性，改为 hook 参数 |
| `infinite-scroll-delay` 属性 | `delay` 选项 | 同上 |
| `infinite-scroll-distance` 属性 | `distance` 选项 | 同上 |
| `infinite-scroll-immediate` 属性 | `immediate` 选项 | 同上 |
| 指令可经 `app.use(ElInfiniteScroll)` 全局注册 | 需显式 import | 无全局注册机制 |

**实现说明**：滚动容器、是否触发、内容未撑满时的反复加载三项判定均照搬官方
`handleScroll` / `checkFull`：元素自身可滚动时按「剩余滚动距离」判定，否则用
`offsetTop` 把元素底边换算到容器坐标系；`setTimeout` + 时间戳实现与 lodash throttle
等价的 leading + trailing 节流。

**未实现的官方能力**：

- `v-infinite-scroll` 绑定值非函数时的 `throwError` 提示：React 由 TypeScript 在编译期约束 `onLoad` 必须是函数。
- 官方的 `useDeprecated` 弃用警告（提示改用 `el-scrollbar` 的 infinite scroll）：未复刻该控制台告警。
- 指令 `updated` 钩子里的重新检查：官方在元素更新且容器有高度时再跑一次 `checkFull`。
  React 侧改由 `MutationObserver` 覆盖同一场景，未额外挂 `updated` 等价逻辑。
