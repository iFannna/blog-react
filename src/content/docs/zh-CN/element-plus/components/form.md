---
title: "Form 表单组件"
description: "由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。"
group: 表单组件
order: 90
---

# Form 表单组件

由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。

## 典型表单

:::demo 包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。 每个 form 组件中都需要 form-item 字段作为输入项的容器。

form/basic-form

:::

## 行内表单

:::demo 设置 `inline` 属性可以让表单域变为行内的表单域。

form/inline-form

:::

## 对齐方式

:::demo 通过 `labelPosition` 控制标签对齐方式，FormItem 上的同名属性优先级更高； 值为空时使用 Form 的 `labelPosition`。

form/alignment

:::

## 表单校验

:::demo Form 组件提供了表单验证的功能，只需为 `rules` 属性传入约定的验证规则， 并将 `FormItem` 的 `prop` 属性设置为需校验的字段名即可。

form/validation

:::

## 自定义校验规则

:::demo 本例展示如何自定义校验规则以完成二次密码验证，并用 `statusIcon` 展示校验结果图标。自定义校验回调必须被调用；设置 `scrollToError` 后校验失败会滚动到第一个错误项。

form/custom-validation

:::

## 动态增减表单项

:::demo 除了在 Form 上一次性传递所有校验规则外，也可以动态地为单个表单字段传递或删除规则。

form/form-items

:::

## 数字类型校验

:::demo 数字校验需要先把输入值转换为数字，再交给  `type: 'number'` 规则； 官方通过 `v-model.number` 实现，这里在 `onChange` 中完成转换。

form/number-validate

:::

## 尺寸控制

:::demo Form 中所有组件都会继承 `size` 属性，FormItem 也支持单独设置 `size` 进行微调。

form/size-control

:::

## 无障碍

:::demo 当 FormItem 内只有一个输入（或关联控件）时，标签会自动关联到该输入； 当包含多个输入时，FormItem 会使用 `group` 角色， 此时需要自行通过 `aria-label` 等属性为每个输入添加辅助标签。

form/accessibility

:::

## Form API

### Form Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | ^[object]`Record<string, any>` | — |
| rules | 表单校验规则 | ^[object]`FormRules` | — |
| inline | 是否行内表单 | ^[boolean] | false |
| label-position | 标签位置，取 left / right 时需同时设置 label-width | ^[enum]`'left' \| 'right' \| 'top'` | right |
| label-width | 标签宽度，所有直接子 FormItem 继承该值，支持 `auto` | ^[string] / ^[number] | '' |
| label-suffix | 标签后缀 | ^[string] | '' |
| hide-required-asterisk | 是否隐藏必填字段标签旁的红色星号 | ^[boolean] | false |
| require-asterisk-position | 星号位置 | ^[enum]`'left' \| 'right'` | left |
| show-message | 是否显示错误信息 | ^[boolean] | true |
| inline-message | 错误信息是否显示为行内样式 | ^[boolean] | false |
| status-icon | 是否显示校验结果图标 | ^[boolean] | false |
| validate-on-rule-change | rules 变化时是否立即触发校验 | ^[boolean] | true |
| size | 表单内组件尺寸 | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — |
| disabled | 是否禁用表单内全部组件 | ^[boolean] | false |
| scroll-to-error | 校验失败时是否滚动到第一个错误项 | ^[boolean] | false |
| scroll-into-view-options | scrollIntoView 的参数 | ^[object]`ScrollIntoViewOptions` / ^[boolean] | true |
| onModelChange | React 特有：resetFields 还原后的整个 model 通过该回调交回使用方 | ^[Function]`(model) => void` | — |

### Form Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onValidate | 单个表单项校验完成后触发 | ^[Function]`(prop, isValid, message) => void` |

### Form Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | `children` |

### Form Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| validate | 校验整个表单，接收回调或返回 Promise | ^[Function]`(callback?) => Promise<boolean>` |
| validateField | 校验指定字段 | ^[Function]`(props?, callback?) => Promise<boolean>` |
| resetFields | 重置指定字段并移除校验结果 | ^[Function]`(props?) => void` |
| clearValidate | 清除指定字段的校验信息 | ^[Function]`(props?) => void` |
| scrollToField | 滚动到指定字段 | ^[Function]`(prop) => void` |
| getField | 获取某个字段的上下文 | ^[Function]`(prop) => FormItemContext \| undefined` |
| fields | 全部字段上下文 | ^[array]`FormItemContext[]` |
| setInitialValues | 设置字段初值，resetFields 会还原到这些值 | ^[Function]`(initModel) => void` |

## FormItem API

### FormItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | model 中的字段路径，可以是字符串或路径数组；校验与重置时必填 | ^[string] / ^[array]`string[]` | — |
| label | 标签文本 | ^[string] | — |
| label-position | 标签位置，省略时继承 Form | ^[enum]`'left' \| 'right' \| 'top' \| ''` | '' |
| label-width | 标签宽度，支持 `auto` | ^[string] / ^[number] | — |
| required | 是否必填，省略时由校验规则决定 | ^[boolean] | undefined |
| rules | 校验规则 | ^[object]`FormItemRule` / ^[array]`FormItemRule[]` | — |
| error | 手动设置错误信息，设置后立即显示该错误；清空后恢复 | ^[string] | — |
| show-message | 是否显示错误信息 | ^[boolean] | true |
| inline-message | 错误信息是否显示为行内样式 | ^[boolean] | undefined |
| size | 表单项内组件尺寸 | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — |
| for | 同原生 label 的 for | ^[string] | — |
| html-for | `for` 的 React 惯用写法，与 `for` 等价 | ^[string] | — |
| validate-status | 校验状态 | ^[enum]`'' \| 'error' \| 'validating' \| 'success'` | — |

### FormItemRule

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | 校验触发时机；省略时任意 trigger 都会执行 | ^[enum]`'blur' \| 'change'` / ^[array]`string[]` | — |

### FormItem Events

无。

### FormItem Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 表单项内容 | `children` |
| label | 自定义标签内容，参数为当前标签文本 | `labelSlot: (label) => ReactNode` |
| error | 自定义错误内容，参数为错误信息 | `errorSlot: (error) => ReactNode` |

### FormItem Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| size | 表单项当前尺寸 | ^[string] |
| validateMessage | 当前校验错误信息 | ^[string] |
| validateState | 当前校验状态 | ^[enum]`'' \| 'error' \| 'validating' \| 'success'` |
| validate | 校验本项 | ^[Function]`(trigger, callback?) => Promise<boolean>` |
| resetField | 重置本项并移除校验结果 | ^[Function]`() => void` |
| clearValidate | 清除本项校验状态 | ^[Function]`() => void` |
| setInitialValue | 设置本项初值，resetField 会还原到该值 | ^[Function]`(value) => void` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 无双向绑定语法 |
| Form 的 `model` 就地修改 | `model` + `onModelChange` | React props 不可变，resetFields 还原后的整个 model 通过回调交回使用方 |
| `FormRules<typeof form>` 泛型 | `FormRules` | 当前类型为 `Record<string, FormItemRule \| FormItemRule[]>`，不做字段路径泛型推导 |
| `for` | `htmlFor` / `for` | React 推荐 `htmlFor`，同时保留官方同名属性 `for` |
| `label` 插槽 | `labelSlot` 函数属性 | 传 `(label) => ReactNode` |
| `error` 插槽 | `errorSlot` 函数属性 | 传 `(error) => ReactNode` |
| `<el-option>` 子节点 | `options` 数组 | 本项目 Select 是数据驱动形态 |
| `ref` 上的实例方法 | `ref` + `useImperativeHandle` | 暴露方法与官方 defineExpose 一一对应 |

**实现说明**：

- 校验引擎使用与官方相同的 `async-validator`（`^4.2.5`），规则语义、默认错误文案、
  `firstFields: true` 的「只报第一条」行为与官方一致；支持 `required` / `min` / `max` /
  `type` / `pattern` / `validator` 以及 `trigger` 为字符串或数组。
- `validateState` 到「错误是否露出」之间官方有 100ms 的 `refDebounced`，
  这里用等价的定时器实现，避免输入过程中错误信息闪动。
- 尺寸 / 禁用状态按官方优先级继承：组件自身 > FormItem > Form > 全局配置（ConfigProvider）。
  已接入该上下文的组件包括 Input、InputNumber、Select、Cascader、Checkbox、Radio、
  Switch、Rate、Slider、DatePicker 等。
- `label-width="auto"` 由 `FormLabelWrap` 量出各标签宽度并注册给 Form，
  Form 取最大值后下发，剩余宽度转成对侧 margin 把内容推齐，与官方算法一致。
- `validate-event` 由输入类组件消费：Input / Select / Cascader / ColorPicker / InputTag 等
  在值变化或失焦时调用 `formItem.validate('change' | 'blur')`，默认开启。
- 动态增减表单项：FormItem 按 `prop` 路径注册到 Form；`prop` 变化时会释放旧路径的初值缓存，
  卸载时缓存初值，重新挂载后可被 resetFields 恢复。
- `status-icon` 的反馈图标由具体控件渲染（当前 Input、Select 已实现），
  FormItem 只负责添加 `el-form-item--feedback` 类名。
- 必填星号、星号位置、标签后缀、行内消息、隐藏错误信息等均通过官方类名实现。

**已知限制**：

- `validate-on-rule-change` 依赖 `rules` 引用变化触发；React 没有深层响应式，
  就地修改同一个 rules 对象不会触发自动校验。
- 未提供 `onModelChange` 时，`resetFields` 仍会清除校验状态，但无法更新外部 model。
- `FormRules` 是简化类型；嵌套字段可直接用点号路径或路径数组，但没有字段级类型提示。
- `status-icon` 是否显示图标取决于控件自身实现，未接入反馈图标的控件只会有校验状态类名。
