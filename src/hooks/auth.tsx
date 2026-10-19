"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { clearStoredAuth, getStoredAuth, setStoredAuth, type StoredAuth } from "@/services/storage";
import { logout as apiLogout } from "@/services/auth";
import { message } from "@/components/ui/message";

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

function toAuthUser(auth: StoredAuth): AuthUser {
  return { userId: auth.userId, username: auth.username };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored) return;
    queueMicrotask(() => {
      setUser(toAuthUser(stored));
    });
  }, []);

  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored || user) return;
    queueMicrotask(() => {
      setUser(toAuthUser(stored));
    });
  }, [pathname, user]);

  const signIn = useCallback((auth: StoredAuth, remember: boolean) => {
    setStoredAuth(auth, remember);
    setUser(toAuthUser(auth));
  }, []);

  const signOut = useCallback(async () => {
    await apiLogout().catch(() => {});
    clearStoredAuth();
    setUser(null);
    message.success("已退出登录");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 内使用");
  return ctx;
}
