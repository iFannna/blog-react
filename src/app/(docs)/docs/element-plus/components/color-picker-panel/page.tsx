import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ColorPickerPanelAlpha,
  ColorPickerPanelBasic,
  ColorPickerPanelBorder,
  ColorPickerPanelDisabled,
  ColorPickerPanelPredefinedColor,
} from "@/components/element-plus/examples/color-picker-panel";

export const metadata: Metadata = {
  title: "ColorPickerPanel 颜色选择面板",
};

const SOURCES = {
  basic: `const [color, setColor] = useState<string | null>("#409EFF");

<ElColorPickerPanel value={color} onChange={setColor} />`,

  alpha: `const [color, setColor] = useState<string | null>(
  "rgba(19, 206, 102, 0.8)",
);

<ElColorPickerPanel value={color} showAlpha onChange={setColor} />`,

  predefinedColor: `const PREDEFINE_COLORS = [
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  // ...
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
];

<ElColorPickerPanel
  value={color}
  showAlpha
  predefine={PREDEFINE_COLORS}
  onChange={setColor}
/>`,

  border: `<ElColorPickerPanel value={color} border={false} onChange={setColor} />

<ElCard>
  <ElColorPickerPanel value={color} border={false} onChange={setColor} />
</ElCard>`,

  disabled: `const [color, setColor] = useState<string | null>("#ff6900");

<ElColorPickerPanel
  value={color}
  disabled
  showAlpha
  predefine={PREDEFINE_COLORS}
  onChange={setColor}
/>`,
};

const API_MD = `
## ColorPickerPanel API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] | — |
| border | 是否显示边框 | ^[boolean] | true |
| disabled | 是否禁用 | ^[boolean] | false |
| showAlpha | 是否显示透明度滑块 | ^[boolean] | false |
| colorFormat | 绑定值的颜色格式 | ^[enum]\`'rgb' \\| 'prgb' \\| 'hex' \\| 'hex3' \\| 'hex4' \\| 'hex6' \\| 'hex8' \\| 'name' \\| 'hsl' \\| 'hsv'\` | showAlpha 为 false 时 'hex'，为 true 时 'rgb' |
| predefine | 预定义颜色 | ^[array]\`string[]\` | — |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| hueSliderClass | 透传给色相滑块的类名 | ^[string] | — |
| hueSliderStyle | 透传给色相滑块的样式 | ^[object]\`CSSProperties\` | — |
| className | 根节点类名 | ^[string] | — |
| style | 根节点样式 | ^[object]\`CSSProperties\` | — |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化时触发 | ^[Function]\`(value: string \\| null) => void\` |

### Slots（React Render Props / ReactNode）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| footer | 底部输入框之后的内容 | ^[ReactNode] |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| color | 当前颜色对象 | ^[object]\`Color\` |
| inputRef | 底部输入框的原生 input | ^[object]\`HTMLInputElement\` |
| update | 手动刷新子组件 | ^[Function]\`() => void\` |
`;

export default function ColorPickerPanelPage() {
  return (
    <>
      <h1>ColorPickerPanel 颜色选择面板</h1>
      <p>
        <code>ColorPickerPanel</code> 是颜色选择器的核心组件。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>颜色选择面板需要一个字符串类型的绑定值。</p>
      <DemoBlock source={SOURCES.basic}>
        <ColorPickerPanelBasic />
      </DemoBlock>

      <Heading level={2}>透明度</Heading>
      <p>
        添加 <code>showAlpha</code> 属性即可启用透明度选择。
      </p>
      <DemoBlock source={SOURCES.alpha}>
        <ColorPickerPanelAlpha />
      </DemoBlock>

      <Heading level={2}>预定义颜色</Heading>
      <p>
        通过 <code>predefine</code> 属性可以配置预定义颜色。
      </p>
      <DemoBlock source={SOURCES.predefinedColor}>
        <ColorPickerPanelPredefinedColor />
      </DemoBlock>

      <Heading level={2}>边框</Heading>
      <p>
        默认情况下颜色选择面板带有边框，某些场景下可以设置
        <code>border</code> 为 <code>false</code> 去掉边框。
      </p>
      <DemoBlock source={SOURCES.border}>
        <ColorPickerPanelBorder />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        <code>disabled</code> 属性决定颜色选择面板是否完全禁用。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <ColorPickerPanelDisabled />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
