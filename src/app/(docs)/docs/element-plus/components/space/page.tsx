import type { Metadata } from "next";
import Link from "next/link";
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
      <p>
        虽然我们拥有{" "}
        <Link href="/docs/element-plus/components/divider">Divider 组件</Link>
        ，但很多时候我们需要不是一个被{" "}
        <Link href="/docs/element-plus/components/divider">Divider 组件</Link>{" "}
        分割开的页面结构，因此我们会重复的使用很多的{" "}
        <Link href="/docs/element-plus/components/divider">Divider 组件</Link>
        ，这在我们的开发效率上造成了一定的困扰。<strong>间距组件</strong>
        就是为了解决这种困扰应运而生的。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>最基础的用法，通过这个组件来给组件之间提供统一的间距。</p>
      <p>通过间距组件来给多个组件之间提供间距</p>
      <DemoBlock source={SOURCES.basic}>
        <SpaceBasic />
      </DemoBlock>

      <Heading level={2}>垂直布局</Heading>
      <p>
        使用 <code>direction</code> 来控制布局的方式, 背后实际上是利用了{" "}
        <code>flex-direction</code> 来控制.
      </p>
      <p>我们也提供垂直布局方式。</p>
      <DemoBlock source={SOURCES.vertical}>
        <SpaceVertical />
      </DemoBlock>

      <Heading level={2}>控制间距的大小</Heading>
      <p>
        通过调整 <code>size</code> 的值来控制间距的大小
      </p>
      <p>
        你可以使用内置的尺寸 <code>small</code>、<code>default</code>、
        <code>large</code> 来设置大小，这些尺寸分别对应 <code>8px</code>、
        <code>12px</code>、<code>16px</code>。 默认的间距大小为{" "}
        <code>small</code>，也就是 <code>8px</code>。
      </p>
      <p>您也可以通过自定义的 size 来控制大小，参见下一个部分。</p>
      <DemoBlock source={SOURCES.controlSize}>
        <SpaceControlSize />
      </DemoBlock>

      <Heading level={2}>自定义 Size</Heading>
      <p>
        很多时候，内建的大小不满足设计师的要求，我们可以通过传入自己定义的大小
        (数值类型) 来设置。
      </p>
      <DemoBlock source={SOURCES.customizedSize}>
        <SpaceCustomizedSize />
      </DemoBlock>
      <DocsContent
        source={`:::tip

不要让 \`ElSpace\` 与使用依赖父元素百分比宽度（或高度）的元素一起使用（例如 \`ElSlider\`），这样会造成光标不同步。

:::`}
      />

      <Heading level={2}>自动换行</Heading>
      <p>
        在 <strong>水平 (horizontal) </strong> 模式下，通过使用{" "}
        <code>wrap</code>（<strong>布尔类型</strong>）来控制自动换行行为。
      </p>
      <p>
        利用 <code>wrap</code> 属性控制换行
      </p>
      <DemoBlock source={SOURCES.autoWrapping}>
        <SpaceWrap />
      </DemoBlock>

      <Heading level={2}>行间分隔符</Heading>
      <p>
        有时候，仅仅在行间加空白并不能满足我们的日常需求，此时分隔符 (spacer)
        就可以发挥非常好的作用了。
      </p>

      <Heading level={2}>字母数字类型分隔符</Heading>
      <DemoBlock source={SOURCES.literalSpacer}>
        <SpaceLiteralSpacer />
      </DemoBlock>

      <Heading level={2}>分隔符还可以是 VNode 类型</Heading>
      <DemoBlock source={SOURCES.vnodeSpacer}>
        <SpaceVnodeSpacer />
      </DemoBlock>

      <Heading level={2}>对齐方式</Heading>
      <p>
        设置该值可以调整所有子节点在容器内的对齐方式，可设置的值与{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/align-items"
          target="_blank"
          rel="noreferrer"
        >
          align-items{" "}
        </a>
        一致。
      </p>
      <p>
        使用 <code>alignment</code> 属性来对齐
      </p>
      <DemoBlock source={SOURCES.alignment}>
        <SpaceAlignment />
      </DemoBlock>

      <Heading level={2}>填充容器</Heading>
      <p>
        通过 <code>fill</code>
        <strong>（布尔类型）</strong>参数，您可以控制子节点是否自动填充容器。
      </p>
      <p>
        下面的例子中，当设置为 <code>fill</code>{" "}
        时，子节点的宽度会自动适配容器的宽度。
      </p>
      <p>用 fill 属性让子节点自动填充容器</p>
      <DemoBlock source={SOURCES.fill}>
        <SpaceFill />
      </DemoBlock>
      <p>
        也可以使用 <code>fillRatio</code> 参数，自定义填充的比例，默认值为{" "}
        <code>100</code>，代表基于父容器宽度的 <code> 100%</code> 进行填充
      </p>
      <p>
        需要注意的是，水平布局和垂直布局的表现形式稍有不同，具体的效果可以查看下面的例子
      </p>
      <p>用 fillRatio 自定义填充比例</p>
      <DemoBlock source={SOURCES.fillRatio}>
        <SpaceFillRatio />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
