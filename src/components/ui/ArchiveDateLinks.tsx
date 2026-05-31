import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function ArchiveDateLinks({ publishTime }: { publishTime: string }) {
  const { month, monthNumber, day, year } = formatDate(publishTime);

  return (
    <>
      <Link className="archive-date-link" href={`/archive/${year}/${monthNumber}`}>{month}</Link>
      <span className="archive-date-separator" aria-hidden="true">{" "}</span>
      <Link className="archive-date-link" href={`/archive/${year}/${monthNumber}/${day}`}>{day}</Link>
      <span className="archive-date-separator" aria-hidden="true">{", "}</span>
      <Link className="archive-date-link" href={`/archive/${year}`}>{year}</Link>
    </>
  );
}
