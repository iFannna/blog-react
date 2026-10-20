const FONT_SIZES = [
  { level: "Supplementary text", type: "extra-small", value: "12px" },
  { level: "Body (small)", type: "small", value: "13px" },
  { level: "Body", type: "base", value: "14px" },
  { level: "Small Title", type: "medium", value: "16px" },
  { level: "Title", type: "large", value: "18px" },
  { level: "Main Title", type: "extra-large", value: "20px" },
];

function formatType(type: string) {
  return type
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export default function TypographyConvention() {
  return (
    <table className="demo-typo-size">
      <tbody>
        <tr>
          <td>Level</td>
          <td>Font Size</td>
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
  );
}
