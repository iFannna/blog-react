import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import { ColorMain, ColorSecondary, ColorNeutral } from "@/components/element-plus/examples/color";

export const metadata: Metadata = { title: "Color 色彩" };

/**
 * 官方 md 没有 :::demo（三块色板由 ClientOnly 直接挂全局组件），
 * 所以这里按「展示块」建 source，而不是按示例目录。
 */
const SOURCES = {
  main: `<ElRow gutter={12}>
  <ElCol span={10} xs={{ span: 12 }}>
    <div className="demo-color-box demo-color-box--primary">
      Brand Color
      <div className="value">#409EFF</div>
      {/* 6 档深浅，宽 100% / 6，点击复制变量 */}
      <div className="bg-color-sub demo-color-box--primary">
        {["dark-2", "light-3", "light-5", "light-7", "light-8", "light-9"].map((level) => (
          <div
            key={level}
            className={\`bg-blue-sub-item demo-color-box--primary-\${level}\`}
            onClick={() => copyColor(\`--el-color-primary-\${level}\`)}
          />
        ))}
      </div>
    </div>
  </ElCol>
</ElRow>`,

  secondary: `<ElRow gutter={12}>
  {["success", "warning", "danger", "info"].map((type) => (
    <ElCol span={6} xs={{ span: 12 }} key={type}>
      <div className={\`demo-color-box demo-color-box--\${type}\`}>
        {type}
        <div className="value">{colorValue[type]}</div>
        <div className="bg-color-sub">
          {["dark-2", "light-3", "light-5", "light-7", "light-8", "light-9"].map((level) => (
            <div
              key={level}
              className={\`bg-secondary-sub-item demo-color-box--\${type}-\${level}\`}
              onClick={() => copyColor(\`--el-color-\${type}-\${level}\`)}
            />
          ))}
        </div>
      </div>
    </ElCol>
  ))}
</ElRow>`,

  neutral: `<ElRow gutter={12}>
  <ElCol span={6} xs={{ span: 12 }}>
    {textColors.map((c) => (
      <div className="demo-color-box demo-color-box--text-..." key={c.varName}>
        {c.name}
        <div className="value">{c.value}</div>
      </div>
    ))}
  </ElCol>

  <ElCol span={6} xs={{ span: 12 }}>
    {borderColors.map((c) => (
      <div className="demo-color-box demo-color-box-lite demo-color-box--border-..." key={c.varName}>
        {c.name}
        <div className="value">{c.value}</div>
      </div>
    ))}
  </ElCol>

  <ElCol span={6} xs={{ span: 12 }}>
    {fillColors.map((c) => (
      <div className="demo-color-box demo-color-box-lite demo-color-box--fill-..." key={c.varName}>
        {c.name}
        <div className="value">{c.value}</div>
      </div>
    ))}
  </ElCol>

  <ElCol span={6} xs={{ span: 12 }}>
    <div className="demo-color-box demo-color-box--black">
      Basic Black
      <div className="value">#000000</div>
    </div>
    <div className="demo-color-box demo-color-box--white">
      Basic White
      <div className="value">#FFFFFF</div>
    </div>
    <div className="demo-color-box demo-color-box-lite bg-transparent">
      Transparent
      <div className="value">Transparent</div>
    </div>
    {backgroundColors.map((c) => (
      <div className="demo-color-box demo-color-box-lite demo-color-box--bg-..." key={c.varName}>
        {c.name}
        <div className="value">{c.value}</div>
      </div>
    ))}
  </ElCol>
</ElRow>`,
};

