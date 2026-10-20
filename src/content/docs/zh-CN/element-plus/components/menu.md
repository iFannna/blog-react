---
title: "Menu 菜单"
description: "为网站提供导航功能的菜单。"
group: 导航
order: 60
---

# Menu 菜单

为网站提供导航功能的菜单。

如需覆盖 `el-menu` 的默认高度，可以使用：

```css
.el-menu--horizontal {
  --el-menu-horizontal-height: 100px;
}
```

## 顶栏

:::demo 顶栏菜单可用于多种场景。菜单默认是纵向的，将 `mode` 设为  `horizontal` 即可切换为横向。配合 `ElSubMenu`  可创建二级菜单，并通过 `backgroundColor`、`textColor`  与 `activeTextColor` 自定义配色。

menu/basic

:::

## 折叠

:::demo 纵向菜单可以折叠。

menu/collapse

:::

## 左右分布

:::demo 可以将菜单项分布到左右两侧。

menu/left-and-right

:::

## 浮层偏移

:::demo 子菜单设置 `popperOffset` 后会覆盖菜单的  `popperOffset`。

menu/popper-offset

:::

## 侧边栏

带子菜单的纵向菜单。

使用 `ElMenuItemGroup` 创建菜单分组，分组名称由  `title` 决定。

:::demo

menu/vertical

:::

## Menu API

### Menu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 菜单展示模式 | ^[enum]`'horizontal' \| 'vertical'` | vertical |
| collapse | 是否收起菜单（仅纵向模式） | ^[boolean] | false |
| ellipsis | 是否开启省略号收起（仅横向模式） | ^[boolean] | true |
| ellipsisIcon | 自定义省略号图标（仅横向模式且开启省略号） | ^[ReactNode] | — |
| popperOffset | 所有子菜单浮层与触发元素的间距 | ^[number] | 6 |
| defaultActive | 页面加载时激活菜单的 index | ^[string] | '' |
| defaultOpeneds | 初始展开的子菜单 index 数组 | ^[array]`string[]` | [] |
| uniqueOpened | 是否只保持一个子菜单展开 | ^[boolean] | false |
| menuTrigger | 子菜单触发方式，仅在横向模式生效 | ^[enum]`'hover' \| 'click'` | hover |
| router | 是否启用路由模式，开启后 index 作为跳转路径 | ^[boolean] | false |
| collapseTransition | 是否开启收起过渡 | ^[boolean] | true |
| popperEffect | 收起态下 tooltip 的主题 | ^[enum]`'dark' \| 'light'` / ^[string] | dark |
| closeOnClickOutside | 点击菜单外部时是否收起全部子菜单 | ^[boolean] | false |
| popperClass | 所有浮层的自定义类名 | ^[string] | — |
| popperStyle | 所有浮层的自定义样式 | ^[object]`CSSProperties` | — |
| showTimeout | 所有子菜单显示前的延时 | ^[number] | 300 |
| hideTimeout | 所有子菜单隐藏前的延时 | ^[number] | 300 |
| persistent | 浮层不活跃时是否保留 DOM | ^[boolean] | true |
| backgroundColor | 已废弃，改用 CSS 变量 `--el-menu-bg-color` | ^[string] | #ffffff |
| textColor | 已废弃，改用 CSS 变量 `--el-menu-text-color` | ^[string] | #303133 |
| activeTextColor | 已废弃，改用 CSS 变量 `--el-menu-active-color` | ^[string] | #409eff |

### Menu Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onSelect | 菜单项被激活时触发 | ^[Function]`MenuSelectEvent` |
| onOpen | 子菜单展开时触发 | ^[Function]`MenuOpenEvent` |
| onClose | 子菜单收起时触发 | ^[Function]`MenuCloseEvent` |

### Menu Slots（React children）

| 名称 | 说明 | 子标签 |
| --- | --- | --- |
| children | 自定义默认内容 | SubMenu / MenuItem / MenuItemGroup |

