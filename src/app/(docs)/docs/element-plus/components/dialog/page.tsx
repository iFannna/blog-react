import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  DialogAlignCenter,
  DialogBasicUsage,
  DialogCenteredContent,
  DialogCustomAnimation,
  DialogCustomizationContent,
  DialogCustomizationHeader,
  DialogDestroyOnClose,
  DialogDraggableDialog,
  DialogEvents,
  DialogFullscreen,
  DialogModal,
  DialogNestedDialog,
} from "@/components/element-plus/examples/dialog";

export const metadata: Metadata = { title: "Dialog 对话框" };

const SOURCES = {
  basicUsage: `const [visible, setVisible] = useState(false);

<ElButton onClick={() => setVisible(true)}>Click to open the Dialog</ElButton>

<ElDialog
  visible={visible}
  onVisibleChange={setVisible}
  title="Tips"
  width={500}
  beforeClose={(done) => {
    MessageBox.confirm("Are you sure to close this dialog?")
      .then(() => done())
      .catch(() => {});
  }}
  footer={<Footer cancel={() => setVisible(false)} confirm={() => setVisible(false)} />}
>
  <span>This is a message</span>
</ElDialog>`,

  customizationContent: `<ElDialog visible={tableVisible} onVisibleChange={setTableVisible} title="Shipping address" width={800}>
  <ElTable data={gridData}>
    <ElTableColumn property="date" label="Date" width={150} />
    <ElTableColumn property="name" label="Name" width={200} />
    <ElTableColumn property="address" label="Address" />
  </ElTable>
</ElDialog>

<ElDialog visible={formVisible} onVisibleChange={setFormVisible} title="Shipping address" width={500} footer={<Footer />}>
  <ElInput value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
  <ElSelect value={form.region} onChange={(value) => setForm({ ...form, region: String(value ?? "") })} options={zones} />
</ElDialog>`,

  customizationHeader: `<ElDialog
  visible={visible}
  onVisibleChange={setVisible}
  showClose={false}
  width={500}
  header={({ close, titleId, titleClass }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
      <h4 id={titleId} className={titleClass} style={{ margin: 0 }}>
        This is a custom header!
      </h4>
      <ElButton type="danger" onClick={close}>
        <CircleCloseFilled style={{ marginRight: 4 }} />
        Close
      </ElButton>
    </div>
  )}
>
  This is dialog content.
</ElDialog>`,

  nestedDialog: `<ElDialog visible={outerVisible} onVisibleChange={setOuterVisible} title="Outer Dialog" width={800}>
  <span>This is the outer Dialog</span>
  <ElDialog
    visible={innerVisible}
    onVisibleChange={setInnerVisible}
    width={500}
    title="Inner Dialog"
    appendToBody
  >
    <span>This is the inner Dialog</span>
  </ElDialog>
</ElDialog>`,

  centeredContent: `<ElDialog visible={visible} onVisibleChange={setVisible} title="Warning" width={500} center footer={<Footer />}>
  <span>It should be noted that the content will not be aligned in center by default</span>
</ElDialog>`,

  alignCenter: `<ElDialog visible={visible} onVisibleChange={setVisible} title="Warning" width={500} alignCenter footer={<Footer />}>
  <span>Open the dialog from the center from the screen</span>
</ElDialog>`,

  destroyOnClose: `<ElDialog visible={visible} onVisibleChange={setVisible} title="Notice" width={500} destroyOnClose center footer={<Footer />}>
  <span>Notice: before the dialog is opened for the first time, this node will not be rendered.</span>
  <div><strong>Extra content (Not rendered)</strong></div>
</ElDialog>`,

  draggableDialog: `<ElDialog visible={visible} onVisibleChange={setVisible} title="Tips" width={500} draggable footer={<Footer />}>
  <span>It&apos;s a draggable Dialog</span>
</ElDialog>

<ElDialog visible={overflowVisible} onVisibleChange={setOverflowVisible} title="Tips" width={500} draggable overflow footer={<Footer />}>
  <span>It&apos;s a overflow draggable Dialog</span>
</ElDialog>`,

  fullscreen: `<ElDialog visible={visible} onVisibleChange={setVisible} fullscreen footer={<Footer />}>
  <span>It&apos;s a fullscreen Dialog</span>
</ElDialog>`,

  modal: `<ElDialog visible={visible} onVisibleChange={setVisible} modal={false} modalPenetrable footer={<Footer />}>
  <span>It&apos;s a modal Dialog</span>
</ElDialog>`,

  customAnimation: `const [transition, setTransition] = useState("dialog-fade");

<ElButton onClick={() => setTransition("el-fade-in-linear")}>Linear</ElButton>
<ElDialog
  visible={visible}
  onVisibleChange={setVisible}
  title="Animation Dialog"
  width="30%"
  transition={transition}
  footer={<Footer />}
>
  <p>Current animation: {transition}</p>
</ElDialog>`,

  events: `<ElDialog
  visible={visible}
  onVisibleChange={setVisible}
  beforeClose={(done) => { log("before-close"); done(); }}
  onOpen={() => log("open")}
  onOpened={() => log("opened")}
  onClose={() => log("close")}
  onClosed={() => log("closed")}
  onOpenAutoFocus={() => log("open-auto-focus")}
  onCloseAutoFocus={() => log("close-auto-focus")}
  footer={<Footer />}
>
  <span>It&apos;s a event Dialog</span>
</ElDialog>`,
};

