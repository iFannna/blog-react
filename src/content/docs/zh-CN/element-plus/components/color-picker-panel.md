---
title: "ColorPickerPanel 颜色选择面板"
description: "`ColorPickerPanel` 是颜色选择器的核心组件。"
group: 表单组件
order: 40
---

# ColorPickerPanel 颜色选择面板

`ColorPickerPanel` 是颜色选择器的核心组件。

## 基础用法

:::demo 颜色选择面板需要一个字符串类型的绑定值。

color-picker-panel/basic

:::

## 透明度

:::demo 添加 `showAlpha` 属性即可启用透明度选择。

color-picker-panel/alpha

:::

## 预定义颜色

:::demo 通过 `predefine` 属性可以配置预定义颜色。

color-picker-panel/predefined-color

:::

## 边框

:::demo 默认情况下颜色选择面板带有边框，某些场景下可以设置 `border` 为 `false` 去掉边框。

color-picker-panel/border

:::

## 禁用状态

:::demo `disabled` 属性决定颜色选择面板是否完全禁用。

color-picker-panel/disabled

:::

## ColorPickerPanel API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] | — |
| border | 是否显示边框 | ^[boolean] | true |
| disabled | 是否禁用 | ^[boolean] | false |
| showAlpha | 是否显示透明度滑块 | ^[boolean] | false |
| colorFormat | 绑定值的颜色格式 | ^[enum]`'rgb' \| 'prgb' \| 'hex' \| 'hex3' \| 'hex4' \| 'hex6' \| 'hex8' \| 'name' \| 'hsl' \| 'hsv'` | showAlpha 为 false 时 'hex'，为 true 时 'rgb' |
| predefine | 预定义颜色 | ^[array]`string[]` | — |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| hueSliderClass | 透传给色相滑块的类名 | ^[string] | — |
| hueSliderStyle | 透传给色相滑块的样式 | ^[object]`CSSProperties` | — |
| className | 根节点类名 | ^[string] | — |
| style | 根节点样式 | ^[object]`CSSProperties` | — |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化时触发 | ^[Function]`(value: string \| null) => void` |

### Slots（React Render Props / ReactNode）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| footer | 底部输入框之后的内容 | ^[ReactNode] |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| color | 当前颜色对象 | ^[object]`Color` |
| inputRef | 底部输入框的原生 input | ^[object]`HTMLInputElement` |
| update | 手动刷新子组件 | ^[Function]`() => void` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | 受控用法 |
| `hue-slider-class` 支持数组/对象 | 接受字符串类名 | 与项目内其他组件一致 |
| footer 插槽 | `footer` ReactNode | — |
