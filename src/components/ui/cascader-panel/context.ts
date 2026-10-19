import { createContext, useContext } from "react";

import type { CascaderPanelContext } from "./types";

export const CascaderPanelContextKey =
  createContext<CascaderPanelContext | null>(null);

export function useCascaderPanelContext() {
  return useContext(CascaderPanelContextKey) as CascaderPanelContext;
}
