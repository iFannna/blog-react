// 阿里云验证码 2.0 Web SDK 封装。严格遵循官方文档三步接入流程

const CAPTCHA_SDK_URL = "https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js";

export interface AliyunCaptchaInstance {
  show: () => void;
  hide: () => void;
  refresh: () => void;
  destroyCaptcha: () => void;
}

export interface AliyunCaptchaOptions {
  SceneId: string;
  mode: "popup" | "embed";
  element: string;
  button: string;
  success: (captchaVerifyParam: string) => void;
  fail?: (result: { code: string; msg: string }) => void;
  getInstance?: (instance: AliyunCaptchaInstance) => void;
  onClose?: () => void;
  onError?: (error: { code: string; msg: string }) => void;
  slideStyle?: { width: number; height: number };
  language?: string;
  timeout?: number;
  rem?: number;
  disableMaskClick?: boolean;
  delayBeforeSuccess?: boolean;
}

declare global {
  interface Window {
    AliyunCaptchaConfig?: { region: string; prefix: string };
    initAliyunCaptcha?: (options: AliyunCaptchaOptions) => void;
  }
}

let loadPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("captcha only in browser"));
  if (window.initAliyunCaptcha) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CAPTCHA_SDK_URL;
    script.async = true;
    script.onload = () => {
      if (window.initAliyunCaptcha) resolve();
      else reject(new Error("验证码组件加载失败"));
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("验证码组件加载失败"));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

// initAliyunCaptcha 严格按官方文档：步骤1设全局配置 → 步骤2加载SDK → 步骤3初始化
export async function initAliyunCaptcha(options: AliyunCaptchaOptions): Promise<AliyunCaptchaInstance> {
  // 步骤1：SDK 加载前设置全局配置（官方要求，region+prefix 必填）
  window.AliyunCaptchaConfig = { region: "cn", prefix: "1afws2" };

  // 步骤2：加载 SDK
  await loadSdk();
  if (!window.initAliyunCaptcha) throw new Error("验证码组件未就绪");

  // 步骤3：初始化，通过 getInstance 返回实例
  return new Promise<AliyunCaptchaInstance>((resolve, reject) => {
    window.initAliyunCaptcha!({
      ...options,
      getInstance: (instance) => {
        options.getInstance?.(instance);
        resolve(instance);
      },
      onError: (error) => {
        options.onError?.(error);
        reject(new Error(`${error.code}: ${error.msg}`));
      },
    });
  });
}
