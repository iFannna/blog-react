import Link from "next/link";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ArchiveDateLinksProps {
  year: number;
  month: number;
  day: number;
  prefix?: string;
}

export function ArchiveDateLinks({ year, month, day, prefix }: ArchiveDateLinksProps) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  // 三个 Link 直接相邻，日期分隔符（空格 / ", "）由 CSS ::before 注入（用 nbsp），
  // 不依赖 JSX 文本空格 —— 避免 flex 容器吞空白、white-space 折叠等导致空格反复丢失
  return (
    <span className="archive-date-links">
      {prefix}
      <Link className="archive-date-link" href={`/archive/${year}/${mm}`}>{MONTHS[month - 1]}</Link>
      <Link className="archive-date-link" href={`/archive/${year}/${mm}/${dd}`}>{day}</Link>
      <Link className="archive-date-link" href={`/archive/${year}`}>{year}</Link>
    </span>
  );
}
