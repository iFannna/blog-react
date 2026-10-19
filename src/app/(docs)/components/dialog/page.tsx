import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
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
} from "@/components/docs/examples/dialog";

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\` | \`visible\` + \`onVisibleChange\` | React 惯用写法 |
| \`<slot name="header">\` | \`header\` 属性 / 渲染函数 | 渲染函数提供 \`close\`、\`titleId\`、\`titleClass\` |
| \`<slot name="footer">\` | \`footer\` 属性 | 传节点 |
| \`resetPosition()\` / \`handleClose()\` | 未导出 | 通过受控 \`visible\` 控制显隐 |
| \`transition\` 支持对象配置 | 仅字符串动画名 | 对象形式的自定义过渡未实现 |

**实现说明**：

- 结构分层与官方一致：\`.el-overlay\`（遮罩）→ \`.el-overlay-dialog\`（铺满视口、承载点击）→ \`ElFocusTrap\` → \`.el-dialog\`
- 点击遮罩的判定等价于官方 \`useSameTarget\`：**只有 mousedown 与 mouseup 都落在遮罩本身**才算点击遮罩，
  防止「在对话框内按下、拖到遮罩上松开」误关闭
- \`destroyOnClose\` 在关闭动画结束后卸载内容；再次打开时重新挂载
- 嵌套对话框通过焦点层栈协调，内层打开时外层暂停，不会互相抢焦点
- \`draggable\` 使用 header 作为拖拽手柄；开启 \`overflow\` 后不再限制在视口内
- 自定义 \`transition\` 需在样式中提供对应的 \`*-enter-from\` / \`*-enter-active\` 等类名，
  演示使用 theme-chalk 内置的 \`dialog-fade\`、\`el-fade-in-linear\`、\`el-fade-in\`
`;

export default function DialogPage() {
  return (
    <>
      <h1>Dialog 对话框</h1>
      <p>在保留当前页面状态的情况下，告知用户并承载相关操作。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        需要设置 <code>visible</code> 属性来控制对话框的显示与隐藏；
        <code>beforeClose</code> 可以拦截关闭。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <DialogBasicUsage />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        对话框可以承载表格、表单等任意内容，内容区高度超出时滚动。
      </p>
      <DemoBlock source={SOURCES.customizationContent}>
        <DialogCustomizationContent />
      </DemoBlock>

      <Heading level={2}>自定义头部</Heading>
      <p>
        <code>header</code> 渲染函数接收 <code>close</code>、<code>titleId</code>、
        <code>titleClass</code>，可在保留可访问性的同时自由排布头部。
      </p>
      <DemoBlock source={SOURCES.customizationHeader}>
        <DialogCustomizationHeader />
      </DemoBlock>

      <Heading level={2}>嵌套对话框</Heading>
      <p>
        多层对话框通过焦点层栈协调焦点；内层对话框建议设置
        <code>appendToBody</code>。
      </p>
      <DemoBlock source={SOURCES.nestedDialog}>
        <DialogNestedDialog />
      </DemoBlock>

      <Heading level={2}>内容居中</Heading>
      <p>
        <code>center</code> 只会让头部和底部居中，正文需自行处理。
      </p>
      <DemoBlock source={SOURCES.centeredContent}>
        <DialogCenteredContent />
      </DemoBlock>

      <Heading level={2}>垂直居中</Heading>
      <p>
        <code>alignCenter</code> 让对话框在视口中水平垂直居中。
      </p>
      <DemoBlock source={SOURCES.alignCenter}>
        <DialogAlignCenter />
      </DemoBlock>

      <Heading level={2}>关闭后销毁</Heading>
      <p>
        <code>destroyOnClose</code> 在关闭动画结束后销毁内容，首次打开前也不渲染。
      </p>
      <DemoBlock source={SOURCES.destroyOnClose}>
        <DialogDestroyOnClose />
      </DemoBlock>

      <Heading level={2}>可拖拽对话框</Heading>
      <p>
        设置 <code>draggable</code> 后可拖动头部移动；<code>overflow</code>
        允许拖出视口。
      </p>
      <DemoBlock source={SOURCES.draggableDialog}>
        <DialogDraggableDialog />
      </DemoBlock>

      <Heading level={2}>全屏</Heading>
      <p>
        <code>fullscreen</code> 让对话框占满整个视口。
      </p>
      <DemoBlock source={SOURCES.fullscreen}>
        <DialogFullscreen />
      </DemoBlock>

      <Heading level={2}>遮罩</Heading>
      <p>
        <code>modal</code> 控制遮罩显示；配合 <code>modalPenetrable</code>
        可以让点击穿透到页面。
      </p>
      <DemoBlock source={SOURCES.modal}>
        <DialogModal />
      </DemoBlock>

      <Heading level={2}>自定义动画</Heading>
      <p>
        通过 <code>transition</code> 指定过渡动画名。自定义名称需要自行提供对应 CSS。
      </p>
      <DemoBlock source={SOURCES.customAnimation}>
        <DialogCustomAnimation />
      </DemoBlock>

      <Heading level={2}>事件</Heading>
      <p>
        打开 / 关闭全过程都会触发事件，便于与外部状态同步。
      </p>
      <DemoBlock source={SOURCES.events}>
        <DialogEvents />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
