"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useInfiniteScroll } from "@/components/element-plus/infinite-scroll";

const listStyle: CSSProperties = {
  height: 300,
  padding: 0,
  margin: 0,
  overflow: "auto",
  listStyle: "none",
};

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 50,
  margin: 10,
  background: "var(--el-color-primary-light-9)",
  color: "var(--el-color-primary)",
};

const wrapperStyle: CSSProperties = {
  height: 300,
  overflow: "auto",
  textAlign: "center",
};

const dangerItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 50,
  background: "var(--el-color-danger-light-9)",
  color: "var(--el-color-danger)",
};

const plainListStyle: CSSProperties = {
  padding: 0,
  margin: 0,
  listStyle: "none",
};

export function InfiniteScrollBasic() {
  const [count, setCount] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useInfiniteScroll(listRef, {
    onLoad: () => setCount((value) => value + 2),
  });

  return (
    <ul ref={listRef} className="infinite-list" style={listStyle}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index + 1} className="infinite-list-item" style={itemStyle}>
          {index + 1}
        </li>
      ))}
    </ul>
  );
}

export function InfiniteScrollDisableLoading() {
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const noMore = count >= 20;
  const disabled = loading || noMore;
  const listRef = useRef<HTMLUListElement>(null);

  useInfiniteScroll(listRef, {
    disabled,
    onLoad: () => {
      setLoading(true);
      window.setTimeout(() => {
        setCount((value) => value + 2);
        setLoading(false);
      }, 2000);
    },
  });

  return (
    <div className="infinite-list-wrapper" style={wrapperStyle}>
      <ul ref={listRef} className="list" style={plainListStyle}>
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index + 1}
            className="list-item"
            style={index > 0 ? { ...dangerItemStyle, marginTop: 10 } : dangerItemStyle}
          >
            {index + 1}
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {noMore && <p>No more</p>}
    </div>
  );
}
