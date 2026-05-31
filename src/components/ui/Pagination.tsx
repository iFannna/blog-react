"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ARROW_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 18">
    <path
      className="arrow-handle"
      d="M2.511 9.007l7.185-7.221c.407-.409.407-1.071 0-1.48s-1.068-.409-1.476 0L.306 8.259a1.049 1.049 0 000 1.481l7.914 7.952c.407.408 1.068.408 1.476 0s.407-1.07 0-1.479L2.511 9.007z"
    />
    <path
      className="arrow-bar"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 8h28.001a1.001 1.001 0 010 2H1a1 1 0 110-2z"
    />
  </svg>
);

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="bloglo-pagination">
      <nav className="navigation pagination" aria-label="Pagination">
        <div className="nav-links">
          {/* Prev arrow */}
          {currentPage > 1 && (
            <a
              className="prev page-numbers"
              role="button"
              tabIndex={0}
              onClick={() => onPageChange(currentPage - 1)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onPageChange(currentPage - 1);
              }}
              aria-label="Previous page"
            >
              <button type="button" className="bloglo-animate-arrow left-arrow" aria-hidden="true">
                {ARROW_SVG}
              </button>
            </a>
          )}

          {/* Page numbers */}
          {totalPages <= 3 ? (
            Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <span
                  key={page}
                  className={`page-numbers page-number${page === currentPage ? " current" : ""}`}
                >
                  {page}
                </span>
              ),
            )
          ) : (
            <>
              <span className="page-numbers page-number current">
                {currentPage}
              </span>
              {[currentPage + 1, currentPage + 2]
                .filter((p) => p <= totalPages)
                .map((page) => (
                  <span
                    key={page}
                    className="page-numbers page-number"
                    role="button"
                    tabIndex={0}
                    onClick={() => onPageChange(page)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onPageChange(page);
                    }}
                  >
                    {page}
                  </span>
                ))}
              {currentPage + 2 < totalPages && (
                <>
                  <span className="page-numbers dots">…</span>
                  <span
                    className="page-numbers page-number"
                    role="button"
                    tabIndex={0}
                    onClick={() => onPageChange(totalPages)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onPageChange(totalPages);
                    }}
                  >
                    {totalPages}
                  </span>
                </>
              )}
            </>
          )}

          {/* Next arrow */}
          {currentPage < totalPages && (
            <a
              className="next page-numbers"
              role="button"
              tabIndex={0}
              onClick={() => onPageChange(currentPage + 1)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onPageChange(currentPage + 1);
              }}
              aria-label="Next page"
            >
              <button type="button" className="bloglo-animate-arrow right-arrow" aria-hidden="true">
                {ARROW_SVG}
              </button>
            </a>
          )}
        </div>
      </nav>
    </div>
  );
}
