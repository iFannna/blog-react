---
title: "Drawer 抽屉"
description: "有些对话框要提供额外的操作，但保留当前页面状态，Drawer 就是这样的组件。"
group: 反馈组件
order: 30
---

# Drawer 抽屉

有些时候, `Dialog` 组件并不满足我们的需求, 比如你的表单很长, 亦或是你需要临时展示一些文档, `Drawer` 拥有和 `Dialog` 几乎相同的 API, 在 UI 上带来不一样的体验.

:::tip
在 Vue 3 之后的版本 v-model 可以用于任何一个组件，`visible.sync` 已被移除，请使用 `v-model="visibilityBinding"` 来控制抽屉组件的显示和隐藏状态。

:::

## 基础用法

呼出一个临时的侧边栏, 可以从多个方向呼出

:::demo 你必须像 `Dialog`一样为 `Drawer` 设置 `model-value` 属性来控制 `Drawer` 的显示与隐藏状态，该属性接受一个 `boolean` 类型。 `Drawer` 包含三部分: `title` & `body` & `footer`, 其中 `title` 是一个具名 slot, 你还可以通过 `title` 属性来设置标题, 默认情况下它是一个空字符串, 其中 `body` 部分是 `Drawer` 组件的主区域, 它包含了用户定义的主要内容. footer和title用法一致, 用来显示页脚信息. 当 `Drawer` 打开时，默认设置是**从右至左**打开 **30%** 浏览器宽度。你可以通过传入对应的 `direction` 和 `size` 属性来修改这一默认行为。下面一个示例将展示如何使用 `before-close` API，更多详细用法请参考页面底部的 API 部分。

drawer/basic-usage

:::

## 不添加 Title

当你不需要标题的时候，你可以将它移除。

:::demo 通过设置 `with-header` 属性为 **false** 来控制是否显示标题。如果你的应用需要具备可访问性，请务必设置好 `title`。

drawer/no-title

:::

## 自定义内容

像 `Dialog` 组件一样，`Drawer` 也可以用来显示多种不同的交互。

:::demo

drawer/customization-content

:::

## 自定义头部

`header` 可用于自定义显示标题的区域。为了保持可用性，除了使用此插槽外，使用 `title` 属性，或使用 `titleId` 插槽属性来指定哪些元素应该读取为抽屉标题。

:::demo

drawer/customization-header

:::

## 可调整抽屉^(2.11.0)

尝试拖动边缘部分。

:::demo 设置`resizable`属性为`true`以做到拖拽

drawer/resizable

:::

## 嵌套抽屉

你可以像 `Dialog` 一样拥有多层嵌套的 `Drawer`

:::demo 如果你需要在不同图层中多个抽屉，你必须设置 `append-to-body` 属性到 **true**

drawer/nested-drawer

:::

## 模态框

将 `modal` 设置为 `false` 将隐藏抽屉的模态层（遮罩层）。

从版本 ^(2.11.7) 起，新增了 `modal-penetrable` 属性，该属性可设置为“可穿透”。

:::demo

drawer/modal

:::

:::tip
Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。 因此，如果需要执行 DOM 操作，或通过 `ref` 获取相应组件，请在 `open` 事件回调中进行。

:::

:::tip
Drawer 提供了一个名为 `destroy-on-close` 的 API，这是一个标志变量，用于指示在 Drawer 关闭后是否销毁其中的子内容。 当你需要每次打开抽屉都要调用 `mounted` 生命周期时，可以使用此 API。

:::

## API

