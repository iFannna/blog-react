"use client";

import type { CSSProperties, ReactNode } from "react";
import { addUnit } from "../utils";
import { useTranslator } from "../config-provider/context";
import { EmptyImage } from "./EmptyImage";

export interface EmptyProps {
  /** 自定义插图地址，不传时使用内置空状态图 */
  image?: string;
  /** 插图宽度 */
  imageSize?: number | string;
  /** 描述文字 */
  description?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 底部内容，对应官方默认插槽 */
  children?: ReactNode;
}

/** 对应官方 ElEmpty。默认描述文案取自 locale 的 el.table.emptyText。 */
export function ElEmpty({
  image = "",
  imageSize,
  description,
  className,
  style,
  children,
}: EmptyProps) {
  const t = useTranslator();
  // 官方：props.description || t('el.table.emptyText')
  const resolvedDescription = description || t("el.table.emptyText");

  const classes = ["el-empty", className].filter(Boolean).join(" ");

  const imageStyle: CSSProperties = {
    width: addUnit(imageSize),
  };

  return (
    <div className={classes} style={style}>
      <div className="el-empty__image" style={imageStyle}>
        {image ? (
          // 官方禁止插图被拖拽
          <img src={image} alt="" draggable={false} />
        ) : (
          <EmptyImage />
        )}
      </div>

      <div className="el-empty__description">
        {typeof resolvedDescription === "string" ? (
          <p>{resolvedDescription}</p>
        ) : (
          resolvedDescription
        )}
      </div>

      {children !== undefined && <div className="el-empty__bottom">{children}</div>}
    </div>
  );
}
