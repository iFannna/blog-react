---
title: Button 按钮
description: 常用的操作按钮。
group: 基础组件
order: 10
---

# Button 按钮

常用的操作按钮。

## 基础用法

:::demo 使用 `type`、`plain`、`round`、`dashed` 和 `circle` 来定义 Button 的样式。

button/basic

:::

## 禁用状态

:::demo 你可以使用 `disabled` 属性来定义按钮是否被禁用。

button/disabled

:::

## 链接按钮

:::warning

`type="text"` 已被 **废弃**，将于版本 ^(3.0.0) 时 **移除**，请考虑切换至新的 API。

新的 API `link` 于 ^(2.2.1) 版本时添加，你可以使用 `type` API 设置链接按钮的主题样式。

:::

:::demo

button/link

:::

## 文字按钮

:::tip

文字按钮在现在有了全新的设计样式。如果你想要使用老版样式的按钮，可以考虑使用 Link 组件。

API 也已更新，由于 `type` 属性会同时控制按钮的样式，因此我们通过一个新的 API `text: boolean` 来控制文字按钮。

:::

:::demo

button/text

:::

## 图标按钮

:::demo 使用 `icon` 属性来添加图标。你可以使用 `el-icon--right` 让图标显示在文字右侧。

button/icon

:::

## 按钮组

:::demo 以按钮组的方式出现，常用于拥有一系列相似操作的情况。`direction` 属性可控制按钮组的排列方向。

button/group

:::

## 加载状态按钮

:::tip

你可以使用 `loading` 插槽或 `loadingIcon` 属性自定义你的 loading 图标。

**ps: loading 插槽优先级高于 loadingIcon 属性**

:::

:::demo

button/loading

:::

## 调整尺寸

:::demo 使用 `size` 属性来额外配置尺寸，除了默认值外还提供 `large` 和 `small`。

button/size

:::

## 自定义标签

:::demo 通过 `tag` 属性将按钮渲染成任意标签，例如 `div` 或 `a`；其余属性会透传到该标签。

button/tag

:::

## 自定义颜色

:::demo 通过 `color` 属性自定义按钮颜色，组件会自动计算 hover、active 与禁用态的颜色。

button/custom

:::

## Button API

### Button Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| type | 按钮类型，在设置 color 时，后者优先。 | ^[enum]`'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| '' \| 'text' (deprecated)` | — |
| plain | 是否为朴素按钮 | ^[boolean] | false |
| text ^(2.2.0) | 是否为文字按钮 | ^[boolean] | false |
| bg ^(2.2.0) | 是否显示文字按钮背景颜色 | ^[boolean] | false |
| link ^(2.2.1) | 是否为链接按钮 | ^[boolean] | false |
| round | 是否为圆角按钮 | ^[boolean] | false |
| circle | 是否为圆形按钮 | ^[boolean] | false |
| dashed ^(2.13.3) | 是否是虚线按钮 | ^[boolean] | false |
| loading | 是否为加载中状态 | ^[boolean] | false |
| loading-icon | 自定义加载中状态图标组件 | ^[string] / ^[Component] | Loading |
| disabled | 按钮是否为禁用状态 | ^[boolean] | false |
| icon | 图标组件 | ^[string] / ^[Component] | — |
| autofocus | 原生 autofocus 属性 | ^[boolean] | false |
| native-type | 原生 type 属性 | ^[enum]`'button' \| 'submit' \| 'reset'` | button |
| auto-insert-space | 两个中文字符之间自动插入空格(仅当文本长度为 2 且所有字符均为中文时才生效) | ^[boolean] | false |
| color | 自定义按钮颜色, 并自动计算 hover 和 active 触发后的颜色 | ^[string] | — |
| dark | dark 模式, 意味着自动设置 color 为 dark 模式的颜色 | ^[boolean] | false |
| tag ^(2.3.4) | 自定义元素标签 | ^[string] / ^[Component] | button |

### Button Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClick | 点击按钮时触发；禁用或加载中时不会触发 | ^[Function]`(event: MouseEvent) => void` |

### Button Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | `children` |
| loading | 自定义加载中组件 | `loadingIcon` |
| icon | 自定义图标组件 | `icon` |

### Button Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| ref | 按钮 html 元素 | ^[object]`Ref<HTMLButtonElement>` |
| size | 按钮尺寸 | ^[object]`ComputedRef<'' \| 'small' \| 'default' \| 'large'>` |
| type | 按钮类型 | ^[object]`ComputedRef<'' \| 'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'text'>` |
| disabled | 按钮禁用状态 | ^[object]`ComputedRef<boolean>` |
| shouldAddSpace | 是否添加空格 | ^[object]`ComputedRef<boolean>` |

## ButtonGroup API

### ButtonGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 控制组内按钮的尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| type | 控制组内按钮的类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | — |
| direction ^(2.11.9) | 显示方向 | ^[enum]`'horizontal' \| 'vertical'` | horizontal |

### ButtonGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义按钮组内容 | Button |

## 与 Vue 版 API 的差异

React 版沿用官方的类名、CSS 变量与单位，仅事件与双向绑定改为 React 惯用写法：

| 官方 Vue | React |
| --- | --- |
| `@click` | `onClick` |
| `<slot name="loading">` | `loadingIcon` |
| `<slot name="icon">` | `icon` |
| 通过 `ref` 调用 `focus()` 等方法 | 直接传 `ref` 到原生元素 |

其他差异：

- 原生 `autofocus` 属性在 React 中写作 `autoFocus`。
- `native-type="reset"` 时除浏览器原生重置外，还会调用所在 ElForm 的 `resetFields()`。
- `tag` 渲染非 `button` 标签时不会下发原生 `disabled` / `type`，禁用态由 `onClick` 拦截，与官方一致。
