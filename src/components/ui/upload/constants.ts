/**
 * 与官方 upload/src/constants.ts 对齐：向子树下发 accept / disabled，
 * 供 ElUploadDragger 等内部组件消费。
 */
import { createContext } from "react";

export interface UploadContextValue {
  accept: string;
  disabled: boolean;
}

export const UploadContext = createContext<UploadContextValue | null>(null);
