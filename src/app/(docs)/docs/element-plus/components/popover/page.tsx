import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  PopoverBasicUsage,
  PopoverDirectiveUsage,
  PopoverNestedInformation,
  PopoverNestedOperation,
  PopoverPlacement,
  PopoverVirtualTriggering,
} from "@/components/element-plus/examples/overlay";

export const metadata: Metadata = { title: "Popover 弹出框" };

const SOURCES = {
  placement: `<ElPopover title="Title" content="top-start prompts info" placement="top-start">
  <ElButton>top-start</ElButton>
</ElPopover>
<ElPopover title="Title" content="top prompts info" placement="top">
  <ElButton>top</ElButton>
</ElPopover>
<ElPopover title="Title" content="top-end prompts info" placement="top-end">
  <ElButton>top-end</ElButton>
</ElPopover>
<ElPopover title="Title" content="left-start prompts info" placement="left-start">
  <ElButton>left-start</ElButton>
</ElPopover>
<ElPopover title="Title" content="right-start prompts info" placement="right-start">
  <ElButton>right-start</ElButton>
</ElPopover>
<ElPopover title="Title" content="left prompts info" placement="left">
  <ElButton>left</ElButton>
</ElPopover>
<ElPopover title="Title" content="right prompts info" placement="right">
  <ElButton>right</ElButton>
</ElPopover>
<ElPopover title="Title" content="left-end prompts info" placement="left-end">
  <ElButton>left-end</ElButton>
</ElPopover>
<ElPopover title="Title" content="right-end prompts info" placement="right-end">
  <ElButton>right-end</ElButton>
</ElPopover>
<ElPopover title="Title" content="bottom-start prompts info" placement="bottom-start">
  <ElButton>bottom-start</ElButton>
</ElPopover>
<ElPopover title="Title" content="bottom prompts info" placement="bottom">
  <ElButton>bottom</ElButton>
</ElPopover>
<ElPopover title="Title" content="bottom-end prompts info" placement="bottom-end">
  <ElButton>bottom-end</ElButton>
</ElPopover>`,

  basicUsage: `<ElPopover placement="top-start" title="Title" width={200} trigger="hover" content="this is content...">
  <ElButton>Hover to activate</ElButton>
</ElPopover>
<ElPopover placement="bottom" title="Title" width={200} trigger="click" content="this is content...">
  <ElButton>Click to activate</ElButton>
</ElPopover>
<ElPopover placement="right" title="Title" width={200} trigger="focus" content="this is content...">
  <ElButton>Focus to activate</ElButton>
</ElPopover>
<ElPopover title="Title" width={200} trigger="contextmenu" content="this is content...">
  <ElButton>contextmenu to activate</ElButton>
</ElPopover>
<ElPopover visible={visible} title="Title" width={200} content="this is content...">
  <ElButton onClick={() => setVisible((v) => !v)}>Manual to activate</ElButton>
</ElPopover>`,

  virtualTriggering: `const [buttonEl, setButtonEl] = useState<HTMLSpanElement | null>(null);

<span ref={setButtonEl} style={{ display: "inline-block" }}>
  <ElButton>Click me</ElButton>
</span>
<ElPopover virtualTriggering virtualRef={buttonEl} trigger="click" title="With title" content={<span>Some content</span>} />`,

  nestedInformation: `<ElPopover placement="right" width={400} trigger="click" content={<ElTable data={gridData}>...</ElTable>}>
  <ElButton>Click to activate</ElButton>
</ElPopover>

<ElPopover width={300} popperStyle={{ padding: 20 }} content={<ProfileCard />}>
  <ElAvatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
</ElPopover>`,

  nestedOperation: `<ElPopover visible={visible} placement="top" width={180} content={
  <>
    <p>Are you sure to delete this?</p>
    <div style={{ textAlign: "right" }}>
      <ElButton size="small" text onClick={() => setVisible(false)}>cancel</ElButton>
      <ElButton size="small" type="primary" onClick={() => setVisible(false)}>confirm</ElButton>
    </div>
  </>
}>
  <ElButton onClick={() => setVisible(true)}>Delete</ElButton>
</ElPopover>`,

  directiveUsage: `<span ref={setButtonEl} style={{ display: "inline-block" }}>
  <ElButton>Click me</ElButton>
</span>
<ElPopover
  virtualTriggering
  virtualRef={buttonEl}
  trigger="click"
  title="With title"
  persistent
  content={<span>Some content</span>}
/>`,
};

