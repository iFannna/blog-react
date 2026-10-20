---
title: "Config Provider 全局配置"
description: "Config Provider 用于提供全局配置，让整个应用各处都能访问到这些配置。 在 React 版里由 React Context 实现，组件内部通过 `useGlobalConfig` 读取。"
group: 全局配置
order: 10
---

# Config Provider 全局配置

Config Provider 用于提供全局配置，让整个应用各处都能访问到这些配置。 在 React 版里由 React Context 实现，组件内部通过 `useGlobalConfig` 读取。

## 国际化

:::demo 通过 `locale` 提供语言包，即可获得语言切换能力。

config-provider/usage

:::

## 按钮配置

:::demo `button` 下的字段会成为按钮的全局默认值，组件自身传入时优先。

config-provider/button

:::

## 链接配置

:::demo `link` 控制链接的默认类型与下划线时机。

config-provider/link

:::

## 卡片配置

:::demo `card.shadow` 控制卡片阴影的展示时机。

config-provider/card

:::

## 对话框配置

:::demo `dialog` 控制对话框的居中、拖拽与溢出行为。

config-provider/dialog

:::

## 消息配置

:::demo `message` 作用于命令式的 `message()`， 例如限制同位置最多显示的条数、统一位置与样式。

config-provider/message

:::

## 空值配置

:::demo 通过 `emptyValues` 自定义哪些值算「空」，通过  `valueOnClear` 指定清空后的返回值。默认空值为  `["", undefined, null]`；若认为空字符串有意义，可写  `[undefined, null]`。清空返回值默认是 `undefined`， 想得到 `undefined` 时请传 `() => undefined`。

config-provider/empty-values

:::

## 表格配置

:::demo `table.showOverflowTooltip` 会作用到所有列， 单列显式传 `false` 可覆盖。

config-provider/table

:::

## 实验性功能

在本节中，您可以学习如何使用 Config Provider 来提供实验性功能。现在，我们还没有添加任何实验性功能，但在未来的规划中，我们将添加一些实验性功能。您可以使用此配置来管理这些功能。

## Config Provider API

### Config Provider Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| locale | 语言包对象 | ^[object]`Language` | en |
| size | 全局组件尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| zIndex | 全局初始 zIndex | ^[number] | — |
| namespace | 全局类名前缀 | ^[string] | el |
| button | 按钮相关配置 | ^[object]`ButtonConfigContext` | — |
| link | 链接相关配置 | ^[object]`LinkConfigContext` | — |
| card | 卡片相关配置 | ^[object]`CardConfigContext` | — |
| dialog | 对话框相关配置 | ^[object]`DialogConfigContext` | — |
| message | 消息相关配置 | ^[object]`MessageConfigContext` | — |
| table | 表格相关配置 | ^[object]`TableConfigContext` | — |
| experimental-features | 实验特性开关 | ^[object] | — |
| empty-values | 全局空值集合 | ^[array] | — |
| value-on-clear | 全局清空返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] / ^[null] | — |
| a11y | 无障碍特性开关 | ^[boolean] | true |
| keyboard-navigation | 键盘导航开关 | ^[boolean] | true |

### Button Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' \| 'default'` | — |
| autoInsertSpace | 两个汉字间自动插入空格 | ^[boolean] | false |
| plain | 朴素按钮 | ^[boolean] | false |
| text | 文字按钮 | ^[boolean] | false |
| round | 圆角按钮 | ^[boolean] | false |
| dashed | 虚线按钮 | ^[boolean] | false |

### Link Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 链接类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | default |
| underline | 下划线时机 | ^[enum]`'always' \| 'hover' \| 'never'` | hover |

### Card Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| shadow | 阴影显示时机 | ^[enum]`'always' \| 'never' \| 'hover'` | — |

### Dialog Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align-center | 水平垂直居中 | ^[boolean] | false |
| draggable | 可拖拽 | ^[boolean] | false |
| overflow | 拖拽时可溢出视口 | ^[boolean] | false |
| transition | 过渡名字符串 | ^[string] | — |

### Message Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| max | 同位置最多显示的条数 | ^[number] | — |
| grouping | 合并相同内容的消息 | ^[boolean] | — |
| duration | 显示时长（毫秒），0 表示不自动关闭 | ^[number] | — |
| show-close | 是否显示关闭按钮 | ^[boolean] | — |
| offset | 距视口边缘距离（px） | ^[number] | — |
| plain | 朴素样式 | ^[boolean] | — |
| placement | 显示位置 | ^[enum]`'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | — |

### Table Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show-overflow-tooltip | 全局为所有列开启溢出省略 | ^[boolean] | — |
| tooltip-effect | 溢出提示的主题 | ^[enum]`'dark' \| 'light'` | dark |

### Config Provider Slots

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| default | 自定义默认内容 | config: 当前生效的全局配置 |
