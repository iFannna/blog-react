"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = inputRef.current?.value;
    if (q?.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="search"
        className="search-input"
        aria-label="搜索文章"
      />
      <button type="submit" className="sidebar-search-btn" aria-label="搜索">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" />
        </svg>
      </button>
    </form>
  );
}
