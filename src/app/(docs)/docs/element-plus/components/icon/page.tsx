import type { Metadata } from "next";
import * as AllIcons from "@/components/element-plus/icons";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import DocsContent from "../../../../_components/DocsContent";
import { Heading } from "../../../../_components/Heading";

export const metadata: Metadata = {
  title: "Icon 图标",
};

/** 图标是独立模块，按名字动态取用需要一张显式映射表。 */
function IconByName({ name }: { name: string }) {
  const Comp = (AllIcons as unknown as Record<string, React.ComponentType>)[name];
  if (!Comp) return null;
  return <Comp />;
}

/**
 * 全部图标来自官方 @element-plus/icons-vue，
 * 由 scripts/build-element-icons.mjs 提取 SVG 生成 React 组件。
 */
const ICONS = Object.keys(AllIcons).sort((a, b) => a.localeCompare(b));

const API_MD = `
## 用法

图标由 \`scripts/build-element-icons.mjs\` 从官方 \`@element-plus/icons-vue\` 提取 SVG 生成，
不引入 Vue 运行时。脚本会解析全部官方图标，升级图标包后重跑即可：

\`\`\`bash
npm run build:icons
\`\`\`

### 基础用法

\`\`\`tsx
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Edit } from "@/components/element-plus/icons";

<ElIcon><Edit /></ElIcon>
\`\`\`

### 尺寸与颜色

\`ElIcon\` 通过 \`font-size\` 与 \`--color\` 下发样式，与官方 ElIcon 一致：

\`\`\`tsx
<ElIcon size={24}><Edit /></ElIcon>
<ElIcon color="#409eff"><Edit /></ElIcon>
\`\`\`

### 配合按钮使用

按钮的 \`icon\` 属性已自动包一层 \`ElIcon\`，无需手动包裹：

\`\`\`tsx
<ElButton type="primary" icon={<Edit />}>编辑</ElButton>
\`\`\`

## Icon API

### Icon Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 图标尺寸，数字补 px | ^[number] / ^[string] | — |
| color | 图标颜色，落到 --color 变量 | ^[string] | — |

`;

export default function IconPage() {
  return (
    <>
      <h1>Icon 图标</h1>
      <p>提供了一套常用的图标集合。</p>

      <Heading level={2}>图标集合</Heading>
      <p>
        以下为官方全部 {ICONS.length} 个图标，来自
        <code>@element-plus/icons-vue</code>，SVG 数据逐字节一致。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
          gap: "1.2rem",
          margin: "2rem 0",
        }}
      >
        {ICONS.map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.8rem",
              padding: "1.6rem 0.8rem",
              border: "1px solid var(--docs-example-border)",
              borderRadius: "0.4rem",
            }}
          >
            {/* 图标 svg 自身没有尺寸，靠 ElIcon 提供的 1em 撑开，
                这与官方文档站的写法一致 */}
            <ElIcon size={24}>
              <IconByName name={name} />
            </ElIcon>
            <span style={{ fontSize: "1.2rem", color: "var(--docs-text-secondary)" }}>
              {name}
            </span>
          </div>
        ))}
      </div>

      <DocsContent source={API_MD} />
    </>
  );
}
