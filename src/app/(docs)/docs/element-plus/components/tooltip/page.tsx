import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TooltipAdvancedUsage,
  TooltipAnimations,
  TooltipAppendTo,
  TooltipBasic,
  TooltipControlled,
  TooltipHtmlContent,
  TooltipRichContent,
  TooltipSingleton,
  TooltipTheme,
  TooltipVirtualTrigger,
} from "@/components/element-plus/examples/overlay";

export const metadata: Metadata = { title: "Tooltip 文字提示" };

const SOURCES = {
  basic: `<ElTooltip content="placement: top-start" placement="top-start">
  <ElButton>top-start</ElButton>
</ElTooltip>
<ElTooltip content="placement: top" placement="top">
  <ElButton>top</ElButton>
</ElTooltip>
<ElTooltip content="placement: top-end" placement="top-end">
  <ElButton>top-end</ElButton>
</ElTooltip>
<ElTooltip content="placement: left-start" placement="left-start">
  <ElButton>left-start</ElButton>
</ElTooltip>
<ElTooltip content="placement: right-start" placement="right-start">
  <ElButton>right-start</ElButton>
</ElTooltip>
<ElTooltip content="placement: left" placement="left">
  <ElButton>left</ElButton>
</ElTooltip>
<ElTooltip content="placement: right" placement="right">
  <ElButton>right</ElButton>
</ElTooltip>
<ElTooltip content="placement: left-end" placement="left-end">
  <ElButton>left-end</ElButton>
</ElTooltip>
<ElTooltip content="placement: right-end" placement="right-end">
  <ElButton>right-end</ElButton>
</ElTooltip>
<ElTooltip content="placement: bottom-start" placement="bottom-start">
  <ElButton>bottom-start</ElButton>
</ElTooltip>
<ElTooltip content="placement: bottom" placement="bottom">
  <ElButton>bottom</ElButton>
</ElTooltip>
<ElTooltip content="placement: bottom-end" placement="bottom-end">
  <ElButton>bottom-end</ElButton>
</ElTooltip>`,

  theme: `<ElTooltip content="Top center" placement="top">
  <ElButton>Dark</ElButton>
</ElTooltip>
<ElTooltip content="Bottom center" placement="bottom" effect="light">
  <ElButton>Light</ElButton>
</ElTooltip>
<ElTooltip content="Customized theme" effect="customized" popperStyle={{ background: "linear-gradient(...)" }}>
  <ElButton>Customized theme</ElButton>
</ElTooltip>`,

  richContent: `<ElTooltip placement="top" content={<>multiple lines<br />second line</>}>
  <ElButton>Top center</ElButton>
</ElTooltip>`,

  advancedUsage: `const [disabled, setDisabled] = useState(false);

<ElTooltip disabled={disabled} content="click to close tooltip function" placement="bottom" effect="light">
  <ElButton onClick={() => setDisabled((v) => !v)}>
    click to {disabled ? "active" : "close"} tooltip function
  </ElButton>
</ElTooltip>`,

  htmlContent: `<ElTooltip content="<span>The content can be <strong>HTML</strong></span>" rawContent>
  <ElButton>hover me</ElButton>
</ElTooltip>`,

  virtualTrigger: `const [visible, setVisible] = useState(false);
const position = useRef({ x: 0, y: 0 });
const virtualRef = useRef({
  getBoundingClientRect: () => new DOMRect(position.current.x, position.current.y, 0, 0),
});

<ElTooltip
  visible={visible}
  content="Bottom center"
  placement="bottom"
  effect="light"
  trigger="click"
  virtualTriggering
  virtualRef={virtualRef.current}
/>
<ElButton onClick={() => setVisible((v) => !v)}>test</ElButton>`,

  singleton: `{/* 三个按钮共用一个 Tooltip，鼠标移入时更新 virtualRef */}
<ElTooltip
  visible={visible}
  virtualTriggering
  virtualRef={virtualRef.current}
  popperClass="singleton-tooltip"
  content={<span>Some content</span>}
/>`,

  controlled: `const [visible, setVisible] = useState(false);

<ElTooltip visible={visible} content={<span>Content</span>}>
  <ElButton onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
    Hover me
  </ElButton>
</ElTooltip>`,

  animations: `<ElTooltip content="I am an el-tooltip" transition="el-zoom-in-top">
  <ElButton>trigger me</ElButton>
</ElTooltip>`,

  appendTo: `<ElTooltip appendTo=".tooltip-append-target" trigger="click" content="Append to .target" placement="top">
  <ElButton className="tooltip-append-target">Click to open tooltip</ElButton>
</ElTooltip>`,
};

