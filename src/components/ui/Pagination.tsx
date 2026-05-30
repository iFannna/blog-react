"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-full text-text transition-[var(--transition-primary)] hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 25 18" fill="currentColor">
          <path d="M2.511 9.007l7.185-7.221c.407-.409.407-1.071 0-1.48s-1.068-.409-1.476 0L.306 8.259a1.049 1.049 0 000 1.481l7.914 7.952c.407.408 1.068.408 1.476 0s.407-1.07 0-1.479L2.511 9.007z" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1 8h28.001a1.001 1.001 0 010 2H1a1 1 0 110-2z" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((item, i) =>
        item === "..." ? (
          <span
            key={`dots-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-text-light"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-[var(--transition-primary)] ${
              item === currentPage
                ? "bg-primary text-white shadow-btn"
                : "text-text hover:bg-primary hover:text-white"
            }`}
          >
            {item}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-full text-text transition-[var(--transition-primary)] hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 25 18" fill="currentColor">
          <path d="M22.489 9.007l-7.185-7.221c-.407-.409-.407-1.071 0-1.48s1.068-.409 1.476 0l7.914 7.952a1.049 1.049 0 010 1.481l-7.914 7.952c-.407.408-1.068.408-1.476 0s-.407-1.07 0-1.479l7.185-7.203z" />
          <path fillRule="evenodd" clipRule="evenodd" d="M29.001 8H1a1.001 1.001 0 010 2h28.001a1 1 0 000-2z" />
        </svg>
      </button>
    </nav>
  );
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [current];

  if (current + 1 <= total) pages.push(current + 1);
  if (current + 2 <= total) pages.push(current + 2);
  if (current + 2 < total) pages.push("...");
  if (current + 2 < total) pages.push(total);

  return pages;
}
