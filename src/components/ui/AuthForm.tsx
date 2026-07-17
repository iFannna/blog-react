"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register, sendVerifyCode } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { message } from "@/lib/message";
import { useAuth } from "@/lib/useAuth";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
  redirect?: string;
}

interface FieldErrors {
  username?: string;
  password?: string;
  email?: string;
  verifyCode?: string;
}

const CODE_COUNTDOWN = 60;

const isLoginMode = (mode: Mode) => mode === "login";

// 登录/注册共用表单：字段校验 + 提交 + 错误/成功态 + 互相切换
export default function AuthForm({ mode, redirect }: AuthFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval>>(null);

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
    const textInputs = form.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="password"], input[type="email"]');
    const idx = Array.prototype.indexOf.call(textInputs, e.currentTarget);
    if (idx >= 0 && idx < textInputs.length - 1) {
      e.preventDefault();
      textInputs[idx + 1].focus();
    }
  }

  // 邮箱失焦时校验格式，有内容但格式不对则提示
  function handleEmailBlur() {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "邮箱格式不正确" }));
    }
  }

  // 密码失焦时校验长度，有内容但长度不对则提示（仅注册模式）
  function handlePasswordBlur() {
    if (!isLoginMode(mode) && password && (password.length < 6 || password.length > 32)) {
      setErrors((prev) => ({ ...prev, password: "密码长度需为 6-32 位" }));
    }
  }

  // 验证码失焦时校验格式，有内容但不是 6 位数字则提示
  function handleVerifyCodeBlur() {
    if (verifyCode && !/^\d{6}$/.test(verifyCode)) {
      setErrors((prev) => ({ ...prev, verifyCode: "请输入有效验证码" }));
    }
  }
  async function handleSendCode() {
    if (codeCountdown > 0) return;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "请输入邮箱" }));
      return;
    }
    setCodeSending(true);
    try {
      await sendVerifyCode(email);
      message.success("验证码已发送");
      setCodeCountdown(CODE_COUNTDOWN);
      countdownRef.current = setInterval(() => {
        setCodeCountdown((n) => {
          if (n <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return n - 1;
        });
      }, 1000);
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "发送失败，请稍后重试");
    } finally {
      setCodeSending(false);
    }
  }

  // 字段校验：登录仅校验非空；注册校验邮箱 + 密码 + 验证码
  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (isLoginMode(mode)) {
      if (!username) {
        e.username = "请输入用户名或邮箱";
      }
    } else {
      if (!email) {
        e.email = "请输入邮箱";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        e.email = "邮箱格式不正确";
      }
      if (!verifyCode) {
        e.verifyCode = "请输入验证码";
      } else if (!/^\d{6}$/.test(verifyCode)) {
        e.verifyCode = "请输入有效验证码";
      }
    }
    if (!password) {
      e.password = "请输入密码";
    } else if (!isLoginMode(mode) && (password.length < 6 || password.length > 32)) {
      e.password = "密码长度需为 6-32 位";
    }
    return e;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        // 注册以邮箱作为用户名
        await register({ username: email, password, email, verify_code: verifyCode });
        message.success("注册成功");
        router.push("/login");
      }
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "操作失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  const renderLoginExtra = () => (
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
  );

  const renderRegisterExtra = () => (
    <>
      <div className="auth-field">
        <span className="auth-label">验证码</span>
        <div className="auth-verify-row">
          <input
            className={`auth-input${errors.verifyCode ? " is-error" : ""}`}
            type="text"
            value={verifyCode}
            onChange={(e) => { setVerifyCode(e.target.value); clearFieldError("verifyCode"); }}
            onBlur={handleVerifyCodeBlur}
            onKeyDown={handleFieldKeyDown}
            autoComplete="one-time-code"
            disabled={submitting}
          />
          <button
            type="button"
            className="auth-verify-btn"
            disabled={codeCountdown > 0 || codeSending || submitting}
            onClick={handleSendCode}
          >
            {codeSending
              ? "发送中…"
              : codeCountdown > 0
                ? `${codeCountdown}s 后重试`
                : "获取验证码"}
          </button>
        </div>
        <p className="auth-field-error">{errors.verifyCode ?? ""}</p>
      </div>
    </>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{isLoginMode(mode) ? "登录" : "注册"}</h1>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {isLoginMode(mode) ? (
            <div className="auth-field">
              <span className="auth-label">用户名/邮箱</span>
              <input
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
          ) : (
            <div className="auth-field">
              <span className="auth-label">邮箱</span>
              <input
                className={`auth-input${errors.email ? " is-error" : ""}`}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                onBlur={handleEmailBlur}
                onKeyDown={handleFieldKeyDown}
                autoComplete="email"
                disabled={submitting}
              />
              <p className="auth-field-error">{errors.email ?? ""}</p>
            </div>
          )}

          <div className="auth-field">
            <span className="auth-label">密码</span>
            <input
              className={`auth-input${errors.password ? " is-error" : ""}`}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
              onBlur={handlePasswordBlur}
              onKeyDown={handleFieldKeyDown}
              autoComplete={isLoginMode(mode) ? "current-password" : "new-password"}
              disabled={submitting}
            />
            <p className="auth-field-error">{errors.password ?? ""}</p>
          </div>

          {isLoginMode(mode) ? renderLoginExtra() : renderRegisterExtra()}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? (isLoginMode(mode) ? "登录中…" : "注册中…") : (isLoginMode(mode) ? "登录" : "注册")}
          </button>
        </form>

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
