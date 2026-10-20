---
title: "Tabs 标签页"
description: "分隔内容上有关联的部分。"
group: 导航
order: 90
---

# Tabs 标签页

分隔内容上有关联但属于不同类别的数据集合。

## 基础用法

基础的、简洁的标签页。

:::demo Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 `value` 属性来指定当前选中的标签页。

tabs/basic

:::

## 卡片风格的标签

你可以设置具有卡片风格的标签。

:::demo 只需要设置 `type` 属性为 `card` 就可以使选项卡改变为标签风格。

tabs/card-style

:::

## 带有边框的卡片风格

你还可以设置标签页为带有边框的卡片

:::demo 将 `type` 设置为 `border-card`。

tabs/border-card

:::

## 标签位置的设置

可以通过 `tab-position` 设置标签的位置

:::demo 标签一共有四个方向的设置 `tabPosition="left|right|top|bottom"`

tabs/tab-position

:::

## 自定义标签页的内容

可以通过具名插槽来实现自定义标签页的内容

:::demo

tabs/custom-tab

:::

## 动态增减标签页

增减标签页按钮只能在选项卡样式的标签页下使用

:::demo

tabs/dynamic-tabs

:::

## 添加按钮自定义图标 ^(2.4.0)

:::demo

tabs/customized-add-button-icon

:::

## 增加标签页触发器自定义

:::demo

tabs/customized-trigger

:::

## 默认值^(2.11.9)

:::demo

tabs/default-value

:::

## Tabs API

### Tabs Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中面板的 name，受控 | ^[string] / ^[number] | — |
| defaultValue | 非受控时的初始选中 name | ^[string] / ^[number] | 第一个面板 |
| type | 风格类型 | ^[enum]`'' \| 'card' \| 'border-card'` | — |
| tabPosition | 选项卡位置 | ^[enum]`'top' \| 'right' \| 'bottom' \| 'left'` | top |
| closable | 标签是否可关闭 | ^[boolean] | false |
| addable | 是否显示加号 | ^[boolean] | false |
| editable | 是否可增删 | ^[boolean] | false |
| addIcon | 自定义新增按钮图标，等价官方 `add-icon` 插槽 | ^[ReactNode] | Plus 图标 |
| stretch | 标签宽度是否自撑开 | ^[boolean] | false |
| beforeLeave | 切换前钩子，返回 false 阻止 | ^[Function]`(newName, oldName) => boolean \| Promise<boolean>` | — |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Tabs Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中面板变化（受控值更新） | ^[Function]`(name) => void` |
| onTabClick | 点击标签（含已选中） | ^[Function]`(name) => void` |
| onTabRemove | 点击关闭按钮或按 Delete / Backspace | ^[Function]`(name) => void` |
| onTabAdd | 点击新增按钮 | ^[Function]`() => void` |
| onEdit | 增删统一回调，等价官方 `edit` | ^[Function]`(name \| undefined, 'remove' \| 'add') => void` |

### Tabs Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板集合 | children |
| add-icon | 自定义新增按钮图标 | `addIcon` 属性 |

### TabPane Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板标识，省略时用下标字符串 | ^[string] / ^[number] | — |
| label | 标签标题，可传节点 | ^[ReactNode] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| closable | 是否可关闭，优先于 Tabs 的 closable | ^[boolean] | — |
| lazy | 是否懒渲染（首次激活后保留） | ^[boolean] | false |

### TabPane Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板内容 | children |
| label | 自定义标签内容 | `label` 属性 |
