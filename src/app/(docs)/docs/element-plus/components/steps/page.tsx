import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  StepsBasic,
  StepsCentered,
  StepsSimple,
  StepsVertical,
  StepsWithDescription,
  StepsWithIcon,
  StepsWithStatus,
} from "@/components/element-plus/examples/steps";

export const metadata: Metadata = { title: "Steps 步骤条" };

const SOURCES = {
  basic: `const [active, setActive] = useState(0);
const next = () => setActive((current) => (current > 2 ? 0 : current + 1));

<ElSteps active={active} finishStatus="success" style={{ maxWidth: 600 }}>
  <ElStep title="Step 1" />
  <ElStep title="Step 2" />
  <ElStep title="Step 3" />
</ElSteps>
<ElButton style={{ marginTop: 12 }} onClick={next}>
  Next step
</ElButton>`,

  centered: `<ElSteps active={2} alignCenter style={{ maxWidth: 600 }}>
  <ElStep title="Step 1" description="Some description" />
  <ElStep title="Step 2" description="Some description" />
  <ElStep title="Step 3" description="Some description" />
</ElSteps>`,

  simple: `<ElSteps active={1} simple space={200} style={{ maxWidth: 600 }}>
  <ElStep title="Step 1" icon={<Edit />} />
  <ElStep title="Step 2" icon={<UploadFilled />} />
  <ElStep title="Step 3" icon={<Picture />} />
</ElSteps>

<ElSteps active={1} simple finishStatus="success" style={{ maxWidth: 600 }}>
  <ElStep title="Step 1" />
  <ElStep title="Step 2" />
  <ElStep title="Step 3" />
</ElSteps>`,

  vertical: `<div style={{ height: 300, maxWidth: 600 }}>
  <ElSteps active={1} direction="vertical">
    <ElStep title="Step 1" />
    <ElStep title="Step 2" />
    <ElStep title="Step 3" />
  </ElSteps>
</div>`,

  withDescription: `<ElSteps active={1} style={{ maxWidth: 600 }}>
  <ElStep title="Step 1" description="Some description" />
  <ElStep title="Step 2" description="Some description" />
  <ElStep title="Step 3" description="Some description" />
</ElSteps>`,

  withIcon: `<ElSteps active={1} style={{ maxWidth: 600 }}>
  <ElStep title="Step 1" icon={<Edit />} />
  <ElStep title="Step 2" icon={<Upload />} />
  <ElStep title="Step 3" icon={<Picture />} />
</ElSteps>`,

  withStatus: `<ElSteps active={1} space={200} finishStatus="success" style={{ maxWidth: 600 }}>
  <ElStep title="Done" />
  <ElStep title="Processing" />
  <ElStep title="Step 3" />
</ElSteps>

<ElSteps active={1} processStatus="error" style={{ maxWidth: 600 }}>
  <ElStep title="Done" />
  <ElStep title="Error" />
  <ElStep title="Step 3" />
</ElSteps>`,
};

const API_MD = `
## Steps API

### Steps Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 当前激活步骤的下标 | ^[number] | 0 |
| space | 每个步骤的间距，省略时自适应，支持百分比 | ^[number] / ^[string] | — |
| direction | 显示方向 | ^[enum]\`'horizontal' \\| 'vertical'\` | horizontal |
| alignCenter | 是否居中对齐（横向有效） | ^[boolean] | false |
| simple | 是否简洁模式 | ^[boolean] | false |
| processStatus | 当前步骤的状态 | ^[enum]\`'wait' \\| 'process' \\| 'finish' \\| 'error' \\| 'success'\` | process |
| finishStatus | 已完成步骤的状态 | ^[enum]\`同上\` | finish |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Steps Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 当前激活步骤变化，等价官方 \`change\` | ^[Function]\`(newActive, oldActive) => void\` |

### Steps Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 步骤子项 | children |

### Step Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[ReactNode] | — |
| description | 描述 | ^[ReactNode] | — |
| icon | 自定义图标 | ^[ReactNode] | — |
| status | 当前步骤状态，传入后覆盖自动推导 | ^[enum]\`'wait' \\| 'process' \\| 'finish' \\| 'error' \\| 'success'\` | — |
| className | 自定义类名 | ^[string] | — |

### Step Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| icon | 自定义图标 | \`icon\` 属性 |
| title | 自定义标题 | \`title\` 属性 |
| description | 自定义描述 | \`description\` 属性 |
`;

export default function StepsPage() {
  return (
    <>
      <h1>Steps 步骤条</h1>
      <p>
        引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>简单的步骤条。</p>
      <p>
        设置 <code>active</code> 属性，接受一个 <code>Number</code>，表明步骤的 index，从 0 开始。需要定宽的步骤条时，设置 <code>space</code> 属性即可，它接受 <code>Number</code>，单位为 <code>px</code>，如果不设置，则为自适应。设置 <code>finish-status</code> 属性可以改变已经完成的步骤的状态。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <StepsBasic />
      </DemoBlock>

      <Heading level={2}>含状态的步骤条</Heading>
      <p>每一步骤显示出该步骤的状态。</p>
      <p>
        也可以使用 <code>title</code> 具名插槽，可以用 <code>slot</code> 的方式来取代属性的设置，在本文档最后的列表中有所有的插槽可供参考。
      </p>
      <DemoBlock source={SOURCES.withStatus}>
        <StepsWithStatus />
      </DemoBlock>

      <Heading level={2}>居中的步骤条</Heading>
      <p>标题和描述可以居中。</p>
      <DemoBlock source={SOURCES.centered}>
        <StepsCentered />
      </DemoBlock>

      <Heading level={2}>带描述的步骤栏</Heading>
      <p>每一步都有描述。</p>
      <DemoBlock source={SOURCES.withDescription}>
        <StepsWithDescription />
      </DemoBlock>

      <Heading level={2}>带图标的步骤条</Heading>
      <p>可以在步骤栏中使用各种自定义图标。</p>
      <p>
        通过 <code>icon</code> 属性来设置图标，图标的类型可以参考 Icon 组件的文档，除此以外，还能通过具名 <code>slot</code> 来使用自定义的图标。
      </p>
      <DemoBlock source={SOURCES.withIcon}>
        <StepsWithIcon />
      </DemoBlock>

      <Heading level={2}>垂直的步骤条</Heading>
      <p>垂直方向的步骤条。</p>
      <p>
        只需要在 <code>el-steps</code> 元素中设置 <code>direction</code> 属性为 <code>vertical</code> 即可。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <StepsVertical />
      </DemoBlock>

      <Heading level={2}>简洁风格的步骤条</Heading>
      <p>
        设置 <code>simple</code> 可应用简洁风格，该条件下 <code>align-center</code> / <code>description</code> / <code>direction</code> / <code>space</code> 都将失效。
      </p>
      <DemoBlock source={SOURCES.simple}>
        <StepsSimple />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
