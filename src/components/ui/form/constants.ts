"use client";

import { createContext } from "react";
import type { FormContext, FormItemContext } from "./context";

/** 对应官方 provide(formContextKey) / provide(formItemContextKey)。 */
export const FormContextKey = createContext<FormContext | undefined>(undefined);
export const FormItemContextKey = createContext<FormItemContext | undefined>(
  undefined,
);
