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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`icon\` 接收 Vue 组件 | \`icon\` 接收 ReactNode | 渲染进 \`.el-page-header__icon > .el-icon\` |
| 具名插槽 \`#breadcrumb\` 等 | \`breadcrumb\` / \`iconSlot\` 等同义 prop | React 惯用写法 |
| \`@back\` 事件 | \`onBack\` 回调 | 语义一致 |
| \`t('el.pageHeader.title')\` | 内置常量「返回」 | 项目无 i18n，直接取中文包的返回值 |

**实现说明**：DOM 结构与官方逐层一致（\`.el-page-header__header\` / \`__left\` /
\`__back\` / \`__icon\` / \`__title\` / \`__content\` / \`__extra\` / \`__main\`），
类名与状态类（\`is-contentful\`、\`--has-breadcrumb\`、\`--has-extra\`）按插槽是否存在条件渲染，
中间分隔线复用 ElDivider 的竖线形态。

**未实现的官方能力**：

- \`icon\` 的 \`Component\` 类型：官方接受 \`^[string]\` 之外的 Vue 组件对象，React 侧只接受 ReactNode，
  且未提供通过字符串名从图标库解析图标的能力。
- 国际化 \`el.pageHeader.title\`：官方经 \`useLocale\` 按语言包取默认标题，本项目固定为中文「返回」。
`;

export default function PageHeaderPage() {
  return (
    <>
      <h1>Page Header 页头</h1>
      <p>
        如果页面的路径比较简单，推荐使用页头组件而不是面包屑。
      </p>

      <Heading level={2}>完整示例</Heading>
      <p>页头包含面包屑、图标、标题、内容、右侧操作区与下方主内容。</p>
      <DemoBlock source={SOURCES.complete}>
        <PageHeaderComplete />
      </DemoBlock>

      <Heading level={2}>基础用法</Heading>
      <p>
        标准页头，适用于简单场景。通过 <code>onBack</code> 监听返回区点击。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <PageHeaderBasic />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>
        默认图标可能不满足需求，可通过 <code>icon</code> 传入自定义图标。
      </p>
      <DemoBlock source={SOURCES.customIcon}>
        <PageHeaderCustomIcon />
      </DemoBlock>

      <Heading level={2}>无图标</Heading>
      <p>
        有时页面元素很多，不想显示图标时，将 <code>icon</code> 设为 <code>&quot;&quot;</code> 即可。
      </p>
      <DemoBlock source={SOURCES.noIcon}>
        <PageHeaderNoIcon />
      </DemoBlock>

      <Heading level={2}>面包屑</Heading>
      <p>
        通过 <code>breadcrumb</code> 为页头添加面包屑，向用户提供路由信息。
      </p>
      <DemoBlock source={SOURCES.breadcrumb}>
        <PageHeaderBreadcrumb />
      </DemoBlock>

      <Heading level={2}>附加操作区</Heading>
      <p>
        页头可以按需扩展，通过 <code>extra</code> 添加额外的操作区，实现更丰富的交互。
      </p>
      <DemoBlock source={SOURCES.additionalSections}>
        <PageHeaderAdditionalSections />
      </DemoBlock>

      <Heading level={2}>主体内容</Heading>
      <p>
        有时希望页头下方展示相应内容，可使用 <code>children</code>（对应官方 default 插槽）。
      </p>
      <DemoBlock source={SOURCES.mainContent}>
        <PageHeaderMainContent />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
