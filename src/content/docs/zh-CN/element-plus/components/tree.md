---
title: "Tree 树形控件"
description: "用清晰的层级结构展示信息，可展开或折叠。"
group: 数据展示
order: 200
---

# Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。

## 基础用法

基础的树形结构展示

:::demo

tree/basic

:::

## 可选择

适用于需要选择层级时使用。

:::demo 本例还展示了动态加载节点数据的方法。

tree/selectable

:::

:::warning

在使用 show-checkbox 时，因为 `check-on-click-leaf` 默认值为 true， 最后一个树节点可以通过点击节点进行勾选。

:::

## 懒加载自定义叶子节点

:::demo 由于在点击节点时才进行该层数据的获取，默认情况下 Tree 无法预知某个节点是否为叶子节点，所以会为每个节点添加一个下拉按钮，如果节点没有下层数据，则点击后下拉按钮会消失。同时，你也可以提前告知 Tree 某个节点是否为叶子节点，从而避免在叶子节点前渲染下拉按钮。

tree/custom-leaf

:::

## 多次懒加载 ^(2.6.3)

:::demo 加载远程节点数据时，懒加载有时可能失败。在这种情况下，您可以调用 reject 以保持节点状态，并允许远程加载继续。

tree/multiple-times-load

:::

## 禁用复选框

节点的复选框可以设置为禁用。

:::demo 在示例中，通过 disabled 设置禁用状态。相应的复选框已禁用，不能点击。

tree/disabled

:::

## 默认展开以及默认选中

树节点可以在初始化阶段被设置为展开和选中。

:::demo 分别通过 `default-expanded-keys` 和 `default-checked-keys` 设置默认展开和默认选中的节点。需要注意的是，此时必须设置 `node-key`，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。

tree/default-state

:::

## 树节点的选择

:::demo 本例展示如何获取和设置选中节点。获取和设置各有两种方式：通过 node 或通过 key。如果需要通过 key 来获取或设置，则必须设置 `node-key`。

tree/checking-tree

:::

## 自定义节点内容

节点的内容支持自定义，可以在节点区添加按钮或图标等内容

:::demo 可以通过两种方法进行树节点内容的自定义：`render-content` 和 scoped slot。使用 `render-content` 指定渲染函数，该函数返回需要的节点区内容即可。渲染函数的用法请参考 Vue 文档。使用 scoped slot 会传入两个参数 `node` 和 `data`，分别表示当前节点的 Node 对象和当前节点的数据。注意：由于 JSFiddle 不支持 JSX 语法，所以 `render-content` 示例无法在那里运行。但是在实际的项目中，只要正确地配置了相关依赖，就可以正常运行。

tree/customized-node

:::

## 自定义节点类名

节点的类名支持自定义。

:::demo 使用 `props.class` 来建立节点的类名。

tree/custom-node-class

:::

## 树节点过滤

树节点是可以被过滤的

:::demo 调用 Tree 实例对象的 `filter` 方法来过滤树节点。方法的参数就是过滤关键字。需要注意的是，此时需要设置 `filter-node-method` 属性，其值为过滤函数。

tree/filtering

:::

## 手风琴模式

对于同一级的节点，每次只能展开一个

:::demo

tree/accordion

:::

## 可拖拽节点

通过 `draggable` 属性可让节点变为可拖拽

:::demo

tree/draggable

:::

## Tree API

