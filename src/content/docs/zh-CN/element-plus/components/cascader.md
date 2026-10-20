---
title: "Cascader 级联选择器"
description: "当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。"
group: 表单组件
order: 20
---

# Cascader 级联选择器

当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

## 基础用法

:::demo 为 `options` 属性传入选项数组即可渲染级联选择器。 `props.expandTrigger` 决定子选项的展开方式：默认为点击， 设为 `hover` 时悬停展开。

cascader/basic

:::

## 禁用选项

:::demo 在选项对象中设置 `disabled: true` 即可禁用该项。默认读取 `disabled` 字段；如需使用其他字段名，可通过 `props.disabled` 指定。同理，`value`、 `label`、`children` 字段名也可自定义。

cascader/option-disabling

:::

## 可清空

:::demo 设置 `clearable` 后，选中并悬停时会出现清空图标。

cascader/clearable

:::

## 自定义清空图标

:::demo 通过 `clearIcon` 属性可自定义清空图标。

cascader/clear-icon

:::

## 仅显示最后一级

:::demo `showAllLevels` 决定输入框是否显示完整路径； 设为 `false` 时只显示最后一级。

cascader/last-level

:::

## 多选

:::demo 将 `props.multiple` 设为 `true` 即可开启多选。 默认展示全部选中标签；`collapseTags` 可折叠标签， `maxCollapseTags` 控制折叠时显示的标签数（默认为 1）， `collapseTagsTooltip` 让鼠标悬停折叠文本时展示全部标签。

cascader/multiple-selection

:::

## 选择任意一级选项

:::demo 单选模式下只能选择叶子节点，多选模式下选中父节点会联动选中全部叶子节点。 设置 `props.checkStrictly = true` 可解除父子节点选中状态的关联， 从而选择任意一级选项。

cascader/any-level

:::

## 动态加载

:::demo 设置 `props.lazy = true` 启用动态加载，并通过 `props.lazyLoad` 指定加载数据的方法。其参数 `node` 为当前点击的节点，`resolve` 为加载完成的回调，必须调用。 可以在数据中增加 `leaf` 字段更准确地标识叶子节点， 否则将根据是否存在子节点推断。

cascader/dynamic-loading

:::

## 可搜索

:::demo 添加 `filterable` 即可开启搜索。级联选择器会匹配自身或父级标签 包含关键字的节点；也可以通过 `filterMethod` 自定义搜索逻辑， 第一个参数为节点，第二个参数为关键字，返回是否命中。

cascader/filterable

:::

## 自定义节点内容

:::demo 通过 `renderLabel` 自定义节点内容，回调参数 `node` 与 `data` 分别为当前节点对象与节点数据。

cascader/custom-content

:::

## 自定义搜索建议项

:::demo 通过 `renderSuggestionItem` 自定义搜索建议项，回调参数 `item` 为当前建议项节点。

cascader/custom-suggestion-item

:::

## 级联面板

:::demo `CascaderPanel` 是级联选择器的核心组件，支持单选、多选、 动态加载等能力。与 `ElCascader` 一样，通过 `options` 传入选项，通过 `props` 开启其他特性。

cascader/panel

:::

## 自定义标签

:::demo 通过 `renderTag` 自定义标签内容。使用自定义标签时， `collapseTags`、`collapseTagsTooltip`、 `maxCollapseTags` 不会生效。

cascader/custom-tag

:::

## 显示选中策略

:::demo 多选模式下，`showCheckedStrategy` 控制选中值的展示方式。 默认策略为 `child`，展示全部选中的子节点；`parent` 策略仅在全部子节点选中时展示父节点。

cascader/show-checked-strategy

:::

## 点击节点选中

:::demo 仅在启用 `multiple` 或 `checkStrictly` 时可用。 通过 `props.checkOnClickNode` 可以直接点击节点切换选中状态， 而不必点击前缀图标；`props.showPrefix` 控制前缀图标的显隐。 另外 `props.checkOnClickLeaf` 可限定只有叶子节点可点击选中， 该选项默认开启。

cascader/check-on-click-node

:::

## 自定义下拉头部与底部

:::demo 通过 `header` 与 `footer` 属性自定义下拉的顶部和底部内容。

cascader/custom-header-footer

:::

## 虚拟滚动

:::demo 处理大量数据时可开启虚拟滚动以提升性能。设置 `virtualScroll` 为 `true` 启用；可通过 `height` 与 `itemSize` 自定义菜单高度与节点高度， 默认分别为 204px 与 34px。

cascader/virtual-scroll

:::

## 自定义搜索建议宽度

搜索建议面板的宽度默认根据匹配项的最大宽度计算。如果通过 `renderSuggestionItem` 自定义了建议项内容，显示文本可能与 `label` 不一致，导致宽度计算偏差。此时可使用 `fitInputWidth` 固定宽度：设为 `true` 时与输入框等宽，设为数字时使用固定的像素宽度。

