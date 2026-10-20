---
title: "Tree 树形控件"
description: "用清晰的层级结构展示信息，可展开或折叠。"
group: 数据展示
order: 200
---

# Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。

## 基础用法

:::demo 基础的树形结构展示。

tree/basic

:::

## 可选择

:::demo 用于节点选择，该示例同时演示节点的异步加载。

tree/selectable

:::

### 懒加载下的自定义叶子节点

:::demo 节点数据在点击时才拉取，树无法预知某个节点是否为叶子节点，因此每个节点都带一个下拉按钮， 若是叶子节点则点击后下拉按钮消失。也可以提前用 `props.isLeaf` 告知， 从而在叶子节点上不渲染下拉按钮。

tree/custom-leaf

:::

### 懒加载失败重试

:::demo 远程懒加载可能失败，此时调用 `reject` 保持节点原有状态，以便继续重试加载。

tree/multiple-times-load

:::

## 禁用复选框

:::demo 节点的复选框可以单独禁用：在 `props` 里声明 `disabled` 字段名， 并把节点的该字段设为 `true`。

tree/disabled

:::

## 默认展开和默认选中

:::demo 用 `default-expanded-keys` 与 `default-checked-keys` 设置初始展开与初始勾选的节点。二者都需要 `node-key`， 其值为数据对象里某个全树唯一的字段名。

tree/default-state

:::

## 勾选节点

:::demo `getCheckedNodes` / `setCheckedKeys` 等方法既可作用于节点， 也可作用于 key；走 key 的写法需要 `node-key`。

tree/checking-tree

:::

## 自定义节点内容

:::demo 节点的内容可以自定义，从而加入图标或按钮。提供 `renderContent`  与作用域插槽两种写法：前者接收 `{ node, data, store }` 并返回内容， 后者即 `children` 函数，参数相同。

tree/customized-node

:::

## 自定义节点类名

:::demo 用 `props.class` 生成节点的类名。

tree/custom-node-class

:::

## 树节点过滤

:::demo 调用 Tree 实例的 `filter` 方法过滤节点，参数即过滤关键字。 该功能需要 `filter-node-method`，其值为过滤方法。

tree/filtering

:::

## 手风琴模式

:::demo 同一层级的节点中，一次只允许展开一个。

tree/accordion

:::

## 可拖拽节点

:::demo 加上 `draggable` 后即可拖拽节点改变其父子关系与顺序。

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

命令式方法经 `ref` 或 `onReady` 回调下发（见下方「与 Vue 版 API 的差异」）。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 子组件 `<el-tree-node>` | 内部递归渲染 | 官方也只经插槽间接使用，未对外暴露 ElTreeNode 用法 |
| `render-content` 的 `h` 首参 | 无 | React 不需要渲染函数，回调直接返回 ReactNode |
| `ref` 取实例方法 | `ref`（forwardRef）或 `onReady` | forwardRef 是首选；`onReady` 是为不方便挂 ref 的场景补的等价通道 |
| default 作用域插槽 `{ node, data }` | `children` 函数 | 参数为 `{ node, data, store }` |
| empty 插槽 | `emptySlot` | 传 ReactNode |
| check / node-click 的第 4 个参数 `nodeInstance` | 不传 | React 无组件实例概念，事件参数为 (data, node, event) |
| `props.class` 返回对象 | 同样支持 | 字符串与 `{ [k]: boolean }` 两种形态都按官方语义拼类名 |

**实现说明**：DOM 结构、类名、元素层级逐条对齐官方模板（`.el-tree` / `.el-tree-node` /
`.el-tree-node__content` / `.el-tree-node__expand-icon` / `.el-tree-node__children` /
`.el-tree__empty-block` / `.el-tree__drop-indicator`），状态类
（`is-expanded` / `is-current` / `is-checked` / `is-focusable` / `is-dragging` /
`is-drop-not-allow` / `is-drop-inner`）与官方一一对应。模型层（Node / TreeStore）
的勾选联动、过滤、懒加载、拖拽算法逐行移植官方源码；驱动方式由 Vue reactive
改为「节点状态变更 -> store 广播 -> 组件重渲」。

**未实现的官方能力**：`setCheckedNodes` 传入真实 `Node` 实例的场景（本项目对外只承诺
数据对象形态，与官方文档表格一致）；`ElTreeSelect` 的 `isSelectTree` 短路（属于
tree-select 组件职责，本篇不涉及）。
