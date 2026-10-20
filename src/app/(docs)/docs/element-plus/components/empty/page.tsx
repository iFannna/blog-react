import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  EmptyBasic,
  EmptyBottom,
  EmptyCustomImage,
  EmptySize,
} from "@/components/element-plus/examples/empty-result";

export const metadata: Metadata = {
  title: "Empty 空状态",
};

const SOURCES = {
  basic: `<ElEmpty description="description" />`,

  customImage: `<ElEmpty image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" />`,

  size: `<ElEmpty imageSize={200} />`,

  bottom: `<ElEmpty>
  <ElButton type="primary">Button</ElButton>
</ElEmpty>`,
};

const API_MD = `
## Empty API

### Empty Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| image | 自定义插图地址，不传时使用内置空状态图 | ^[string] | — |
| image-size | 插图宽度 | ^[number] / ^[string] | — |
| description | 描述文字 | ^[string] / ^[ReactNode] | 暂无数据 |

### Empty Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 底部内容，通常放操作按钮 | \`children\` |
| image | 自定义插图 | \`image\` 属性 |
| description | 自定义描述 | \`description\` 属性 |

`;

export default function EmptyPage() {
  return (
    <>
      <h1>Empty 空状态</h1>
      <p>空状态时的占位提示。</p>

      <Heading level={2}>基础用法</Heading>
      <DemoBlock source={SOURCES.basic}>
        <EmptyBasic />
      </DemoBlock>

      <Heading level={2}>自定义图片</Heading>
      <p>
        通过设置 <code>image</code> 属性传入图片 URL。
      </p>
      <DemoBlock source={SOURCES.customImage}>
        <EmptyCustomImage />
      </DemoBlock>

      <Heading level={2}>图片尺寸</Heading>
      <p>
        通过使用 <code>image-size</code> 属性来控制图片大小。
      </p>
      <DemoBlock source={SOURCES.size}>
        <EmptySize />
      </DemoBlock>

      <Heading level={2}>底部内容</Heading>
      <p>使用默认插槽可在底部插入内容。</p>
      <DemoBlock source={SOURCES.bottom}>
        <EmptyBottom />
      </DemoBlock>

      <DocsContent
        source={`## 自定义样式

您可以为empty组件设置自定义样式。使用 \`css/scss\` 语言来更改全局或局部颜色。我们设置了一些全局颜色变量：\`--el-empty-fill-color-0\`、\`--el-empty-fill-color-1\`、\`--el-empty-fill-color-2\`、……、\`--el-empty-fill-color-9\`。您可以使用类似 \`:root { --el-empty-fill-color-0: red; --el-empty-fill-color-1: blue; }\` 等变量。但通常，如果你想要更改样式，你需要更改所有颜色，因为这些颜色是一个组合。

### 默认变量

| 变量 | 颜色 |
| --- | --- |
| --el-empty-fill-color-0 | var(--el-color-white) |
| --el-empty-fill-color-1 | #fcfcfd |
| --el-empty-fill-color-2 | #f8f9fb |
| --el-empty-fill-color-3 | #f7f8fc |
| --el-empty-fill-color-4 | #eeeff3 |
| --el-empty-fill-color-5 | #edeef2 |
| --el-empty-fill-color-6 | #e9ebef |
| --el-empty-fill-color-7 | #e5e7e9 |
| --el-empty-fill-color-8 | #e0e3e9 |
| --el-empty-fill-color-9 | #d5d7de |`}
      />

      <DocsContent source={API_MD} />
    </>
  );
}
