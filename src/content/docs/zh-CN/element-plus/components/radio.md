---
title: "Radio 单选框"
description: "在一组备选项中进行单选。"
group: 表单组件
order: 150
---

# Radio 单选框

在一组备选项中进行单选

:::warning

`label` 作为 `value` 来使用已经被 **废弃**, 建议`label` 只用来表示展示的文字，这个被废弃的用法**将会在** ^(3.0.0) 版本被移除，请考虑使用新 API 替换.

:::

:::tip

新的 API `value` 已在 ^(2.6.0) 版本添加，文档中的示例都将使用 `value`。如果您使用的版本 **低于** ^(2.6.0)，请参考：

:::

## 基础用法

单选框不应该有太多的可选项，如果你有很多的可选项你应该使用选择框而不是单选框。

要使用 Radio 组件，只需要设置`v-model`绑定变量，选中意味着变量的值为相应 Radio `value`属性的值， `value`可以是`String`、`Number` 或 `Boolean`。

:::demo

radio/basic-usage

:::

## 禁用状态

`disabled` 属性可以用来控制单选框的禁用状态。

你只需要为单选框设置 `disabled` 属性就能控制其禁用状态。

:::demo

radio/disabled

:::

## 单选框组

适用于在多个互斥的选项中选择的场景

结合`el-radio-group`元素和子元素`el-radio`可以实现单选组，为 `el-radio-group` 绑定 `v-model`，再为 每一个 `el-radio` 设置好 `label` 属性即可，另外，还可以通过 `change` 事件来响应变化，它会传入一个参数 `value` 来表示改变之后的值。

:::demo

radio/radio-group

:::

## 带有边框

设置 `border` 属性为 true 可以渲染为带有边框的单选框。

:::demo

radio/with-borders

:::

## Options 属性 ^(2.11.2)

基础用法 `el-radio-group` 的快捷示例。您可以通过 `props` 属性自定义 `options` 的别名。

:::demo

radio/options

:::

## 单选按钮

带有按钮组视觉效果的单选框

:::demo 只需要把 `el-radio` 元素换成 `el-radio-button` 元素即可， :::demo 您可以使用 `填充` 和 `文本颜色` 设置按钮的样式。

radio/radio-button

:::

## 尺寸

通过 `size` 属性控制尺寸。

:::demo

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
