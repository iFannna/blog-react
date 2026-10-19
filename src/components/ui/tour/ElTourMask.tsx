"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { PosInfo } from "./types";

export interface ElTourMaskProps {
  /** 是否显示遮罩 */
  visible: boolean;
  /** 遮罩填充色 */
  fill: string;
  /** 挖孔位置 */
  pos?: PosInfo | null;
  /** 遮罩层级 */
  zIndex: number;
  /** 挖孔区域是否可点击（false 时遮罩本身接管事件） */
  targetAreaClickable?: boolean;
  /** 自定义遮罩样式，对应官方 mask.style */
  style?: CSSProperties;
}

/**
 * 对应官方 ElTourMask。
 *
 * 用一个铺满视口的 svg path 挖出目标矩形：外圈顺时针铺满视口，
 * 内圈按 radius 用四段圆弧拼成圆角孔洞。两段子路径的绕向相反，
 * 默认的 nonzero 填充规则下内圈自然成为孔洞，无需额外 fill-rule。
 */
export function ElTourMask({
  visible,
  fill,
  pos,
  zIndex,
  targetAreaClickable = true,
  style,
}: ElTourMaskProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // 遮罩显示期间锁滚动，对应官方 useLockscreen（在 <body> 上加 el-popup-parent--hidden）
  useEffect(() => {
    if (!visible) return;

    document.body.classList.add("el-popup-parent--hidden");
    return () => document.body.classList.remove("el-popup-parent--hidden");
  }, [visible]);

  // 外圈路径铺满视口，视口变化时要跟着重算，对应官方 useWindowSize
  useEffect(() => {
    if (!visible) return;

    const update = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [visible]);

  if (!visible) return null;

  const { width, height } = windowSize;
  const radius = pos?.radius ?? 2;
  // 圆弧命令的公共部分：rx,ry 相同且不旋转、取小弧、顺时针
  const arc = `a${radius},${radius} 0 0 1`;

  const buildPath = () => {
    const outer = `M${width},0 L0,0 L0,${height} L${width},${height} L${width},0 Z`;
    if (!pos) return outer;

    const { left, top, width: w, height: h } = pos;
    return (
      `${outer} M${left + radius},${top}` +
      ` h${w - radius * 2} ${arc} ${radius},${radius}` +
      ` v${h - radius * 2} ${arc} ${-radius},${radius}` +
      ` h${-w + radius * 2} ${arc} ${-radius},${-radius}` +
      ` v${-h + radius * 2} ${arc} ${radius},${-radius} z`
    );
  };

  const maskStyle: CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex,
    // 有挖孔且孔可点击时，让事件穿透到目标元素
    pointerEvents: pos && targetAreaClickable ? "none" : "auto",
    ...style,
  };

  return (
    <div className="el-tour__mask" style={maskStyle}>
      <svg style={{ width: "100%", height: "100%" }}>
        <path
          className="el-tour__hollow"
          style={{ fill, pointerEvents: "auto", cursor: "auto" }}
          d={buildPath()}
        />
      </svg>
    </div>
  );
}
