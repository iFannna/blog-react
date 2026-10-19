"use client";

import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { ElProgress } from "../progress";
import { Check, CircleCheck, Close, Delete, Document, ZoomIn } from "../icons";
import { useFormDisabled } from "../form/use-form";
import { useTranslator } from "../config-provider/context";
import type { Crossorigin, ListType, UploadFile, UploadFiles } from "./types";

export interface UploadListProps {
  /** 文件列表 */
  files?: UploadFiles;
  disabled?: boolean;
  /** 点击文件名 / 预览按钮时的回调 */
  handlePreview?: (file: UploadFile) => void;
  listType?: ListType;
  crossorigin?: Crossorigin;
  /** 移除某个文件 */
  onRemove?: (file: UploadFile) => void;
  /** 自定义缩略图模板，对应官方 file 具名插槽 */
  renderFile?: (file: UploadFile, index: number) => ReactNode;
  /** 追加在列表内的内容，对应官方 append 插槽（picture-card 时挂上传触发器） */
  append?: ReactNode;
}

/**
 * 对应官方 ElUploadList。
 *
 * 三种 list-type 共用一套 DOM，靠 el-upload-list--xxx 系列类名切换形态；
 * picture-card 下额外渲染居中的操作层（预览 / 删除）。
 */
export function ElUploadList({
  files = [],
  disabled: disabledProp,
  handlePreview,
  listType = "text",
  crossorigin,
  onRemove,
  renderFile,
  append,
}: UploadListProps) {
  const t = useTranslator();
  const disabled = useFormDisabled(disabledProp);
  // 官方用 focusing 标记「按钮点击聚焦」，避免键盘焦点态常驻
  const [focusing, setFocusing] = useState(false);

  const containerClasses = [
    "el-upload-list",
    `el-upload-list--${listType}`,
    disabled && "is-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const handleRemove = (file: UploadFile) => {
    if (disabled) return;
    onRemove?.(file);
  };

  const handleBlur = (relatedTarget: EventTarget | null) => {
    // 焦点仍在列表项内部（比如从预览按钮移到删除按钮）时不取消 focusing
    const target = relatedTarget as HTMLElement | null;
    if (!target?.classList.contains("el-upload-list__item")) {
      setFocusing(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>, file: UploadFile) => {
    if (event.key === "Delete") handleRemove(file);
  };

  const progressStyle: CSSProperties | undefined =
    listType === "picture-card" ? undefined : { marginTop: "0.5rem" };

  return (
    <ul className={containerClasses}>
      {files.map((file, index) => {
        const content =
          renderFile?.(file, index) ??
          (
            <>
              {(listType === "picture" ||
                (file.status !== "uploading" && listType === "picture-card")) && (
                // 缩略图对上传中的文件不展示（官方模板条件同此）
                <img
                  className="el-upload-list__item-thumbnail"
                  src={file.url}
                  crossOrigin={crossorigin || undefined}
                  alt=""
                />
              )}

              {(file.status === "uploading" || listType !== "picture-card") && (
                <div className="el-upload-list__item-info">
                  <a
                    className="el-upload-list__item-name"
                    onClick={(event) => {
                      event.preventDefault();
                      handlePreview?.(file);
                    }}
                  >
                    <ElIcon className="el-icon--document">
                      <Document />
                    </ElIcon>
                    <span
                      className="el-upload-list__item-file-name"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                  </a>
                  {file.status === "uploading" && (
                    <ElProgress
                      type={listType === "picture-card" ? "circle" : "line"}
                      strokeWidth={listType === "picture-card" ? 6 : 2}
                      percentage={Number(file.percentage)}
                      style={progressStyle}
                    />
                  )}
                </div>
              )}

              <label className="el-upload-list__item-status-label">
                {listType === "text" ? (
                  <ElIcon className="el-icon--upload-success el-icon--circle-check">
                    <CircleCheck />
                  </ElIcon>
                ) : (
                  <ElIcon className="el-icon--upload-success el-icon--check">
                    <Check />
                  </ElIcon>
                )}
              </label>

              {!disabled && (
                <>
                  <ElIcon
                    className="el-icon--close"
                    aria-label={t("el.upload.delete")}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleRemove(file)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleRemove(file);
                      }
                    }}
                  >
                    <Close />
                  </ElIcon>
                  <i className="el-icon--close-tip">
                    {t("el.upload.deleteTip")}
                  </i>
                </>
              )}

              {listType === "picture-card" && (
                <span className="el-upload-list__item-actions">
                  <span
                    className="el-upload-list__item-preview"
                    onClick={() => handlePreview?.(file)}
                  >
                    <ElIcon className="el-icon--zoom-in">
                      <ZoomIn />
                    </ElIcon>
                  </span>
                  {!disabled && (
                    <span
                      className="el-upload-list__item-delete"
                      onClick={() => handleRemove(file)}
                    >
                      <ElIcon className="el-icon--delete">
                        <Delete />
                      </ElIcon>
                    </span>
                  )}
                </span>
              )}
            </>
          );

        return (
          <li
            key={file.uid || file.name}
            className={[
              "el-upload-list__item",
              `is-${file.status}`,
              focusing && "focusing",
            ]
              .filter(Boolean)
              .join(" ")}
            tabIndex={disabled ? undefined : 0}
            aria-disabled={disabled}
            role="button"
            onKeyDown={(event) => handleKeyDown(event, file)}
            onFocus={() => setFocusing(true)}
            onBlur={(event) => handleBlur(event.relatedTarget)}
            onClick={() => setFocusing(false)}
          >
            {content}
          </li>
        );
      })}
      {append}
    </ul>
  );
}
