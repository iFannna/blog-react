import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  DividerBasic,
  DividerBorderStyle,
  DividerText,
  DividerVertical,
} from "@/components/docs/examples/divider";

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`border-style\` | \`borderStyle\` | JSX 里用驼峰 |

**实现说明**：官方通过 \`ns.cssVar\` 把 \`border-style\` 写成 \`--el-border-style\` 变量，
由 scss 里的 \`border-top: 1px var(--el-border-color) var(--el-border-style)\` 消费。
React 侧沿用同一机制，变量名与消费方式完全一致。

竖线形态下不渲染文字区，与官方模板的判断一致。
`;

export default function DividerPage() {
  return (
    <>
      <h1>Divider 分割线</h1>
      <p>区隔内容的分割线。</p>

      <Heading level={2}>基础用法</Heading>
      <p>对不同章节的文本段落进行分割。</p>
      <DemoBlock source={SOURCES.basic}>
        <DividerBasic />
      </DemoBlock>

      <Heading level={2}>设置文案</Heading>
      <p>
        可以在分割线上自定义文案和位置，通过 <code>contentPosition</code> 设置位置。
      </p>
      <DemoBlock source={SOURCES.text}>
        <DividerText />
      </DemoBlock>

      <Heading level={2}>垂直分割</Heading>
      <p>
        设置 <code>direction=&quot;vertical&quot;</code> 可以设置为垂直分割线，
        常用于行内元素之间。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <DividerVertical />
      </DemoBlock>

      <Heading level={2}>自定义样式</Heading>
      <p>
        通过 <code>borderStyle</code> 属性设置分割线的样式。
      </p>
      <DemoBlock source={SOURCES.borderStyle}>
        <DividerBorderStyle />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
