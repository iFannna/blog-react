"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "../generated/icons";
import {
  clampOffset,
  computePxSizes,
  getCollapsible,
  isCollapsible,
  type CollapseType,
  type PanelConfig,
  type SplitterLayout,
  type SplitterStyle,
} from "./util";

interface SplitterContextValue {
  layout: SplitterLayout;
  lazy: boolean;
  /** 面板配置，顺序即面板下标 */
  panels: PanelConfig[];
  /** 各面板像素尺寸，下标即面板顺序 */
  sizes: number[];
  containerSize: number;
  /** 是否有分隔条处于拖拽中，用于渲染遮罩 */
  dragging: boolean;
  registerPanel: (panel: PanelConfig) => void;
  unregisterPanel: (uid: string) => void;
  onMoveStart: (index: number) => void;
  onMoving: (index: number, offset: number) => void;
  onMoveEnd: (index: number) => void;
  onCollapse: (index: number, type: CollapseType) => void;
}

const SplitterContext = createContext<SplitterContextValue | null>(null);

export interface SplitterProps {
  /** 布局方向 */
  layout?: SplitterLayout;
  /** 懒更新：拖拽过程中不实时更新面板尺寸，松手后才更新 */
  lazy?: boolean;
  /** 开始拖拽分隔条，index 是分隔条下标 */
  onResizeStart?: (index: number, sizes: number[]) => void;
  /** 拖拽过程中持续触发。lazy 模式下拖拽期间不触发 */
  onResize?: (index: number, sizes: number[]) => void;
  /** 拖拽结束 */
  onResizeEnd?: (index: number, sizes: number[]) => void;
  /** 点击收起按钮折叠面板 */
  onCollapse?: (index: number, type: CollapseType, sizes: number[]) => void;
  className?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElSplitter。
 *
 * 官方用 provide/inject 收集子面板、vueuse 的 useElementSize 测量容器、useResize 算拖拽结果；
 * React 侧用 context + ResizeObserver + 等价状态机还原同一套行为与 DOM。
 *
 * 尺寸模型与官方一致：拖拽/收起把结果写成「面板的像素尺寸」（这里存在 sizeOverrides 里，
 * 按面板 uid 索引），再由 computePxSizes 换算成百分比，因此容器尺寸变化时各面板按比例伸缩。
 */
export function ElSplitter({
  layout = "horizontal",
  lazy = false,
  onResizeStart,
  onResize,
  onResizeEnd,
  onCollapse,
  className,
  children,
}: SplitterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panels, setPanels] = useState<PanelConfig[]>([]);
  const [containerSize, setContainerSize] = useState(0);
  /** 拖拽/收起后写死的面板像素尺寸，uid -> px */
  const [sizeOverrides, setSizeOverrides] = useState<Record<string, number>>({});
  // 事件处理需要读最新值，用 effect 同步镜像，避免渲染期直接写 ref
  const panelsRef = useRef(panels);
  const overridesRef = useRef(sizeOverrides);
  useEffect(() => {
    panelsRef.current = panels;
  }, [panels]);
  useEffect(() => {
    overridesRef.current = sizeOverrides;
  }, [sizeOverrides]);
  const [barOffset, setBarOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const movingRef = useRef<{ index: number; confirmed: boolean } | null>(null);
  const baseSizesRef = useRef<number[]>([]);
  /** lazy 模式拖拽期间的结果，松手时落定 */
  const pendingRef = useRef<number[] | null>(null);
  const collapsedCacheRef = useRef<number[]>([]);

  const registerPanel = useCallback((panel: PanelConfig) => {
    setPanels((prev) => {
      const at = prev.findIndex((item) => item.uid === panel.uid);
      if (at === -1) return [...prev, panel].sort((a, b) => a.order - b.order);
      const next = [...prev];
      next[at] = panel;
      return next;
    });

    // 外部 size 被改成与拖拽结果不同的值时丢弃该面板的覆盖，让新 prop 生效；
    // 拖拽过程中回写的尺寸与覆盖一致，因此不会被这里打断
    setSizeOverrides((prev) => {
      const override = prev[panel.uid];
      if (override === undefined) return prev;
      const prop = panel.size;
      if (typeof prop === "number" && Math.abs(prop - override) <= 1) return prev;
      const next = { ...prev };
      delete next[panel.uid];
      return next;
    });
  }, []);

  const unregisterPanel = useCallback((uid: string) => {
    setPanels((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  // 官方用 vueuse 的 useElementSize 监听容器，这里用 ResizeObserver 等价实现
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setContainerSize(layout === "horizontal" ? rect.width : rect.height);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [layout]);

  // 覆盖值按 uid 写进面板配置的 size，交给 computePxSizes 统一换算
  const effectivePanels = useMemo(
    () =>
      panels.map((panel) =>
        sizeOverrides[panel.uid] !== undefined
          ? { ...panel, size: sizeOverrides[panel.uid] }
          : panel,
      ),
    [panels, sizeOverrides],
  );

  const sizes = useMemo(
    () => computePxSizes(effectivePanels, containerSize),
    [effectivePanels, containerSize],
  );
  const sizesRef = useRef(sizes);
  useEffect(() => {
    sizesRef.current = sizes;
  }, [sizes]);

  /** 把一组像素尺寸写回为覆盖值，下标与 effectivePanels 对应 */
  const applySizes = useCallback((numSizes: number[]) => {
    const record: Record<string, number> = {};
    panelsRef.current.forEach((panel, i) => {
      if (numSizes[i] !== undefined) record[panel.uid] = numSizes[i];
    });
    setSizeOverrides(record);
  }, []);

  // 面板增删后旧下标会错位，清空覆盖与拖拽缓存重新均分
  const uidKey = panels.map((panel) => panel.uid).join("|");
  const lastUidKeyRef = useRef(uidKey);
  useEffect(() => {
    if (lastUidKeyRef.current === uidKey) return;
    lastUidKeyRef.current = uidKey;
    collapsedCacheRef.current = [];
    pendingRef.current = null;
    setSizeOverrides({});
  }, [uidKey]);

  const handleResizeStart = (index: number) => {
    movingRef.current = { index, confirmed: false };
    baseSizesRef.current = sizesRef.current;
    setBarOffset(0);
    setDragging(true);
    onResizeStart?.(index, sizesRef.current);
  };

  const handleResize = (index: number, offset: number) => {
    const info = movingRef.current;
    if (!info || !baseSizesRef.current.length) return;

    let mergedIndex = info.index;

    // 面板被压成 0 时视觉上会与其他分隔条重叠，按官方逻辑回退到最近的可拖拽下标
    if (!info.confirmed && offset !== 0) {
      if (offset > 0) {
        mergedIndex = index;
      } else {
        for (let i = index; i >= 0; i -= 1) {
          if (baseSizesRef.current[i] > 0) {
            mergedIndex = i;
            break;
          }
        }
      }
      movingRef.current = { index: mergedIndex, confirmed: true };
    }

    const nextIndex = mergedIndex + 1;
    if (nextIndex >= panelsRef.current.length) return;

    const { sizes: nextSizes, offset: mergedOffset } = clampOffset(
      baseSizesRef.current,
      mergedIndex,
      offset,
      panelsRef.current,
      containerSize,
    );
    nextSizes[mergedIndex] += mergedOffset;
    nextSizes[nextIndex] -= mergedOffset;

    setBarOffset(mergedOffset);

    if (lazy) {
      // lazy 模式拖拽中不显示结果，把最终尺寸暂存，松手时再落定
      pendingRef.current = nextSizes;
    } else {
      applySizes(nextSizes);
      onResize?.(mergedIndex, nextSizes);
    }
  };

  const handleMoveEnd = (index: number) => {
    const pending = pendingRef.current;
    if (lazy && pending) applySizes(pending);
    const finalSizes = pending ?? sizesRef.current;
    pendingRef.current = null;
    movingRef.current = null;
    baseSizesRef.current = [];
    setBarOffset(0);
    setDragging(false);
    // 等 React 提交新的尺寸到 DOM 后再回传，与官方 nextTick 后 emit 一致
    requestAnimationFrame(() => onResizeEnd?.(index, finalSizes));
  };

  const handleCollapse = (index: number, type: CollapseType) => {
    const cache = collapsedCacheRef.current;
    if (!cache.length) {
      // 首次收起时记录各面板当前尺寸，再展开时按原值还原
      sizesRef.current.forEach((size, i) => {
        cache[i] = size <= 0 ? 0 : size;
      });
    }

    const currentSizes = [...sizesRef.current];
    const currentIndex = type === "start" ? index : index + 1;
    const targetIndex = type === "start" ? index + 1 : index;
    const currentSize = currentSizes[currentIndex];
    const targetSize = currentSizes[targetIndex];

    if (currentSize !== 0 && targetSize !== 0) {
      currentSizes[currentIndex] = 0;
      currentSizes[targetIndex] += currentSize;
      cache[index] = currentSize;
    } else {
      const totalSize = currentSize + targetSize;
      const targetCacheSize = Math.min(Math.max(cache[index] ?? 0, 0), totalSize);
      currentSizes[targetIndex] = targetCacheSize;
      currentSizes[currentIndex] = totalSize - targetCacheSize;
    }

    applySizes(currentSizes);
    onCollapse?.(index, type, currentSizes);
  };

  const splitterStyle: SplitterStyle =
    lazy && barOffset
      ? { "--el-splitter-bar-offset": `${barOffset}px` }
      : {};

  const classes = ["el-splitter", `el-splitter__${layout}`, className]
    .filter(Boolean)
    .join(" ");

  const contextValue: SplitterContextValue = {
    layout,
    lazy,
    panels,
    sizes,
    containerSize,
    dragging,
    registerPanel,
    unregisterPanel,
    onMoveStart: handleResizeStart,
    onMoving: handleResize,
    onMoveEnd: handleMoveEnd,
    onCollapse: handleCollapse,
  };

  return (
    <div
      ref={containerRef}
      className={classes}
      style={splitterStyle}
      role="group"
    >
      <SplitterContext.Provider value={contextValue}>
        {children}
      </SplitterContext.Provider>
      {/* 拖拽时铺一层遮罩，避免鼠标移入 iframe 丢失事件 */}
      {dragging && (
        <div
          className={`el-splitter__mask el-splitter__mask-${layout}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export interface SplitterPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 面板尺寸，数字按 px，字符串支持 '30%' / '200px'，对应官方 v-model:size */
  size?: string | number;
  /** 尺寸变化，对应官方 update:size */
  onSizeChange?: (size: number) => void;
  /** 最小尺寸 */
  min?: string | number;
  /** 最大尺寸 */
  max?: string | number;
  /** 是否可被拖拽调整 */
  resizable?: boolean;
  /** 是否显示收起按钮 */
  collapsible?: boolean | { start?: boolean; end?: boolean };
  /** 起始收起按钮的自定义内容，对应 start-collapsible 插槽 */
  startCollapsible?: ReactNode;
  /** 结束收起按钮的自定义内容，对应 end-collapsible 插槽 */
  endCollapsible?: ReactNode;
  /** 面板内容 */
  children?: ReactNode;
}

/**
 * 对应官方 ElSplitterPanel。
 *
 * 面板配置由 context 收集、容器统一算尺寸；本组件取自己在 panels 里的下标读取尺寸。
 * 面板后的分隔条一并渲染，只有下一个面板存在时才显示（最后一个面板没有分隔条）。
 */
export function ElSplitterPanel({
  size,
  onSizeChange,
  min,
  max,
  resizable = true,
  collapsible,
  startCollapsible,
  endCollapsible,
  children,
  className,
  style,
  ...rest
}: SplitterPanelProps) {
  const context = useContext(SplitterContext);
  if (!context) {
    throw new Error(
      "ElSplitterPanel: usage <ElSplitter><ElSplitterPanel /></ElSplitter>",
    );
  }

  const uid = useId();
  const { registerPanel, unregisterPanel, layout, lazy, panels, sizes } =
    context;

  const index = panels.findIndex((panel) => panel.uid === uid);

  // order 只在首次挂载时分配，属性更新重注册时保持不变，保证面板下标稳定。
  // 用惰性初始化：不在渲染期调用不纯函数（Date.now / Math.random）。
  const [order] = useState(() => nextPanelOrder());

  const config = useMemo<PanelConfig>(
    () => ({
      uid,
      order,
      size,
      min,
      max,
      resizable,
      collapsible: getCollapsible(collapsible),
    }),
    [uid, order, size, min, max, resizable, collapsible],
  );

  const registerRef = useRef(registerPanel);
  const unregisterRef = useRef(unregisterPanel);
  useEffect(() => {
    registerRef.current = registerPanel;
  }, [registerPanel]);
  useEffect(() => {
    unregisterRef.current = unregisterPanel;
  }, [unregisterPanel]);

  useEffect(() => {
    registerRef.current(config);
    return () => unregisterRef.current(uid);
  }, [config, uid]);

  const panelSize = index >= 0 ? (sizes[index] ?? 0) : 0;
  const nextSize = index >= 0 ? (sizes[index + 1] ?? 0) : 0;
  const nextPanel = index >= 0 ? panels[index + 1] : undefined;

  // size 双向绑定：容器算出的尺寸与外部 size 不同时回写 onSizeChange
  const emitSizeRef = useRef(onSizeChange);
  useEffect(() => {
    emitSizeRef.current = onSizeChange;
  }, [onSizeChange]);
  const lastSizeRef = useRef<number | null>(null);

  useEffect(() => {
    if (index < 0 || !sizes.length) return;
    const current = panelSize;
    const previous = lastSizeRef.current;
    lastSizeRef.current = current;
    const propSize =
      typeof size === "number" ? size : size ? Number.parseFloat(size) : undefined;
    // 与官方一致：尺寸与外部传入值不同才回写 update:size，避免与受控值来回震荡
    if (previous !== null && previous !== current && current !== propSize) {
      emitSizeRef.current?.(current);
    }
  }, [index, panelSize, size, sizes.length]);

  const isResizable =
    !!nextPanel &&
    resizable &&
    nextPanel.resizable &&
    // 尺寸为 0 说明已折叠，此时只有设了 min 才允许再拖开
    (panelSize !== 0 || !min) &&
    (nextSize !== 0 || !nextPanel.min);

  const isShowBar = index >= 0 && index !== panels.length - 1;

  const startCollapseEnabled = isCollapsible(
    panels[index],
    panelSize,
    nextPanel,
    nextSize,
  );
  const endCollapseEnabled = isCollapsible(
    nextPanel,
    nextSize,
    panels[index],
    panelSize,
  );

  const panelStyle: CSSProperties = {
    flexBasis: `${panelSize}px`,
    ...style,
  };

  return (
    <>
      <div
        className={["el-splitter-panel", className].filter(Boolean).join(" ")}
        style={panelStyle}
        {...rest}
      >
        {children}
      </div>
      {isShowBar && (
        <SplitBar
          index={index}
          layout={layout}
          lazy={lazy}
          resizable={isResizable}
          startCollapsible={startCollapseEnabled}
          endCollapsible={endCollapseEnabled}
          startCollapsibleSlot={startCollapsible}
          endCollapsibleSlot={endCollapsible}
        />
      )}
    </>
  );
}

interface SplitBarProps {
  index: number;
  layout: SplitterLayout;
  lazy: boolean;
  resizable: boolean;
  startCollapsible: boolean;
  endCollapsible: boolean;
  startCollapsibleSlot?: ReactNode;
  endCollapsibleSlot?: ReactNode;
}

/**
 * 对应官方 split-bar.vue（内部组件，不对外导出）。
 * 拖拽带 16px、包裹层按方向取 0 宽度，均与官方写死的尺寸一致。
 */
function SplitBar({
  index,
  layout,
  lazy,
  resizable,
  startCollapsible,
  endCollapsible,
  startCollapsibleSlot,
  endCollapsibleSlot,
}: SplitBarProps) {
  const context = useContext(SplitterContext);
  if (!context) throw new Error("SplitBar must be used within ElSplitter");

  const { onMoveStart, onMoving, onMoveEnd, onCollapse } = context;
  const isHorizontal = layout === "horizontal";
  const [active, setActive] = useState(false);
  const startPosRef = useRef<[number, number] | null>(null);

  /** window 监听器只绑定一次，事件里通过 latestRef 转发到最新闭包 */
  const latestRef = useRef({ index, isHorizontal, onMoving, onMoveEnd });
  useEffect(() => {
    latestRef.current = { index, isHorizontal, onMoving, onMoveEnd };
  }, [index, isHorizontal, onMoving, onMoveEnd]);
  const handlersRef = useRef<{
    move: (e: globalThis.MouseEvent) => void;
    up: () => void;
    touchMove: (e: globalThis.TouchEvent) => void;
    touchEnd: () => void;
  } | null>(null);

  const detach = useCallback(() => {
    const handler = handlersRef.current;
    if (!handler) return;
    window.removeEventListener("mousemove", handler.move);
    window.removeEventListener("mouseup", handler.up);
    window.removeEventListener("touchmove", handler.touchMove);
    window.removeEventListener("touchend", handler.touchEnd);
    handlersRef.current = null;
  }, []);

  const attach = useCallback(() => {
    if (handlersRef.current) return;

    const move = (e: globalThis.MouseEvent) => {
      const latest = latestRef.current;
      const start = startPosRef.current;
      if (!start) return;
      const offset = latest.isHorizontal
        ? e.pageX - start[0]
        : e.pageY - start[1];
      latest.onMoving(latest.index, offset);
    };
    const up = () => {
      const latest = latestRef.current;
      startPosRef.current = null;
      setActive(false);
      detach();
      latest.onMoveEnd(latest.index);
    };
    const touchMove = (e: globalThis.TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const latest = latestRef.current;
      const start = startPosRef.current;
      if (!start) return;
      const touch = e.touches[0];
      const offset = latest.isHorizontal
        ? touch.pageX - start[0]
        : touch.pageY - start[1];
      latest.onMoving(latest.index, offset);
    };
    const touchEnd = () => {
      const latest = latestRef.current;
      startPosRef.current = null;
      setActive(false);
      detach();
      latest.onMoveEnd(latest.index);
    };

    handlersRef.current = { move, up, touchMove, touchEnd };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd);
  }, [detach]);

  // 拖拽中途被卸载时清理全局监听
  useEffect(() => detach, [detach]);

  const onMouseDown = (e: MouseEvent) => {
    if (!resizable) return;
    e.preventDefault();
    startPosRef.current = [e.pageX, e.pageY];
    setActive(true);
    onMoveStart(index);
    attach();
  };

  const onTouchStart = (e: TouchEvent) => {
    if (!resizable || e.touches.length !== 1) return;
    // 拖拽带的 touch-action 已置为 none，无需 preventDefault，避免触发被动监听告警
    const touch = e.touches[0];
    startPosRef.current = [touch.pageX, touch.pageY];
    setActive(true);
    onMoveStart(index);
    attach();
  };

  const StartIcon = isHorizontal ? ArrowLeft : ArrowUp;
  const EndIcon = isHorizontal ? ArrowRight : ArrowDown;

  const draggerClasses = [
    "el-splitter-bar__dragger",
    `el-splitter-bar__dragger-${isHorizontal ? "horizontal" : "vertical"}`,
    active && "el-splitter-bar__dragger-active",
    !resizable && "is-disabled",
    resizable && lazy && "is-lazy",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="el-splitter-bar"
      style={isHorizontal ? { width: 0 } : { height: 0 }}
    >
      {startCollapsible && (
        <div
          className={[
            "el-splitter-bar__collapse-icon",
            `el-splitter-bar__${layout}-collapse-icon-start`,
          ].join(" ")}
          onClick={() => onCollapse(index, "start")}
        >
          {startCollapsibleSlot ?? (
            <ElIcon size={12}>
              <StartIcon />
            </ElIcon>
          )}
        </div>
      )}

      <div
        className={draggerClasses}
        style={{
          width: isHorizontal ? 16 : "100%",
          height: isHorizontal ? "100%" : 16,
          cursor: !resizable
            ? "auto"
            : isHorizontal
              ? "ew-resize"
              : "ns-resize",
          touchAction: "none",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      />

      {endCollapsible && (
        <div
          className={[
            "el-splitter-bar__collapse-icon",
            `el-splitter-bar__${layout}-collapse-icon-end`,
          ].join(" ")}
          onClick={() => onCollapse(index, "end")}
        >
          {endCollapsibleSlot ?? (
            <ElIcon size={12}>
              <EndIcon />
            </ElIcon>
          )}
        </div>
      )}
    </div>
  );
}

/** 面板顺序号：模块级自增，保证同一次渲染中并列面板的顺序稳定。 */
let panelOrderSeed = 0;
function nextPanelOrder() {
  return ++panelOrderSeed;
}
