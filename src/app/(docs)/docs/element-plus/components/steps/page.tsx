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
      <p>引导用户按照流程完成任务的导航条。</p>

      <Heading level={2}>基础用法</Heading>
      <p>通过按钮推进当前步骤，完成后以 success 状态展示。</p>
      <DemoBlock source={SOURCES.basic}>
        <StepsBasic />
      </DemoBlock>

      <Heading level={2}>状态</Heading>
      <p>
        <code>finishStatus</code> 与 <code>processStatus</code> 控制已完成与进行中步骤的状态，
        支持 success 与 error。
      </p>
      <DemoBlock source={SOURCES.withStatus}>
        <StepsWithStatus />
      </DemoBlock>

      <Heading level={2}>居中对齐</Heading>
      <p>
        设置 <code>alignCenter</code> 让标题与描述居中。
      </p>
      <DemoBlock source={SOURCES.centered}>
        <StepsCentered />
      </DemoBlock>

      <Heading level={2}>带描述</Heading>
      <p>通过 description 为每个步骤补充说明。</p>
      <DemoBlock source={SOURCES.withDescription}>
        <StepsWithDescription />
      </DemoBlock>

      <Heading level={2}>带图标</Heading>
      <p>通过 icon 替换默认的序号。</p>
      <DemoBlock source={SOURCES.withIcon}>
        <StepsWithIcon />
      </DemoBlock>

      <Heading level={2}>纵向步骤条</Heading>
      <p>
        设置 <code>direction=&quot;vertical&quot;</code> 纵向排列，容器需有确定高度。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <StepsVertical />
      </DemoBlock>

      <Heading level={2}>简洁风格</Heading>
      <p>
        设置 <code>simple</code> 应用简洁样式，可通过 <code>space</code> 指定间距。
      </p>
      <DemoBlock source={SOURCES.simple}>
        <StepsSimple />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
