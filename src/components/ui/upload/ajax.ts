import {
  isArray,
  isNil,
  isString,
} from "./utils";
import type {
  UploadProgressEvent,
  UploadRequestHandler,
  UploadRequestOptions,
} from "./types";

const SCOPE = "ElUpload";

/** 对应官方 upload/src/ajax.ts 的 UploadAjaxError，携带状态码与请求信息。 */
export class UploadAjaxError extends Error {
  name = "UploadAjaxError";
  status: number;
  method: string;
  url: string;

  constructor(message: string, status: number, method: string, url: string) {
    super(message);
    this.status = status;
    this.method = method;
    this.url = url;
  }
}

function getError(
  action: string,
  option: UploadRequestOptions,
  xhr: XMLHttpRequest,
) {
  let msg: string;
  const response = xhr.response as { error?: string } | string | null;

  if (response) {
    msg =
      typeof response === "object"
        ? `${response.error || response}`
        : `${response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to ${option.method} ${action} ${xhr.status}`;
  }

  return new UploadAjaxError(msg, xhr.status, option.method, action);
}

/** 响应体优先按 JSON 解析，失败则原样返回文本。 */
function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response;
  if (!text) return text;

  try {
    return JSON.parse(text as string);
  } catch {
    return text;
  }
}

/**
 * 对应官方 ajaxUpload：默认的 XMLHttpRequest 上传实现。
 * 通过 http-request 属性可整体替换。
 */
export const ajaxUpload: UploadRequestHandler = (option) => {
  if (typeof XMLHttpRequest === "undefined") {
    throw new Error(`${SCOPE} XMLHttpRequest is undefined`);
  }

  const xhr = new XMLHttpRequest();
  const action = option.action;

  if (xhr.upload) {
    xhr.upload.addEventListener("progress", (evt) => {
      const progressEvt = evt as UploadProgressEvent;
      progressEvt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0;
      option.onProgress(progressEvt);
    });
  }

  const formData = new FormData();
  if (option.data) {
    for (const [key, value] of Object.entries(option.data)) {
      if (isArray(value)) {
        // 二元组 [Blob, filename] 表达「带文件名的附件」
        if (value.length === 2 && value[0] instanceof Blob && isString(value[1])) {
          formData.append(key, value[0], value[1]);
        } else {
          value.forEach((item) => formData.append(key, item as string | Blob));
        }
      } else if (typeof value === "number") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value as string | Blob);
      }
    }
  }
  formData.append(option.filename, option.file, option.file.name);

  xhr.addEventListener("error", () => {
    option.onError(getError(action, option, xhr));
  });

  xhr.addEventListener("load", () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr));
    }
    option.onSuccess(getBody(xhr));
  });

  xhr.open(option.method, action, true);

  if (option.withCredentials && "withCredentials" in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};
  if (headers instanceof Headers) {
    headers.forEach((value, key) => xhr.setRequestHeader(key, value));
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (isNil(value)) continue;
      xhr.setRequestHeader(key, String(value));
    }
  }

  xhr.send(formData);
  return xhr;
};
