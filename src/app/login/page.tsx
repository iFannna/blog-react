import AuthForm from "@/components/ui/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录",
  description: "登录博客",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <AuthForm mode="login" redirect={redirect} />;
}
