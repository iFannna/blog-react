"use client";

import { useRef, useState, type CSSProperties, type SVGProps } from "react";
import { ElImage } from "@/components/element-plus/image";
import { ElImageViewer } from "@/components/element-plus/image/ElImageViewer";
import type {
  ImageExpose,
  ImageViewerErrorScope,
  ImageViewerProgressScope,
  ImageViewerToolbarScope,
} from "@/components/element-plus/image";
import {
  RefreshLeft,
  RefreshRight,
  ZoomOut,
} from "@/components/element-plus/image/viewer-icons";
import { ElButton } from "@/components/element-plus/button";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElConfigProvider, en } from "@/components/element-plus/config-provider";
import {
  Back,
  DArrowRight,
  Download,
  Picture,
  ZoomIn,
} from "@/components/element-plus/icons";

/*
 * Right 与 Refresh 两个图标官方图标清单里有、本项目 icons 目录尚未收录，
 * 主控不允许单独改图标生成脚本，这里内联官方同一份 SVG path 供示例使用。
 * 已提报给主控补入生成清单，补入后应改为从 @/components/element-plus/icons 导入。
 */

function Right(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" {...props}>
      <path
        fill="currentColor"
        d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z"
      />
    </svg>
  );
}

function Refresh(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" {...props}>
      <path
        fill="currentColor"
        d="M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z"
      />
    </svg>
  );
}

const URL =
  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
const SRC_LIST = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
  "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
  "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
  "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
  "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
];

const PREVIEW_URL = SRC_LIST[0];

const EQUAL_BLOCK_STYLE: CSSProperties = {
  padding: "3rem 0",
  textAlign: "center",
  borderRight: "solid 1px var(--el-border-color)",
  display: "inline-block",
  width: "20%",
  minWidth: 100,
  boxSizing: "border-box",
  verticalAlign: "top",
};

const DEMONSTRATION_STYLE: CSSProperties = {
  display: "block",
  color: "var(--el-text-color-secondary)",
  fontSize: 14,
  marginBottom: 20,
};

const IMAGE_BOX_STYLE: CSSProperties = { width: 100, height: 100 };

export function ImageBasic() {
  return (
    <div>
      <div style={EQUAL_BLOCK_STYLE}>
        <span style={DEMONSTRATION_STYLE}>fill</span>
        <ElImage src={URL} fit="fill" style={IMAGE_BOX_STYLE} />
      </div>
      <div style={EQUAL_BLOCK_STYLE}>
        <span style={DEMONSTRATION_STYLE}>contain</span>
        <ElImage src={URL} fit="contain" style={IMAGE_BOX_STYLE} />
      </div>
      <div style={EQUAL_BLOCK_STYLE}>
        <span style={DEMONSTRATION_STYLE}>cover</span>
        <ElImage src={URL} fit="cover" style={IMAGE_BOX_STYLE} />
      </div>
      <div style={EQUAL_BLOCK_STYLE}>
        <span style={DEMONSTRATION_STYLE}>none</span>
        <ElImage src={URL} fit="none" style={IMAGE_BOX_STYLE} />
      </div>
      <div style={EQUAL_BLOCK_STYLE}>
        <span style={DEMONSTRATION_STYLE}>scale-down</span>
        <ElImage src={URL} fit="scale-down" style={IMAGE_BOX_STYLE} />
      </div>
    </div>
  );
}

