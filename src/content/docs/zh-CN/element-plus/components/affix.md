---
title: "Affix 固钉"
description: "将页面元素固定在特定可见区域。"
group: 导航
order: 10
---

# Affix 固钉

将页面元素固定在特定可见区域。

## 基础用法

:::demo 固钉默认固定在页面顶部。通过 `offset` 可以改变偏移距离，默认为 0。

affix/basic

:::

## 固定目标容器

:::demo 设置 `target` 属性可以让固钉始终留在容器内，超出范围则隐藏。 请注意容器不要有滚动条。

affix/target

:::

## 固定位置

:::demo 组件提供 `top` 与 `bottom` 两种固定位置， 通过 `position` 设置，默认为 `top`。

affix/fixed

:::

## Affix API

### Affix Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offset | 偏移距离，px | ^[number] | 0 |
| position | 固定位置 | ^[enum]`'top' \| 'bottom'` | top |
| target | 目标容器选择器，设置后固钉始终留在容器内，超出范围即隐藏 | ^[string] | — |
| z-index | 固定时的 z-index | ^[number] / ^[string] | 100 |
| teleported | 是否把固钉元素传送到 `append-to` | ^[boolean] | false |
| append-to | 传送目标 | ^[CSSSelector] / ^[HTMLElement] | body |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Affix Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 固定状态变化时触发 | ^[Function]`(fixed: boolean) => void` |
| onScroll | 滚动时触发 | ^[Function]`(value: { scrollTop: number, fixed: boolean }) => void` |

### Affix Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | `children` |

### Affix Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| update | 手动更新固钉状态 | ^[Function]`() => void` |
| updateRoot | 重新测量 root 尺寸信息 | ^[Function]`() => void` |

> 通过 `ref` 拿到 expose：`const ref = useRef<AffixExpose>(null)`，再调用 `ref.current?.update()`。
