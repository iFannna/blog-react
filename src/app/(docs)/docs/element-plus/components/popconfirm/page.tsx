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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="reference">\` | 直接包住触发元素 | — |
| \`<slot name="actions">\` | \`actions\` 渲染函数 | 参数 \`{ confirm, cancel }\` 一致 |
| \`popperRef\` | 未导出 | 需要时通过 Tooltip 层获取 |
| 未导出 \`show()\` | 导出 \`show()\` | 便于受控场景主动展示 |

**实现说明**：官方是 ElTooltip 的包装，固定 \`popperClass="el-popover"\`，
并把 \`fallbackPlacements\` 限定为 \`['bottom', 'top', 'right', 'left']\`
—— 翻转时只在四个主方向间切换，不使用 -start / -end 变体。
默认文案「确定」「取消」取自官方中文语言包。

点击确认或取消后组件会自动关闭（对应官方 \`onConfirm\` / \`onCancel\`
后调用 hide 的行为）；\`trigger\` 默认 click，但可按需改为 hover / focus 等。
`;

export default function PopconfirmPage() {
  return (
    <>
      <h1>Popconfirm 气泡确认框</h1>
      <p>点击元素，弹出气泡样式的确认框。</p>

      <Heading level={2}>弹出位置</Heading>
      <p>
        <code>placement</code> 决定弹出方向，共 12 个方位。
      </p>
      <DemoBlock source={SOURCES.placement}>
        <PopconfirmPlacement />
      </DemoBlock>

      <Heading level={2}>基础用法</Heading>
      <p>
        只需传入 <code>title</code>，确认与取消按钮会自动渲染并关闭气泡。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <PopconfirmBasicUsage />
      </DemoBlock>

      <Heading level={2}>自定义</Heading>
      <p>
        可自定义按钮文案与类型、图标、颜色和宽度；通过 <code>actions</code>
        渲染函数可以完全接管按钮区域。
      </p>
      <DemoBlock source={SOURCES.customize}>
        <PopconfirmCustomize />
      </DemoBlock>

      <Heading level={2}>触发事件</Heading>
      <p>
        <code>onConfirm</code>、<code>onCancel</code> 接收点击事件，可据此更新业务状态。
      </p>
      <DemoBlock source={SOURCES.triggerEvent}>
        <PopconfirmTriggerEvent />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
