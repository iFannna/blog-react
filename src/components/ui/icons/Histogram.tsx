import type { SVGProps } from "react";

export function Histogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path fill="currentColor" d="M416 896V128h192v768zm-288 0V448h192v448zm576 0V320h192v576z" />
    </svg>
  );
}
