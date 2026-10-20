---
title: "Card 卡片"
description: "将信息聚合在卡片容器中展示。"
group: 数据展示
order: 40
---

# Card 卡片

将信息聚合在卡片容器中展示。

## 基础用法

卡片包含标题，内容以及操作区域。

:::demo Card 组件由 `header` `body` 和 `footer` 组成。 `header` 和 `footer` 是可选的，其内容取决于一个具名的 slot。

card/basic

:::

## 简单卡片

卡片可以只有内容区域。

:::demo

card/simple

:::

## 有图片内容的卡片

可配置定义更丰富的内容展示。

:::demo 配置 `body-style` 属性来自定义 `body` 部分的样式。

card/with-images

:::

## 带有阴影效果的卡片

你可以定义什么时候展示卡片的阴影效果。

:::demo 通过 `shadow` 属性设置卡片阴影出现的时机。该属性的值可以是：`always`、`hover` 或 `never`。

card/shadow

:::

## Card API

### Card Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| header | 标题，也可传入节点 | ^[string] / ^[ReactNode] | — |
| footer | 页脚，也可传入节点 | ^[string] / ^[ReactNode] | — |
| body-style | 内容区样式 | ^[object]`CSSProperties` | — |
| header-class | 自定义头部类名 | ^[string] | — |
| body-class | 自定义内容区类名 | ^[string] | — |
| footer-class | 自定义页脚类名 | ^[string] | — |
| shadow | 阴影显示时机 | ^[enum]`'always' \| 'hover' \| 'never'` | always |

### Card Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 内容区 | `children` |
| header | 头部内容 | `header` |
| footer | 页脚内容 | `footer` |
