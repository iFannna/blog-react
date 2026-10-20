---
title: "Autocomplete 自动补全"
description: "根据当前输入提供推荐的提示项。"
group: 表单组件
order: 10
---

# Autocomplete 自动补全

根据当前输入提供推荐的提示项。

## 基础用法

:::demo `fetchSuggestions` 是返回建议的方法，示例中  `querySearch(queryString, cb)` 准备好数据后通过  `cb(data)` 返回给 Autocomplete。

autocomplete/autocomplete

:::

## 自定义模板

:::demo 通过 `renderItem` 自定义建议项的展示，参数为建议对象。

autocomplete/autocomplete-template

:::

## 远程搜索

:::demo 从服务端搜索数据，建议项异步返回。

autocomplete/remote-search

:::

## 自定义加载

:::demo 通过 `loading` 覆盖加载内容。

autocomplete/custom-loading

:::

## 自定义头部与底部

:::demo 通过 `header` 与 `footer` 自定义下拉的头部和底部内容。

autocomplete/custom-header-footer

:::

## Autocomplete API

### Autocomplete Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[string] / ^[number] | '' |
| placeholder | 占位文本 | ^[string] | — |
| clearable | 是否可清空 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| read-only | 原生 readonly | ^[boolean] | false |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| name | 同原生 input 的 name | ^[string] | — |
| aria-label | 原生 aria-label | ^[string] | — |
| value-key | 显示与回填用的字段名 | ^[string] | value |
| debounce | 输入防抖延迟（毫秒） | ^[number] | 300 |
| placement | 下拉方位 | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | bottom-start |
| fetch-suggestions | 拉取建议，返回数组或调用 cb | ^[array] / ^[Function]`(queryString, callback) => void` | — |
| trigger-on-focus | 聚焦时是否拉取建议 | ^[boolean] | true |
| select-when-unmatched | 无匹配时回车是否派发 select | ^[boolean] | false |
| hide-loading | 远程搜索是否隐藏 loading 图标 | ^[boolean] | false |
| popper-class | 下拉附加类名 | ^[string] | '' |
| popper-style | 下拉附加样式 | ^[string] / ^[object] | — |
| popper-options | popper.js 配置 | ^[object] | {} |
| show-arrow | 下拉是否显示箭头 | ^[boolean] | true |
| teleported | 下拉是否挂在 body 上 | ^[boolean] | true |
| append-to | 下拉的挂载目标（选择器或元素） | ^[string] / ^[HTMLElement] | — |
| highlight-first-item | 是否默认高亮第一条 | ^[boolean] | false |
| fit-input-width | 下拉宽度是否与输入框一致 | ^[boolean] | false |
| loop-navigation | 键盘导航是否回绕 | ^[boolean] | true |
| prefix / suffix / prepend / append | Input 前后缀内容 | ^[ReactNode] | — |

### Autocomplete Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 输入值变化 | ^[Function]`(value: string \| number) => void` |
| onValueChange | 失焦或回车时触发 | ^[Function]`(value: string \| number) => void` |
| onSelect | 点击某条建议 | ^[Function]`(item: Record<string, unknown>) => void` |
| onFocus | 输入框聚焦 | ^[Function]`(event: FocusEvent) => void` |
| onBlur | 输入框失焦 | ^[Function]`(event: FocusEvent) => void` |
| onClear | 点击清空图标 | ^[Function]`() => void` |

### Autocomplete Slots

| 插槽名 | 说明 | React 对应 |
| --- | --- | --- |
| default | 自定义建议项 | `renderItem(item)` |
| header | 下拉顶部内容 | `header` |
| footer | 下拉底部内容 | `footer` |
| loading | 覆盖加载内容 | `loading` |
| prefix / suffix / prepend / append | Input 前后缀 | 同名 prop |

### Autocomplete Exposes

通过 `ref` 拿到实例，暴露 `focus` / `blur` / `close` / `handleSelect` /
`handleKeyEnter` / `highlight` / `getData`，以及只读的 `activated`、
`loading`、`highlightedIndex`、`suggestions`（官方是 Ref，这里用 getter 暴露当前值）。
官方 `inputRef` / `popperRef` 对应为 `input`（原生 input 元素）与 `popper`（浮层容器元素）。
