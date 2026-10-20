---
title: "Anchor 锚点"
description: "通过锚点，可以快速找到当前页面信息内容的位置。"
group: 导航
order: 20
---

# Anchor 锚点

通过锚点，可以快速找到当前页面信息内容的位置。

## 基础用法

:::demo 最简单的用法。

anchor/basic

:::

## 水平模式

:::demo 水平方向排列的锚点。水平模式不支持 `sub-link` 插槽。

anchor/horizontal

:::

## 滚动容器

:::demo 自定义滚动区域，使用 `offset` 设置锚点滚动偏移量， 监听 `onClick` 并阻止浏览器默认行为即不会改变 history。

anchor/scroll

:::

## 锚点链接变化

:::demo 监听锚点链接的变化。

anchor/change

:::

## 下划线类型

:::demo 设置 `type="underline"` 切换为下划线类型。

anchor/underline

:::

## 固定模式

:::demo 使用固钉组件将锚点固定在页面内。

anchor/affix

:::

## Anchor API

### Anchor Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| container | 滚动容器 | ^[string] / ^[HTMLElement] / ^[Window] | window |
| offset | 锚点滚动的偏移量 | ^[number] | 0 |
| bound | 元素开始触发锚点切换的偏移量 | ^[number] | 15 |
| duration | 容器滚动时长，毫秒 | ^[number] | 300 |
| marker | 是否显示滑块 | ^[boolean] | true |
| type | 锚点类型 | ^[enum]`'default' \| 'underline'` | default |
| direction | 锚点方向 | ^[enum]`'vertical' \| 'horizontal'` | vertical |
| select-scroll-top ^(2.9.2) | 滚动到顶部时是否选中链接 | ^[boolean] | false |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Anchor Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 当前锚点变化时触发，对应官方 change | ^[Function]`(href: string) => void` |
| onClick | 用户点击链接时触发 | ^[Function]`(e: MouseEvent, href?: string) => void` |

### Anchor Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| scrollTo | 手动滚动到指定位置 | ^[Function]`(href: string) => void` |

> 通过 `ref` 拿到 expose：`const ref = useRef<AnchorExpose>(null)`，再调用 `ref.current?.scrollTo("#id")`。

### Anchor Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | AnchorLink 组件列表 | `children` |

### AnchorLink Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 锚点链接的文字内容 | ^[string] | — |
| href | 锚点的地址 | ^[string] | — |

### AnchorLink Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 锚点链接的内容，优先于 `title` | `children` |
| sub-link | 子链接 | `subLink` 属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `change` 事件 | `onChange` | React 里 change 会与原生事件同名，故改为 onChange |
| `click` 事件 | `onClick` | 同上，加 on 前缀 |
| `<slot>` 放 AnchorLink 列表 | `children` | 默认插槽即 children |
| `<template #sub-link>` | `subLink` 属性 | 传入一个 ReactNode |
| `defineExpose({ scrollTo })` | `ref` + `AnchorExpose` | React 用 `useImperativeHandle` 暴露同样的方法 |
| `container` 传元素 | 同 | 传 `HTMLElement`；元素尚未挂载时可先传 `null`，就绪后通过 state 更新 |

**实现说明**：DOM 与官方一致 —— `.el-anchor` > `.el-anchor__marker` + `.el-anchor__list`，
链接为 `.el-anchor__item` > `.el-anchor__link`（激活时加 `.is-active`），
嵌套时再套一层 `.el-anchor__list`；类名同时输出 `.el-anchor--vertical` / `.el-anchor--horizontal`，
`type="underline"` 时加 `.el-anchor--underline`。滚动监听与高亮判定逐行对齐官方
`getCurrentHref`（触发点 = 距容器顶距离 - offset - bound，排序后取区间），
滚动用 rAF 节流；滑块用 `getBoundingClientRect` 相对根元素定位，写内联 `top` / `left`，
过渡由 CSS 的 `transition` 承担；点击后调用 `animateScrollTo`（与官方同一套 easeInOutCubic），
动画期间锁定高亮以免回跳。

**未实现的官方能力**：
- `onActivated` / `onDeactivated`（`<keep-alive>` 激活钩子）：React 无对应机制。
- 官方 `click` 事件后不做 `preventDefault`，由使用方自行处理；本实现与官方行为一致，
  未额外提供内置的「禁止改变 history」开关。
- 官方通过 `watch(() => slots.default?.())` 感知插槽内容变化来重算滑块位置；
  本实现改为每次渲染后重算并用序列化签名去重，效果等价但机制不同。
