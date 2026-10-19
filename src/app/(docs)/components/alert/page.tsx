import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  AlertBasic,
  AlertCenter,
  AlertClosable,
  AlertCustomClose,
  AlertDescription,
  AlertIcon,
  AlertTheme,
} from "@/components/docs/examples/alert";

export const metadata: Metadata = {
  title: "Alert 提示",
};

const SOURCES = {
  basic: `<ElAlert title="成功提示的文案" type="success" />
<ElAlert title="消息提示的文案" type="info" />
<ElAlert title="警告提示的文案" type="warning" />
<ElAlert title="错误提示的文案" type="error" />`,

  theme: `<ElAlert title="成功提示的文案" type="success" effect="dark" />
<ElAlert title="消息提示的文案" type="info" effect="dark" />
<ElAlert title="警告提示的文案" type="warning" effect="dark" />
<ElAlert title="错误提示的文案" type="error" effect="dark" />`,

  customClose: `const [visible, setVisible] = useState(true);

{visible && (
  <ElAlert
    title="自定义关闭按钮"
    type="info"
    closeText="知道了"
    onClose={() => setVisible(false)}
  />
)}`,

  description: `<ElAlert
  title="带辅助性文字介绍"
  type="success"
  description="这是一段辅助性文字，用于补充说明。"
  showIcon
/>`,

  icon: `<ElAlert title="显示图标" type="success" showIcon />
<ElAlert title="显示图标" type="info" showIcon />
<ElAlert title="显示图标" type="warning" showIcon />
<ElAlert title="显示图标" type="error" showIcon />`,

  center: `<ElAlert title="文字居中" type="success" center showIcon />
<ElAlert
  title="文字居中"
  type="info"
  description="辅助性文字也居中显示。"
  center
  showIcon
/>`,

  closable: `const [items, setItems] = useState(["提示一", "提示二", "提示三"]);

{items.map((title) => (
  <ElAlert key={title} title={title} onClose={() => setItems(items.filter((t) => t !== title))} />
))}`,
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
      <p>
        页面中的非浮层元素，不会自动消失。设置 <code>type</code> 属性指定主题。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <AlertBasic />
      </DemoBlock>

      <Heading level={2}>主题</Heading>
      <p>
        Alert 组件提供了两种主题，通过 <code>effect</code> 属性来设置。
      </p>
      <DemoBlock source={SOURCES.theme}>
        <AlertTheme />
      </DemoBlock>

      <Heading level={2}>自定义关闭按钮</Heading>
      <p>
        通过 <code>closeText</code> 属性自定义关闭按钮为文字。
      </p>
      <DemoBlock source={SOURCES.customClose}>
        <AlertCustomClose />
      </DemoBlock>

      <Heading level={2}>带有辅助性文字介绍</Heading>
      <p>
        通过 <code>description</code> 属性设置辅助性文字。传入后标题会变为大字号。
      </p>
      <DemoBlock source={SOURCES.description}>
        <AlertDescription />
      </DemoBlock>

      <Heading level={2}>带有图标</Heading>
      <p>
        设置 <code>showIcon</code> 属性显示对应类型的图标。
      </p>
      <DemoBlock source={SOURCES.icon}>
        <AlertIcon />
      </DemoBlock>

      <Heading level={2}>文字居中</Heading>
      <p>
        使用 <code>center</code> 属性让文字水平居中。
      </p>
      <DemoBlock source={SOURCES.center}>
        <AlertCenter />
      </DemoBlock>

      <Heading level={2}>可关闭的提示</Heading>
      <p>
        设置 <code>closable</code> 属性（默认开启）可以关闭提示，
        <code>onClose</code> 回调中决定是否从列表中移除。
      </p>
      <DemoBlock source={SOURCES.closable}>
        <AlertClosable />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
