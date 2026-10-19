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
  basic: `<ElEmpty />
<ElEmpty description="自定义描述文字" />`,

  size: `<ElEmpty imageSize={80} />
<ElEmpty imageSize={140} />
<ElEmpty imageSize="10rem" />`,

  bottom: `<ElEmpty description="暂无内容，请先创建">
  <ElButton type="primary">立即创建</ElButton>
</ElEmpty>`,

  customImage: `<ElEmpty image="/custom.svg" description="使用自定义插图" />`,
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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="image">\` | \`image\` 属性 | 传地址字符串 |
| 默认描述取自 \`useLocale\` | 固定「暂无数据」 | 未引入多语言，可用 \`description\` 覆盖 |

**实现说明**：内置插图复刻自官方 \`img-empty.vue\`，路径坐标逐值一致，
配色走 \`--el-empty-fill-color-1\` 到 \`--el-empty-fill-color-9\` 九个变量，
因此自动跟随明暗主题。渐变与 rect 的 \`id\` 用 \`useId\` 生成，
避免同页多个 Empty 的 \`id\` 冲突导致配色错乱。
`;

export default function EmptyPage() {
  return (
    <>
      <h1>Empty 空状态</h1>
      <p>空状态时的展示占位图。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>description</code> 属性设置描述文字。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <EmptyBasic />
      </DemoBlock>

      <Heading level={2}>自定义尺寸</Heading>
      <p>
        通过 <code>imageSize</code> 属性设置插图宽度，数字按 px 处理。
      </p>
      <DemoBlock source={SOURCES.size}>
        <EmptySize />
      </DemoBlock>

      <Heading level={2}>底部内容</Heading>
      <p>
        传入 <code>children</code> 会在底部渲染操作区。
      </p>
      <DemoBlock source={SOURCES.bottom}>
        <EmptyBottom />
      </DemoBlock>

      <Heading level={2}>自定义插图</Heading>
      <p>
        通过 <code>image</code> 属性传入自定义插图地址。
      </p>
      <DemoBlock source={SOURCES.customImage}>
        <EmptyCustomImage />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
