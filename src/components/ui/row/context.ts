import { createContext } from "react";

/** 对应官方 rowContextKey，Row 注入 gutter 供 Col 消费。 */
export const RowContext = createContext<{ gutter: number }>({ gutter: 0 });
