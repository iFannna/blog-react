"use client";

import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { Check, Close } from "../generated/icons";

export type StepStatus = "wait" | "process" | "finish" | "error" | "success";

interface StepsContextValue {
  active: number;
  processStatus: StepStatus;
  finishStatus: StepStatus;
  simple: boolean;
  direction: "horizontal" | "vertical";
  alignCenter: boolean;
  space?: number | string;
}

const StepsContext = createContext<StepsContextValue | null>(null);

export interface StepsProps {
  /** 当前激活步骤的下标 */
  active?: number;
  /** 每个步骤的间距。省略时自适应，支持百分比 */
  space?: number | string;
  /** 显示方向 */
  direction?: "horizontal" | "vertical";
  /** 是否居中对齐 */
  alignCenter?: boolean;
  /** 是否精简模式 */
  simple?: boolean;
  /** 当前步骤的状态 */
  processStatus?: StepStatus;
  /** 已完成步骤的状态 */
  finishStatus?: StepStatus;
  /** 激活步骤变化，对应官方 change 事件 */
  onChange?: (newActive: number, oldActive: number) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElSteps。
 *
 * 子项的状态推导与官方 updateStatus 一致：
 * index < active → finishStatus；index === active → processStatus；否则 wait。
 * 官方通过 provide/inject 收集子项并回写状态，
 * React 里由父组件统一计算后经 cloneElement 下发。
 */
export function ElSteps({
  active = 0,
  space,
  direction = "horizontal",
  alignCenter = false,
  simple = false,
  processStatus = "process",
  finishStatus = "finish",
  onChange,
  className,
  style,
  children,
}: StepsProps) {
  // 官方 watch(active) 不回放初始值，这里同样只在受控值真正变化后通知
  const previousActive = useRef(active);
  useEffect(() => {
    if (previousActive.current !== active) {
      onChange?.(active, previousActive.current);
      previousActive.current = active;
    }
  }, [active, onChange]);

  // 官方简洁模式只输出 el-steps--simple，不再叠加方向类
  const classes = [
    "el-steps",
    !simple && `el-steps--${direction}`,
    simple && "el-steps--simple",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const items = Children.toArray(children).filter(
    (child): child is ReactElement<StepProps> => {
      if (typeof child === "object" && child !== null && "type" in child) {
        const childType = (child as ReactElement).type;
        return (
          childType === ElStep ||
          (typeof childType === "function" &&
            (childType as { displayName?: string }).displayName === "ElStep")
        );
      }
      return false;
    },
  );

  const stepCount = items.length;

  return (
    <div className={classes} style={style}>
      <StepsContext.Provider
        value={{
          active,
          processStatus,
          finishStatus,
          simple,
          direction,
          alignCenter,
          space,
        }}
      >
        {items.map((child, index) =>
          cloneElement(child, { key: index, index, stepCount }),
        )}
      </StepsContext.Provider>
    </div>
  );
}

export interface StepProps {
  /** 由父组件自动注入的下标 */
  index?: number;
  /** 总步数，由父组件注入 */
  stepCount?: number;
  /** 标题 */
  title?: ReactNode;
  /** 描述 */
  description?: ReactNode;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 当前步骤的状态。传入后覆盖自动推导 */
  status?: StepStatus;
  className?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElStep。
 *
 * 仅作为 ElSteps 的子组件使用，index / stepCount 由父组件注入。
 */
export function ElStep({
  index = 0,
  stepCount,
  title,
  description,
  icon,
  status,
  className,
}: StepProps) {
  const ctx = useContext(StepsContext);

  const active = ctx?.active ?? 0;
  const processStatus = ctx?.processStatus ?? "process";
  const finishStatus = ctx?.finishStatus ?? "finish";
  const isSimple = ctx?.simple ?? false;
  const isVertical = ctx?.direction === "vertical";
  const isCenter = ctx?.alignCenter ?? false;
  const space = ctx?.space;

  // 与官方 updateStatus 一致
  const internalStatus: StepStatus =
    index < active ? finishStatus : index === active ? processStatus : "wait";
  const currentStatus = status ?? internalStatus;

  const isLast = stepCount !== undefined && index === stepCount - 1;
  const isFlex = isLast && !space && !isCenter;

  const containerClasses = [
    "el-step",
    isSimple ? "is-simple" : isVertical ? "is-vertical" : "is-horizontal",
    isFlex && "is-flex",
    isCenter && !isSimple && !isVertical && "is-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const headClasses = ["el-step__head", `is-${currentStatus}`].join(" ");

  const iconClasses = [
    "el-step__icon",
    icon ? "is-icon" : "is-text",
  ].join(" ");

  // 官方 style：按 space 或均分计算 flexBasis，最后一项横向限宽
  const stepStyle: CSSProperties = {
    flexBasis:
      typeof space === "number"
        ? `${space}px`
        : space
          ? space
          : stepCount
            ? `${100 / (stepCount - (isCenter ? 0 : 1))}%`
            : undefined,
  };
  if (!isVertical && isLast && stepCount) {
    stepStyle.maxWidth = `${100 / stepCount}%`;
  }

  return (
    <div className={containerClasses} style={stepStyle}>
      <div className={headClasses}>
        {/* 与官方一致：连接线进度由 CSS 控制，组件不写内联宽高 */}
        {!isSimple && (
          <div className="el-step__line">
            <i className="el-step__line-inner" />
          </div>
        )}

        <div className={iconClasses}>
          {icon ? (
            <ElIcon className="el-step__icon-inner">{icon}</ElIcon>
          ) : currentStatus === "success" ? (
            <ElIcon className="el-step__icon-inner is-status">
              <Check />
            </ElIcon>
          ) : currentStatus === "error" ? (
            <ElIcon className="el-step__icon-inner is-status">
              <Close />
            </ElIcon>
          ) : (
            !isSimple && <div className="el-step__icon-inner">{index + 1}</div>
          )}
        </div>
      </div>

      <div className="el-step__main">
        <div className={["el-step__title", `is-${currentStatus}`].join(" ")}>
          {title}
        </div>
        {isSimple ? (
          <div className="el-step__arrow" />
        ) : (
          <div className={["el-step__description", `is-${currentStatus}`].join(" ")}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

// 供 ElSteps 识别子项
ElStep.displayName = "ElStep";
