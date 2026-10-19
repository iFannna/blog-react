import { createContext, useContext } from "react";
import type { CheckboxGroupContextValue } from "./context";

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroup() {
  return useContext(CheckboxGroupContext);
}
