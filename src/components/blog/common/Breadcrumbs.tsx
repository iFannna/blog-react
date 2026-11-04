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
                {item.path ? (
                  <Link href={item.path}>{item.name}</Link>
                ) : (
                  /* 调用方用空 path 标记当前页，渲染成链接会指向空地址并触发整页重载 */
                  <span aria-current="page">{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
