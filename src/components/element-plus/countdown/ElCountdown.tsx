"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { ElStatistic } from "../statistic";

import { formatTime, getTime } from "./format-time";

import type { CountdownExpose, CountdownProps } from "./types";

/**
 * 对应官方 ElCountdown。
 *
 * 计时基于 requestAnimationFrame 逐帧计算与目标时间的差值，
 * 渲染复用 ElStatistic，格式占位符由 formatTime 处理。
 */
export const ElCountdown = forwardRef<CountdownExpose, CountdownProps>(
  function ElCountdown(props, ref) {
    const {
      format = "HH:mm:ss",
      prefix,
      suffix,
      title,
      value = 0,
      valueStyle,
      onChange,
      onFinish,
      className,
      style,
    } = props;

    const [rawValue, setRawValue] = useState(0);
    const timerRef = useRef<number | undefined>(undefined);

    // 计时器只随目标值重启，回调通过 ref 保持最新，避免每次渲染重置计时
    const handlersRef = useRef({ onChange, onFinish });
    useEffect(() => {
      handlersRef.current = { onChange, onFinish };
    }, [onChange, onFinish]);

    const stopTimer = useCallback(() => {
      if (timerRef.current !== undefined) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = undefined;
      }
    }, []);

    useEffect(() => {
      const timestamp = getTime(value);

      const frameFunc = () => {
        let diff = timestamp - Date.now();
        handlersRef.current.onChange?.(diff);
        if (diff <= 0) {
          diff = 0;
          stopTimer();
          handlersRef.current.onFinish?.();
        } else {
          timerRef.current = requestAnimationFrame(frameFunc);
        }
        setRawValue(diff);
      };

      timerRef.current = requestAnimationFrame(frameFunc);

      return stopTimer;
    }, [value, stopTimer]);

    const displayValue = formatTime(rawValue, format);

    useImperativeHandle(ref, () => ({ displayValue }), [displayValue]);

    return (
      <ElStatistic
        value={rawValue}
        title={title}
        prefix={prefix}
        suffix={suffix}
        valueStyle={valueStyle}
        className={className}
        style={style}
        formatter={(val) => formatTime(Number(val), format)}
      />
    );
  },
);

export default ElCountdown;
