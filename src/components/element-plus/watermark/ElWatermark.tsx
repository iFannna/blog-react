"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
} from "react";

export interface WatermarkFont {
  /** 字体颜色 */
  color?: string;
  /** 字体大小 */
  fontSize?: number | string;
  /** 字体粗细 */
  fontWeight?: "normal" | "bold" | "lighter" | "bolder" | number;
  /** 字体风格 */
  fontStyle?: "none" | "normal" | "italic" | "oblique";
  /** 字体族 */
  fontFamily?: string;
  /** 多行文字的行间距 */
  fontGap?: number;
  /** 文字水平对齐 */
  textAlign?: "start" | "end" | "left" | "right" | "center";
  /** 文字基线 */
  textBaseline?:
    | "top"
    | "hanging"
    | "middle"
    | "alphabetic"
    | "ideographic"
    | "bottom";
}

export interface WatermarkProps {
  /** 水印元素的 z-index */
  zIndex?: number;
  /** 绘制时的旋转角度，单位 ° */
  rotate?: number;
  /** 单个水印的宽度，默认取 content 自身宽度 */
  width?: number;
  /** 单个水印的高度，默认取 content 自身高度 */
  height?: number;
  /** 图片地址，优先级高于 content，支持 base64 */
  image?: string;
  /** 水印文字，传数组表示多行 */
  content?: string | string[];
  /** 文字样式 */
  font?: WatermarkFont;
  /** 水印之间的间距 */
  gap?: [number, number];
  /**
   * 水印相对容器左上角的偏移，默认 gap/2。
   * 元素为 undefined 等价于官方「未传该位」，回退到 gap/2。
   */
  offset?: (number | undefined)[];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 官方 TEXT_ALIGN_RATIO_MAP：[alignRatio, spaceRatio]。 */
const TEXT_ALIGN_RATIO_MAP: Record<string, [number, number]> = {
  left: [0, 0.5],
  start: [0, 0.5],
  center: [0.5, 0],
  right: [1, -0.5],
  end: [1, -0.5],
};

/** 部分浏览器的 TextMetrics 尚未实现 fontBoundingBox*，按官方降级到 actualBoundingBox*。 */
type BoundingTextMetrics = TextMetrics & {
  fontBoundingBoxAscent?: number;
  fontBoundingBoxDescent?: number;
  actualBoundingBoxAscent?: number;
  actualBoundingBoxDescent?: number;
};

interface ResolvedFont {
  color: string;
  fontSize: number | string;
  fontWeight: string | number;
  fontStyle: string;
  fontFamily: string;
  fontGap: number;
  textAlign: string;
  textBaseline: string;
}

/** 驼峰属性名转连字符，用于拼 style 字符串。 */
function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function getStyleStr(style: Record<string, string | number>) {
  return Object.keys(style)
    .map((key) => `${toLowercaseSeparator(key)}: ${style[key]};`)
    .join(" ");
}

/** 设备物理像素与 CSS 像素的比例。 */
function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * 判断这次 DOM 变更是否需要重绘水印：
 * 水印节点被删除，或水印节点自身的属性被篡改。
 */
function reRendering(
  mutation: MutationRecord,
  watermarkElement?: HTMLElement | null,
) {
  let flag = false;

  if (mutation.removedNodes.length && watermarkElement) {
    flag = Array.from(mutation.removedNodes).includes(watermarkElement);
  }
  if (mutation.type === "attributes" && mutation.target === watermarkElement) {
    flag = true;
  }

  return flag;
}

/** 移除当前水印节点。抽到模块级，避免在多个 effect 间共享不稳定的闭包。 */
function removeWatermark(ref: MutableRefObject<HTMLDivElement | null>) {
  if (ref.current) {
    ref.current.remove();
    ref.current = null;
  }
}

function prepareCanvas(width: number, height: number, ratio = 1) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const realWidth = width * ratio;
  const realHeight = height * ratio;
  canvas.width = realWidth;
  canvas.height = realHeight;
  ctx.save();

  return [ctx, canvas, realWidth, realHeight] as const;
}

/**
 * 对应官方 useClips：先按对齐方式把文字/图片画到一个小画布上，
 * 再旋转并裁出外接矩形，最后按 gap 平铺三份拼成一张可 repeat 的背景图。
 * 返回 [dataURL, 最终宽度, 最终高度]。
 */
