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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法；多选时 value 为数组 |
| `treeRef` / `selectRef` | `onReady` | React 用回调下发内部 ElTree 实例；select 实例未暴露 |
| `@visible-change` | `onVisibleChange` | 受控 `visible` 时仍需外部回写 |
| `@remove-tag` | `onRemoveTag` | 参数为被移除标签的值 |
| `@focus` / `@blur` | `onFocus` / `onBlur` | 参数为原生焦点事件 |
| `#default` 作用域插槽 | `children` 函数 prop | `({ node, data, store }) => ReactNode` |
| `#empty` / `#prefix` / `#tag` 等插槽 | 未实现 | 仅实现 default 插槽 |
| `teleported` / `append-to` | 未实现 | 浮层就地渲染，不传送到 body |
| `popper-options` / `fallback-placements` / `show-arrow` | 未实现 | 未接 Popper，绝对定位跟随触发器 |
| `automatic-dropdown` / `reserve-keyword` | 未实现 | — |

**实现说明**：组件结构对齐官方 2.14 的新版 DOM —— `.el-select > .el-select__wrapper >
.el-select__selection`，下拉为 `.el-select__popper.el-tree-select__popper >
.el-select-dropdown > .el-select-dropdown__wrap > .el-select-dropdown__list`，
树节点内容外层套 `.el-select-dropdown__item`（对应官方 TreeSelectOption）。
下拉用绝对定位跟随触发器，未走 Popper 的翻转策略，与同目录的 `ElSelect` 保持一致；
下拉在收起时保留挂载（`display: none`），以维持树的展开与勾选状态。

## 未实现的官方能力

- **未实现** `selectRef` / 依赖 select 实例的方法：官方经 selectRef 暴露 `focus` / `blur` / `selectedLabel`，
  React 版内部自行渲染 select 外壳、没有 ElSelect 实例，因此这些方法未提供。
- **未实现** `collapse-tags` / `collapse-tags-tooltip` / `max-collapse-tags`：多选标签固定全部展开，不做「+N」折叠与悬浮提示。
- **未实现** `max-collapse-tags` 相关的 tagTooltip 与 `tag-type` / `tag-effect` / `tag-style` 自定义：标签固定为 `info` 主题的 light 样式。
- **未实现** `allow-create` / `filter-method` 的远程重建语义之外的自定义选项创建：官方可创建新条目，这里仅支持重建 data。
- **未实现** `multiple-limit`：多选没有数量上限。
- **未实现** `draggable` 相关事件的透传：`onNodeDragStart` / `onNodeDrop` 等已由 ElTree 支持，
  但本组件未额外接线，直接透传即可，未在文档示例中演示。
- **未实现** 键盘在树节点间上下导航（官方把方向键事件从 select 转发到树的节点聚焦）：
  仅支持 ESC 收起、Enter / Space 切换展开。
- **未实现** `check-descendants` 与 `lazy` 组合下的完整勾选联动细节：`checkDescendants` 已透传给 ElTree，
  但本组件的 onCheck 映射未针对该组合做特殊处理。
