import Link from "next/link";
import { localePath } from "@/lib/locale";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ArchiveDateLinksProps {
  locale: string;
  year: number;
  month: number;
  day: number;
  prefix?: string;
}

export function ArchiveDateLinks({ locale, year, month, day, prefix }: ArchiveDateLinksProps) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  // 不依赖 JSX 文本空格 —— 避免 flex 容器吞空白、white-space 折叠等导致空格反复丢失
  return (
    <span className="archive-date-links">
      {prefix}
      <Link className="archive-date-link" href={localePath(locale, `/archive/${year}/${mm}`)}>{MONTHS[month - 1]}</Link>
      <Link className="archive-date-link" href={localePath(locale, `/archive/${year}/${mm}/${dd}`)}>{day}</Link>
      <Link className="archive-date-link" href={localePath(locale, `/archive/${year}`)}>{year}</Link>
    </span>
  );
}
