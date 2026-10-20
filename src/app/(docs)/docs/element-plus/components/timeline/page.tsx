import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TimelineBasic,
  TimelineCenter,
  TimelineCustomNode,
  TimelineCustomTimestamp,
  TimelineMode,
  TimelineReverse,
} from "@/components/element-plus/examples/timeline";

export const metadata: Metadata = { title: "Timeline 时间线" };

const SOURCES = {
  basic: `const activities = [
  { content: "Event start", timestamp: "2018-04-15" },
  { content: "Approved", timestamp: "2018-04-13" },
  { content: "Success", timestamp: "2018-04-11" },
];

<ElTimeline>
  {activities.map((activity) => (
    <ElTimelineItem key={activity.timestamp} timestamp={activity.timestamp}>
      {activity.content}
    </ElTimelineItem>
  ))}
</ElTimeline>`,

  center: `<ElTimeline>
  <ElTimelineItem center timestamp="2018/4/12" placement="top">
    <ElCard>
      <h4>Update Github template</h4>
      <p>Tom committed 2018/4/12 20:46</p>
    </ElCard>
  </ElTimelineItem>
  <ElTimelineItem timestamp="2018/4/3" placement="top">
    <ElCard>...</ElCard>
  </ElTimelineItem>
  <ElTimelineItem center timestamp="2018/4/2" placement="top">
    Event start
  </ElTimelineItem>
  <ElTimelineItem timestamp="2018/4/2" placement="top">
    Event end
  </ElTimelineItem>
</ElTimeline>`,

  customNode: `<ElTimeline>
  <ElTimelineItem
    timestamp="2018-04-12 20:46"
    size="large"
    type="primary"
    icon={<MoreFilled />}
  >
    Custom icon
  </ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-03 20:46" color="#0bbd87">
    Custom color
  </ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-03 20:46" size="large">
    Custom size
  </ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-03 20:46" type="primary" hollow>
    Custom hollow
  </ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-03 20:46">
    Default node
  </ElTimelineItem>
</ElTimeline>`,

  customTimestamp: `<ElTimeline>
  <ElTimelineItem timestamp="2018/4/12" placement="top">
    <ElCard>
      <h4>Update Github template</h4>
      <p>Tom committed 2018/4/12 20:46</p>
    </ElCard>
  </ElTimelineItem>
  {/* 其余两项同样 placement="top" */}
</ElTimeline>`,

  mode: `const [mode, setMode] = useState<TimelineMode>("start");

<ElRadioGroup
  type="button"
  value={mode}
  onChange={(value) => setMode(value as TimelineMode)}
>
  <ElRadio value="start">start</ElRadio>
  <ElRadio value="alternate">alternate</ElRadio>
  <ElRadio value="alternate-reverse">alternate-reverse</ElRadio>
  <ElRadio value="end">end</ElRadio>
</ElRadioGroup>

<ElTimeline mode={mode}>
  <ElTimelineItem timestamp="2018-04-15">Event start</ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-13">Approved</ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-11">Success</ElTimelineItem>
</ElTimeline>`,

  reverse: `const [reverse, setReverse] = useState(true);

<ElSwitch checked={reverse} activeText="reverse" onCheckedChange={setReverse} />

<ElTimeline reverse={reverse}>
  <ElTimelineItem timestamp="2018-04-15">Event start</ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-13">Approved</ElTimelineItem>
  <ElTimelineItem timestamp="2018-04-11">Success</ElTimelineItem>
</ElTimeline>`,
};

const API_MD = `
## Timeline API

### Timeline Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 时间线与内容的相对位置 | ^[enum]\`'start' \\| 'alternate' \\| 'alternate-reverse' \\| 'end'\` | start |
| reverse | 是否反向排列子项 | ^[boolean] | false |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Timeline Events

无。

### Timeline Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 时间线子项 | \`children\`（ElTimelineItem 集合） |

### Exposes

无。

## Timeline-Item API

### Timeline-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| timestamp | 时间戳内容 | ^[ReactNode] | '' |
| hideTimestamp | 是否隐藏时间戳 | ^[boolean] | false |
| center | 内容是否居中 | ^[boolean] | false |
| placement | 时间戳相对内容的位置 | ^[enum]\`'top' \\| 'bottom'\` | bottom |
| type | 节点类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info'\` | '' |
| color | 节点颜色，传入后覆盖 type 的配色 | ^[string] | '' |
| size | 节点尺寸 | ^[enum]\`'normal' \\| 'large'\` | normal |
| icon | 自定义节点图标（渲染在 node 内） | ^[ReactNode] | — |
| dot | 完全自定义节点内容，等价官方 dot 插槽 | ^[ReactNode] | — |
| hollow | 是否空心节点 | ^[boolean] | false |
| className | 自定义类名 | ^[string] | — |

### Timeline-Item Events

无。

### Timeline-Item Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义内容 | \`children\` |
| dot | 自定义节点 | \`dot\` 属性 |

### Exposes

无。

`;

export default function TimelinePage() {
  return (
    <>
      <h1>Timeline 时间线</h1>
      <p>可视化地呈现时间流信息。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        Timeline
        可拆分成多个按照时间戳排列的活动，时间戳是其区分于其他控件的重要特征，使用时注意与
        Steps 步骤条等区分。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TimelineBasic />
      </DemoBlock>

      <Heading level={2} id="mode">
        Mode <span className="docs-version-tag">2.13.1</span>
      </Heading>
      <p>
        使用 <code>mode</code> 来控制时间线与内容的相对位置。
      </p>
      <DocsContent
        source={`:::tip

在 ^(2.13.1) 之后，\`el-timeline\` 显式设置了内边距样式。如果您在项目中覆盖了 \`ul\` 标签的填充样式，请检查以确保布局正确。

:::`}
      />
      <DemoBlock source={SOURCES.mode}>
        <TimelineMode />
      </DemoBlock>

      <Heading level={2} id="自定义节点样式">
        ⾃定义节点样式
      </Heading>
      <p>可根据实际场景⾃定义节点尺⼨、颜⾊，或直接使⽤图标。</p>
      <DemoBlock source={SOURCES.customNode}>
        <TimelineCustomNode />
      </DemoBlock>

      <Heading level={2} id="自定义时间戳">
        ⾃定义时间戳
      </Heading>
      <p>当内容在垂直⽅向上过⾼时，可将时间戳置于内容之上。</p>
      <DemoBlock source={SOURCES.customTimestamp}>
        <TimelineCustomTimestamp />
      </DemoBlock>

      <Heading level={2}>垂直居中</Heading>
      <p>垂直居中样式的 Timeline-Item</p>
      <DemoBlock source={SOURCES.center}>
        <TimelineCenter />
      </DemoBlock>

      <Heading level={2} id="反向">
        反向 <span className="docs-version-tag">2.11.9</span>
      </Heading>
      <p>使用 reverse 属性来控制节点的顺序。</p>
      <DemoBlock source={SOURCES.reverse}>
        <TimelineReverse />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
