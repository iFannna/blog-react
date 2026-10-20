---
title: "ColorPicker 颜色选择器"
description: "用于选择颜色的颜色选择器，支持多种颜色格式。"
group: 表单组件
order: 50
---

# ColorPicker 颜色选择器

用于选择颜色的颜色选择器，支持多种颜色格式。

## 基础用法

:::demo 颜色选择器需要一个字符串类型的绑定值。

color-picker/basic

:::

## 透明度

:::demo 颜色选择器支持选择 alpha 通道。添加 `showAlpha` 属性即可启用透明度选择。

color-picker/alpha

:::

## 预定义颜色

:::demo 通过 `predefine` 属性可以配置预定义颜色。

color-picker/predefined-color

:::

## 不同尺寸

:::demo 通过 `size` 属性设置颜色选择器的尺寸。

color-picker/sizes

:::

## ColorPicker API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| showAlpha | 是否显示透明度滑块 | ^[boolean] | false |
| colorFormat | 绑定值的颜色格式 | ^[enum]`'rgb' \| 'prgb' \| 'hex' \| 'hex3' \| 'hex4' \| 'hex6' \| 'hex8' \| 'name' \| 'hsl' \| 'hsv'` | showAlpha 为 false 时 'hex'，为 true 时 'rgb' |
| popperClass | 下拉面板自定义类名 | ^[string] | '' |
| popperStyle | 下拉面板自定义样式 | ^[object]`CSSProperties` | — |
| predefine | 预定义颜色 | ^[array]`string[]` | — |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| tabindex | 触发器的 tabindex | ^[string] / ^[number] | 0 |
| ariaLabel | 颜色选择器的 aria-label | ^[string] | — |
| emptyValues | 组件的空值配置 | ^[array] | — |
| valueOnClear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| id | 组件 id | ^[string] | — |
| teleported | 面板是否挂载到 body | ^[boolean] | true |
| persistent | 面板不活跃时是否保留 DOM | ^[boolean] | true |
| appendTo | 面板挂载的目标选择器或元素 | ^[string] / ^[HTMLElement] | — |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 确认选择时触发 | ^[Function]`(value: string \| null) => void` |
| onActiveChange | 当前活跃颜色变化时触发 | ^[Function]`(value: string \| null) => void` |
| onFocus | 组件获得焦点时触发 | ^[Function]`(event: FocusEvent) => void` |
| onBlur | 组件失去焦点时触发 | ^[Function]`(event: FocusEvent) => void` |
| onClear | 点击清空按钮时触发 | ^[Function]`() => void` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| color | 当前颜色对象 | ^[object]`Color` |
| show | 手动打开颜色选择器 | ^[Function]`() => void` |
| hide | 手动关闭颜色选择器 | ^[Function]`() => void` |
| focus | 聚焦触发器 | ^[Function]`() => void` |
| blur | 触发器失焦 | ^[Function]`() => void` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | 受控用法 |
| `@change` / `@active-change` | `onChange` / `onActiveChange` | 事件改为 on 前缀 |
| `ref` + defineExpose | `ref` + `ColorPickerExpose` | 方法名保持一致 |
| footer 插槽 | 无 | ColorPicker 内部已固定清空与确认按钮 |
