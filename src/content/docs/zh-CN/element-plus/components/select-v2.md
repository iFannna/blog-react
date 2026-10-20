---
title: "Select V2 虚拟化选择器"
description: "`Select V2` 使用虚拟列表渲染选项，适用于十万级数据量的下拉选择。 组件对外的 props、事件与插槽与官方保持一致。"
group: 表单组件
order: 180
---

# Virtualized Select 虚拟化选择器

:::tip

这个组件目前在测试当中，如果在使用中发现任何漏洞和问题，请在 [GitHub](https://github.com/element-plus/element-plus/issues) 中提交 issue 以便我们进行处理。

:::

## 背景

在某些使用情况下，单个选择器可能最终加载数万行数据。将这么多的数据渲染至 DOM 中可能会给浏览器带来负担，从而造成性能问题。为了更好的用户和开发者体验，我们决定添加此组件。

## 基础用法

适用广泛的基础选择器

:::demo

select-v2/basic-usage

:::

## 多选

最基础的多选选择器

:::demo

select-v2/multiple

:::

## 尺寸

使用 `size` 属性改变选择器大小。除了默认大小外，还有另外两个选项： `large`, `small`。

:::demo

select-v2/size

:::

## 隐藏多余标签的多选

默认情况下选中值会以 Tag 的形式展现，你也可以设置`collapse-tags`属性将它们合并为一段文字。您可以使用 `collapse-tags-tooltip` 属性来启用鼠标悬停折叠文字以显示具体所选值的行为。

:::demo

select-v2/hide-extra-tags

:::

## 可过滤的多选

当选项太多时，你可以使用 `filterable` 选项来启用过滤功能来找到所需的选项。

:::demo

select-v2/filterable

:::

## 禁用选择器本身或选项

您可以选择禁用 Select 或者 Select 中的某个选项。

:::demo

select-v2/disabled

:::

## 给选项进行分组

只要数据格式满足特定要求，我们就可以按照自己的意愿为选项进行分组。

:::demo

select-v2/grouping

:::

## 一键清除

我们可以同时清除所有选定的选项。此设定也适用于单选。

:::demo

select-v2/clearable

:::

## 自定义选项的渲染模板

我们也可以通过自定义模板来渲染自己想要的选项内容。

:::demo

select-v2/customized-option

:::

## 自定义下拉菜单的头部 ^(2.5.2)

您可以自定义下拉菜单的头部。

使用slot 自定义内容

:::demo

select-v2/custom-header

:::

## 自定义下拉菜单的底部 ^(2.5.2)

您可以自定义下拉菜单的底部。

使用slot 自定义内容

:::demo

select-v2/custom-footer

:::

## 创建临时选项

创建并选中未包含在初始选项中的条目。

通过使用 `allow-create` 属性，用户可以通过输入框创建新项目。为了使 `allow-create` 正常工作， `filterable` 的值必须为 `true`。本例还使用了 `default-first-option` 属性，在该属性为 `true` 的情况下，按下回车就可以选中当前选项列表中的第一个选项，无需使用鼠标或键盘方向键进行定位。

:::tip

最好在使用 `allow-create` 属性的同时设置 `:reserve-keyword="false"`。

:::

:::demo

select-v2/allow-create

:::

## 远程搜索

输入关键字以从远程服务器中查找数据。

从服务器搜索数据，输入关键字进行查找。为了启用远程搜索，需要将`filterable`和`remote`设置为`true`，同时传入一个`remote-method`。 `remote-method`为一个`Function`，它会在输入值发生变化时调用，参数为当前输入值。

:::demo

select-v2/remote-search

:::

## 使用 value-key 键属性

当 `options.value` 是一个对象时，您应该为它设置一个唯一的标识名称

:::tip

在 ^(2.4.0) 之前，`value-key`既用作所选对象的唯一值，也用作`options`中表示值的对应 key。现在 `value-key` 仅作为所选对象的唯一值使用，选项中值的 key 是 `props.value`.

:::

:::demo

select-v2/use-valueKey

:::

## 自定义选项 ^(2.4.2)

当您的 `options` 格式不同于默认格式 您可以通过 `props` 属性自定义 `options`

:::demo

select-v2/props

:::

## 自定义标签 ^(2.5.0)

您可以自定义标签。

将自定义的标签插入 `el-select` 的 slot 中即可。 `collapse-tags`, `collapse-tags-tooltip`, `max-collapse-tags` 在此模式下不生效.

:::demo

select-v2/custom-tag

:::

## 自定义加载 ^(2.5.2)

修改加载区域内容

:::demo

select-v2/custom-loading

:::

## 空值配置^(2.7.0)

若想配置如空字符串为有效值而不是空值，可以配置 `empty-values` 为 `[null, undefined]`.

如果您想要将清空值更改为 `null`, 请设置 `value-on-clear` 为 `null`

:::demo

select-v2/empty-values

:::

## 自定义标签 ^(2.7.4)

您可以自定义标签

:::demo

select-v2/custom-label

:::

## 自定义宽度 ^(2.9.2)

下拉框的宽度默认根据`label`的值计算。如果通过`default slot`自定义下拉框选项，选项中显示的文本可能与`label`的值不相等，从而导致计算错误。在这种情况下，可以通过设置`fit-input-width`属性为一个数字来固定其宽度。

:::demo

select-v2/custom-width

:::

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value / v-model | ^[string] / ^[number] / ^[boolean] / ^[object] / ^[array] | — |
| options | 选项数据，`value` / `label` 字段可通过 `props` 自定义 | ^[array] | — |
| props | 选项字段别名配置，见下表 | ^[object] | — |
| multiple | 是否多选 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| valueKey | 对象值作为唯一标识的字段名 | ^[string] | value |
| size | 组件尺寸 | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | '' |
| clearable | 是否可清空 | ^[boolean] | false |
| clearIcon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| collapseTags | 多选时是否将标签折叠为文本 | ^[boolean] | false |
| multipleLimit | 多选可选数量上限，0 表示不限 | ^[number] | 0 |
| id | 原生 input 的 id | ^[string] | — |
| name | 原生 input 的 name | ^[string] | — |
| effect | 浮层主题 | ^[enum]`'dark' \| 'light'` / ^[string] | light |
| autocomplete | 原生 input 的 autocomplete | ^[string] | off |
| placeholder | 占位文本 | ^[string] | Please select |
| filterable | 是否可过滤 | ^[boolean] | false |
| allowCreate | 是否允许创建新选项，需 `filterable` 为 true | ^[boolean] | false |
| filterMethod | 自定义过滤方法，参数为当前输入值 | ^[Function]`(query: string) => void` | — |
| loading | 是否正在从服务端加载数据 | ^[boolean] | false |
| loadingText | 加载中文案 | ^[string] | — |
| reserveKeyword | 选中过滤项后是否保留关键词 | ^[boolean] | true |
| defaultFirstOption | 回车时选中第一个匹配项，配合 `filterable` / `remote` | ^[boolean] | false |
| noMatchText | 无匹配项文案，也可用 `empty` 插槽 | ^[string] | — |
| noDataText | 无选项文案，也可用 `empty` 插槽 | ^[string] | No Data |
| popperClass | 下拉与标签浮层的自定义类名 | ^[string] / ^[object] | '' |
| popperStyle | 下拉与标签浮层的自定义样式 | ^[string] / ^[object]`CSSProperties` | — |
| teleported | 下拉是否 teleport | ^[boolean] | true |
| appendTo | 下拉挂载目标 | ^[CSSSelector] / ^[HTMLElement] | — |
| persistent | 不活跃时是否保留下拉 DOM | ^[boolean] | true |
| automaticDropdown | 非过滤模式下聚焦是否自动展开 | ^[boolean] | false |
| fitInputWidth | 下拉宽度是否与输入框一致；传数字时固定为该宽度 | ^[boolean] / ^[number] | true |
| suffixIcon | 自定义后缀图标 | ^[ReactNode] | ArrowDown |
| height | 下拉面板高度 | ^[number] | 274 |
| itemHeight | 每项高度 | ^[number] | 34 |
| estimatedOptionHeight | 动态行高估算值；传入后启用动态尺寸列表 | ^[number] | — |
| scrollbarAlwaysOn | 是否总是显示滚动条 | ^[boolean] | false |
| remote | 是否从服务端搜索数据 | ^[boolean] | false |
| debounce | 远程搜索防抖时长（毫秒） | ^[number] | 300 |
| remoteMethod | 输入值变化时调用，参数为当前输入值 | ^[Function]`(query: string) => void` | — |
| remoteShowSuffix | 远程搜索时是否显示后缀图标 | ^[boolean] | false |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| offset | 下拉与输入框的间距 | ^[number] | 12 |
| showArrow | 下拉是否显示箭头 | ^[boolean] | true |
| placement | 下拉位置 | ^[enum]`'top' \| 'top-start' \| ... \| 'right-end'` | bottom-start |
| fallbackPlacements | 下拉翻转兜底位置 | ^[array]`Placement[]` | ['bottom-start', 'top-start', 'right', 'left'] |
| collapseTagsTooltip | 悬停折叠文本时是否展示全部标签 | ^[boolean] | false |
| tagTooltip | 折叠标签浮层配置 | ^[object]`SelectV2TagTooltipProps` | {} |
| maxCollapseTags | 折叠时最多展示的标签数 | ^[number] | 1 |
| tagType | 标签类型 | ^[enum]`'' \| 'success' \| 'info' \| 'warning' \| 'danger'` | info |
| tagEffect | 标签主题 | ^[enum]`'' \| 'light' \| 'dark' \| 'plain'` | light |
| ariaLabel | 原生 input 的 aria-label | ^[string] | — |
| emptyValues | 空值集合 | ^[array] | — |
| valueOnClear | 清空时返回的值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| tabindex | 输入框的 tabindex | ^[string] / ^[number] | — |

### props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项对象中作为值的字段名 | ^[string] | value |
| label | 选项对象中作为文案的字段名 | ^[string] | label |
| options | 选项对象中作为子选项的字段名 | ^[string] | options |
| disabled | 选项对象中作为禁用态的字段名 | ^[string] | disabled |

### tag-tooltip

`tagTooltip` 中显式设置的字段优先，未设置的字段继承 Select 的 `effect`、`popperClass`、`popperStyle`、`teleported`、`appendTo` 等配置，最后回退到 Tooltip 的默认值。

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| appendTo | 浮层内容挂载目标 | ^[CSSSelector] / ^[HTMLElement] | — |
| placement | 浮层位置 | ^[enum]`Placement` | bottom |
| fallbackPlacements | 浮层翻转兜底位置 | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] |
| effect | 浮层主题 | ^[enum]`'dark' \| 'light'` / ^[string] | — |
| popperClass | 浮层自定义类名 | ^[string] | — |
| popperStyle | 浮层自定义样式 | ^[string] / ^[object]`CSSProperties` | — |
| teleported | 浮层是否 teleport | ^[boolean] | — |
| showAfter | 显示延时（毫秒） | ^[number] | — |
| hideAfter | 隐藏延时（毫秒） | ^[number] | — |
| autoClose | 自动关闭延时（毫秒） | ^[number] | — |
| offset | 浮层与触发元素的间距 | ^[number] | — |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 选中值变化时触发 | ^[Function]`(val: SelectV2Value) => void` |
| onVisibleChange | 下拉显示/隐藏时触发 | ^[Function]`(visible: boolean) => void` |
| onRemoveTag | 多选移除标签时触发，参数为被移除的值 | ^[Function]`(tagValue: unknown) => void` |
| onClear | 点击清空图标时触发 | ^[Function]`() => void` |
| onBlur | 输入框失焦时触发 | ^[Function]`(event: FocusEvent) => void` |
| onFocus | 输入框聚焦时触发 | ^[Function]`(event: FocusEvent) => void` |
| onEndReached | 下拉滚动到边界时触发 | ^[Function]`(direction: 'top' \| 'bottom' \| 'left' \| 'right') => void` |

