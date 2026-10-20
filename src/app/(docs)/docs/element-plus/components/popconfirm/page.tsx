import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  PopconfirmBasicUsage,
  PopconfirmCustomize,
  PopconfirmPlacement,
  PopconfirmTriggerEvent,
} from "@/components/element-plus/examples/overlay";

export const metadata: Metadata = { title: "Popconfirm 气泡确认框" };

const SOURCES = {
  placement: `<ElPopconfirm title="top-start prompts info" placement="top-start">
  <ElButton style={{ width: 110 }}>top-start</ElButton>
</ElPopconfirm>
<ElPopconfirm title="top prompts info" placement="top">
  <ElButton style={{ width: 110 }}>top</ElButton>
</ElPopconfirm>
<ElPopconfirm title="top-end prompts info" placement="top-end">
  <ElButton style={{ width: 110 }}>top-end</ElButton>
</ElPopconfirm>
<ElPopconfirm title="left-start prompts info" placement="left-start">
  <ElButton style={{ width: 110 }}>left-start</ElButton>
</ElPopconfirm>
<ElPopconfirm title="right-start prompts info" placement="right-start">
  <ElButton style={{ width: 110 }}>right-start</ElButton>
</ElPopconfirm>
<ElPopconfirm title="left prompts info" placement="left">
  <ElButton style={{ width: 110 }}>left</ElButton>
</ElPopconfirm>
<ElPopconfirm title="right prompts info" placement="right">
  <ElButton style={{ width: 110 }}>right</ElButton>
</ElPopconfirm>
<ElPopconfirm title="left-end prompts info" placement="left-end">
  <ElButton style={{ width: 110 }}>left-end</ElButton>
</ElPopconfirm>
<ElPopconfirm title="right-end prompts info" placement="right-end">
  <ElButton style={{ width: 110 }}>right-end</ElButton>
</ElPopconfirm>
<ElPopconfirm title="bottom-start prompts info" placement="bottom-start">
  <ElButton style={{ width: 110 }}>bottom-start</ElButton>
</ElPopconfirm>
<ElPopconfirm title="bottom prompts info" placement="bottom">
  <ElButton style={{ width: 110 }}>bottom</ElButton>
</ElPopconfirm>
<ElPopconfirm title="bottom-end prompts info" placement="bottom-end">
  <ElButton style={{ width: 110 }}>bottom-end</ElButton>
</ElPopconfirm>`,

  basicUsage: `<ElPopconfirm title="Are you sure to delete this?">
  <ElButton>Delete</ElButton>
</ElPopconfirm>`,

  customize: `const [clicked, setClicked] = useState(false);

<ElPopconfirm
  width={220}
  icon={<InfoFilled />}
  iconColor="#626AEF"
  title="Are you sure to delete this?"
  onCancel={() => setClicked(true)}
  actions={({ confirm, cancel }) => (
    <>
      <ElButton size="small" onClick={cancel}>No!</ElButton>
      <ElButton type="danger" size="small" disabled={!clicked} onClick={confirm}>
        Yes?
      </ElButton>
    </>
  )}
>
  <ElButton>Delete</ElButton>
</ElPopconfirm>`,

  triggerEvent: `const [event, setEvent] = useState("等待操作");

<ElPopconfirm
  confirmButtonText="Yes"
  cancelButtonText="No"
  icon={<InfoFilled />}
  iconColor="#626AEF"
  title="Are you sure to delete this?"
  onConfirm={() => setEvent("confirm!")}
  onCancel={() => setEvent("cancel!")}
>
  <ElButton>Delete</ElButton>
</ElPopconfirm>
<span>{event}</span>`,
};

