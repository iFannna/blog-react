import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function ArchiveDateLinks({ publishTime, prefix }: { publishTime: string; prefix?: string }) {
  const { month, monthNumber, day, year } = formatDate(publishTime);
  const mm = String(monthNumber).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  return (
    <>
      {prefix}{prefix && " "}
      <Link className="archive-date-link" href={`/archive/${year}/${mm}`}>{month}</Link>
      <span className="archive-date-separator" aria-hidden="true">{" "}</span>
      <Link className="archive-date-link" href={`/archive/${year}/${mm}/${dd}`}>{day}</Link>
      <span className="archive-date-separator" aria-hidden="true">{", "}</span>
      <Link className="archive-date-link" href={`/archive/${year}`}>{year}</Link>
    </>
  );
}
