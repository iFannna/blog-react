---
title: "Carousel 走马灯"
description: "在有限空间内，循环播放同一类型的图片、文字等内容。"
group: 数据展示
order: 50
---

# Carousel 走马灯

在有限空间内，循环播放同一类型的图片、文字等内容

## 基础用法

:::demo 结合使用 `el-carousel` 和 `el-carousel-item` 标签就得到了一个走马灯。每一个页面的内容是完全可定制的，把你想要展示的内容放在 `el-carousel-item` 标签内。默认情况下，在鼠标 hover 底部的指示器时就会触发切换。通过设置 `trigger` 属性为 `click`，可以达到点击触发的效果。

carousel/basic

:::

## 动态模糊 ^(2.6.0)

添加动态模糊以给走马灯注入活力和流畅性。

:::demo 启用动态模糊增强了走马灯的活力和流畅性。 `motion-blur` 的默认值是 `false`，手动激活此功能即可提供视觉感受上的提升。

carousel/motion-blur

:::

## 指示器

可以将指示器的显示位置设置在容器外部

:::demo `indicator-position` 属性定义了指示器的位置。默认情况下，它会显示在走马灯内部，设置为 `outside` 则会显示在外部；设置为 `none` 则不会显示指示器。

carousel/indicator

:::

## 切换箭头

可以设置切换箭头的显示时机

:::demo `arrow` 属性定义了切换箭头的显示时机。默认情况下，切换箭头只有在鼠标 hover 到走马灯上时才会显示。若将 `arrow` 设置为 `always`，则会一直显示；设置为 `never`，则会一直隐藏。

carousel/arrows

:::

## 自动高度

:::demo 当 `carousel `的` height` 设置为 `auto`时， `carousel` 的高度将根据子内容的高度自动设置

carousel/auto-height

:::

## 卡片模式

当页面宽度方向空间空余，但高度方向空间匮乏时，可使用卡片风格

:::demo 将 `type` 属性设置为 `card` 即可启用卡片模式。从交互上来说，卡片模式和一般模式的最大区别在于，卡片模式可以通过直接点击两侧的幻灯片进行切换。

carousel/card

:::

## 垂直排列

:::demo 默认情况下，方向 `direction` 为 水平 `horizontal`。通过设置 `direction` 为 `vertical` 来让走马灯在垂直方向上显示。

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
