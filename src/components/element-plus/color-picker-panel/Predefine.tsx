"use client";

import { useSyncExternalStore } from "react";
import { useTranslator } from "../config-provider/context";
import Color from "./color";

export interface PredefineProps {
  colors: string[];
  color: Color;
  enableAlpha: boolean;
  disabled?: boolean;
}

/** 对应官方 color-picker-panel/components/predefine。 */
export function Predefine({
  colors,
  color,
  enableAlpha,
  disabled = false,
}: PredefineProps) {
  useSyncExternalStore(color.subscribe, color.getVersion, color.getVersion);

  const t = useTranslator();

  const rgbaColors = colors.map((value) => {
    const item = new Color({ value, enableAlpha });
    item.selected = item.compare(color);
    return item;
  });

  const handleSelect = (index: number) => {
    color.fromString(colors[index]);
  };

  return (
    <div
      className={["el-color-predefine", disabled && "is-disabled"]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="el-color-predefine__colors">
        {rgbaColors.map((item, index) => (
          <button
            key={`${colors[index]}-${index}`}
            type="button"
            disabled={disabled}
            aria-label={t("el.colorpicker.predefineDescription", {
              value: item.value,
            })}
            className={[
              "el-color-predefine__color-selector",
              (item.get("alpha") as number) < 100 && "is-alpha",
              item.selected && "selected",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleSelect(index)}
          >
            <div style={{ backgroundColor: item.value }} />
          </button>
        ))}
      </div>
    </div>
  );
}