const API_MD = `
## Dialog API

### Dialog Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示 | ^[boolean] | false |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| width | 宽度 | ^[string] / ^[number] | 50% |
| top | 对话框 CSS 的 margin-top | ^[string] | 15vh |
| fullscreen | 是否为全屏 | ^[boolean] | false |
| align-center | 是否水平垂直居中（此时 top 无效） | ^[boolean] | false |
| center | 头部与底部是否居中 | ^[boolean] | false |
| show-close | 是否显示关闭按钮 | ^[boolean] | true |
| close-on-click-modal | 点击遮罩是否关闭 | ^[boolean] | true |
| close-on-press-escape | 按 ESC 是否关闭 | ^[boolean] | true |
| modal | 是否显示遮罩 | ^[boolean] | true |
| modal-penetrable | 遮罩是否可穿透（需 modal=false） | ^[boolean] | false |
| modal-class | 遮罩自定义类名 | ^[string] | — |
| lock-scroll | 显示时是否锁定 body 滚动 | ^[boolean] | true |
| destroy-on-close | 关闭后是否销毁内容 | ^[boolean] | false |
| open-delay / close-delay | 打开 / 关闭延迟（毫秒） | ^[number] | 0 |
| before-close | 关闭前钩子，调用 done 才真正关闭 | ^[Function]\`(done: (cancel?: boolean) => void) => void\` | — |
| draggable | 是否可拖拽移动 | ^[boolean] | false |
| overflow | 拖拽时是否允许超出视口 | ^[boolean] | false |
| trap-focus | 是否将焦点限制在对话框内 | ^[boolean] | true |
| header-aria-level | 头部 aria-level | ^[number] / ^[string] | 2 |
| transition | 过渡动画名 | ^[string] | dialog-fade |
| append-to | 挂载目标，优先于 append-to-body | ^[string] / ^[HTMLElement] | body |
| append-to-body | 是否挂载到 body | ^[boolean] | false |
| close-icon | 自定义关闭图标 | ^[ReactNode] | Close |
| header-class / body-class / footer-class | 各区域类名 | ^[string] | — |
| z-index | 层级 | ^[number] | — |
| header | 头部内容，可传渲染函数获取 \`{ close, titleId, titleClass }\` | ^[ReactNode] / ^[Function] | — |
| footer | 底部内容 | ^[ReactNode] | — |

### Dialog Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐变化 | ^[Function]\`(visible: boolean) => void\` |
| onOpen | 打开前触发 | ^[Function]\`() => void\` |
| onOpened | 打开动画结束后触发 | ^[Function]\`() => void\` |
| onClose | 关闭前触发 | ^[Function]\`() => void\` |
| onClosed | 关闭动画结束后触发 | ^[Function]\`() => void\` |
| onOpenAutoFocus | 打开并聚焦内容后触发 | ^[Function]\`() => void\` |
| onCloseAutoFocus | 关闭并恢复焦点后触发 | ^[Function]\`() => void\` |

### Dialog Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 对话框内容 | \`children\` |
| header | 头部内容；替换后 title 不再渲染，但关闭按钮保留 | \`header\` 属性或渲染函数 |
| footer | 底部内容 | \`footer\` 属性 |
`;

