import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  DividerBasic,
  DividerBorderStyle,
  DividerText,
  DividerVertical,
} from "@/components/element-plus/examples/divider";

export const metadata: Metadata = {
  title: "Divider 分割线",
};

const SOURCES = {
  basic: `<span>白日依山尽</span>
<ElDivider />
<span>黄河入海流</span>
<ElDivider />
<span>欲穷千里目</span>`,

  text: `<ElDivider contentPosition="left">左对齐</ElDivider>
<ElDivider contentPosition="center">居中</ElDivider>
<ElDivider contentPosition="right">右对齐</ElDivider>`,

  vertical: `<div style={{ display: "flex", alignItems: "center", height: 40 }}>
  <span>左</span>
  <ElDivider direction="vertical" />
  <span>中</span>
  <ElDivider direction="vertical" />
  <span>右</span>
</div>`,

  borderStyle: `{["solid", "dashed", "dotted", "double"].map((style) => (
  <ElDivider key={style} borderStyle={style}>
    {style}
  </ElDivider>
))}`,
};

const API_MD = `
## Divider API

### Divider Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 方向 | ^[enum]\`'horizontal' \\| 'vertical'\` | horizontal |
| content-position | 内容位置，仅水平方向有效 | ^[enum]\`'left' \\| 'center' \\| 'right'\` | center |
| border-style | 分隔线样式 | ^[enum]\`'solid' \\| 'dashed' \\| 'dotted' \\| 'double' \\| 其它 CSS border-style 值\` | solid |

### Divider Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 分割线中间的文字 | \`children\` |
`;

export default function DividerPage() {
  return (
    <>
      <h1>Divider 分割线</h1>
      <p>区隔内容的分割线。</p>

      <Heading level={2}>基础用法</Heading>
      <p>对不同段落的文本进行分割。</p>
      <DemoBlock source={SOURCES.basic}>
        <DividerBasic />
      </DemoBlock>

      <Heading level={2}>设置文案</Heading>
      <p>可以在分割线上自定义文本内容。</p>
      <DemoBlock source={SOURCES.text}>
        <DividerText />
      </DemoBlock>

      <Heading level={2}>虚线</Heading>
      <p>您可以设置分隔符的样式。</p>
      <DemoBlock source={SOURCES.borderStyle}>
        <DividerBorderStyle />
      </DemoBlock>

      <Heading level={2}>垂直分隔线</Heading>
      <DemoBlock source={SOURCES.vertical}>
        <DividerVertical />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