const API_MD = `
## Popover API

### Popover Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| content | 内容 | ^[string] / ^[ReactNode] | — |
| width | 宽度 | ^[string] / ^[number] | 150 |
| placement | 弹出位置 | ^[string] | bottom |
| effect | 主题 | ^[enum]\`'dark' \\| 'light'\` | light |
| trigger | 触发方式 | ^[enum] / ^[array] | click |
| trigger-keys | 键盘触发键 | ^[array] | — |
| visible | 受控显示状态 | ^[boolean] | — |
| show-after / hide-after | 显示 / 隐藏延迟 | ^[number] | 0 / 200 |
| disabled | 是否禁用 | ^[boolean] | false |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| offset | 与触发元素的距离 | ^[number] | 12 |
| enterable | 鼠标是否可进入弹出内容 | ^[boolean] | true |
| popper-class / popper-style | 弹层类名 / 样式 | ^[string] / ^[object] | — |
| teleported | 是否挂载到 appendTo | ^[boolean] | true |
| append-to | 挂载目标 | ^[string] / ^[HTMLElement] | — |
| persistent | 不可见时是否保留 DOM | ^[boolean] | true |
| transition | 过渡动画名 | ^[string] | el-fade-in-linear |
| virtual-triggering | 虚拟触发 | ^[boolean] | false |
| virtual-ref | 虚拟触发参照物 | ^[HTMLElement] / ^[object] | — |
| z-index | 层级 | ^[number] | — |

### Popover Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐状态变化 | ^[Function]\`(visible: boolean) => void\` |
| onBeforeEnter | 进入动画前 | ^[Function]\`() => void\` |
| onAfterEnter | 进入动画后 | ^[Function]\`() => void\` |
| onBeforeLeave | 离开动画前 | ^[Function]\`() => void\` |
| onAfterLeave | 离开动画后 | ^[Function]\`() => void\` |

### Popover Exposes

| 方法 | 说明 |
| --- | --- |
| show() | 立即显示 |
| hide() | 立即隐藏 |
`;

export default function PopoverPage() {
  return (
    <>
      <h1>Popover 弹出框</h1>

      <Heading level={2}>展示位置</Heading>
      <p>Popover 弹出框提供 9 种展示位置。</p>
      <p>
        使用 <code>content</code> 属性来设置悬停时显示的信息。由{" "}
        <code>placement</code> 属性决定 Popover
        弹出框的位置。该属性值格式为：<code>[方向]-[对齐位置]</code>，可供选择的四个方向分别是
        <code>top</code>、<code>left</code>、<code>right</code>、
        <code>bottom</code>，可供选择的三种对齐方式分别是<code>start</code>、
        <code>end</code>、
        <code>null</code>，默认的对齐方式为null。以{" "}
        <code>placement=&quot;left-end&quot;</code>{" "}
        为例，Popover
        弹出框会显示在悬停元素的左侧，且提示信息的底部与悬停元素的底部对齐。
      </p>
      <DemoBlock source={SOURCES.placement}>
        <PopoverPlacement />
      </DemoBlock>

      <Heading level={2}>基础用法</Heading>
      <p>
        Popover 是在 <code>ElTooltip</code>{" "}
        基础上开发出来的。因此对于重复属性，请参考 Tooltip
        的文档，在此文档中不做详尽解释。
      </p>
      <p>
        <code>trigger</code> 属性被用来决定 popover
        的触发方式，支持的触发方式： <code>hover</code>、<code>click</code>、
        <code>focus</code> 或 <code>contextmenu</code>。如果你想手动控制它，可以设置{" "}
        <code>:visible</code> 属性。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <PopoverBasicUsage />
      </DemoBlock>

      <Heading level={2}>虚拟触发</Heading>
      <p>
        像 Tooltip一样，Popover
        可以由虚拟元素触发，这个功能就很适合使用在触发元素和展示内容元素是分开的场景。通常我们使用{" "}
        <code>#reference</code> 来放置我们的触发元素， 用{" "}
        <code>virtual-ref</code> API，您可以任意设置您的触发元素
        但注意到触发元素应该是接受 <code>mouse</code> 和 <code>keyboard</code>{" "}
        事件的元素。
      </p>
      <DocsContent
        source={`:::warning

\`v-popover\` 将被废弃，请使用 \`virtual-ref\` 作为替代。

:::`}
      />
      <DemoBlock source={SOURCES.virtualTriggering}>
        <PopoverVirtualTriggering />
      </DemoBlock>

      <Heading level={2}>内容可扩展</Heading>
      <p>可以在 Popover 中嵌套其它组件，以下为嵌套表格的例子。</p>
      <p>
        利用插槽取代 <code>content</code> 属性
      </p>
      <DemoBlock source={SOURCES.nestedInformation}>
        <PopoverNestedInformation />
      </DemoBlock>

      <Heading level={2}>嵌套操作</Heading>
      <p>当然，你还可以嵌套操作，它比使用dialog更加轻量。</p>
      <DemoBlock source={SOURCES.nestedOperation}>
        <PopoverNestedOperation />
      </DemoBlock>

      <Heading level={2}>指令</Heading>
      <p>
        您可以使用指令性方式弹出窗口，但这种方法<strong>不再推荐</strong>{" "}
        ，因为这使得应用程序变得复杂， 您可以参考虚拟触发来实现一样的效果。
      </p>
      <DemoBlock source={SOURCES.directiveUsage}>
        <PopoverDirectiveUsage />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
