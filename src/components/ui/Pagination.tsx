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

  const renderPageButton = (page: number) =>
    page === currentPage ? (
      <span key={page} className="page-numbers page-number current">
        {page}
      </span>
    ) : (
      <Link key={page} href={buildHref(page)} className="page-numbers page-number">
        {page}
      </Link>
    );

  const renderEllipsis = (side: string) => (
    <span key={`ellipsis-${side}`} className="page-numbers dots">…</span>
  );

  const WINDOW = 5;
  let pageButtons: React.ReactNode[];

  if (totalPages <= WINDOW + 2) {
    pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1).map(renderPageButton);
  } else {
    let start = currentPage - Math.floor(WINDOW / 2);
    let end = start + WINDOW - 1;

    if (start <= 1) {
      start = 2;
      end = start + WINDOW - 1;
    }
    if (end >= totalPages) {
      end = totalPages - 1;
      start = end - WINDOW + 1;
    }

    const windowPages = Array.from({ length: WINDOW }, (_, i) => start + i);
    const hasLeftEllipsis = start > 2;
    const hasRightEllipsis = end < totalPages - 1;

    pageButtons = [
      renderPageButton(1),
      ...(hasLeftEllipsis ? [renderEllipsis("left")] : []),
      ...windowPages.map(renderPageButton),
      ...(hasRightEllipsis ? [renderEllipsis("right")] : []),
      renderPageButton(totalPages),
    ];
  }

  return (
    <div className="pagination-container">
      <nav className="navigation pagination" aria-label="Pagination">
        <div className="nav-links">
          {currentPage > 1 && (
            <Link href={buildHref(currentPage - 1)} className="prev page-numbers" aria-label="Previous page">
              <span className="pagination-arrow left-arrow" aria-hidden="true">
                {ARROW_SVG}
              </span>
            </Link>
          )}

          {pageButtons}

          {currentPage < totalPages && (
            <Link href={buildHref(currentPage + 1)} className="next page-numbers" aria-label="Next page">
              <span className="pagination-arrow right-arrow" aria-hidden="true">
                {ARROW_SVG}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
