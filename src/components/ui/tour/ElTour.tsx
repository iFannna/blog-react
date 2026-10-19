"use client";

import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ElButton } from "../button/ElButton";
import { ElIcon } from "../icon/ElIcon";
import { ElFocusTrap } from "../focus-trap/ElFocusTrap";
import { Close } from "../icons";
import { useTranslator } from "../config-provider/context";
import { useZIndex } from "../popper/use-z-index";
import { ElTourMask } from "./ElTourMask";
import { useTourFloating } from "./use-tour-floating";
import type { PosInfo, TourBtnProps, TourGap, TourMask, TourPlacement } from "./types";

export type TourType = "default" | "primary";

export interface TourStepProps {
  /** 指向的目标元素，支持选择器 / 元素 / 取元素的函数；为空时浮层居中显示 */
  target?: string | HTMLElement | (() => HTMLElement | null) | null;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 是否显示关闭按钮，缺省跟随 Tour */
  showClose?: boolean;
  /** 自定义关闭图标 */
  closeIcon?: ReactNode;
  /** 是否显示箭头，缺省跟随 Tour */
  showArrow?: boolean;
  /** 相对目标元素的方位 */
  placement?: TourPlacement;
  /** 是否启用遮罩，缺省跟随 Tour */
  mask?: TourMask;
  /** 内容自定义样式 */
  contentStyle?: CSSProperties;
  /** 上一步按钮属性 */
  prevButtonProps?: TourBtnProps;
  /** 下一步按钮属性 */
  nextButtonProps?: TourBtnProps;
  /** 自定义滚动参数，缺省跟随 Tour */
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  /** 类型，影响背景色与文字色 */
  type?: TourType;
  /** 自定义头部内容（对应官方 header 插槽） */
  header?: ReactNode;
  /** 自定义描述内容（对应官方默认插槽） */
  children?: ReactNode;
  /** 关闭该步骤时的回调，对应官方 TourStep 的 close 事件 */
  onClose?: () => void;
}

/**
 * 对应官方 ElTourStep。
 *
 * 官方里它既是渲染单元也是配置载体；React 版只作配置载体 —— 各个步骤的内容
 * 由父级 ElTour 在当前步骤上统一渲染，因此这里不渲染任何节点。
 */
// props 由父级 ElTour 在渲染期读取，这里只保留签名以对齐官方子组件用法
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ElTourStep(props: TourStepProps): ReactNode {
  return null;
}

ElTourStep.displayName = "ElTourStep";

