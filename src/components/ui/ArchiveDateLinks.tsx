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

  return (
    <>
      {prefix}{prefix && " "}
      <Link className="archive-date-link" href={`/archive/${year}/${mm}`}>{MONTHS[month - 1]}</Link>
      <span className="archive-date-separator" aria-hidden="true">{" "}</span>
      <Link className="archive-date-link" href={`/archive/${year}/${mm}/${dd}`}>{day}</Link>
      <span className="archive-date-separator" aria-hidden="true">{", "}</span>
      <Link className="archive-date-link" href={`/archive/${year}`}>{year}</Link>
    </>
  );
}
