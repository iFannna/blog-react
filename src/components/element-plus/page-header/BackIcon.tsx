import type { SVGProps } from "react";

/**
 * 内置的 Back 图标，对应官方 @element-plus/icons-vue 的 Back。
 *
 * 图标目录是已生成的产物，Back 不在其中，这里单独内联同一份 path 数据，
 * 避免手改 icons/index.ts。
 */
export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" {...props}>
      <path
        fill="currentColor"
        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"
      />
      <path
        fill="currentColor"
        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"
      />
    </svg>
  );
}
