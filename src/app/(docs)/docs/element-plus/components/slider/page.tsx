import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  SliderBasic,
  SliderDiscreteValues,
  SliderPlacement,
  SliderRange,
  SliderRestrictValue,
  SliderShowMarks,
  SliderSizes,
  SliderVertical,
  SliderWithInput,
} from "@/components/element-plus/examples/slider";

export const metadata: Metadata = { title: "Slider 滑块" };

const SOURCES = {
  basic: `const [value, setValue] = useState(0);

<span>默认值</span>
<ElSlider value={value} onChange={setValue} />

<span>隐藏提示</span>
<ElSlider value={value} onChange={setValue} showTooltip={false} />

<span>格式化提示</span>
<ElSlider value={value} onChange={setValue} formatTooltip={(val) => val / 100} />

<span>禁用</span>
<ElSlider value={value} onChange={setValue} disabled />`,

  discreteValues: `<span>不显示间断点</span>
<ElSlider value={value} onChange={setValue} step={10} />

<span>显示间断点</span>
<ElSlider value={value} onChange={setValue} step={10} showStops />`,

  withInput: `<ElSlider value={value} onChange={setValue} showInput />`,

  sizes: `<ElSlider value={value} onChange={setValue} showInput size="large" />
<ElSlider value={value} onChange={setValue} showInput />
<ElSlider value={value} onChange={setValue} showInput size="small" />`,

  placement: `<ElSlider value={value} onChange={setValue} />
<ElSlider value={value} onChange={setValue} placement="bottom" />
<ElSlider value={value} onChange={setValue} placement="right" />
<ElSlider value={value} onChange={setValue} placement="left" />`,

  range: `<ElSlider value={[4, 8]} onChange={setValue} range showStops max={10} />`,

  vertical: `<ElSlider value={value} onChange={setValue} vertical height="200px" />`,

  restrictValue: `<ElSlider value={37} onChange={setValue} vertical height="200px"
  marks={{ 0: "0°C", 37: "37°C", 100: "100°C" }} placement="right"
  formatTooltip={(v) => \`\${v}°C\`} step="mark" />

<ElSlider value={value} onChange={setValue} marks={marks} step="mark" />

<ElSlider value={[13, 42]} onChange={setValue} range marks={marks} step="mark" />`,

  showMarks: `<ElSlider
  value={[30, 60]}
  onChange={setValue}
  range
  marks={{
    0: "0°C",
    8: "8°C",
    37: "37°C",
    50: { style: { color: "#1989FA" }, label: "50%" },
  }}
/>`,
};

