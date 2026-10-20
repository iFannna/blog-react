---
title: "Radio 单选框"
description: "在一组备选项中进行单选。"
group: 表单组件
order: 150
---

# Radio 单选框

在一组备选项中进行单选。

## 基础用法

:::demo 单选框不应该有太多的可选项，如果需要有很多的选项，建议使用 Select 组件。 使用 `ElRadioGroup` 的 `value` 与 `onChange` 管理选中值，`ElRadio` 用 `value` 标识自己。

radio/basic-usage

:::

## 禁用状态

:::demo 设置 `disabled` 属性即可禁用，可以在单个 Radio 上设置， 也可以用 `ElRadioGroup` 的 `disabled` 禁用整组。

radio/disabled

:::

## 数据化选项

:::demo 通过 `options` 直接渲染选项数组，并用 `optionProps` 指定 `value`、`label`、`disabled` 的字段别名。

radio/options

:::

## 按钮样式

:::demo 设置 `type="button"` 可渲染为按钮形态， `fill` 与 `textColor` 控制选中态配色。

radio/radio-button

:::

## 带边框

:::demo 设置 `border` 属性可以渲染为带有边框的单选框。

radio/with-borders

:::

## 尺寸

:::demo 通过 `size` 属性控制尺寸。

radio/sizes

:::

## Radio API

### Radio Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 本选项的值，与 group 的 value 相等时选中 | ^[string] / ^[number] / ^[boolean] | — |
| checked | 脱离 group 独立使用时的选中态 | ^[boolean] | false |
| label | 显示文案，也可直接用 children | ^[string] / ^[ReactNode] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| border | 是否显示边框 | ^[boolean] | false |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| name | 原生 name 属性 | ^[string] | — |
| button | button 形态，组内由 group 的 type 决定 | ^[boolean] | — |

### Radio Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 独立使用时选中态变化 | ^[Function]`(checked: boolean) => void` |

### Radio Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义单选框文案 | `children` / `label` |

### RadioGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 容器 id | ^[string] | — |
| aria-label | 无障碍标签 | ^[string] | radio-group |
| value | 当前选中值 | ^[string] / ^[number] / ^[boolean] | — |
| disabled | 是否禁用组内所有单选框 | ^[boolean] | false |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| name | 原生 name 属性 | ^[string] | — |
| fill | button 形态选中态的背景色 | ^[string] | — |
| text-color | button 形态选中态的字体色 | ^[string] | — |
| type | 渲染形态 | ^[enum]`'radio' \| 'button'` | radio |
| options | 数据化渲染选项 | ^[array] | — |
| option-props | 选项字段别名 | ^[object]`{ value?, label?, disabled? }` | — |

### RadioGroup Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化 | ^[Function]`(value: RadioValue) => void` |

### RadioGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义选项内容；不传时按 options 渲染 | Radio |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model`（组内） | group 的 `value` + `onChange` | 单值不是布尔，故不用 checked |
| `v-model`（独立） | `checked` + `onCheckedChange` | 独立使用时为布尔选中态 |
| `@change` | `onChange` / `onCheckedChange` | — |
| `label` 兼作 value | 需显式传 `value` | 官方标记为 3.0 移除 |
| group 的 `props`（选项字段别名） | group 的 `optionProps` | 避免与 React 组件 props 混淆 |

**未实现的官方能力**：

- 组内 `label` 兼作 `value`（官方 3.0 将移除）。

`validate-event` 已接入 ElFormItem：RadioGroup 的值变化后触发 `change` 校验（与官方一致，独立 Radio 不触发）。
