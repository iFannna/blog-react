"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { message } from "@/lib/message";
import { useAuth } from "@/lib/useAuth";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
  redirect?: string;
}

interface FieldErrors {
  nickname?: string;
  username?: string;
  password?: string;
  agreement?: string;
}

const isLoginMode = (mode: Mode) => mode === "login";

// 登录/注册共用表单：字段校验 + 提交 + 错误/成功态 + 互相切换
export default function AuthForm({ mode, redirect }: AuthFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // 输入任意内容即清除当前字段的错误提示
  function clearFieldError(field: keyof FieldErrors) {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  // 回车键：非最后一个文本输入框时跳转到下一个输入框，最后一个则提交表单
  function handleFieldKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const form = e.currentTarget.form;
    if (!form) return;
    const textInputs = form.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="password"]');
    const idx = Array.prototype.indexOf.call(textInputs, e.currentTarget);
    if (idx >= 0 && idx < textInputs.length - 1) {
      e.preventDefault();
      textInputs[idx + 1].focus();
    }
  }

  // 字段校验：注册需满足后端 binding 长度，登录仅校验非空
  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!username) {
      e.username = "请输入用户名";
    } else if (!isLoginMode(mode) && (username.length < 3 || username.length > 32)) {
      e.username = "用户名长度需为 3-32 位";
    }
    if (!password) {
      e.password = "请输入密码";
    } else if (!isLoginMode(mode) && (password.length < 6 || password.length > 32)) {
      e.password = "密码长度需为 6-32 位";
    }
    if (!isLoginMode(mode) && !nickname.trim()) {
      e.nickname = "请输入昵称";
    }
    if (!isLoginMode(mode) && !agreed) {
      e.agreement = "请阅读并同意服务条款和隐私政策";
    }
    return e;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMsg("");
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (isLoginMode(mode)) {
        const result = await login(username, password);
        signIn(
          {
            accessToken: result.access_token,
            userId: result.user_id,
            username: result.username,
          },
          remember,
        );
        message.success("登录成功");
        router.push(redirect || "/");
      } else {
        await register({ username, password, nickname: nickname.trim() });
        setSuccessMsg("注册成功，请登录");
      }
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "操作失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{isLoginMode(mode) ? "登录" : "注册"}</h1>

        {successMsg ? (
          <div className="auth-success">
            <p>{successMsg}</p>
            <Link href="/login" className="auth-link">前往登录</Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {!isLoginMode(mode) && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-nickname">昵称</label>
                <input
                  id="auth-nickname"
                  className={`auth-input${errors.nickname ? " is-error" : ""}`}
                  type="text"
                  value={nickname}
                  onChange={(e) => { setNickname(e.target.value); clearFieldError("nickname"); }}
                  onKeyDown={handleFieldKeyDown}
                  autoComplete="nickname"
                  disabled={submitting}
                />
                <p className="auth-field-error">{errors.nickname ?? ""}</p>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-username">用户名</label>
              <input
                id="auth-username"
                className={`auth-input${errors.username ? " is-error" : ""}`}
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearFieldError("username"); }}
                onKeyDown={handleFieldKeyDown}
                autoComplete="username"
                disabled={submitting}
              />
              <p className="auth-field-error">{errors.username ?? ""}</p>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-password">密码</label>
              <input
                id="auth-password"
                className={`auth-input${errors.password ? " is-error" : ""}`}
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                onKeyDown={handleFieldKeyDown}
                autoComplete={isLoginMode(mode) ? "current-password" : "new-password"}
                disabled={submitting}
              />
              <p className="auth-field-error">{errors.password ?? ""}</p>
            </div>

            {isLoginMode(mode) ? (
              <div className="auth-form-row">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  记住我
                </label>
                {/* 找回密码页待实现 */}
                <Link href="/forgot-password" className="auth-forgot">忘记密码？</Link>
              </div>
            ) : (
              <div className="auth-agreement-wrap">
                <div className="auth-agreement">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => { setAgreed(e.target.checked); clearFieldError("agreement"); }}
                  />
                  <span>
                    我已阅读并同意{" "}
                    {/* 服务条款 / 隐私政策页待实现 */}
                    <Link href="/terms" className="auth-agreement-link">服务条款</Link>{" "}
                    和{" "}
                    <Link href="/privacy" className="auth-agreement-link">隐私政策</Link>
                  </span>
                </div>
                <p className="auth-field-error">{errors.agreement ?? ""}</p>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? (isLoginMode(mode) ? "登录中…" : "注册中…") : (isLoginMode(mode) ? "登录" : "注册")}
            </button>
          </form>
        )}

        <p className="auth-footer">
          {isLoginMode(mode) ? (
            <>还没有账号？<Link href="/register" className="auth-link">立即注册</Link></>
          ) : (
            <>已有账号？<Link href="/login" className="auth-link">立即登录</Link></>
          )}
        </p>
        <Link href="/" className="auth-back">返回首页</Link>
      </div>
    </div>
  );
}
