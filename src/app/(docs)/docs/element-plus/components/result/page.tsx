import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ResultBasic,
  ResultCustomIcon,
} from "@/components/element-plus/examples/empty-result";

export const metadata: Metadata = {
  title: "Result 结果",
};

const SOURCES = {
  basic: `<ElRow>
  <ElCol sm={12} lg={6} xl={4}>
    <ElResult
      icon="primary"
      title="Primary Tip"
      subTitle="Please follow the instructions"
      extra={<ElButton type="primary">Back</ElButton>}
    />
  </ElCol>
  <ElCol sm={12} lg={6} xl={4}>
    <ElResult
      icon="success"
      title="Success Tip"
      subTitle="Please follow the instructions"
      extra={<ElButton type="primary">Back</ElButton>}
    />
  </ElCol>
  <ElCol sm={12} lg={6} xl={4}>
    <ElResult
      icon="warning"
      title="Warning Tip"
      subTitle="Please follow the instructions"
      extra={<ElButton type="primary">Back</ElButton>}
    />
  </ElCol>
  <ElCol sm={12} lg={6} xl={4}>
    <ElResult
      icon="error"
      title="Error Tip"
      subTitle="Please follow the instructions"
      extra={<ElButton type="primary">Back</ElButton>}
    />
  </ElCol>
  <ElCol sm={12} lg={6} xl={4}>
    <ElResult
      icon="info"
      title="Info Tip"
      subTitle={<p>Using slot as subtitle</p>}
      extra={<ElButton type="primary">Back</ElButton>}
    />
  </ElCol>
</ElRow>`,

  customIcon: `<ElResult
  title="404"
  subTitle="Sorry, request error"
  customIcon={<img src={hamburgerUrl} alt="" />}
  extra={<ElButton type="primary">Back</ElButton>}
/>`,
};

const API_MD = `
## Result API

### Result Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 图标类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'info' \\| 'error'\` | info |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| sub-title | 副标题 | ^[string] / ^[ReactNode] | — |

### Result Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| icon | 自定义图标 | \`customIcon\` |
| title | 自定义标题 | \`title\` |
| sub-title | 自定义副标题 | \`subTitle\` |
| extra | 操作区 | \`extra\` |

`;

export default function ResultPage() {
  return (
    <>
      <h1>Result 结果</h1>
      <p>用于对用户的操作结果或者异常状态做反馈。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        <code>primary</code> 已被添加到<span className="docs-version-tag">2.9.11</span>。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ResultBasic />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <DemoBlock source={SOURCES.customIcon}>
        <ResultCustomIcon />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
