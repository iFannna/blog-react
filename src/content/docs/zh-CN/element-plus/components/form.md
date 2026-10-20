---
title: "Form 表单组件"
description: "由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。"
group: 表单组件
order: 90
---

# Form 表单

表单包含 `input`、`radio`、`select`、`checkbox` 等需要用户输入的组件。使用表单，您可以收集、验证和提交数据。

:::tip

Form 组件已经从 2. x 的 Float 布局升级为 Flex 布局。

:::

## 典型表单

最基础的表单包括各种输入表单项，比如`input`、`select`、`radio`、`checkbox`等。

在每一个 `form` 组件中，你需要一个 `form-item` 字段作为输入项的容器，用于获取值与验证值。

:::tip

[W3C](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2) 标准定义：

当一个表单中只有一个单行文本输入字段时， 浏览器应当将在此字段中按下 Enter （回车键）的行为视为提交表单的请求。 如果希望阻止这一默认行为，可以在 `<el-form>` 标签上添加 `@submit.prevent`。

:::

:::demo

form/basic-form

:::

## 行内表单

当垂直方向空间受限且表单较简单时，可以在一行内放置表单。

通过设置 `inline` 属性为 `true` 可以让表单域变为行内的表单域。

:::demo

form/inline-form

:::

## 对齐方式

根据你们的设计情况，来选择最佳的标签对齐方式。

您可以分别设置 `el-form-item` 的`label-position` ^(2.7.7). 如果值为空, 则会使用 `el-form`的`label-position`。

通过设置 `label-position` 属性可以改变表单域标签的位置，可选值为 `top`、`left`, 当设为 `top` 时标签会置于表单域的顶部

:::demo

form/alignment

:::

## 表单校验

Form 组件允许你验证用户的输入是否符合规范，来帮助你找到和纠正错误。

`Form` 组件提供了表单验证的功能，只需为 `rules` 属性传入约定的验证规则，并将 `form-Item` 的 `prop` 属性设置为需要验证的特殊键值即可。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

:::demo

form/validation

:::

## 自定义校验规则

这个例子中展示了如何使用自定义验证规则来完成密码的二次验证。

本例还使用`status-icon`属性为输入框添加了表示校验结果的反馈图标。

:::tip

自定义的校验回调函数必须被调用。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

:::

:::demo

form/custom-validation

:::

## 添加/删除表单项

除了一次通过表单组件上的所有验证规则外. 您也可以动态地通过验证规则或删除单个表单字段的规则。

:::demo

form/form-items

:::

## 数字类型验证

数字类型的验证需要在 `v-model` 处加上 `.number` 的修饰符，这是 Vue 自身提供的用于将绑定值转化为 number 类型的修饰符。

:::tip

当一个 `el-form-item` 嵌套在另一个 `el-form-item` 中时，其标签宽度将为 `0`。如果需要可以为 `el-form-item` 单独设置 `label-width` 属性。

:::

:::demo

form/number-validate

:::

## 尺寸控制

表单中的所有子组件都继承了该表单的 `size` 属性。同样，form-item 也有一个 `size` 属性。

如果希望某个表单项或某个表单组件的尺寸不同于 Form 上的 `size` 属性，直接为这个表单项或表单组件设置自己的 size 属性即可。

:::demo

form/size-control

:::

## 无障碍

当在 `el-form-item` 内只有一个输入框（或相关的控制部件，如选择或复选框），表单项的标签将自动附加在那个输入框上。如果 `el-form-item`内有多个 input，则表单项会被设置成 [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) [组](https://www.w3.org/TR/wai-aria/#group) 的 role。在这种情况下，需要手动给每个 input 指定访问标签。

:::demo

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
