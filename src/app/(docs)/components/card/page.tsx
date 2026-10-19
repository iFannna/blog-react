import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  CardBasic,
  CardBodyStyle,
  CardShadow,
  CardSlots,
} from "@/components/docs/examples/card";

export const metadata: Metadata = {
  title: "Card 卡片",
};

const SOURCES = {
  basic: `<ElCard header="卡片标题">
  <p>卡片内容</p>
</ElCard>`,

  shadow: `<ElCard header="always" shadow="always">
  <p>总是显示阴影</p>
</ElCard>

<ElCard header="hover" shadow="hover">
  <p>鼠标悬停时显示阴影</p>
</ElCard>

<ElCard header="never" shadow="never">
  <p>从不显示阴影</p>
</ElCard>`,

  slots: `<ElCard
  header={<span style={{ fontWeight: 700 }}>自定义头部</span>}
  footer={<span style={{ color: "#909399" }}>自定义页脚</span>}
>
  <p>头部与页脚都传入节点</p>
</ElCard>

<ElCard>
  <p>只有内容区，无头部页脚</p>
</ElCard>`,

  bodyStyle: `<ElCard header="自定义内容区样式" bodyStyle={{ padding: "3rem", textAlign: "center" }}>
  <p>bodyStyle 加大内边距</p>
</ElCard>

<ElCard header="自定义类名" bodyClass="docs-card-demo-body">
  <p>bodyClass 追加类名</p>
</ElCard>`,
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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="header">\` | \`header\` 属性 | 接受字符串或节点 |
| \`<slot name="footer">\` | \`footer\` 属性 | 接受字符串或节点 |
| \`body-style\` | \`bodyStyle\` | JSX 里用驼峰 |

\`shadow\` 缺省时取 \`ConfigProvider\` 的全局 \`card.shadow\`，再回退到
\`always\`，与官方一致。
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

      <Heading level={2}>阴影效果</Heading>
      <p>
        通过 <code>shadow</code> 属性设置卡片阴影出现的时机，
        可选值为 <code>always</code>、<code>hover</code>、<code>never</code>。
      </p>
      <DemoBlock source={SOURCES.shadow}>
        <CardShadow />
      </DemoBlock>

      <Heading level={2}>头部与页脚</Heading>
      <p>
        <code>header</code> 与 <code>footer</code> 都接受节点，可传入自定义结构。
        不传时不渲染对应区域。
      </p>
      <DemoBlock source={SOURCES.slots}>
        <CardSlots />
      </DemoBlock>

      <Heading level={2}>自定义样式</Heading>
      <p>
        通过 <code>bodyStyle</code> 设置内容区样式，
        <code>bodyClass</code> / <code>headerClass</code> / <code>footerClass</code>
        追加自定义类名。
      </p>
      <DemoBlock source={SOURCES.bodyStyle}>
        <CardBodyStyle />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
