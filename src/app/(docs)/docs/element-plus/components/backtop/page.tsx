import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import { BacktopBasic, BacktopCustom } from "@/components/element-plus/examples/backtop";

export const metadata: Metadata = { title: "Backtop 回到顶部" };

const SOURCES = {
  basic: `// 向下滚动页面即可看到右下角按钮
<ElBacktop />`,

  custom: `<ElBacktop right={80} bottom={80}>
  <ElIcon style={{ fontSize: 20 }}>
    <Star />
  </ElIcon>
</ElBacktop>`,
};

const API_MD = `
## Backtop API

### Backtop Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 触发滚动的容器选择器，省略时为文档 | ^[string] | — |
| visibility-height | 滚动距离达到该值后显示按钮 | ^[number] | 200 |
| right | 距右侧距离 | ^[number] / ^[string] | 40 |
| bottom | 距底部距离 | ^[number] / ^[string] | 40 |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Backtop Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClick | 点击时触发 | ^[Function]\`(event: MouseEvent) => void\` |

### Backtop Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义内容 | \`children\` |
`;

export default function BacktopPage() {
  return (
    <>
      <h1>Backtop 回到顶部</h1>
      <p>返回页面顶部的操作按钮。</p>

      <Heading level={2}>基础用法</Heading>
      <p>通过滑动来查看容器右下角的按钮。</p>
      <DemoBlock source={SOURCES.basic}>
        <BacktopBasic />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        显示区域被固定为 40px * 40px 的区域，其中的内容可支持自定义。
      </p>
      <DemoBlock source={SOURCES.custom}>
        <BacktopCustom />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
