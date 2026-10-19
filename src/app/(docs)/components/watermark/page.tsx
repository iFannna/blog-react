import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  WatermarkBasic,
  WatermarkCustom,
  WatermarkImage,
  WatermarkMultiLine,
} from "@/components/docs/examples/watermark";

export const metadata: Metadata = { title: "Watermark 水印" };

const SOURCES = {
  basic: `<ElWatermark font={{ color: "rgba(0, 0, 0, .15)" }}>
  <div style={{ height: 500 }} />
</ElWatermark>`,

  multiLine: `<ElWatermark
  font={{ color: "rgba(0, 0, 0, .15)" }}
  content={["Element+", "Element Plus"]}
>
  <div style={{ height: 500 }} />
</ElWatermark>`,

  image: `<ElWatermark
  width={130}
  height={30}
  image="https://element-plus.org/images/element-plus-logo.svg"
>
  <div style={{ height: 500 }} />
</ElWatermark>`,

  custom: `const [content, setContent] = useState("Element Plus");
const [color, setColor] = useState("rgba(0, 0, 0, .15)");
const [fontSize, setFontSize] = useState(16);
const [zIndex, setZIndex] = useState(9);
const [rotate, setRotate] = useState(-22);
const [gap, setGap] = useState<[number, number]>([100, 100]);
const [offsetLeft, setOffsetLeft] = useState<number | null>(null);
const [offsetTop, setOffsetTop] = useState<number | null>(null);

<ElWatermark
  content={content}
  font={{ fontSize, color }}
  zIndex={zIndex}
  rotate={rotate}
  gap={gap}
  offset={[offsetLeft ?? undefined, offsetTop ?? undefined]}
>
  <div style={{ flex: "auto" }}>
    <h1>Element Plus</h1>
    <h2>A Vue 3 based component library for designers and developers</h2>
  </div>
</ElWatermark>

<ElForm labelPosition="top" labelWidth="50px">
  <ElFormItem label="Content">
    <ElInput value={content} onChange={setContent} />
  </ElFormItem>
  <ElFormItem label="Color">
    <ElInput value={color} onChange={setColor} />
  </ElFormItem>
  <ElFormItem label="FontSize">
    <ElSlider value={fontSize} onChange={(v) => setFontSize(Number(v))} />
  </ElFormItem>
  <ElFormItem label="zIndex">
    <ElSlider value={zIndex} onChange={(v) => setZIndex(Number(v))} />
  </ElFormItem>
  <ElFormItem label="Rotate">
    <ElSlider
      value={rotate}
      min={-180}
      max={180}
      onChange={(v) => setRotate(Number(v))}
    />
  </ElFormItem>
  <ElFormItem label="Gap">
    <ElSpace>
      <ElInputNumber
        value={gap[0]}
        controlsPosition="right"
        onChange={(v) => setGap((prev) => [v ?? 0, prev[1]])}
      />
      <ElInputNumber
        value={gap[1]}
        controlsPosition="right"
        onChange={(v) => setGap((prev) => [prev[0], v ?? 0])}
      />
    </ElSpace>
  </ElFormItem>
  <ElFormItem label="Offset">
    <ElSpace>
      <ElInputNumber value={offsetLeft} onChange={setOffsetLeft} />
      <ElInputNumber value={offsetTop} onChange={setOffsetTop} />
    </ElSpace>
  </ElFormItem>
</ElForm>`,
};

