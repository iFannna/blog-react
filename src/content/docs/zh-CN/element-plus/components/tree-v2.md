---
title: "Tree V2 虚拟化树形控件"
description: "面向大数据量的虚拟滚动树形控件。"
group: 数据展示
order: 210
---

# Tree V2 虚拟化树形控件

面向大数据量的虚拟滚动树形控件。

## 基础用法

:::demo 基础的树形结构展示。

tree-v2/basic

:::

## 可选择

:::demo 用于节点选择。

tree-v2/selectable

:::

## 禁用复选框

:::demo 节点的复选框可以单独禁用：在 `props` 里声明  `disabled` 字段名，并把节点的该字段设为 `true`。

tree-v2/disabled

:::

## 默认展开和默认选中

:::demo 用 `default-expanded-keys` 与  `default-checked-keys` 设置初始展开与初始勾选的节点。

tree-v2/default-state

:::

## 自定义节点内容

:::demo 节点内容可以自定义，从而加入图标或按钮。

tree-v2/custom-node

:::

## 自定义节点类名

:::demo 用 `props.class` 生成节点类名。

tree-v2/custom-node-class

:::

## 自定义节点图标

:::demo 节点暴露 `expanded` 与 `isLeaf` 属性，可据此渲染不同的图标。

tree-v2/custom-icon

:::

## 树节点过滤

:::demo 调用实例的 `filter` 方法过滤节点，参数即过滤关键字。 该功能需要 `filter-method`。

tree-v2/filter

:::

## TreeV2 API

### TreeV2 Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | ^[array]`TreeNodeData[]` | — |
| empty-text | 数据为空时的文本 | ^[string] | 取 locale 的 el.tree.emptyText |
| props | 节点字段配置，见下表 | ^[object]`TreeOptionProps` | — |
| highlight-current | 是否高亮当前节点 | ^[boolean] | false |
| expand-on-click-node | 点击节点是否展开/收起；为 false 时只能点箭头 | ^[boolean] | true |
| check-on-click-node | 点击节点是否勾选；为 false 时只能点复选框 | ^[boolean] | false |
| check-on-click-leaf | 点击叶子节点是否勾选 | ^[boolean] | true |
| default-expanded-keys | 初始展开节点的 key 数组 | ^[array]`Array<string \| number>` | — |
| show-checkbox | 是否显示复选框 | ^[boolean] | false |
| check-strictly | 勾选是否不联动父子节点 | ^[boolean] | false |
| default-checked-keys | 初始勾选节点的 key 数组 | ^[array]`Array<string \| number>` | — |
| current-node-key | 初始选中节点的 key | ^[string] / ^[number] | — |
| filter-method | 过滤方法，返回 false 的节点被隐藏 | ^[Function]`(query, data, node) => boolean` | — |
| indent | 相邻层级缩进像素 | ^[number] | 16 |
| icon | 自定义展开图标 | ^[ReactNode] / ^[Component] | — |
| item-size | 节点高度 | ^[number] | 26 |
| scrollbar-always-on | 是否始终显示滚动条 | ^[boolean] | false |
| height | 树的高度 | ^[number] | 200 |
| accordion | 同层是否只展开一个节点 | ^[boolean] | false |
| perf-mode | 性能模式，缓存样式提升滚动流畅度 | ^[boolean] | true |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 节点唯一标识字段名，全树唯一 | ^[string] | id |
| label | 节点标签字段名 | ^[string] | label |
| children | 子树字段名 | ^[string] | children |
| disabled | 复选框禁用字段名 | ^[string] | disabled |
| class | 自定义节点类名 | ^[string] / ^[Function]`(data, node) => string \| object` | — |

### TreeV2 Exposes

命令式方法通过 `ref` 获取。

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| filter | 过滤所有节点，被过滤的节点隐藏 | (query) |
| getCheckedNodes | 返回当前选中节点数组 | (leafOnly) |
| getCheckedKeys | 返回当前选中节点的 key 数组 | (leafOnly) |
| setCheckedKeys | 设置选中某些 key | (keys) |
| setChecked | 设置单个节点勾选态，deep 表示是否递归子节点 | (key, checked, deep) |
| setExpandedKeys | 设置展开节点 | (keys) |
| getHalfCheckedNodes | 返回半选节点数组 | — |
| getHalfCheckedKeys | 返回半选节点的 key 数组 | — |
| getCurrentKey | 返回高亮节点的 key，无高亮时为 undefined | — |
| getCurrentNode | 返回高亮节点的数据，无高亮时为 undefined | — |
| setCurrentKey | 按 key 设置高亮节点 | (key) |
| getNode | 按 key 或数据取节点 | (data) |
| expandNode | 展开指定节点 | (node) |
| collapseNode | 收起指定节点 | (node) |
| setData | 直接替换数据，绕开响应式更新的性能开销 | (data) |
| scrollTo | 滚动到指定偏移 | (offset) |
| scrollToNode | 滚动到指定 key，可指定策略 | (key, strategy) |
| toggleCheckbox | 切换节点勾选态 | (node, checked, nodeClick, immediateUpdate, deep) |

### TreeV2 Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onNodeClick | 节点被点击时触发 | (data, node, event) |
| onNodeDrop | 拖拽落到节点上时触发 | (data, node, event) |
| onNodeContextmenu | 节点被右键点击时触发 | (event, data, node) |
| onCheckChange | 节点选中态变化时触发 | (data, checked) |
| onCheck | 点击复选框后触发 | (data, { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes }) |
| onCurrentChange | 当前节点变化时触发 | (data, node) |
| onNodeExpand | 节点展开时触发 | (data, node) |
| onNodeCollapse | 节点收起时触发 | (data, node) |

### TreeV2 Slots

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| default | 自定义节点内容，对应 `children` 函数 | `{ node, data }` |
| empty | 数据为空时的内容，对应 `empty` 属性 | — |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `ref` 取实例方法 | `ref`（forwardRef） | `useRef<TreeV2Expose>`，方法名与官方一致 |
| default 作用域插槽 | `children` 函数 | 参数为 `{ node, data }` |
| empty 插槽 | `empty` 属性 | 传 ReactNode |
| `icon` 传组件 | `icon` 传 ReactNode 或组件类型 | 两种形态都会渲染在 `.el-icon` 内 |

**实现说明**：DOM 与官方模板一致——`.el-tree`（`role="tree"`）、`.el-tree-virtual-list`、
`.el-tree-node`（`role="treeitem"`）、`.el-tree-node__content`、`.el-tree-node__expand-icon`、
`.el-tree-node__label`、`.el-tree__empty-block` / `.el-tree__empty-text`。状态类
`is-expanded` / `is-current` / `is-focusable` / `is-checked` / `is-leaf` / `is-hidden`
与官方一一对应。扁平化、过滤（保留祖先路径）、父子联动/半选、手风琴等算法逐行移植官方
`useTree` / `useCheck` / `useFilter`，渲染层由 Vue reactive 改为 React 状态。
