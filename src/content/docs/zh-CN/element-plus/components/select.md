---
title: "Select 选择器"
description: "当选项过多时，使用下拉菜单展示并选择内容。"
group: 表单组件
order: 170
---

# Select 选择器

当选项过多时，使用下拉菜单展示并选择内容。

:::tip

在版本 `2.5.0`之后， `el-select` 的默认宽度更改为 `100%` 当使用内联形式时，宽度将显示异常。为了保持显示正常, 您需要手动配置 `el-select` 的宽度 (如: [例子](https://github.com/element-plus/element-plus/issues/15834#issuecomment-1936919229)).

:::

## 基础用法

适用广泛的基础单选 `v-model` 的值为当前被选中的 `el-option` 的 value 属性值

:::demo

select/basic-usage

:::

## Options 属性 ^(2.10.5)

`el-option` 基本用法。您可以通过 `props` 属性自定义 `options` 的别名。

:::demo

select/options

:::

## 有禁用选项

在 `el-option` 中，设定 `disabled` 值为 true，即可禁用该选项

:::demo

select/disabled-option

:::

## 禁用状态

禁用整个选择器组件

为 `el-select` 设置 `disabled`属性，则整个选择器不可用。

:::demo

select/disabled

:::

## 可清空

您可以使用清除图标来清除选择。

为 `el-select` 设置 `clearable` 属性，则可将选择器清空。

:::demo

select/clearable

:::

## 尺寸

使用 `size` 属性改变选择器大小。除了默认大小外，还有另外两个选项： `large`, `small`。

:::demo

select/size

:::

## 基础多选

多选选择器使用 tag 组件来展示已选中的选项。

为 `el-select` 设置 `multiple` 属性即可启用多选，此时 `v-model` 的值为当前选中值所组成的数组。默认情况下选中值会以 Tag 组件的形式展现，你也可以设置 `collapse-tags` 属性将它们合并为一段文字。您可以使用 `collapse-tags-tooltip` 属性来启用鼠标悬停折叠文字以显示具体所选值的行为。

:::demo

select/multiple

:::

## 自定义模板

你可以自定义如何来渲染每一个选项。

将自定义的 HTML 模板插入 `el-option` 的 slot 中即可。

:::demo

select/custom-template

:::

## 自定义下拉菜单的头部 ^(2.4.3)

您可以自定义下拉菜单的头部。

Use slot to customize the content.

:::demo

select/custom-header

:::

## 自定义下拉菜单的底部 ^(2.4.3)

您可以自定义下拉菜单的底部。

使用slot 自定义内容

:::demo

select/custom-footer

:::

## 将选项进行分组

你可以为选项进行分组来区分不同的选项

使用 `el-option-group` 对备选项进行分组，它的 `label` 属性为分组名

:::demo

select/grouping

:::

## 筛选选项

可以利用筛选功能快速查找选项。

为`el-select`添加`filterable`属性即可启用搜索功能。默认情况下，Select 会找出所有 `label` 属性包含输入值的选项。如果希望使用其他的搜索逻辑，可以通过传入一个 `filter-method` 来实现。 `filter-method` 为一个 `Function`，它会在输入值发生变化时调用，参数为当前输入值。

:::demo

select/filterable

:::

## 远程搜索

输入关键字以从远程服务器中查找数据。

从服务器搜索数据，输入关键字进行查找。为了启用远程搜索，需要将`filterable`和`remote`设置为`true`，同时传入一个`remote-method`。 `remote-method`为一个`Function`，它会在输入值发生变化时调用，参数为当前输入值。需要注意的是，如果 `el-option` 是通过 `v-for` 指令渲染出来的，此时需要为 `el-option` 添加 `key` 属性，且其值需具有唯一性，比如这个例子中的 `item.value`。

:::demo

select/remote-search

:::

## 创建新的选项

创建并选中未包含在初始选项中的条目。

通过使用 `allow-create` 属性，用户可以通过输入框创建新项目。为了使 `allow-create` 正常工作， `filterable` 的值必须为 `true`。本例还使用了 `default-first-option` 属性，在该属性为 `true` 的情况下，按下回车就可以选中当前选项列表中的第一个选项，无需使用鼠标或键盘方向键进行定位。

:::demo

select/allow-create

:::

## 使用值键 value-key 属性

如果 Select 的绑定值为对象类型，请务必指定 `value-key` 作为它的唯一性标识。

通过使用 `value-key` 属性，可以正确处理带有重复label的数据。这样虽然`label` 是重复的，但任可通过 `id` 来确认唯一性。

:::demo

select/value-key

:::

## 自定义标签 ^(2.5.0)

您可以自定义标签。

将自定义的标签插入 `el-select` 的 slot 中即可。 `collapse-tags`, `collapse-tags-tooltip`, `max-collapse-tags` 在此模式下不生效.

:::demo

select/custom-tag

:::

## 自定义加载 ^(2.5.2)

修改加载区域内容

:::demo

select/custom-loading

:::

## 空值配置^(2.7.0)

若想配置如空字符串为有效值而不是空值，可以配置 `empty-values` 为 `[null, undefined]`.

如果您想要将清空值更改为 `null`, 请设置 `value-on-clear` 为 `null`

:::demo

select/empty-values

:::

## 自定义标签 ^(2.7.4)

您可以自定义标签

:::demo

select/custom-label

:::

## Select API

### Select Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中项的值，多选时为数组 | ^[string] / ^[number] / ^[boolean] / ^[object] / ^[array] | — |
| options | 选项数据，分组项通过 `options` 子数组嵌套 | ^[array]`SelectOptionType[]` | [] |
| props | 选项字段别名 | ^[object]`SelectOptionProps` | — |
| value-key | 选中值对象作为唯一标识的字段名 | ^[string] | value |
| multiple | 是否多选 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| clearable | 是否可清空 | ^[boolean] | false |
| clear-icon | 自定义清空图标 | ^[ReactNode] | — |
| filterable | 是否可搜索 | ^[boolean] | false |
| filter-method | 自定义过滤方法 | ^[Function]`(query: string) => void` | — |
| remote | 是否远程搜索，需同时开启 filterable | ^[boolean] | false |
| remote-method | 远程搜索方法 | ^[Function]`(query: string) => void` | — |
| remote-show-suffix | 远程搜索时是否显示后缀图标 | ^[boolean] | false |
| debounce | 远程搜索防抖时长（毫秒） | ^[number] | 300 |
| loading | 是否正在加载数据 | ^[boolean] | false |
| loading-text | 加载中文案 | ^[string] | 加载中 |
| reserve-keyword | 多选且可搜索时是否保留关键词 | ^[boolean] | true |
| default-first-option | 回车时是否选中第一个匹配项 | ^[boolean] | false |
| allow-create | 是否允许创建新选项，需开启 filterable | ^[boolean] | false |
| automatic-dropdown | 非搜索模式下聚焦是否自动展开 | ^[boolean] | false |
| multiple-limit | 多选数量上限，0 表示不限 | ^[number] | 0 |
| collapse-tags | 多选时是否折叠标签 | ^[boolean] | false |
| collapse-tags-tooltip | 折叠标签是否在悬停时展示全部 | ^[boolean] | false |
| max-collapse-tags | 折叠时最多展示的标签数 | ^[number] | 1 |
| tag-type | 标签类型 | ^[enum]`'success' \| 'info' \| 'warning' \| 'danger' \| 'primary'` | info |
| tag-effect | 标签主题 | ^[enum]`'light' \| 'dark' \| 'plain'` | light |
| placeholder | 占位文本 | ^[string] | 请选择 |
| no-data-text | 无选项时的文案 | ^[string] | 无数据 |
| no-match-text | 搜索无匹配项时的文案 | ^[string] | 无匹配数据 |
| popper-class / popper-style | 下拉浮层的类名与样式 | ^[string] / ^[object] | — |
| teleported | 下拉是否传送到 body | ^[boolean] | true |
| persistent | 下拉关闭后是否保留 DOM | ^[boolean] | true |
| effect | 浮层主题 | ^[enum]`'dark' \| 'light'` | light |
| placement | 下拉位置 | ^[string] | bottom-start |
| fallback-placements | 下拉翻转兜底位置 | ^[array] | — |
| show-arrow | 是否显示下拉箭头 | ^[boolean] | true |
| offset | 下拉与输入框的间距 | ^[number] | 12 |
| fit-input-width | 下拉宽度是否与输入框一致，或传固定数值 | ^[boolean] / ^[number] | true |
| suffix-icon | 自定义后缀图标 | ^[ReactNode] | — |
| empty-values | 空值集合 | ^[array] | — |
| value-on-clear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] / ^[null] | — |
| scrollbar-always-on | 是否总是显示滚动条 | ^[boolean] | false |
| validate-event | 值变化时是否触发表单校验 | ^[boolean] | true |
| name | 原生 input name | ^[string] | — |
| id | 原生 input id | ^[string] | — |
| autocomplete | 原生 autocomplete | ^[string] | off |
| tabindex | 原生 input tabindex | ^[string] / ^[number] | 0 |
| aria-label | 无障碍标签 | ^[string] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Select Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化 | ^[Function]`(value: SelectValue) => void` |
| onVisibleChange | 下拉可见性变化 | ^[Function]`(visible: boolean) => void` |
| onRemoveTag | 多选移除标签 | ^[Function]`(value: unknown) => void` |
| onClear | 点击清空 | ^[Function]`() => void` |
| onFocus | 获得焦点 | ^[Function]`(event: FocusEvent) => void` |
| onBlur | 失去焦点 | ^[Function]`(event: FocusEvent) => void` |
| onEndReached | 滚动到边界 | ^[Function]`(direction: 'top' \| 'bottom' \| 'left' \| 'right') => void` |

### Select Slots（React render props）

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| children | 自定义选项内容 | ^[Function]`({ item, index, disabled }) => ReactNode` |
| label | 自定义选中值与标签文案 | ^[Function]`({ index, label, value }) => ReactNode` |
| tag | 自定义多选标签 | ^[Function]`({ data, selectDisabled, deleteTag }) => ReactNode` |
| header | 下拉头部 | ^[ReactNode] |
| footer | 下拉底部 | ^[ReactNode] |
| loadingSlot | 自定义加载内容 | ^[ReactNode] |
| empty | 自定义空数据内容 | ^[ReactNode] |
| prefix | 输入框前缀 | ^[ReactNode] |

### Select Exposes

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| focus | 使选择器获得焦点 | — |
| blur | 使选择器失去焦点 | — |
| scrollTo | 滚动到指定选项 | ^[Function]`(index: number) => void` |
| selectedLabel | 当前选中项文案，多选返回数组 | — |

### SelectOptionType

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项值，字段名可通过 props.value 改写 | ^[string] / ^[number] / ^[boolean] / ^[object] | — |
| label | 选项显示文本，字段名可通过 props.label 改写 | ^[ReactNode] | — |
| disabled | 是否禁用该项，字段名可通过 props.disabled 改写 | ^[boolean] | false |
| options | 分组选项的子选项，字段名可通过 props.options 改写 | ^[array] | — |
| type | 在内置类型中固定为 `Group` 时渲染为分组标题 | ^[string] | — |
| created | 由 allow-create 生成的临时选项 | ^[boolean] | false |
