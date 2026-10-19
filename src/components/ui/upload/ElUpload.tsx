"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElUploadContent, type UploadContentExpose } from "./ElUploadContent";
import { ElUploadList } from "./ElUploadList";
import { useHandlers } from "./use-handlers";
import type {
  Crossorigin,
  ListType,
  UploadBeforeUploadResult,
  UploadDataInput,
  UploadFile,
  UploadFiles,
  UploadProgressEvent,
  UploadRawFile,
  UploadRequestHandler,
  UploadStatus,
  UploadUserFile,
} from "./types";

export interface UploadProps {
  /** 请求 URL，对应官方 action，默认 '#' */
  action?: string;
  /** 请求头 */
  headers?: Headers | Record<string, string | number | null | undefined>;
  /** 请求方法，默认 post */
  method?: string;
  /** 附加的请求参数，支持对象 / Promise / (rawFile) => Awaitable */
  data?: UploadDataInput;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 上传文件的字段名，默认 file */
  name?: string;
  /** 是否携带 cookie */
  withCredentials?: boolean;
  /** 是否展示文件列表 */
  showFileList?: boolean;
  /** 是否开启拖拽上传 */
  drag?: boolean;
  /** 接受的文件类型 */
  accept?: string;
  /** 原生 crossorigin */
  crossorigin?: Crossorigin;
  /** 是否支持选择目录（选择后目录被扁平化） */
  directory?: boolean;
  /** 是否自动上传 */
  autoUpload?: boolean;
  /** 文件列表类型 */
  listType?: ListType;
  /** 覆盖默认 xhr 行为 */
  httpRequest?: UploadRequestHandler;
  /** 是否禁用 */
  disabled?: boolean;
  /** 最大上传数量 */
  limit?: number;
  /** 默认文件列表，对应官方 v-model:file-list */
  fileList?: UploadUserFile[];
  /** 文件列表变化，对应官方 v-model:file-list 的 update */
  onFileListChange?: (files: UploadFiles) => void;

