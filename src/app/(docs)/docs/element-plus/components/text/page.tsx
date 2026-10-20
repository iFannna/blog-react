import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TextBasic,
  TextMixed,
  TextOverride,
  TextSizes,
  TextTruncated,
} from "@/components/element-plus/examples/text";

export const metadata: Metadata = { title: "Text 文本" };

const SOURCES = {
  basic: `<ElText>Default</ElText>
<ElText type="primary">Primary</ElText>
<ElText type="success">Success</ElText>
<ElText type="info">Info</ElText>
<ElText type="warning">Warning</ElText>
<ElText type="danger">Danger</ElText>`,

  sizes: `<ElText size="large">Large</ElText>
<ElText>Default</ElText>
<ElText size="small">Small</ElText>`,

  truncated: `{/* 自身设置宽度 */}
<div style={{ width: 150 }}>
  <ElText truncated>Self element set width 100px</ElText>
</div>

{/* 被父元素挤压 */}
<div style={{ width: 150 }}>
  <ElRow>
    <ElText truncated>Squeezed by parent element</ElText>
  </ElRow>
</div>

{/* 多行省略 */}
<ElText lineClamp={2}>
  The -webkit-line-clamp CSS property<br />
  allows limiting of the contents of<br />
  a block to the specified number of lines.
</ElText>`,

  mixed: `<ElSpace direction="vertical">
  <ElText>
    <ElIcon><ElementPlus /></ElIcon>
    Element-Plus
  </ElText>
  <ElRow>
    <ElText>Rate</ElText>
    <ElRate style={{ marginLeft: 4 }} />
  </ElRow>
  <ElText>
    This is text mixed icon
    <ElIcon><Bell /></ElIcon>
    and component
    <ElButton>Button</ElButton>
  </ElText>
</ElSpace>`,

  override: `<ElSpace direction="vertical">
  <ElText>span</ElText>
  <ElText tag="p">This is a paragraph.</ElText>
  <ElText tag="b">Bold</ElText>
  <ElText tag="i">Italic</ElText>
  <ElText>
    This is
    <ElText tag="sub" size="small">subscript</ElText>
  </ElText>
  <ElText>
    This is
    <ElText tag="sup" size="small">superscript</ElText>
  </ElText>
  <ElText tag="ins">Inserted</ElText>
  <ElText tag="del">Deleted</ElText>
  <ElText tag="mark">Marked</ElText>
</ElSpace>`,
};

const API_MD = `
## Text API

### Text Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 文本类型 | ^[enum]\`'primary' \\| 'success' \\| 'info' \\| 'warning' \\| 'danger' \\| ''\` | — |
| size | 文本尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| truncated | 是否单行溢出省略 | ^[boolean] | false |
| lineClamp | 最大行数，传入即启用多行省略 | ^[number] / ^[string] | — |
| tag | 渲染的标签名，如 p / b / i / sub / sup / ins / del / mark | ^[string] | span |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |
| title | 原生 title，传入后不再自动计算 | ^[string] | — |

### Text Events

无。

### Text Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 文本或混排内容（文本、图标、组件） | \`children\` |

### Exposes

无。

`;

export default function TextPage() {
  return (
    <>
      <h1>Text 文本</h1>
      <p>文本的常见操作，包括类型、尺寸、混排与溢出省略。</p>

      <Heading level={2}>基础用法</Heading>
      <p>通过 type 设置文本类型。</p>
      <DemoBlock source={SOURCES.basic}>
        <TextBasic />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>通过 size 设置文本尺寸。</p>
      <DemoBlock source={SOURCES.sizes}>
        <TextSizes />
      </DemoBlock>

      <Heading level={2}>溢出省略</Heading>
      <p>
        <code>truncated</code> 用于单行省略，<code>lineClamp</code> 用于多行省略；
        宽度可由自身或父元素约束。
      </p>
      <DemoBlock source={SOURCES.truncated}>
        <TextTruncated />
      </DemoBlock>

      <Heading level={2}>混合使用</Heading>
      <p>文本可与图标、评分、按钮等组件混排。</p>
      <DemoBlock source={SOURCES.mixed}>
        <TextMixed />
      </DemoBlock>

      <Heading level={2}>覆盖标签</Heading>
      <p>
        通过 <code>tag</code> 渲染为 p / b / i / sub / sup / ins / del / mark 等语义标签。
      </p>
      <DemoBlock source={SOURCES.override}>
        <TextOverride />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
