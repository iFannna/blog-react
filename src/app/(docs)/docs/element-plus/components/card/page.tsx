import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  CardBasic,
  CardShadow,
  CardSimple,
  CardWithImages,
} from "@/components/element-plus/examples/card";

export const metadata: Metadata = {
  title: "Card 卡片",
};

const SOURCES = {
  basic: `<ElCard style={{ maxWidth: 480 }} header={<span>Card name</span>} footer="Footer content">
  <p>List item 1</p>
  <p>List item 2</p>
  <p>List item 3</p>
  <p>List item 4</p>
</ElCard>`,

  simple: `<ElCard style={{ maxWidth: 480 }}>
  <p>List item 1</p>
  <p>List item 2</p>
  <p>List item 3</p>
  <p>List item 4</p>
</ElCard>`,

  withImages: `<ElCard style={{ maxWidth: 480 }} header="Yummy hamburger">
  <img src={hamburgerUrl} style={{ width: "100%" }} />
</ElCard>`,

  shadow: `<div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
  <ElCard style={{ width: 480 }} shadow="always">Always</ElCard>
  <ElCard style={{ width: 480 }} shadow="hover">Hover</ElCard>
  <ElCard style={{ width: 480 }} shadow="never">Never</ElCard>
</div>`,
};

const API_MD = `
## Card API

### Card Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| header | 标题，也可传入节点 | ^[string] / ^[ReactNode] | — |
| footer | 页脚，也可传入节点 | ^[string] / ^[ReactNode] | — |
| body-style | 内容区样式 | ^[object]\`CSSProperties\` | — |
| header-class | 自定义头部类名 | ^[string] | — |
| body-class | 自定义内容区类名 | ^[string] | — |
| footer-class | 自定义页脚类名 | ^[string] | — |
| shadow | 阴影显示时机 | ^[enum]\`'always' \\| 'hover' \\| 'never'\` | always |

### Card Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 内容区 | \`children\` |
| header | 头部内容 | \`header\` |
| footer | 页脚内容 | \`footer\` |

`;

export default function CardPage() {
  return (
    <>
      <h1>Card 卡片</h1>
      <p>将信息聚合在卡片容器中展示。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        包含标题、内容、操作区域。通过 <code>header</code> 属性设置标题。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CardBasic />
      </DemoBlock>

      <Heading level={2}>简单卡片</Heading>
      <p>可以省略头部区域。</p>
      <DemoBlock source={SOURCES.simple}>
        <CardSimple />
      </DemoBlock>

      <Heading level={2}>带图片</Heading>
      <p>
        通过 <code>bodyStyle</code> 属性定义内容区样式，可以展示更丰富的内容。
      </p>
      <DemoBlock source={SOURCES.withImages}>
        <CardWithImages />
      </DemoBlock>

      <Heading level={2}>阴影效果</Heading>
      <p>
        通过 <code>shadow</code> 属性设置卡片阴影出现的时机，
        可选值为 <code>always</code>、<code>hover</code>、<code>never</code>。
      </p>
      <DemoBlock source={SOURCES.shadow}>
        <CardShadow />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