const API_MD = `
## Tooltip API

### Tooltip Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | ^[string] / ^[ReactNode] | — |
| placement | 弹出位置，共 12 个方向 | ^[enum]\`'top' \\| 'top-start' \\| ...\` | bottom |
| effect | 主题 | ^[enum]\`'dark' \\| 'light' \\| 自定义\` | dark |
| trigger | 触发方式，可传数组组合 | ^[enum]\`'hover' \\| 'click' \\| 'focus' \\| 'contextmenu'\` / ^[array] | hover |
| trigger-keys | 键盘触发键 | ^[array] | \`['Enter','NumpadEnter',' ']\` |
| disabled | 是否禁用 | ^[boolean] | false |
| visible | 受控显示状态 | ^[boolean] | — |
| show-after | 显示延迟（毫秒） | ^[number] | 0 |
| hide-after | 隐藏延迟（毫秒） | ^[number] | 200 |
| auto-close | 自动关闭延迟（毫秒），0 表示不自动关 | ^[number] | 0 |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| offset | 与触发元素的距离 | ^[number] | 12 |
| fallback-placements | 翻转时的兜底方位列表 | ^[array] | — |
| popper-class | 提示内容的类名 | ^[string] | — |
| popper-style | 提示内容的样式 | ^[object] | — |
| enterable | 鼠标是否可进入提示内容 | ^[boolean] | true |
| raw-content | 内容是否作为 HTML 字符串渲染 | ^[boolean] | false |
| teleported | 是否挂载到 appendTo | ^[boolean] | true |
| append-to | 挂载目标选择器或元素 | ^[string] / ^[HTMLElement] | — |
| persistent | 不可见时是否保留 DOM | ^[boolean] | false |
| transition | 过渡动画名 | ^[string] | el-fade-in-linear |
| virtual-triggering | 是否启用虚拟触发 | ^[boolean] | false |
| virtual-ref | 虚拟触发参照物 | ^[HTMLElement] / ^[object] | — |
| role | 浮层语义角色 | ^[string] | tooltip |
| aria-label | 浮层 aria-label | ^[string] | — |
| z-index | 层级 | ^[number] | — |

### Tooltip Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐状态变化 | ^[Function]\`(visible: boolean) => void\` |

### Tooltip Exposes

| 方法 | 说明 |
| --- | --- |
| show() | 立即显示 |
| hide() | 立即隐藏 |
| toggle() | 切换显隐 |
| onOpen() | 按 showAfter 延迟显示 |
| onClose(delay?) | 按 hideAfter 延迟隐藏，传 0 立即隐藏 |
| popperRef | 浮层根节点 |
`;

