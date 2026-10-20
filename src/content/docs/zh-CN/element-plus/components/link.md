---
title: "Link 链接"
description: "文字超链接。"
group: 基础组件
order: 70
---

# Link 链接

文字超链接

:::warning 安全警告 `href` prop 将会直接渲染到 `<a>` 标签内部。如果你传递类似 `javascript:alert(1)` 这样的值或恶意 URL，可能会导致 **XSS** 或**开放重定向漏洞**。

在使用前始终验证并净化 URL。例如：

<details>
<summary>显示代码示例</summary>

```js
function sanitigzeUrl(url) {
  const allowedprotocol= ['http:', 'https://']
  try {
    const parsed = new URL(url, window.location.origin)
    return allowedProtocols.includes(parsed.protocol) ? parsed.href : '#'
  } catch {
    return '#'
  }
}
```

</details>

:::

## 基础用法

基础的文字链接用法。

:::demo

link/basic

:::

## 禁用状态

文字链接不可用状态。

:::demo

link/disabled

:::

## 下划线

控制下划线是否出现

:::warning

属性 `boolean` 值 **将在** ^(3.0.0) 版本中被**移除**，请考虑切换至新的 API。

:::

:::tip

从 ^(2.9.9) 开始，你可以使用 `'always' | 'hover' | 'never'` 来控制是否显示下划线。文档中的示例将都使用这些值。如果您使用的版本 **低于** ^(2.9.9)，请参考：

:::

```vue
<template>
  <!-- works before 2.9.9, use 'hover' after, removed in 3.0.0 -->
  <el-link underline>link</el-link>
  <!-- works before 2.9.9, use 'never' after, removed in 3.0.0 -->
  <el-link :underline="false">link</el-link>
</template>
```

:::demo

link/underline

:::

## 图标

带图标的链接

:::tip

使用 `icon` 属性来为按钮添加图标。您可以传递组件名称的字符串（提前注册）或组件本身是一个 SVG Vue 组件。 Element Plus 提供了一套图标，您可以在 [icon](./icon) 找到它们。

:::

:::demo

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
