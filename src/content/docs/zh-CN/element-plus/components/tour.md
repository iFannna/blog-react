---
title: "Tour 漫游式引导"
description: "用于分步引导用户了解产品功能的漫游式引导组件。"
group: 数据展示
order: 190
---

# Tour 漫游式引导

用于分步引导用户了解产品功能的气泡组件。用来引导用户并介绍产品

## 基础用法

最简单的用法。

:::demo

tour/basic

:::

## 非模态

使用`:mask="false"`可以将引导变为非模态，同时为了强调引导本身，建议与 type="primary" 组合使用。

:::demo

tour/non-modal

:::

## 位置

改变引导相对于目标的位置，共有 12 种位置可供选择。当 `target` 为空时引导将会展示在正中央。

:::demo

tour/placement

:::

## 自定义遮罩样式

自定义遮罩样式。

:::demo

tour/mask

:::

## 自定义指示器

自定义指示器。

:::demo

tour/indicator

:::

## 目标

可以传入目标的各种类型的参数。自^(2.5.2)以来支持字符串和函数类型。

:::demo

tour/target

:::

## Tour API

### Tour Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示导览，对应官方 v-model | ^[boolean] | false |
| current | 当前处于第几步 | ^[number] | 0 |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| show-close | 是否显示关闭按钮 | ^[boolean] | true |
| close-icon | 自定义关闭图标 | ^[ReactNode] | 默认 Close |
| placement | 相对目标元素的方位 | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom |
| content-style | 内容自定义样式 | ^[CSSProperties] | — |
| mask | 是否启用遮罩，或自定义样式与填充色 | ^[boolean] / ^[object]`{ style?: CSSProperties; color?: string }` | true |
| gap | 遮罩与目标之间的透明间隙 | ^[object]`TourGap` | { offset: 6, radius: 2 } |
| type | 类型，影响背景色与文字色 | ^[enum]`'default' \| 'primary'` | default |
| scroll-into-view-options | 自定义滚动参数 | ^[boolean] / ^[ScrollIntoViewOptions] | { block: 'center' } |
| z-index | 层级 | ^[number] | 自动递增 |
| append-to | 挂载的容器 | ^[string] / ^[HTMLElement] | body |
| close-on-press-escape | 是否允许按 ESC 关闭 | ^[boolean] | true |
| target-area-clickable | 挖孔区域是否可点击 | ^[boolean] | true |
| indicators | 自定义指示器 | ^[Function]`({ current, total }) => ReactNode` | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### TourGap

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offset | 间隙大小，元组时依次为水平 / 垂直 | ^[number] / ^[array]`[number, number]` | 6 |
| radius | 挖孔圆角 | ^[number] | 2 |

### Tour Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐变化 | ^[Function]`(visible: boolean) => void` |
| onCurrentChange | 当前步骤变化 | ^[Function]`(current: number) => void` |
| onChange | 步骤变化后的回调 | ^[Function]`(current: number) => void` |
| onClose | 关闭时触发 | ^[Function]`(current: number) => void` |
| onFinish | 结束导览时触发 | ^[Function]`() => void` |

### TourStep Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 指向的目标元素，支持选择器 / 元素 / 取元素的函数；为空时居中显示 | ^[string] / ^[HTMLElement] / ^[Function]`() => HTMLElement \| null` | — |
| show-arrow | 是否显示箭头，缺省跟随 Tour | ^[boolean] | — |
| title | 标题 | ^[string] | — |
| description | 描述 | ^[string] | — |
| header | 自定义头部内容，对应官方 header 插槽 | ^[ReactNode] | — |
| children | 自定义描述内容，对应官方默认插槽 | ^[ReactNode] | — |
| placement | 相对目标元素的方位，缺省跟随 Tour | ^[enum] 同 Tour | bottom |
| content-style | 内容自定义样式，缺省跟随 Tour | ^[CSSProperties] | — |
| mask | 是否启用遮罩，缺省跟随 Tour | ^[boolean] / ^[object] | — |
| type | 类型，缺省跟随 Tour | ^[enum]`'default' \| 'primary'` | default |
| next-button-props | 下一步按钮属性 | ^[object]`TourBtnProps` | — |
| prev-button-props | 上一步按钮属性 | ^[object]`TourBtnProps` | — |
| scroll-into-view-options | 自定义滚动参数，缺省跟随 Tour | ^[boolean] / ^[ScrollIntoViewOptions] | — |
| show-close | 是否显示关闭按钮，缺省跟随 Tour | ^[boolean] | — |
| close-icon | 自定义关闭图标，缺省跟随 Tour | ^[ReactNode] | — |
| onClose | 该步骤关闭时触发 | ^[Function]`() => void` | — |

### TourStep 插槽（以 props 形式提供）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| header | 自定义头部内容 | ^[ReactNode] |
| children | 自定义描述内容 | ^[ReactNode] |

### TourBtnProps

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 按钮文案 | ^[ReactNode] | — |
| onClick | 追加在官方默认行为之后的点击回调 | ^[Function]`() => void` | — |
| 其余字段 | 透传给 ElButton 的属性（type / disabled / class 等） | ^[ButtonProps] | — |