function getClips(
  content: string | string[] | HTMLImageElement,
  rotate: number,
  ratio: number,
  width: number,
  height: number,
  font: ResolvedFont,
  gapX: number,
  gapY: number,
  space: number,
): [string, number, number] {
  const [ctx, canvas, contentWidth, contentHeight] = prepareCanvas(
    width,
    height,
    ratio,
  );
  let baselineOffset = 0;

  if (content instanceof HTMLImageElement) {
    ctx.drawImage(content, 0, 0, contentWidth, contentHeight);
  } else {
    const {
      color,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      textAlign,
      textBaseline,
    } = font;
    const mergedFontSize = Number(fontSize) * ratio;

    ctx.font = `${fontStyle} normal ${fontWeight} ${mergedFontSize}px/${height}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign as CanvasTextAlign;
    ctx.textBaseline = textBaseline as CanvasTextBaseline;

    const contents = Array.isArray(content) ? content : [content];

    // 非 top 基线时先量出基线偏移，统一改用 top 基线绘制，保证多行文字位置正确
    if (textBaseline !== "top" && contents[0]) {
      const argumentMetrics = ctx.measureText(
        contents[0],
      ) as BoundingTextMetrics;
      ctx.textBaseline = "top";
      const topMetrics = ctx.measureText(contents[0]) as BoundingTextMetrics;
      baselineOffset =
        (argumentMetrics.actualBoundingBoxAscent ?? 0) -
        (topMetrics.actualBoundingBoxAscent ?? 0);
    }

    contents.forEach((item, index) => {
      const [alignRatio, spaceRatio] = TEXT_ALIGN_RATIO_MAP[textAlign];
      ctx.fillText(
        item ?? "",
        contentWidth * alignRatio + space * spaceRatio,
        index * (mergedFontSize + font.fontGap * ratio),
      );
    });
  }

  // ==================== 旋转并裁外接矩形 ====================
  const angle = (Math.PI / 180) * Number(rotate);
  const maxSize = Math.max(width, height);
  const [rCtx, rCanvas, realMaxSize] = prepareCanvas(maxSize, maxSize, ratio);

  rCtx.translate(realMaxSize / 2, realMaxSize / 2);
  rCtx.rotate(angle);
  if (contentWidth > 0 && contentHeight > 0) {
    rCtx.drawImage(canvas, -contentWidth / 2, -contentHeight / 2);
  }

  function getRotatePos(x: number, y: number): [number, number] {
    const targetX = x * Math.cos(angle) - y * Math.sin(angle);
    const targetY = x * Math.sin(angle) + y * Math.cos(angle);
    return [targetX, targetY];
  }

  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;

  const halfWidth = contentWidth / 2;
  const halfHeight = contentHeight / 2;
  const points: [number, number][] = [
    [0 - halfWidth, 0 - halfHeight],
    [0 + halfWidth, 0 - halfHeight],
    [0 + halfWidth, 0 + halfHeight],
    [0 - halfWidth, 0 + halfHeight],
  ];
  points.forEach(([x, y]) => {
    const [targetX, targetY] = getRotatePos(x, y);
    left = Math.min(left, targetX);
    right = Math.max(right, targetX);
    top = Math.min(top, targetY);
    bottom = Math.max(bottom, targetY);
  });

  const cutLeft = left + realMaxSize / 2;
  const cutTop = top + realMaxSize / 2;
  const cutWidth = right - left;
  const cutHeight = bottom - top;

  // ============ 平铺一份到右侧、上下各一份，凑成 repeat 单元 ============
  const realGapX = gapX * ratio;
  const realGapY = gapY * ratio;
  const filledWidth = (cutWidth + realGapX) * 2;
  const filledHeight = cutHeight + realGapY;

  const [fCtx, fCanvas] = prepareCanvas(filledWidth, filledHeight);

  function drawImg(targetX = 0, targetY = 0) {
    fCtx.drawImage(
      rCanvas,
      cutLeft,
      cutTop,
      cutWidth,
      cutHeight,
      targetX,
      targetY + baselineOffset,
      cutWidth,
      cutHeight,
    );
  }

  drawImg();
  drawImg(cutWidth + realGapX, -cutHeight / 2 - realGapY / 2);
  drawImg(cutWidth + realGapX, +cutHeight / 2 + realGapY / 2);

  return [fCanvas.toDataURL(), filledWidth / ratio, filledHeight / ratio];
}

/**
 * 对应官方 ElWatermark。
 *
 * 官方用 canvas 生成一张可 repeat 的背景图，挂到一个绝对定位的 div 上，
 * 再用 MutationObserver 监听容器：水印被删除或被改属性时立即重绘，
 * 以此阻止用户通过 DevTools 移除水印。React 里用 ref + effect 复刻同一套流程。
 */
export function ElWatermark({
  zIndex = 9,
  rotate = -22,
  width,
  height,
  image,
  content = "Element Plus",
  font,
  gap = [100, 100],
  offset,
  className,
  style,
  children,
}: WatermarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const stopObservationRef = useRef(false);
  // MutationObserver 只装一次，用 ref 持有最新的重绘实现
  const renderRef = useRef<() => void>(() => {});

  const fontGap = font?.fontGap ?? 3;
  const color = font?.color ?? "rgba(0,0,0,.15)";
  const fontSize = font?.fontSize ?? 16;
  const fontWeight = font?.fontWeight ?? "normal";
  const fontStyle = font?.fontStyle ?? "normal";
  const fontFamily = font?.fontFamily ?? "sans-serif";
  const textAlign = font?.textAlign ?? "center";
  const textBaseline = font?.textBaseline ?? "hanging";

  const gapX = gap[0];
  const gapY = gap[1];
  const gapXCenter = gapX / 2;
  const gapYCenter = gapY / 2;
  const offsetLeft = offset?.[0] ?? gapXCenter;
  const offsetTop = offset?.[1] ?? gapYCenter;

  /**
   * 官方是 deep watch props，任一配置变化就重绘。这里不写依赖数组，
   * 每次提交后重绘一次：语义等价，且不会漏掉 font / gap 等引用变化。
   */
  useEffect(() => {
    const resolvedFont: ResolvedFont = {
      color,
      fontSize,
      fontWeight,
      fontStyle,
      fontFamily,
      fontGap,
      textAlign,
      textBaseline,
    };

    /** 计算水印宽高。图片默认 [120, 64]；文字由 content 实测得出。 */
    const getMarkSize = (ctx: CanvasRenderingContext2D) => {
      let defaultWidth = 120;
      let defaultHeight = 64;
      let space = 0;

      if (!image && ctx.measureText) {
        ctx.font = `${Number(fontSize)}px ${fontFamily}`;

        const contents = Array.isArray(content) ? content : [content];
        let maxWidth = 0;
        let maxHeight = 0;

        contents.forEach((item) => {
          const metrics = ctx.measureText(item ?? "") as BoundingTextMetrics;
          const itemHeight =
            metrics.fontBoundingBoxAscent === undefined
              ? (metrics.actualBoundingBoxAscent ?? 0) +
                (metrics.actualBoundingBoxDescent ?? 0)
              : metrics.fontBoundingBoxAscent +
                (metrics.fontBoundingBoxDescent ?? 0);

          if (metrics.width > maxWidth) maxWidth = Math.ceil(metrics.width);
          if (itemHeight > maxHeight) maxHeight = Math.ceil(itemHeight);
        });

        defaultWidth = maxWidth;
        defaultHeight =
          maxHeight * contents.length + (contents.length - 1) * fontGap;

        const angle = (Math.PI / 180) * Number(rotate);
        space = Math.ceil(Math.abs(Math.sin(angle) * defaultHeight) / 2);

        defaultWidth += space;
      }

      return [width ?? defaultWidth, height ?? defaultHeight, space] as const;
    };

    const getMarkStyle = (): Record<string, string | number> => {
      const markStyle: Record<string, string | number> = {
        zIndex,
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        backgroundRepeat: "repeat",
      };

      // 偏移为正时收缩贴图区域，并把剩余偏移转成 backgroundPosition
      let positionLeft = offsetLeft - gapXCenter;
      let positionTop = offsetTop - gapYCenter;
      if (positionLeft > 0) {
        markStyle.left = `${positionLeft}px`;
        markStyle.width = `calc(100% - ${positionLeft}px)`;
        positionLeft = 0;
      }
      if (positionTop > 0) {
        markStyle.top = `${positionTop}px`;
        markStyle.height = `calc(100% - ${positionTop}px)`;
        positionTop = 0;
      }
      markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

      return markStyle;
    };

    const appendWatermark = (base64Url: string, markWidth: number) => {
      const container = containerRef.current;
      if (!container || !watermarkRef.current) return;

      // 写入自身样式会触发 observer，先暂停监听，下一个宏任务再恢复
      stopObservationRef.current = true;
      watermarkRef.current.setAttribute(
        "style",
        getStyleStr({
          ...getMarkStyle(),
          backgroundImage: `url('${base64Url}')`,
          backgroundSize: `${Math.floor(markWidth)}px`,
        }),
      );
      container.appendChild(watermarkRef.current);

      window.setTimeout(() => {
        stopObservationRef.current = false;
      });
    };

    const renderWatermark = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (!watermarkRef.current) {
        watermarkRef.current = document.createElement("div");
      }

      const ratio = getPixelRatio();
      const [markWidth, markHeight, space] = getMarkSize(ctx);

      const drawCanvas = (drawContent: string | string[] | HTMLImageElement) => {
        const [textClips, clipWidth] = getClips(
          drawContent,
          rotate,
          ratio,
          markWidth,
          markHeight,
          resolvedFont,
          gapX,
          gapY,
          space,
        );

        appendWatermark(textClips, clipWidth);
      };

      if (image) {
        const img = new Image();
        img.onload = () => drawCanvas(img);
        // 图片加载失败时退回绘制文字，与官方一致
        img.onerror = () => drawCanvas(content);
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.src = image;
      } else {
        drawCanvas(content);
      }
    };

    renderRef.current = renderWatermark;
    renderWatermark();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver((mutations) => {
      if (stopObservationRef.current) return;
      mutations.forEach((mutation) => {
        if (reRendering(mutation, watermarkRef.current)) {
          removeWatermark(watermarkRef);
          renderRef.current();
        }
      });
    });

    observer.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
      removeWatermark(watermarkRef);
    };
    // 只在挂载/卸载时接管观察，重绘实现通过 renderRef 保持最新
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      // 作为绝对定位水印的包含块，与官方 :style="{ position: 'relative' }" 一致
      style={{ position: "relative", ...style }}
    >
      {children}
    </div>
  );
}
