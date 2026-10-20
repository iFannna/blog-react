---
title: "TreeSelect 树形选择器"
description: "下拉菜单形式的树形选择器，组合了 `ElTree` 与  `ElSelect` 的功能。"
group: 表单组件
order: 240
---

# TreeSelect 树形选择器

下拉菜单形式的树形选择器，组合了 `ElTree` 与  `ElSelect` 的功能。

## 基础用法

:::demo 用于树形结构的选择器。

tree-select/basic

:::

## 选择任意一级选项

:::demo 在设置 `checkStrictly` 属性之后，任意一级都可以选择； 否则只能选择叶子节点。使用 `showCheckbox` 时， `checkOnClickNode` 默认为 `false`， 即只能通过勾选选中，可以将其设置为 `true` 后点击节点选中。 使用 `showCheckbox` 时 `checkOnClickLeaf` 默认为  `true`，点击叶子节点即可勾选。

tree-select/check-strictly

:::

## 多选

:::demo 通过点击或复选框多选。

tree-select/multiple

:::

## 禁用选项

:::demo 在数据里用 `disabled` 字段禁用选项。

tree-select/disabled

:::

## 可筛选

:::demo 利用关键字进行筛选，或使用自定义筛选方法。`filterMethod`  可自定义对数据进行筛选的方法，`filterNodeMethod`  可自定义对数据节点进行筛选的方法。

tree-select/filterable

:::

## 自定义内容

:::demo 自定义树节点的内容。

tree-select/slots

:::

## 懒加载

:::demo 树节点的懒加载，适用于大数据列表。

tree-select/lazy

:::

## 使用 node-key 属性

:::demo 默认情况下 `modelValue` 查找的是 `value` 键。 对于不同的数据结构，必须提供 `nodeKey` 才能正常工作。

tree-select/node-key

:::

## TreeSelect API

树形选择器组合了 `ElTree` 与 `ElSelect` 的能力，官方文档说明「原有属性未做改动，请查阅原组件文档」。
React 版沿用这一约定：树相关属性见 Tree、下拉相关属性见下表。

### TreeSelect Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中值，单选为单值、多选为数组（对应官方 v-model） | ^[string] / ^[number] / ^[array] | — |
| data | 树数据 | ^[array]`TreeData` | [] |
| multiple | 是否多选 | ^[boolean] | false |
| clearable | 是否可清空 | ^[boolean] | false |
| filterable | 是否可筛选 | ^[boolean] | false |
| disabled | 是否禁用整个组件（对应官方 ElSelect 的 disabled） | ^[boolean] | false |
| placeholder | 占位文本 | ^[string] | 请选择 |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| value-key | 取值的字段名，对应官方 value-key | ^[string] | — |
| cache-data | 懒加载节点的缓存数据，结构同 data，用于取未加载节点的 label | ^[array]`CacheOption[]` | [] |
| filter-method | 自定义筛选方法，由调用方重建 data | ^[Function]`(keyword: string) => void` | — |
| filter-node-method | 自定义节点筛选方法 | ^[Function]`(value, data, node) => boolean` | — |
| remote-method | 远程筛选方法 | ^[Function]`(keyword: string) => void` | — |
| empty-values | 空值集合，缺省取全局配置 | ^[array] | — |
| value-on-clear | 清空时返回的值，缺省取全局配置 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| popper-class | 下拉浮层的额外类名 | ^[string] | — |
| visible | 下拉是否展开，传入即为受控 | ^[boolean] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Tree 属性透传

`TreeProps` 上的属性原样透传给内部的 `ElTree`：`nodeKey`、`props`、`render-after-expand`、
`show-checkbox`、`check-strictly`、`check-on-click-node`、`check-on-click-leaf`、
`expand-on-click-node`、`default-expand-all`、`default-expanded-keys`、`default-checked-keys`、
`lazy`、`load`、`accordion`、`indent`、`highlight-current`、`auto-expand-parent`、
`render-content`、`allow-drag` / `allow-drop` / `draggable` 等。
官方同样把 `node-key || value-key || 'value'` 作为内部树的 node-key，因此只传
`value-key` 也能正确寻址与勾选。

### TreeSelect Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化（对应官方 v-model 的 update:modelValue） | ^[Function]`(value: TreeSelectValue \| undefined) => void` |
| onClear | 点击清空图标 | — |
| onRemoveTag | 多选模式下点击标签的关闭按钮 | ^[Function]`(value: TreeSelectSingleValue) => void` |
| onVisibleChange | 下拉展开态变化，配合受控的 `visible` 使用 | ^[Function]`(visible: boolean) => void` |
| onFocus | 输入框聚焦 | ^[Function]`(event: FocusEvent<HTMLInputElement>) => void` |
| onBlur | 输入框失焦 | ^[Function]`(event: FocusEvent<HTMLInputElement>) => void` |
| onCheck | 勾选变化，转发自 ElTree 的 check | ^[Function]`(data, info) => void` |
| onNodeClick | 节点被点击，转发自 ElTree 的 node-click | ^[Function]`(data, node, event) => void` |
| onNodeExpand | 节点展开，转发自 ElTree 的 node-expand | ^[Function]`(data, node, event) => void` |
| onReady | 拿到内部 ElTree 的实例句柄（替代官方 treeRef） | ^[Function]`(instance: TreeInstance) => void` |

### TreeSelect Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义树节点内容（React 侧通过 `children` 函数 prop 传入） | `({ node, data, store }) => ReactNode` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| onReady 下发的实例 | 与 `ElTree` 的实例同构，含 `getCheckedKeys` / `setCheckedKeys` / `filter` / `getNode` 等 | `TreeInstance` |
