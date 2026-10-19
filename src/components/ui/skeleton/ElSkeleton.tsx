"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElSkeletonItem } from "./ElSkeletonItem";

export type ThrottleType =
  | { leading?: number; trailing?: number; initVal?: boolean }
  | number;

export interface SkeletonProps {
  /** 是否显示动画 */
  animated?: boolean;
  /** 渲染多少个骨架重复单元 */
  count?: number;
  /** 段落行数，仅在未传 template 时生效 */
  rows?: number;
  /** 是否处于加载中，false 时渲染真实内容 */
  loading?: boolean;
  /** 渲染节流，避免加载态闪烁 */
  throttle?: ThrottleType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** 自定义骨架结构，对应官方 template 插槽 */
  template?: ReactNode;
}

/**
 * 对应官方 ElSkeleton。
 *
 * 官方 useThrottleRender 的行为：throttle 为 0 时直接透传 loading；
 * 否则按 leading / trailing 延时切换，避免快速闪烁。
 * initVal 为对象形态下的初始值。
 */
function useThrottleRender(loading: boolean, throttle: ThrottleType = 0) {
  const throttleDisabled = throttle === 0;
  const initVal = typeof throttle === "object" && Boolean(throttle.initVal);

  const [throttled, setThrottled] = useState(initVal);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 统一走 setTimeout，避免在 effect 内同步 setState 触发级联渲染；
  // 未配置延时的分支以 0ms 排队，语义仍等价于官方立即切换。
  const dispatch = (timer: number | undefined) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setThrottled(loading);
    }, timer ?? 0);
  };

  const dispatcher = (type: "leading" | "trailing") => {
    if (type === "leading") {
      if (typeof throttle === "number") dispatch(throttle);
      else dispatch(throttle.leading);
    } else {
      if (typeof throttle === "object") dispatch(throttle.trailing);
      else dispatch(0);
    }
  };

  // 对应 onMounted(() => dispatcher('leading'))
  useEffect(() => {
    dispatcher("leading");
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // 只在挂载时执行一次，与官方的 onMounted 语义一致
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (throttleDisabled) return;
    dispatcher(loading ? "leading" : "trailing");
    // dispatcher 依赖 throttle，此处按 loading 变化触发即可
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return throttleDisabled ? loading : throttled;
}

/** 对应官方 ElSkeleton。 */
export function ElSkeleton({
  animated = false,
  count = 1,
  rows = 3,
  loading = true,
  throttle,
  className,
  style,
  children,
  template,
}: SkeletonProps) {
  const uiLoading = useThrottleRender(loading, throttle);

  if (!uiLoading) return <>{children}</>;

  const classes = [
    "el-skeleton",
    animated && "is-animated",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * 未传 template 时的默认骨架，与官方模板一致：
   * 首行宽度 33%，其后的段落行在最后一行且行数大于 1 时加 is-last。
   */
  const defaultTemplate = (
    <>
      <ElSkeletonItem className="is-first" variant="p" />
      {Array.from({ length: rows }, (_, index) => {
        const rowNumber = index + 1;
        return (
          <ElSkeletonItem
            key={index}
            className={`el-skeleton__paragraph${
              rowNumber === rows && rows > 1 ? " is-last" : ""
            }`}
            variant="p"
          />
        );
      })}
    </>
  );

  return (
    <div className={classes} style={style}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{template ?? defaultTemplate}</div>
      ))}
    </div>
  );
}