const API_MD = `
## Popconfirm API

### Popconfirm Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| effect | 主题 | ^[enum]\`'dark' \\| 'light'\` | light |
| confirm-button-text | 确认按钮文案 | ^[string] | 确定 |
| cancel-button-text | 取消按钮文案 | ^[string] | 取消 |
| confirm-button-type | 确认按钮类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info' \\| 'text'\` | primary |
| cancel-button-type | 取消按钮类型 | ^[enum]\`同上\` | text |
| icon | 自定义图标 | ^[ReactNode] | QuestionFilled |
| icon-color | 图标颜色 | ^[string] | #f90 |
| hide-icon | 是否隐藏图标 | ^[boolean] | false |
| hide-after | 隐藏延迟（毫秒） | ^[number] | 200 |
| teleported | 是否挂载到 appendTo | ^[boolean] | true |
| persistent | 不可见时是否保留 DOM | ^[boolean] | false |
| width | 宽度（最小 150px） | ^[string] / ^[number] | 150 |
| placement | 弹出位置 | ^[string] | bottom |
| trigger | 触发方式，默认 click | ^[enum] / ^[array] | click |
| visible | 受控显示状态 | ^[boolean] | — |
| show-after | 显示延迟（毫秒） | ^[number] | 0 |
| popper-class | 弹层类名 | ^[string] | — |
| append-to | 挂载目标 | ^[string] / ^[HTMLElement] | — |
| virtual-triggering | 是否启用虚拟触发 | ^[boolean] | false |
| virtual-ref | 虚拟触发参照物 | ^[HTMLElement] / ^[object] | — |
| z-index | 层级 | ^[number] | — |

其余 Tooltip 属性（除 \`popper-class\`、\`popper-style\`、\`fallback-placements\`）同样可用。

### Popconfirm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onConfirm | 点击确认按钮 | ^[Function]\`(event: MouseEvent) => void\` |
| onCancel | 点击取消按钮 | ^[Function]\`(event: MouseEvent) => void\` |
| onVisibleChange | 显隐状态变化 | ^[Function]\`(visible: boolean) => void\` |

### Popconfirm Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| reference | 触发元素 | \`children\` |
| actions | 自定义底部按钮区，参数为 \`{ confirm, cancel }\` | \`actions\` 渲染函数 |

### Popconfirm Exposes

| 方法 | 说明 |
| --- | --- |
| hide() | 立即隐藏 |
| show() | 立即显示 |
`;

export default function PopconfirmPage() {
  return (
    <>
      <h1>Popconfirm 气泡确认框</h1>
      <p>点击某个元素弹出一个简单的气泡确认框</p>

      <Heading level={2}>展示位置</Heading>
      <p>Popconfirm 提供 9 种展示位置。</p>
      <p>
        使用 <code>title</code> 属性来设置点击参考元素时显示的信息。由{" "}
        <code>placement</code> 属性决定 Popconfirm 的位置。该属性值格式为：
        <code>[方向]-[对齐位置]</code>，可供选择的四个方向分别是
        <code>top</code>、<code>left</code>、<code>right</code>、
        <code>bottom</code>，可供选择的三种对齐方式分别是<code>start</code>、
        <code>end</code>、<code>null</code>，默认的对齐方式为null。以{" "}
        <code>placement=&quot;left-end&quot;</code>{" "}
        为例，气泡确认框会显示在悬停元素的左侧，且提示信息的底部与悬停元素的底部对齐。
      </p>
      <DemoBlock source={SOURCES.placement}>
        <PopconfirmPlacement />
      </DemoBlock>

      <Heading level={2}>基础用法</Heading>
      <p>
        Popconfirm 的属性与 Popover
        很类似，因此对于重复属性，请参考 Popover
        的文档，在此文档中不做详尽解释。
      </p>
      <p>
        在 Popconfirm 中，只有 <code>title</code> 属性可用，<code>content</code>{" "}
        属性会被忽略。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <PopconfirmBasicUsage />
      </DemoBlock>

      <Heading level={2}>自定义弹出框的内容</Heading>
      <p>可以在 Popconfirm 中自定义内容。</p>
      <DemoBlock source={SOURCES.customize}>
        <PopconfirmCustomize />
      </DemoBlock>

      <Heading level={2}>多种让 Popconfirm 出现的方法</Heading>
      <p>点击按钮触发事件</p>
      <DemoBlock source={SOURCES.triggerEvent}>
        <PopconfirmTriggerEvent />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
