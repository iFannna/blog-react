import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  StatisticBasic,
  StatisticCountdown,
  StatisticFormatter,
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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="title">\` | \`title\` 属性 | 接受字符串或节点 |

**实现说明**：\`displayValue\` 的计算逐行对齐官方：

1. 传入 \`formatter\` 时直接交给它
2. \`value\` 非数字（或 NaN）时**原样返回**，不做格式化
3. 否则按小数字符串补齐 / 截断，整数部分用正则插入千分位分隔符
`;

export default function StatisticPage() {
  return (
    <>
      <h1>Statistic 统计组件</h1>
      <p>用于展示统计数据，支持数字格式化。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>precision</code> 控制小数位，<code>prefix</code> / <code>suffix</code>
        添加前后缀，<code>groupSeparator</code> 与 <code>decimalSeparator</code>
        自定义分隔符。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <StatisticBasic />
      </DemoBlock>

      <Heading level={2}>倒计时</Heading>
      <p>
        <code>ElCountdown</code> 以 <code>value</code> 为目标时间逐帧计算差值，
        用 <code>format</code> 控制展示格式；可配合按钮等组件重置目标时间。
        格式建议控制在「天」的量级内。
      </p>
      <DemoBlock source={SOURCES.countdown}>
        <StatisticCountdown />
      </DemoBlock>

      <Heading level={2}>自定义格式化</Heading>
      <p>
        <code>formatter</code> 接收原始值并返回任意节点。传入后忽略其它格式化配置。
        <code>value</code> 为非数字时原样显示。
      </p>
      <DemoBlock source={SOURCES.formatter}>
        <StatisticFormatter />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
