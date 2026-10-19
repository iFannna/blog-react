import { createContext } from "react";
import type { ButtonType, ComponentSize } from "./types";

/** 对应官方 buttonGroupContextKey，由 ElButtonGroup 注入、ElButton 消费。 */
export interface ButtonGroupContextValue {
  size?: ComponentSize;
  type?: ButtonType;
}

export const ButtonGroupContext = createContext<
  ButtonGroupContextValue | undefined
>(undefined);
