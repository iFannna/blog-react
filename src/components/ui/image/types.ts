/**
 * 对应官方 image/src/image.ts 与 image-viewer/src/image-viewer.ts 的公开类型。
 * 两个组件共用同一份声明，避免 ElImage 与 ElImageViewer 互相 import 造成循环。
 */

export type ImageFitType =
  | ""
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";

export type ImageCrossorigin = "anonymous" | "use-credentials" | "";

/** 对应官方 ImageViewerAction。 */
export type ImageViewerAction =
  | "zoomIn"
  | "zoomOut"
  | "clockwise"
  | "anticlockwise";

/** 对应官方 ImageViewerActionOptions。 */
export interface ImageViewerActionOptions {
  enableTransition?: boolean;
  zoomRate?: number;
  rotateDeg?: number;
}

/** 对应官方 toolbar 插槽作用域。 */
export interface ImageViewerToolbarScope {
  actions: (action: ImageViewerAction, options?: ImageViewerActionOptions) => void;
  prev: () => void;
  next: () => void;
  reset: () => void;
  activeIndex: number;
  setActiveItem: (index: number) => void;
}

/** 对应官方 progress 插槽作用域。 */
export interface ImageViewerProgressScope {
  activeIndex: number;
  total: number;
}

/** 对应官方 viewer-error 插槽作用域。 */
export interface ImageViewerErrorScope {
  activeIndex: number;
  src: string;
}

/** 对应官方 ImageViewer 暴露的 setActiveItem。 */
export interface ImageViewerExpose {
  setActiveItem: (index: number) => void;
}

/** 对应官方 ElImage 暴露的 showPreview。 */
export interface ImageExpose {
  showPreview: () => void;
}
