import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  DrawerBasicUsage,
  DrawerCustomizationContent,
  DrawerCustomizationHeader,
  DrawerModal,
  DrawerNestedDrawer,
  DrawerNoTitle,
  DrawerResizable,
} from "@/components/element-plus/examples/drawer";

export const metadata: Metadata = { title: "Drawer 抽屉" };

const SOURCES = {
  basicUsage: `const [direction, setDirection] = useState<DrawerDirection>("rtl");

<ElRadioGroup value={direction} onChange={(value) => setDirection(value as DrawerDirection)}>
  <ElRadio value="ltr">left to right</ElRadio>
  <ElRadio value="rtl">right to left</ElRadio>
  <ElRadio value="ttb">top to bottom</ElRadio>
  <ElRadio value="btt">bottom to top</ElRadio>
</ElRadioGroup>

<ElDrawer
  visible={visible}
  onVisibleChange={setVisible}
  title="I am the title"
  direction={direction}
  beforeClose={(done) => {
    MessageBox.confirm("Are you sure you want to close this?")
      .then(() => done())
      .catch(() => {});
  }}
>
  <span>Hi, there!</span>
</ElDrawer>`,

  noTitle: `<ElDrawer
  visible={visible}
  onVisibleChange={setVisible}
  title="I am the title"
  withHeader={false}
>
  <span>Hi there!</span>
</ElDrawer>`,

  customizationContent: `<ElDrawer
  visible={tableVisible}
  onVisibleChange={setTableVisible}
  title="I have a nested table inside!"
  direction="rtl"
  size="50%"
>
  <ElTable data={gridData}>
    <ElTableColumn property="date" label="Date" width={150} />
    <ElTableColumn property="name" label="Name" width={200} />
    <ElTableColumn property="address" label="Address" />
  </ElTable>
</ElDrawer>

<ElDrawer visible={formVisible} onVisibleChange={setFormVisible} title="I have a nested form inside!" direction="ltr">
  <ElInput value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
  <ElSelect value={form.region} onChange={(value) => setForm({ ...form, region: String(value ?? "") })} options={areas} />
  <ElButton type="primary" loading={loading} onClick={submit}>
    {loading ? "Submitting ..." : "Submit"}
  </ElButton>
</ElDrawer>`,

  customizationHeader: `<ElDrawer
  visible={visible}
  onVisibleChange={setVisible}
  showClose={false}
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
  This is drawer content.
</ElDrawer>`,

  resizable: `const [direction, setDirection] = useState<DrawerDirection>("rtl");

<ElRadioGroup
  value={direction}
  onChange={(value) => {
    setDirection(value as DrawerDirection);
    setVisible(true);
  }}
>
  <ElRadio value="ttb" button>top</ElRadio>
  <ElRadio value="rtl" button>right</ElRadio>
  <ElRadio value="btt" button>bottom</ElRadio>
  <ElRadio value="ltr" button>left</ElRadio>
</ElRadioGroup>

<ElDrawer
  visible={visible}
  onVisibleChange={setVisible}
  direction={direction}
  resizable
>
  This is drawer content.
</ElDrawer>`,

  nestedDrawer: `<ElDrawer visible={visible} onVisibleChange={setVisible} title="I'm outer Drawer" size="50%">
  <ElButton onClick={() => setInnerVisible(true)}>Click me!</ElButton>
  <ElDrawer
    visible={innerVisible}
    onVisibleChange={setInnerVisible}
    title="I'm inner Drawer"
    appendToBody
    beforeClose={(done) => {
      MessageBox.confirm("You still have unsaved data, proceed?")
        .then(() => done())
        .catch(() => {});
    }}
  >
    <p>_(:зゝ∠)_</p>
  </ElDrawer>
</ElDrawer>`,

  modal: `<ElDrawer
  visible={visible}
  onVisibleChange={setVisible}
  modal={false}
  modalPenetrable
  footer={<Footer cancel={() => setVisible(false)} confirm={() => setVisible(false)} />}
>
  <span>It&apos;s a modal Drawer</span>
</ElDrawer>`,
};

