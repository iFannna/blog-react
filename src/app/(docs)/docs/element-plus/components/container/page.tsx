import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ContainerAside,
  ContainerAsideMain,
  ContainerAsideWithFooter,
  ContainerBasic,
  ContainerExample,
  ContainerHeaderAside,
  ContainerHeaderMain,
  ContainerNested,
} from "@/components/element-plus/examples/container";

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

`;

export default function ContainerPage() {
  return (
    <>
      <h1>Container 布局容器</h1>
      <p>用于布局的容器组件，方便快速搭建页面的基本结构：</p>
      <p>
        <code>&lt;el-container&gt;</code>：外层容器。当子元素中包含{" "}
        <code>&lt;el-header&gt;</code> 或 <code>&lt;el-footer&gt;</code>{" "}
        时，全部子元素会垂直上下排列，否则会水平左右排列。
      </p>
      <p>
        <code>&lt;el-header&gt;</code>：顶栏容器。
      </p>
      <p>
        <code>&lt;el-aside&gt;</code>：侧边栏容器。
      </p>
      <p>
        <code>&lt;el-main&gt;</code>：主要区域容器。
      </p>
      <p>
        <code>&lt;el-footer&gt;</code>：底栏容器。
      </p>

      <DocsContent
        source={`:::tip

以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外， \`<el-container>\`的直接子元素必须是后四个组件中的一个或多个。后四个组件的父元素必须是一个 \`<el-container>\`

:::`}
      />

      <Heading level={2}>常见页面布局</Heading>
      <DemoBlock source={SOURCES.headerMain}>
        <ContainerHeaderMain />
      </DemoBlock>

      <DemoBlock source={SOURCES.headerMainFooter}>
        <ContainerBasic />
      </DemoBlock>

      <DemoBlock source={SOURCES.asideMain}>
        <ContainerAsideMain />
      </DemoBlock>

      <DemoBlock source={SOURCES.asideHeaderMain}>
        <ContainerAside />
      </DemoBlock>

      <DemoBlock source={SOURCES.asideHeaderMainFooter}>
        <ContainerAsideWithFooter />
      </DemoBlock>

      <DemoBlock source={SOURCES.headerAsideMain}>
        <ContainerHeaderAside />
      </DemoBlock>

      <DemoBlock source={SOURCES.headerAsideMainFooter}>
        <ContainerNested />
      </DemoBlock>

      <Heading level={2}>例子</Heading>
      <DemoBlock source={SOURCES.example}>
        <ContainerExample />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
