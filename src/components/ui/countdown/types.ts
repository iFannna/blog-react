import type { CSSProperties, ReactNode } from "react";
import type { Dayjs } from "dayjs";

export interface CountdownProps {
  /** 倒计时显示格式 */
  format?: string;
  /** 数值前缀 */
  prefix?: ReactNode;
  /** 数值后缀 */
  suffix?: ReactNode;
  /** 倒计时标题 */
  title?: ReactNode;
  /** 目标时间，时间戳或 Dayjs 对象 */
  value?: number | Dayjs;
  /** 数值样式 */
  valueStyle?: CSSProperties;
  /** 时间差每次变化时触发 */
  onChange?: (value: number) => void;
  /** 倒计时结束时触发 */
  onFinish?: () => void;
  className?: string;
  style?: CSSProperties;
}

export interface CountdownExpose {
  /** 当前展示文本 */
  displayValue: string;
}