export default function DialogPage() {
  return (
    <>
      <h1>Dialog 对话框</h1>
      <p>在保留当前页面状态的情况下，告知用户并承载相关操作。</p>

      <Heading level={2}>基础用法</Heading>
      <p>Dialog 弹出一个对话框，适合需要定制性更大的场景。</p>
      <p>
        需要设置 <code>model-value / v-model</code> 属性，它接收{" "}
        <code>Boolean</code>，当为 <code>true</code> 时显示 Dialog。 Dialog
        分为两个部分：<code>body</code> 和 <code>footer</code>，
        <code>footer</code> 需要具名为 <code>footer</code> 的 <code>slot</code>。{" "}
        <code>title</code> 属性用于定义标题，它是可选的，默认值为空。最后，本例还展示了{" "}
        <code>before-close</code> 的用法。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <DialogBasicUsage />
      </DemoBlock>
      <DocsContent
        source={`:::tip

\`before-close\` 只会在用户点击关闭按钮或者对话框的遮罩区域时被调用。如果你在 \`footer\` 具名 slot 里添加了用于关闭 Dialog 的按钮，那么可以在按钮的点击回调函数里加入 \`before-close\` 的相关逻辑。

:::`}
      />

      <Heading level={2}>自定义内容</Heading>
      <p>
        对话框的内容可以是任何东西，甚至是一个表格或表单。此示例显示如何在 Dialog
        中使用 Element Plus 的表格和表单。
      </p>
      <DemoBlock source={SOURCES.customizationContent}>
        <DialogCustomizationContent />
      </DemoBlock>

      <Heading level={2}>自定义头部</Heading>
      <p>
        <code>header</code> 可用于自定义显示标题的区域。为了保持可用性，除了使用此插槽外，使用{" "}
        <code>title</code> 属性，或使用 <code>titleId</code>{" "}
        插槽属性来指定哪些元素应该读取为对话框标题。
      </p>
      <DemoBlock source={SOURCES.customizationHeader}>
        <DialogCustomizationHeader />
      </DemoBlock>

      <Heading level={2}>嵌套的对话框</Heading>
      <p>
        如果需要在一个 Dialog 内部嵌套另一个 Dialog，需要使用{" "}
        <code>append-to-body</code> 属性。
      </p>
      <p>
        通常我们不建议使用嵌套对话框。如果你需要在页面上呈现多个对话框，你可以简单地打平它们，以便它们彼此之间是平级关系。如果必须要在一个对话框内展示另一个对话框，可以将内部嵌套的对话框属性{" "}
        <code>append-to-body</code> 设置为 true，嵌套的对话框将附加到 body
        而不是其父节点，这样两个对话框都可以被正确地渲染。
      </p>
      <DemoBlock source={SOURCES.nestedDialog}>
        <DialogNestedDialog />
      </DemoBlock>

      <Heading level={2}>内容居中</Heading>
      <p>对话框的内容可以居中。</p>
      <p>
        将<code>center</code>设置为<code>true</code>即可使标题和底部居中。{" "}
        <code>center</code>仅影响标题和底部区域。 Dialog
        的内容是任意的，在一些情况下，内容并不适合居中布局。如果需要内容也水平居中，请自行为其添加
        CSS 样式。
      </p>
      <DemoBlock source={SOURCES.centeredContent}>
        <DialogCenteredContent />
      </DemoBlock>
      <DocsContent
        source={`:::tip

Dialog 的内容是懒渲染的——在被第一次打开之前，传入的默认 slot 不会被立即渲染到 DOM 上。因此，如果需要执行 DOM 操作，或通过 \`ref\` 获取相应组件，请在 \`open\` 事件回调中进行。

:::`}
      />

      <Heading level={2}>居中对话框</Heading>
      <p>从屏幕中心打开对话框。</p>
      <p>
        设置 <code>align-center</code> 为 <code>true</code>{" "}
        使对话框水平垂直居中。由于对话框垂直居中在弹性盒子中，所以<code>top</code>
        属性将不起作用。
      </p>
      <DemoBlock source={SOURCES.alignCenter}>
        <DialogAlignCenter />
      </DemoBlock>

      <Heading level={2}>关闭时销毁</Heading>
      <p>
        启用此功能时，默认栏位下的内容将使用 <code>v-if</code>{" "}
        指令销毁。当出现性能问题时，可以启用此功能。
      </p>
      <p>
        需要注意的是，当这个属性被启用时，在{" "}
        <code>transition.beforeEnter</code> 事件卸载前，除了 <code>overlay</code>、
        <code>header (可选)</code>与<code>footer(可选)</code> ，Dialog
        内不会有其它任何其它的 DOM 节点存在。
      </p>
      <DemoBlock source={SOURCES.destroyOnClose}>
        <DialogDestroyOnClose />
      </DemoBlock>

      <Heading level={2}>可拖拽对话框</Heading>
      <p>试着拖动一下<code>header</code>部分吧</p>
      <p>
        设置<code>draggable</code>属性为<code>true</code>以做到拖拽设置{" "}
        <code>overflow</code> <span className="docs-version-tag">2.5.4</span> 为{" "}
        <code>true</code> 可以让拖拽范围超出可视区。
      </p>
      <DemoBlock source={SOURCES.draggableDialog}>
        <DialogDraggableDialog />
      </DemoBlock>
      <DocsContent
        source={`:::tip

当 \`modal\` 的值为 false 时，请一定要确保 \`append-to-body\` 属性为 **true**，由于 \`Dialog\` 使用 \`position: relative\` 定位，当外层的遮罩层被移除时，\`Dialog\` 则会根据当前 DOM 上的祖先节点来定位，因此可能造成定位问题。

:::`}
      />

      <Heading level={2}>全屏</Heading>
      <p>
        设置 <code>fullscreen</code> 属性来打开全屏对话框。
      </p>
      <DemoBlock source={SOURCES.fullscreen}>
        <DialogFullscreen />
      </DemoBlock>
      <DocsContent
        source={`:::tip

如果 \`fullscreen\` 为 true，则 \`width\`、\`top\` 和 \`draggable\` 属性无效。

:::`}
      />

      <Heading level={2}>模态框</Heading>
      <p>
        将 <code>modal</code> 设置为 <code>false</code> 会隐藏对话框的模态（覆盖层）。
      </p>
      <p>
        从版本 <span className="docs-version-tag">2.10.5</span> 起，新增了{" "}
        <code>modal-penetrable</code>属性，该属性可设置为“可穿透”（即允许穿透）。
      </p>
      <DemoBlock source={SOURCES.modal}>
        <DialogModal />
      </DemoBlock>

      <Heading level={2} id="自定义动画">
        自定义动画 <span className="docs-version-tag">2.10.5</span>
      </Heading>
      <p>
        通过 <code>transition</code>{" "}
        属性自定义对话框动画，该属性可以接受以下任意一种值：
      </p>
      <ul>
        <li>动画名称（字符串）</li>
        <li>Vue 过渡配置（对象）</li>
      </ul>
      <p>
        示例包括缩放（scale）、滑动（slide）、淡入淡出（fade）、弹跳（bounce）动画，以及带有自定义事件处理器的基于对象的配置。
      </p>
      <DemoBlock source={SOURCES.customAnimation}>
        <DialogCustomAnimation />
      </DemoBlock>
      <DocsContent
        source={`:::tip

动画类会根据过渡名称动态生成。为了更细致地控制动画行为，你可以明确地定义这些类。详情请参见 [自定义过渡类（custom-transition-classes）](https://vuejs.org/guide/built-ins/transition.html#custom-transition-classes)。

:::`}
      />

      <Heading level={2}>Events</Heading>
      <p>打开开发者控制台(ctrl + shift + J)，查看事件的顺序。</p>
      <DemoBlock source={SOURCES.events}>
        <DialogEvents />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
