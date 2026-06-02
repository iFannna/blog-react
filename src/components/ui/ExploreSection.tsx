import Link from "next/link";

interface ExploreLink {
  title: string;
  description: string;
  href: string;
}

interface ExploreSectionProps {
  links: ExploreLink[];
  variant: "empty" | "sparse";
}

export default function ExploreSection({ links, variant }: ExploreSectionProps) {
  const isSparse = variant === "sparse";

  return (
    <section className={`explore-section${isSparse ? " explore-section--sparse" : ""}`}>
      <p className="explore-eyebrow">
        {isSparse ? "Keep Exploring" : "Start Here"}
      </p>

      <h2 className={`explore-title${isSparse ? " explore-title--sparse" : " explore-title--default"}`}>
        {isSparse
          ? "Discover more across the site"
          : "Welcome — explore to get started"}
      </h2>

      {!isSparse && (
        <p className="explore-description">
          There are no articles yet. Browse around and check back soon!
        </p>
      )}

      <div className="explore-grid">
        {links.map((link) => (
          <div key={link.href} className="explore-card">
            <h3 className="explore-card-title">
              {link.title}
            </h3>
            <p className="explore-card-description">
              {link.description}
            </p>
            <Link href={link.href} className="explore-card-link">
              Visit →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