const API_MD = `
## Slider API

### Slider Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，范围选择时为数组 | ^[number] / ^[array]\`number[]\` | 0 |
| min | 最小值 | ^[number] | 0 |
| max | 最大值 | ^[number] | 100 |
| disabled | 是否禁用 | ^[boolean] | false |
| step | 步长，可传 \`'mark'\` 把取值限制在 marks 上（此时必须传 marks） | ^[number] / ^[string]\`'mark'\` | 1 |
| show-input | 是否显示输入框，range 为真或 step 为 \`'mark'\` 时不生效 | ^[boolean] | false |
| show-input-controls | showInput 为真时是否显示输入框的控制按钮 | ^[boolean] | true |
| size | 尺寸，纵向模式不生效 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | default |
| input-size | 输入框尺寸，省略时跟随 size | ^[enum]\`'large' \\| 'default' \\| 'small'\` | default |
| show-stops | 是否显示间断点 | ^[boolean] | false |
| show-tooltip | 是否显示提示 | ^[boolean] | true |
| format-tooltip | 提示内容的格式化函数 | ^[Function]\`(value: number) => number \\| string\` | — |
| range | 是否范围选择 | ^[boolean] | false |
| vertical | 纵向模式 | ^[boolean] | false |
| height | 高度，纵向模式必填 | ^[string] | — |
| aria-label | 根元素的 aria-label | ^[string] | — |
| range-start-label | range 为真时给屏幕阅读器的起始值标签 | ^[string] | — |
| range-end-label | range 为真时给屏幕阅读器的结束值标签 | ^[string] | — |
| format-value-text | aria-valuenow 的格式化函数 | ^[Function]\`(value: number) => string\` | — |
| tooltip-class | 提示的自定义类名 | ^[string] | — |
| placement | 提示位置 | ^[enum] | top |
| marks | 标记点，键必须是 [min, max] 闭区间内的数字，值可自定义样式 | ^[object]\`SliderMarks\` | — |
| validate-event | 是否触发表单校验（处于 ElFormItem 内时调用其 change 校验） | ^[boolean] | true |
| persistent | 提示不活跃且为 false 时销毁浮层；showTooltip 为 false 时恒为 false | ^[boolean] | true |

### Slider Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 对应官方 v-model 的 update:modelValue，值变化时触发（拖拽过程中持续触发） | ^[Function]\`(value: Arrayable<number>) => void\` |
| onInput | 对应官方 input，拖动过程中实时触发 | ^[Function]\`(value: Arrayable<number>) => void\` |
| onValueChange | 对应官方 change，拖拽结束 / 点击轨道 / 点击标记点后触发 | ^[Function]\`(value: Arrayable<number>) => void\` |

### Slider Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| onSliderClick | 按鼠标 / 触摸位置设置值 | ^[Function]\`(event: MouseEvent \\| TouchEvent) => void\` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\` | \`value\` + \`onChange\` | React 惯用写法 |
| \`@input\` 实时事件 | \`onInput\` | 同义 |
| \`@change\` 拖拽结束 | \`onValueChange\` | \`onChange\` 已占用为 v-model 回调，故另开一个 |
| \`defineExpose({ onSliderClick })\` | \`ref\` + \`onSliderClick\` | 用 \`useImperativeHandle\` 暴露 |
| \`label\`（已废弃） | \`ariaLabel\` | 官方亦标注 deprecated |

**实现说明**：

- 坐标换算、\`setPosition\` 的取整（\`fullRangePercentage\` / \`threshold\` 三段判定）、
  \`step="mark"\` 时取最近 mark、键盘 \`Arrow/Home/End/PageUp/PageDown\`、
  拖拽结束后一个宏任务收尾防误触发 click，均逐行对齐官方。
- 提示复用本项目的 \`ElTooltip\`（受控模式），显隐按官方做 50ms 防抖；
  \`persistent\` 透传给 ElTooltip 决定不可见时是否保留浮层 DOM。
- \`id\`、\`aria-label\` / \`aria-labelledby\` 与 FormItem 的关联对齐官方：
  range 模式下 id 落在根节点，非 range 时落在滑块按钮上，并注册到 FormItem。
- \`validate-event\` 在值变化时调用所在 ElFormItem 的 \`change\` 校验。

**未实现的官方能力**：

- 官方 tooltip 在拖拽中用 \`updatePopper()\` 主动重算定位；本项目 ElTooltip 未暴露该能力，
  改为依赖拖拽引发的重渲染重新定位，拖拽中提示位置有一帧级误差。
`;

export default function SliderPage() {
  return (
    <>
      <h1>Slider 滑块</h1>
      <p>通过拖动滑块在一个固定区间内进行选择。</p>

      <Heading level={2}>基础用法</Heading>
      <p>在拖动滑块时，显示当前值。</p>
      <DemoBlock source={SOURCES.basic}>
        <SliderBasic />
      </DemoBlock>

      <Heading level={2}>离散值</Heading>
      <p>
        选项可以是离散的。设置 <code>step</code> 可以改变步长，
        设置 <code>showStops</code> 可以显示间断点。
      </p>
      <DemoBlock source={SOURCES.discreteValues}>
        <SliderDiscreteValues />
      </DemoBlock>

      <Heading level={2}>带输入框的滑块</Heading>
      <p>设置 <code>showInput</code> 会在右侧显示输入框。</p>
      <DemoBlock source={SOURCES.withInput}>
        <SliderWithInput />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <DemoBlock source={SOURCES.sizes}>
        <SliderSizes />
      </DemoBlock>

      <Heading level={2}>位置</Heading>
      <p>可以自定义提示的显示位置。</p>
      <DemoBlock source={SOURCES.placement}>
        <SliderPlacement />
      </DemoBlock>

      <Heading level={2}>范围选择</Heading>
      <p>支持选择一个范围。</p>
      <DemoBlock source={SOURCES.range}>
        <SliderRange />
      </DemoBlock>

      <Heading level={2}>垂直模式</Heading>
      <p>
        <code>vertical</code> 开启纵向模式，此时必须设置 <code>height</code>。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <SliderVertical />
      </DemoBlock>

      <Heading level={2}>显示标记</Heading>
      <p>
        <code>marks</code> 支持自定义样式与文案。
      </p>
      <DemoBlock source={SOURCES.showMarks}>
        <SliderShowMarks />
      </DemoBlock>

      <Heading level={2}>限制取值</Heading>
      <p>
        <code>step=&quot;mark&quot;</code> 把取值限制在 <code>marks</code> 上。
      </p>
      <DemoBlock source={SOURCES.restrictValue}>
        <SliderRestrictValue />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