const API_MD = `
## Drawer API

### Drawer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示 | ^[boolean] | false |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| direction | 打开方向 | ^[enum]\`'ltr' \\| 'rtl' \\| 'ttb' \\| 'btt'\` | rtl |
| size | 尺寸。横向方向对应宽度，纵向对应高度；数字以 px 计 | ^[string] / ^[number] | 30% |
| with-header | 是否渲染头部 | ^[boolean] | true |
| show-close | 是否显示关闭按钮 | ^[boolean] | true |
| modal | 是否显示遮罩 | ^[boolean] | true |
| modal-penetrable | 遮罩是否可穿透（需 modal=false） | ^[boolean] | false |
| modal-class | 遮罩自定义类名 | ^[string] | — |
| lock-scroll | 显示时是否锁定 body 滚动 | ^[boolean] | true |
| close-on-click-modal | 点击遮罩是否关闭 | ^[boolean] | true |
| close-on-press-escape | 按 ESC 是否关闭 | ^[boolean] | true |
| destroy-on-close | 关闭后是否销毁内容 | ^[boolean] | false |
| open-delay / close-delay | 打开 / 关闭延迟（毫秒） | ^[number] | 0 |
| resizable | 是否可拖拽调整尺寸 | ^[boolean] | false |
| before-close | 关闭前钩子，调用 done 才真正关闭 | ^[Function]\`(done: (cancel?: boolean) => void) => void\` | — |
| append-to | 挂载目标，优先于 append-to-body | ^[string] / ^[HTMLElement] | body |
| append-to-body | 是否挂载到 body，嵌套抽屉需开启 | ^[boolean] | false |
| trap-focus | 是否将焦点限制在抽屉内 | ^[boolean] | true |
| header-aria-level | 头部 aria-level | ^[number] / ^[string] | 2 |
| header-class / body-class / footer-class | 各区域类名 | ^[string] | — |
| z-index | 层级 | ^[number] | — |
| header | 头部内容，可传渲染函数获取 \`{ close, titleId, titleClass }\` | ^[ReactNode] / ^[Function] | — |
| footer | 底部内容 | ^[ReactNode] | — |

### Drawer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐变化 | ^[Function]\`(visible: boolean) => void\` |
| onOpen | 打开动画前触发 | ^[Function]\`() => void\` |
| onOpened | 打开动画结束后触发 | ^[Function]\`() => void\` |
| onClose | 关闭动画前触发 | ^[Function]\`() => void\` |
| onClosed | 关闭动画结束后触发 | ^[Function]\`() => void\` |
| onOpenAutoFocus | 打开并聚焦内容后触发 | ^[Function]\`() => void\` |
| onCloseAutoFocus | 关闭并恢复焦点后触发 | ^[Function]\`() => void\` |
| onResizeStart | 开始拖拽调整尺寸 | ^[Function]\`(event: MouseEvent, size: number) => void\` |
| onResize | 拖拽调整中 | ^[Function]\`(event: MouseEvent, size: number) => void\` |
| onResizeEnd | 结束拖拽调整 | ^[Function]\`(event: MouseEvent, size: number) => void\` |

### Drawer Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 抽屉内容 | \`children\` |
| header | 头部内容；替换后 title 不再渲染，但关闭按钮保留 | \`header\` 属性或渲染函数 |
| footer | 底部内容 | \`footer\` 属性 |
`;

