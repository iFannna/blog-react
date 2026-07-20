"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { clearStoredAuth, getStoredAuth, setStoredAuth, type StoredAuth } from "@/lib/auth";
import { logout as apiLogout } from "@/lib/api/auth";
import { message } from "@/lib/message";

interface AuthUser {
  userId: number;
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (auth: StoredAuth, remember: boolean) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 全站登录态。初始 user=null 与 SSR 一致，避免 hydration 不匹配；挂载后从本地存储恢复。
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const userRef = useRef(user);
  userRef.current = user;

  // 首次挂载恢复
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) setUser({ userId: stored.userId, username: stored.username });
  }, []);

  // 路由切换时兜底恢复：部分页面（如 404）可能导致 layout 子树重建，state 可能丢失。
  // 此时从 storage 重新读取，确保登录态不因渲染树重建而消失
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored && !userRef.current) {
      setUser({ userId: stored.userId, username: stored.username });
    }
  }, [pathname]);

  const signIn = useCallback((auth: StoredAuth, remember: boolean) => {
    setStoredAuth(auth, remember);
    setUser({ userId: auth.userId, username: auth.username });
  }, []);

  const signOut = useCallback(async () => {
    await apiLogout().catch(() => {});
    clearStoredAuth();
    setUser(null);
    message.success("已退出登录");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 内使用");
  return ctx;
}
