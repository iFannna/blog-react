import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  AlertBasic,
  AlertCenter,
  AlertCustomClose,
  AlertDescription,
  AlertIcon,
  AlertIconDescription,
  AlertTheme,
} from "@/components/element-plus/examples/alert";

export const metadata: Metadata = {
  title: "Alert 提示",
};

const SOURCES = {
  basic: `<div style={{ maxWidth: 600 }}>
  <ElAlert title="Primary alert" type="primary" />
  <ElAlert title="Success alert" type="success" style={{ marginTop: 20 }} />
  <ElAlert title="Info alert" type="info" style={{ marginTop: 20 }} />
  <ElAlert title="Warning alert" type="warning" style={{ marginTop: 20 }} />
  <ElAlert title="Error alert" type="error" style={{ marginTop: 20 }} />
</div>`,

  theme: `<ElAlert title="Primary alert" type="primary" effect="dark" />
<ElAlert title="Success alert" type="success" effect="dark" />
<ElAlert title="Info alert" type="info" effect="dark" />
<ElAlert title="Warning alert" type="warning" effect="dark" />
<ElAlert title="Error alert" type="error" effect="dark" />`,

  customClose: `<ElAlert title="Unclosable alert" type="success" closable={false} />
<ElAlert title="Customized close text" type="info" closeText="Gotcha" />
<ElAlert title="Alert with callback" type="warning" onClose={handleClose} />`,

  icon: `<ElAlert title="Primary alert" type="primary" showIcon />
<ElAlert title="Success alert" type="success" showIcon />
<ElAlert title="Info alert" type="info" showIcon />
<ElAlert title="Warning alert" type="warning" showIcon />
<ElAlert title="Error alert" type="error" showIcon />
<ElAlert title="Error alert with custom icon" type="error" showIcon icon={<Bell />} />`,

  center: `<ElAlert title="Primary alert" type="primary" center showIcon />
<ElAlert title="Success alert" type="success" center showIcon />
<ElAlert title="Info alert" type="info" center showIcon />
<ElAlert title="Warning alert" type="warning" center showIcon />
<ElAlert title="Error alert" type="error" center showIcon />`,

  description: `<ElAlert
  title="With description"
  type="success"
  description="This is a description."
/>`,

  iconDescription: `<ElAlert
  title="Primary alert"
  type="primary"
  description="More text description"
  showIcon
/>
<ElAlert
  title="Success alert"
  type="success"
  description="More text description"
  showIcon
/>`,
};

const API_MD = `
## Alert API

### Alert Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| type | 主题类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'error' \\| 'info'\` | info |
| description | 描述文字，传入后标题与描述纵向排列 | ^[string] / ^[ReactNode] | — |
| closable | 是否可关闭 | ^[boolean] | true |
| close-text | 自定义关闭按钮文案，传入后替换 × 图标 | ^[string] | — |
| show-icon | 是否显示图标 | ^[boolean] | false |
| center | 内容是否居中 | ^[boolean] | false |
| effect | 主题 | ^[enum]\`'light' \\| 'dark'\` | light |

### Alert Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClose | 关闭时触发 | ^[Function]\`(event: MouseEvent) => void\` |

### Alert Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 描述文字 | \`description\` |
| title | 标题内容 | \`title\` |
| icon | 自定义图标 | \`icon\` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`type\` | 同 | 官方含 \`primary\`，无 \`default\` |

**实现说明**：官方用 \`v-show\` 控制显隐并在组件内维护 \`visible\`，
React 侧沿用该职责：\`onClose\` 触发时先卸载自身，使用方无需额外维护显隐状态。
`;

export default function AlertPage() {
  return (
    <>
      <h1>Alert 提示</h1>
      <p>用于页面中展示重要的提示信息。</p>

      <Heading level={2}>基础用法</Heading>
      <p>Alert 组件不属于浮层元素，不会自动消失或关闭。</p>
      <DemoBlock
        source={SOURCES.basic}
        description="Alert 组件提供5种类型，由 type 属性指定，默认值为 info。primary 已被添加到 2.9.11。"
      >
        <AlertBasic />
      </DemoBlock>

      <Heading level={2}>主题</Heading>
      <p>Alert 组件提供了两个不同的主题：light 和 dark。</p>
      <DemoBlock
        source={SOURCES.theme}
        description="通过设置 effect 属性来改变主题，默认为 light。"
      >
        <AlertTheme />
      </DemoBlock>

      <Heading level={2}>自定义关闭按钮</Heading>
      <p>你可以自定义关闭按钮为文字或其他符号。</p>
      <DemoBlock
        source={SOURCES.customClose}
        description="你可以设置 Alert 组件是否为可关闭状态，关闭按钮的内容以及关闭时的回调函数。closable 属性决定组件是否可关闭，默认 true。close-text 属性用于替换默认的 × 符号。"
      >
        <AlertCustomClose />
      </DemoBlock>

      <Heading level={2}>使用图标</Heading>
      <p>你可以通过为 Alert 组件添加图标来提高可读性。</p>
      <DemoBlock
        source={SOURCES.icon}
        description="通过设置 show-icon 属性来显示 Alert 的 icon，这能更有效地向用户展示你的提示。或者使用 icon 插槽来自定义图标。"
      >
        <AlertIcon />
      </DemoBlock>

      <Heading level={2}>文字居中</Heading>
      <p>使用 center 属性来让文字水平居中。</p>
      <DemoBlock source={SOURCES.center}>
        <AlertCenter />
      </DemoBlock>

      <Heading level={2}>文字描述</Heading>
      <p>为 Alert 组件添加一个更加详细的描述来使用户了解更多信息。</p>
      <DemoBlock
        source={SOURCES.description}
        description="除了必填的 title 属性外，你可以设置 description 属性来帮助你更好地介绍 Alert 组件。描述只能存放文本，并会自动换行。"
      >
        <AlertDescription />
      </DemoBlock>

      <Heading level={2}>带图标和描述</Heading>
      <DemoBlock
        source={SOURCES.iconDescription}
        description="在最后, 这是一个带有图标和描述的例子。"
      >
        <AlertIconDescription />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
