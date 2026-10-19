import type { Metadata } from "next";
import { Fragment } from "react";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";

export const metadata: Metadata = { title: "Typography 排版" };

/**
 * 官方 docs/examples/typography 的字体截图，顺序与官方一致。
 * 第 3 张在官方是 img:nth-of-type(3)，会去掉右边距把首行凑满三个。
 */
const FONT_TERMS = [
  "pingfang",
  "hiragino",
  "microsoft",
  "helvetica",
  "arial",
];

/**
 * 字号表与 font.vue 的 fontSizes 一致。
 * 官方用 useCssVar 运行时读 --el-font-size-* 再拼上单位，
 * 纯 React 侧直接写同名的最终值，避免运行时读 CSS 变量（与 border 页同一做法）。
 */
const FONT_SIZES = [
  { level: "Supplementary text", type: "extra-small", value: "12px" },
  { level: "Body (small)", type: "small", value: "13px" },
  { level: "Body", type: "base", value: "14px" },
  { level: "Small Title", type: "medium", value: "16px" },
  { level: "Title", type: "large", value: "18px" },
  { level: "Main Title", type: "extra-large", value: "20px" },
];

/** 行高示例的 4 个档位，对应官方 line-height.vue 的列表文本。 */
const LINE_HEIGHTS = [
  { value: "1", note: "No line height" },
  { value: "1.3", note: "Compact" },
  { value: "1.5", note: "Regular" },
  { value: "1.7", note: "Loose" },
];

const IMAGE_BASE = "https://element-plus.org/images/typography";

const SOURCES = {
  font: `{/* 五个终端字体截图。官方按 isDark 切换两套图，
    这里改为在 docs.css 里用 html.dark 控制显示哪一张。 */}
<div className="demo-term-box">
  {FONT_TERMS.map((term, index) => (
    <Fragment key={term}>
      <img
        className={\`demo-term-box__img is-light\${index === 2 ? " demo-term-box__img--last" : ""}\`}
        src={\`${IMAGE_BASE}/term-\${term}.png\`}
        alt=""
      />
      <img
        className={\`demo-term-box__img is-dark\${index === 2 ? " demo-term-box__img--last" : ""}\`}
        src={\`${IMAGE_BASE}/term-\${term}-dark.png\`}
        alt=""
      />
    </Fragment>
  ))}
</div>`,

  convention: `{/* 官方给每个 tr 内联 font-size: var(--el-font-size-*)，这里改用同名修饰类 */}
<table className="demo-typo-size">
  <tbody>
    <tr>
      <td>Level</td>
      <td>Font Size</td>
      {/* color-dark-light 是官方预留的类名，线上并未生效，保持原样 */}
      <td className="color-dark-light">Demo</td>
    </tr>
    {FONT_SIZES.map((fontSize) => (
      <tr
        key={fontSize.type}
        className={\`demo-typo-size__row demo-typo-size__row--\${fontSize.type}\`}
      >
        <td>{fontSize.level}</td>
        <td>
          {fontSize.value} {formatType(fontSize.type)}
        </td>
        <td>Build with Element</td>
      </tr>
    ))}
  </tbody>
</table>`,

  lineHeight: `{/* 官方此例没有样式，图片按原始尺寸渲染，暗色下换 line-height-dark.png */}
<div className="demo-typo-lineheight">
  <img
    className="lineH-left is-light"
    src={\`${IMAGE_BASE}/line-height.png\`}
    alt=""
  />
  <img
    className="lineH-left is-dark"
    src={\`${IMAGE_BASE}/line-height-dark.png\`}
    alt=""
  />
  <ul className="lineH-right">
    <li>line-height:1 <span>No line height</span></li>
    <li>line-height:1.3 <span>Compact</span></li>
    <li>line-height:1.5 <span>Regular</span></li>
    <li>line-height:1.7 <span>Loose</span></li>
  </ul>
</div>`,
};

