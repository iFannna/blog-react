---
title: "Transfer 穿梭框"
description: "在一组列表中选中内容，移动到另一侧完成选择。"
group: 表单组件
order: 230
---

# Transfer 穿梭框

在一组列表中选中内容，移动到另一侧完成选择。

## 基础用法

:::demo 通过 `data` 传数据，每项需有 `key` 标识、 `label` 显示文本，`disabled` 可选。 `value` 是右侧列表的 key 数组。

transfer/basic

:::

## 可搜索

:::demo 设置 `filterable` 开启搜索；默认按 `label` 是否包含关键词过滤， 也可用 `filterMethod` 自定义匹配逻辑。

transfer/filterable

:::

## 自定义

:::demo 可用 `titles`、`buttonTexts`、`renderContent`、 `format` 自定义标题、按钮文案、数据项渲染与头部统计文案； 用 `leftFooter` / `rightFooter` 自定义底部内容； 用 `leftDefaultChecked` / `rightDefaultChecked` 设置初始勾选项。

transfer/customizable

:::

## 自定义空内容

:::demo 用 `leftEmpty` / `rightEmpty` 自定义列表为空或无匹配结果时的内容。

transfer/empty-content

:::

## 数据项别名

:::demo 默认从数据项取 `key`、`label`、`disabled`； 字段名不同时用 `optionProps` 声明别名。

transfer/prop-alias

:::

## 虚拟滚动

:::demo 数据量较大时设置 `virtualScroll` 开启虚拟滚动，用  `itemSize` 指定行高（默认 30px）。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法 |
| `props` | `optionProps` | 避开 React 的 props 语义混淆，字段名不变 |
| `render-content` | `renderContent` | 官方收 `(h, option)`，React 无 h 函数，改为直接返回元素 |
| 默认作用域插槽 | `children` 函数 | `(option) => ReactNode`，与 `renderContent` 二选一，前者优先 |
| `left-footer` 等具名插槽 | `leftFooter` 等 props | 传 ReactNode |
| `change` 事件 | `onChange(next, direction, movedKeys)` | 合并官方 `update:modelValue` 与 `change` |
| `left-check-change` | `onLeftCheckChange` | 同官方两参形态 |
| `clearQuery` / 面板 ref | 经 `ref` 暴露；面板 `query` 可读写 | `transferRef.current.clearQuery('left')`、`transferRef.current.leftPanel.current.query` |

**实现说明**：DOM 与官网一致（`.el-transfer__buttons` / `.el-transfer__button` /
`.el-transfer-panel__header` / `.el-transfer-panel__list` / `.el-transfer-panel__empty` 等）。
勾选态存在面板内部，每次变化按官方 `useMove` 的三种 `targetOrder` 策略算出新的右侧列表顺序；
`checkChangeByUser` 的口径照搬官方，程序回写只上报勾选值、不下发 `movedKeys`。

**未实现的官方能力**：
1. 官方 `el-checkbox-group` 的键盘导航（方向键在组内移动焦点）未实现，依赖 ElCheckboxGroup 补齐。
2. 虚拟滚动的滚动条只实现竖向拖动与点击跳转，未实现官方 `ElVirtualScrollBar` 的触摸事件分支。
3. 官方 `el-input` 搜索框的 `filterPlaceholder` 走 locale；本项目 locale 已具备该键，但 UI 上的 clear 图标行为沿用 ElInput 实现。
