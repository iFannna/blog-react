import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import { BreadcrumbBasic, BreadcrumbIcon } from "@/components/element-plus/examples/nav";

export const metadata: Metadata = { title: "Breadcrumb 面包屑" };

const SOURCES = {
  basic: `<ElBreadcrumb separator="/">
  <ElBreadcrumbItem>首页</ElBreadcrumbItem>
  <ElBreadcrumbItem>活动管理</ElBreadcrumbItem>
  <ElBreadcrumbItem>活动列表</ElBreadcrumbItem>
  <ElBreadcrumbItem>活动详情</ElBreadcrumbItem>
</ElBreadcrumb>`,

  icon: `<ElBreadcrumb separatorIcon={<ArrowRight />}>
  <ElBreadcrumbItem to="/">首页</ElBreadcrumbItem>
  <ElBreadcrumbItem to="/list">活动管理</ElBreadcrumbItem>
  <ElBreadcrumbItem>活动详情</ElBreadcrumbItem>
</ElBreadcrumb>`,
};

const API_MD = `
## Breadcrumb API

### Breadcrumb Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| separator | 分隔符 | ^[string] | / |
| separator-icon | 图标分隔符，传入后忽略 separator | ^[Component] | — |

### BreadcrumbItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| to | 路由跳转目标，传入后 inner 显示为链接样式 | ^[string] | — |
| replace | to 模式下是否 replace | ^[boolean] | false |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`to\` 走 vue-router | \`to\` 仅控制样式与 role | React 侧跳转请用 Next 的 Link 自行包裹 |
| \`<slot>\` | \`children\` | — |

**实现说明**：分隔符与图标从父级 context 读取；
有 \`to\` 时 inner 加 \`is-link\` 类，与官方一致。
`;

export default function BreadcrumbPage() {
  return (
    <>
      <h1>Breadcrumb 面包屑</h1>
      <p>显示当前页面的路径，快速返回之前的页面。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>separator</code> 设置分隔符，默认 <code>/</code>。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <BreadcrumbBasic />
      </DemoBlock>

      <Heading level={2}>图标分隔符</Heading>
      <p>
        通过 <code>separatorIcon</code> 设置图标分隔符；
        传入 <code>to</code> 的项会显示为链接样式。
      </p>
      <DemoBlock source={SOURCES.icon}>
        <BreadcrumbIcon />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
