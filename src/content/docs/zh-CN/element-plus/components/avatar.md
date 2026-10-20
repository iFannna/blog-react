---
title: "Avatar 头像"
description: "用来代表用户或事物，支持图片、图标或字符展示。"
group: 数据展示
order: 10
---

# Avatar 头像

用来代表用户或事物，支持图片、图标或字符展示。

## 基础用法

:::demo 头像支持圆形与方形两种形状，并可通过 `size` 设置尺寸； 数字按 px 处理，也可传入 `small` / `large`。

avatar/basic

:::

## 展示类型

:::demo 支持图片、Icon 与字符三种类型，其中 Icon 和字符型可以自定义样式。

avatar/types

:::

## 加载失败

:::demo 图片加载失败时回退到默认插槽内容，可借此展示兜底图片。

avatar/fallback

:::

## 图片填充方式

:::demo 通过 `fit` 设置图片的 `object-fit`。

avatar/fit

:::

## 头像组

:::demo 使用 `ElAvatarGroup` 将多个头像组合展示，支持折叠超出的头像， 并可选择悬浮时展示全部被折叠的头像。

avatar/group

:::

## Avatar API

### Avatar Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 尺寸，数字按 px 处理，也可传尺寸名 | ^[number] / ^[enum]`'large' \| 'default' \| 'small'` | — |
| shape | 形状 | ^[enum]`'circle' \| 'square'` | circle |
| icon | 图标，图片加载失败时回退显示 | ^[Component] | — |
| src | 图片地址 | ^[string] | — |
| alt | 原生 alt | ^[string] | — |
| src-set | 原生 srcSet | ^[string] | — |
| fit | 图片填充方式 | ^[enum]`'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | cover |

### Avatar Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onError | 图片加载失败时触发 | ^[Function]`(event: SyntheticEvent) => void` |

### AvatarGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 统一尺寸，下发到组内 Avatar | ^[number] / ^[string] | — |
| shape | 统一形状，下发到组内 Avatar | ^[enum]`'circle' \| 'square'` | — |
| collapse-avatars | 是否折叠超出的头像 | ^[boolean] | false |
| collapse-avatars-tooltip | 悬浮折叠头像时展示全部被折叠的头像 | ^[boolean] | false |
| max-collapse-avatars | 最多展示的头像数量 | ^[number] | 1 |
| effect | 折叠提示主题 | ^[enum]`'dark' \| 'light'` | light |
| placement | 折叠提示位置 | ^[enum] placement | top |
| popper-class / popper-style | 折叠提示的自定义类名与样式 | ^[string] / ^[object] | — |
| collapse-class / collapse-style | 折叠头像的类名与样式 | ^[string] / ^[object] | — |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot />` | `children` | 默认内容；Fragment 内的头像同样会被展开计数 |
| `@error` | `onError` | — |
