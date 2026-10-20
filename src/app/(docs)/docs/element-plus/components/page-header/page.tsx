import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  PageHeaderAdditionalSections,
  PageHeaderBasic,
  PageHeaderBreadcrumb,
  PageHeaderComplete,
  PageHeaderCustomIcon,
  PageHeaderMainContent,
  PageHeaderNoIcon,
} from "@/components/element-plus/examples/page-header";

export const metadata: Metadata = { title: "Page Header 页头" };

const SOURCES = {
  complete: `<div aria-label="A complete example of page header">
  <ElPageHeader
    onBack={() => notification("Back")}
    breadcrumb={
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem to="./page-header.html">homepage</ElBreadcrumbItem>
        <ElBreadcrumbItem>
          <a href="./page-header.html">route 1</a>
        </ElBreadcrumbItem>
        <ElBreadcrumbItem>route 2</ElBreadcrumbItem>
      </ElBreadcrumb>
    }
    contentSlot={
      <div style={flexRow}>
        <ElAvatar size={32} src={AVATAR_IMG} style={{ marginRight: 12 }} />
        <span style={titleStyle}>Title</span>
        <span style={subtitleStyle}>Sub title</span>
        <ElTag>Default</ElTag>
      </div>
    }
    extra={
      <div style={flexRow}>
        <ElButton>Print</ElButton>
        <ElButton type="primary" style={{ marginLeft: 8 }}>Edit</ElButton>
      </div>
    }
  >
    <ElDescriptions column={3} size="small" style={{ marginTop: 16 }}>
      <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
      <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
      <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
      <ElDescriptionsItem label="Remarks">
        <ElTag size="small">School</ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Address">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </ElDescriptionsItem>
    </ElDescriptions>
    <p style={mainStyle}>
      Element Plus team uses <b>weekly</b> release strategy ...
    </p>
  </ElPageHeader>
</div>`,

  basic: `<ElPageHeader
  onBack={() => console.log("go back")}
  contentSlot={<span style={titleStyle}>Title</span>}
/>`,

  customIcon: `<ElPageHeader
  icon={<ArrowLeft />}
  contentSlot={<span style={titleStyle}>Title</span>}
/>`,

  noIcon: `<ElPageHeader icon="" contentSlot={<span style={titleStyle}>Title</span>} />`,

  breadcrumb: `<ElPageHeader
  contentSlot={<span style={titleStyle}>Title</span>}
  breadcrumb={
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem to="./page-header.html">homepage</ElBreadcrumbItem>
      <ElBreadcrumbItem>
        <a href="./page-header.html">route 1</a>
      </ElBreadcrumbItem>
      <ElBreadcrumbItem>route 2</ElBreadcrumbItem>
    </ElBreadcrumb>
  }
/>`,

  additionalSections: `<ElPageHeader
  icon=""
  contentSlot={
    <div style={flexRow}>
      <ElAvatar size={32} src={AVATAR_IMG} style={{ marginRight: 12 }} />
      <span style={titleStyle}>Title</span>
      <span style={subtitleStyle}>Sub title</span>
      <ElTag>Default</ElTag>
    </div>
  }
  extra={
    <div style={flexRow}>
      <ElButton>Print</ElButton>
      <ElButton type="primary" style={{ marginLeft: 8 }}>Edit</ElButton>
    </div>
  }
/>`,

  mainContent: `<ElPageHeader contentSlot={<span style={titleStyle}>Title</span>}>
  <div style={mainStyle}>
    Your additional content can be added with default slot, You may put as many
    content as you want here.
  </div>
</ElPageHeader>`,
};

const API_MD = `
## PageHeader API

### PageHeader Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 页头图标，传 \`""\` 可隐藏图标 | ^[ReactNode] | 内置 Back 箭头 |
| title | 主标题；省略时回退到内置返回文案 | ^[string] | \`''\` |
| content | 标题右侧内容 | ^[string] | \`''\` |
| className / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### PageHeader Slot Props（对应官方 Slots）

React 无具名插槽，官方每个插槽对应一个同义 prop：

| Prop | 对应官方插槽 | 说明 |
| --- | --- | --- |
| breadcrumb | \`#breadcrumb\` | 第一行面包屑，渲染 \`.el-page-header__breadcrumb\` 并加 \`.el-page-header--has-breadcrumb\` |
| iconSlot | \`#icon\` | 自定义图标内容，替换默认图标（不再额外包 \`.el-icon\`） |
| titleSlot | \`#title\` | 主标题内容 |
| contentSlot | \`#content\` | 标题右侧内容 |
| extra | \`#extra\` | 右侧操作区，加 \`.el-page-header--has-extra\` |
| children | \`#default\` | 头部下方主内容，加 \`.is-contentful\` 与 \`.el-page-header__main\` |

### PageHeader Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onBack | 点击左侧返回区时触发 | ^[Function]\`() => void\` |
`;

export default function PageHeaderPage() {
  return (
    <>
      <h1>Page Header 页头</h1>
      <p>
        如果页面的路径比较简单，推荐使用页头组件而非面包屑组件。
      </p>

      <Heading level={2}>完整示例</Heading>
      <DemoBlock source={SOURCES.complete}>
        <PageHeaderComplete />
      </DemoBlock>

      <Heading level={2}>基础用法</Heading>
      <p>简单场景下的标准页头。</p>
      <DemoBlock source={SOURCES.basic}>
        <PageHeaderBasic />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>
        默认图标可能无法满足您的需求，您可以通过设置<code>icon</code>属性来自定义图标，示例如下。
      </p>
      <DemoBlock source={SOURCES.customIcon}>
        <PageHeaderCustomIcon />
      </DemoBlock>

      <Heading level={2}>无图标</Heading>
      <p>
        有时，页面全是元素，您可能不想展示页面上方的图标，您可以设置<code>icon</code>属性值为<code>&quot;&quot;</code>来去除它。
      </p>
      <DemoBlock source={SOURCES.noIcon}>
        <PageHeaderNoIcon />
      </DemoBlock>

      <Heading level={2}>面包屑导航</Heading>
      <p>
        使用页头组件，您可以通过添加插槽 <code>breadcrumb</code>{" "}
        来设置面包屑路由导航。
      </p>
      <DemoBlock source={SOURCES.breadcrumb}>
        <PageHeaderBreadcrumb />
      </DemoBlock>

      <Heading level={2}>额外操作部分</Heading>
      <p>
        头部可能会变得很复杂，您可以在头部添加更多的区块，以允许丰富的交互。
      </p>
      <DemoBlock source={SOURCES.additionalSections}>
        <PageHeaderAdditionalSections />
      </DemoBlock>

      <Heading level={2}>主要内容</Heading>
      <p>
        有时我们想让页头显示一些协同响应内容，我们可以使用 <code>default</code>{" "}
        插槽。
      </p>
      <DemoBlock source={SOURCES.mainContent}>
        <PageHeaderMainContent />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
