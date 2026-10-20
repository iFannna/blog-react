---
title: "TimePicker 时间选择器"
description: "用于选择或输入时间。"
group: 表单组件
order: 210
---

# TimePicker 时间选择器

用于选择或输入时间。

## 任意时间

:::demo 默认可以用鼠标滚轮选择时间，设置 `arrowControl` 后改用上下箭头按钮。

time-picker/basic

:::

## 限制时间范围

:::demo 通过 `disabledHours`、`disabledMinutes`、 `disabledSeconds` 限制可选时间。

time-picker/basic-range

:::

## 任意时间范围

:::demo 添加 `isRange` 即可选择时间范围，范围模式同样支持  `arrowControl`。

time-picker/range

:::

## TimePicker API

### TimePicker Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，范围模式传长度为 2 的数组 | ^[Date] / ^[array]\`[Date, Date]\` / ^[number] / ^[string] | — |
| is-range | 是否选择时间范围 | ^[boolean] | false |
| format | 输入框显示格式 | ^[string] | HH:mm:ss |
| value-format | 绑定值格式，省略时绑定值是 Date | ^[string] | — |
| placeholder | 非范围模式的占位文本 | ^[string] | — |
| start-placeholder | 范围模式起始占位文本 | ^[string] | — |
| end-placeholder | 范围模式结束占位文本 | ^[string] | — |
| range-separator | 范围分隔符 | ^[string] | '-' |
| disabled | 是否禁用 | ^[boolean] | false |
| readonly | 是否只读 | ^[boolean] | false |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| size | 尺寸 | ^[enum]\`'large' \| 'default' \| 'small'\` | — |
| arrow-control | 是否用箭头按钮选择时间 | ^[boolean] | false |
| default-value | 面板默认时间 | ^[Date] / ^[array]\`[Date, Date]\` | — |
| disabled-hours | 不可选的小时 | ^[Function]\`(role: string, comparingDate?: Day) => number[]\` | — |
| disabled-minutes | 不可选的分钟 | ^[Function]\`(hour: number, role: string, comparingDate?: Day) => number[]\` | — |
| disabled-seconds | 不可选的秒 | ^[Function]\`(hour: number, minute: number, role: string, comparingDate?: Day) => number[]\` | — |
| id / name | 原生 id / name，范围模式可传数组 | ^[string] / ^[array] | — |
| aria-label | 同原生 aria-label | ^[string] | — |
| tabindex | 输入框 tabindex | ^[string] / ^[number] | 0 |
| prefix-icon | 自定义前缀图标 | ^[ReactNode] | Clock |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| popper-class | 浮层自定义类名 | ^[string] | — |
| popper-style | 浮层自定义样式 | ^[string] / ^[object] | — |
| teleported | 浮层是否挂载到 body | ^[boolean] | true |
| placement | 浮层位置 | ^[enum]\`Placement\` | bottom |
| fallback-placements | 翻转兜底位置列表 | ^[array] | ['bottom','top','right','left'] |
| save-on-blur | 失焦时未选值是否自动填入当前时间 | ^[boolean] | true |
| automatic-dropdown | 聚焦输入框时是否自动弹出面板 | ^[boolean] | true |
| empty-values | 空值集合 | ^[array] | — |
| value-on-clear | 清空时返回的值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### TimePicker Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化（对应 v-model） | ^[Function]\`(value: Date \\| [Date, Date] \\| string \\| number \\| null) => void\` |
| onValueChange | 面板关闭时，绑定值相对打开面板时发生变化（对应 change）；清空时无条件触发 | ^[Function]\`(value: Date \\| [Date, Date] \\| string \\| number \\| null) => void\` |
| visibleChange | 面板显隐变化（对应 visible-change） | ^[Function]\`(visible: boolean) => void\` |
| focus / blur | 输入框聚焦 / 失焦 | ^[Function]\`(event: FocusEvent) => void\` |
| clear | 点击清空图标 | ^[Function]\`() => void\` |

事件 prop 在 React 侧统一写成 \`onXxx\`：\`onChange\` / \`onValueChange\` / \`onVisibleChange\` / \`onFocus\` / \`onBlur\` / \`onClear\`。

### TimePicker Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 让输入框获得焦点 | ^[Function]\`() => void\` |
| blur | 让输入框失焦 | ^[Function]\`() => void\` |
| handleOpen | 打开面板 | ^[Function]\`() => void\` |
| handleClose | 关闭面板 | ^[Function]\`() => void\` |

通过 \`ref\` 传入即可取得上述方法。

### 子组件

| 组件 | 对应官方 | 说明 |
| --- | --- | --- |
| TimePanel | panel-time-pick.vue | 单点时间面板 |
| TimeRangePanel | panel-time-range.vue | 范围时间面板 |
| TimeSpinner | basic-time-spinner.vue | 时 / 分 / 秒三列选择器 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\` | \`value\` + \`onChange\` | React 惯用写法 |
| \`change\` 事件 | \`onValueChange\` | 避免与绑定值回调的 \`onChange\` 重名 |
| \`visible-change\` 事件 | \`onVisibleChange\` | 事件名转驼峰 |
| \`focus\` / \`blur\` / \`clear\` 事件 | \`onFocus\` / \`onBlur\` / \`onClear\` | 同名透传 |
| \`ref\` 上的 focus/blur/handleOpen/handleClose | \`ref.handleOpen()\` 等 | React 用 useImperativeHandle |
| \`disabled-hours\` 等回调里的 \`Dayjs\` 参数 | 自定义 \`Day\` 类 | 本项目未引入 dayjs，见下节说明 |
| \`prefix-icon\` / \`clear-icon\` 传组件 | 传 \`ReactNode\` | React 无动态组件，直接传元素 |
| \`change\` 事件参数 | \`onValueChange\` | 与官方一致，为按 value-format 格式化后的绑定值 |

**实现说明**：DOM 结构与官方一致 —— 触发区是 \`.el-date-editor.el-date-editor--time\`
（范围模式 \`.el-range-editor.el-date-editor--timerange\`），浮层是 \`.el-picker__popper\`
里的 \`.el-time-panel\` / \`.el-time-range-picker\`。三列选择器复用本项目的 \`ElScrollbar\`，
滚动位置换算、\`buildTimeList\`、\`makeList\`、available-time 逐级收敛逻辑均与官方逐行对齐。

**与官方的一处行为差异**：官方用 \`useFocusController\` + Tooltip 的延迟 show 处理
「聚焦打开面板」。react 的 Tooltip 没有这层延迟，本组件改为浮层不绑定任何触发方式、
完全由自身驱动显隐，并用「mousedown 落在面板内则不处理 blur」等效官方
\`beforeBlur\` 里 \`isFocusInsideContent\` 的判断。

**未实现的官方能力**：见下节。

## 未实现的官方能力

| 官方能力 | 说明 |
| --- | --- |
| \`popper-options\` | 未透传：本项目 popper 的修饰符由 \`use-popper\` 统一生成，未开放逐组件覆写 |
| \`name\` | 范围模式传数组时两个输入框都带；传字符串时仅起始输入框带（官方文档类型为 string，内部却按数组取下标） |
| 面板过渡动画 / \`persistent\` | 单点面板用 Tooltip 默认过渡，范围面板为条件渲染，均不含官方 \`el-zoom-in-top\` / 保留 DOM 行为 |
| \`date-format\` / \`time-format\` | 属于 date-picker 的共用属性，TimePicker 用不到，未声明 |
| \`label\` | 官方已废弃，仅作为 \`aria-label\` 的别名；本实现直接使用 \`aria-label\`，未再提供废弃入口 |
| \`show-now\` / \`show-confirm\` / \`show-footer\` | 时间面板没有这些开关，官方也仅 date-picker 使用 |
| 面板键盘全量行为 | 仅实现方向键（左/右切列、上/下增减）与 Esc/Enter；官方 \`handleKeydownInput\` 里针对 date-picker 的其余分支未移植 |
| \`Dayjs\` 插件生态 | 未引入 dayjs，改用自实现的 \`Day\` 类，只覆盖 time-picker 用到的 token（HH/mm/ss/hh/A/a/YYYY/MM/DD 等）；\`format\` 传其它 token 会原样输出 |
