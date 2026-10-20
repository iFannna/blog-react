import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ImageBasic,
  ImageCustomProgress,
  ImageCustomToolbar,
  ImageLazyLoad,
  ImageLoadFailed,
  ImageManuallyPreview,
  ImagePlaceholder,
  ImagePreview,
} from "@/components/element-plus/examples/image";

export const metadata: Metadata = { title: "Image 图片" };

const SOURCES = {
  basic: `<div>
  <span>fill</span>
  <ElImage src={url} fit="fill" style={{ width: 100, height: 100 }} />
</div>
<div>
  <span>contain</span>
  <ElImage src={url} fit="contain" style={{ width: 100, height: 100 }} />
</div>
<div>
  <span>cover</span>
  <ElImage src={url} fit="cover" style={{ width: 100, height: 100 }} />
</div>
<div>
  <span>none</span>
  <ElImage src={url} fit="none" style={{ width: 100, height: 100 }} />
</div>
<div>
  <span>scale-down</span>
  <ElImage src={url} fit="scale-down" style={{ width: 100, height: 100 }} />
</div>`,

  placeholder: `<ElImage src={src} />

<ElImage
  src={src}
  // 对应官方 slot = placeholder
  renderPlaceholder={() => <div className="image-slot">加载中...</div>}
/>`,

  loadFailed: `<ElImage />

<ElImage
  renderError={() => (
    <div className="image-slot">
      <ElIcon><Picture /></ElIcon>
    </div>
  )}
/>

{/* 预览查看器里图片加载失败时走 viewer-error 插槽，作用域含 activeIndex / src */}
<ElImage
  src={url}
  previewSrcList={srcList}
  showProgress
  renderViewerError={({ activeIndex, src }) => (
    <div className="image-slot">
      current index: {activeIndex}. src: {src}
    </div>
  )}
/>

{showPreview && (
  <ElImageViewer
    showProgress
    urlList={srcList}
    onClose={() => setShowPreview(false)}
    renderViewerError={({ activeIndex, src }) => (
      <div className="image-slot">current index: {activeIndex}. src: {src}</div>
    )}
  />
)}`,

  lazyLoad: `{urls.map((url) => (
  <ElImage key={url} src={url} lazy />
))}`,

  imagePreview: `<ElImage
  style={{ width: 100, height: 100 }}
  src={url}
  zoomRate={1.2}
  maxScale={7}
  minScale={0.2}
  previewSrcList={srcList}
  showProgress
  initialIndex={4}
  fit="cover"
/>`,

  manuallyPreview: `const imageRef = useRef<ImageExpose>(null);

<ElButton onClick={() => imageRef.current?.showPreview()}>
  openPreview with showPreview method
</ElButton>
<ElImage
  ref={imageRef}
  style={{ width: 100, height: 100 }}
  src={url}
  showProgress
  previewSrcList={srcList}
  fit="cover"
/>

{/* 也可受控地直接挂 ElImageViewer */}
{showPreview && (
  <ElImageViewer
    urlList={srcList}
    showProgress
    initialIndex={4}
    onClose={() => setShowPreview(false)}
  />
)}`,

  customToolbar: `<ElImage
  style={{ width: 100, height: 100 }}
  src={url}
  previewSrcList={srcList}
  fit="cover"
  showProgress
  // 对应官方 toolbar 插槽，作用域同官方
  renderToolbar={({ actions, prev, next, reset, activeIndex, setActiveItem }) => (
    <>
      <ElIcon onClick={prev}><Back /></ElIcon>
      <ElIcon onClick={next}><Right /></ElIcon>
      <ElIcon onClick={() => setActiveItem(srcList.length - 1)}><DArrowRight /></ElIcon>
      <ElIcon onClick={() => actions("zoomOut")}><ZoomOut /></ElIcon>
      <ElIcon onClick={() => actions("zoomIn", { enableTransition: false, zoomRate: 2 })}>
        <ZoomIn />
      </ElIcon>
      <ElIcon onClick={() => actions("clockwise", { rotateDeg: 180, enableTransition: false })}>
        <RefreshRight />
      </ElIcon>
      <ElIcon onClick={() => actions("anticlockwise")}><RefreshLeft /></ElIcon>
      <ElIcon onClick={reset}><Refresh /></ElIcon>
      <ElIcon onClick={() => download(activeIndex)}><Download /></ElIcon>
    </>
  )}
/>`,

  customProgress: `<ElImage
  style={{ width: 100, height: 100 }}
  src={url}
  previewSrcList={srcList}
  fit="cover"
  // 对应官方 progress 插槽，作用域含 activeIndex / total
  renderProgress={({ activeIndex, total }) => (
    <span>{activeIndex + 1 + "-" + total}</span>
  )}
/>`,
};

