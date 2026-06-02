import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs-bar">
      <div className="breadcrumbs-container">
        <nav aria-label="Breadcrumbs" className="breadcrumb-trail breadcrumbs">
          <ul className="trail-items">
            {items.map((item, index) => (
              <li key={item.path || `${item.name}-${index}`}>
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
