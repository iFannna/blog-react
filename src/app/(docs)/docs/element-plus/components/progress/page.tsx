import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ProgressBasic,
  ProgressCircle,
  ProgressColor,
  ProgressCustomText,
  ProgressDashboard,
  ProgressIndeterminate,
  ProgressStriped,
  ProgressTextInside,
} from "@/components/element-plus/examples/progress";

export const metadata: Metadata = {
  title: "Progress 进度条",
};

const SOURCES = {
  basic: `<ElProgress percentage={50} />
<ElProgress percentage={70} />
<ElProgress percentage={90} />`,

  textInside: `<ElProgress percentage={60} textInside strokeWidth={20} />
<ElProgress percentage={80} textInside strokeWidth={24} />`,

  customText: `<ElProgress percentage={70} format={(p) => \`进度 \${p}%\`} />
<ElProgress percentage={100} format={() => "完成"} />`,

  color: `<ElProgress percentage={80} color="#626aef" />

<ElProgress
  percentage={70}
  color={[
    { color: "#f56c6c", percentage: 20 },
    { color: "#e6a23c", percentage: 40 },
    { color: "#5cb87a", percentage: 60 },
    { color: "#1989fa", percentage: 80 },
  ]}
/>

<ElProgress percentage={50} color={(p) => (p < 60 ? "#f56c6c" : "#5cb87a")} />`,

  striped: `<ElProgress percentage={40} striped />
<ElProgress percentage={60} striped stripedFlow />`,

  circle: `<ElProgress type="circle" percentage={0} />
<ElProgress type="circle" percentage={25} />
<ElProgress type="circle" percentage={75} />
<ElProgress type="circle" percentage={100} status="success" />`,

  dashboard: `<ElProgress type="dashboard" percentage={0} />
<ElProgress type="dashboard" percentage={30} />
<ElProgress type="dashboard" percentage={60} strokeWidth={12} />
<ElProgress type="dashboard" percentage={100} status="warning" />`,

  indeterminate: `const [loading, setLoading] = useState(true);

<ElProgress percentage={loading ? 100 : 50} indeterminate={loading} duration={2} />
<ElButton onClick={() => setLoading((v) => !v)}>切换</ElButton>`,
};

const API_MD = `
## Progress API

### Progress Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 进度类型 | ^[enum]\`'line' \\| 'circle' \\| 'dashboard'\` | line |
| percentage | 百分比，0-100 | ^[number] | 0 |
| status | 当前状态 | ^[enum]\`'' \\| 'success' \\| 'exception' \\| 'warning'\` | — |
| stroke-width | 线宽，仅 line 类型有效 | ^[number] | 6 |
| stroke-linecap | 线帽 | ^[enum]\`'butt' \\| 'round' \\| 'square'\` | round |
| text-inside | 文字是否显示在进度条内部 | ^[boolean] | false |
| width | 环形进度条画布宽度 | ^[number] | 126 |
| show-text | 是否显示文字 | ^[boolean] | true |
| color | 进度条颜色，支持单色、分段、函数 | ^[string] / ^[array] / ^[Function]\`(p: number) => string\` | — |
| duration | 条纹动画周期（秒） | ^[number] | 3 |
| striped | 是否应用条纹动画 | ^[boolean] | false |
| striped-flow | 是否应用流动效果 | ^[boolean] | false |
| indeterminate | 是否为不确定进度 | ^[boolean] | false |
| format | 文字格式化函数 | ^[Function]\`(percentage: number) => string\` | \`(p) => p + '%'\` |

### Progress Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义文字内容，参数为百分比 | \`children\` 函数 |

`;

export default function ProgressPage() {
  return (
    <>
      <h1>Progress 进度条</h1>
      <p>用于展示操作进度，告知用户当前状态和预期。</p>

      <Heading level={2}>直线进度条</Heading>
      <p>
        Progress 组件设置 <code>percentage</code>{" "}
        属性即可，表示进度条对应的百分比。该属性<strong>必填</strong>，并且必须在 <code>0-100</code> 的范围内。你可以通过设置{" "}
        <code>format</code> 来自定义文字显示的格式。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ProgressBasic />
      </DemoBlock>

      <Heading level={2}>进度条内显示百分比标识</Heading>
      <p>百分比不占用额外空间，适用于文件上传等场景。</p>
      <p>
        Progress 组件可通过 <code>stroke-width</code>{" "}
        属性更改进度条的高度，并可通过 <code>text-inside</code> 属性来改变进度条内部的文字。
      </p>
      <DemoBlock source={SOURCES.textInside}>
        <ProgressTextInside />
      </DemoBlock>

      <Heading level={2}>自定义进度条的颜色</Heading>
      <p>
        可以通过 <code>color</code>{" "}
        属性来设置进度条的颜色。该属性可以接受十六进制颜色值，函数和数组。
      </p>
      <DemoBlock source={SOURCES.color}>
        <ProgressColor />
      </DemoBlock>

      <Heading level={2}>环形进度条</Heading>
      <p>
        Progress 组件可通过 <code>type</code>{" "}
        属性来指定使用环形进度条，在环形进度条中，还可以通过 <code>width</code>{" "}
        属性来设置其大小。
      </p>
      <DemoBlock source={SOURCES.circle}>
        <ProgressCircle />
      </DemoBlock>

      <Heading level={2}>仪表盘形进度条</Heading>
      <p>
        您也可以指定 <code>type</code> 属性到 <code>dashboard</code>{" "}
        使用控制面板进度栏。
      </p>
      <DemoBlock source={SOURCES.dashboard}>
        <ProgressDashboard />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>通过默认插槽添加自定义内容。</p>
      <DemoBlock source={SOURCES.customText}>
        <ProgressCustomText />
      </DemoBlock>

      <Heading level={2}>动画进度条</Heading>
      <p>
        使用 <code>indeterminate</code> 属性来设置不确定的进度，{" "}
        <code>duration</code> 来控制动画持续时间。
      </p>
      <DemoBlock source={SOURCES.indeterminate}>
        <ProgressIndeterminate />
      </DemoBlock>

      <Heading level={2}>条纹进度条</Heading>
      <p>
        通过设置 <code>striped</code> 属性获取条纹进度条。也可以使用{" "}
        <code>striped-flow</code> 属性来使条纹流动起来。 使用<code>duration</code> 属性来控制条纹流动的速度。
      </p>
      <DemoBlock source={SOURCES.striped}>
        <ProgressStriped />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
