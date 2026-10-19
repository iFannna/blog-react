import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  BorderBasic,
  BorderRadius,
  BorderShadow,
} from "@/components/element-plus/examples/border";

export const metadata: Metadata = { title: "Border 边框" };

/**
 * 官方示例全部由内联 style 或 scoped style 驱动（见 SOURCES），
 * React 侧禁止内联 style，改用 docs.css 里的 demo-* 修饰类映射同名变量。
 */
const SOURCES = {
  border: `<table className="demo-border">
  <tbody>
    <tr>
      <td className="text">Name</td>
      <td className="text">Thickness</td>
      <td className="line">Demo</td>
    </tr>
    <tr>
      <td className="text">Solid</td>
      <td className="text">1px</td>
      <td className="line">
        <div />
      </td>
    </tr>
    <tr>
      <td className="text">Dashed</td>
      <td className="text">2px</td>
      <td className="line">
        <div className="dashed" />
      </td>
    </tr>
  </tbody>
</table>`,

  radius: `<ElRow gutter={12} className="demo-radius">
  {radiusGroup.map((radius) => (
    <ElCol span={6} xs={{ span: 12 }} key={radius.name}>
      <div className="title">{radius.name}</div>
      <div className="value">
        <code>border-radius: {radius.value}</code>
      </div>
      <div className={radius.type ? \`radius radius--\${radius.type}\` : "radius"} />
    </ElCol>
  ))}
</ElRow>`,

  shadow: `<div className="demo-shadow">
  {shadowGroup.map((shadow) => (
    <div className="demo-shadow__item" key={shadow.name}>
      <div
        className={
          shadow.type
            ? \`demo-shadow__box demo-shadow__box--\${shadow.type}\`
            : "demo-shadow__box"
        }
      />
      <span className="demo-shadow-text">{shadow.name}</span>
      <code className="demo-shadow__var">
        {shadow.type ? \`--el-box-shadow-\${shadow.type}\` : "--el-box-shadow"}
      </code>
    </div>
  ))}
</div>`,
};

const API_MD = `
## Border 规范

这不是一个可实例化的组件，而是一组命名规范：官方把边框、圆角、阴影统一收敛为
CSS 变量，任何组件都直接引用它们。因此本节没有 Attributes / Events，
只有变量表。全部变量已在本项目 \`src/styles/element-plus/index.css\` 的 \`:root\`
中定义，暗色覆盖在 \`dark.css\`。

### Border 变量

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| --el-border-width | 边框宽度 | 1px |
| --el-border-style | 边框线型 | solid |
| --el-border-color-hover | 悬停态边框色 | var(--el-text-color-disabled) |
| --el-border | 边框简写 | var(--el-border-width) var(--el-border-style) var(--el-border-color) |
| --el-border-color | 基础边框色 | #dcdfe6 |
| --el-border-color-light | 浅色边框色 | #e4e7ed |
| --el-border-color-lighter | 更浅边框色 | #ebeef5 |
| --el-border-color-extra-light | 极浅边框色 | #f2f6fc |
| --el-border-color-dark | 深色边框色 | #d4d7de |
| --el-border-color-darker | 更深边框色 | #cdd0d6 |

### Radius 变量

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| --el-border-radius-base | 基础圆角 | 4px |
| --el-border-radius-small | 小圆角 | 2px |
| --el-border-radius-round | 全圆角 | 20px |
| --el-border-radius-circle | 圆形 | 100% |

### Shadow 变量

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| --el-box-shadow | 基础阴影 | 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08) |
| --el-box-shadow-light | 浅阴影 | 0px 0px 12px rgba(0, 0, 0, 0.12) |
| --el-box-shadow-lighter | 更浅阴影 | 0px 0px 6px rgba(0, 0, 0, 0.12) |
| --el-box-shadow-dark | 深阴影 | 0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px -8px rgba(0, 0, 0, 0.16) |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 无组件，纯 CSS 变量 | 无组件，纯 CSS 变量 | 完全一致，本节只演示变量效果 |
| 官方示例内联 \`style\` 写 \`border-radius\` / \`box-shadow\` | 改用 \`demo-*\` 修饰类 | 项目禁止内联 style，值与官方逐条对齐 |

**实现说明**：三个示例的 DOM 结构与类名（\`demo-border\` / \`demo-radius\` /
\`demo-shadow\`）与官方 \`docs/examples/border/*.vue\` 一致；
圆角示例复用 \`ElRow\` / \`ElCol\`（\`gutter={12}\`、\`span={6}\`、\`xs={{ span: 12 }}\`），
生成的类名与 grid 结构与官方渲染结果相同。

**未实现的官方能力**：

- 官方示例用 \`useCssVar('--el-border-radius-*')\` 在运行时读取变量实际值显示在
  \`<code>\` 里，React 侧直接把同名值（2px / 4px / 20px）写在常量表中；如果主题
  在运行时改写这些变量，示例里的文字不会跟着变。
- 官方 shadow 示例用 \`getCssVarName()\` 动态拼出变量名并内联引用，React 侧改为
  四个固定的修饰类 \`--light\` / \`--lighter\` / \`--dark\`，新增阴影档位需要同步加类。
`;

export default function BorderPage() {
  return (
    <>
      <h1>Border 边框</h1>
      <p>我们对组件中使用的边框、圆角与阴影做了统一规范。</p>

      <Heading level={2}>边框样式</Heading>
      <p>边框只有实线与虚线两种可选样式。</p>
      <DemoBlock source={SOURCES.border}>
        <BorderBasic />
      </DemoBlock>

      <Heading level={2}>圆角</Heading>
      <p>通过 CSS 变量选择不同的圆角大小。</p>
      <DemoBlock source={SOURCES.radius}>
        <BorderRadius />
      </DemoBlock>

      <Heading level={2}>阴影</Heading>
      <p>通过 CSS 变量选择不同的阴影层次。</p>
      <DemoBlock source={SOURCES.shadow}>
        <BorderShadow />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
