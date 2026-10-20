---
title: "Card 卡片"
description: "将信息聚合在卡片容器中展示。"
group: 数据展示
order: 40
---

# Card 卡片

将信息聚合在卡片容器中展示。

## 基础用法

:::demo 包含标题、内容、操作区域。通过 `header` 属性设置标题。

card/basic

:::

## 阴影效果

:::demo 通过 `shadow` 属性设置卡片阴影出现的时机， 可选值为 `always`、`hover`、`never`。

card/shadow

:::

## 头部与页脚

:::demo `header` 与 `footer` 都接受节点，可传入自定义结构。 不传时不渲染对应区域。

card/simple

:::

## 自定义样式

:::demo 通过 `bodyStyle` 设置内容区样式， `bodyClass` / `headerClass` / `footerClass` 追加自定义类名。

card/with-images

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="header">` | `header` 属性 | 接受字符串或节点 |
| `<slot name="footer">` | `footer` 属性 | 接受字符串或节点 |
| `body-style` | `bodyStyle` | JSX 里用驼峰 |

`shadow` 缺省时取 `ConfigProvider` 的全局 `card.shadow`，再回退到
`always`，与官方一致。
