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
          <ul className="trail-items" itemScope itemType="http://schema.org/BreadcrumbList">
            {items.map((item, index) => (
              <li
                key={item.path || `${item.name}-${index}`}
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
              >
                {index < items.length - 1 && !item.path ? (
                  <span>
                    <span itemProp="name">{item.name}</span>
                  </span>
                ) : (
                  <Link href={item.path} itemProp="item">
                    <span itemProp="name">{item.name}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
