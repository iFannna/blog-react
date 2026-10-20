---
title: "Dropdown 下拉菜单"
description: "向下弹出的菜单列表。"
group: 导航
order: 50
---

# Dropdown 下拉菜单

向下弹出的菜单列表。

## 基础用法

:::demo 通过 `menu` 传入菜单，默认鼠标悬停触发；触发元素由 `children` 提供。

dropdown/basic-usage

:::

## 弹出位置

:::demo 通过 `placement` 设置菜单出现的位置。

dropdown/placements

:::

## 触发元素

:::demo `splitButton` 把按钮分为两半：左半触发 `onButtonClick`，右半展开菜单。

dropdown/triggering-element

:::

## 触发方式

:::demo 通过 `trigger` 设置 hover、click 或 contextmenu。

dropdown/how-to-trigger

:::

## 菜单隐藏行为

:::demo 默认点击菜单项后关闭；设置 `hideOnClick` 为 `false` 可保持菜单打开。

dropdown/menu-hiding-behavior

:::

## Command 事件

:::demo 菜单项的 `command` 会传给 `onCommand`， 禁用项不会触发。

dropdown/command-event

:::

## Dropdown 方法

:::demo 通过 ref 上的 `handleOpen` / `handleClose` 主动控制菜单。

dropdown/dropdown-methods

:::

## 尺寸

:::demo 通过 `size` 设置 `large`、`default` 或 `small`。

dropdown/sizes

:::

## 虚拟触发

:::demo `virtualTriggering` + `virtualRef` 让菜单出现在任意坐标或元素旁。

dropdown/virtual-trigger

:::

## Dropdown API

### Dropdown Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| menu | 菜单内容，即 ElDropdownMenu | ^[ReactElement] | — |
| trigger | 触发方式，可传数组组合 | ^[enum]`'click' \| 'hover' \| 'contextmenu'` / ^[array] | hover |
| trigger-keys | 键盘触发键 | ^[array]`string[]` | — |
| placement | 弹出位置 | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | bottom |
| effect | 主题 | ^[enum]`'dark' \| 'light'` | light |
| split-button | 是否使用分裂按钮 | ^[boolean] | false |
| type | 按钮类型，仅 splitButton 时有效 | ^[string] | — |
| size | 尺寸，同时作用于分裂按钮 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| hide-on-click | 点击菜单项后是否关闭 | ^[boolean] | true |
| disabled | 是否禁用 | ^[boolean] | false |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| show-timeout | hover 触发的显示延迟 | ^[number] | 150 |
| hide-timeout | hover 触发的隐藏延迟 | ^[number] | 150 |
| max-height | 弹层最大高度 | ^[string] / ^[number] | — |
| role | 弹层 ARIA role | ^[enum]`'dialog' \| 'grid' \| 'group' \| 'listbox' \| 'menu' \| 'navigation' \| 'tooltip' \| 'tree'` | menu |
| tabindex | 触发元素的 tabindex | ^[number] / ^[string] | 0 |
| popper-class / popper-style | 弹层类名 / 样式 | ^[string] / ^[object] | — |
| teleported | 是否挂载到 appendTo | ^[boolean] | true |
| append-to | 挂载目标 | ^[string] / ^[HTMLElement] | — |
| persistent | 不可见时是否保留 DOM | ^[boolean] | true |
| virtual-triggering | 是否启用虚拟触发 | ^[boolean] | false |
| virtual-ref | 虚拟触发参照物 | ^[HTMLElement] / ^[object] | — |
| visible | 受控显示状态 | ^[boolean] | — |
| z-index | 层级 | ^[number] | — |

### Dropdown Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 触发元素，必须是可接收事件的元素 | `children` |
| dropdown | 菜单内容，通常是 ElDropdownMenu | `menu` 属性 |

### Dropdown Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCommand | 点击菜单项 | ^[Function]`(command: unknown) => void` |
| onButtonClick | 分裂按钮左半部分点击 | ^[Function]`(event: MouseEvent) => void` |
| onVisibleChange | 显隐状态变化 | ^[Function]`(visible: boolean) => void` |

### Dropdown Exposes

| 方法 | 说明 |
| --- | --- |
| handleOpen() | 打开菜单 |
| handleClose() | 关闭菜单 |
| handleToggle() | 切换菜单显隐 |

### DropdownMenu

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 菜单项列表 | `children` |

### DropdownItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| command | 指令，点击时传给 onCommand | ^[string] / ^[number] / ^[object] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| divided | 是否显示分割线 | ^[boolean] | false |
| icon | 图标 | ^[ReactNode] | — |

### DropdownItem Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 菜单项内容 | `children` |
| icon | 自定义图标，会覆盖 icon 属性 | `icon` 属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="dropdown">` | `menu` 属性 | 传 ElDropdownMenu |
| `@command` | `onCommand` | — |
| `@click`（分裂按钮） | `onButtonClick` | 语义更明确 |
| `v-model:visible` | `visible` + `onVisibleChange` | React 惯用写法 |
| `v-dropdown` 指令 | `virtualTriggering` + `virtualRef` | 用元素 ref 或虚拟矩形 |

**实现说明**：关键参数与官方一致：

- popperClass 为 `el-dropdown__popper` + 用户类名
- `fallbackPlacements` 限定为 `['bottom', 'top']`（官方在模板里写死）
- 通过 `pure` 去掉默认内边距，由菜单自己控制
- hover 触发时使用 `showTimeout` / `hideTimeout`，其它触发方式延迟为 0
- 浮层动画为 `el-zoom-in-top`

**未实现的官方能力**：`button-props`、`popper-options`、
菜单的键盘方向键导航（依赖 RovingFocusGroup）。
