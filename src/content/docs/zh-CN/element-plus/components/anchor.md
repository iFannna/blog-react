---
title: "Anchor 锚点"
description: "通过锚点，可以快速找到当前页面信息内容的位置。"
group: 导航
order: 20
---

# Anchor 锚点

通过锚点，您可以很快找到当前页面上信息内容的位置。

## 基础用法

:::demo 最简单的用法。

anchor/basic

:::

## 水平模式

水平排列的锚点

:::tip

水平模式不支持`sub-link`槽位

:::

:::demo

anchor/horizontal

:::

## 滚动容器

:::demo 自定义滚动区域，使用 `offset` props 可以设置锚点滚动偏移。 监听`link-click`事件并阻止浏览器的默认行为，从而不会更改历史记录。

anchor/scroll

:::

## 锚点链接变化

:::demo 监听锚点链接变化

anchor/change

:::

## 下划线类型

:::demo 设置`type="underline"`以更改为下划线类型

anchor/underline

:::

## 固定模式

:::demo 使用 affix 组件来固定住页面中的锚点。

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
