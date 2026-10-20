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
      <p>有些对话框要提供额外的操作，但保留当前页面状态，Drawer 就是这样的组件。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>visible</code> 控制显示；<code>direction</code> 支持四个方向，
        <code>beforeClose</code> 可以拦截关闭。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <DrawerBasicUsage />
      </DemoBlock>

      <Heading level={2}>无标题</Heading>
      <p>
        设置 <code>withHeader</code> 为 <code>false</code> 可以移除头部区域。
      </p>
      <DemoBlock source={SOURCES.noTitle}>
        <DrawerNoTitle />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        抽屉内可以放置表格、表单等任意内容。
      </p>
      <DemoBlock source={SOURCES.customizationContent}>
        <DrawerCustomizationContent />
      </DemoBlock>

      <Heading level={2}>自定义头部</Heading>
      <p>
        <code>header</code> 渲染函数接收 <code>close</code>、<code>titleId</code>、
        <code>titleClass</code>，可自由排布头部。
      </p>
      <DemoBlock source={SOURCES.customizationHeader}>
        <DrawerCustomizationHeader />
      </DemoBlock>

      <Heading level={2}>可调整尺寸</Heading>
      <p>
        设置 <code>resizable</code> 后可通过边缘手柄拖拽调整尺寸。
      </p>
      <DemoBlock source={SOURCES.resizable}>
        <DrawerResizable />
      </DemoBlock>

      <Heading level={2}>嵌套抽屉</Heading>
      <p>
        内层抽屉建议设置 <code>appendToBody</code>，避免层级与焦点问题。
      </p>
      <DemoBlock source={SOURCES.nestedDrawer}>
        <DrawerNestedDrawer />
      </DemoBlock>

      <Heading level={2}>遮罩</Heading>
      <p>
        <code>modal</code> 控制遮罩显示；配合 <code>modalPenetrable</code>
        可以让点击穿透到页面。
      </p>
      <DemoBlock source={SOURCES.modal}>
        <DrawerModal />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
