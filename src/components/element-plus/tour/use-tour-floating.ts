"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createPopper,
  detectOverflow,
  type Instance,
  type Modifier,
  type Options,
  type State,
} from "@popperjs/core";
import type { CSSProperties } from "react";
import type { PosInfo, TourPlacement } from "./types";

/** 允许写入 CSS 自定义属性的 style 类型。 */
type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

/** popper 可接受的虚拟元素，只要求量出矩形，对应 floating-ui 的 VirtualElement。 */
interface VirtualRef {
  getBoundingClientRect: () => DOMRect;
}

/** 宽松的中间件类型，避免为每个中间件写一遍 popper 的泛型。 */
type AnyModifier = Modifier<string, Record<string, unknown>>;

export interface UseTourFloatingOptions {
  /** 命中目标元素，为空时内容层居中显示 */
  reference: HTMLElement | null;
  /** 带 gap 的挖孔矩形，启用遮罩时作为定位基准 */
  gapRect: PosInfo | null;
  /** 是否启用遮罩 */
  useMask: boolean;
  /** 浮层元素 */
  contentEl: HTMLElement | null;
  placement: TourPlacement;
  offset: number;
  zIndex: number;
  showArrow: boolean;
}

/**
 * 对应官方 helper.ts 的 useFloating。
 *
 * 定位引擎由 floating-ui 换成项目已有的 @popperjs/core，差异消化在三处：
 * 1. arrow 中间件：popper 的箭头坐标写在 modifier data 里而不是元素 style 上，
 *    且夹取范围按 offsetParent 计算。这里覆写同名中间件，按 floating-ui 的算式
 *    输出 left / top，由 React 写进箭头元素。
 * 2. overflow 中间件：官方用它把左右溢出折算成 maxWidth，popper 没有对应能力，
 *    这里用同名自定义中间件复刻。
 * 3. 启用遮罩时参考元素是「挖孔矩形」而非目标元素本身，用虚拟元素表达。
 *    内容层固定视口定位（strategy: fixed），与遮罩同一坐标系。
 */
