"use client";

import { useState, useEffect, useCallback } from "react";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(() => {
    const y =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    setVisible(y > 450);
  }, []);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(onScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onScroll]);

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {
      const step = () => {
        const pos =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (pos > 0) {
          window.scrollTo(0, Math.floor(pos - pos / 8));
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }
  };

  const arrowPath =
    "M24.958 18.491l-8.008-8.008a1.29 1.29 0 00-1.868 0l-8.008 8.008c-.534.534-.534 1.335 0 1.868s1.335.534 1.868 0l7.074-7.074 7.074 7.074c.267.267.667.4.934.4s.667-.133.934-.4a1.29 1.29 0 000-1.868z";

  return (
    <button
      id="scroll-top"
      type="button"
      className={`scroll-top ${visible ? "scroll-top--visible" : ""}`}
      tabIndex={visible ? 0 : -1}
      aria-label="回到顶部"
      title="回到顶部"
      onClick={scrollToTop}
    >
      <span className="scroll-top-icon" aria-hidden="true">
        <svg
          className="scroll-top-arrow top-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path d={arrowPath} />
        </svg>
        <svg
          className="scroll-top-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path d={arrowPath} />
        </svg>
      </span>
    </button>
  );
}
