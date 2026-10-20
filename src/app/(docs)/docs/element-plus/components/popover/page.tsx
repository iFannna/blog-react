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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="reference">\` | 直接包住触发元素 | — |
| \`<slot>\` | \`content\` 属性 | 传节点 |
| \`v-popover\` 指令 | \`virtualTriggering\` + \`virtualRef\` | 用元素 ref 作为参照物 |

**实现说明**：Popover 本质是 Tooltip 的包装，与官方一致：
默认 \`effect\` 为 light、\`trigger\` 为 click；popperClass 为
\`el-popover\` + 用户类名 +（有 content 时）\`el-popover--plain\`，
\`--plain\` 去掉默认内边距，让内容自己控制留白。
`;

export default function PopoverPage() {
  return (
    <>
      <h1>Popover 弹出框</h1>
      <p>点击或悬停在元素上时弹出的气泡卡片。</p>

      <Heading level={2}>弹出位置</Heading>
      <p>
        通过 <code>placement</code> 设置弹出位置，共 12 个方向。
      </p>
      <DemoBlock source={SOURCES.placement}>
        <PopoverPlacement />
      </DemoBlock>

      <Heading level={2}>基础用法</Heading>
      <p>
        支持 hover / click / focus / contextmenu 与受控显隐，默认
        <code>trigger</code> 为 click、<code>effect</code> 为 light。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <PopoverBasicUsage />
      </DemoBlock>

      <Heading level={2}>虚拟触发</Heading>
      <p>
        <code>virtualTriggering</code> 让弹层挂在任意元素旁，而不是必须包住触发元素。
      </p>
      <DemoBlock source={SOURCES.virtualTriggering}>
        <PopoverVirtualTriggering />
      </DemoBlock>

      <Heading level={2}>嵌套信息</Heading>
      <p>
        <code>content</code> 可以放表格、头像等复杂内容，<code>width</code> 控制宽度。
      </p>
      <DemoBlock source={SOURCES.nestedInformation}>
        <PopoverNestedInformation />
      </DemoBlock>

      <Heading level={2}>嵌套操作</Heading>
      <p>
        使用受控模式在弹层内放置按钮，实现二次确认之类的操作。
      </p>
      <DemoBlock source={SOURCES.nestedOperation}>
        <PopoverNestedOperation />
      </DemoBlock>

      <Heading level={2}>指令式用法</Heading>
      <p>
        配合 <code>virtualTriggering</code> 与 <code>persistent</code>，
        可以像官方 <code>v-popover</code> 指令一样把弹层绑定到元素上。
      </p>
      <DemoBlock source={SOURCES.directiveUsage}>
        <PopoverDirectiveUsage />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
