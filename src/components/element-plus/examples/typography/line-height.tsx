const IMAGE_BASE = "https://element-plus.org/images/typography";

/** 行高示例的 4 个档位，对应官方 line-height.vue 的列表文本。 */
const LINE_HEIGHTS = [
  { value: "1", note: "No line height" },
  { value: "1.3", note: "Compact" },
  { value: "1.5", note: "Regular" },
  { value: "1.7", note: "Loose" },
];

export default function TypographyLineHeight() {
  return (
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
  );
}
