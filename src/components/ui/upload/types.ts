/**
 * 对应官方 packages/components/upload/src/upload.ts 的类型声明。
 * 命名与官方保持一致，便于与源码对照。
 */

export const uploadListTypes = ["text", "picture", "picture-card"] as const;

export type ListType = (typeof uploadListTypes)[number];

export type Crossorigin = "anonymous" | "use-credentials" | "";

export type Awaitable<T> = Promise<T> | T;

export type UploadStatus = "ready" | "uploading" | "success" | "fail";

/** 官方在原生 ProgressEvent 上挂了 percent 字段。 */
export interface UploadProgressEvent extends ProgressEvent {
  percent: number;
}

export interface UploadRawFile extends File {
  uid: number;
  isDirectory?: boolean;
}

export interface UploadFile {
  name: string;
  percentage?: number;
  status: UploadStatus;
  size?: number;
  response?: unknown;
  uid: number;
  url?: string;
  raw?: UploadRawFile;
}

/** 用户传入的 file-list 允许省略 uid / status，内部会补齐。 */
export type UploadUserFile = Omit<UploadFile, "status" | "uid"> &
  Partial<Pick<UploadFile, "status" | "uid">>;

export type UploadFiles = UploadFile[];

/** 提交给 FormData 的值形态，与官方 ajax.ts 里支持的分支一致。 */
export type UploadDataValue =
  | string
  | number
  | Blob
  | [string | Blob, string]
  | string[];

export type UploadData = Record<string, UploadDataValue>;

/** 对应官方 Awaitable<UploadData> | ((rawFile) => Awaitable<UploadData>)。 */
export type UploadDataInput =
  | UploadData
  | Promise<UploadData>
  | ((rawFile: UploadRawFile) => UploadData | Promise<UploadData>);

export interface UploadRequestOptions {
  action: string;
  method: string;
  data: UploadData;
  filename: string;
  file: UploadRawFile;
  headers: Headers | Record<string, string | number | null | undefined>;
  onError: (evt: Error) => void;
  onProgress: (evt: UploadProgressEvent) => void;
  onSuccess: (response: unknown) => void;
  withCredentials: boolean;
}

export type UploadRequestHandler = (
  options: UploadRequestOptions,
) => XMLHttpRequest | Promise<unknown>;

export type UploadBeforeUploadResult =
  | void
  | undefined
  | null
  | boolean
  | File
  | Blob;
