import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  RowBasic,
  RowGutter,
  RowHybrid,
  RowJustify,
  RowOffset,
  RowResponsive,
} from "@/components/element-plus/examples/layout";

export const metadata: Metadata = { title: "Layout 布局" };

const SOURCES = {
  basic: `<ElRow style={{ marginBottom: 20 }}>
  <ElCol span={24}><div className="grid-content" /></ElCol>
</ElRow>
<ElRow style={{ marginBottom: 20 }}>
  <ElCol span={12}><div className="grid-content" /></ElCol>
  <ElCol span={12}><div className="grid-content" /></ElCol>
</ElRow>
<ElRow style={{ marginBottom: 20 }}>
  <ElCol span={8}>...</ElCol>
  <ElCol span={8}>...</ElCol>
  <ElCol span={8}>...</ElCol>
</ElRow>
<ElRow style={{ marginBottom: 20 }}>
  {/* span={6} x 4 */}
</ElRow>
<ElRow>
  {/* span={4} x 6 */}
</ElRow>`,

  spacing: `<ElRow gutter={20}>
  <ElCol span={6}><div className="grid-content" /></ElCol>
  <ElCol span={6}><div className="grid-content" /></ElCol>
  <ElCol span={6}><div className="grid-content" /></ElCol>
  <ElCol span={6}><div className="grid-content" /></ElCol>
</ElRow>`,

  offset: `<ElRow gutter={20}>
  <ElCol span={6}><div className="grid-content" /></ElCol>
  <ElCol span={6} offset={6}><div className="grid-content" /></ElCol>
</ElRow>
<ElRow gutter={20}>
  <ElCol span={6} offset={6}><div className="grid-content" /></ElCol>
  <ElCol span={6} offset={6}><div className="grid-content" /></ElCol>
</ElRow>
<ElRow gutter={20}>
  <ElCol span={12} offset={6}><div className="grid-content" /></ElCol>
</ElRow>`,

  alignment: `{["start", "center", "end", "space-between", "space-around", "space-evenly"].map(
  (justify) => (
    <ElRow key={justify} justify={justify}>
      <ElCol span={6}><div className="grid-content" /></ElCol>
      <ElCol span={6}><div className="grid-content" /></ElCol>
      <ElCol span={6}><div className="grid-content" /></ElCol>
    </ElRow>
  ),
)}`,

  hybrid: `<ElRow gutter={20}>
  <ElCol span={16}><div className="grid-content" /></ElCol>
  <ElCol span={8}><div className="grid-content" /></ElCol>
</ElRow>
<ElRow gutter={20}>
  <ElCol span={8}>...</ElCol>
  <ElCol span={8}>...</ElCol>
  <ElCol span={4}>...</ElCol>
  <ElCol span={4}>...</ElCol>
</ElRow>
<ElRow gutter={20}>
  <ElCol span={4}>...</ElCol>
  <ElCol span={16}>...</ElCol>
  <ElCol span={4}>...</ElCol>
</ElRow>`,

  responsive: `<ElRow gutter={10}>
  <ElCol xs={8} sm={6} md={4} lg={3} xl={1}>
    <div className="grid-content" />
  </ElCol>
  <ElCol xs={4} sm={6} md={8} lg={9} xl={11}>
    <div className="grid-content" />
  </ElCol>
  <ElCol xs={4} sm={6} md={8} lg={9} xl={11}>
    <div className="grid-content" />
  </ElCol>
  <ElCol xs={8} sm={6} md={4} lg={3} xl={1}>
    <div className="grid-content" />
  </ElCol>
</ElRow>`,
};

const API_MD = `
## Row API

### Row Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格间隔，同时作为 Col 的左右内边距 | ^[number] | 0 |
| justify | 水平排列方式 | ^[enum]\`'start' \\| 'end' \\| 'center' \\| 'space-around' \\| 'space-between' \\| 'space-evenly'\` | start |
| align | 垂直对齐方式 | ^[enum]\`'top' \\| 'middle' \\| 'bottom'\` | — |
| tag | 渲染的标签名 | ^[string] | div |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Row Events

无。

### Row Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 列内容 | \`children\` |

## Col API

### Col Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占位格数，共 24 格 | ^[number] | 24 |
| offset | 左侧间隔格数 | ^[number] | — |
| pull | 向右移动格数 | ^[number] | — |
| push | 向左移动格数 | ^[number] | — |
| xs / sm / md / lg / xl | 响应式断点，值为格数或 \`{ span, offset, pull, push }\` | ^[number] / ^[object] | — |
| tag | 渲染的标签名 | ^[string] | div |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Col Events

无。

### Col Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 列内容 | \`children\` |

### Exposes

Row / Col 均无 expose。

`;

export default function LayoutPage() {
  return (
    <>
      <h1>Layout 布局</h1>
      <p>通过基础的 24 分栏，迅速简便地创建布局。</p>

      <Heading level={2}>基础布局</Heading>
      <p>
        通过 <code>ElRow</code> 与 <code>ElCol</code> 组合，<code>span</code> 表示占位格数。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <RowBasic />
      </DemoBlock>

      <Heading level={2}>分栏间隔</Heading>
      <p>
        <code>gutter</code> 设置栅格间隔，Row 会自动用负 margin 抵消两端的空白。
      </p>
      <DemoBlock source={SOURCES.spacing}>
        <RowGutter />
      </DemoBlock>

      <Heading level={2}>混合布局</Heading>
      <p>通过不同 span 组合出比例不等的列。</p>
      <DemoBlock source={SOURCES.hybrid}>
        <RowHybrid />
      </DemoBlock>

      <Heading level={2}>偏移</Heading>
      <p>
        通过 <code>offset</code> 设置列左侧的间隔格数。
      </p>
      <DemoBlock source={SOURCES.offset}>
        <RowOffset />
      </DemoBlock>

      <Heading level={2}>对齐方式</Heading>
      <p>
        通过 <code>justify</code> 设置水平排列方式，支持 start / center / end /
        space-between / space-around / space-evenly。
      </p>
      <DemoBlock source={SOURCES.alignment}>
        <RowJustify />
      </DemoBlock>

      <Heading level={2}>响应式布局</Heading>
      <p>
        参照 Bootstrap 的响应式设计，预设了 xs / sm / md / lg / xl 五个断点。
      </p>
      <DemoBlock source={SOURCES.responsive}>
        <RowResponsive />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