export interface TourProps {
  /** 是否打开 */
  visible?: boolean;
  /** 显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 当前处于第几步 */
  current?: number;
  /** 当前步骤变化 */
  onCurrentChange?: (current: number) => void;
  /** 步骤变化后的回调，对应官方 change */
  onChange?: (current: number) => void;
  /** 关闭时的回调 */
  onClose?: (current: number) => void;
  /** 结束导览时的回调 */
  onFinish?: () => void;
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 自定义关闭图标 */
  closeIcon?: ReactNode;
  /** 相对目标元素的方位 */
  placement?: TourPlacement;
  /** 内容自定义样式 */
  contentStyle?: CSSProperties;
  /** 是否启用遮罩，或自定义遮罩样式与填充色 */
  mask?: TourMask;
  /** 遮罩与目标之间的透明间隙 */
  gap?: TourGap;
  /** 层级 */
  zIndex?: number;
  /** 自定义滚动参数 */
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  /** 类型，影响背景色与文字色 */
  type?: TourType;
  /** 挂载的容器，默认 body */
  appendTo?: string | HTMLElement;
  /** 是否允许按 ESC 关闭 */
  closeOnPressEscape?: boolean;
  /** 挖孔区域是否可点击 */
  targetAreaClickable?: boolean;
  /** 自定义指示器，对应官方 indicators 插槽 */
  indicators?: (params: { current: number; total: number }) => ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface TourContextValue {
  current: number;
  total: number;
  /** 当前步骤的配置，footer 需要它的按钮属性与回调 */
  step?: TourStepProps;
  showClose: boolean;
  closeIcon?: ReactNode;
  mergedType: TourType;
  indicators?: TourProps["indicators"];
  /** 走一遍 update:modelValue 的关闭流程 */
  updateModelValue: (visible: boolean) => void;
  /** 切换步骤，负责受控 / 非受控两种写回方式 */
  changeCurrent: (current: number) => void;
  /** 关闭按钮 / 结束时的统一出口 */
  closeStep: () => void;
  /** 结束导览 */
  finishTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

/** 遮罩默认填充色，与官方 mask.vue 的 fill 默认值一致。 */
const DEFAULT_MASK_FILL = "rgba(0,0,0,0.5)";

/** 客户端挂载标记的订阅函数：值不随外部变化，永远不需要通知。 */
const subscribeToNothing = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

function isInViewport(element: HTMLElement) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}

/**
 * 对应官方 helper.ts 的 useTarget。
 *
 * 职责是解析目标元素、必要时滚入视口，并把带 gap 的挖孔矩形算出来。
 * 挖孔矩形同时作为遮罩的孔洞与浮层的定位基准，保证浮层相对挖孔而不是
 * 原始目标定位，箭头也才会落在挖孔边缘。
 */
function useTourTarget(
  target: TourStepProps["target"],
  open: boolean,
  gap: TourGap,
  scrollIntoViewOptions: boolean | ScrollIntoViewOptions,
) {
  const [posInfo, setPosInfo] = useState<PosInfo | null>(null);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  // offset 支持元组（水平 / 垂直），未传时回退到 6
  const gapOffsetX = (Array.isArray(gap.offset) ? gap.offset[0] : gap.offset) ?? 6;
  const gapOffsetY = (Array.isArray(gap.offset) ? gap.offset[1] : gap.offset) ?? 6;
  const gapRadius = gap.radius || 2;

  useEffect(() => {
    const resolveTarget = () => {
      if (target == null) return null;
      if (typeof target === "string") return document.querySelector<HTMLElement>(target);
      if (typeof target === "function") return target();
      return target;
    };

    const updatePosInfo = () => {
      const element = open ? resolveTarget() : null;
      setTargetEl(element);

      if (!element) {
        setPosInfo(null);
        return;
      }

      if (!isInViewport(element)) element.scrollIntoView(scrollIntoViewOptions);

      const { left, top, width, height } = element.getBoundingClientRect();
      // 位置未变时沿用旧对象，避免滚动 / 重渲染造成不必要的循环
      setPosInfo((prev) =>
        prev &&
        prev.left === left &&
        prev.top === top &&
        prev.width === width &&
        prev.height === height
          ? prev
          : { left, top, width, height, radius: 0 },
      );
    };

    updatePosInfo();
    window.addEventListener("resize", updatePosInfo);
    return () => window.removeEventListener("resize", updatePosInfo);
  }, [open, target, scrollIntoViewOptions]);

  /** 对应官方 mergedPosInfo：把 gap 摊到挖孔矩形四周。 */
  const mergedPosInfo = useMemo<PosInfo | null>(() => {
    if (!posInfo) return null;
    return {
      left: posInfo.left - gapOffsetX,
      top: posInfo.top - gapOffsetY,
      width: posInfo.width + gapOffsetX * 2,
      height: posInfo.height + gapOffsetY * 2,
      radius: gapRadius,
    };
  }, [posInfo, gapOffsetX, gapOffsetY, gapRadius]);

  return { targetEl, mergedPosInfo };
}

interface ElTourContentProps {
  reference: HTMLElement | null;
  gapRect: PosInfo | null;
  /** 启用遮罩时定位基准换成挖孔矩形 */
  useMask: boolean;
  placement: TourPlacement;
  showArrow: boolean;
  zIndex: number;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElTourContent：负责浮层定位、焦点陷阱与箭头。
 * 每一步都会以 current 作为 key 重建，所以焦点陷阱也随步骤重新初始化。
 */
function ElTourContent({
  reference,
  gapRect,
  useMask,
  placement,
  showArrow,
  zIndex,
  style,
  children,
}: ElTourContentProps) {
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

  const { contentStyle, arrowStyle, setArrowEl, placementAttribute } = useTourFloating({
    reference,
    gapRect,
    useMask,
    contentEl,
    placement,
    offset: 10,
    zIndex,
    showArrow,
  });

  // 优先用 popper 的实际方位（翻转后），CSS 靠它决定箭头贴边与三角形缺口
  const side = (placementAttribute ?? placement).split("-")[0];

  return (
    <div
      ref={setContentEl}
      className="el-tour__content"
      data-side={side}
      tabIndex={-1}
      style={{ ...contentStyle, ...style }}
    >
      <ElFocusTrap loop trapped focusStartEl="container" focusTrapEl={contentEl}>
        {children}
        <TourFooter />
      </ElFocusTrap>
      {showArrow && (
        // 箭头在焦点陷阱之外，避免被 Tab 循环当成可聚焦元素
        <span ref={setArrowEl} className="el-tour__arrow" style={arrowStyle} />
      )}
    </div>
  );
}

/**
 * 对应官方 ElTour。
 *
 * 结构对齐官方：`.el-tour`（承载 --primary 变量）里放遮罩与内容层，
 * 整体 teleport 到 appendTo（默认 body），因此不会受宿主元素的定位影响。
 * 遮罩挖孔与内容层都以「带 gap 的挖孔矩形」为定位基准。
 */
export function ElTour({
  visible = false,
  onVisibleChange,
  current: currentProp,
  onCurrentChange,
  onChange,
  onClose,
  onFinish,
  showArrow = true,
  showClose = true,
  closeIcon,
  placement = "bottom",
  contentStyle,
  mask = true,
  gap,
  zIndex: zIndexProp,
  scrollIntoViewOptions = { block: "center" },
  type,
  appendTo = "body",
  closeOnPressEscape = true,
  targetAreaClickable = true,
  indicators,
  className,
  style,
  children,
}: TourProps) {
  const t = useTranslator();
  const { currentZIndex } = useZIndex(zIndexProp);

  // 官方 gap 默认 { offset: 6, radius: 2 }，传部分字段时其余走默认
  const resolvedGap = useMemo<TourGap>(
    () => ({ offset: gap?.offset ?? 6, radius: gap?.radius ?? 2 }),
    [gap],
  );

  const isControlled = currentProp !== undefined;
  const [innerCurrent, setInnerCurrent] = useState(currentProp ?? 0);
  const current = isControlled ? currentProp : innerCurrent;

  // 收集步骤，顺序即 ElTourStep 子元素的书写顺序
  const steps = useMemo(
    () =>
      Children.toArray(children).filter(
        (child): child is ReactElement<TourStepProps> =>
          isValidElement(child) && child.type === ElTourStep,
      ),
    [children],
  );

  const total = steps.length;
  const currentStep = steps[current]?.props;

  const mergedPlacement = currentStep?.placement || placement;
  const mergedContentStyle = currentStep?.contentStyle ?? contentStyle;
  const mergedMask = currentStep?.mask ?? mask;
  const mergedShowMask = !!mergedMask && visible;
  const mergedMaskStyle = typeof mergedMask === "boolean" ? undefined : mergedMask;
  const mergedType: TourType = currentStep?.type ?? type ?? "default";
  const mergedScrollIntoViewOptions =
    currentStep?.scrollIntoViewOptions ?? scrollIntoViewOptions;
  const mergedZIndex = zIndexProp ?? currentZIndex;

  const { targetEl, mergedPosInfo } = useTourTarget(
    currentStep?.target,
    visible,
    resolvedGap,
    mergedScrollIntoViewOptions,
  );

  // 官方仅在有目标且开启箭头时才显示箭头
  const mergedShowArrow = !!currentStep?.target && (currentStep?.showArrow ?? showArrow);

  const mergedShowClose = currentStep?.showClose ?? showClose;
  const mergedCloseIcon = useMemo(
    () => currentStep?.closeIcon ?? closeIcon ?? <Close />,
    [currentStep?.closeIcon, closeIcon],
  );

  const changeCurrent = useCallback(
    (next: number) => {
      const oldValue = isControlled ? currentProp : innerCurrent;
      if (oldValue === next) return;

      if (!isControlled) setInnerCurrent(next);
      onCurrentChange?.(next);
    },
    [isControlled, currentProp, innerCurrent, onCurrentChange],
  );

  // 关闭导览时把步骤复位到第一步，对应官方 watch(modelValue) 的重置。
  // 用「渲染期条件重设」而不是 effect：这是 React 官方推荐的 props 变化调整 state 写法，
  // 不会多跑一轮副作用，也不会把复位误报成一次 change
  const [prevVisible, setPrevVisible] = useState(visible);
  if (prevVisible !== visible) {
    setPrevVisible(visible);
    if (!visible && innerCurrent !== 0) setInnerCurrent(0);
  }

  const updateModelValue = useCallback(
    (next: boolean) => onVisibleChange?.(next),
    [onVisibleChange],
  );

  const closeStep = useCallback(() => {
    updateModelValue(false);
    onClose?.(current);
    currentStep?.onClose?.();
  }, [updateModelValue, onClose, current, currentStep]);

  const finishTour = useCallback(() => {
    closeStep();
    onFinish?.();
  }, [closeStep, onFinish]);

  // 外部直接改 current 时同步内部值，与官方 watch(props.current) 一致
  const [prevCurrentProp, setPrevCurrentProp] = useState(currentProp);
  if (currentProp !== prevCurrentProp) {
    setPrevCurrentProp(currentProp);
    if (currentProp !== undefined) setInnerCurrent(currentProp);
  }

  // 对应官方 change 事件：仅当导览处于打开状态且步骤确实变化时抛出
  const prevCurrentRef = useRef(current);
  useEffect(() => {
    const prev = prevCurrentRef.current;
    if (prev === current) return;
    prevCurrentRef.current = current;
    if (!visible) return;
    onChange?.(current);
  }, [current, visible, onChange]);

  // ESC 关闭
  useEffect(() => {
    if (!visible || !closeOnPressEscape) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      updateModelValue(false);
      onClose?.(current);
    };

    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [visible, closeOnPressEscape, updateModelValue, onClose, current]);

  // 左右方向键切换步骤，对应官方 step.vue 的 handleKeydown
  useEffect(() => {
    if (!visible) return;

    const onKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (current > 0) changeCurrent(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (current >= total - 1) finishTour();
        else changeCurrent(current + 1);
      }
    };

    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [visible, current, total, changeCurrent, finishTour]);

  const contextValue = useMemo<TourContextValue>(
    () => ({
      current,
      total,
      step: currentStep,
      showClose: mergedShowClose,
      closeIcon: mergedCloseIcon,
      mergedType,
      indicators,
      updateModelValue,
      changeCurrent,
      closeStep,
      finishTour,
    }),
    [
      current,
      total,
      currentStep,
      mergedShowClose,
      mergedCloseIcon,
      mergedType,
      indicators,
      updateModelValue,
      changeCurrent,
      closeStep,
      finishTour,
    ],
  );

  // 只在浏览器端走 portal，避免服务端渲染时拿不到容器。
  // 用 useSyncExternalStore 拿「已挂载」这一客户端事实：快照返回值恒真，
  // 服务端快照返回 false，既满足 hydration 前的占位又不在 effect 里写 state
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getMountedSnapshot,
    getServerMountedSnapshot,
  );

