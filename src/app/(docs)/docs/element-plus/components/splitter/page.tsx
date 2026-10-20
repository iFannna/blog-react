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
      <h1>Splitter 分隔面板</h1>
      <p>
        自由切分区域，可以水平或垂直方向分隔并拖拽调整各区域的大小。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>
        最基础的用法，不传默认尺寸时各面板自动均分。这里的{" "}
        <code>size=&quot;30%&quot;</code> 表示首个面板占 30%，第二个面板设了{" "}
        <code>min=200</code>，拖拽时不会被压到 200px 以下。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <SplitterBasic />
      </DemoBlock>

      <Heading level={2}>垂直布局</Heading>
      <p>
        通过 <code>layout=&quot;vertical&quot;</code> 改成垂直方向。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <SplitterVertical />
      </DemoBlock>

      <Heading level={2}>可折叠</Heading>
      <p>
        配置 <code>collapsible</code> 提供快捷收起能力。可以用{" "}
        <code>min</code> 阻止收起后通过拖拽再展开。
      </p>
      <DemoBlock source={SOURCES.collapsible}>
        <SplitterCollapsible />
      </DemoBlock>

      <Heading level={2}>禁用拖拽</Heading>
      <p>
        任一面板的 <code>resizable</code> 为 false 时，相邻分隔条都会禁用拖拽。
      </p>
      <DemoBlock source={SOURCES.disableDrag}>
        <SplitterDisableDrag />
      </DemoBlock>

      <Heading level={2}>面板尺寸</Heading>
      <p>
        <code>size</code> 配合 <code>onSizeChange</code> 即官方的{" "}
        <code>v-model:size</code>，可以读取面板当前尺寸。
      </p>
      <DemoBlock source={SOURCES.size}>
        <SplitterSize />
      </DemoBlock>

      <Heading level={2}>懒更新</Heading>
      <p>
        开启 <code>lazy</code> 后，拖拽过程中不实时更新面板尺寸，只在拖拽结束
        后一次性更新。
      </p>
      <DemoBlock source={SOURCES.lazy}>
        <SplitterLazy />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
