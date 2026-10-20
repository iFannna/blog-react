---
title: "Cascader 级联选择器"
description: "当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。"
group: 表单组件
order: 20
---

# Cascader 级联选择器

当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

## 基础用法

有两种触发子菜单的方式

只需为 Cascader 的`options`属性指定选项数组即可渲染出一个级联选择器。通过 `props.expandTrigger` 属性控制子节点的展开方式

:::demo

cascader/basic

:::

## 有禁用选项

通过在数据源中设置 `disabled` 字段来声明该选项是禁用的

本例中，`options`指定的数组中的第一个元素含有`disabled: true`键值对，因此是禁用的。在默认情况下，Cascader 会检查数据中每一项的`disabled`字段是否为`true`，如果你的数据中表示禁用含义的字段名不为`disabled`，可以通过`props.disabled`属性来指定（详见下方 API 表格）。当然，`value`、`label`和`children`这三个字段名也可以通过同样的方式指定。

:::demo

cascader/option-disabling

:::

## 可清空

通过 `clearable` 设置输入框可清空

:::demo

cascader/clearable

:::

## 自定义清除图标^(2.11.0)

你可以通过`clear-icon`属性自定义清除图标

:::demo

cascader/clear-icon

:::

## 仅显示最后一级

可以仅在输入框中显示选中项最后一级的标签，而不是选中项所在的完整路径。

属性`show-all-levels`定义了是否显示完整的路径，将其赋值为 `false` 则仅显示最后一级。

:::demo

cascader/last-level

:::

## 多选

在标签中添加 `:props="props"` 并设置 `props = { multiple: true }` 来开启多选模式。

使用多选时，所有选中的标签将默认显示。您可以设置 `collapse = true` 将选中的标签折叠。您可以设置 `max-collapse-tags` 来显示最大tag数量，默认1。您可以使用 `collapse-tags-tooltip` 属性来启用鼠标悬停折叠文字以显示具体所选值的行为。

:::demo

cascader/multiple-selection

:::

## 选择任意一级选项

在单选模式下，你只能选择叶子节点；而在多选模式下，勾选父节点真正选中的都是叶子节点。启用该功能后，可让父子节点取消关联，选择任意一级选项。

可通过 `props.checkStrictly = true` 来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。

:::demo

cascader/any-level

:::

## 动态加载

当选中某一级时，动态加载该级下的选项。

通过`lazy`开启动态加载，并通过`lazyload`来设置加载数据源的方法。 `lazyload`方法有两个参数，第一个参数`node`为当前点击的节点，第二个`resolve`为数据加载完成的回调(必须调用)。为了更准确的显示节点的状态，还可以对节点数据添加是否为叶子节点的标志位 (默认字段为`leaf`，可通过`props.leaf`修改)。否则，将以有无子节点来判断其是否为叶子节点。

:::demo

cascader/dynamic-loading

:::

## 可搜索

可以快捷地搜索选项并选择。

通过添加`filterable`来启用过滤。 Cascader 会匹配所有节点的标签和它们的亲节点的标签，是否包含有输入的关键字。你也可以用`filter-method`自定义搜索逻辑，接受一个函数，第一个参数是节点`node`，第二个参数是搜索关键词`keyword`，通过返回布尔值表示是否命中。

:::demo

cascader/filterable

:::

## 自定义节点内容

可以自定义备选项的节点内容

你可以通过 `scoped slot` 自定义节点的内容。您可以访问 scope 中的 `node` 和 `data` 属性，分别表示当前节点的 Node 对象和当前节点的数据。

:::demo

cascader/custom-content

:::

## 自定义建议项^(2.9.5)

你可以通过 `suggestion-item` 插槽自定义建议项。你可以在作用域中访问 `item`，它代表建议项。

:::demo

cascader/custom-suggestion-item

:::

## 级联面板

级联面板是级联选择器的核心组件，与级联选择器一样，有单选、多选、动态加载等多种功能。

和级联选择器一样，通过 `options` 来指定选项，也可通过 `props` 来设置多选、动态加载等功能，具体详情见下方API表格。

:::demo

cascader/panel

:::

## 自定义标签 ^(2.10.3)

您可以自定义标签。

将自定义的标签插入 `el-cascader` 的 slot 中即可。 `collapse-tags`, `collapse-tags-tooltip`, `max-collapse-tags` 在此模式下不生效.

:::demo

cascader/custom-tag

:::

## 已勾选项显示策略 ^(2.10.5)

控制在多选模式下已选值的显示方式。

在多选模式下，你可以使用 `show-checked-strategy` 来控制已选值的显示方式。默认策略为 `child`，即显示所有已选中的子节点。 `parent` 策略仅在其所有子节点都被选中时显示父节点。

:::demo

cascader/show-checked-strategy

:::

## 点击选中节点 ^(2.10.5)

只使用 `multiple` 或 `checkStrictly` 属性。

你可以添加 `checkOnClickNode`，使节点本身也能被点击（不仅限于前缀图标）。 通过 `showPrefix` 来切换前缀的显示与隐藏。

:::tip

添加 `checkOnClickLeaf` 属性可以仅勾选叶子节点（最末级子节点），该功能默认启用。

:::

:::demo

cascader/check-on-click-node

:::

## 自定义头部与底部 ^(2.10.5)

你可以通过插槽来自定义下拉菜单的头部和底部。

使用插槽自定义内容。

:::demo

cascader/custom-header-footer

:::

## 虚拟滚动 ^(2.14.0)

当处理大量数据时，您可以启用虚拟滚动以提高性能。

将 `virtual-scroll` 设置为 `true` 以启用虚拟滚动。 您还可以使用 `height` 自定义菜单高度，并使用 `item-size` 自定义节点高度。 默认高度为 204px，默认节点大小为 34px。

:::demo

cascader/virtual-scroll

:::

## 自定义建议面板宽度 ^(2.14.0)

建议面板（筛选时）的宽度默认会根据匹配到的选项中的最大宽度自动计算。 如果您通过 `suggestion-item` 插槽自定义建议选项，选项中显示的文本很可能不等于 `label` 的值，从而导致计算错误。 在这种情况下，您可以使用 `fit-input-width` 属性来固定其宽度。 当值为 `number` 时，宽度为固定的具体像素值。

:::tip

`fit-input-width` 属性仅控制搜索时建议面板的宽度，不影响默认的级联面板。

:::

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
