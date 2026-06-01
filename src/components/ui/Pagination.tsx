"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
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

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => `/?page=${page}`;

  return (
    <div className="pagination-container">
      <nav className="navigation pagination" aria-label="Pagination">
        <div className="nav-links">
          {currentPage > 1 && (
            <Link href={buildHref(currentPage - 1)} className="prev page-numbers" aria-label="Previous page">
              <button type="button" className="pagination-arrow left-arrow" aria-hidden="true">
                {ARROW_SVG}
              </button>
            </Link>
          )}

          {totalPages <= 3 ? (
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <span
                key={page}
                className={`page-numbers page-number${page === currentPage ? " current" : ""}`}
              >
                {page}
              </span>
            ))
          ) : (
            <>
              <span className="page-numbers page-number current">
                {currentPage}
              </span>
              {[currentPage + 1, currentPage + 2]
                .filter((p) => p <= totalPages)
                .map((page) => (
                  <Link key={page} href={buildHref(page)} className="page-numbers page-number">
                    {page}
                  </Link>
                ))}
              {currentPage + 2 < totalPages && (
                <>
                  <span className="page-numbers dots">…</span>
                  <Link href={buildHref(totalPages)} className="page-numbers page-number">
                    {totalPages}
                  </Link>
                </>
              )}
            </>
          )}

          {currentPage < totalPages && (
            <Link href={buildHref(currentPage + 1)} className="next page-numbers" aria-label="Next page">
              <button type="button" className="pagination-arrow right-arrow" aria-hidden="true">
                {ARROW_SVG}
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
