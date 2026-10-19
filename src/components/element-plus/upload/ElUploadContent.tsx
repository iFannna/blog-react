"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { UploadContext } from "./constants";
import { ajaxUpload } from "./ajax";
import { ElUploadDragger } from "./ElUploadDragger";
import { useFormDisabled } from "../form/use-form";
import { genFileId } from "./uid";
import type {
  ListType,
  UploadBeforeUploadResult,
  UploadData,
  UploadDataInput,
  UploadFile,
  UploadProgressEvent,
  UploadRawFile,
  UploadRequestHandler,
  UploadRequestOptions,
  UploadUserFile,
} from "./types";

export interface UploadContentProps {
  action: string;
  headers?: Headers | Record<string, string | number | null | undefined>;
  method?: string;
  data?: UploadDataInput;
  name?: string;
  multiple?: boolean;
  accept?: string;
  directory?: boolean;
  withCredentials?: boolean;
  /** 是否开启拖拽区，对应官方 drag */
  drag?: boolean;
  listType?: ListType;
  disabled?: boolean;
  beforeUpload?: (
    rawFile: UploadRawFile,
  ) => UploadBeforeUploadResult | Promise<UploadBeforeUploadResult>;
  httpRequest?: UploadRequestHandler;
  autoUpload?: boolean;
  limit?: number;
  /** 当前列表长度，仅用于超限判断，对应官方 props.fileList.length */
  fileCount: number;
  /** 当前列表快照，作为 onExceed 的第二个参数 */
  fileList: UploadUserFile[];
  onStart: (rawFile: UploadRawFile) => void;
  onProgress: (evt: UploadProgressEvent, rawFile: UploadRawFile) => void;
  onSuccess: (response: unknown, rawFile: UploadRawFile) => void;
  onError: (error: Error, rawFile: UploadRawFile) => void;
  onRemove: (rawFile: UploadRawFile) => void;
  onExceed: (files: File[], uploadFiles: UploadUserFile[]) => void;
  children?: ReactNode;
}

export interface UploadContentExpose {
  /** 取消上传：传 file 只取消该文件，省略则取消全部 */
  abort: (file?: UploadFile) => void;
  /** 手动发起某个文件的上传，供 ElUpload 的 submit 调用 */
  upload: (rawFile: UploadRawFile) => Promise<void>;
}

/**
 * 对应官方 ElUploadContent。
 *
 * 负责 input[type=file] 的选取、before-upload 钩子、http-request 的调用与中止，
 * 以及拖拽区的挂载；文件列表状态由外层的 ElUpload 维护。
 */
export const ElUploadContent = forwardRef<
  UploadContentExpose,
  UploadContentProps
