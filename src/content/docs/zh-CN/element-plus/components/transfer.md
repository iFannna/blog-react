---
title: "Transfer 穿梭框"
description: "在一组列表中选中内容，移动到另一侧完成选择。"
group: 表单组件
order: 230
---

# Transfer 穿梭框

## 基础用法

:::demo Transfer 的数据通过 `data` 属性传入。数据需要是一个对象数组，每个对象有以下属性：`key` 为数据的唯一性标识，`label` 为显示文本，`disabled` 表示该项数据是否禁止被操作。目标列表中的数据项会同步到绑定至 `v-model` 的变量，值为数据项的 `key` 所组成的数组。当然，如果希望在初始状态时目标列表不为空，可以像本例一样为 `v-model` 绑定的变量赋予一个初始值。

transfer/basic

:::

## 可搜索过滤

在数据很多的情况下，可以对数据进行搜索和过滤。

:::demo 设置 `filterable` 为 `true` 即可开启搜索模式。默认情况下，若数据项的 `label` 属性包含搜索关键字，则会在搜索结果中显示。你也可以使用 `filter-method` 定义自己的搜索逻辑。 `filter-method` 接收一个方法，当搜索关键字变化时，会将当前的关键字和每个数据项传给该方法。若方法返回 `true`，则会在搜索结果中显示对应的数据项。

transfer/filterable

:::

## 自定义

可以对列表标题文案、按钮文案、数据项的渲染函数、列表底部的勾选状态文案、列表底部的内容区等进行自定义。

:::demo 可以使用 `titles`、`button-texts`、`render-content` 和 `format` 属性分别对列表标题文案、按钮文案、数据项的渲染函数和列表顶部的勾选状态文案进行自定义。数据项的渲染还可以使用 `scoped-slot` 进行自定义。对于列表底部的内容区，提供了两个具名 slot：`left-footer` 和 `right-footer`。此外，如果希望某些数据项在初始化时就被勾选，可以使用 `left-default-checked` 和 `right-default-checked` 属性。最后，本例还展示了 `change` 事件的用法。注意，由于 JSFiddle 不支持 JSX 语法，故该示例无法在 JSFiddle 运行。但是在实际的项目中，只要正确地配置了相关依赖，就可以正常运行。

transfer/customizable

:::

## 自定义空内容 ^(2.9.0)

您可以自定义列表为空或未找到筛选结果时显示的内容。

:::demo 使用 `left-empty` 和 `right-empty` 插槽来自定义每个面板的空内容。

transfer/empty-content

:::

## 数据项属性别名

默认情况下，Transfer 仅能识别数据项中的 `key`、`label` 和 `disabled` 字段。如果你的数据的字段名不同，可以使用 `props` 属性为它们设置别名。

:::demo 本例中的数据源没有 `key` 和 `label` 字段，在功能上与它们相同的字段名为 `value` 和 `desc`。因此可以使用`props` 属性为 `key` 和 `label` 设置别名。

transfer/prop-alias

:::

## 虚拟滚动 ^(2.14.3)

当处理大量数据时，您可以启用虚拟滚动以提高性能。

:::demo 将 `virtual-scroll` 设置为 `true` 以启用虚拟滚动。 您也可以使用 `item-size` 自定义项的高度。默认项大小为 30px。

transfer/virtual-scroll

:::

## Transfer API

### Transfer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 右侧列表的绑定值，对应官方 model-value / v-model | ^[array]`TransferKey[]` | [] |
| data | 数据源 | ^[array]`TransferDataItem[]` | [] |
| filterable | 是否可搜索 | ^[boolean] | false |
| filter-placeholder | 搜索框占位文本 | ^[string] | 请输入搜索内容 |
| filter-method | 自定义搜索方法 | ^[Function]`(query, item) => boolean` | — |
| target-order | 右侧列表排序策略 | ^[enum]`'original' \| 'push' \| 'unshift'` | 'original' |
| titles | 自定义列表标题 | ^[array]`[string, string]` | [] |
| button-texts | 自定义按钮文案 | ^[array]`[string, string]` | [] |
| render-content | 数据项渲染函数 | ^[Function]`(option) => ReactNode` | — |
| format | 列表头部勾选统计文案模板 | ^[object]`TransferFormat` | {} |
| option-props | 数据源字段别名，对应官方 `props` | ^[object]`TransferPropsAlias` | — |
| left-default-checked | 左侧列表初始勾选项 | ^[array]`TransferKey[]` | [] |
| right-default-checked | 右侧列表初始勾选项 | ^[array]`TransferKey[]` | [] |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| virtual-scroll | 是否启用虚拟滚动 | ^[boolean] | false |
| item-size | 虚拟滚动的行高 | ^[number] | 30 |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Transfer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 右侧列表数据变化 | ^[Function]`(value, direction, movedKeys) => void` |
| onLeftCheckChange | 左侧列表勾选态变化 | ^[Function]`(value, movedKeys?) => void` |
| onRightCheckChange | 右侧列表勾选态变化 | ^[Function]`(value, movedKeys?) => void` |

### Transfer Slots（React）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义数据项内容，传入函数即生效 | ^[Function]`(option: TransferDataItem) => ReactNode` |
| left-footer / right-footer | 两侧列表底部内容 | ^[ReactNode] |
| left-empty / right-empty | 两侧列表空态内容 | ^[ReactNode] |

### Transfer Exposes（ref）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| clearQuery | 清空指定面板的搜索词 | ^[Function]`(which: 'left' \| 'right') => void` |
| leftPanel / rightPanel | 左右面板实例：`query` 可读写，另提供 `setQuery(query)` | ^[object]`Ref<TransferPanelHandle>` |

### Type Declarations

| 类型 | 说明 |
| --- | --- |
| `TransferKey` | `string \| number` |
| `TransferDirection` | `'left' \| 'right'` |
| `TransferDataItem` | `Record<string, any>` |
| `TransferFormat` | `{ noChecked?: string; hasChecked?: string }` |
| `TransferPropsAlias` | `{ label?: string; key?: string; disabled?: string }` |
