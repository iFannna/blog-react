import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  DescriptionsBasic,
  DescriptionsCustomStyle,
  DescriptionsRowspan,
  DescriptionsSizes,
  DescriptionsVertical,
} from "@/components/docs/examples/descriptions";

export const metadata: Metadata = { title: "Descriptions 描述列表" };

const SOURCES = {
  basic: `<ElDescriptions title="用户信息" extra={<ElButton size="small">操作</ElButton>}>
  <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
  <ElDescriptionsItem label="手机号">18100000000</ElDescriptionsItem>
  <ElDescriptionsItem label="居住地">苏州市</ElDescriptionsItem>
  <ElDescriptionsItem label="备注">学校</ElDescriptionsItem>
  <ElDescriptionsItem label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</ElDescriptionsItem>
</ElDescriptions>`,

  sizes: `<ElDescriptions title="large" border size="large">
  <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
</ElDescriptions>

<ElDescriptions title="default" border size="default" />
<ElDescriptions title="small" border size="small" />`,

  vertical: `<ElDescriptions title="垂直列表" direction="vertical" border>
  <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
  <ElDescriptionsItem label="手机号">18100000000</ElDescriptionsItem>
  <ElDescriptionsItem label="居住地">苏州市</ElDescriptionsItem>
  <ElDescriptionsItem label="备注"><ElButton size="small">编辑</ElButton></ElDescriptionsItem>
  <ElDescriptionsItem label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</ElDescriptionsItem>
</ElDescriptions>`,

  rowspan: `<ElDescriptions border>
  <ElDescriptionsItem label="产品">云服务</ElDescriptionsItem>
  <ElDescriptionsItem label="备注" span={2}>跨两列</ElDescriptionsItem>
  <ElDescriptionsItem label="地域">华东</ElDescriptionsItem>
</ElDescriptions>`,

  customStyle: `<ElDescriptions title="自定义样式" border column={3} labelWidth="120px">
  <ElDescriptionsItem label="用户名" align="center">kooriookami</ElDescriptionsItem>
  <ElDescriptionsItem label="备注" labelAlign="right">学校</ElDescriptionsItem>
</ElDescriptions>`,
};

const API_MD = `
## Descriptions API

### Descriptions Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| border | 是否带边框 | ^[boolean] | false |
| column | 一行显示几列 | ^[number] | 3 |
| direction | 排列方向 | ^[enum]\`'vertical' \\| 'horizontal'\` | horizontal |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| title | 标题，显示在左上角 | ^[ReactNode] | '' |
| extra | 操作区，显示在右上角 | ^[ReactNode] | '' |
| label-width | 标签宽度 | ^[string] / ^[number] | — |

### Descriptions Slots

| 插槽名 | 说明 | React 写法 | 子标签 |
| --- | --- | --- | --- |
| default | 自定义内容 | \`children\` | DescriptionsItem |
| title | 自定义标题 | \`title\` | — |
| extra | 自定义操作区 | \`extra\` | — |

## DescriptionsItem API

### DescriptionsItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本 | ^[ReactNode] | '' |
| span | 占的列数 | ^[number] | 1 |
| rowspan | 占的行数 | ^[number] | 1 |
| width | 列宽 | ^[string] / ^[number] | '' |
| min-width | 列最小宽度 | ^[string] / ^[number] | '' |
| label-width | 标签宽度，优先级高于 Descriptions 的 label-width | ^[string] / ^[number] | — |
| align | 内容对齐（无边框时对标签与内容同时生效） | ^[enum]\`'left' \\| 'center' \\| 'right'\` | left |
| label-align | 标签对齐，省略时跟随 align | ^[enum]\`'left' \\| 'center' \\| 'right'\` | — |
| class-name | 内容自定义类名 | ^[string] | '' |
| label-class-name | 标签自定义类名 | ^[string] | '' |

### DescriptionsItem Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义内容 | \`children\` |
| label | 自定义标签 | \`label\` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<template #title>\` | \`title\` 属性 | 传节点 |
| \`<el-descriptions-item>\` | \`ElDescriptionsItem\` | 子项按 column 自动分行 |

**实现说明**：渲染规则与官方 descriptions-row / descriptions-cell 一致；
horizontal + border 时内容的 colSpan 为 \`span * 2 - 1\`；最后一行不足时用 span 撑满。
`;

export default function DescriptionsPage() {
  return (
    <>
      <h1>Descriptions 描述列表</h1>
      <p>列表形式展示多个字段。</p>

      <Heading level={2}>基础用法</Heading>
      <DemoBlock source={SOURCES.basic}>
        <DescriptionsBasic />
      </DemoBlock>

      <Heading level={2}>不同尺寸</Heading>
      <DemoBlock source={SOURCES.sizes}>
        <DescriptionsSizes />
      </DemoBlock>

      <Heading level={2}>垂直列表</Heading>
      <DemoBlock source={SOURCES.vertical}>
        <DescriptionsVertical />
      </DemoBlock>

      <Heading level={2}>跨列 / 跨行</Heading>
      <p>
        通过 <code>span</code> 让单元格跨列，<code>rowspan</code> 跨行。
      </p>
      <DemoBlock source={SOURCES.rowspan}>
        <DescriptionsRowspan />
      </DemoBlock>

      <Heading level={2}>自定义样式</Heading>
      <p>
        通过 <code>labelWidth</code>、<code>align</code>、<code>labelAlign</code>
        调整标签宽度与对齐方式。
      </p>
      <DemoBlock source={SOURCES.customStyle}>
        <DescriptionsCustomStyle />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
