import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ColorPickerAlpha,
  ColorPickerBasic,
  ColorPickerPredefinedColor,
  ColorPickerSizes,
} from "@/components/element-plus/examples/color-picker";

export const metadata: Metadata = {
  title: "ColorPicker 颜色选择器",
};

const SOURCES = {
  basic: `const [color1, setColor1] = useState<string | null>("#409EFF");
const [color2, setColor2] = useState<string | null>(null);

<div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
  <span style={{ marginRight: 16 }}>With default value</span>
  <ElColorPicker value={color1} onChange={setColor1} />
</div>
<div style={{ display: "flex", alignItems: "center" }}>
  <span style={{ marginRight: 16 }}>With no default value</span>
  <ElColorPicker value={color2} onChange={setColor2} />
</div>`,

  alpha: `const [color, setColor] = useState<string | null>(
  "rgba(19, 206, 102, 0.8)",
);

<ElColorPicker value={color} showAlpha onChange={setColor} />`,

  predefinedColor: `const PREDEFINE_COLORS = [
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  // ...
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
];

const [color, setColor] = useState<string | null>(
  "rgba(255, 69, 0, 0.68)",
);

<ElColorPicker
  value={color}
  showAlpha
  predefine={PREDEFINE_COLORS}
  onChange={setColor}
/>`,

  sizes: `const [color, setColor] = useState<string | null>("#409EFF");

<ElColorPicker value={color} size="large" onChange={setColor} />
<ElColorPicker value={color} onChange={setColor} />
<ElColorPicker value={color} size="small" onChange={setColor} />`,
};

const API_MD = `
## ColorPicker API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| showAlpha | 是否显示透明度滑块 | ^[boolean] | false |
| colorFormat | 绑定值的颜色格式 | ^[enum]\`'rgb' \\| 'prgb' \\| 'hex' \\| 'hex3' \\| 'hex4' \\| 'hex6' \\| 'hex8' \\| 'name' \\| 'hsl' \\| 'hsv'\` | showAlpha 为 false 时 'hex'，为 true 时 'rgb' |
| popperClass | 下拉面板自定义类名 | ^[string] | '' |
| popperStyle | 下拉面板自定义样式 | ^[object]\`CSSProperties\` | — |
| predefine | 预定义颜色 | ^[array]\`string[]\` | — |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| tabindex | 触发器的 tabindex | ^[string] / ^[number] | 0 |
| ariaLabel | 颜色选择器的 aria-label | ^[string] | — |
| emptyValues | 组件的空值配置 | ^[array] | — |
| valueOnClear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| id | 组件 id | ^[string] | — |
| teleported | 面板是否挂载到 body | ^[boolean] | true |
| persistent | 面板不活跃时是否保留 DOM | ^[boolean] | true |
| appendTo | 面板挂载的目标选择器或元素 | ^[string] / ^[HTMLElement] | — |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 确认选择时触发 | ^[Function]\`(value: string \\| null) => void\` |
| onActiveChange | 当前活跃颜色变化时触发 | ^[Function]\`(value: string \\| null) => void\` |
| onFocus | 组件获得焦点时触发 | ^[Function]\`(event: FocusEvent) => void\` |
| onBlur | 组件失去焦点时触发 | ^[Function]\`(event: FocusEvent) => void\` |
| onClear | 点击清空按钮时触发 | ^[Function]\`() => void\` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| color | 当前颜色对象 | ^[object]\`Color\` |
| show | 手动打开颜色选择器 | ^[Function]\`() => void\` |
| hide | 手动关闭颜色选择器 | ^[Function]\`() => void\` |
| focus | 聚焦触发器 | ^[Function]\`() => void\` |
| blur | 触发器失焦 | ^[Function]\`() => void\` |
`;

export default function ColorPickerPage() {
  return (
    <>
      <h1>ColorPicker 颜色选择器</h1>
      <p>用于颜色选择，支持多种格式。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        使用 v-model 与 Vue 实例中的一个变量进行双向绑定，绑定的变量需要是字符串类型。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ColorPickerBasic />
      </DemoBlock>

      <Heading level={2}>选择透明度</Heading>
      <p>
        ColorPicker 支持普通颜色，也支持带 Alpha 通道的颜色，通过
        <code>show-alpha</code>属性即可控制是否支持透明度的选择。要启用 Alpha
        选择，只需添加 <code>show-alpha</code> 属性。
      </p>
      <DemoBlock source={SOURCES.alpha}>
        <ColorPickerAlpha />
      </DemoBlock>

      <Heading level={2}>预定义颜色</Heading>
      <p>ColorPicker 支持预定义颜色</p>
      <DemoBlock source={SOURCES.predefinedColor}>
        <ColorPickerPredefinedColor />
      </DemoBlock>

      <Heading level={2}>不同尺寸</Heading>
      <DemoBlock source={SOURCES.sizes}>
        <ColorPickerSizes />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