### Slots（React props）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 选项渲染器，参数为 `{ item, index, disabled }` | ^[Function]`(params) => ReactNode` |
| header | 下拉顶部内容 | ^[ReactNode] |
| footer | 下拉底部内容 | ^[ReactNode] |
| empty | 选项为空时的内容 | ^[ReactNode] |
| loadingSlot | 加载中内容（对应官方 loading 插槽） | ^[ReactNode] |
| prefix | 输入框前缀内容 | ^[ReactNode] |
| tag | 自定义标签，参数为 `{ data, selectDisabled, deleteTag }` | ^[Function]`(params) => ReactNode` |
| label | 自定义选中值文案，参数为 `{ index, label, value }` | ^[Function]`(params) => ReactNode` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]`() => void` |
| blur | 输入框失焦并收起下拉 | ^[Function]`() => void` |
| scrollTo | 滚动到指定索引的选项 | ^[Function]`(index: number) => void` |
| selectedLabel | 当前选中项文案，多选返回数组 | ^[string] / ^[array]`string[]` |

## Type Declarations

```ts
type SelectV2Value =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null
  | undefined

interface SelectV2OptionProps {
  label?: string
  value?: string
  disabled?: string
  options?: string
}

interface SelectV2TagTooltipProps {
  appendTo?: string | HTMLElement
  placement?: Placement
  fallbackPlacements?: Placement[]
  effect?: 'dark' | 'light' | string
  popperClass?: string
  popperStyle?: CSSProperties
  teleported?: boolean
  showAfter?: number
  hideAfter?: number
  autoClose?: number
  offset?: number
}

interface SelectV2OptionRenderParams {
  item: SelectV2OptionType
  index: number
  disabled: boolean
}

interface SelectV2LabelRenderParams {
  index: number
  label: unknown
  value: unknown
}

interface SelectV2TagRenderParams {
  data: SelectV2Option[]
  selectDisabled: boolean
  deleteTag: (event: MouseEvent, option: SelectV2Option) => void
}
```
