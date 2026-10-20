import { Fragment } from "react";

/** 官方 docs/examples/typography 的字体截图，顺序与官方一致。 */
const FONT_TERMS = [
  "pingfang",
  "hiragino",
  "microsoft",
  "helvetica",
  "arial",
];

const IMAGE_BASE = "https://element-plus.org/images/typography";

/** 第 3 张按官方去掉右边距，首行正好排满三张；暗色图同理。 */
export default function TypographyFont() {
  return (
    <div className="demo-term-box">
      {FONT_TERMS.map((term, index) => (
        <Fragment key={term}>
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
  );
}
