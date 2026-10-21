import AuthForm from "@/components/blog/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "注册",
  description: "注册博客账号",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