>(function ElUploadContent(
  {
    action,
    headers,
    method = "post",
    data = {},
    name = "file",
    multiple,
    accept = "",
    directory,
    withCredentials,
    drag,
    listType = "text",
    disabled: disabledProp,
    beforeUpload,
    httpRequest = ajaxUpload,
    autoUpload = true,
    limit,
    fileCount,
    fileList,
    onStart,
    onProgress,
    onSuccess,
    onError,
    onRemove,
    onExceed,
    children,
  },
  ref,
) {
  const disabled = useFormDisabled(disabledProp);
  const inputRef = useRef<HTMLInputElement>(null);
  // 官方用 uid 作为 key 记录在途请求，Promise 形态的自定义 request 也能被 abort 跟踪
  const requestMap = useRef<Record<string, XMLHttpRequest | Promise<unknown>>>(
    {},
  );

  // 官方模板里 webkitdirectory 只在开启 directory 时渲染该属性，
  // React 的类型定义未收录该非标准属性，故用 DOM API 同步。
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (directory) {
      input.setAttribute("webkitdirectory", "");
    } else {
      input.removeAttribute("webkitdirectory");
    }
  }, [directory]);

  const resolveData = async (
    source: UploadDataInput,
    rawFile: UploadRawFile,
  ): Promise<UploadData> => {
    if (typeof source === "function") return source(rawFile);
    return source;
  };

  const doUpload = async (
    rawFile: UploadRawFile,
    beforeData?: UploadDataInput,
  ) => {
    let resolved: UploadData;
    try {
      resolved = await resolveData(beforeData ?? data, rawFile);
    } catch {
      // 官方：data 解析失败视为放弃该次上传
      onRemove(rawFile);
      return;
    }

    const { uid } = rawFile;
    const options: UploadRequestOptions = {
      headers: headers || {},
      withCredentials: Boolean(withCredentials),
      file: rawFile,
      data: resolved,
      method,
      filename: name,
      action,
      onProgress: (evt) => onProgress(evt, rawFile),
      onSuccess: (response) => {
        onSuccess(response, rawFile);
        delete requestMap.current[String(uid)];
      },
      onError: (error) => {
        onError(error, rawFile);
        delete requestMap.current[String(uid)];
      },
    };

    const request = httpRequest(options);
    requestMap.current[String(uid)] = request;
    // 自定义 http-request 返回 Promise 时，官方手动把结果接到 onSuccess / onError
    if (request instanceof Promise) {
      request.then(options.onSuccess, options.onError);
    }
  };

  const upload = async (rawFile: UploadRawFile): Promise<void> => {
    if (inputRef.current) inputRef.current.value = "";

    if (!beforeUpload) {
      await doUpload(rawFile);
      return;
    }

    let hookResult: UploadBeforeUploadResult;
    try {
      hookResult = await beforeUpload(rawFile);
    } catch {
      hookResult = false;
    }

    // 返回 false（或 reject）时中断上传，并把已加入列表的文件移除
    if (hookResult === false) {
      onRemove(rawFile);
      return;
    }

    let file: File = rawFile;
    if (hookResult instanceof Blob) {
      file =
        hookResult instanceof File
          ? hookResult
          : new File([hookResult], rawFile.name, { type: rawFile.type });
    }

    await doUpload(
      Object.assign(file, { uid: rawFile.uid }) as UploadRawFile,
      data,
    );
  };

  const submitFiles = (files: UploadRawFile[]) => {
    if (files.length === 0) return;

    if (limit && fileCount + files.length > limit) {
      onExceed(files, fileList);
      return;
    }

    const queue = multiple ? files : files.slice(0, 1);

    for (const file of queue) {
      file.uid = genFileId();
      onStart(file);
      if (autoUpload) void upload(file);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    submitFiles(Array.from(files) as UploadRawFile[]);
  };

  const handleClick = () => {
    if (disabled) return;
    const input = inputRef.current;
    if (!input) return;
    // 先清空，保证再次选择同一个文件也能触发 change
    input.value = "";
    input.click();
  };

  useImperativeHandle(ref, () => ({
    abort(file?: UploadFile) {
      const entries = Object.entries(requestMap.current).filter(([uid]) =>
        file ? String(file.uid) === uid : true,
      );
      entries.forEach(([uid, request]) => {
        if (request instanceof XMLHttpRequest) request.abort();
        delete requestMap.current[uid];
      });
    },
    upload,
  }));

  const rootClasses = [
    "el-upload",
    `el-upload--${listType}`,
    drag && "is-drag",
    disabled && "is-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  // 官方通过 provide 把 accept / disabled 下发给任意深度的 ElUploadDragger，
  // 这里用同名 context 保持同构。
  const contextValue = useMemo(
    () => ({ accept, disabled }),
    [accept, disabled],
  );

  return (
    <UploadContext.Provider value={contextValue}>
      <div
        className={rootClasses}
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled}
        role="button"
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "Enter" || event.key === " ") handleClick();
        }}
      >
        {drag ? (
          <ElUploadDragger
            onFile={submitFiles}
            directory={directory}
          >
            {children}
          </ElUploadDragger>
        ) : (
          children
        )}

        <input
          ref={inputRef}
          className="el-upload__input"
          name={name}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          type="file"
          onChange={handleChange}
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    </UploadContext.Provider>
  );
});
