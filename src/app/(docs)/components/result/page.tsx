import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  ResultBasic,
  ResultCustomIcon,
} from "@/components/docs/examples/empty-result";

export const metadata: Metadata = {
  title: "Result 结果",
};

const SOURCES = {
  basic: `{["primary", "success", "warning", "error"].map((icon) => (
  <ElResult
    key={icon}
    icon={icon}
    title={\`\${icon} 提示\`}
    subTitle="请根据提示进行后续操作"
    extra={<ElButton type="primary">返回</ElButton>}
  />
))}
<ElResult
  icon="info"
  title="信息提示"
  subTitle={<p>使用插槽自定义副标题</p>}
  extra={<ElButton type="primary">返回</ElButton>}
/>`,

  customIcon: `<ElResult
  title="404"
  subTitle="抱歉，请求出错"
  customIcon={<img src={CUSTOM_ICON} alt="" />}
  extra={<ElButton type="primary">返回</ElButton>}
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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="extra">\` | \`extra\` 属性 | 传节点 |
| \`<slot name="icon">\` | \`customIcon\` 属性 | 传节点 |

**实现说明**：图标与其配色类名直接落在 \`<svg>\` 上（与官方一致），
配对关系为 \`icon-primary → InfoFilled\`、\`icon-success → CircleCheckFilled\`、
\`icon-warning → WarningFilled\`、\`icon-error → CircleCloseFilled\`、
\`icon-info → InfoFilled\`。

配色与尺寸都来自 theme-chalk 的两条规则：
\`.el-result .icon-{type}\` 提供颜色，\`.el-result__icon svg\` 提供 64px 尺寸。
因此这两个类名不能改动，否则配色与尺寸会同时丢失。
`;

export default function ResultPage() {
  return (
    <>
      <h1>Result 结果</h1>
      <p>用于反馈一系列操作任务的处理结果。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>icon</code> 属性设置图标类型，配合 <code>title</code> 与
        <code>subTitle</code> 展示结果信息。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ResultBasic />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        <code>customIcon</code> 可以传入任意节点替换默认图标，
        <code>extra</code> 属性用于在底部添加操作区。
      </p>
      <DemoBlock source={SOURCES.customIcon}>
        <ResultCustomIcon />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
