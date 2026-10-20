---
title: "Avatar 头像"
description: "用来代表用户或事物，支持图片、图标或字符展示。"
group: 数据展示
order: 10
---

# Avatar 头像

Avatar 组件可以用来代表人物或对象，支持使用图片、图标或者文字作为 Avatar。

## 基础用法

:::demo 使用 `shape` 和 `size` 属性来设置 Avatar 的形状和大小。

avatar/basic

:::

## 展示类型

:::demo 支持使用图片，图标或者文字作为 Avatar。

avatar/types

:::

## 回退行为

:::demo 图片加载失败时的回退行为。

avatar/fallback

:::

## 适应容器

:::demo 当使用图片作为用户头像时，设置该图片如何在容器中展示。与[ object-fit ](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) 属性一致

avatar/fit

:::

## 头像组 ^(2.13.1)

显示为头像组

:::demo 使用标签 `<el-avatar-group>` 来分组您的头像。

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
