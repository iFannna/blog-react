"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";

// 侧边栏操作区，根据登录态展示 设置/登录/注册 或 设置/退出
export default function SidebarOperations() {
  const { isAuthenticated, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="sidebar-widget">
      <div className="sidebar-widget-title">操作</div>
      <ul className="sidebar-meta-list">
        <li>
          <Link href="/settings" className="sidebar-meta-link">设置</Link>
        </li>
        {isAuthenticated ? (
          <li>
            <Link
              href="#"
              className="sidebar-meta-link"
              onClick={(e) => {
                e.preventDefault();
                handleSignOut();
              }}
              aria-disabled={signingOut}
            >
              {signingOut ? "退出中…" : "退出"}
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login" className="sidebar-meta-link">登录</Link>
            </li>
            <li>
              <Link href="/register" className="sidebar-meta-link">注册</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
