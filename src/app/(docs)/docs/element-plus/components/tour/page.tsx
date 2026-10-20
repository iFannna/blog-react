import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TourBasic,
  TourNonModal,
  TourPlacement,
  TourMask,
  TourIndicator,
  TourTarget,
} from "@/components/element-plus/examples/tour";

export const metadata: Metadata = { title: "Tour 漫游式引导" };

const SOURCES = {
  basic: `const [open, setOpen] = useState(false);
// ElButton 未暴露 ref，示例用 id 选择器指定 target
const targetBy = (id: string) => () => document.querySelector<HTMLElement>(id);

<ElButton type="primary" onClick={() => setOpen(true)}>Begin Tour</ElButton>

<ElDivider />

<ElSpace>
  <ElButton id="tour-basic-1">Upload</ElButton>
  <ElButton id="tour-basic-2" type="primary">Save</ElButton>
  <ElButton id="tour-basic-3" icon={<MoreFilled />} />
</ElSpace>

<ElTour visible={open} onVisibleChange={setOpen}>
  <ElTourStep target={targetBy("#tour-basic-1")} title="Upload File">
    <img style={{ width: 240 }} src="https://element-plus.org/images/element-plus-logo.svg" alt="tour.png" />
    <div>Put you files here.</div>
  </ElTourStep>
  <ElTourStep target={targetBy("#tour-basic-2")} title="Save" description="Save your changes" />
  <ElTourStep target={targetBy("#tour-basic-3")} title="Other Actions" description="Click to see other" />
</ElTour>`,

  nonModal: `<ElTour visible={open} onVisibleChange={setOpen} type="primary" mask={false}>
  <ElTourStep target={targetBy("#tour-non-modal-1")} title="Upload File" description="Put you files here." />
  <ElTourStep target={targetBy("#tour-non-modal-2")} title="Save" description="Save your changes" />
  <ElTourStep target={targetBy("#tour-non-modal-3")} title="Other Actions" description="Click to see other" />
</ElTour>`,

  placement: `<ElTour visible={open} onVisibleChange={setOpen}>
  <ElTourStep title="Center" description="Displayed in the center of screen." />
  <ElTourStep title="Right" description="On the right of target." placement="right" target={targetBy("#tour-placement-trigger")} />
  <ElTourStep title="Top" description="On the top of target." placement="top" target={targetBy("#tour-placement-trigger")} />
</ElTour>`,

  mask: `<ElTour
  visible={open}
  onVisibleChange={setOpen}
  mask={{
    style: { boxShadow: "inset 0 0 15px #333" },
    color: "rgba(80, 255, 255, .4)",
  }}
>
  <ElTourStep target={targetBy("#tour-mask-1")} title="Upload File" />
  <ElTourStep
    target={targetBy("#tour-mask-2")}
    title="Save"
    mask={{ style: { boxShadow: "inset 0 0 15px #fff" }, color: "rgba(40, 0, 255, .4)" }}
  />
  <ElTourStep target={targetBy("#tour-mask-3")} title="Other Actions" mask={false} />
</ElTour>`,

  indicator: `<ElTour
  visible={open}
  onVisibleChange={setOpen}
  indicators={({ current, total }) => (
    <span>{current + 1} / {total}</span>
  )}
>
  <ElTourStep target={targetBy("#tour-indicator-1")} title="Upload File" description="Put you files here." />
  <ElTourStep target={targetBy("#tour-indicator-2")} title="Save" description="Save your changes" />
  <ElTourStep target={targetBy("#tour-indicator-3")} title="Other Actions" description="Click to see other" />
</ElTour>`,

  target: `<ElTour visible={open} onVisibleChange={setOpen}>
  {/* 选择器字符串 */}
  <ElTourStep target="#tour-target-1" title="Upload File" description="Put you files here." />
  {/* 返回元素的函数 */}
  <ElTourStep
    target={() => document.querySelector<HTMLElement>("#tour-target-2")}
    title="Save"
    description="Save your changes"
  />
  {/* 函数形式同样可返回 ref.current */}
  <ElTourStep
    target={() => document.querySelector<HTMLElement>("#tour-target-3")}
    title="Other Actions"
    description="Click to see other"
  />
</ElTour>`,
};

