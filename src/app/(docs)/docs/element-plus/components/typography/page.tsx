import type { Metadata } from "next";
import { Fragment } from "react";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";

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

## 源代码

[文档](https://github.com/element-plus/element-plus/blob/dev/docs/en-US/component/typography.md)

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
