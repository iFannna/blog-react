"use client";

/**
 * z-index 逻辑已迁至 config-provider（需读取 ConfigProvider 下发的全局 zIndex）。
 * 保留本模块仅为不改变既有 import 路径。
 */
export {
  useZIndex,
  nextZIndex,
  defaultInitialZIndex,
} from "../config-provider/use-z-index";