export default function TooltipPage() {
  return (
    <>
      <h1>Tooltip 文字提示</h1>
      <p>常用于展示鼠标 hover 时的提示信息。</p>

      <Heading level={2}>基础用法</Heading>
      <p>在这里我们提供 9 种不同方向的展示方式，可以通过以下完整示例来理解，选择你要的效果。</p>
      <p>
        使用 <code>content</code> 属性来决定 <code>hover</code>{" "}
        时的提示信息。由 <code>placement</code> 属性决定展示效果：{" "}
        <code>placement</code>属性值为：<code>[方向]-[对齐位置]</code>；四个方向：
        <code>top</code>、<code>left</code>、<code>right</code>、
        <code>bottom</code>；三种对齐位置：<code>start</code>, <code>end</code>，默认为空。如{" "}
        <code>placement=&quot;left-end&quot;</code>，则提示信息出现在目标元素的左侧，且提示信息的底部与目标元素的底部对齐。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TooltipBasic />
      </DemoBlock>

      <Heading level={2}>主题</Heading>
      <p>
        Tooltip 组件内置了两个主题：<code>dark</code>和<code>light</code>。
      </p>
      <DocsContent
        source={`:::tip

要使用自定义主题，您必须知道您的工具提示在哪里渲染， 如果您的工具提示被呈现为根元素，您将需要全局设置css规则。

建议您使用自定义主题并同时显示箭头时不使用线性渐变背景颜色。 因为弹出箭头和内容是两个不同的元素， 弹出箭头的样式需要单独设置， 当它到渐变背景颜色时，会看起来很奇怪。

:::`}
      />
      <p>
        通过设置 <code>effect</code> 来修改主题，默认值为 <code>dark</code>.
      </p>
      <DemoBlock source={SOURCES.theme}>
        <TooltipTheme />
      </DemoBlock>

      <Heading level={2}>更多内容的文字提示</Heading>
      <p>展示多行文本或者是设置文本内容的格式</p>
      <p>
        用具名 slot <code>content</code>，替代<code>tooltip</code>中的<code>content</code>属性。
      </p>
      <DemoBlock source={SOURCES.richContent}>
        <TooltipRichContent />
      </DemoBlock>

      <Heading level={2}>高级扩展</Heading>
      <p>除了这些基本设置外，还有一些属性可以让使用者更好的定制自己的效果：</p>
      <p>
        <code>transition</code> 属性可以定制显隐的动画效果，默认为<code>fade-in-linear</code>。
      </p>
      <p>
        如果需要关闭 <code>tooltip</code> 功能，<code>disabled</code>{" "}
        属性可以满足这个需求，你只需要将其设置为 <code>true</code>。
      </p>
      <p>
        事实上，Tooltip 是一个基于{" "}
        <a
          href="https://github.com/element-plus/element-plus/tree/dev/packages/components/popper"
          target="_blank"
          rel="noreferrer"
        >
          ElPopper
        </a>{" "}
        的扩展，您可以使用 ElPopper 中允许的任何属性。
      </p>
      <DemoBlock source={SOURCES.advancedUsage}>
        <TooltipAdvancedUsage />
      </DemoBlock>
      <DocsContent
        source={`:::tip

Tooltip 内不支持 \`router-link\` 组件，请使用 \`vm.$router.push\` 代替。

tooltip 内不支持 disabled form 元素，参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter)，请在 disabled form 元素外层添加一层包裹元素。

:::`}
      />

      <Heading level={2} id="显示-html-内容">
        显示 HTML 内容
      </Heading>
      <p>内容属性可以设置为 HTML 字符串。</p>
      <DocsContent
        source={`:::warning

\`content\` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。因此在 \`raw-content\` 打开的情况下，请确保 \`content\` 的内容是可信的，**永远不要**将用户提交的内容赋值给 \`content\` 属性。

:::`}
      />
      <DemoBlock source={SOURCES.htmlContent}>
        <TooltipHtmlContent />
      </DemoBlock>

      <Heading level={2}>虚拟触发</Heading>
      <p>
        有时候我们想把 tooltip
        的触发元素放在别的地方，而不需要写在一起，这时候就可以使用虚拟触发。
      </p>
      <DocsContent
        source={`:::tip

需要注意的是，虚拟触发的 tooltip 是受控组件，因此你必须自己去控制 tooltip 是否显示，**你将无法**通过点击空白处来关闭 tooltip。

:::`}
      />
      <DemoBlock source={SOURCES.virtualTrigger}>
        <TooltipVirtualTrigger />
      </DemoBlock>

      <Heading level={2}>单例模式</Heading>
      <p>
        Tooltip 可以作为单例，也就是是说你可以同时有多个触发同一个 tooltip
        的触发元素，这个功能是在 <code>虚拟触发</code> 的基础上开发的。
      </p>
      <DocsContent
        source={`:::tip

已知问题：使用单例模式时，弹出窗口会从意料之外的位置弹出。

:::`}
      />
      <DemoBlock source={SOURCES.singleton}>
        <TooltipSingleton />
      </DemoBlock>

      <Heading level={2}>受控模式</Heading>
      <p>
        Tooltip 可以通过父组件使用 <code>:visible</code> 来控制它的显示与关闭。
      </p>
      <DemoBlock source={SOURCES.controlled}>
        <TooltipControlled />
      </DemoBlock>

      <Heading level={2}>自定义动画</Heading>
      <p>
        Tooltip 可以自定义动画，您可以使用 <code>transition</code> 设置所需的动画效果。
      </p>
      <DocsContent
        source={`:::tip

过渡效果的更多信息可以在 [Vue 过渡效果](https://vuejs.org/guide/built-ins/transition.html#css-based-transitions) 中找到。

:::`}
      />
      <DemoBlock source={SOURCES.animations}>
        <TooltipAnimations />
      </DemoBlock>

      <Heading level={2} id="使用-append-to">
        使用 <code>append-to</code>
      </Heading>
      <p>
        您必须等待 DOM 加载后才能使用 <code>targetElement</code>。
      </p>
      <DemoBlock source={SOURCES.appendTo}>
        <TooltipAppendTo />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
