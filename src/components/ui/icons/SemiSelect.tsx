import type { SVGProps } from "react";

export function SemiSelect(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path fill="currentColor" d="M128 448h768q64 0 64 64t-64 64H128q-64 0-64-64t64-64" />
    </svg>
  );
}