export function ImagePlaceholder() {
  const src =
    "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg";

  const slotStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    background: "var(--el-fill-color-light)",
    color: "var(--el-text-color-secondary)",
    fontSize: 14,
  };

  return (
    <div>
      <div style={{ ...EQUAL_BLOCK_STYLE, width: "49%" }}>
        <span style={DEMONSTRATION_STYLE}>Default</span>
        <ElImage src={src} style={{ maxWidth: 300, maxHeight: 200, padding: "0 5px" }} />
      </div>
      <div
        style={{
          ...EQUAL_BLOCK_STYLE,
          width: "49%",
          borderRight: "none",
        }}
      >
        <span style={DEMONSTRATION_STYLE}>Custom</span>
        <ElImage
          src={src}
          style={{ maxWidth: 300, maxHeight: 200, padding: "0 5px" }}
          renderPlaceholder={() => (
            <div style={slotStyle}>
              Loading
              <span
                style={{
                  animation: "dot 2s infinite steps(3, start)",
                  overflow: "hidden",
                }}
              >
                ...
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export function ImageLoadFailed() {
  const [showPreview, setShowPreview] = useState(false);
  const srcList = [
    "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
    "https://errorSrc",
  ];

  const errorSlotStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    fontSize: 30,
    height: 200,
    background: "#fff",
  };

  const imageStyle: CSSProperties = {
    maxWidth: 300,
    maxHeight: 200,
    width: "100%",
  };

  return (
    <ElConfigProvider locale={en}>
      <div style={{ display: "flex", gap: 8 }}>
        <ElImage style={imageStyle} />
      <ElImage
        style={imageStyle}
        renderError={() => (
          <div style={errorSlotStyle}>
            <ElIcon>
              <Picture />
            </ElIcon>
          </div>
        )}
      />
      <ElImage
        style={imageStyle}
        src={srcList[0]}
        previewSrcList={srcList}
        showProgress
        renderViewerError={({ activeIndex, src }: ImageViewerErrorScope) => (
          <div style={{ ...errorSlotStyle, color: "#000" }}>
            <ElIcon>
              <Picture />
            </ElIcon>
            <span>
              this is viewer-error slot. current index: {activeIndex}. src: {src}
            </span>
          </div>
        )}
      />
      <ElButton onClick={() => setShowPreview(true)}>preview controlled</ElButton>

      {showPreview && (
        <ElImageViewer
          showProgress
          urlList={srcList}
          onClose={() => setShowPreview(false)}
          renderViewerError={({ activeIndex, src }: ImageViewerErrorScope) => (
            <div style={{ ...errorSlotStyle, color: "#000" }}>
              <ElIcon>
                <Picture />
              </ElIcon>
              <span>
                this is viewer-error slot. current index: {activeIndex}. src: {src}
              </span>
            </div>
          )}
        />
      )}
      </div>
    </ElConfigProvider>
  );
}

export function ImageLazyLoad() {
  return (
    <div style={{ height: 400, overflowY: "auto" }}>
      {SRC_LIST.map((url, index) => (
        <ElImage
          key={url}
          src={url}
          lazy
          style={{
            display: "block",
            minHeight: 200,
            marginBottom: index < SRC_LIST.length - 1 ? 10 : 0,
          }}
        />
      ))}
    </div>
  );
}

export function ImagePreview() {
  return (
    <div>
      <ElImage
        style={IMAGE_BOX_STYLE}
        src={PREVIEW_URL}
        zoomRate={1.2}
        maxScale={7}
        minScale={0.2}
        previewSrcList={SRC_LIST}
        showProgress
        initialIndex={4}
        fit="cover"
      />
    </div>
  );
}

export function ImageManuallyPreview() {
  const imageRef = useRef<ImageExpose>(null);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={{ display: "flex", gap: 48 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <ElButton onClick={() => imageRef.current?.showPreview()}>
          openPreview with showPreview method
        </ElButton>
        <ElImage
          ref={imageRef}
          style={IMAGE_BOX_STYLE}
          src={PREVIEW_URL}
          showProgress
          previewSrcList={SRC_LIST}
          fit="cover"
        />
      </div>
      <div>
        <ElButton onClick={() => setShowPreview(true)}>preview controlled</ElButton>
        {showPreview && (
          <ElImageViewer
            urlList={SRC_LIST}
            showProgress
            initialIndex={4}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </div>
  );
}

export function ImageCustomToolbar() {
  const download = (index: number) => {
    const url = SRC_LIST[index];
    const suffix = url.slice(url.lastIndexOf("."));
    const filename = Date.now() + suffix;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        link.remove();
      });
  };

  return (
    <div>
      <ElImage
        style={IMAGE_BOX_STYLE}
        src={PREVIEW_URL}
        previewSrcList={SRC_LIST}
        fit="cover"
        showProgress
        renderToolbar={(scope: ImageViewerToolbarScope) => (
          <>
            <ElIcon onClick={scope.prev}>
              <Back />
            </ElIcon>
            <ElIcon onClick={scope.next}>
              <Right />
            </ElIcon>
            <ElIcon onClick={() => scope.setActiveItem(SRC_LIST.length - 1)}>
              <DArrowRight />
            </ElIcon>
            <ElIcon onClick={() => scope.actions("zoomOut")}>
              <ZoomOut />
            </ElIcon>
            <ElIcon
              onClick={() =>
                scope.actions("zoomIn", { enableTransition: false, zoomRate: 2 })
              }
            >
              <ZoomIn />
            </ElIcon>
            <ElIcon
              onClick={() =>
                scope.actions("clockwise", {
                  rotateDeg: 180,
                  enableTransition: false,
                })
              }
            >
              <RefreshRight />
            </ElIcon>
            <ElIcon onClick={() => scope.actions("anticlockwise")}>
              <RefreshLeft />
            </ElIcon>
            <ElIcon onClick={scope.reset}>
              <Refresh />
            </ElIcon>
            <ElIcon onClick={() => download(scope.activeIndex)}>
              <Download />
            </ElIcon>
          </>
        )}
      />
    </div>
  );
}

export function ImageCustomProgress() {
  return (
    <div>
      <ElImage
        style={IMAGE_BOX_STYLE}
        src={PREVIEW_URL}
        previewSrcList={SRC_LIST}
        fit="cover"
        renderProgress={({ activeIndex, total }: ImageViewerProgressScope) => (
          <span>{activeIndex + 1 + "-" + total}</span>
        )}
      />
    </div>
  );
}
