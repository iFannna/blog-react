---
title: "Link 链接"
description: "文字超链接。"
group: 基础组件
order: 70
---

# Link 链接

文字超链接。

## 基础用法

:::demo 基础的文字链接用法，通过 `type` 设置类型。

link/basic

:::

## 禁用状态

:::demo 设置 `disabled` 属性即可禁用链接。

link/disabled

:::

## 下划线

:::demo 通过 `underline` 属性控制下划线的显示时机。

link/underline

:::

## 图标

:::demo `icon` 属性在文字左侧显示图标，右侧图标直接写在 `children` 里。

link/with-icon

:::

## Link API

### Link Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 链接类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | default |
| underline | 下划线时机 | ^[enum]`'always' \| 'hover' \| 'never'` | hover |
| disabled | 是否禁用 | ^[boolean] | false |
| href | 原生 href | ^[string] | — |
| target | 原生 target | ^[string] | _self |
| icon | 图标，显示在文字左侧 | ^[Component] | — |

### Link Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClick | 点击时触发，禁用时不触发 | ^[Function]`(event: MouseEvent) => void` |

### Link Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 链接内容 | `children` |
| icon | 图标，显示在文字右侧 | 直接写在 `children` 里 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `underline` 布尔写法 | 未实现 | 官方标记 3.0 移除，请用 `'always' \| 'hover' \| 'never'` |
| `<slot name="icon">` | 直接放 children 里 | 左侧图标用 `icon` 属性 |

**实现说明**：

- 禁用或未传 `href` 时不下发 `href` / `target` 属性，链接因此不可聚焦、不可点击，
  与官方的处理一致；禁用时还会 `preventDefault` 兜底。
- `underline` 为 `hover` 且禁用时不加 `is-hover-underline` 类，避免禁用态仍有悬停反馈。

`type` / `underline` 缺省时取 `ConfigProvider` 的全局 `link` 配置，
再分别回退到 `default` / `hover`，与官方一致。