const API_MD = `
## Image API

### Image Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址，同原生 | ^[string] | '' |
| fit | 图片填充方式，同原生 object-fit | ^[enum]\`'' \\| 'fill' \\| 'contain' \\| 'cover' \\| 'none' \\| 'scale-down'\` | '' |
| hide-on-click-modal | 开启预览时，点击遮罩是否关闭预览 | ^[boolean] | false |
| loading | 浏览器加载方式，同原生 loading | ^[enum]\`'eager' \\| 'lazy'\` | — |
| lazy | 是否使用懒加载 | ^[boolean] | false |
| scroll-container | 懒加载时监听滚动的容器 | ^[string] / ^[HTMLElement] | — |
| alt | 原生 alt | ^[string] | — |
| referrer-policy | 原生 referrerPolicy | ^[string] | — |
| cross-origin | 原生 crossorigin | ^[enum]\`'' \\| 'anonymous' \\| 'use-credentials'\` | — |
| preview-src-list | 允许大图预览的链接列表 | ^[array]\`string[]\` | [] |
| z-index | 预览层级 | ^[number] | — |
| initial-index | 初始预览下标 | ^[number] | 0 |
| close-on-press-escape | 预览时按 ESC 是否关闭 | ^[boolean] | true |
| preview-teleported | 是否把预览查看器传送到 body | ^[boolean] | false |
| infinite | 预览是否循环 | ^[boolean] | true |
| zoom-rate | 缩放比例基数 | ^[number] | 1.2 |
| scale | 预览图片缩放值 | ^[number] | 1 |
| min-scale | 最小缩放值 | ^[number] | 0.2 |
| max-scale | 最大缩放值 | ^[number] | 7 |
| show-progress | 是否显示预览进度 | ^[boolean] | false |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Image Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onLoad | 同原生 load | ^[Function]\`(e: Event) => void\` |
| onError | 同原生 error | ^[Function]\`(e: Event) => void\` |
| onSwitch | 切换预览图片时触发 | ^[Function]\`(index: number) => void\` |
| onClose | 关闭预览时触发 | ^[Function]\`() => void\` |
| onShow | 打开预览时触发 | ^[Function]\`() => void\` |

### Image Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| placeholder | 图片未加载完成时的占位内容 | \`renderPlaceholder\` |
| error | 图片加载失败时的内容 | \`renderError\` |
| viewer | 预览查看器自定义内容 | \`viewer\` |
| progress | 预览进度自定义内容 | \`renderProgress\` |
| toolbar | 预览工具栏自定义内容 | \`renderToolbar\` |
| viewer-error | 预览图片加载失败时的内容 | \`renderViewerError\` |

### Image Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| showPreview | 手动打开大图预览 | ^[Function]\`() => void\` |

> 通过 \`ref\` 拿到 expose：\`const ref = useRef<ImageExpose>(null)\`，再调用 \`ref.current?.showPreview()\`。

## Image Viewer API

### Image Viewer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url-list | 预览链接列表 | ^[array]\`string[]\` | [] |
| z-index | 预览遮罩层级 | ^[number] | — |
| initial-index | 初始预览下标 | ^[number] | 0 |
| infinite | 预览是否循环 | ^[boolean] | true |
| hide-on-click-modal | 点击遮罩是否关闭 | ^[boolean] | false |
| teleported | 是否把查看器传送到 body | ^[boolean] | false |
| close-on-press-escape | 按 ESC 是否关闭 | ^[boolean] | true |
| zoom-rate | 缩放比例基数 | ^[number] | 1.2 |
| scale | 预览图片缩放值 | ^[number] | 1 |
| min-scale | 最小缩放值 | ^[number] | 0.2 |
| max-scale | 最大缩放值 | ^[number] | 7 |
| show-progress | 是否显示进度 | ^[boolean] | false |
| crossorigin | 原生 crossorigin | ^[enum]\`'' \\| 'anonymous' \\| 'use-credentials'\` | — |

### Image Viewer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClose | 关闭时触发 | ^[Function]\`() => void\` |
| onError | 图片加载失败时触发 | ^[Function]\`(e: Event) => void\` |
| onSwitch | 切换图片时触发 | ^[Function]\`(index: number) => void\` |
| onRotate | 旋转时触发 | ^[Function]\`(deg: number) => void\` |

### Image Viewer Slots

| 插槽名 | 说明 | React 写法 / 作用域 |
| --- | --- | --- |
| viewer | 自定义内容 | \`children\` |
| progress | 自定义进度内容 | \`renderProgress({ activeIndex, total })\` |
| toolbar | 自定义工具栏内容 | \`renderToolbar({ actions, prev, next, reset, activeIndex, setActiveItem })\` |
| viewer-error | 自定义加载失败内容 | \`renderViewerError({ activeIndex, src })\` |

### Image Viewer Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| setActiveItem | 手动切换图片 | ^[Function]\`(index: number) => void\` |

`;

