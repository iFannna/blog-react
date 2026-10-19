/*
 * 官方 button 示例里 .button-example / .button-row 的等价物，
 * 样式抄自 docs/examples/button/basic.vue 的 scoped style。
 */

export const exampleStack = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
} as const;

export const exampleRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "center",
} as const;
