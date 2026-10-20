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

      <DocsContent
        source={`:::tip

组件默认使用 Flex 布局，不需要手动设置 \`type="flex"\`。

请注意父容器避免使用 \`inline\` 相关样式，会导致组件宽度不能撑满。

列的基本单位为1，最多24个，最少0个。

:::`}
      />

      <Heading level={2}>基础布局</Heading>
      <p>使用列创建基础网格布局。</p>
      <p>
        通过 <code>row</code> 和 <code>col</code> 组件，并通过 col 组件的{" "}
        <code>span</code> 属性我们就可以自由地组合布局。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <RowBasic />
      </DemoBlock>

      <Heading level={2}>分栏间隔</Heading>
      <p>支持列间距。</p>
      <p>
        行提供 <code>gutter</code> 属性来指定列之间的间距，其默认值为0。
      </p>
      <DemoBlock source={SOURCES.spacing}>
        <RowGutter />
      </DemoBlock>

      <Heading level={2}>混合布局</Heading>
      <p>通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。</p>
      <DemoBlock source={SOURCES.hybrid}>
        <RowHybrid />
      </DemoBlock>

      <Heading level={2}>列偏移</Heading>
      <p>您可以指定列偏移量。</p>
      <p>
        通过制定 col 组件的 <code>offset</code> 属性可以指定分栏偏移的栏数。
      </p>
      <DemoBlock source={SOURCES.offset}>
        <RowOffset />
      </DemoBlock>

      <Heading level={2}>对齐方式</Heading>
      <p>默认使用 flex 布局来对分栏进行灵活的对齐。</p>
      <p>
        您可以通过<code>justify</code>{" "}
        属性来定义子元素的排版方式，其取值为start、center、end、space-between、space-around或space-evenly。
      </p>
      <DemoBlock source={SOURCES.alignment}>
        <RowJustify />
      </DemoBlock>

      <Heading level={2}>响应式布局</Heading>
      <p>
        参照了 Bootstrap 的 响应式设计，预设了五个响应尺寸：xs、sm、md、lg 和 xl。
      </p>
      <DemoBlock source={SOURCES.responsive}>
        <RowResponsive />
      </DemoBlock>

      <Heading level={2}>基于断点的隐藏类</Heading>
      <p>
        Element Plus 额外提供了一系列类名，用于在某些条件下隐藏元素。这些类名可以添加在任何 DOM
        元素或自定义组件上。如果需要，请自行引入以下文件：
      </p>
      <pre className="docs-code-block">
        <code>import &apos;element-plus/theme-chalk/display.css&apos;</code>
      </pre>
      <p>这些类名为：</p>
      <ul>
        <li>
          <code>hidden-xs-only</code> - 当视口在 <code>xs</code> 尺寸时隐藏
        </li>
        <li>
          <code>hidden-sm-only</code> - 当视口在 <code>sm</code> 尺寸时隐藏
        </li>
        <li>
          <code>hidden-sm-and-down</code> - 当视口在 <code>sm</code> 及以下尺寸时隐藏
        </li>
        <li>
          <code>hidden-sm-and-up</code> - 当视口在 <code>sm</code> 及以上尺寸时隐藏
        </li>
        <li>
          <code>hidden-md-only</code> - 当视口在 <code>md</code> 尺寸时隐藏
        </li>
        <li>
          <code>hidden-md-and-down</code> - 当视口在 <code>md</code> 及以下尺寸时隐藏
        </li>
        <li>
          <code>hidden-md-and-up</code> - 当视口在 <code>md</code> 及以上尺寸时隐藏
        </li>
        <li>
          <code>hidden-lg-only</code> - 当视口在 <code>lg</code> 尺寸时隐藏
        </li>
        <li>
          <code>hidden-lg-and-down</code> - 当视口在 <code>lg</code> 及以下尺寸时隐藏
        </li>
        <li>
          <code>hidden-lg-and-up</code> - 当视口在 <code>lg</code> 及以上尺寸时隐藏
        </li>
        <li>
          <code>hidden-xl-only</code> - 当视口在 <code>xl</code> 尺寸时隐藏
        </li>
      </ul>

      <DocsContent source={API_MD} />
    </>
  );
}
