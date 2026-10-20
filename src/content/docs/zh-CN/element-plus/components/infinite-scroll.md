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