const API_MD = `
## Watermark API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 水印宽度，省略时取 content 自身宽度 | ^[number] | 120 |
| height | 水印高度，省略时取 content 自身高度 | ^[number] | 64 |
| rotate | 绘制时的旋转角度，单位 ° | ^[number] | -22 |
| z-index | 水印元素的 z-index | ^[number] | 9 |
| image | 图片地址，优先级高于 content，建议导出 2x/3x | ^[string] | — |
| content | 水印文字，传数组表示多行 | ^[string] / ^[array]\`string[]\` | Element Plus |
| font | 文字样式 | [Font](#font) | [Font](#font) |
| gap | 水印之间的间距 | ^[array]\`[number, number]\` | [100, 100] |
| offset | 水印相对容器左上角的偏移，默认为 gap/2 | ^[array]\`[number, number]\` | [gap[0]/2, gap[1]/2] |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

> 说明：官方 \`offset\` 语义是「未传该元素则回退到 gap/2」。React 没有可选数组元素的写法，
> 这里用 \`(number | undefined)[]\`，\`undefined\` 等价于官方未传：\`offset={[undefined, 20]}\`
> 表示水平方向取 gap[0]/2、垂直方向取 20。

### Font

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 字体颜色 | ^[string] | rgba(0,0,0,.15) |
| fontSize | 字体大小 | ^[number] / ^[string] | 16 |
| fontWeight | 字体粗细 | ^[enum]\`'normal' \\| 'bold' \\| 'lighter' \\| 'bolder' \\| number\` | normal |
| fontFamily | 字体族 | ^[string] | sans-serif |
| fontGap ^(2.11.5) | 多行文字的行间距 | ^[number] | 3 |
| fontStyle | 字体风格 | ^[enum]\`'none' \\| 'normal' \\| 'italic' \\| 'oblique'\` | normal |
| textAlign | 文字水平对齐 | ^[enum]\`'left' \\| 'right' \\| 'center' \\| 'start' \\| 'end'\` | center |
| textBaseline | 文字基线 | ^[enum]\`'top' \\| 'hanging' \\| 'middle' \\| 'alphabetic' \\| 'ideographic' \\| 'bottom'\` | hanging |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 承载水印的容器内容，React 里直接用 \`children\` |

### 实现说明

水印由 canvas 绘制：先在按 align/baseline 对齐的小画布上画出文字或图片，旋转后取外接矩形，
再按 gap 平铺出可 \`background-repeat\` 的单元，最后把 \`toDataURL()\` 的结果设为绝对定位覆盖层的背景图。
容器上挂 \`MutationObserver\`，一旦水印节点被删除或被改样式就立即重绘，与官方 \`reRendering\` 逻辑一致。
绘制用 \`devicePixelRatio\` 放大画布，保证高分屏下不模糊。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\`（无） | 无 | 组件无双向绑定，纯受控 props |
| \`<slot />\` | \`children\` | default 插槽即 React children |
| \`gap\` 元组 | \`gap: [number, number]\` | 一致 |
| \`offset\` 可选元组 | \`offset: (number \\| undefined)[]\` | 元素为 \`undefined\` 即按官方未传处理，回退 gap/2 |
| \`font\` 对象 | \`font: WatermarkFont\` | 字段同名同默认值 |
| \`z-index\` | \`zIndex\` | kebab-case 转 camelCase |

## 未实现的官方能力

- 无。官方的全部 props（\`width\` / \`height\` / \`rotate\` / \`z-index\` / \`image\` / \`content\` /
  \`font\` / \`gap\` / \`offset\`）与 default 插槽均已实现，DOM 结构与绘制算法与官方源码逐行对应。
- 文档站的「Custom configuration」示例中，官方用 \`el-color-picker\` 的 \`show-alpha\` 取色。
  本项目尚未复刻 ColorPicker，示例里改用可输入 rgba 字符串的 \`ElInput\` 代替，
  并在明暗模式切换时把颜色重置为对应的默认值（等价官方 \`watch(isDark)\` 的行为）。
`;

export default function WatermarkPage() {
  return (
    <>
      <h1>Watermark 水印</h1>
      <p>在页面上添加特定的文字或图案。</p>

      <Heading level={2}>基础用法</Heading>
      <p>最简单的用法。</p>
      <DemoBlock source={SOURCES.basic}>
        <WatermarkBasic />
      </DemoBlock>

      <Heading level={2}>多行水印</Heading>
      <p>
        通过 <code>content</code> 设置一个字符串数组来指定多行文本水印内容。
      </p>
      <DemoBlock source={SOURCES.multiLine}>
        <WatermarkMultiLine />
      </DemoBlock>

      <Heading level={2}>图片水印</Heading>
      <p>
        通过 <code>image</code> 指定图片地址。为保证图片高清且不被拉伸，请设置 width 和
        height，并上传至少两倍的宽高。
      </p>
      <DemoBlock source={SOURCES.image}>
        <WatermarkImage />
      </DemoBlock>

      <Heading level={2}>自定义配置</Heading>
      <p>通过配置自定义参数预览水印效果。</p>
      <DemoBlock source={SOURCES.custom}>
        <WatermarkCustom />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
