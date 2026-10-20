"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPopper } from "@popperjs/core";
import type { Instance, Options, PositioningStrategy } from "@popperjs/core";

/**
 * popper 的 Modifier 类型要求 enabled / phase / fn 齐全，
 * 但仅作为配置传入的修饰符只需 name + options。
 * 官方用 Modifier<any, any> 绕过，这里用等价的宽松类型。
 */
type LooseModifier = {
  name: string;
  options?: Record<string, unknown>;
  enabled?: boolean;
  phase?: string;
  fn?: (arg: never) => void;
  requires?: string[];
};

/** 与官方 packages/components/popper/src/content.ts 的枚举一致。 */
export const placements = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
] as const;

export type PopperPlacement = (typeof placements)[number];
export type PopperEffect = "light" | "dark" | (string & {});
export type PositioningStrategyType = PositioningStrategy;

export interface PopperCoreConfig {
  /** 边界内边距 */
  boundariesPadding?: number;
  /** 兜底方位，翻转后仍放不下时按此列表尝试 */
  fallbackPlacements?: PopperPlacement[];
  /** 是否启用 GPU 加速 */
  gpuAcceleration?: boolean;
  /** 与触发元素的距离 */
  offset?: number;
  /** 弹出位置 */
  placement?: PopperPlacement;
  /** 透传给 popper.js 的原始配置 */
  popperOptions?: Partial<Options>;
  /** 定位策略 */
  strategy?: PositioningStrategyType;
}

/**
 * 对应官方 utils.ts 的 genModifiers。
 *
 * 参数逐项对齐：offset 为 [0, offset ?? 12]，flip 的 padding 固定 5，
 * preventOverflow 的 padding 全 0。
 */
function genModifiers({
  offset,
  gpuAcceleration,
  fallbackPlacements,
}: PopperCoreConfig): LooseModifier[] {
  return [
    {
      name: "offset",
      options: { offset: [0, offset ?? 12] },
    },
    {
      name: "preventOverflow",
      options: {
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
      },
    },
    {
      name: "flip",
      options: { padding: 5, fallbackPlacements },
    },
    {
      name: "computeStyles",
      options: { gpuAcceleration },
    },
  ];
}

/**
 * 对应官方 buildPopperOptions。
 *
 * 注意 applyStyles 被显式关闭：官方自己接收 state 里的 styles 写到元素上，
 * 以便和 Vue 的响应式更新合流。React 侧同样如此。
 */
export function buildPopperOptions(
  config: PopperCoreConfig,
  extraModifiers: LooseModifier[] = [],
): Options {
  const { placement, strategy, popperOptions } = config;

  const options = {
    placement: placement ?? "bottom",
    strategy: strategy ?? "absolute",
    ...popperOptions,
    modifiers: [
      ...genModifiers(config),
      ...extraModifiers,
      // 与官方一致：不让 popper 直接改样式，改由 React 写入
      { name: "applyStyles", enabled: false },
    ],
  } as unknown as Options;

  const userModifiers = popperOptions?.modifiers;
  if (userModifiers) {
    (options.modifiers as LooseModifier[]) = [
      ...((options.modifiers as LooseModifier[]) ?? []),
      ...(userModifiers as unknown as LooseModifier[]),
    ];
  }

  return options;
}

export interface UsePopperOptions extends PopperCoreConfig {
  /** 触发元素 */
  reference: HTMLElement | null;
  /** 浮层元素 */
  popper: HTMLElement | null;
  /** 箭头元素，对应官方 arrow 修饰符的 element */
  arrow?: HTMLElement | null;
}

/**
 * 对应官方 usePopper。
 *
 * 官方把 state.attributes 里的 data-popper-placement 写到浮层上（scss 靠它做箭头方向），
 * styles 则包含 popper 与 arrow 两部分的定位值。
 */
export function usePopper({
  reference,
  popper,
  arrow,
  ...config
}: UsePopperOptions) {
  const instanceRef = useRef<Instance | null>(null);
  const [state, setState] = useState<{
    styles: Record<string, Record<string, string>>;
    attributes: Record<string, Record<string, string>>;
  }>({
    styles: {
      popper: { position: config.strategy ?? "absolute", left: "0", top: "0" },
      arrow: { position: "absolute" },
    },
    attributes: {},
  });
  const options = useMemo(
    () => {
      // 官方 usePopperContent 会追加 arrow 修饰符，否则 popper 不会计算箭头坐标
      const arrowModifier: LooseModifier[] = arrow
        ? [{ name: "arrow", options: { element: arrow, padding: 0 } }]
        : [];
      return buildPopperOptions(config, arrowModifier);
    },
    // 逐项列出依赖，避免对象字面量每次重建导致 popper 反复重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      config.placement,
      config.strategy,
      config.offset,
      config.gpuAcceleration,
      config.boundariesPadding,
      config.fallbackPlacements,
      config.popperOptions,
      arrow,
    ],
  );

  useEffect(() => {
    if (!reference || !popper) return;

    // 与官方一致：状态更新修饰符在 write 阶段读 state，转成 React 能用的普通对象
    const stateUpdater = {
      name: "updateState",
      enabled: true as const,
      phase: "write" as const,
      fn: ({ state: popperState }: { state: PopperState }) => {
        setState(deriveState(popperState));
      },
      requires: ["computeStyles"],
    };

    const instance = createPopper(reference, popper, {
      ...options,
      modifiers: [
        ...((options.modifiers as LooseModifier[]) ?? []),
        stateUpdater as unknown as LooseModifier,
      ],
    } as unknown as Options);

    instanceRef.current = instance;

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [reference, popper, options]);

  return {
    styles: state.styles,
    attributes: state.attributes,
    update: () => instanceRef.current?.update(),
    forceUpdate: () => instanceRef.current?.forceUpdate(),
  };
}

/** popper 的 State，仅取本文件用到的字段。 */
interface PopperState {
  elements: Record<string, unknown>;
  styles: Record<string, Partial<CSSStyleDeclaration>>;
  attributes: Record<string, Record<string, string>>;
}

/** 对应官方 deriveState：把 popper 的 state.styles / attributes 摊平。 */
function deriveState(popperState: PopperState) {
  const elements = Object.keys(popperState.elements);

  const styles: Record<string, Record<string, string>> = {};
  const attributes: Record<string, Record<string, string>> = {};

  for (const el of elements) {
    styles[el] = (popperState.styles[el] ?? {}) as unknown as Record<string, string>;
    attributes[el] = popperState.attributes[el] ?? {};
  }

  return { styles, attributes };
}