export default function ImagePage() {
  return (
    <>
      <h1>Image 图片</h1>
      <p>除原生 img 特性外，支持懒加载、自定义占位、加载失败占位等。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>fit</code> 指示图片应如何适应容器，同原生{" "}
        <code>object-fit</code>。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ImageBasic />
      </DemoBlock>

      <Heading level={2}>占位内容</Heading>
      <p>
        图片未加载完成时，通过 <code>renderPlaceholder</code> 自定义占位内容。
      </p>
      <DemoBlock source={SOURCES.placeholder}>
        <ImagePlaceholder />
      </DemoBlock>

      <Heading level={2}>加载失败</Heading>
      <p>
        图片加载失败时，通过 <code>renderError</code> 自定义失败内容；
        预览查看器内加载失败用 <code>renderViewerError</code>。
      </p>
      <DemoBlock source={SOURCES.loadFailed}>
        <ImageLoadFailed />
      </DemoBlock>

      <Heading level={2}>懒加载</Heading>
      <p>
        设置 <code>lazy</code> 开启懒加载。若浏览器支持原生懒加载则优先使用原生，
        否则通过 <code>IntersectionObserver</code> 实现。可用{" "}
        <code>scrollContainer</code> 指定滚动容器，缺省为最近的
        overflow 为 auto 或 scroll 的父容器。
      </p>
      <DemoBlock source={SOURCES.lazyLoad}>
        <ImageLazyLoad />
      </DemoBlock>

      <Heading level={2}>大图预览</Heading>
      <p>
        设置 <code>previewSrcList</code> 允许大图预览，可用 <code>initialIndex</code>{" "}
        指定初始预览位置，默认 0。
      </p>
      <DemoBlock source={SOURCES.imagePreview}>
        <ImagePreview />
      </DemoBlock>

      <Heading level={2}>手动开启预览</Heading>
      <p>
        通过 ref 调用 <code>showPreview</code> 手动开启预览，也可受控地直接渲染{" "}
        <code>ElImageViewer</code>。
      </p>
      <DemoBlock source={SOURCES.manuallyPreview}>
        <ImageManuallyPreview />
      </DemoBlock>

      <Heading level={2}>自定义工具栏</Heading>
      <p>
        通过 <code>renderToolbar</code> 自定义工具栏内容，作用域含{" "}
        <code>actions</code>、<code>prev</code>、<code>next</code>、<code>reset</code>、
        <code>activeIndex</code>、<code>setActiveItem</code>。
      </p>
      <DemoBlock source={SOURCES.customToolbar}>
        <ImageCustomToolbar />
      </DemoBlock>

      <Heading level={2}>自定义进度</Heading>
      <p>
        通过 <code>renderProgress</code> 自定义进度内容，也可用{" "}
        <code>showProgress</code> 显示默认进度。
      </p>
      <DemoBlock source={SOURCES.customProgress}>
        <ImageCustomProgress />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
