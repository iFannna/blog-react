import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  StatisticBasic,
  StatisticCountdown,
  StatisticCard,
} from "@/components/element-plus/examples/statistic";

export const metadata: Metadata = { title: "Statistic 统计组件" };

const SOURCES = {
  basic: `<ElStatistic title="原始值" value={268500} />
<ElStatistic title="精度 2" value={268500} precision={2} />
<ElStatistic title="前缀后缀" value={1128} prefix="¥" suffix="元" />
<ElStatistic
  title="自定义分隔符"
  value={1234567.89}
  precision={2}
  groupSeparator=" "
  decimalSeparator=","
/>`,

  countdown: `<ElRow gutter={16}>
  <ElCol xs={24} sm={12} md={8}>
    <ElCountdown title="Start to grab" value={value} />
  </ElCol>
  <ElCol xs={24} sm={12} md={8}>
    <ElCountdown title="Remaining VIP time" format="HH:mm:ss" value={value1} />
    <ElButton type="primary" onClick={reset}>Reset</ElButton>
  </ElCol>
  <ElCol xs={24} sm={12} md={8}>
    <ElCountdown format="DD [days] HH:mm:ss" value={value2} />
  </ElCol>
</ElRow>`,

  formatter: `<ElStatistic
  title="进度"
  value={0.875}
  formatter={(v) => \`\${(Number(v) * 100).toFixed(1)}%\`}
/>

<ElStatistic title="非数字" value="暂无数据" />`,
};

const API_MD = `
## Statistic API

### Statistic Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 数值 | ^[number] / ^[string] | 0 |
| precision | 小数精度，不足补零、超出截断 | ^[number] | 0 |
| group-separator | 千分位分隔符 | ^[string] | , |
| decimal-separator | 小数点分隔符 | ^[string] | . |
| formatter | 自定义格式化函数，传入后忽略上述格式化配置 | ^[Function]\`(value) => ReactNode\` | — |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| prefix | 数值前缀 | ^[string] / ^[ReactNode] | — |
| suffix | 数值后缀 | ^[string] / ^[ReactNode] | — |
| value-style | 数值样式 | ^[object]\`CSSProperties\` | — |

### Statistic Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| title | 标题内容 | \`title\` |
| prefix | 前缀内容 | \`prefix\` |
| suffix | 后缀内容 | \`suffix\` |

## Countdown API

### Countdown Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 目标时间 | ^[number] / ^[Dayjs] | 0 |
| format | 倒计时显示格式 | ^[string] | HH:mm:ss |
| prefix | 数值前缀 | ^[string] / ^[ReactNode] | — |
| suffix | 数值后缀 | ^[string] / ^[ReactNode] | — |
| title | 倒计时标题 | ^[string] / ^[ReactNode] | — |
| value-style | 数值样式 | ^[object]\`CSSProperties\` | — |

### Countdown Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 时间差变化时触发，每帧一次 | ^[Function]\`(value: number) => void\` |
| onFinish | 倒计时结束时触发 | ^[Function]\`() => void\` |

### Countdown Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| prefix | 倒计时数值前缀 | \`prefix\` |
| suffix | 倒计时数值后缀 | \`suffix\` |
| title | 倒计时标题 | \`title\` |

### Countdown Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| displayValue | 当前展示文本 | ^[object]\`string\` |

### Countdown 格式占位符

| 占位符 | 含义 |
| --- | --- |
| Y | 年（按 365 天折算） |
| M | 月（按 30 天折算） |
| D | 天 |
| H | 小时 |
| m | 分钟 |
| s | 秒 |
| S | 毫秒 |

连续书写会自动补零（如 \`HH\`），方括号内的文本原样输出（如 \`[days]\`）。

`;

export default function StatisticPage() {
  return (
    <>
      <h1>Statistic 统计组件</h1>
      <p>显示统计数据。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        用于突出某个或某组数字时，如统计数值、金额、排名等，数值和标题前后都可以加icon、单位等元素。可以使用{" "}
        <a href="https://vueuse.org/core/useTransition/" target="_blank" rel="noreferrer">
          vueuse
        </a>{" "}
        实现数值的变化动效
      </p>
      <DemoBlock source={SOURCES.basic}>
        <StatisticBasic />
      </DemoBlock>

      <Heading level={2}>倒计时</Heading>
      <p>倒计时组件，支持添加其他组件来控制。</p>
      <DemoBlock source={SOURCES.countdown}>
        <StatisticCountdown />
      </DemoBlock>
      <DocsContent
        source={`:::tip

在格式化过程中，建议在天数范围内

:::`}
      />

      <Heading level={2}>统计卡片</Heading>
      <p>卡片式用法展示，可以自由组合</p>
      <DemoBlock source={SOURCES.formatter}>
        <StatisticCard />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
