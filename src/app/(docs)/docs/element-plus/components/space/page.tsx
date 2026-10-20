import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  SpaceAlignment,
  SpaceBasic,
  SpaceControlSize,
  SpaceCustomizedSize,
  SpaceFill,
  SpaceFillRatio,
  SpaceLiteralSpacer,
  SpaceVertical,
  SpaceVnodeSpacer,
  SpaceWrap,
} from "@/components/element-plus/examples/space";

export const metadata: Metadata = {
  title: "Space 间距",
};

const SOURCES = {
  basic: `<ElSpace wrap>
  <ElCard style={{ width: 250 }} header={<CardHeader />}>
    <div>List item 1</div>
    ...
  </ElCard>
  {/* 共 3 张卡片 */}
</ElSpace>`,

  vertical: `<ElSpace direction="vertical">
  <ElCard style={{ width: 250 }} header={<CardHeader />}>...</ElCard>
  <ElCard style={{ width: 250 }} header={<CardHeader />}>...</ElCard>
</ElSpace>`,

  controlSize: `const [size, setSize] = useState("default");

<ElSpace direction="vertical" alignment="start" size={30}>
  <ElRadioGroup value={size} onChange={(value) => setSize(value)}>
    <ElRadio value="large">Large</ElRadio>
    <ElRadio value="default">Default</ElRadio>
    <ElRadio value="small">Small</ElRadio>
  </ElRadioGroup>
  <ElSpace wrap size={size}>
    {/* 3 张卡片 */}
  </ElSpace>
</ElSpace>`,

  customizedSize: `const [size, setSize] = useState(20);

<ElSlider value={size} onChange={(value) => setSize(Number(value))} />
<ElSpace wrap size={size}>
  {/* 2 张卡片 */}
</ElSpace>`,

  alignment: `{["center", "flex-start", "flex-end"].map((alignment) => (
  <div key={alignment} style={{ width: 240, marginBottom: 20, padding: 8 }}>
    <ElSpace alignment={alignment}>
      string
      <ElButton> button </ElButton>
      <ElCard header=" header ">body</ElCard>
    </ElSpace>
  </div>
))}`,

  autoWrapping: `<ElSpace wrap>
  {Array.from({ length: 20 }, (_, index) => (
    <div key={index}>
      <ElButton text> Text button </ElButton>
    </div>
  ))}
</ElSpace>`,

  fill: `const [fill, setFill] = useState(true);

fill: <ElSwitch checked={fill} onCheckedChange={setFill} />

<ElSpace fill={fill} wrap>
  {/* 3 张卡片 */}
</ElSpace>`,

  fillRatio: `const [direction, setDirection] = useState("horizontal");
const [fillRatio, setFillRatio] = useState(30);

<ElSpace
  fill
  wrap
  fillRatio={fillRatio}
  direction={direction}
  style={{ width: "100%" }}
>
  {/* 5 张卡片 */}
</ElSpace>`,

  literalSpacer: `<ElSpace size={10} spacer="|">
  <div><ElButton> button 1 </ElButton></div>
  <div><ElButton> button 2 </ElButton></div>
</ElSpace>`,

  vnodeSpacer: `<ElSpace size={10} spacer={<ElDivider direction="vertical" />}>
  <div><ElButton> button 1 </ElButton></div>
  <div><ElButton> button 2 </ElButton></div>
</ElSpace>`,
};

const API_MD = `
## Space API

### Space Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向 | ^[enum]\`'horizontal' \\| 'vertical'\` | horizontal |
| size | 间距，可传尺寸名、数字或 [横向, 纵向] 元组 | ^[enum]\`'small' \\| 'default' \\| 'large'\` / ^[number] / ^[array]\`[number, number]\` | small |
| alignment | 交叉轴对齐方式 | ^[string]\`CSS align-items 取值\` | center |
| wrap | 是否自动换行 | ^[boolean] | false |
| fill | 是否让子项填满整行 | ^[boolean] | false |
| fillRatio | 填满时单个子项的最小宽度百分比 | ^[number] | 100 |
| spacer | 自定义间隔元素，可传字符串或节点 | ^[ReactNode] | — |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Space Events

无。

### Space Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 需要设置间距的内容 | \`children\` |

### Exposes

无。

`;

export default function SpacePage() {
  return (
    <>
      <h1>Space 间距</h1>
      <p>设置组件之间的间距。</p>

      <Heading level={2}>基础用法</Heading>
      <p>相邻组件间增加间距。默认方向为水平，间距为 small（8px）。</p>
      <DemoBlock source={SOURCES.basic}>
        <SpaceBasic />
      </DemoBlock>

      <Heading level={2}>垂直布局</Heading>
      <p>
        使用 <code>direction=&quot;vertical&quot;</code> 让组件纵向排列。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <SpaceVertical />
      </DemoBlock>

      <Heading level={2}>控制间距大小</Heading>
      <p>通过单选组切换 small / default / large 三档预设间距。</p>
      <DemoBlock source={SOURCES.controlSize}>
        <SpaceControlSize />
      </DemoBlock>

      <Heading level={2}>自定义间距大小</Heading>
      <p>通过滑块设置任意数字间距。</p>
      <DemoBlock source={SOURCES.customizedSize}>
        <SpaceCustomizedSize />
      </DemoBlock>

      <Heading level={2}>对齐方式</Heading>
      <p>
        通过 <code>alignment</code> 设置交叉轴对齐方式。
      </p>
      <DemoBlock source={SOURCES.alignment}>
        <SpaceAlignment />
      </DemoBlock>

      <Heading level={2}>自动换行</Heading>
      <p>
        设置 <code>wrap</code> 后超出容器宽度会自动换行。
      </p>
      <DemoBlock source={SOURCES.autoWrapping}>
        <SpaceWrap />
      </DemoBlock>

      <Heading level={2}>填满整行</Heading>
      <p>
        <code>fill</code> 让子项拉伸填满整行。
      </p>
      <DemoBlock source={SOURCES.fill}>
        <SpaceFill />
      </DemoBlock>

      <Heading level={2}>填充比例</Heading>
      <p>
        <code>fillRatio</code> 控制每个子项的最小宽度百分比，并可切换排列方向。
      </p>
      <DemoBlock source={SOURCES.fillRatio}>
        <SpaceFillRatio />
      </DemoBlock>

      <Heading level={2}>字符串分隔符</Heading>
      <p>
        通过 <code>spacer</code> 传入字符串作为间隔元素。
      </p>
      <DemoBlock source={SOURCES.literalSpacer}>
        <SpaceLiteralSpacer />
      </DemoBlock>

      <Heading level={2}>节点分隔符</Heading>
      <p>
        <code>spacer</code> 也可传入任意节点，例如垂直分割线。
      </p>
      <DemoBlock source={SOURCES.vnodeSpacer}>
        <SpaceVnodeSpacer />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