该属性只影响搜索时的建议面板宽度，不影响默认的级联面板。

:::demo

cascader/fit-input-width

:::

## Cascader API

### Cascader Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] / ^[number] / ^[array] | — |
| options | 选项数据，字段名可通过 props 自定义 | ^[array]`CascaderOption[]` | — |
| props | 配置项，见下方 CascaderProps 表 | ^[object]`CascaderProps` | — |
| size | 输入框尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| placeholder | 输入框占位文本 | ^[string] | — |
| disabled | 是否禁用 | ^[boolean] | — |
| clearable | 是否可清空 | ^[boolean] | — |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| show-all-levels | 输入框是否显示选中值的完整路径 | ^[boolean] | true |
| collapse-tags | 多选时是否折叠标签 | ^[boolean] | — |
| collapse-tags-tooltip | 折叠标签时，悬停是否显示全部标签（需开启 collapse-tags） | ^[boolean] | false |
| max-collapse-tags-tooltip-height | 折叠标签提示框的最大高度 | ^[string] / ^[number] | — |
| separator | 选项文案分隔符 | ^[string] | ' / ' |
| filterable | 是否可搜索 | ^[boolean] | — |
| filter-method | 自定义搜索逻辑，返回是否命中 | ^[Function]`(node: Node, keyword: string) => boolean` | — |
| debounce | 搜索防抖延迟（毫秒） | ^[number] | 300 |
| before-filter | 过滤前钩子，返回 false 或 reject 时中止过滤 | ^[Function]`(value: string) => boolean` | — |
| popper-class | 下拉与标签提示框的自定义类名 | ^[string] | '' |
| popper-style | 下拉与标签提示框的自定义样式 | ^[string] / ^[object] | — |
| teleported | 下拉是否挂载到 body | ^[boolean] | true |
| effect | 下拉主题 | ^[enum]`'dark' \| 'light'` | light |
| tag-type | 标签类型 | ^[enum]`'success' \| 'info' \| 'warning' \| 'danger'` | info |
| tag-effect | 标签主题 | ^[enum]`'light' \| 'dark' \| 'plain'` | light |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| max-collapse-tags | 折叠时最多显示的标签数（需开启 collapse-tags） | ^[number] | 1 |
| empty-values | 组件的空值配置 | ^[array] | — |
| value-on-clear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| persistent | 下拉不活跃时是否保留 DOM | ^[boolean] | true |
| fallback-placements | 下拉翻转时的兜底方位 | ^[array]`Placement[]` | — |
| placement | 下拉位置 | ^[enum]`Placement` | bottom-start |
| show-checked-strategy | 多选时标签显示的节点层级 | ^[enum]`'parent' \| 'child'` | child |
| virtual-scroll | 是否开启虚拟滚动 | ^[boolean] | false |
| fit-input-width | 搜索建议面板是否与输入框等宽；数字表示固定宽度 | ^[boolean] / ^[number] | false |
| item-size | 虚拟滚动时节点高度（px） | ^[number] | 34 |
| height | 虚拟滚动时菜单高度（px） | ^[number] | 204 |
| id | 输入框 id | ^[string] | — |
| className | 根节点类名 | ^[string] | — |
| style | 根节点样式 | ^[object]`CSSProperties` | — |

### Cascader Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化时触发 | ^[Function]`(value: CascaderValue) => void` |
| onExpandChange | 展开项变化时触发 | ^[Function]`(value: CascaderValue) => void` |
| onFocus | 获得焦点时触发 | ^[Function]`(event: FocusEvent) => void` |
| onBlur | 失去焦点时触发 | ^[Function]`(event: FocusEvent) => void` |
| onClear | 点击清空图标时触发 | ^[Function]`() => void` |
| onVisibleChange | 下拉显示状态变化时触发 | ^[Function]`(visible: boolean) => void` |
| onRemoveTag | 多选模式移除标签时触发 | ^[Function]`(value: CascaderNodeValue \| CascaderNodePathValue) => void` |

### Cascader Slots（React Render Props）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderLabel | 自定义节点内容，对应官方 default 插槽 | ^[Function]`({ node, data }) => ReactNode` |
| empty | 无匹配选项时的内容 | ^[ReactNode] |
| prefix | 输入框前缀内容 | ^[ReactNode] |
| renderSuggestionItem | 自定义搜索建议项，对应官方 suggestion-item 插槽 | ^[Function]`({ item: Node }) => ReactNode` |
| renderTag | 自定义标签样式，对应官方 tag 插槽 | ^[Function]`({ data: Tag[], deleteTag }) => ReactNode` |
| header | 下拉顶部内容 | ^[ReactNode] |
| footer | 下拉底部内容 | ^[ReactNode] |

