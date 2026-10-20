---
title: "Scrollbar 滚动条"
description: "用于替换浏览器原生滚动条。"
group: 基础组件
order: 90
---

# Scrollbar 滚动条

用于替换浏览器原生滚动条。

## 基础用法

:::demo 通过 `height` 属性设置滚动条高度，若不设置则根据父容器高度自适应。

scrollbar/basic-usage

:::

## 横向滚动

:::demo 当元素宽度大于滚动条宽度时，会显示横向滚动条。

scrollbar/horizontal-scroll

:::

## 最大高度

:::demo 当元素高度超过最大高度，才会显示滚动条。

scrollbar/max-height

:::

## 手动滚动

:::demo 通过使用 `setScrollTop` 与 `setScrollLeft` 方法，可以手动控制滚动条滚动。

scrollbar/manual-scroll

:::

## 无限滚动^(2.10.0)

:::demo `end-reached` 是在滚动条到达底部时触发的。它可以用作无限滚动。

scrollbar/infinite-scroll

:::

## Scrollbar API

### Scrollbar Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 滚动条高度 | ^[string] / ^[number] | — |
| max-height | 滚动条最大高度 | ^[string] / ^[number] | — |
| native | 是否使用原生滚动条样式 | ^[boolean] | false |
| wrap-style | wrap 容器的样式 | ^[object]`CSSProperties` | — |
| wrap-class | wrap 容器的类名 | ^[string] | — |
| view-style | view 的样式 | ^[object]`CSSProperties` | — |
| view-class | view 的类名 | ^[string] | — |
| noresize | 容器尺寸不变时置为 true 可省去尺寸监听 | ^[boolean] | false |
| tag | view 的标签名 | ^[string] | div |
| always | 是否总是显示滚动条 | ^[boolean] | false |
| min-size | 滚动条最小尺寸 | ^[number] | 20 |
| id | view 的 id | ^[string] | — |
| role | view 的 role | ^[string] | — |
| aria-label | view 的 aria-label | ^[string] | — |
| aria-orientation | view 的 aria-orientation | ^[enum]`'horizontal' \| 'vertical'` | — |
| tabindex | wrap 的 tabindex | ^[number] / ^[string] | — |
| distance | 触发 end-reached 的距离阈值（px） | ^[number] | 0 |

### Scrollbar Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onScroll | 滚动时触发，返回滚动距离 | ^[Function]`({ scrollLeft, scrollTop }) => void` |
| onEndReached | 滚动到边界时触发 | ^[Function]`(direction: 'top' \| 'bottom' \| 'left' \| 'right') => void` |

### Scrollbar Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | `children` |

### Scrollbar Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| wrapRef | scrollbar wrap 的 ref | ^[object]`Ref<HTMLDivElement>` |
| update | 手动更新滚动条状态 | ^[Function]`() => void` |
| scrollTo | 滚动到指定坐标 | ^[Function]`(options \| number, yCoord?) => void` |
| setScrollTop | 设置距顶部距离 | ^[Function]`(scrollTop: number) => void` |
| setScrollLeft | 设置距左侧距离 | ^[Function]`(scrollLeft: number) => void` |
| handleScroll | 处理滚动事件 | ^[Function]`() => void` |
