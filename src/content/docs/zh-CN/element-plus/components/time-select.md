---
title: "TimeSelect 时间选择器"
description: "用于选择或输入时间。"
group: 表单组件
order: 220
---

# TimeSelect 时间选择器

用于选择或输入时间。

可用时间范围为 00:00 到 23:59。

## 固定时间点

:::demo 通过 `start`、`end`、`step` 指定起始时间、结束时间与步长， 为用户提供一组固定可选时间。

time-select/basic

:::

## 时间格式

:::demo 使用 `format` 控制时间格式。

time-select/time-formats

:::

## 固定时间范围

:::demo 若先选中起始（或结束）时间，另一个选择器的选项状态会随之变化，通过 `min-time` 与 `max-time` 联动。

time-select/time-range

:::

## TimeSelect API

### TimeSelect Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[string] / ^[null] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| include-end-time | 是否把 `end` 也作为可选项 | ^[boolean] | false |
| size | 输入框尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | default |
| placeholder | 占位文本，缺省取语言包的 `el.select.placeholder` | ^[string] | — |
| name | 同原生 input 的 name | ^[string] | — |
| id | 原生 id，供 FormItem 的 label 关联 | ^[string] | — |
| effect | 主题，可选 `dark` / `light` | ^[string] / ^[enum]`'dark' \| 'light'` | light |
| prefix-icon | 自定义前缀图标 | ^[ReactNode] | Clock |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| start | 起始时间 | ^[string] | 09:00 |
| end | 结束时间 | ^[string] | 18:00 |
| step | 时间步长 | ^[string] | 00:30 |
| min-time | 最小时间，之前的时间项禁用 | ^[string] | — |
| max-time | 最大时间，之后的时间项禁用 | ^[string] | — |
| format | 时间格式，支持 dayjs 的 HH/H/hh/h/mm/m/ss/s/A/a 与 [] 字面量 | ^[string] | HH:mm |
| empty-values | 空值集合，见 ConfigProvider | ^[array] | — |
| value-on-clear | 清空时返回的值，见 ConfigProvider | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| popper-class | 下拉的自定义类名 | ^[string] | '' |
| popper-style | 下拉的自定义样式 | ^[string] / ^[object] | — |
| placement | 下拉位置（React 补充） | ^[enum]`Placement` | bottom-start |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### TimeSelect Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化（含清空，清空时收到 `value-on-clear`，缺省为 null） | ^[Function]`(value: string \| null) => void` |
| onBlur | 输入框失焦 | ^[Function]`(event: FocusEvent) => void` |
| onFocus | 输入框聚焦 | ^[Function]`(event: FocusEvent) => void` |
| onClear | 点击清空图标 | ^[Function]`() => void` |

### TimeSelect Exposes

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 让输入框聚焦 | ^[Function]`() => void` |
| blur | 让输入框失焦 | ^[Function]`() => void` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法，清空同样经 `onChange` 回传 |
| `@change` | `onChange` | 官方把 update:model-value 与 change 分别抛出，这里合一 |
| `@clear` | `onClear` | 清空时除 `onChange` 外额外回调 |
| `prefix-icon` / `clear-icon` 传组件 | 传 `ReactNode` | React 无动态组件，直接传元素 |
| `format` 走 dayjs | 内置等价的 token 格式化 | 项目未引入 dayjs，见「未实现的官方能力」 |

**实现说明**：官方 `ElTimeSelect` 是把时间列表交给 `ElSelect`（打开 `filterable` +
`default-first-option` + prefix 插槽）渲染的薄封装；本实现按官方 2.14 的
`el-select` DOM 结构（`.el-select__wrapper` / `.el-select__selection` /
`.el-select__prefix` / `.el-select-dropdown__item`）直接落地，下拉复用
`ElPopperContent` + `ElScrollbar`，选项列表、禁用比较（min-time / max-time）、
选中高亮、键盘导航（上下键、Home / End / PageUp / PageDown、Enter、Esc）、
default-first-option 与输入过滤均按官方行为实现；ARIA 也按官方补齐
（`role="combobox"` / `listbox` / `option`、`aria-expanded`、`aria-controls`、
`aria-activedescendant`、`aria-selected` / `aria-disabled`）。

**未实现的官方能力**：

- `format` 只覆盖 dayjs 时间范围内的 token（`H/HH/h/hh/m/mm/s/ss/A/a` 与 `[]` 字面量），
  `YYYY`、`D`、`Z`、时区偏移等日期级 token 未实现。
- 语言包 `meridiem`：官方取 dayjs locale 的 12 小时制文案，这里以「小时 < 12 为 AM」
  近似；中文语言包用「上午/下午」，与官方 zh-cn 文案一致。
- 官方 `ElTimeSelect` 委托 `ElSelect` 因而顺带具备的 `empty-values` /
  `value-on-clear` 全局配置回退已实现，但 `teleported` / `append-to` /
  `popper-options` / `offset` 等 ElSelect 透传属性未暴露（下拉固定内联渲染于
  触发器旁，`fallbackPlacements` 固定为官方默认值）。
- 官方 `ElTimeSelect` 未暴露 `automatic-dropdown`，这里同样不提供；`editable`
  对应 ElSelect 的 `filterable`，关闭后不渲染过滤输入、悬停项回到当前选中项。
- `size`：官方把尺寸透传给 ElSelect，由 `.el-select--large` / `.el-select--small`
  调整内边距与行高；这里已按同一套类名实现，但未验证过 `large` / `small` 下的图标与
  清空按钮排布。
- `name`：已透传到原生 input，但未参与表单序列化校验（官方 `ElSelect` 同样只是透传属性）。
- 未实现 `ElSelect` 的 `persistent`（下拉关闭后保留 DOM）与过渡动画
  `el-zoom-in-top`：React 侧下拉为条件渲染，无进出场过渡。
- 官方 `prefix-icon` 默认取 `@element-plus/icons-vue` 的 `Clock`；本实现已内置
  同名图标，但 `clear-icon` / `prefix-icon` 传字符串组件名的能力未实现（React 无动态组件）。