export default function DrawerPage() {
  return (
    <>
      <h1>Drawer 抽屉</h1>
      <p>
        有些时候, <code>Dialog</code> 组件并不满足我们的需求, 比如你的表单很长,
        亦或是你需要临时展示一些文档, <code>Drawer</code> 拥有和{" "}
        <code>Dialog</code> 几乎相同的 API, 在 UI 上带来不一样的体验.
      </p>
      <DocsContent
        source={`:::tip

在 Vue 3 之后的版本 v-model 可以用于任何一个组件，\`visible.sync\` 已被移除，请使用 \`v-model="visibilityBinding"\` 来控制抽屉组件的显示和隐藏状态。

:::`}
      />

      <Heading level={2}>基础用法</Heading>
      <p>呼出一个临时的侧边栏, 可以从多个方向呼出</p>
      <p>
        你必须像 <code>Dialog</code>一样为 <code>Drawer</code> 设置{" "}
        <code>model-value</code> 属性来控制 <code>Drawer</code>{" "}
        的显示与隐藏状态，该属性接受一个 <code>boolean</code> 类型。{" "}
        <code>Drawer</code> 包含三部分: <code>title</code> & <code>body</code> &{" "}
        <code>footer</code>, 其中 <code>title</code> 是一个具名 slot, 你还可以通过{" "}
        <code>title</code> 属性来设置标题, 默认情况下它是一个空字符串, 其中{" "}
        <code>body</code> 部分是 <code>Drawer</code> 组件的主区域,
        它包含了用户定义的主要内容. footer和title用法一致, 用来显示页脚信息. 当{" "}
        <code>Drawer</code> 打开时，默认设置是<strong>从右至左</strong>打开{" "}
        <strong>30%</strong> 浏览器宽度。你可以通过传入对应的 <code>direction</code>{" "}
        和 <code>size</code> 属性来修改这一默认行为。下面一个示例将展示如何使用{" "}
        <code>before-close</code> API，更多详细用法请参考页面底部的 API 部分。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <DrawerBasicUsage />
      </DemoBlock>

      <Heading level={2}>不添加 Title</Heading>
      <p>当你不需要标题的时候，你可以将它移除。</p>
      <p>
        通过设置 <code>with-header</code> 属性为 <strong>false</strong>{" "}
        来控制是否显示标题。如果你的应用需要具备可访问性，请务必设置好{" "}
        <code>title</code>。
      </p>
      <DemoBlock source={SOURCES.noTitle}>
        <DrawerNoTitle />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        像 <code>Dialog</code> 组件一样，<code>Drawer</code>{" "}
        也可以用来显示多种不同的交互。
      </p>
      <DemoBlock source={SOURCES.customizationContent}>
        <DrawerCustomizationContent />
      </DemoBlock>

      <Heading level={2}>自定义头部</Heading>
      <p>
        <code>header</code> 可用于自定义显示标题的区域。为了保持可用性，除了使用此插槽外，使用{" "}
        <code>title</code> 属性，或使用 <code>titleId</code>{" "}
        插槽属性来指定哪些元素应该读取为抽屉标题。
      </p>
      <DemoBlock source={SOURCES.customizationHeader}>
        <DrawerCustomizationHeader />
      </DemoBlock>

      <Heading level={2} id="可调整抽屉">
        可调整抽屉<span className="docs-version-tag">2.11.0</span>
      </Heading>
      <p>尝试拖动边缘部分。</p>
      <p>
        设置<code>resizable</code>属性为<code>true</code>以做到拖拽
      </p>
      <DemoBlock source={SOURCES.resizable}>
        <DrawerResizable />
      </DemoBlock>

      <Heading level={2}>嵌套抽屉</Heading>
      <p>
        你可以像 <code>Dialog</code> 一样拥有多层嵌套的 <code>Drawer</code>
      </p>
      <p>
        如果你需要在不同图层中多个抽屉，你必须设置{" "}
        <code>append-to-body</code> 属性到 <strong>true</strong>
      </p>
      <DemoBlock source={SOURCES.nestedDrawer}>
        <DrawerNestedDrawer />
      </DemoBlock>

      <Heading level={2}>模态框</Heading>
      <p>
        将 <code>modal</code> 设置为 <code>false</code>{" "}
        将隐藏抽屉的模态层（遮罩层）。
      </p>
      <p>
        从版本 <span className="docs-version-tag">2.11.7</span> 起，新增了{" "}
        <code>modal-penetrable</code> 属性，该属性可设置为“可穿透”。
      </p>
      <DemoBlock source={SOURCES.modal}>
        <DrawerModal />
      </DemoBlock>
      <DocsContent
        source={`:::tip

Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。 因此，如果需要执行 DOM 操作，或通过 \`ref\` 获取相应组件，请在 \`open\` 事件回调中进行。

:::`}
      />
      <DocsContent
        source={`:::tip

Drawer 提供了一个名为 \`destroy-on-close\` 的 API，这是一个标志变量，用于指示在 Drawer 关闭后是否销毁其中的子内容。 当你需要每次打开抽屉都要调用 \`mounted\` 生命周期时，可以使用此 API。

:::`}
      />

      <DocsContent source={API_MD} />
    </>
  );
}