const API_MD = `
## Font-family

\`\`\`css
font-family:
  Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
\`\`\`

## 与 Vue 版 API 的差异

官方 Typography 不是组件：\`packages/components\` 下没有 typography 目录，
它是一页设计约定，正文只由 3 个 Vue 示例加一段 CSS 组成。
React 侧因此也没有 \`ui/\` 目录，本页即全部实现。

| 官方 Vue 示例 | React 实现 | 说明 |
| --- | --- | --- |
| \`font.vue\` 五个终端字体截图 | 页内内联 DOM | 暗色切换由 CSS 完成，不再依赖 \`isDark\` |
| \`convention.vue\` 字号对照表 | 页内内联 DOM | 字号值取自 \`--el-font-size-*\` 的最终 px 值 |
| \`line-height.vue\` 行高示意 | 页内内联 DOM | 明暗两套图，同上 |
| \`useCssVar\` 读字体变量 | 写死同名字号 | 纯 React 无运行时变量读取 |
| \`<style scoped>\` 里的 img 尺寸 | \`docs.css\` 的 \`.demo-term-box__img\` | 项目禁止内联 style 与 \`<style>\` |
| 逐行 \`style="font-size: …"\` | \`.demo-typo-size__row--*\` 修饰类 | 同一组 \`--el-font-size-*\` 变量 |

**实现说明**：官方示例的 \`<style scoped>\` 只给字体截图设了 220x174 的尺寸
（第 3 张 \`nth-of-type(3)\` 去掉右边距），行高示例在当前线上版本没有任何样式
（旧版 \`demo-styles/typography.scss\` 未随文档重构迁移），
因此行高图按原始尺寸 474x114 渲染、下方列表吃 VitePress 默认样式。
本页对齐了实测值：两个示例根节点补回继承自正文的 16px / 1.4 行高（行内图片的基线间隙），
字号表撤销正文表格的边框与全宽，行高列表写回 40px 缩进与 li 零外边距。

## 未实现的官方能力

- 未使用官方 CDN 之外的本地图片：\`public/\` 下没有 typography 目录，
  图片直接指向 \`https://element-plus.org/images/typography/*.png\`（与 watermark 页同一做法），
  离线环境下图不显示。
- 未实现官方 \`term-*-dark.png\` 之外的暗色处理：官方靠 Vue 的 \`isDark\` 响应式切换，
  这里改为在 \`docs.css\` 用 \`html.dark\` 选择器显示深色图，视觉结果一致但机制不同。
- 未实现官方的「编辑/复制/运行」示例工具栏与 CodePen：整个文档站统一未做（见其他组件页）。
`;

/** 与官方 formatType 一致，把 extra-small 拼成 Extra Small。 */
function formatType(type: string) {
  return type
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export default function TypographyPage() {
  return (
    <>
      <h1>Typography 排版</h1>
      <p>我们对字体进行统一规范，力求在各个操作系统下都有最佳展示效果。</p>

      <Heading level={2}>字体</Heading>
      <DemoBlock source={SOURCES.font}>
        <div className="demo-term-box">
          {FONT_TERMS.map((term, index) => (
            <Fragment key={term}>
              {/* 第 3 张按官方去掉右边距，首行正好排满三张；暗色图同理 */}
              <img
                className={
                  index === 2
                    ? "demo-term-box__img demo-term-box__img--last is-light"
                    : "demo-term-box__img is-light"
                }
                src={`${IMAGE_BASE}/term-${term}.png`}
                alt=""
              />
              <img
                className={
                  index === 2
                    ? "demo-term-box__img demo-term-box__img--last is-dark"
                    : "demo-term-box__img is-dark"
                }
                src={`${IMAGE_BASE}/term-${term}-dark.png`}
                alt=""
              />
            </Fragment>
          ))}
        </div>
      </DemoBlock>

      <Heading level={2}>字号</Heading>
      <DemoBlock source={SOURCES.convention}>
        <table className="demo-typo-size">
          <tbody>
            <tr>
              <td>Level</td>
              <td>Font Size</td>
              {/* color-dark-light 是官方预留但线上未生效的类名，保持原样 */}
              <td className="color-dark-light">Demo</td>
            </tr>
            {FONT_SIZES.map((fontSize) => (
              <tr
                key={fontSize.type}
                className={`demo-typo-size__row demo-typo-size__row--${fontSize.type}`}
              >
                <td>{fontSize.level}</td>
                <td>
                  {fontSize.value} {formatType(fontSize.type)}
                </td>
                <td>Build with Element</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DemoBlock>

      <Heading level={2}>行高</Heading>
      <DemoBlock source={SOURCES.lineHeight}>
        {/* 示例框本身不带字号，官方在此继承 body 的 16px / 1.4 行高 */}
        <div className="demo-typo-lineheight">
          <img
            className="lineH-left is-light"
            src={`${IMAGE_BASE}/line-height.png`}
            alt=""
          />
          <img
            className="lineH-left is-dark"
            src={`${IMAGE_BASE}/line-height-dark.png`}
            alt=""
          />
          <ul className="lineH-right">
            {LINE_HEIGHTS.map((item) => (
              <li key={item.value}>
                line-height:{item.value} <span>{item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