  const classes = [
    "el-tour",
    mergedType === "primary" && "el-tour--primary",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div className={classes} style={style}>
      <ElTourMask
        visible={mergedShowMask}
        fill={mergedMaskStyle?.color ?? DEFAULT_MASK_FILL}
        pos={mergedPosInfo}
        zIndex={mergedZIndex}
        targetAreaClickable={targetAreaClickable}
        style={mergedMaskStyle?.style}
      />

      {visible && (
        <TourContext.Provider value={contextValue}>
          <ElTourContent
            key={current}
            reference={targetEl}
            gapRect={mergedPosInfo}
            useMask={!!mergedMask}
            placement={mergedPlacement}
            showArrow={mergedShowArrow}
            zIndex={mergedZIndex}
            style={mergedContentStyle}
          >
            {currentStep && (
              <>
                {mergedShowClose && (
                  <button
                    type="button"
                    aria-label={t("el.tour.close")}
                    className="el-tour__closebtn"
                    onClick={closeStep}
                  >
                    <ElIcon className="el-tour__close">{mergedCloseIcon}</ElIcon>
                  </button>
                )}

                <header
                  className={["el-tour__header", mergedShowClose && "show-close"]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {currentStep.header ?? (
                    <span role="heading" aria-level={2} className="el-tour__title">
                      {currentStep.title}
                    </span>
                  )}
                </header>

                <div className="el-tour__body">
                  {currentStep.children ?? <span>{currentStep.description}</span>}
                </div>
              </>
            )}
          </ElTourContent>
        </TourContext.Provider>
      )}
    </div>
  );

  if (!mounted) return null;

  const container =
    typeof appendTo === "string"
      ? document.querySelector<HTMLElement>(appendTo) ?? document.body
      : appendTo;

  return createPortal(content, container);
}

/** 对应官方 step.vue 的 footer：指示器 + 上一步 / 下一步按钮。 */
function TourFooter() {
  const context = useContext(TourContext);
  const t = useTranslator();
  if (!context) return null;

  const { current, total, mergedType, indicators, changeCurrent, finishTour, step } = context;

  const handlePrev = () => {
    changeCurrent(current - 1);
    step?.prevButtonProps?.onClick?.();
  };

  const handleNext = () => {
    if (current >= total - 1) finishTour();
    else changeCurrent(current + 1);
    step?.nextButtonProps?.onClick?.();
  };

  // 官方通过 omit(btnProps, ['children','onClick']) 过滤，剩余字段透传给 ElButton
  const { children: prevChildren, ...prevRest } = step?.prevButtonProps ?? {};
  const { children: nextChildren, ...nextRest } = step?.nextButtonProps ?? {};

  return (
    <footer className="el-tour__footer">
      <div className="el-tour-indicators">
        {indicators ? (
          // 官方 step.vue 传给插槽的是 0 基的 current，示例里自行 +1 展示
          indicators({ current, total })
        ) : (
          // 官方用 v-for="(item, index) in total" 渲染 total 个圆点
          Array.from({ length: total }).map((_, index) => (
            <span
              key={index}
              className={["el-tour-indicator", index === current && "is-active"]
                .filter(Boolean)
                .join(" ")}
            />
          ))
        )}
      </div>
      <div className="el-tour-buttons">
        {current > 0 && (
          <ElButton size="small" type={mergedType} {...prevRest} onClick={handlePrev}>
            {prevChildren ?? t("el.tour.previous")}
          </ElButton>
        )}
        {current <= total - 1 && (
          <ElButton
            size="small"
            type={mergedType === "primary" ? "default" : "primary"}
            {...nextRest}
            onClick={handleNext}
          >
            {nextChildren ?? (current === total - 1 ? t("el.tour.finish") : t("el.tour.next"))}
          </ElButton>
        )}
      </div>
    </footer>
  );
}
