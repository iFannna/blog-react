import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  ProgressBasic,
  ProgressCircle,
  ProgressColor,
  ProgressCustomText,
  ProgressDashboard,
  ProgressIndeterminate,
  ProgressStriped,
  ProgressTextInside,
} from "@/components/docs/examples/progress";

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot :percentage="percentage">\` | \`children(percentage)\` | 函数形式接收百分比 |

**实现说明**：官方 \`color\` 支持三种形态，React 侧全部保留：
单色字符串、\`{ color, percentage }\` 分段数组、\`(percentage) => string\` 函数。
分段数组的简写（纯字符串数组）会按官方逻辑自动补全为等分区间。

环形与仪表盘用 SVG 的 \`stroke-dasharray\` 绘制，路径与官方逐字符一致
（含 \`rate = 0.75\` 的仪表盘缺口）。
`;

export default function ProgressPage() {
  return (
    <>
      <h1>Progress 进度条</h1>
      <p>用于展示操作进度，告知用户当前状态和预期。</p>

      <Heading level={2}>线形进度条</Heading>
      <p>
        Progress 组件设置 <code>percentage</code> 属性即可，表示进度条对应的百分比。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ProgressBasic />
      </DemoBlock>

      <Heading level={2}>百分比内显</Heading>
      <p>
        通过 <code>textInside</code> 属性将进度条内的百分比显示在内部，
        配合 <code>strokeWidth</code> 设置更粗的进度条。
      </p>
      <DemoBlock source={SOURCES.textInside}>
        <ProgressTextInside />
      </DemoBlock>

      <Heading level={2}>自定义颜色</Heading>
      <p>
        通过 <code>color</code> 属性自定义进度条颜色，
        支持单色、分段数组与函数三种形式。
      </p>
      <DemoBlock source={SOURCES.color}>
        <ProgressColor />
      </DemoBlock>

      <Heading level={2}>环形进度条</Heading>
      <p>
        设置 <code>type=&quot;circle&quot;</code> 展示环形进度条，
        <code>width</code> 控制圆环画布尺寸。
      </p>
      <DemoBlock source={SOURCES.circle}>
        <ProgressCircle />
      </DemoBlock>

      <Heading level={2}>仪表盘形进度条</Heading>
      <p>
        设置 <code>type=&quot;dashboard&quot;</code> 展示仪表盘形进度条。
      </p>
      <DemoBlock source={SOURCES.dashboard}>
        <ProgressDashboard />
      </DemoBlock>

      <Heading level={2}>自定义文字</Heading>
      <p>
        通过 <code>format</code> 属性自定义进度条文字内容。
      </p>
      <DemoBlock source={SOURCES.customText}>
        <ProgressCustomText />
      </DemoBlock>

      <Heading level={2}>不确定进度</Heading>
      <p>
        设置 <code>indeterminate</code> 展示不确定进度，适合无法获知具体进度的场景。
      </p>
      <DemoBlock source={SOURCES.indeterminate}>
        <ProgressIndeterminate />
      </DemoBlock>

      <Heading level={2}>条纹进度条</Heading>
      <p>
        通过 <code>striped</code> 显示条纹，<code>stripedFlow</code> 让条纹流动。
      </p>
      <DemoBlock source={SOURCES.striped}>
        <ProgressStriped />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