### 属性

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible / model-value | 是否显示 Drawer | ^[boolean] | false |
| appendToBody | Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true | ^[boolean] | false |
| appendTo <span class="docs-version-tag">2.8.0</span> | 挂载到哪个 DOM 元素，将覆盖 appendToBody | ^[CSSSelector] / ^[HTMLElement] | body |
| lockScroll | 是否在 Drawer 出现时将 body 滚动锁定 | ^[boolean] | true |
| beforeClose | 关闭前的回调，会暂停 Drawer 的关闭 | ^[Function] | — |
| closeOnClickModal | 是否可以通过点击 modal 关闭 Drawer | ^[boolean] | true |
| closeOnPressEscape | 是否可以通过按下 ESC 关闭 Drawer | ^[boolean] | true |
| openDelay | Drawer 打开的延时时间，单位毫秒 | ^[number] | 0 |
| closeDelay | Drawer 关闭的延时时间，单位毫秒 | ^[number] | 0 |
| destroyOnClose | 控制是否在关闭 Drawer 之后将子元素全部销毁 | ^[boolean] | false |
| modal | 是否需要遮罩层 | ^[boolean] | true |
| modalPenetrable | 是否允许穿透遮罩层。`modal` 属性必须为 false。 | ^[boolean] | false |
| direction | Drawer 打开的方向 | ^[enum] | rtl |
| resizable <span class="docs-version-tag">2.11.0</span> | 为抽屉启用可调整大小的功能 | ^[boolean] | false |
| showClose | 是否显示关闭按钮 | ^[boolean] | true |
| size | Drawer 窗体的大小，当使用 number 类型时，以像素为单位，当使用 string 类型时，请传入 'x%'，否则便会以 number 类型解释 | ^[number] / ^[string] | 30% |
| title | Drawer 的标题，也可通过 header 插槽传入 | ^[string] | — |
| withHeader | 控制是否显示 header 栏，默认为 true，当此项为 false 时，`title` 属性和 title 插槽均不生效 | ^[boolean] | true |
| modalClass | 遮罩层的自定义类名 | ^[string] | — |
| headerClass <span class="docs-version-tag">2.9.3</span> | header 部分的自定义 class 名 | ^[string] | — |
| bodyClass <span class="docs-version-tag">2.9.3</span> | body 部分的自定义 class 名 | ^[string] | — |
| footerClass <span class="docs-version-tag">2.9.3</span> | footer 部分的自定义 class 名 | ^[string] | — |
| zIndex | 设置 z-index | ^[number] | — |
| headerAriaLevel <el-tag round effect="plain" size="small">a11y</el-tag> | header 的 aria-level 属性 | ^[string] | 2 |
| className | Drawer 的自定义类名 | ^[string] | — |

:::danger WARNING

`custom-class` 已被弃用，将会于 2.3.0 移除，请使用 `class`。

:::

### 事件

| 事件名称 | 说明 | 类型 |
| --- | --- | --- |
| open | Drawer 打开的回调 | ^[Function] |
| opened | Drawer 打开动画结束时的回调 | ^[Function] |
| close | Drawer 关闭的回调 | ^[Function] |
| closed | Drawer 关闭动画结束时的回调 | ^[Function] |
| openAutoFocus | 输入焦点聚焦在 Drawer 内容时的回调 | ^[Function] |
| closeAutoFocus | 输入焦点从 Drawer 内容失焦时的回调 | ^[Function] |
| resizeStart <span class="docs-version-tag">2.11.8</span> | 当开始调整大小时触发（当启用 resizable 时） | ^[Function] |
| resize <span class="docs-version-tag">2.11.8</span> | 调整大小时触发（启用 resizable 时） | ^[Function] |
| resizeEnd <span class="docs-version-tag">2.11.8</span> | 当调整大小结束时触发（当启用 resizable 时） | ^[Function] |

### 插槽

| 名称 | 说明 |
| --- | --- |
| default | Drawer 的内容 |
| header | Drawer 标题的内容；会替换标题部分，但不会移除关闭按钮。 |
| footer | Drawer 页脚部分 |
| title <el-tag round effect="plain" size="small" type="danger">deprecated</el-tag> | 与 header 作用相同，请使用 header |

:::danger WARNING

`title` 已被弃用，并将在 3.0.0 版本中移除，请使用 `header` 代替。

:::

### 暴露

| 名称 | 详情 |
| --- | --- |
| handleClose | 用于关闭 Drawer，该方法会调用传入的 beforeClose 方法 |