export function useTourFloating({
  reference,
  gapRect,
  useMask,
  contentEl,
  placement,
  offset,
  zIndex,
  showArrow,
}: UseTourFloatingOptions) {
  const [popperStyles, setPopperStyles] = useState<Record<string, string>>({});
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  /** arrow 的 left / top，只填当前主轴那一个，另一个留给 CSS 的贴边规则 */
  const [arrowOffset, setArrowOffset] = useState<{ x?: number; y?: number } | null>(null);

  /** 箭头节点由 ref 回调交给自定义 arrow 中间件使用（popper 不会自己登记） */
  const arrowElRef = useRef<HTMLElement | null>(null);
  const setArrowEl = useCallback((element: HTMLElement | null) => {
    arrowElRef.current = element;
  }, []);

  const instanceRef = useRef<Instance | null>(null);

  /**
   * 挖孔矩形来自 ElTour 的 state，取值时点晚于渲染，
   * 用 ref 让虚拟元素读到最新的矩形，同时保持对象引用稳定（否则每次滚动都重建 popper）。
   */
  const gapRectRef = useRef<PosInfo | null>(gapRect);

  const virtualRef = useMemo<VirtualRef>(
    () => ({
      getBoundingClientRect: () =>
        window.DOMRect.fromRect({
          width: gapRectRef.current?.width ?? 0,
          height: gapRectRef.current?.height ?? 0,
          x: gapRectRef.current?.left ?? 0,
          y: gapRectRef.current?.top ?? 0,
        }),
    }),
    [],
  );

  // 官方 triggerTarget：启用遮罩时以挖孔矩形为参考元素，否则直接用目标元素
  /** 是否有可用的定位基准：目标元素存在，且启用遮罩时挖孔矩形也已算出 */
  const hasReference = !!reference && (!useMask || gapRect != null);
  const resolvedReference: HTMLElement | VirtualRef | null = hasReference
    ? useMask
      ? virtualRef
      : reference
    : null;

  /**
   * 覆写 popper 的 arrow 中间件。
   * 不声明 requires / requiresIfExists，让 mergeByName 保留内置箭头中间件的
   * 依赖关系（requires: popperOffsets、requiresIfExists: preventOverflow），
   * 从而仍在定位结果确定之后执行。
   */
  const arrowModifier = useMemo<AnyModifier>(() => {
    return {
      name: "arrow",
      enabled: true,
      phase: "main",
      fn: ({ state }: { state: State }) => {
        // popper 的 update 循环不会在两次计算之间清空 modifiersData，
        // 因此这里必须每轮都写入，否则移除箭头后会残留上一轮的坐标
        const arrowRect = arrowElRef.current?.getBoundingClientRect();
        const popperOffsets = state.modifiersData.popperOffsets as
          | { x: number; y: number }
          | undefined;
        if (!arrowRect || !popperOffsets) {
          state.modifiersData.arrow = {} as typeof state.modifiersData.arrow;
          return;
        }

        const base = state.placement.split("-")[0];
        const isVertical = base === "left" || base === "right";
        const axis = isVertical ? "y" : "x";
        const popperSize = isVertical ? state.rects.popper.height : state.rects.popper.width;
        const referenceSize = isVertical
          ? state.rects.reference.height
          : state.rects.reference.width;

        // 箭头中心与参考元素中心在主轴上的差值
        const centerToReference =
          state.rects.reference[axis] + referenceSize / 2 - (popperOffsets[axis] + popperSize / 2);

        const arrowLen = isVertical ? arrowRect.height : arrowRect.width;
        // 夹取范围以浮层自身尺寸为界，与 floating-ui 取 arrowOffsetParent 尺寸一致
        const clientSize = isVertical
          ? (state.elements.popper?.clientHeight ?? 0)
          : (state.elements.popper?.clientWidth ?? 0);
        const center = clientSize / 2 - arrowLen / 2 + centerToReference;
        const value = Math.min(Math.max(0, center), Math.max(0, clientSize - arrowLen));

        state.modifiersData.arrow = (isVertical
          ? { y: value }
          : { x: value }) as unknown as typeof state.modifiersData.arrow;
      },
      data: {},
    } as unknown as AnyModifier;
  }, []);

  /** 对应官方 overflowMiddleware：把左右溢出量折算成浮层可用的 maxWidth。 */
  const overflowModifier = useMemo<AnyModifier>(() => {
    return {
      name: "overflow",
      enabled: true,
      phase: "main",
      requiresIfExists: ["offset"],
      fn: ({ state }: { state: State }) => {
        const overflow = detectOverflow(state);
        const overWidth = Math.max(overflow.left, overflow.right, 0);
        // popper 会把 modifier 的返回值当成新的 state，这里只写 modifiersData，
        // 不能 return，否则后续 modifier 拿到的 state 会缺少 orderedModifiers。
        state.modifiersData.overflow = {
          maxWidth: state.rects.popper.width - overWidth,
        };
      },
      data: {},
    } as unknown as AnyModifier;
  }, []);

  useEffect(() => {
    if (!resolvedReference || !contentEl) return;

    /**
     * popper 的 update 是防抖的，直接读 instance.state 会拿到上一轮结果；
     * 首次结果用 onFirstUpdate 拿，后续结果统一从 write 阶段的 tourState 读取。
     */
    // popper 的 onFirstUpdate 回调参数是 State，而 tourState 中间件拿到的是
    // Instance，这里统一收敛为 State，避免首次打开时读不到定位结果。
    const readState = (state: State) => {
      const popperStyle = state.styles.popper as unknown as Record<string, string>;
      setPopperStyles({
        position: popperStyle.position,
        top: popperStyle.top,
        left: popperStyle.left,
        transform: popperStyle.transform,
      });
      setAttributes(state.attributes.popper as unknown as Record<string, string>);

      const arrowData = state.modifiersData.arrow as
        | { x?: number; y?: number }
        | undefined;
      // 两个坐标都为空（例如无箭头）时置 null，避免写入空对象触发多余渲染
      setArrowOffset(
        arrowData && (arrowData.x != null || arrowData.y != null) ? arrowData : null,
      );

      const overflowData = state.modifiersData.overflow as
        | { maxWidth?: number }
        | undefined;
      setMaxWidth(overflowData?.maxWidth ?? null);
    };

    let hasRead = false;

    const modifiers: AnyModifier[] = [
      { name: "offset", options: { offset: [0, offset] } } as unknown as AnyModifier,
      { name: "flip", options: { padding: 5 } } as unknown as AnyModifier,
      { name: "preventOverflow", options: { padding: 0 } } as unknown as AnyModifier,
      arrowModifier,
      overflowModifier,
      {
        name: "tourState",
        enabled: true,
        phase: "write",
        requiresIfExists: ["computeStyles"],
        fn: ({ instance }: { instance: Instance }) => {
          // 首次计算结果由 onFirstUpdate 消费，避免重复触发一轮渲染
          if (hasRead) readState(instance.state);
          else hasRead = true;
        },
        data: {},
      } as unknown as AnyModifier,
      // 不让 popper 直接改元素样式（会被 React 覆盖），改由状态写入
      { name: "applyStyles", enabled: false } as unknown as AnyModifier,
    ];

    const instance = createPopper(resolvedReference as never, contentEl, {
      placement,
      strategy: "fixed",
      modifiers,
      onFirstUpdate: readState,
    } as Partial<Options>);

    instanceRef.current = instance;

    // 目标移动 / 尺寸变化时跟随，对应官方 autoUpdate。
    // createPopper 的首次 setOptions 是异步的，orderedModifiers 尚未就绪时
    // 调用 update 会让 popper 在 forceUpdate 里读到 undefined。
    const safeUpdate = () => {
      if (instance.state.orderedModifiers) void instance.update();
    };
    const onScrollOrResize = () => safeUpdate();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      instance.destroy();
      instanceRef.current = null;
    };
  }, [resolvedReference, contentEl, placement, offset, arrowModifier, overflowModifier]);

  // 挖孔矩形变化（滚动 / 目标移动 / gap 变化）后重算定位
  useEffect(() => {
    gapRectRef.current = gapRect;
    if (instanceRef.current?.state.orderedModifiers) {
      void instanceRef.current.update();
    }
  }, [gapRect]);

  /** 对应官方 contentStyle：无参考元素时固定在屏幕中央。 */
  const contentStyle = useMemo<StyleWithVars>(() => {
    if (!hasReference) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate3d(-50%, -50%, 0)",
        maxWidth: "100vw",
        zIndex,
      };
    }

    return {
      position: "fixed",
      zIndex,
      top: popperStyles.top ?? "",
      left: popperStyles.left ?? "",
      transform: popperStyles.transform ?? "",
      maxWidth: maxWidth != null ? `${maxWidth}px` : "",
    };
  }, [hasReference, popperStyles, maxWidth, zIndex]);

  /** 对应官方 arrowStyle。 */
  const arrowStyle = useMemo<CSSProperties>(() => {
    if (!showArrow || !arrowOffset) return {};
    // 未设的一侧保持 undefined，交给 CSS 的贴边规则（top: -5px / left: -5px）
    return {
      left: arrowOffset.x != null ? `${arrowOffset.x}px` : undefined,
      top: arrowOffset.y != null ? `${arrowOffset.y}px` : undefined,
    };
  }, [showArrow, arrowOffset]);

  return {
    contentStyle,
    arrowStyle,
    setArrowEl,
    /** 保留 popper 产出的方位属性，与官方 data-side 语义一致 */
    placementAttribute: attributes["data-popper-placement"],
  };
}
