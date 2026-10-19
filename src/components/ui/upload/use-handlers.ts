"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { genFileId } from "./uid";
import type {
  Awaitable,
  ListType,
  UploadFile,
  UploadFiles,
  UploadProgressEvent,
  UploadRawFile,
  UploadStatus,
  UploadUserFile,
} from "./types";

const SCOPE = "ElUpload";

/** 对应官方 use-handlers.ts 的 revokeFileObjectURL。 */
export const revokeFileObjectURL = (file: UploadFile) => {
  if (file.url?.startsWith("blob:")) {
    URL.revokeObjectURL(file.url);
  }
};

/**
 * 把用户传入的 file-list 规范成内部列表：缺 uid 补 uid，缺 status 补 success。
 * 对应官方 useHandlers 里对 uploadFiles 的 immediate deep watch。
 */
function normalizeFiles(files: UploadUserFile[]): UploadFiles {
  return files.map((file) => ({
    ...file,
    uid: file.uid || genFileId(),
    status: file.status || "success",
  }));
}

/** 只比较 uid 序列，避免把同一份列表反复当作新值重置。 */
function isSameList(a: UploadFiles, b: UploadFiles) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((file, index) => file.uid === b[index]?.uid);
}

export interface UseHandlersOptions {
  /** 受控列表，对应官方 v-model:file-list */
  fileList?: UploadUserFile[];
  /** 列表变化时回抛，对应官方 v-model:file-list 的 update 事件 */
  onFileListChange?: (files: UploadFiles) => void;
  listType: ListType;
  beforeRemove?: (
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => Awaitable<boolean>;
  onRemove?: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  onChange?: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  onSuccess?: (
    response: unknown,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => void;
  onProgress?: (
    evt: UploadProgressEvent,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => void;
  onError?: (
    error: Error,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => void;
  /** 取消在途请求，由 ElUploadContent 提供 */
  abortRequest: (file?: UploadFile) => void;
  /** 手动发起上传，由 ElUploadContent 提供 */
  uploadRequest: (rawFile: UploadRawFile) => void;
}

/**
 * 对应官方 upload/src/use-handlers.ts：文件列表状态与各生命周期钩子的编排。
 *
 * 与 Vue 版的差别在于状态更新方式：官方直接改对象字段靠响应式触发，
 * 这里统一走不可变更新（新数组、新文件对象）以触发 React 重渲染；
 * 每次内部变更都会经 apply 回抛，受控父组件可据此同步 file-list。
 */
export function useHandlers(options: UseHandlersOptions) {
  const {
    fileList,
    onFileListChange,
    listType,
    beforeRemove,
    onRemove,
    onChange,
    onSuccess,
    onProgress,
    onError,
    abortRequest,
    uploadRequest,
  } = options;

  const [files, setFiles] = useState<UploadFiles>(() =>
    normalizeFiles(fileList ?? []),
  );

  // 回调里要读最新列表，但回调本身可能是稳定引用，故用 ref 保持同步。
  // ref 的写入统一放在 apply / 外部同步里，避免在 render 期间改 ref。
  const filesRef = useRef<UploadFiles>(files);

  // 最近一次由外部传入的列表引用，用于识别父组件是否更新了 file-list
  const externalRef = useRef<UploadUserFile[] | undefined>(fileList);

  useEffect(() => {
    if (externalRef.current === fileList) return;
    externalRef.current = fileList;
    if (fileList === undefined) return;

    const next = normalizeFiles(fileList);
    // 内部变更回抛后父组件写回的仍是同一批文件，uid 相同则跳过，避免多余渲染
    if (isSameList(next, filesRef.current)) return;
    filesRef.current = next;
    setFiles(next);
  }, [fileList]);

  // 卸载时释放所有 blob URL，对应官方 onBeforeUnmount
  useEffect(() => {
    const snapshot = filesRef;
    return () => snapshot.current.forEach(revokeFileObjectURL);
  }, []);

  // 内部变更的统一出口：更新 state、同步 ref、回抛给受控父组件
  const apply = useCallback(
    (next: UploadFiles) => {
      filesRef.current = next;
      setFiles(next);
      onFileListChange?.(next);
      return next;
    },
    [onFileListChange],
  );

  const getFile = useCallback(
    (rawFile: UploadRawFile) =>
      filesRef.current.find((file) => file.uid === rawFile.uid),
    [],
  );

  const changed = useCallback(
    (file: UploadFile, list: UploadFiles) => onChange?.(file, list),
    [onChange],
  );

  /** 对应官方 abort：取消在途请求，传 file 只取消该文件。 */
  const abort = useCallback(
    (file?: UploadFile) => abortRequest(file),
    [abortRequest],
  );

  /** 对应官方 clearFiles：默认清空全部状态的文件。 */
  const clearFiles = useCallback(
    (states: UploadStatus[] = ["ready", "uploading", "success", "fail"]) => {
      apply(filesRef.current.filter((row) => !states.includes(row.status)));
    },
    [apply],
  );

  const handleStart = useCallback(
    (file: UploadRawFile) => {
      if (file.uid === undefined || file.uid === null) file.uid = genFileId();

      const uploadFile: UploadFile = {
        name: file.name,
        percentage: 0,
        status: "ready",
        size: file.size,
        raw: file,
        uid: file.uid,
      };

      // 图片类列表需要缩略图，直接用 blob URL 指向本地文件
      if (listType === "picture-card" || listType === "picture") {
        try {
          uploadFile.url = URL.createObjectURL(file);
        } catch (err) {
          const error = err as Error;
          console.warn(`${SCOPE} ${error.message}`);
          onError?.(error, uploadFile, filesRef.current);
        }
      }

      const next = apply([...filesRef.current, uploadFile]);
      changed(uploadFile, next);
    },
    [apply, changed, listType, onError],
  );

  const removeFile = useCallback(
    (file: UploadFile) =>
      apply(filesRef.current.filter((item) => item.uid !== file.uid)),
    [apply],
  );

  const handleError = useCallback(
    (err: Error, rawFile: UploadRawFile) => {
      const file = getFile(rawFile);
      if (!file) return;

      console.error(err);
      // 官方在上报 onError 之前就把失败的文件从列表里摘掉
      const failed: UploadFile = { ...file, status: "fail" };
      const list = removeFile(failed);
      onError?.(err, failed, list);
      changed(failed, list);
    },
    [changed, getFile, onError, removeFile],
  );

  const handleProgress = useCallback(
    (evt: UploadProgressEvent, rawFile: UploadRawFile) => {
      const file = getFile(rawFile);
      if (!file) return;

      // 官方先回调再写入状态，故传入的仍是更新前的文件对象
      onProgress?.(evt, file, filesRef.current);

      apply(
        filesRef.current.map((item) =>
          item.uid === file.uid
            ? {
                ...item,
                status: "uploading" as UploadStatus,
                percentage: Math.round(evt.percent),
              }
            : item,
        ),
      );
    },
    [apply, getFile, onProgress],
  );

  const handleSuccess = useCallback(
    (response: unknown, rawFile: UploadRawFile) => {
      const file = getFile(rawFile);
      if (!file) return;

      const list = apply(
        filesRef.current.map((item) =>
          item.uid === file.uid
            ? { ...item, status: "success" as UploadStatus, response }
            : item,
        ),
      );
      const done = list.find((item) => item.uid === file.uid) as UploadFile;

      onSuccess?.(response, done, list);
      changed(done, list);
    },
    [apply, changed, getFile, onSuccess],
  );

  const handleRemove = useCallback(
    async (file: UploadFile | UploadRawFile): Promise<void> => {
      const uploadFile =
        file instanceof File ? getFile(file as UploadRawFile) : file;
      if (!uploadFile) return;

      const doRemove = (target: UploadFile) => {
        abort(target);
        const list = removeFile(target);
        onRemove?.(target, list);
        revokeFileObjectURL(target);
      };

      if (beforeRemove) {
        const before = await beforeRemove(uploadFile, filesRef.current);
        if (before !== false) doRemove(uploadFile);
      } else {
        doRemove(uploadFile);
      }
    },
    [abort, beforeRemove, getFile, onRemove, removeFile],
  );

  /** 对应官方 submit：把 ready 状态的文件手动发起上传。 */
  const submit = useCallback(() => {
    filesRef.current
      .filter((item) => item.status === "ready")
      .forEach((item) => {
        if (item.raw) uploadRequest(item.raw);
      });
  }, [uploadRequest]);

  return useMemo(
    () => ({
      uploadFiles: files,
      abort,
      submit,
      clearFiles,
      handleStart,
      handleError,
      handleProgress,
      handleSuccess,
      handleRemove,
    }),
    [
      files,
      abort,
      submit,
      clearFiles,
      handleStart,
      handleError,
      handleProgress,
      handleSuccess,
      handleRemove,
    ],
  );
}
