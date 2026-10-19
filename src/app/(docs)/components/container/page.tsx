import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  ContainerAside,
  ContainerAsideMain,
  ContainerAsideWithFooter,
  ContainerBasic,
  ContainerExample,
  ContainerHeaderAside,
  ContainerHeaderMain,
  ContainerNested,
} from "@/components/docs/examples/container";

export const metadata: Metadata = { title: "Container 布局容器" };

const SOURCES = {
  headerMain: `<ElContainer>
  <ElHeader>Header</ElHeader>
  <ElMain>Main</ElMain>
</ElContainer>`,

  headerMainFooter: `<ElContainer>
  <ElHeader>Header</ElHeader>
  <ElMain>Main</ElMain>
  <ElFooter>Footer</ElFooter>
</ElContainer>`,

  asideMain: `<ElContainer>
  <ElAside width="200px">Aside</ElAside>
  <ElMain>Main</ElMain>
  <ElAside width="200px">Aside</ElAside>
</ElContainer>`,

  asideHeaderMain: `<ElContainer>
  <ElAside width="200px">Aside</ElAside>
  <ElContainer>
    <ElHeader>Header</ElHeader>
    <ElMain>Main</ElMain>
  </ElContainer>
</ElContainer>`,

  asideHeaderMainFooter: `<ElContainer>
  <ElAside width="200px">Aside</ElAside>
  <ElContainer>
    <ElHeader>Header</ElHeader>
    <ElMain>Main</ElMain>
    <ElFooter>Footer</ElFooter>
  </ElContainer>
</ElContainer>`,

  headerAsideMain: `<ElContainer>
  <ElHeader>Header</ElHeader>
  <ElContainer>
    <ElAside width="200px">Aside</ElAside>
    <ElMain>Main</ElMain>
  </ElContainer>
</ElContainer>`,

  headerAsideMainFooter: `<ElContainer>
  <ElHeader>Header</ElHeader>
  <ElContainer>
    <ElAside width="200px">Aside</ElAside>
    <ElContainer>
      <ElMain>Main</ElMain>
      <ElFooter>Footer</ElFooter>
    </ElContainer>
  </ElContainer>
</ElContainer>`,

  example: `<ElContainer style={{ height: 500 }}>
  <ElAside width="200px">
    <ElScrollbar>
      <ElMenu defaultOpeneds={["1", "3"]}>
        <ElSubMenu index="1" title={<><ElIcon><Message /></ElIcon>Navigator One</>}>
          <ElMenuItemGroup title="Group 1">
            <ElMenuItem index="1-1">Option 1</ElMenuItem>
            <ElMenuItem index="1-2">Option 2</ElMenuItem>
          </ElMenuItemGroup>
          <ElMenuItemGroup title="Group 2">
            <ElMenuItem index="1-3">Option 3</ElMenuItem>
          </ElMenuItemGroup>
        </ElSubMenu>
        <ElSubMenu index="2" title="Navigator Two">...</ElSubMenu>
        <ElSubMenu index="3" title="Navigator Three">...</ElSubMenu>
      </ElMenu>
    </ElScrollbar>
  </ElAside>

  <ElContainer>
    <ElHeader style={{ justifyContent: "flex-end", fontSize: 12 }}>
      <ElDropdown menu={<ElDropdownMenu>...</ElDropdownMenu>}>
        <ElIcon><Setting /></ElIcon>
      </ElDropdown>
      <span>Tom</span>
    </ElHeader>
    <ElMain style={{ padding: 0 }}>
      <ElScrollbar>
        <ElTable data={tableData}>
          <ElTableColumn prop="date" label="Date" width={140} />
          <ElTableColumn prop="name" label="Name" width={120} />
          <ElTableColumn prop="address" label="Address" />
        </ElTable>
      </ElScrollbar>
    </ElMain>
  </ElContainer>
</ElContainer>`,
};

const API_MD = `
## Container API

### Container Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 布局方向。不传时根据是否含 Aside 自动判断 | ^[enum]\`'horizontal' \\| 'vertical'\` | — |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Container Events

无。

### Container Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 容器内容 | \`children\` |

### Header Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 顶栏高度 | ^[string] | 60px |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Aside Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 侧边栏宽度 | ^[string] | 300px |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Main Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Footer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 底栏高度 | ^[string] | 60px |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Slots

Header / Aside / Main / Footer 均只有默认插槽，React 侧对应 \`children\`。

### Exposes

无。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 遍历子 vnode 类名检测 Aside | Aside 通过 context 主动注册 | 行为一致，React 侧更可靠 |
| 任意 HTML 属性透传 | 仅 \`className\` / \`style\` | React 组件显式声明 props |
| 根标签 \`section / header / aside / main / footer\` | 相同 | 结构一致 |

**实现说明**：官方通过遍历子 vnode 的类名判断是否存在 \`el-aside\`，
从而决定默认布局方向。React 里函数组件的 \`props.className\` 拿不到组件内部
拼好的类名，因此改为由 \`ElAside\` 挂载时通过 context **主动注册**：

- 显式传 \`direction\` 时以它为准
- 未传且直接子级含 Aside 时横向布局（Aside 在左、Main 在右）
- 未传且不含 Aside 时纵向堆叠
- 嵌套容器各自独立判断方向，与官方示例的七种布局一致
`;

export default function ContainerPage() {
  return (
    <>
      <h1>Container 布局容器</h1>
      <p>用于布局的容器组件，方便快速搭建页面的基本结构。</p>

      <Heading level={2}>上中</Heading>
      <p>
        <code>ElHeader</code> 与 <code>ElMain</code> 组合，容器自动纵向排列。
      </p>
      <DemoBlock source={SOURCES.headerMain}>
        <ContainerHeaderMain />
      </DemoBlock>

      <Heading level={2}>上中下</Heading>
      <p>
        再加入 <code>ElFooter</code>。
      </p>
      <DemoBlock source={SOURCES.headerMainFooter}>
        <ContainerBasic />
      </DemoBlock>

      <Heading level={2}>左右</Heading>
      <p>
        容器直接包含 <code>ElAside</code> 时自动横向排列，可同时放置两侧边栏。
      </p>
      <DemoBlock source={SOURCES.asideMain}>
        <ContainerAsideMain />
      </DemoBlock>

      <Heading level={2}>左侧边栏 + 上中</Heading>
      <p>外层横向，内层再嵌套上下结构。</p>
      <DemoBlock source={SOURCES.asideHeaderMain}>
        <ContainerAside />
      </DemoBlock>

      <Heading level={2}>左侧边栏 + 上中下</Heading>
      <DemoBlock source={SOURCES.asideHeaderMainFooter}>
        <ContainerAsideWithFooter />
      </DemoBlock>

      <Heading level={2}>上 + 左侧边栏 + 中</Heading>
      <DemoBlock source={SOURCES.headerAsideMain}>
        <ContainerHeaderAside />
      </DemoBlock>

      <Heading level={2}>上 + 左侧边栏 + 中下</Heading>
      <DemoBlock source={SOURCES.headerAsideMainFooter}>
        <ContainerNested />
      </DemoBlock>

      <Heading level={2}>完整布局</Heading>
      <p>
        侧边菜单、顶栏与内容区组合的完整应用布局，内容区可滚动。
      </p>
      <DemoBlock source={SOURCES.example}>
        <ContainerExample />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
