---
title: "Statistic 统计组件"
description: "显示统计数据。"
group: 数据展示
order: 220
---

# Statistic 统计组件

显示统计数据。

## 基础用法

:::demo

statistic/basic

:::

## 倒计时

:::demo

statistic/countdown

:::

## 统计卡片

:::demo

statistic/card

:::

## Statistic API

### Statistic Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 数值 | ^[number] / ^[string] | 0 |
| precision | 小数精度，不足补零、超出截断 | ^[number] | 0 |
| group-separator | 千分位分隔符 | ^[string] | , |
| decimal-separator | 小数点分隔符 | ^[string] | . |
| formatter | 自定义格式化函数，传入后忽略上述格式化配置 | ^[Function]`(value) => ReactNode` | — |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| prefix | 数值前缀 | ^[string] / ^[ReactNode] | — |
| suffix | 数值后缀 | ^[string] / ^[ReactNode] | — |
| value-style | 数值样式 | ^[object]`CSSProperties` | — |

### Statistic Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| title | 标题内容 | `title` |
| prefix | 前缀内容 | `prefix` |
| suffix | 后缀内容 | `suffix` |

## Countdown API

### Countdown Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 目标时间 | ^[number] / ^[Dayjs] | 0 |
| format | 倒计时显示格式 | ^[string] | HH:mm:ss |
| prefix | 数值前缀 | ^[string] / ^[ReactNode] | — |
| suffix | 数值后缀 | ^[string] / ^[ReactNode] | — |
| title | 倒计时标题 | ^[string] / ^[ReactNode] | — |
| value-style | 数值样式 | ^[object]`CSSProperties` | — |

### Countdown Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 时间差变化时触发，每帧一次 | ^[Function]`(value: number) => void` |
| onFinish | 倒计时结束时触发 | ^[Function]`() => void` |

### Countdown Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| prefix | 倒计时数值前缀 | `prefix` |
| suffix | 倒计时数值后缀 | `suffix` |
| title | 倒计时标题 | `title` |

### Countdown Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| displayValue | 当前展示文本 | ^[object]`string` |

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

连续书写会自动补零（如 `HH`），方括号内的文本原样输出（如 `[days]`）。
