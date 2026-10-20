---
title: "ColorPickerPanel 颜色选择面板"
description: "`ColorPickerPanel` 是颜色选择器的核心组件。"
group: 表单组件
order: 40
---

# ColorPickerPanel 颜色选择器面板 ^(beta)

`ColorPickerPanel`是`ColorPicker`的核心组件。

## 基础用法

ColorPickerPanel 需要一个字符串类型的变量才能绑定到 v-model。

:::demo

color-picker-panel/basic

:::

## 选择透明度

ColorPickerPanel 支持Alpha 通道选择。要激活 Alpha 选择，只需添加 "show-alpha" 属性。

:::demo

color-picker-panel/alpha

:::

## 预定义颜色

颜色选择板支持预定义的颜色选项

:::demo

color-picker-panel/predefined-color

:::

## Border 边框

默认情况下，边框是默认的，如果你不想要边框请参考示例。

:::demo

color-picker-panel/border

:::

## 禁用

"禁用"属性决定颜色选择器是否完全禁用。

:::demo

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
