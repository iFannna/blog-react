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

`;

export default function BorderPage() {
  return (
    <>
      <h1>Border 边框</h1>
      <p>我们对边框进行统一规范，可用于按钮、卡片、弹窗等组件里。</p>

      <Heading level={2}>边框样式</Heading>
      <p>我们提供了以下几种边框样式，以供选择。</p>
      <DemoBlock source={SOURCES.border}>
        <BorderBasic />
      </DemoBlock>

      <Heading level={2}>圆角</Heading>
      <p>我们提供了以下几种圆角样式，以供选择。</p>
      <DemoBlock source={SOURCES.radius}>
        <BorderRadius />
      </DemoBlock>

      <Heading level={2}>阴影</Heading>
      <p>我们提供了以下几种投影样式，以供选择。</p>
      <DemoBlock source={SOURCES.shadow}>
        <BorderShadow />
      </DemoBlock>

      <Heading level={2}>源代码</Heading>
      <p>
        <a
          href="https://github.com/element-plus/element-plus/blob/dev/docs/en-US/component/border.md"
          target="_blank"
          rel="noreferrer"
        >
          文档
        </a>
      </p>

      <DocsContent source={API_MD} />
    </>
  );
}
