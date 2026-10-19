"use client";

import { useState } from "react";
import { ElPagination } from "@/components/ui/pagination";

const stack = { display: "grid", gap: "1.6rem" };

export function PaginationBasic() {
  const [page, setPage] = useState(1);
  return (
    <ElPagination
      total={400}
      currentPage={page}
      onCurrentPageChange={setPage}
      layout="prev, pager, next"
    />
  );
}

export function PaginationMore() {
  const [page, setPage] = useState(1);
  return (
    <ElPagination
      total={400}
      currentPage={page}
      onCurrentPageChange={setPage}
      layout="prev, pager, next, jumper, ->, total, sizes"
      pageSizes={[100, 200, 300, 400]}
    />
  );
}

export function PaginationPagerCount() {
  const [page, setPage] = useState(1);
  return (
    <div style={stack}>
      {[7, 11, 13].map((count) => (
        <ElPagination
          key={count}
          total={1000}
          currentPage={page}
          onCurrentPageChange={setPage}
          pagerCount={count}
          layout="prev, pager, next"
        />
      ))}
    </div>
  );
}

export function PaginationBackground() {
  const [page, setPage] = useState(1);
  return (
    <ElPagination
      total={400}
      currentPage={page}
      onCurrentPageChange={setPage}
      background
      layout="prev, pager, next"
    />
  );
}

export function PaginationSmall() {
  const [page, setPage] = useState(1);
  return (
    <ElPagination
      total={400}
      currentPage={page}
      onCurrentPageChange={setPage}
      small
      layout="prev, pager, next"
    />
  );
}

export function PaginationHideOnSinglePage() {
  return (
    <ElPagination total={10} hideOnSinglePage layout="prev, pager, next" />
  );
}
