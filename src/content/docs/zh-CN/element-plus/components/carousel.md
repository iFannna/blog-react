---
title: "Carousel 走马灯"
description: "在有限空间内，循环播放同一类型的图片、文字等内容。"
group: 数据展示
order: 50
---

# Carousel 走马灯

在有限空间内，循环播放同一类型的图片、文字等内容。

## 基础用法

:::demo 将 `ElCarousel` 与 `ElCarouselItem` 组合使用即可得到走马灯。 幻灯片内容完全可自定义，只需放进 `ElCarouselItem` 内。默认鼠标移入 指示器即切换，将 `trigger` 设为 `click` 后只有点击指示器才切换。

carousel/basic

:::

## 动态模糊2.6.0

:::demo 开启动态模糊可增强走马灯切换时的动感与流畅度。`motionBlur` 默认为  `false`，开启后切换过程会带高斯模糊。

carousel/motion-blur

:::

## 指示器

指示器可以显示在走马灯外部。

`indicatorPosition` 决定指示器位置：默认在内部，设为  `outside` 显示在外部，设为 `none` 则隐藏。

:::demo

carousel/indicator

:::

## 箭头

可以定义箭头显示的时机。

`arrow` 决定箭头何时显示：默认鼠标移入走马灯时显示，设为  `always` 或 `never` 表示常显或常隐。

:::demo

carousel/arrows

:::

## 自动高度

:::demo 当 `height` 设为 `auto` 时，走马灯高度会随  `ElCarouselItem` 的高度自动变化。

carousel/auto-height

:::

## 卡片化

当页面足够宽但高度有限时，可以开启卡片化模式。

将 `type` 设为 `card` 即可开启。除了外观，卡片化与普通模式 最大的区别在于：点击两侧的幻灯片会直接切换走马灯。

:::demo

carousel/card

:::

## 垂直方向

:::demo `direction` 默认为 `horizontal`，设为 `vertical`  即可纵向展示。

carousel/vertical

:::

## Carousel API

### Carousel Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 轮播高度，设为 `auto` 时按激活项高度自适应 | ^[string] | '' |
| initial-index | 初始激活项下标，从 0 开始 | ^[number] | 0 |
| trigger | 指示器触发方式 | ^[enum]`'hover' \| 'click'` | hover |
| autoplay | 是否自动切换 | ^[boolean] | true |
| interval | 自动切换间隔，毫秒 | ^[number] | 3000 |
| indicator-position | 指示器位置 | ^[enum]`'' \| 'none' \| 'outside'` | '' |
| arrow | 箭头显示时机 | ^[enum]`'always' \| 'hover' \| 'never'` | hover |
| type | 轮播类型 | ^[enum]`'' \| 'card'` | '' |
| card-scale | 卡片化时非激活项的缩放比例 | ^[number] | 0.83 |
| loop | 是否循环播放 | ^[boolean] | true |
| direction | 展示方向 | ^[enum]`'horizontal' \| 'vertical'` | horizontal |
| pause-on-hover | 鼠标悬停时是否暂停自动切换 | ^[boolean] | true |
| motion-blur | 是否为切换过程加高斯模糊 | ^[boolean] | false |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Carousel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 激活项切换时触发 | ^[Function]`(current: number, prev: number) => void` |

### Carousel Exposes（通过 ref 获取）

| 方法 / 属性 | 说明 | 类型 |
| --- | --- | --- |
| activeIndex | 当前激活项下标（只读） | ^[number] |
| setActiveItem | 手动切换到指定项，传下标或项的 name | ^[Function]`(index: string \| number) => void` |
| prev | 切换到上一项 | ^[Function]`() => void` |
| next | 切换到下一项 | ^[Function]`() => void` |

### Carousel-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 项名称，可在 setActiveItem 中代替下标使用 | ^[string] | '' |
| label | 对应指示器的文本内容 | ^[string] / ^[number] | '' |
