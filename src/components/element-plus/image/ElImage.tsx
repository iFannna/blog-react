"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type HTMLAttributeReferrerPolicy,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { useTranslator } from "../config-provider/context";
import { ElImageViewer } from "./ElImageViewer";
import type {
  ImageCrossorigin,
  ImageExpose,
  ImageFitType,
  ImageViewerErrorScope,
  ImageViewerProgressScope,
  ImageViewerToolbarScope,
} from "./types";

export interface ImageProps
  // 原生 onLoad / onError / children / className / style / id 的语义被本组件占用或重定义，故排除后自行声明
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onLoad" | "onError" | "children" | "className" | "style" | "id"
  > {
  /** 图片地址，同原生 */
  src?: string;
  /** 图片填充方式，同原生 object-fit */
  fit?: ImageFitType;
  /** 开启预览时，点击遮罩是否关闭预览 */
  hideOnClickModal?: boolean;
  /** 浏览器加载方式，同原生 loading */
  loading?: "eager" | "lazy";
  /** 是否使用懒加载 */
  lazy?: boolean;
  /** 懒加载时的滚动容器 */
  scrollContainer?: string | HTMLElement;
  /** 允许大图预览 */
  previewSrcList?: string[];
  /** 是否把预览查看器传送到 body */
  previewTeleported?: boolean;
  /** 预览层级 */
  zIndex?: number;
  /** 初始预览下标 */
  initialIndex?: number;
  /** 是否循环预览 */
  infinite?: boolean;
  /** 按 ESC 是否关闭预览 */
  closeOnPressEscape?: boolean;
  /** 缩放比例基数 */
  zoomRate?: number;
  /** 预览图片缩放值 */
  scale?: number;
  /** 最小缩放值 */
  minScale?: number;
  /** 最大缩放值 */
  maxScale?: number;
  /** 是否显示预览进度 */
  showProgress?: boolean;
  /** 原生 crossorigin */
  crossOrigin?: ImageCrossorigin;
  /** 原生 alt */
  alt?: string;
  /** 原生 referrerPolicy */
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  /** 图片加载完成，对应官方 load 事件 */
  onLoad?: (event: Event) => void;
  /** 图片加载失败，对应官方 error 事件 */
  onError?: (event: Event) => void;
  /** 打开预览，对应官方 show 事件 */
  onShow?: () => void;
  /** 关闭预览，对应官方 close 事件 */
  onClose?: () => void;
  /** 切换预览图片，对应官方 switch 事件 */
  onSwitch?: (index: number) => void;
  /** 未加载完成时的占位内容，对应 placeholder 插槽 */
  renderPlaceholder?: () => ReactNode;
  /** 加载失败时的内容，对应 error 插槽 */
  renderError?: () => ReactNode;
  /** 预览查看器自定义内容，对应 viewer 插槽 */
  viewer?: ReactNode;
  /** 对应 progress 插槽 */
  renderProgress?: (scope: ImageViewerProgressScope) => ReactNode;
  /** 对应 toolbar 插槽 */
  renderToolbar?: (scope: ImageViewerToolbarScope) => ReactNode;
  /** 对应 viewer-error 插槽 */
  renderViewerError?: (scope: ImageViewerErrorScope) => ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/** 容器与图片之间按官方规则拆分剩余属性。 */
function splitAttrs(rest: object) {
  const containerAttrs: Record<string, unknown> = {};
  const imgAttrs: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(rest)) {
    // 官方 containerAttrs：data-* / on 事件 / id / style 留在容器，其余交给 img
    if (/^(data-|on[A-Z]|id$|style$)/i.test(key)) {
      containerAttrs[key] = value;
    } else {
      imgAttrs[key] = value;
    }
  }

  return { containerAttrs, imgAttrs };
}

/** 向上查找第一个可滚动祖先，找不到回落到 window。 */
function getScrollContainer(element: HTMLElement): HTMLElement | Window {
  let parent: HTMLElement | null = element;
  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      return window;
    }
    const overflow = window.getComputedStyle(parent).overflowY;
    if (["scroll", "auto", "overlay"].some((value) => overflow.includes(value))) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

/**
 * 对应官方 ElImage。
 *
 * 懒加载逻辑与官方一致：优先用原生 loading（浏览器支持时直接下发属性），
 * 否则用 IntersectionObserver 观察容器是否进入视口，进入后再真正写入 src。
 * 在拿到 src 之前不渲染 img，只渲染占位层，这与官方「imageSrc 初始为 undefined」一致。
 */