  /** 上传前的钩子，返回 false 或 reject 的 Promise 会中断上传 */
  beforeUpload?: (
    rawFile: UploadRawFile,
  ) => UploadBeforeUploadResult | Promise<UploadBeforeUploadResult>;
  /** 移除前的钩子，返回 false 或 reject 的 Promise 会中断移除 */
  beforeRemove?: (
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => boolean | Promise<boolean>;
  /** 移除文件时触发 */
  onRemove?: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  /** 选择文件 / 上传成功 / 上传失败时触发 */
  onChange?: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  /** 点击已上传文件时触发 */
  onPreview?: (uploadFile: UploadFile) => void;
  /** 上传成功时触发 */
  onSuccess?: (
    response: unknown,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => void;
  /** 上传进度变化时触发 */
  onProgress?: (
    evt: UploadProgressEvent,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => void;
  /** 上传出错时触发 */
  onError?: (
    error: Error,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
  ) => void;
  /** 文件数超出 limit 时触发 */
  onExceed?: (files: File[], uploadFiles: UploadUserFile[]) => void;

  /** 默认插槽内容，无 trigger 时作为触发器，有 trigger 时渲染在组件下方 */
  children?: ReactNode;
  /** 触发器插槽，对应官方 trigger 插槽 */
  trigger?: ReactNode;
  /** 提示文案插槽，对应官方 tip 插槽 */
  tip?: ReactNode;
  /** 自定义缩略图模板，对应官方 file 插槽 */
  renderFile?: (file: UploadFile, index: number) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface UploadExpose {
  /** 取消上传请求，传 file 只取消对应文件 */
  abort: (file?: UploadFile) => void;
  /** 手动上传文件列表中 ready 状态的文件 */
  submit: () => void;
  /** 清空文件列表，可按状态过滤 */
  clearFiles: (status?: UploadStatus[]) => void;
  /** 手动把原始文件加入列表 */
  handleStart: (rawFile: UploadRawFile) => void;
  /** 手动移除文件 */
  handleRemove: (file: UploadFile | UploadRawFile) => Promise<void>;
}

/**
 * 对应官方 ElUpload。
 *
 * 职责分层与官方一致：ElUpload 持有列表状态与生命周期钩子（use-handlers），
 * ElUploadContent 负责选取 / 上传 / 中止，ElUploadList 负责展示。
 * picture-card 且展示列表时，把上传触发器作为列表尾部的一项渲染，
 * 其余情况触发器独立渲染在上方。
 */
export const ElUpload = forwardRef<UploadExpose, UploadProps>(function ElUpload(
  {
    action = "#",
    headers,
    method = "post",
    data = {},
    multiple,
    name = "file",
    withCredentials,
    showFileList = true,
    drag,
    accept = "",
    crossorigin,
    directory,
    autoUpload = true,
    listType = "text",
    httpRequest,
    disabled: disabledProp,
    limit,
    fileList,
    onFileListChange,
    beforeUpload,
    beforeRemove,
    onRemove,
    onChange,
    onPreview,
    onSuccess,
    onProgress,
    onError,
    onExceed,
    children,
    trigger,
    tip,
    renderFile,
    className,
    style,
  },
  ref,
) {
  // 官方 upload.vue 里 disabled = useFormDisabled()，内部再把 props.disabled
  // 透传给 ElUploadContent / ElUploadList；本项目由这两者各自调用
  // useFormDisabled(disabledProp) 得到同样的「自身 > Form」优先级。
  const contentRef = useRef<UploadContentExpose>(null);

  // 列表状态与钩子编排；abort / upload 都转发给 ElUploadContent
  const {
    uploadFiles,
    abort,
    submit,
    clearFiles,
    handleStart,
    handleError,
    handleProgress,
    handleSuccess,
    handleRemove,
  } = useHandlers({
    fileList,
    onFileListChange,
    listType,
    beforeRemove,
    onRemove,
    onChange,
    onSuccess,
    onProgress,
    onError,
    abortRequest: (file) => contentRef.current?.abort(file),
    uploadRequest: (rawFile) => {
      void contentRef.current?.upload(rawFile);
    },
  });

  useImperativeHandle(ref, () => ({
    abort,
    submit,
    clearFiles,
    handleStart,
    handleRemove,
  }));

  const isPictureCard = listType === "picture-card";

  // 取消上传 / 手动上传都要能拿到 content 实例，故用 ref 转发
  const handlePreview = useCallback(
    (file: UploadFile) => onPreview?.(file),
    [onPreview],
  );

  const contentNode = (
    <ElUploadContent
      ref={contentRef}
      action={action}
      headers={headers}
      method={method}
      data={data}
      name={name}
      multiple={multiple}
      accept={accept}
      directory={directory}
      withCredentials={withCredentials}
      drag={drag}
      listType={listType}
      disabled={disabledProp}
      beforeUpload={beforeUpload}
      httpRequest={httpRequest}
      autoUpload={autoUpload}
      limit={limit}
      fileCount={uploadFiles.length}
      fileList={uploadFiles}
      onStart={handleStart}
      onProgress={handleProgress}
      onSuccess={handleSuccess}
      onError={handleError}
      onRemove={(rawFile) => {
        void handleRemove(rawFile);
      }}
      onExceed={onExceed ?? (() => {})}
    >
      {/* 官方的 slot 渲染顺序：有 trigger 用 trigger，否则用默认插槽 */}
      {trigger ?? children}
    </ElUploadContent>
  );

  const listNode = (
    <ElUploadList
      files={uploadFiles}
      disabled={disabledProp}
      listType={listType}
      crossorigin={crossorigin}
      handlePreview={handlePreview}
      renderFile={renderFile}
      onRemove={(file) => {
        void handleRemove(file);
      }}
    />
  );

  /** picture-card 时把上传触发器并入列表尾部，其余情况独立渲染 */
  const pictureCardList = (
    <ElUploadList
      files={uploadFiles}
      disabled={disabledProp}
      listType={listType}
      crossorigin={crossorigin}
      handlePreview={handlePreview}
      renderFile={renderFile}
      onRemove={(file) => {
        void handleRemove(file);
      }}
      append={contentNode}
    />
  );

  return (
    <div className={className} style={style}>
      {isPictureCard && showFileList && pictureCardList}

      {(!isPictureCard || (isPictureCard && !showFileList)) && contentNode}

      {/* 有 trigger 插槽时，默认插槽（如「上传到服务器」按钮）独立渲染在组件下方 */}
      {trigger && children}
      {tip}
      {!isPictureCard && showFileList && listNode}
    </div>
  );
});
