"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
  type ReactNode,
  type SyntheticEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import { ElFocusTrap } from "../focus-trap/ElFocusTrap";
import { ElIcon } from "../icon/ElIcon";
import { ArrowLeft, ArrowRight, Close, ZoomIn } from "../icons";
import {
  FullScreen,
  RefreshLeft,
  RefreshRight,
  ScaleToOriginal,
  ZoomOut,
} from "./viewer-icons";
import { useTranslator } from "../config-provider/context";
import { useZIndex } from "../popper/use-z-index";
import type {
  ImageViewerAction,
  ImageViewerActionOptions,
  ImageViewerErrorScope,
  ImageViewerProgressScope,
  ImageViewerToolbarScope,
} from "./types";

export interface ImageViewerProps {
  /** 预览链接列表，对应官方 url-list */
  urlList?: string[];
  /** 预览遮罩层级 */
  zIndex?: number;
  /** 初始预览下标 */
  initialIndex?: number;
  /** 是否循环预览 */
  infinite?: boolean;
  /** 点击遮罩是否关闭 */
  hideOnClickModal?: boolean;
  /** 是否把查看器传送到 body */
  teleported?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnPressEscape?: boolean;
  /** 缩放比例基数，对应官方 zoom-rate */
  zoomRate?: number;
  /** 预览图片缩放值，对应官方 scale */
  scale?: number;
  /** 最小缩放值 */
  minScale?: number;
  /** 最大缩放值 */
  maxScale?: number;
  /** 是否显示进度 */
  showProgress?: boolean;
  /** 原生 crossorigin */
  crossorigin?: string;
  /** 关闭回调 */
  onClose?: () => void;
  /** 图片加载失败回调 */
  onError?: (event: Event) => void;
  /** 切换图片回调 */
  onSwitch?: (index: number) => void;
  /** 旋转回调 */
  onRotate?: (deg: number) => void;
  /** 自定义内容，对应默认插槽 */
  children?: ReactNode;
  /** 对应 progress 插槽 */
  renderProgress?: (scope: ImageViewerProgressScope) => ReactNode;
  /** 对应 toolbar 插槽 */
  renderToolbar?: (scope: ImageViewerToolbarScope) => ReactNode;
  /** 对应 viewer-error 插槽 */
  renderViewerError?: (scope: ImageViewerErrorScope) => ReactNode;
  /** 供 ElImage 通过 ref 调用 setActiveItem */
  exposeRef?: MutableRefObject<{ setActiveItem: (index: number) => void } | null>;
  className?: string;
  style?: CSSProperties;
}

interface TransformState {
  scale: number;
  deg: number;
  offsetX: number;
  offsetY: number;
  enableTransition: boolean;
}

/** 对应官方 clamp。 */
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 对应官方 ElImageViewer。
 *
 * 缩放 / 旋转 / 拖拽全靠一份 transform 状态换算成 CSS transform：
 *   scale(s) rotate(deg) translate(x, y)
 * translate 会先按 deg 旋转坐标系再除以 scale，
 * 保证放大后拖拽的位移与鼠标位移一致（与官方 imgStyle 同一套公式）。
 */
