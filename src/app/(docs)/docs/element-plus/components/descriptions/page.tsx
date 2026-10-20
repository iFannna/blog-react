import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  DescriptionsBasic,
  DescriptionsCustomStyle,
  DescriptionsRowspan,
  DescriptionsSizes,
  DescriptionsVertical,
} from "@/components/element-plus/examples/descriptions";

export const metadata: Metadata = { title: "Descriptions 描述列表" };

const SOURCES = {
  basic: `<ElDescriptions title="User Info">
  <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
  <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
  <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
  <ElDescriptionsItem label="Remarks">
    <ElTag size="small">School</ElTag>
  </ElDescriptionsItem>
  <ElDescriptionsItem label="Address">
    No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
  </ElDescriptionsItem>
</ElDescriptions>`,

  sizes: `<ElRadioGroup value={size} onChange={setSize}>
  <ElRadio value="large" label="Large" />
  <ElRadio value="default" label="Default" />
  <ElRadio value="small" label="Small" />
</ElRadioGroup>

<ElDescriptions
  title="With border"
  column={3}
  size={size}
  border
  extra={<ElButton type="primary">Operation</ElButton>}
>
  <ElDescriptionsItem label={iconLabel(<User />, "Username", size)}>
    kooriookami
  </ElDescriptionsItem>
  {/* Telephone / Place / Remarks / Address 同上 */}
</ElDescriptions>

<ElDescriptions
  title="Without border"
  column={3}
  size={size}
  extra={<ElButton type="primary">Operation</ElButton>}
>
  <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
  <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
  <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
  <ElDescriptionsItem label="Remarks">
    <ElTag size="small">School</ElTag>
  </ElDescriptionsItem>
  <ElDescriptionsItem label="Address">
    No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
  </ElDescriptionsItem>
</ElDescriptions>`,

  vertical: `<ElRadioGroup value={size} onChange={setSize}>
  <ElRadio value="large" label="Large" />
  <ElRadio value="default" label="Default" />
  <ElRadio value="small" label="Small" />
</ElRadioGroup>

<ElDescriptions
  title="Vertical list with border"
  direction="vertical"
  column={4}
  size={size}
  border
>
  <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
  <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
  <ElDescriptionsItem label="Place" span={2}>Suzhou</ElDescriptionsItem>
  <ElDescriptionsItem label="Remarks">
    <ElTag size="small">School</ElTag>
  </ElDescriptionsItem>
  <ElDescriptionsItem label="Address">
    No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
  </ElDescriptionsItem>
</ElDescriptions>

<ElDescriptions
  title="Vertical list without border"
  direction="vertical"
  column={4}
  size={size}
>
  {/* 同上 */}
</ElDescriptions>`,

  rowspan: `<ElDescriptions title="Width horizontal list" border>
  <ElDescriptionsItem rowspan={2} width={140} label="Photo" align="center">
    <ElImage
      src={avatarUrl}
      style={{ width: 100, height: 100 }}
      fit="fill"
    />
  </ElDescriptionsItem>
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

<ElDescriptions title="Width vertical list" direction="vertical" border>
  {/* 同样的 Photo + 5 个字段，direction 改为 vertical */}
</ElDescriptions>`,

  customStyle: `<ElDescriptions title="Customized style list" column={3} border>
  <ElDescriptionsItem
    label="Username"
    labelAlign="right"
    align="center"
    labelClassName={styles.myLabel}
    className={styles.myContent}
    width="150px"
  >
    kooriookami
  </ElDescriptionsItem>
  <ElDescriptionsItem label="Telephone" labelAlign="right" align="center">
    18100000000
  </ElDescriptionsItem>
  <ElDescriptionsItem label="Place" labelAlign="right" align="center">
    Suzhou
  </ElDescriptionsItem>
  <ElDescriptionsItem label="Remarks" labelAlign="right" align="center">
    <ElTag size="small">School</ElTag>
  </ElDescriptionsItem>
  <ElDescriptionsItem label="Address" labelAlign="right" align="center">
    No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
  </ElDescriptionsItem>
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

      <Heading level={2} id="单元格跨行">
        单元格跨行 <span className="docs-version-tag">2.8.1</span>
      </Heading>
      <DemoBlock source={SOURCES.rowspan}>
        <DescriptionsRowspan />
      </DemoBlock>

      <Heading level={2}>自定义样式</Heading>
      <DemoBlock source={SOURCES.customStyle}>
        <DescriptionsCustomStyle />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