const API_MD = `
## Color 规范

### 主色与场景色

| 变量名 | 说明 | 浅色默认值 |
| --- | --- | --- |
| --el-color-primary | 主色 | #409eff |
| --el-color-primary-light-3 | 主色浅色 3 档 | rgb(121, 187, 255) |
| --el-color-primary-light-5 | 主色浅色 5 档 | rgb(160, 207, 255) |
| --el-color-primary-light-7 | 主色浅色 7 档 | rgb(198, 226, 255) |
| --el-color-primary-light-8 | 主色浅色 8 档 | rgb(217, 236, 255) |
| --el-color-primary-light-9 | 主色浅色 9 档 | rgb(236, 245, 255) |
| --el-color-primary-dark-2 | 主色深色 2 档 | rgb(51, 126, 204) |
| --el-color-success | 成功色 | #67c23a |
| --el-color-warning | 警告色 | #e6a23c |
| --el-color-danger | 危险色 | #f56c6c |
| --el-color-error | 错误色（同 danger） | #f56c6c |
| --el-color-info | 信息色 | #909399 |

\`success\` / \`warning\` / \`danger\` / \`error\` / \`info\` 各自还有
\`light-3\`、\`light-5\`、\`light-7\`、\`light-8\`、\`light-9\`、\`dark-2\` 六个派生档位，
命名规则同上。

### 中性色

| 变量名 | 说明 | 浅色默认值 |
| --- | --- | --- |
| --el-text-color-primary | 主要文字 | #303133 |
| --el-text-color-regular | 常规文字 | #606266 |
| --el-text-color-secondary | 次要文字 | #909399 |
| --el-text-color-placeholder | 占位文字 | #a8abb2 |
| --el-text-color-disabled | 禁用文字 | #c0c4cc |
| --el-border-color-darker | 更深边框 | #cdd0d6 |
| --el-border-color-dark | 深边框 | #d4d7de |
| --el-border-color | 基础边框 | #dcdfe6 |
| --el-border-color-light | 浅边框 | #e4e7ed |
| --el-border-color-lighter | 更浅边框 | #ebeef5 |
| --el-border-color-extra-light | 极浅边框 | #f2f6fc |
| --el-fill-color-darker | 更深填充 | #e6e8eb |
| --el-fill-color-dark | 深填充 | #ebedf0 |
| --el-fill-color | 基础填充 | #f0f2f5 |
| --el-fill-color-light | 浅填充 | #f5f7fa |
| --el-fill-color-lighter | 更浅填充 | #fafafa |
| --el-fill-color-extra-light | 极浅填充 | #fafcff |
| --el-fill-color-blank | 空白填充 | #ffffff |
| --el-bg-color | 基础背景 | #ffffff |
| --el-bg-color-page | 页面背景 | #f2f3f5 |
| --el-bg-color-overlay | 浮层背景 | #ffffff |

另外 \`--el-color-white\`（#ffffff）与 \`--el-color-black\`（#000000）是无派生档位的
纯色常量。

`;

export default function ColorPage() {
  return (
    <>
      <h1>Color 色彩</h1>
      <p>
        Element Plus 为了避免视觉传达差异，使用一套特定的调色板来规定颜色，为你所搭建的产品提供一致的外观视觉感受。
      </p>

      <Heading level={2}>主色</Heading>
      <p>Element Plus 默认的主题色是明亮、友好的蓝色。</p>
      <DemoBlock source={SOURCES.main}>
        <ColorMain />
      </DemoBlock>

      <Heading level={2}>辅助色</Heading>
      <p>
        除了主颜色外，您需要在不同的场景中使用不同的场景颜色 (例如，危险的颜色表示危险的操作)
      </p>
      <DemoBlock source={SOURCES.secondary}>
        <ColorSecondary />
      </DemoBlock>

      <Heading level={2}>中性色</Heading>
      <p>
        中性色用于文本、背景和边框颜色。通过运用不同的中性色，来表现层次结构。
      </p>
      <DemoBlock source={SOURCES.neutral}>
        <ColorNeutral />
      </DemoBlock>

      <Heading level={2}>源代码</Heading>
      <p>
        <a
          href="https://github.com/element-plus/element-plus/blob/dev/docs/en-US/component/color.md"
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
