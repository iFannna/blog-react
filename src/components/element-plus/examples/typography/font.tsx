import { Fragment } from "react";

const FONT_TERMS = [
  "pingfang",
  "hiragino",
  "microsoft",
  "helvetica",
  "arial",
];

const IMAGE_BASE = "https://element-plus.org/images/typography";

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
