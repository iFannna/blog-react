"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initAliyunCaptcha, type AliyunCaptchaInstance } from "@/lib/aliyun-captcha";
import { login, register, sendVerifyCode } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { message } from "@/lib/message";
import { useAuth } from "@/lib/useAuth";

type Mode = "login" | "register";

const LOGIN_CAPTCHA_SCENE_ID = "8b8zkf7y";
const VERIFY_CAPTCHA_SCENE_ID = "1hh655v4";

interface AuthFormProps { mode: Mode; redirect?: string }

interface FieldErrors { username?: string; password?: string; email?: string; verifyCode?: string }

const CODE_COUNTDOWN = 60;
const isLoginMode = (mode: Mode) => mode === "login";

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
  const captchaRef = useRef<AliyunCaptchaInstance | null>(null);
  const loginBtnRef = useRef<HTMLButtonElement>(null);
  // 缓存最近一次通过人机验证的邮箱与凭证，同邮箱复用以避免重复弹窗
  const lastVerifiedRef = useRef<{ email: string; param: string } | null>(null);

  // 每帧同步最新表单值到 ref，供 SDK 挂载时刻注册的 success 回调读取
  const stateRef = useRef({ username, password, email, remember, codeCountdown });
  useEffect(() => {
    stateRef.current = { username, password, email, remember, codeCountdown };
  });

  // ── success 回调（函数声明在 useEffect 前，避免 lint no-use-before-define）──

  async function loginViaCaptcha(captchaVerifyParam: string) {
    const { username: u, password: p, remember: r } = stateRef.current;
    if (!u) { setErrors((prev) => ({ ...prev, username: "请输入用户名或邮箱" })); return; }
    if (!p) { setErrors((prev) => ({ ...prev, password: "请输入密码" })); return; }
    setSubmitting(true);
    try {
      const result = await login(u, p, captchaVerifyParam);
      signIn({ accessToken: result.access_token, userId: result.user_id, username: result.username }, r);
      message.success("登录成功");
      router.push(redirect || "/");
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "操作失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendCodeViaCaptcha(captchaVerifyParam: string) {
    const { email: e, codeCountdown: cd } = stateRef.current;
    if (cd > 0) return;
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setErrors((prev) => ({ ...prev, email: !e ? "请输入邮箱" : "邮箱格式不正确" }));
      return;
    }
    // 缓存本次验证对应的邮箱与凭证，同邮箱后续点击复用（不论业务成功/失败均不弹窗）
    lastVerifiedRef.current = { email: e, param: captchaVerifyParam };
    setCodeSending(true);
    try {
      await sendVerifyCode(e, captchaVerifyParam);
      message.success("验证码已发送");
      setCodeCountdown(CODE_COUNTDOWN);
      countdownRef.current = setInterval(() => {
        setCodeCountdown((n) => { if (n <= 1) { if (countdownRef.current) clearInterval(countdownRef.current); return 0; } return n - 1; });
      }, 1000);
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "发送失败，请稍后重试");
    } finally {
      setCodeSending(false);
    }
  }

  // ── 初始化验证码 ──
  useEffect(() => {
    const sceneId = isLoginMode(mode) ? LOGIN_CAPTCHA_SCENE_ID : VERIFY_CAPTCHA_SCENE_ID;
    if (!sceneId) return;

    // 登录：无痕验证必须 SDK 拦截真实点击，绑定到可见按钮 #auth-submit
    // 注册：一点即过用隐藏按钮，业务校验后 instance.show() 手动弹窗
    const triggerSel = isLoginMode(mode) ? "#auth-submit" : "#verify-captcha-btn";
    const triggerEl = document.querySelector(triggerSel);
    if (!triggerEl || triggerEl.getAttribute("data-captcha-bound")) return;
    triggerEl.setAttribute("data-captcha-bound", "1");

    initAliyunCaptcha({
      SceneId: sceneId,
      mode: "popup",
      element: "#captcha-element",
      button: triggerSel,
      language: "cn",
      success: (captchaVerifyParam) => {
        if (isLoginMode(mode)) {
          loginViaCaptcha(captchaVerifyParam);
        } else {
          sendCodeViaCaptcha(captchaVerifyParam);
        }
      },
      fail: () => { setSubmitting(false); setCodeSending(false); },
      onClose: () => { setSubmitting(false); setCodeSending(false); },
      getInstance: (i) => { captchaRef.current = i; },
    }).catch(() => { message.error("验证码组件加载失败，请刷新重试"); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ── 入口 ──

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoginMode(mode)) {
      const fieldErrors = validate();
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) return;
      // SDK 绑定在 #auth-submit 上，程序化 click 触发无痕验证（低风险静默通过 → success 回调）
      loginBtnRef.current?.click();
      return;
    }
    // 注册
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setSubmitting(true);
    try {
      await register({ username: email, password, email, verify_code: verifyCode });
      message.success("注册成功");
      router.push("/login");
    } catch (err) { message.error(err instanceof ApiError ? err.message : "操作失败，请稍后重试"); }
    finally { setSubmitting(false); }
  }

  function handleSendCode() {
    if (codeCountdown > 0) return;
    if (!email) { setErrors((prev) => ({ ...prev, email: "请输入邮箱" })); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrors((prev) => ({ ...prev, email: "邮箱格式不正确" })); return; }
    const cached = lastVerifiedRef.current;
    if (cached && cached.email === email) {
      // 同邮箱已通过人机验证（不论上次业务是否成功），复用缓存凭证，不再弹窗
      sendCodeViaCaptcha(cached.param);
      return;
    }
    // 换邮箱：清缓存并刷新 SDK，弹出新的验证
    if (cached) {
      lastVerifiedRef.current = null;
      captchaRef.current?.refresh();
    }
    captchaRef.current?.show();
  }

  // ── 校验 ──

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (isLoginMode(mode)) { if (!username) e.username = "请输入用户名或邮箱"; }
    else {
      if (!email) e.email = "请输入邮箱";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "邮箱格式不正确";
      if (!verifyCode) e.verifyCode = "请输入验证码";
      else if (!/^\d{6}$/.test(verifyCode)) e.verifyCode = "请输入有效验证码";
    }
    if (!password) e.password = "请输入密码";
    else if (!isLoginMode(mode) && (password.length < 6 || password.length > 32)) e.password = "密码长度需为 6-32 位";
    return e;
  }

  function clearFieldError(field: keyof FieldErrors) {
    setErrors((prev) => { if (!(field in prev)) return prev; const n = { ...prev }; delete n[field]; return n; });
  }

  function handleFieldKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const form = e.currentTarget.form;
    if (!form) return;
    const inputs = form.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="password"], input[type="email"]');
    const idx = Array.prototype.indexOf.call(inputs, e.currentTarget);
    if (idx >= 0 && idx < inputs.length - 1) { e.preventDefault(); inputs[idx + 1].focus(); }
  }

  function handleEmailBlur() { if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setErrors((p) => ({ ...p, email: "邮箱格式不正确" })); }
  function handlePasswordBlur() { if (!isLoginMode(mode) && password && (password.length < 6 || password.length > 32)) setErrors((p) => ({ ...p, password: "密码长度需为 6-32 位" })); }
  function handleVerifyCodeBlur() { if (verifyCode && !/^\d{6}$/.test(verifyCode)) setErrors((p) => ({ ...p, verifyCode: "请输入有效验证码" })); }

  // ── JSX ──

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{isLoginMode(mode) ? "登录" : "注册"}</h1>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {isLoginMode(mode) ? (
            <div className="auth-field">
              <span className="auth-label">用户名/邮箱</span>
              <input className={`auth-input${errors.username ? " is-error" : ""}`} type="text"
                value={username} onChange={(e) => { setUsername(e.target.value); clearFieldError("username"); }}
                onKeyDown={handleFieldKeyDown} autoComplete="username" disabled={submitting} />
              <p className="auth-field-error">{errors.username ?? ""}</p>
            </div>
          ) : (
            <div className="auth-field">
              <span className="auth-label">邮箱</span>
              <input className={`auth-input${errors.email ? " is-error" : ""}`} type="email"
                value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                onBlur={handleEmailBlur} onKeyDown={handleFieldKeyDown} autoComplete="email" disabled={submitting} />
              <p className="auth-field-error">{errors.email ?? ""}</p>
            </div>
          )}
          <div className="auth-field">
            <span className="auth-label">密码</span>
            <input className={`auth-input${errors.password ? " is-error" : ""}`} type="password"
              value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
              onBlur={handlePasswordBlur} onKeyDown={handleFieldKeyDown}
              autoComplete={isLoginMode(mode) ? "current-password" : "new-password"} disabled={submitting} />
            <p className="auth-field-error">{errors.password ?? ""}</p>
          </div>

          {isLoginMode(mode) ? (
            <div className="auth-form-row">
              <label className="auth-remember"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />记住我</label>
              <Link href="/forgot-password" className="auth-forgot">忘记密码？</Link>
            </div>
          ) : (
            <div className="auth-field">
              <span className="auth-label">验证码</span>
              <div className="auth-verify-row">
                <input className={`auth-input${errors.verifyCode ? " is-error" : ""}`} type="text"
                  value={verifyCode} onChange={(e) => { setVerifyCode(e.target.value); clearFieldError("verifyCode"); }}
                  onBlur={handleVerifyCodeBlur} onKeyDown={handleFieldKeyDown} autoComplete="one-time-code" disabled={submitting} />
                <button type="button" className="auth-verify-btn"
                  disabled={codeCountdown > 0 || codeSending || submitting} onClick={handleSendCode}>
                  {codeSending ? "发送中…" : codeCountdown > 0 ? `${codeCountdown}s 后重试` : "获取验证码"}
                </button>
              </div>
              <p className="auth-field-error">{errors.verifyCode ?? ""}</p>
            </div>
          )}

          <div id="captcha-element" />
          {!isLoginMode(mode) && <button type="button" id="verify-captcha-btn" hidden />}

          {isLoginMode(mode) ? (
            <>
              <button type="submit" hidden />
              <button type="button" id="auth-submit" ref={loginBtnRef} className="auth-submit" disabled={submitting}>
                {submitting ? "登录中…" : "登录"}
              </button>
            </>
          ) : (
            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "注册中…" : "注册"}
            </button>
          )}
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