const API_MD = `
## Tour API

### Tour Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示导览，对应官方 v-model | ^[boolean] | false |
| current | 当前处于第几步 | ^[number] | 0 |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| show-close | 是否显示关闭按钮 | ^[boolean] | true |
| close-icon | 自定义关闭图标 | ^[ReactNode] | 默认 Close |
| placement | 相对目标元素的方位 | ^[enum]\`'top' \\| 'top-start' \\| 'top-end' \\| 'bottom' \\| 'bottom-start' \\| 'bottom-end' \\| 'left' \\| 'left-start' \\| 'left-end' \\| 'right' \\| 'right-start' \\| 'right-end'\` | bottom |
| content-style | 内容自定义样式 | ^[CSSProperties] | — |
| mask | 是否启用遮罩，或自定义样式与填充色 | ^[boolean] / ^[object]\`{ style?: CSSProperties; color?: string }\` | true |
| gap | 遮罩与目标之间的透明间隙 | ^[object]\`TourGap\` | { offset: 6, radius: 2 } |
| type | 类型，影响背景色与文字色 | ^[enum]\`'default' \\| 'primary'\` | default |
| scroll-into-view-options | 自定义滚动参数 | ^[boolean] / ^[ScrollIntoViewOptions] | { block: 'center' } |
| z-index | 层级 | ^[number] | 自动递增 |
| append-to | 挂载的容器 | ^[string] / ^[HTMLElement] | body |
| close-on-press-escape | 是否允许按 ESC 关闭 | ^[boolean] | true |
| target-area-clickable | 挖孔区域是否可点击 | ^[boolean] | true |
| indicators | 自定义指示器 | ^[Function]\`({ current, total }) => ReactNode\` | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### TourGap

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offset | 间隙大小，元组时依次为水平 / 垂直 | ^[number] / ^[array]\`[number, number]\` | 6 |
| radius | 挖孔圆角 | ^[number] | 2 |

### Tour Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐变化 | ^[Function]\`(visible: boolean) => void\` |
| onCurrentChange | 当前步骤变化 | ^[Function]\`(current: number) => void\` |
| onChange | 步骤变化后的回调 | ^[Function]\`(current: number) => void\` |
| onClose | 关闭时触发 | ^[Function]\`(current: number) => void\` |
| onFinish | 结束导览时触发 | ^[Function]\`() => void\` |

### TourStep Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 指向的目标元素，支持选择器 / 元素 / 取元素的函数；为空时居中显示 | ^[string] / ^[HTMLElement] / ^[Function]\`() => HTMLElement \\| null\` | — |
| show-arrow | 是否显示箭头，缺省跟随 Tour | ^[boolean] | — |
| title | 标题 | ^[string] | — |
| description | 描述 | ^[string] | — |
| header | 自定义头部内容，对应官方 header 插槽 | ^[ReactNode] | — |
| children | 自定义描述内容，对应官方默认插槽 | ^[ReactNode] | — |
| placement | 相对目标元素的方位，缺省跟随 Tour | ^[enum] 同 Tour | bottom |
| content-style | 内容自定义样式，缺省跟随 Tour | ^[CSSProperties] | — |
| mask | 是否启用遮罩，缺省跟随 Tour | ^[boolean] / ^[object] | — |
| type | 类型，缺省跟随 Tour | ^[enum]\`'default' \\| 'primary'\` | default |
| next-button-props | 下一步按钮属性 | ^[object]\`TourBtnProps\` | — |
| prev-button-props | 上一步按钮属性 | ^[object]\`TourBtnProps\` | — |
| scroll-into-view-options | 自定义滚动参数，缺省跟随 Tour | ^[boolean] / ^[ScrollIntoViewOptions] | — |
| show-close | 是否显示关闭按钮，缺省跟随 Tour | ^[boolean] | — |
| close-icon | 自定义关闭图标，缺省跟随 Tour | ^[ReactNode] | — |
| onClose | 该步骤关闭时触发 | ^[Function]\`() => void\` | — |

### TourStep 插槽（以 props 形式提供）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| header | 自定义头部内容 | ^[ReactNode] |
| children | 自定义描述内容 | ^[ReactNode] |

### TourBtnProps

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 按钮文案 | ^[ReactNode] | — |
| onClick | 追加在官方默认行为之后的点击回调 | ^[Function]\`() => void\` | — |
| 其余字段 | 透传给 ElButton 的属性（type / disabled / class 等） | ^[ButtonProps] | — |

## 未实现的官方能力

- \`target-area-clickable\` 只做到了遮罩层的 pointer-events 切换；遮罩与挖孔都渲染在
  \`#__next\` 之外的 portal 里，若宿主页面的 \`body > div\` 上有更高层级的点击拦截，
  点击挖孔区域仍可能被拦下（官方同样依赖 body 上的 teleport，行为一致，但未做额外穿透处理）。
- \`arrow\` 的夹取范围用浮层自身宽高近似官方 floating-ui 的 arrowOffsetParent 尺寸；
  浮层有额外 padding / border 时，极端情况下的箭头位置可能与官方相差 1px 以内。
- \`content-style\` 未过滤官方内部写入的 \`position\` / \`top\` / \`left\` / \`transform\` /
  \`max-width\`，若在 \`contentStyle\` 中覆盖这些字段会破坏定位（官方同样不禁止）。
- \`scroll-into-view-options\` 传 \`false\` 时本项目仍会调用 \`scrollIntoView\`，
  与官方 \`element.scrollIntoView(false)\` 的语义一致，未额外做「完全不滚动」的分支。
`;