### Tree Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | ^[array]`TreeNodeData[]` | [] |
| empty-text | 数据为空时的文本 | ^[string] | 暂无数据（取 locale） |
| node-key | 节点唯一标识字段名，全树唯一 | ^[string] | — |
| props | 节点字段配置，见下表 | ^[object]`TreeOptionProps` | — |
| render-after-expand | 是否首次展开后才渲染子节点 | ^[boolean] | true |
| load | 懒加载子树数据的方法 | ^[Function]`(node, resolve, reject) => void` | — |
| render-content | 自定义节点内容 | ^[Function]`(context) => ReactNode` | — |
| highlight-current | 是否高亮当前节点 | ^[boolean] | false |
| default-expand-all | 是否默认展开所有节点 | ^[boolean] | false |
| expand-on-click-node | 点击节点是否展开/收起 | ^[boolean] | true |
| check-on-click-node | 点击节点是否勾选 | ^[boolean] | false |
| check-on-click-leaf | 点击叶子节点是否勾选 | ^[boolean] | true |
| auto-expand-parent | 子节点展开时是否展开父节点 | ^[boolean] | true |
| default-expanded-keys | 初始展开的节点 key 数组 | ^[array]`Array<string \| number>` | — |
| show-checkbox | 是否显示复选框 | ^[boolean] | false |
| check-strictly | 勾选是否不联动父子 | ^[boolean] | false |
| check-descendants | 勾选时是否下传子节点 | ^[boolean] | false |
| default-checked-keys | 初始勾选的节点 key 数组 | ^[array]`Array<string \| number>` | — |
| current-node-key | 初始选中的节点 key | ^[string] / ^[number] | — |
| filter-node-method | 过滤方法，返回 false 的节点被隐藏 | ^[Function]`(value, data, node) => boolean` | — |
| accordion | 同层是否只展开一个节点 | ^[boolean] | false |
| indent | 相邻层级缩进像素 | ^[number] | 18 |
| icon | 自定义展开图标 | ^[ReactNode] | — |
| lazy | 是否懒加载 | ^[boolean] | false |
| draggable | 是否可拖拽节点 | ^[boolean] | false |
| allow-drag | 拖拽前判定，返回 false 不可拖 | ^[Function]`(node) => boolean` | — |
| allow-drop | 落点判定，返回 false 不可落 | ^[Function]`(draggingNode, dropNode, type) => boolean` | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签字段名或取值函数 | ^[string] / ^[Function]`(data, node) => string` | label |
| children | 子树字段名 | ^[string] | children |
| disabled | 禁用字段名或取值函数 | ^[string] / ^[Function]`(data, node) => boolean` | disabled |
| isLeaf | 叶子字段名或取值函数，仅 lazy 下生效 | ^[string] / ^[Function]`(data, node) => boolean` | — |
| class | 自定义节点类名 | ^[Function]`(data, node) => string \| object` | — |

### Tree Exposes

命令式方法经 `ref` 或 `onReady` 回调下发。

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| filter | 过滤节点，被过滤的节点隐藏 | (value) 传给 filter-node-method 的第一个参数 |
| updateKeyChildren | 设置某节点的新数据，需要 node-key | (key, data) 节点 key 与新数据 |
| getCheckedNodes | 返回当前选中的节点数组 | (leafOnly, includeHalfChecked) 两个布尔参数，默认 false |
| setCheckedNodes | 设置选中某些节点，需要 node-key | (nodes, leafOnly) 节点数组或数据数组，与是否只作用于叶子 |
| getCheckedKeys | 返回当前选中节点的 key 数组 | (leafOnly) 布尔参数，默认 false |
| setCheckedKeys | 设置选中某些 key，需要 node-key | (keys, leafOnly) key 数组与是否只作用于叶子 |
| setChecked | 设置节点勾选态 | (key/data, checked, deep) |
| getHalfCheckedNodes | 返回半选节点数组 | — |
| getHalfCheckedKeys | 返回半选节点的 key 数组 | — |
| getCurrentKey | 返回高亮节点的 key | — |
| getCurrentNode | 返回高亮节点的数据 | — |
| setCurrentKey | 按 key 设置高亮节点 | (key, shouldAutoExpandParent=true) |
| setCurrentNode | 按节点设置高亮节点 | (node, shouldAutoExpandParent=true) |
| getNode | 按数据或 key 取节点 | (data) |
| getNodePath | 返回节点从根到自身的路径 | (data) |
| remove | 删除节点，需要 node-key | (data) 数据或节点 |
| append | 向指定节点追加子节点 | (data, parentNode) |
| insertBefore | 在指定节点前插入 | (data, refNode) |
| insertAfter | 在指定节点后插入 | (data, refNode) |

### Tree Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onNodeClick | 节点被点击时触发 | (data, node, event) |
| onNodeContextmenu | 节点被右键点击时触发 | (event, data, node) |
| onCheckChange | 节点选中态变化时触发 | (data, checked, indeterminate) |
| onCheck | 点击复选框后触发 | (data, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) |
| onCurrentChange | 当前节点变化时触发 | (data, node) |
| onNodeExpand | 节点展开时触发 | (data, node) |
| onNodeCollapse | 节点收起时触发 | (data, node) |
| onNodeDragStart | 开始拖拽时触发 | (node, event) |
| onNodeDragEnter | 拖拽进入某节点时触发 | (draggingNode, dropNode, event) |
| onNodeDragLeave | 拖拽离开某节点时触发 | (draggingNode, dropNode, event) |
| onNodeDragOver | 拖拽悬停某节点时触发 | (draggingNode, dropNode, event) |
| onNodeDragEnd | 拖拽结束时触发 | (draggingNode, dropNode \| null, dropType, event) |
| onNodeDrop | 拖拽落下后触发 | (draggingNode, dropNode, dropType, event) |
