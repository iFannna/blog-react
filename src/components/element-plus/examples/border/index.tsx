"use client";

import { ElRow, ElCol } from "@/components/element-plus/row";
import styles from "./border.module.css";

const radiusGroup = [
  { name: "No Radius", type: "", value: '"0px"' },
  { name: "Small Radius", type: "small", value: "2px" },
  { name: "Large Radius", type: "base", value: "4px" },
  { name: "Round Radius", type: "round", value: "20px" },
];

const shadowGroup = [
  { name: "Basic Shadow", type: "" },
  { name: "Light Shadow", type: "light" },
  { name: "Lighter Shadow", type: "lighter" },
  { name: "Dark Shadow", type: "dark" },
];

export function BorderBasic() {
  return (
    <table className="demo-border">
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
    </table>
  );
}

export function BorderRadius() {
  return (
    <ElRow gutter={12} className="demo-radius">
      {radiusGroup.map((radius) => (
        <ElCol className={styles.col} span={6} xs={{ span: 12 }} key={radius.name}>
          <div className="title">{radius.name}</div>
          <div className="value">
            <code>border-radius: {radius.value}</code>
          </div>
          <div
            className={
              radius.type ? `radius radius--${radius.type}` : "radius"
            }
          />
        </ElCol>
      ))}
    </ElRow>
  );
}

export function BorderShadow() {
  return (
    <div className="demo-shadow">
      {shadowGroup.map((shadow) => (
        <div className="demo-shadow__item" key={shadow.name}>
          <div
            className={
              shadow.type
                ? `demo-shadow__box demo-shadow__box--${shadow.type}`
                : "demo-shadow__box"
            }
          />
          <span className="demo-shadow-text">{shadow.name}</span>
          <code className="demo-shadow__var">
            {shadow.type ? `--el-box-shadow-${shadow.type}` : "--el-box-shadow"}
          </code>
        </div>
      ))}
    </div>
  );
}
