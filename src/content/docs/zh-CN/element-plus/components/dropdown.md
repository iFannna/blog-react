---
title: "Dropdown 下拉菜单"
description: "向下弹出的菜单列表。"
group: 导航
order: 50
---

# Dropdown 下拉菜单

将动作或菜单折叠到下拉菜单中。

## 基础用法

悬停在下拉菜单上以展开更多操作。

:::demo 通过组件 `slot` 来设置下拉触发的元素以及需要通过具名 `slot` 为 `dropdown` 来设置下拉菜单。默认情况下，只需要悬停在触发菜单的元素上即可，无需点击也会显示下拉菜单。

dropdown/basic-usage

:::

## 位置

支持 6 个位置。

:::demo 设置 `placement` 属性，使下拉菜单出现在不同位置。

dropdown/placements

:::

## 触发对象

可使用按钮触发下拉菜单。

:::demo 设置 `split-button` 属性来让触发下拉元素呈现为按钮组，左边是功能按钮，右边是触发下拉菜单的按钮，设置为 `true` 即可。如果你想要在第三和第四个选项之间添加一个分隔符，你只需要为第四个选项添加一个 `divided` 的属性。

dropdown/triggering-element

:::

## 触发方式

可以配置点击激活或者悬停激活。

:::demo 将 `trigger` 属性设置为 click 即可，默认为 `hover`。

dropdown/how-to-trigger

:::

## 菜单隐藏方式

可以通过 `hide-on-click` 属性来配置。

:::demo 下拉菜单默认在点击菜单项后会被隐藏，将 hide-on-click 属性设置为 false 可以关闭此功能。

dropdown/menu-hiding-behavior

:::

## 指令事件

点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。

:::demo

dropdown/command-event

:::

## 下拉方法

您可以手动使用 `手动打开` 或 `手动关闭下拉菜单以打开或关闭`

:::demo

dropdown/dropdown-methods

:::

## 尺寸

Dropdown 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的尺寸。

:::demo 使用 `size` 属性配置尺寸，可选的尺寸大小有: `large`, `default` 或 `small`

dropdown/sizes

:::

## 虚拟触发^(2.11.3)

有时候我们想把 dropdown 的触发元素放在别的地方，而不需要写在一起，这时候就可以使用虚拟触发。

:::demo

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