### Menu Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| open | 展开指定子菜单 | ^[Function]`(index: string) => void` |
| close | 收起指定子菜单 | ^[Function]`(index: string) => void` |
| handleResize | 手动触发菜单宽度重新计算 | ^[Function]`() => void` |
| updateActiveIndex | 设置激活菜单的 index | ^[Function]`(index: string) => void` |

## SubMenu API

### SubMenu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | ^[string] | — |
| popperClass | 浮层菜单的自定义类名 | ^[string] | — |
| popperStyle | 浮层菜单的自定义样式 | ^[object]`CSSProperties` | — |
| showTimeout | 展开前的延时，缺省继承根菜单 | ^[number] | — |
| hideTimeout | 收起前的延时，缺省继承根菜单 | ^[number] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| teleported | 浮层是否挂载到 body，第一层默认为 true，其余默认为 false | ^[boolean] | undefined |
| popperOffset | 浮层偏移，覆盖根菜单的 `popperOffset` | ^[number] | — |
| expandCloseIcon | 展开态且子菜单收起时的图标，需与 `expandOpenIcon` 成对传入 | ^[ReactNode] | — |
| expandOpenIcon | 展开态且子菜单展开时的图标，需与 `expandCloseIcon` 成对传入 | ^[ReactNode] | — |
| collapseCloseIcon | 收起态且子菜单收起时的图标，需与 `collapseOpenIcon` 成对传入 | ^[ReactNode] | — |
| collapseOpenIcon | 收起态且子菜单展开时的图标，需与 `collapseCloseIcon` 成对传入 | ^[ReactNode] | — |

### SubMenu Slots

| 名称 | 说明 | 子标签 |
| --- | --- | --- |
| children | 自定义默认内容 | SubMenu / MenuItem / MenuItemGroup |
| title | 自定义标题内容，React 通过 `title` prop 传入 | — |

## Menu-Item API

### Menu-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | ^[string] | — |
| route | 路由参数，开启 `router` 时使用 | ^[string] / ^[object] | — |
| disabled | 是否禁用 | ^[boolean] | false |

### Menu-Item Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onClick | 菜单项被点击时触发，参数为菜单项的注册信息 | ^[Function]`(item: MenuItemRegistered) => void` |

### Menu-Item Slots

| 名称 | 说明 |
| --- | --- |
| children | 自定义默认内容 |
| title | 自定义标题内容，React 通过 `title` prop 传入 |

## Menu-Item-Group API

### Menu-Item-Group Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题 | ^[string] | — |

### Menu-Item-Group Slots

| 名称 | 说明 | 子标签 |
| --- | --- | --- |
| children | 自定义默认内容 | MenuItem |
| title | 自定义分组标题，React 通过 `title` prop 传入 | — |

## Type Declarations

```ts
type MenuSelectEvent = (
  index: string,
  indexPath: string[],
  item: MenuItemClicked,
  routerResult?: Promise<void | NavigationFailure>
) => void

type MenuOpenEvent = (index: string, indexPath: string[]) => void

type MenuCloseEvent = (index: string, indexPath: string[]) => void

interface MenuItemRegistered {
  index: string
  indexPath: string[]
  active: boolean
}

interface MenuItemClicked {
  index: string
  indexPath: string[]
  route?: RouteLocationRaw
}
```

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `default-active` / `default-openeds` | `defaultActive` / `defaultOpeneds` | 保持非受控语义；`defaultActive` 变化时同步激活项 |
| `@select` / `@open` / `@close` | `onSelect` / `onOpen` / `onClose` | 事件改为 on 前缀 |
| 默认插槽 | `children` | — |
| `title` 具名插槽 | `title` prop（ReactNode） | SubMenu、MenuItem、MenuItemGroup 一致 |
| 图标以组件或字符串传入 | 直接传 `ReactNode` | 例如 `expandOpenIcon={<ArrowDown />}` |
| `ref` + defineExpose | `ref` + `MenuExpose` | 方法名保持一致 |
| `vue-router` 模式 | 保留 `router` prop，不做实际跳转 | 由业务侧在 `onSelect` 中处理导航 |
