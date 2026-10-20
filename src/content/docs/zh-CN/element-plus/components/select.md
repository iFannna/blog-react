---
title: "Select 选择器"
description: "当选项过多时，使用下拉菜单展示并选择内容。"
group: 表单组件
order: 170
---

# Select 选择器

当选项过多时，使用下拉菜单展示并选择内容。

## 基础用法

:::demo `value` 是当前选中项的值，通过 `options` 提供选项数据。

select/basic-usage

:::

## 选项属性

:::demo 通过 `props` 自定义选项对象中 value、label、disabled 的字段名。

select/options

:::

## 有禁用选项

:::demo 在选项中设置 `disabled` 为 `true` 可禁用该选项。

select/disabled-option

:::

## 禁用状态

:::demo 为 `ElSelect` 设置 `disabled` 可禁用整个组件。

select/disabled

:::

## 可清空

:::demo 设置 `clearable` 后会出现清空图标。

select/clearable

:::

## 尺寸

:::demo 通过 `size` 改变尺寸，除默认外还有 `large`、 `small`。

select/size

:::

## 基础多选

:::demo 设置 `multiple` 开启多选；`collapseTags` 折叠标签， `collapseTagsTooltip` 在悬停时展示全部， `maxCollapseTags` 控制折叠前展示的数量。

select/multiple

:::

## 自定义模板

:::demo 通过 `children` 渲染函数自定义选项内容。

select/custom-template

:::

## 下拉头部

:::demo 通过 `header` 自定义下拉头部，例如全选。

select/custom-header

:::

## 下拉底部

:::demo 通过 `footer` 自定义下拉底部，可实现动态添加选项。

select/custom-footer

:::

## 分组

:::demo 选项数据的 `options` 字段用于嵌套子选项，形成分组。

select/grouping

:::

## 选项过滤

:::demo 设置 `filterable` 开启搜索，默认按 label 过滤，也可通过 `filterMethod` 自定义。

select/filterable

:::

## 远程搜索

:::demo 设置 `remote` 与 `remoteMethod` 从服务端加载选项， `remoteShowSuffix` 控制搜索时是否显示后缀图标。

select/remote-search

:::

## 创建条目

:::demo 设置 `allowCreate` 允许创建不在选项列表中的条目。

select/allow-create

:::

## 使用 value-key

:::demo 当选中值是对象时，通过 `valueKey` 指定唯一标识字段。

select/value-key

:::

## 自定义标签

:::demo 通过 `tag` 渲染函数自定义多选标签。

select/custom-tag

:::

## 自定义加载

:::demo 通过 `loadingSlot` 自定义远程搜索的加载状态内容。

select/custom-loading

:::

## 空值

:::demo 通过 `emptyValues` 定义空值集合，`valueOnClear` 定义清空后的返回值。

select/empty-values

:::

## 自定义标签文案

:::demo 通过 `label` 渲染函数自定义选中值与标签的显示内容。

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
