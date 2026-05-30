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
    <section
      className={`rounded-3xl border border-warm-border bg-warm-bg p-8 ${
        isSparse ? "mt-12" : ""
      }`}
    >
      {/* Eyebrow */}
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-accent">
        {isSparse ? "Keep Exploring" : "Start Here"}
      </p>

      {/* Title */}
      <h2
        className={`text-text leading-tight font-bold ${
          isSparse
            ? "text-[clamp(1.5rem,3vw,1.875rem)]"
            : "text-[clamp(2rem,4vw,2.75rem)]"
        }`}
      >
        {isSparse
          ? "Discover more across the site"
          : "Welcome — explore to get started"}
      </h2>

      {!isSparse && (
        <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-text-light">
          There are no articles yet. Browse around and check back soon!
        </p>
      )}

      {/* Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {links.map((link) => (
          <div
            key={link.href}
            className="flex flex-col gap-3 rounded-[1.125rem] border border-accent/14 bg-bg p-6"
          >
            <h3 className="text-xl font-bold leading-snug text-text">
              {link.title}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-text-muted">
              {link.description}
            </p>
            <Link
              href={link.href}
              className="self-end text-sm font-bold text-primary transition-[var(--transition-primary)] hover:underline"
            >
              Visit →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