export const ElImage = forwardRef<ImageExpose, ImageProps>(
  function ElImage(
    {
      src = "",
      fit,
      hideOnClickModal = false,
      loading,
      lazy = false,
      scrollContainer,
      previewSrcList = [],
      previewTeleported = false,
      zIndex,
      initialIndex = 0,
      infinite = true,
      closeOnPressEscape = true,
      zoomRate = 1.2,
      scale = 1,
      minScale = 0.2,
      maxScale = 7,
      showProgress = false,
      crossOrigin,
      alt,
      referrerPolicy,
      onLoad,
      onError,
      onShow,
      onClose,
      onSwitch,
      renderPlaceholder,
      renderError,
      viewer,
      renderProgress,
      renderToolbar,
      renderViewerError,
      className,
      style,
      id,
      ...rest
    },
    ref,
  ) {
    const t = useTranslator();
    const containerRef = useRef<HTMLDivElement>(null);

    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [hasLoadError, setHasLoadError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showViewer, setShowViewer] = useState(false);

    // 对应官方 supportLoading：浏览器原生支持 loading 属性时优先用原生懒加载
    const supportLoading =
      typeof window !== "undefined" && "loading" in HTMLImageElement.prototype;

    const isManual =
      loading !== "eager" && ((!supportLoading && loading === "lazy") || lazy);

    const loadImage = useCallback(() => {
      // 空 src 在官方会进入 error 分支；浏览器不会为空 src 触发 error 事件，
      // 这里直接落到失败态，避免一直停在占位层
      if (!src) {
        setIsLoading(false);
        setHasLoadError(true);
        setImageSrc(undefined);
        return;
      }
      setIsLoading(true);
      setHasLoadError(false);
      setImageSrc(src);
    }, [src]);

    const { containerAttrs, imgAttrs } = useMemo(() => splitAttrs(rest), [rest]);

    const preview = Array.isArray(previewSrcList) && previewSrcList.length > 0;

    // 官方 imageIndex：initial-index 越界时回退到 0
    const imageIndex =
      initialIndex > previewSrcList.length - 1 ? 0 : initialIndex;

    // 非手动加载：src 变化后立刻写入；手动加载：重新建立观察器等进入视口
    useEffect(() => {
      if (!isManual) {
        loadImage();
        return;
      }

      setIsLoading(true);
      setHasLoadError(false);

      const element = containerRef.current;
      if (!element) return;

      let root: HTMLElement | null = null;
      if (typeof scrollContainer === "string") {
        root = document.querySelector<HTMLElement>(scrollContainer);
      } else if (scrollContainer instanceof HTMLElement) {
        root = scrollContainer;
      } else {
        const resolved = getScrollContainer(element);
        root = resolved instanceof Window ? null : resolved;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          loadImage();
          observer.disconnect();
        },
        root ? { root } : undefined,
      );
      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [src, isManual, scrollContainer, loadImage]);

    const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasLoadError(false);
      onLoad?.(event.nativeEvent);
    };

    const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasLoadError(true);
      onError?.(event.nativeEvent);
    };

    const clickHandler = () => {
      if (!preview) return;
      setShowViewer(true);
      onShow?.();
    };

    useImperativeHandle(ref, () => ({ showPreview: clickHandler }));

    const rootClasses = ["el-image", className].filter(Boolean).join(" ");

    const imageClasses = [
      "el-image__inner",
      preview && "el-image__preview",
      isLoading && "is-loading",
    ]
      .filter(Boolean)
      .join(" ");

    const imageStyle: CSSProperties = fit ? { objectFit: fit } : {};

    return (
      <div
        ref={containerRef}
        id={id}
        className={rootClasses}
        style={style}
        {...(containerAttrs as HTMLAttributes<HTMLDivElement>)}
      >
        {hasLoadError ? (
          // 官方：加载失败时不渲染 img，只渲染 error 插槽或默认文案
          renderError ? (
            renderError()
          ) : (
            <div className="el-image__error">{t("el.image.error")}</div>
          )
        ) : (
          <>
            {imageSrc !== undefined && (
              <img
                {...(imgAttrs as HTMLAttributes<HTMLImageElement>)}
                src={imageSrc}
                loading={loading}
                style={imageStyle}
                className={imageClasses}
                crossOrigin={crossOrigin}
                alt={alt}
                referrerPolicy={referrerPolicy}
                onClick={clickHandler}
                onLoad={handleLoad}
                onError={handleError}
              />
            )}
            {isLoading && (
              <div className="el-image__wrapper">
                {renderPlaceholder ? (
                  renderPlaceholder()
                ) : (
                  <div className="el-image__placeholder" />
                )}
              </div>
            )}
          </>
        )}

        {preview && showViewer && (
          <ElImageViewer
            zIndex={zIndex}
            initialIndex={imageIndex}
            infinite={infinite}
            zoomRate={zoomRate}
            minScale={minScale}
            maxScale={maxScale}
            scale={scale}
            showProgress={showProgress}
            urlList={previewSrcList}
            crossorigin={crossOrigin}
            hideOnClickModal={hideOnClickModal}
            teleported={previewTeleported}
            closeOnPressEscape={closeOnPressEscape}
            onClose={() => {
              setShowViewer(false);
              onClose?.();
            }}
            onSwitch={(index) => onSwitch?.(index)}
            renderProgress={renderProgress}
            renderToolbar={renderToolbar}
            renderViewerError={renderViewerError}
          >
            {viewer}
          </ElImageViewer>
        )}
      </div>
    );
  },
);