### Cascader Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| getCheckedNodes | 获取当前选中的节点，leafOnly 表示是否只返回叶子节点 | ^[Function]`(leafOnly?: boolean) => Node[]` |
| panelRef | 级联面板实例 | ^[object]`CascaderPanelHandle` |
| togglePopperVisible | 切换下拉显隐 | ^[Function]`(visible?: boolean) => void` |
| contentRef | 下拉内容节点 | ^[object]`HTMLDivElement` |
| presentText | 当前显示的文本 | ^[string] |
| focus | 聚焦输入框 | ^[Function]`() => void` |
| blur | 输入框失焦 | ^[Function]`() => void` |

## CascaderPanel API

### CascaderPanel Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] / ^[number] / ^[array] | — |
| options | 选项数据 | ^[array]`CascaderOption[]` | — |
| props | 配置项，见下方 CascaderProps 表 | ^[object]`CascaderProps` | — |
| virtual-scroll | 是否开启虚拟滚动 | ^[boolean] | false |
| item-size | 虚拟滚动时节点高度（px） | ^[number] | 34 |
| height | 虚拟滚动时菜单高度（px） | ^[number] | 204 |

### CascaderPanel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化时触发 | ^[Function]`(value: CascaderValue \| undefined) => void` |
| onExpandChange | 展开项变化时触发 | ^[Function]`(value: CascaderNodePathValue) => void` |
| onClose | 关闭面板时触发，供 Cascader 收起下拉 | ^[Function]`() => void` |
| onCheckedNodesChange | 选中节点快照变化时触发 | ^[Function]`(checkedNodes: Node[], allCheckedNodes: Node[]) => void` |

### CascaderPanel Slots（React Render Props）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderLabel | 自定义节点内容，对应官方 default 插槽 | ^[Function]`({ node, data }) => ReactNode` |
| empty | 无数据时的内容 | ^[ReactNode] |

### CascaderPanel Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| getCheckedNodes | 获取当前选中的节点，leafOnly 表示是否只返回叶子节点 | ^[Function]`(leafOnly?: boolean) => Node[]` |
| clearCheckedNodes | 清空选中节点 | ^[Function]`() => void` |

## CascaderProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| expandTrigger | 展开子选项的触发方式 | ^[enum]`'click' \| 'hover'` | click |
| multiple | 是否开启多选 | ^[boolean] | false |
| checkStrictly | 选中状态是否不与父子节点关联 | ^[boolean] | false |
| emitPath | 选中变化时是否返回节点路径数组；为 false 时只返回值 | ^[boolean] | true |
| lazy | 是否动态加载子节点，需配合 lazyLoad | ^[boolean] | false |
| lazyLoad | 加载子节点数据的方法，仅在 lazy 为 true 时生效 | ^[Function]`(node: Node, resolve: Resolve, reject: () => void) => void` | — |
| value | 指定节点对象中作为值的字段名 | ^[string] | value |
| label | 指定节点对象中作为标签的字段名 | ^[string] | label |
| children | 指定节点对象中作为子节点的字段名 | ^[string] | children |
| disabled | 指定节点对象中作为禁用状态的字段名或判断函数 | ^[string] / ^[Function] | disabled |
| leaf | 指定节点对象中作为叶子标识的字段名或判断函数 | ^[string] / ^[Function] | leaf |
| hoverThreshold | 悬停展开的阈值（毫秒） | ^[number] | 500 |
| checkOnClickNode | 点击节点时是否切换选中状态 | ^[boolean] | false |
| checkOnClickLeaf | 点击叶子节点时是否切换选中状态 | ^[boolean] | true |
| showPrefix | 是否显示单选按钮或复选框前缀 | ^[boolean] | true |

## Type Declarations

```ts
type CascaderNodeValue = string | number
type CascaderNodePathValue = CascaderNodeValue[]
type CascaderValue =
  | CascaderNodeValue
  | CascaderNodePathValue
  | (CascaderNodeValue | CascaderNodePathValue)[]

type ExpandTrigger = 'click' | 'hover'
type Resolve = (data: CascaderOption[]) => void
type LazyLoad = (node: Node, resolve: Resolve, reject: () => void) => void
type IsDisabled = (data: CascaderOption, node: Node) => boolean
type IsLeaf = (data: CascaderOption, node: Node) => boolean

interface CascaderOption extends Record<string, unknown> {
  label?: string
  value?: CascaderNodeValue
  children?: CascaderOption[]
  disabled?: boolean
  leaf?: boolean
}

interface CascaderProps {
  expandTrigger?: ExpandTrigger
  multiple?: boolean
  checkStrictly?: boolean
  emitPath?: boolean
  lazy?: boolean
  lazyLoad?: LazyLoad
  value?: string
  label?: string
  children?: string
  disabled?: string | IsDisabled
  leaf?: string | IsLeaf
  hoverThreshold?: number
  checkOnClickNode?: boolean
  checkOnClickLeaf?: boolean
  showPrefix?: boolean
}
```