export default function TourPage() {
  return (
    <>
      <h1>Tour 漫游式引导</h1>
      <p>用于分步引导用户了解产品功能的漫游式引导组件。</p>

      <Heading level={2}>基础用法</Heading>
      <p>最基础的用法，通过 <code>target</code> 指向每一步的目标元素。</p>
      <DemoBlock source={SOURCES.basic}>
        <TourBasic />
      </DemoBlock>

      <Heading level={2}>非模态</Heading>
      <p>
        使用 <code>mask=false</code> 让导览不遮挡页面；此时建议配合{" "}
        <code>{'type="primary"'}</code> 强调引导本身。
      </p>
      <DemoBlock source={SOURCES.nonModal}>
        <TourNonModal />
      </DemoBlock>

      <Heading level={2}>位置</Heading>
      <p>
        通过 <code>placement</code> 改变引导卡片相对目标的位置，共 12 种；{" "}
        <code>target</code> 为空时卡片显示在屏幕中央。
      </p>
      <DemoBlock source={SOURCES.placement}>
        <TourPlacement />
      </DemoBlock>

      <Heading level={2}>自定义遮罩样式</Heading>
      <p>
        <code>mask</code> 传对象可自定义遮罩样式与填充色，也可以按步骤单独设置。
      </p>
      <DemoBlock source={SOURCES.mask}>
        <TourMask />
      </DemoBlock>

      <Heading level={2}>自定义指示器</Heading>
      <p>通过 <code>indicators</code> 替换默认的圆点指示器。</p>
      <DemoBlock source={SOURCES.indicator}>
        <TourIndicator />
      </DemoBlock>

      <Heading level={2}>目标元素</Heading>
      <p>
        <code>target</code> 支持选择器字符串、元素本身，或返回元素的函数。
      </p>
      <DemoBlock source={SOURCES.target}>
        <TourTarget />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
