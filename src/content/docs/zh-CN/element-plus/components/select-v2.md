---
title: "Select V2 虚拟化选择器"
description: "`Select V2` 使用虚拟列表渲染选项，适用于十万级数据量的下拉选择。 组件对外的 props、事件与插槽与官方保持一致。"
group: 表单组件
order: 180
---

# Select V2 虚拟化选择器

`Select V2` 使用虚拟列表渲染选项，适用于十万级数据量的下拉选择。 组件对外的 props、事件与插槽与官方保持一致。

## 基础用法

:::demo 使用虚拟列表渲染一千条选项。

select-v2/basic-usage

:::

## 多选

:::demo 设置 `multiple` 开启多选。

select-v2/multiple

:::

## 尺寸

:::demo 通过 `size` 切换大、默认、小三种尺寸。

select-v2/size

:::

## 隐藏多余标签

:::demo 多选选中项过多时，可通过 `collapseTags` 折叠标签； 配合 `collapseTagsTooltip` 悬停查看全部， `maxCollapseTags` 控制折叠前展示的数量。

select-v2/hide-extra-tags

:::

## 可过滤多选

:::demo 设置 `filterable` 后可以输入关键词过滤选项。

select-v2/filterable

:::

## 禁用选择器与选项

:::demo 设置 `disabled` 禁用选择器，或在选项上设置 `disabled`。

select-v2/disabled

:::

## 选项分组

:::demo 在选项对象上提供 `options` 字段即可渲染分组， 组内选项会展平到同一个虚拟列表中。

select-v2/grouping

:::

## 可清空

:::demo 设置 `clearable` 显示清空图标。

select-v2/clearable

:::

## 自定义选项渲染

:::demo 通过 `children` 渲染函数自定义每个选项的内容。

select-v2/customized-option

:::

## 下拉头部

:::demo 通过 `header` 在下拉顶部放置内容，例如全选复选框。

select-v2/custom-header

:::

## 下拉底部

:::demo 通过 `footer` 在下拉底部放置内容，例如新增选项。

select-v2/custom-footer

:::

## 创建选项

:::demo 设置 `allowCreate` 与 `filterable`  允许输入并创建新选项；`defaultFirstOption`  让回车选中第一个匹配项。

select-v2/allow-create

:::

## 远程搜索

:::demo 设置 `remote` 与 `remoteMethod`  从服务端获取选项；`remoteShowSuffix`  控制远程模式下是否显示后缀图标。

select-v2/remote-search

:::

## 使用 value-key

:::demo 值为对象时，通过 `valueKey`  指定唯一标识字段，组件按该字段比较选项。

select-v2/use-valueKey

:::

## 自定义选项别名

:::demo 通过 `props` 指定选项对象中 `label` 与  `value` 对应的字段。

select-v2/props

:::

## 自定义标签

:::demo 通过 `tag` 渲染函数完全替换标签内容，`children`  同时自定义选项。

select-v2/custom-tag

:::

## 自定义加载内容

:::demo 通过 `loadingSlot` 自定义加载中的内容。

select-v2/custom-loading

:::

## 空值

:::demo `emptyValues` 与 `valueOnClear`  控制空值判断和清空后的返回值。

select-v2/empty-values

:::

## 自定义文案

:::demo 通过 `label` 渲染函数自定义选中值的展示文案。

select-v2/custom-label

:::

## 自定义宽度

:::demo `fitInputWidth` 为 `false`  时下拉按内容宽度展开；传数字时固定为该宽度。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | 受控用法，多选时值必须是数组 |
| `@change` / `@visible-change` | `onChange` / `onVisibleChange` | 事件改为 on 前缀 |
| 默认插槽 | `children` 渲染函数 | 参数为 `{ item, index, disabled }` |
| `header` / `footer` / `empty` / `loading` / `prefix` 插槽 | `header` / `footer` / `empty` / `loadingSlot` / `prefix` props | ReactNode |
| `tag` / `label` 作用域插槽 | `tag` / `label` 渲染函数 | 参数与官方一致 |
| `suffix-icon` / `clear-icon` 组件类型 | `ReactNode` | 例如 `suffixIcon={<Search />}` |
| `ref` + defineExpose | `ref` + `SelectV2Expose` | 方法名保持一致 |
| `popper-append-to-body` | 不支持 | 使用 `teleported` + `appendTo` |
| `popper-options` | 不支持 | Popper 配置未透传 |