export function ElImageViewer({
  urlList = [],
  zIndex,
  initialIndex = 0,
  infinite = true,
  hideOnClickModal = false,
  teleported = false,
  closeOnPressEscape = true,
  zoomRate = 1.2,
  scale = 1,
  minScale = 0.2,
  maxScale = 7,
  showProgress = false,
  crossorigin,
  onClose,
  onError,
  onSwitch,
  onRotate,
  children,
  renderProgress,
  renderToolbar,
  renderViewerError,
  exposeRef,
  className,
  style,
}: ImageViewerProps) {
  const t = useTranslator();
  const { currentZIndex } = useZIndex(zIndex);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragCleanupRef = useRef<(() => void) | null>(null);

  const scaleClamped = clamp(scale, minScale, maxScale);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  // 对应官方 mode：contain（图片缩在视口内）/ original（原始尺寸）
  const [mode, setMode] = useState<"contain" | "original">("contain");
  // scale 是受控属性：存「基准值 + 状态」，外部变化时在渲染期派生，
  // 避免用 effect 同步 setState 造成级联渲染
  const [transformStore, setTransformStore] = useState<{
    baseScale: number;
    transform: TransformState;
  }>(() => ({
    baseScale: scaleClamped,
    transform: {
      scale: scaleClamped,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false,
    },
  }));

  const transform = useMemo(
    () =>
      transformStore.baseScale === scaleClamped
        ? transformStore.transform
        : { ...transformStore.transform, scale: scaleClamped },
    [transformStore, scaleClamped],
  );

  const setTransform = useCallback(
    (
      next: TransformState | ((prev: TransformState) => TransformState),
    ) => {
      setTransformStore((store) => {
        const current =
          store.baseScale === scaleClamped
            ? store.transform
            : { ...store.transform, scale: scaleClamped };
        return {
          baseScale: scaleClamped,
          transform: typeof next === "function" ? next(current) : next,
        };
      });
    },
    [scaleClamped],
  );

  const isSingle = urlList.length <= 1;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === urlList.length - 1;
  const currentImg = urlList[activeIndex] ?? "";

  // 打开期间锁滚动，对应官方 useLockscreen 给 body 加 el-image-viewer-parent--hidden
  useEffect(() => {
    document.body.classList.add("el-image-viewer-parent--hidden");
    return () => {
      document.body.classList.remove("el-image-viewer-parent--hidden");
    };
  }, []);

  const reset = useCallback(() => {
    setTransform({
      scale: scaleClamped,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false,
    });
  }, [scaleClamped, setTransform]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "contain" ? "original" : "contain"));
    reset();
  }, [reset]);

  const hide = useCallback(() => {
    dragCleanupRef.current?.();
    onClose?.();
  }, [onClose]);

  const setActiveItem = useCallback(
    (index: number) => {
      setLoadError(false);
      const len = urlList.length;
      if (len === 0) return;
      setActiveIndex(((index % len) + len) % len);
    },
    [urlList.length],
  );

  const prev = useCallback(() => {
    if (isFirst && !infinite) return;
    setActiveItem(activeIndex - 1);
  }, [activeIndex, infinite, isFirst, setActiveItem]);

  const next = useCallback(() => {
    if (isLast && !infinite) return;
    setActiveItem(activeIndex + 1);
  }, [activeIndex, infinite, isLast, setActiveItem]);

  // 对应官方 handleActions：缩放 / 旋转，zoomRate 与 rotateDeg 可被 options 覆盖
  const handleActions = useCallback(
    (action: ImageViewerAction, options: ImageViewerActionOptions = {}) => {
      if (loading || loadError) return;

      const {
        zoomRate: actionZoomRate = zoomRate,
        rotateDeg = 90,
        enableTransition = true,
      } = options;

      setTransform((prevState) => {
        const nextState = { ...prevState, enableTransition };

        switch (action) {
          case "zoomOut":
            if (prevState.scale > minScale) {
              nextState.scale = Number.parseFloat(
                (prevState.scale / actionZoomRate).toFixed(3),
              );
            }
            return nextState;
          case "zoomIn":
            if (prevState.scale < maxScale) {
              nextState.scale = Number.parseFloat(
                (prevState.scale * actionZoomRate).toFixed(3),
              );
            }
            return nextState;
          case "clockwise":
            nextState.deg = prevState.deg + rotateDeg;
            return nextState;
          case "anticlockwise":
            nextState.deg = prevState.deg - rotateDeg;
            return nextState;
          default:
            return nextState;
        }
      });

      if (action === "clockwise" || action === "anticlockwise") {
        // state 提交后才能读到新角度，这里按当前值推算，与官方 emit 时机一致
        const delta = action === "clockwise" ? rotateDeg : -rotateDeg;
        onRotate?.(transform.deg + delta);
      }
    },
    [
      loading,
      loadError,
      zoomRate,
      minScale,
      maxScale,
      onRotate,
      transform.deg,
      setTransform,
    ],
  );

  // 对应官方 watch(activeIndex)：切图后复位并抛 switch（首次挂载不抛，与官方 watch 一致）
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    reset();
    onSwitch?.(activeIndex);
    // 只在 activeIndex 变化时触发，reset / onSwitch 不参与依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // 对应官方 watch(currentImg)：新图未缓存完成时先显示 loading
  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) {
      setLoading(true);
    }
  }, [currentImg]);

  // 键盘与滚轮监听，对应官方 registerEventListener
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Escape":
          if (closeOnPressEscape) hide();
          break;
        case "Space":
          toggleMode();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "ArrowUp":
          handleActions("zoomIn");
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowDown":
          handleActions("zoomOut");
          break;
        default:
          break;
      }
    };

    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaY || event.deltaX;
      handleActions(delta < 0 ? "zoomIn" : "zoomOut", {
        zoomRate,
        enableTransition: false,
      });
    };

    document.addEventListener("keydown", onKeydown);
    const wrapper = wrapperRef.current;
    wrapper?.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      document.removeEventListener("keydown", onKeydown);
      wrapper?.removeEventListener("wheel", onWheel);
    };
  }, [closeOnPressEscape, hide, toggleMode, prev, next, handleActions, zoomRate]);

  // 对应官方 imgStyle：把 offset 换算成随旋转角变化的 translate
  const imgStyle = useMemo<CSSProperties>(() => {
    const { scale: currentScale, deg, offsetX, offsetY, enableTransition } = transform;
    let translateX = offsetX / currentScale;
    let translateY = offsetY / currentScale;

    const radian = (deg * Math.PI) / 180;
    const cosRadian = Math.cos(radian);
    const sinRadian = Math.sin(radian);
    translateX = translateX * cosRadian + translateY * sinRadian;
    translateY = translateY * cosRadian - (offsetX / currentScale) * sinRadian;

    const nextStyle: CSSProperties = {
      transform: `scale(${currentScale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
      transition: enableTransition ? "transform .3s" : "",
    };
    if (mode === "contain") {
      nextStyle.maxWidth = "100%";
      nextStyle.maxHeight = "100%";
    }
    return nextStyle;
  }, [transform, mode]);

  const startDrag = useCallback(
    (
      startX: number,
      startY: number,
      getPoint: (event: Event) => [number, number],
      events: [string, string],
    ) => {
      const { offsetX: baseX, offsetY: baseY } = transform;
      setTransform((prevState) => ({ ...prevState, enableTransition: false }));

      const onMove = (event: Event) => {
        const [pageX, pageY] = getPoint(event);
        setTransform((prevState) => ({
          ...prevState,
          offsetX: baseX + pageX - startX,
          offsetY: baseY + pageY - startY,
        }));
      };

      const cleanup = () => {
        document.removeEventListener(events[0], onMove);
        document.removeEventListener(events[1], cleanup);
        dragCleanupRef.current = null;
      };

      document.addEventListener(events[0], onMove);
      document.addEventListener(events[1], cleanup);
      dragCleanupRef.current = cleanup;
    },
    [transform, setTransform],
  );

  const handleMouseDown = (event: ReactMouseEvent) => {
    if (loading || event.button !== 0) return;
    startDrag(
      event.pageX,
      event.pageY,
      (e) => {
        const mouseEvent = e as MouseEvent;
        return [mouseEvent.pageX, mouseEvent.pageY];
      },
      ["mousemove", "mouseup"],
    );
    event.preventDefault();
  };

  const handleTouchStart = (event: ReactTouchEvent) => {
    if (loading || event.touches.length !== 1) return;
    const touch = event.touches[0];
    startDrag(
      touch.pageX,
      touch.pageY,
      (e) => {
        const touchEvent = e as TouchEvent;
        return [touchEvent.touches[0].pageX, touchEvent.touches[0].pageY];
      },
      ["touchmove", "touchend"],
    );
  };

  // 把 setActiveItem 暴露给 ElImage；卸载时清空
  useEffect(() => {
    if (!exposeRef) return;
    exposeRef.current = { setActiveItem };
    return () => {
      exposeRef.current = null;
    };
  }, [exposeRef, setActiveItem]);

  const handleImgLoad = () => {
    setLoading(false);
  };

  const handleImgError = (event: SyntheticEvent<HTMLImageElement>) => {
    setLoadError(true);
    setLoading(false);
    onError?.(event.nativeEvent);
    event.currentTarget.alt = t("el.image.error");
  };

  const toolbarScope: ImageViewerToolbarScope = {
    actions: handleActions,
    prev,
    next,
    reset: toggleMode,
    activeIndex,
    setActiveItem,
  };

  const progressText = `${activeIndex + 1} / ${urlList.length}`;

  const content = (
    <div
      ref={wrapperRef}
      className={[
        "el-image-viewer__wrapper",
        // 官方用 <transition appear> 播放进入动画；React 无过渡封装，直接挂入场类，
        // 该类只在首次挂载时播放一次，视觉与官方 appear 一致
        "viewer-fade-enter-active",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ zIndex: currentZIndex, ...style }}
      tabIndex={-1}
    >
      {/*
        官方 ElFocusTrap 只渲染插槽、不产生 DOM，其子元素直接受 .el-image-viewer__wrapper 布局约束。
        若这里渲染一层实体 div，.el-image-viewer__canvas 的 height:100% 会因父级高度 auto 而失效，
        故用 display:contents 让该层不生成盒子，保持与官方一致的布局。
      */}
      <ElFocusTrap
        loop
        trapped
        focusStartEl="container"
        style={{ display: "contents" }}
      >
        <div
          className="el-image-viewer__mask"
          onClick={() => {
            if (hideOnClickModal) hide();
          }}
        />

        <span className="el-image-viewer__btn el-image-viewer__close" onClick={hide}>
          <ElIcon>
            <Close />
          </ElIcon>
        </span>

        {!isSingle && (
          <>
            <span
              className={[
                "el-image-viewer__btn",
                "el-image-viewer__prev",
                !infinite && isFirst && "is-disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={prev}
            >
              <ElIcon>
                <ArrowLeft />
              </ElIcon>
            </span>
            <span
              className={[
                "el-image-viewer__btn",
                "el-image-viewer__next",
                !infinite && isLast && "is-disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={next}
            >
              <ElIcon>
                <ArrowRight />
              </ElIcon>
            </span>
          </>
        )}

        {(renderProgress || showProgress) && (
          <div className="el-image-viewer__btn el-image-viewer__progress">
            {renderProgress
              ? renderProgress({ activeIndex, total: urlList.length })
              : progressText}
          </div>
        )}

        <div className="el-image-viewer__btn el-image-viewer__actions">
          <div className="el-image-viewer__actions__inner">
            {renderToolbar ? (
              renderToolbar(toolbarScope)
            ) : (
              <>
                <ElIcon onClick={() => handleActions("zoomOut")}>
                  <ZoomOut />
                </ElIcon>
                <ElIcon onClick={() => handleActions("zoomIn")}>
                  <ZoomIn />
                </ElIcon>
                <i className="el-image-viewer__actions__divider" />
                <ElIcon onClick={toggleMode}>
                  {mode === "contain" ? <FullScreen /> : <ScaleToOriginal />}
                </ElIcon>
                <i className="el-image-viewer__actions__divider" />
                <ElIcon onClick={() => handleActions("anticlockwise")}>
                  <RefreshLeft />
                </ElIcon>
                <ElIcon onClick={() => handleActions("clockwise")}>
                  <RefreshRight />
                </ElIcon>
              </>
            )}
          </div>
        </div>

        <div className="el-image-viewer__canvas">
          {loadError && renderViewerError ? (
            renderViewerError({ activeIndex, src: currentImg })
          ) : (
            <img
              ref={imgRef}
              key={currentImg}
              src={currentImg}
              alt=""
              className="el-image-viewer__img"
              style={imgStyle}
              crossOrigin={crossorigin as "" | undefined}
              onLoad={handleImgLoad}
              onError={handleImgError}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            />
          )}
        </div>

        {children}
      </ElFocusTrap>
    </div>
  );

  if (!teleported) return content;
  return createPortal(content, document.body);
}
