---
title: "Checkbox 多选框"
description: "在一组备选项中进行多选。"
group: 表单组件
order: 30
---

# Checkbox 多选框

在一组备选项中进行多选。

## 基础用法

:::demo 单独使用可以表示两种状态之间的切换，独立使用时用 `checked` 与 `onCheckedChange`。

checkbox/basic

:::

## 禁用状态

:::demo 设置 `disabled` 属性即可禁用。

checkbox/disabled

:::

## 多选框组

:::demo 适用于多个勾选框绑定到同一个数组的情景，通过 `ElCheckboxGroup` 的 `value` 与 `onChange` 管理选中集合；每个 `ElCheckbox` 用 `value` 标识自己。

checkbox/grouping

:::

## 数据化选项

:::demo 通过 `options` 直接渲染选项数组，并用 `optionProps` 指定 `value`、`label`、`disabled` 的字段别名。

checkbox/options

:::

## indeterminate 状态

:::demo `indeterminate` 属性用以表示 checkbox 的不确定状态， 一般用于实现全选的效果。

checkbox/intermediate

:::

## 可选数量限制

:::demo 使用 `min` 和 `max` 属性限制选中的数量， 达到上限后未选中项自动禁用，达到下限后已选中项不可取消。

checkbox/limitation

:::

## 按钮样式

:::demo 设置 `type="button"` 可渲染为按钮形态， `fill` 与 `textColor` 控制选中态配色。

checkbox/button-style

:::

## 带边框

:::demo 设置 `border` 属性可以渲染为带有边框的多选框。

checkbox/with-border

:::

## Checkbox API

### Checkbox Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 独立使用时是否选中 | ^[boolean] | false |
| value | 组内使用时标识本选项的值 | ^[string] / ^[number] / ^[boolean] | — |
| label | 显示文案，也可直接用 children | ^[string] / ^[ReactNode] | — |
| indeterminate | 半选状态，仅控制样式 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| border | 是否显示边框 | ^[boolean] | false |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| button | button 形态，组内由 group 的 type 决定 | ^[boolean] | — |
| name | 原生 name 属性 | ^[string] | — |
| id | 原生 id 属性 | ^[string] | — |
| tabIndex | 原生 tabindex 属性 | ^[number] | — |

### Checkbox Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 独立使用时选中态变化 | ^[Function]`(checked: boolean) => void` |

### Checkbox Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义选中项文案 | `children` / `label` |

### CheckboxGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 容器 id | ^[string] | — |
| aria-label | 无障碍标签 | ^[string] | checkbox-group |
| value | 选中值集合 | ^[array]`CheckboxValueType[]` | [] |
| disabled | 是否禁用组内所有选项 | ^[boolean] | false |
| min | 最少选中数量 | ^[number] | — |
| max | 最多选中数量 | ^[number] | — |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| fill | button 形态选中态的背景色 | ^[string] | — |
| text-color | button 形态选中态的字体色 | ^[string] | — |
| tag | 容器标签名 | ^[string] | div |
| type | 渲染形态 | ^[enum]`'checkbox' \| 'button'` | checkbox |
| options | 数据化渲染选项 | ^[array] | — |
| option-props | 选项字段别名 | ^[object]`{ value?, label?, disabled? }` | — |

### CheckboxGroup Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中集合变化 | ^[Function]`(value: CheckboxValueType[]) => void` |

### CheckboxGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义选项内容；不传时按 options 渲染 | Checkbox |
