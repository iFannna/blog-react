import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  SplitterBasic,
  SplitterCollapsible,
  SplitterDisableDrag,
  SplitterLazy,
  SplitterSize,
  SplitterVertical,
} from "@/components/element-plus/examples/splitter";

export const metadata: Metadata = { title: "Splitter 分隔面板" };

const SOURCES = {
  basic: `const boxStyle = { height: 250, boxShadow: "var(--el-border-color-light) 0px 0px 10px" };

<div style={boxStyle}>
  <ElSplitter>
    <ElSplitterPanel size="30%">
      <div className="demo-panel">1</div>
    </ElSplitterPanel>
    <ElSplitterPanel min={200}>
      <div className="demo-panel">2</div>
    </ElSplitterPanel>
  </ElSplitter>
</div>`,

  vertical: `<ElSplitter layout="vertical">
  <ElSplitterPanel>
    <div className="demo-panel">1</div>
  </ElSplitterPanel>
  <ElSplitterPanel>
    <div className="demo-panel">2</div>
  </ElSplitterPanel>
</ElSplitter>`,

  collapsible: `const [isCollapsible, setIsCollapsible] = useState(true);

<ElSwitch
  checked={isCollapsible}
  onCheckedChange={setIsCollapsible}
  activeText="enable"
  inactiveText="disable"
  inlinePrompt
/>

<ElSplitter>
  <ElSplitterPanel collapsible={isCollapsible} min="50">
    <div className="demo-panel">1</div>
  </ElSplitterPanel>
  <ElSplitterPanel collapsible={isCollapsible}>
    <div className="demo-panel">2</div>
  </ElSplitterPanel>
  <ElSplitterPanel>
    <div className="demo-panel">3</div>
  </ElSplitterPanel>
  <ElSplitterPanel collapsible={isCollapsible}>
    <ElSplitter layout="vertical">
      <ElSplitterPanel collapsible={isCollapsible}>
        <div className="demo-panel">4</div>
      </ElSplitterPanel>
      <ElSplitterPanel collapsible={isCollapsible}>
        <div className="demo-panel">5</div>
      </ElSplitterPanel>
    </ElSplitter>
  </ElSplitterPanel>
</ElSplitter>`,

  disableDrag: `const [resizable, setResizable] = useState(false);

<ElSwitch
  checked={resizable}
  onCheckedChange={setResizable}
  activeText="enable"
  inactiveText="disable"
  inlinePrompt
/>

<ElSplitter>
  <ElSplitterPanel>
    <div className="demo-panel">1</div>
  </ElSplitterPanel>
  <ElSplitterPanel resizable={resizable}>
    <div className="demo-panel">drag {resizable ? "enable" : "disable"}</div>
  </ElSplitterPanel>
  <ElSplitterPanel>
    <div className="demo-panel">3</div>
  </ElSplitterPanel>
</ElSplitter>`,

  size: `const [size, setSize] = useState(100);

<ElSplitter
  onResizeStart={(index, sizes) => console.log("resizeStart", index, sizes)}
  onResize={(index, sizes) => console.log("resize", index, sizes)}
  onResizeEnd={(index, sizes) => console.log("resizeEnd", index, sizes)}
>
  <ElSplitterPanel>
    <div className="demo-panel">1</div>
  </ElSplitterPanel>
  <ElSplitterPanel size={size} onSizeChange={setSize} min={50} max={200}>
    <div className="demo-panel">{size}px</div>
  </ElSplitterPanel>
  <ElSplitterPanel>
    <div className="demo-panel">3</div>
  </ElSplitterPanel>
</ElSplitter>`,

  lazy: `<ElSplitter lazy>
  <ElSplitterPanel collapsible min="50">
    <div className="demo-panel">1</div>
  </ElSplitterPanel>
  <ElSplitterPanel collapsible>
    <div className="demo-panel">2</div>
  </ElSplitterPanel>
  <ElSplitterPanel collapsible>
    <div className="demo-panel">3</div>
  </ElSplitterPanel>
</ElSplitter>`,
};

const API_MD = `
## Splitter API

### Splitter Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 布局方向 | ^[enum]\`'horizontal' \\| 'vertical'\` | horizontal |
| lazy | 是否开启懒更新 | ^[boolean] | false |
| class-name | 根元素类名 | ^[string] | — |

### Splitter Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onResizeStart | 开始拖拽某条分隔条 | ^[Function]\`(index: number, sizes: number[]) => void\` |
| onResize | 拖拽过程中持续触发（lazy 模式不触发） | ^[Function]\`(index: number, sizes: number[]) => void\` |
| onResizeEnd | 拖拽结束 | ^[Function]\`(index: number, sizes: number[]) => void\` |
| onCollapse | 折叠/展开某面板 | ^[Function]\`(index: number, type: 'start' \\| 'end', sizes: number[]) => void\` |

## SplitterPanel API

### SplitterPanel Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 面板尺寸（像素或百分比）。配合 onSizeChange 即 \`v-model:size\` | ^[string] / ^[number] | — |
| min | 面板最小尺寸 | ^[string] / ^[number] | — |
| max | 面板最大尺寸 | ^[string] / ^[number] | — |
| resizable | 是否可拖拽调整 | ^[boolean] | true |
| collapsible | 是否显示收起按钮 | ^[boolean] | false |
| start-collapsible | 起始侧收起按钮的自定义内容，对应 start-collapsible 插槽 | ^[ReactNode] | — |
| end-collapsible | 结束侧收起按钮的自定义内容，对应 end-collapsible 插槽 | ^[ReactNode] | — |

### SplitterPanel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onSizeChange | 面板尺寸变化 | ^[Function]\`(size: number) => void\` |

`;

export default function SplitterPage() {
  return (
    <>
      <h1>
        Splitter 分隔面板{" "}
        <span className="docs-version-tag docs-version-tag--beta">beta</span>
      </h1>
      <p>可将区域水平或垂直分隔，并可自由拖动以调整各个区域的大小。</p>

      <Heading level={2}>基础用法</Heading>
      <p>最基本的用法，如果未传入默认尺寸，将自动平均分配。</p>
      <DemoBlock source={SOURCES.basic}>
        <SplitterBasic />
      </DemoBlock>

      <Heading level={2}>垂直布局</Heading>
      <p>使用垂直方向。</p>
      <DemoBlock source={SOURCES.vertical}>
        <SplitterVertical />
      </DemoBlock>

      <Heading level={2}>可折叠</Heading>
      <p>
        配置 <code>collapsible</code> 可提供快速收缩功能。你可以使用{" "}
        <code>min</code> 属性来防止折叠后通过拖拽进行扩展。
      </p>
      <DemoBlock source={SOURCES.collapsible}>
        <SplitterCollapsible />
      </DemoBlock>

      <Heading level={2}>禁用拖动</Heading>
      <p>
        当任一面板禁用 <code>resizable</code> 时，拖拽功能将被禁用。
      </p>
      <DemoBlock source={SOURCES.disableDrag}>
        <SplitterDisableDrag />
      </DemoBlock>

      <Heading level={2}>面板大小</Heading>
      <p>
        <code>v-model:size</code> 可以获取面板的大小。
      </p>
      <DemoBlock source={SOURCES.size}>
        <SplitterSize />
      </DemoBlock>

      <Heading level={2} id="延迟">
        延迟 <span className="docs-version-tag">2.11.0</span>
      </Heading>
      <p>
        当启用<code>lazy</code>时，面板大小将不会在拖动时实时更新，只能在拖动结束后更新。
      </p>
      <DemoBlock source={SOURCES.lazy}>
        <SplitterLazy />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
