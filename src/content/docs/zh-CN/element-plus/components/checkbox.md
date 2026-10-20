---
title: "Checkbox 多选框"
description: "在一组备选项中进行多选。"
group: 表单组件
order: 30
---

# Checkbox 多选框

在一组备选项中进行多选。

:::warning

`label` 作为 `value` 来使用已经被 **废弃**, 建议`label` 只用来表示展示的文字，这个被废弃的用法**将会在** ^(3.0.0) 版本被移除，请考虑使用新 API 替换.

:::

:::tip

新的 API `value` 已在 ^(2.6.0) 版本添加，文档中的示例都将使用 `value`。如果您使用的版本 **低于** ^(2.6.0) 并且使用 `checkbox-group`，请参考：

:::

## 基础用法

单独使用可以表示两种状态之间的切换，写在标签中的内容为 checkbox 按钮后的介绍。

`checkbox-group`元素能把多个 checkbox 管理为一组，只需要在 Group 中使用 `v-model` 绑定 `Array` 类型的变量即可。只有一个选项时的默认值类型为 `Boolean`，当选中时值为`true`。 `el-checkbox` 标签中的内容将成为复选框按钮之后的描述。

:::demo

checkbox/basic

:::

## 禁用状态

多选框不可用状态。

设置 `disabled` 属性即可。

:::demo

checkbox/disabled

:::

## 多选框组

适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。

在 `el-checkbox` 元素中定义 `v-model` 绑定变量，单一的 `checkbox` 中，默认绑定变量的值会是 `Boolean`，选中为 `true`。在 `el-checkbox` 组件中，`value` 是选择框的值。如果该组件下没有被传入内容，那么 `label` 将会作为 checkbox 按钮后的介绍。 `value` 也与数组中的元素值相对应。如果指定的值存在于数组中，就处于选择状态，反之亦然。

:::demo

checkbox/grouping

:::

## Options 属性 ^(2.11.2)

基础用法 `el-checkbox-group` 的快捷示例。您可以通过 `props` 属性自定义 `options` 的别名。

:::demo

checkbox/options

:::

## 中间状态

`indeterminate` 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果

:::demo

checkbox/intermediate

:::

## 可选项目数量的限制

使用 `min` 和 `max` 属性能够限制可以被勾选的项目的数量。

:::demo

checkbox/limitation

:::

## 按钮样式

按钮样式的多选组合。

只需要把 `el-checkbox` 元素替换为 `el-checkbox-button` 元素即可。此外，Element Plus 还提供了`size`属性。

:::demo

checkbox/button-style

:::

## 带有边框

设置`border`属性可以渲染为带有边框的多选框。

:::demo

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
