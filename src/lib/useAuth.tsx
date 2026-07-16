"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { clearStoredAuth, getStoredAuth, setStoredAuth, type StoredAuth } from "@/lib/auth";
import { logout as apiLogout } from "@/lib/api/auth";

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

// 全站登录态。初始 user=null 与 SSR 一致，避免 hydration 不匹配；挂载后再从本地存储恢复。
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) setUser({ userId: stored.userId, username: stored.username });
  }, []);

  const signIn = useCallback((auth: StoredAuth, remember: boolean) => {
    setStoredAuth(auth, remember);
    setUser({ userId: auth.userId, username: auth.username });
  }, []);

  const signOut = useCallback(async () => {
    // 先带 token 调后端登出（黑名单 access token / 清 refresh）；失败也忽略，照常清本地态
    await apiLogout().catch(() => {});
    clearStoredAuth();
    setUser(null);
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
