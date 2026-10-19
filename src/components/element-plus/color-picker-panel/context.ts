"use client";

import { createContext } from "react";
import type Color from "./color";

/**
 * ColorPicker 与面板共享同一个 Color 实例。
 * 对应官方 ROOT_COMMON_COLOR_INJECTION_KEY。
 */
export const ColorContext = createContext<Color | null>(null);
