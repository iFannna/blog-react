---
title: "Config Provider 全局配置"
description: "Config Provider 用于提供全局配置，让整个应用各处都能访问到这些配置。 在 React 版里由 React Context 实现，组件内部通过 `useGlobalConfig` 读取。"
group: 全局配置
order: 10
---

# Config Provider 全局配置

Config Provider 被用来提供全局的配置选项，让你的配置能够在全局都能够被访问到。

## i18n 配置

通过 Config Provider 来配置多语言，让你的应用可以随时切换语言。

:::demo 使用两个属性来提供 i18n 相关配置

config-provider/usage

:::

## 对按钮进行配置

:::demo

config-provider/button

:::

## 对链接进行配置 ^(2.9.11)

:::demo

config-provider/link

:::

## 对 Card 进行配置 ^(2.10.5)

:::demo

config-provider/card

:::

## 对 Dialog 进行配置 ^(2.10.7)

:::demo

config-provider/dialog

:::

## 对消息进行配置

:::demo

config-provider/message

:::

## 空值配置^(2.7.0)

设置 `empty-values` 来配置组件的默认空值。默认值是 `['', null, undefined]`。如果认为空字符串不是一个空值，可以设置成 `[undefined, null]`。

设置 `value-on-clear` 以设置清空选项的值。组件默认值是 `undefined`。在日期组件中是 `null`。如果想设置成 `undefined`，请使用 `() => undefined`。

:::demo

config-provider/empty-values

:::

## 表格配置 ^(2.13.3)

:::demo

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
