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

:::demo 当元素高度超过最大高度时，会出现纵向滚动条。

scrollbar/max-height

:::

## 手动滚动

:::demo 通过 `ref` 上的 `setScrollTop` 等方法可以手动控制滚动位置。

scrollbar/manual-scroll

:::

## 无限滚动

:::demo 配合 `distance` 与 `onEndReached` 可以实现无限滚动加载。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `defineExpose` 的 `wrapRef` | `ScrollbarExpose.wrapRef` | 同样是一个 ref 对象 |
| `wrap-style` 接受字符串 / 数组 | 只接受 `CSSProperties` 对象 | React 的 style 语义 |
| `@end-reached` | `onEndReached` | 同义 |
| `@scroll` | `onScroll` | 同义 |

**实现说明**：

- 滑块尺寸与位移的换算逐行对齐官方 `bar.vue` 的 `update` / `handleScroll`，
  包括 `offsetHeight² / scrollHeight` 得出原始滑块高度、`ratio` 的二次比例换算、
  `GAP = 4` 的余量扣除。
- 拖动与点击轨道的换算对齐官方 `thumb.vue`，含 `offsetRatio` 的实现。
- `distance > 0` 时的到达判定用官方那套「到达后要等相反方向也到达才允许再次派发」的去抖逻辑。
- 滑块的显隐（鼠标进出滚动容器）直接改 DOM 的 `display`，与官方 `v-show` 等价，
  同时避免拖动这种高频操作反复触发 React 渲染。

**未实现的官方能力**：

- 官方的滑块显隐带 `el-scrollbar-fade` 过渡动画；本项目直接切 `display`，没有淡入淡出。
- 官方 `onActivated` 的 keep-alive 滚动位置恢复：Next.js App Router 没有 keep-alive，
  该分支无对应场景。
