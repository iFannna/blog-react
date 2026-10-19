"use client";

import type { CSSProperties, ReactNode } from "react";

export interface StatisticProps {
  /** 数值 */
  value?: number | string;
  /** 小数点分隔符 */
  decimalSeparator?: string;
  /** 千分位分隔符 */
  groupSeparator?: string;
  /** 小数精度，不足补零、超出截断 */
  precision?: number;
  /** 自定义格式化函数，传入后忽略其它格式化配置 */
  formatter?: (value: number | string) => ReactNode;
  /** 标题 */
  title?: ReactNode;
  /** 数值前缀 */
  prefix?: ReactNode;
  /** 数值后缀 */
  suffix?: ReactNode;
  /** 数值样式 */
  valueStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
}

/**
 * 对应官方 ElStatistic。
 *
 * displayValue 的计算逐行对齐官方：
 * 1. 有 formatter 时直接交给它
 * 2. value 非数字（或 NaN）时原样返回
 * 3. 否则按小数位补齐 / 截断，整数部分插入千分位分隔符
 */
export function ElStatistic({
  value = 0,
  decimalSeparator = ".",
  groupSeparator = ",",
  precision = 0,
  formatter,
  title,
  prefix,
  suffix,
  valueStyle,
  className,
  style,
}: StatisticProps) {
  const displayValue = ((): ReactNode => {
    if (formatter) return formatter(value);

    // 非数字原样返回，与官方一致
    if (typeof value !== "number" || Number.isNaN(value)) return value;

    let [integer, decimal = ""] = String(value).split(".");

    decimal = decimal
      .padEnd(precision, "0")
      .slice(0, precision > 0 ? precision : 0);

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

    return [integer, decimal].join(decimal ? decimalSeparator : "");
  })();

  const classes = ["el-statistic", className].filter(Boolean).join(" ");

  const hasTitle = title !== undefined && title !== null && title !== "";

  return (
    <div className={classes} style={style}>
      {hasTitle && <div className="el-statistic__head">{title}</div>}

      <div className="el-statistic__content">
        {prefix !== undefined && (
          <div className="el-statistic__prefix">
            <span>{prefix}</span>
          </div>
        )}

        <span className="el-statistic__number" style={valueStyle}>
          {displayValue}
        </span>

        {suffix !== undefined && (
          <div className="el-statistic__suffix">
            <span>{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}
