"use client";

import { useContext, useState, type DragEvent, type ReactNode } from "react";
import { UploadContext } from "./constants";
import type { UploadRawFile } from "./types";

export interface UploadDraggerProps {
  /** 拖入的文件（目录开启时已扁平化） */
  onFile: (files: UploadRawFile[]) => void;
  directory?: boolean;
  children?: ReactNode;
}

function getFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}

/**
 * 对应官方 upload-dragger.vue 的 getAllFiles：
 * 递归读取目录项。Chromium 的 readEntries 单次最多返回 100 条，
 * 官方因此循环读到空为止，这里保持一致。
 */
async function getAllFiles(entry: FileSystemEntry): Promise<UploadRawFile[]> {
  try {
    if (entry.isFile) {
      const file = (await getFile(
        entry as FileSystemFileEntry,
      )) as UploadRawFile;
      file.isDirectory = false;
      return [file];
    }

    if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      const getEntries = (): Promise<FileSystemEntry[]> =>
        new Promise((resolve, reject) =>
          dirReader.readEntries(resolve, reject),
        );

      const entries: FileSystemEntry[] = [];
      let readEntries = await getEntries();
      while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await getEntries();
      }

      const nested = await Promise.all(
        entries.map((item) => getAllFiles(item).catch(() => [])),
      );
      return nested.flat();
    }
  } catch {
    return [];
  }

  return [];
}

/**
 * 对应官方 ElUploadDragger：负责接收拖放并派发原始文件列表。
 * 禁用态由外层 ElUploadContent 通过上下文下发。
 */
export function ElUploadDragger({
  onFile,
  directory,
  children,
}: UploadDraggerProps) {
  const context = useContext(UploadContext);
  const [dragover, setDragover] = useState(false);

  const disabled = context?.disabled ?? false;

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    setDragover(false);
    event.stopPropagation();

    const dataTransfer = event.dataTransfer;
    const files = Array.from(dataTransfer.files) as UploadRawFile[];
    const items = dataTransfer.items || [];

    if (directory) {
      const entries = Array.from(items)
        .map((item) => item?.webkitGetAsEntry?.())
        .filter((entry): entry is FileSystemEntry => Boolean(entry));

      const allFiles = await Promise.all(entries.map(getAllFiles));
      onFile(allFiles.flat());
      return;
    }

    files.forEach((file, index) => {
      const entry = items[index]?.webkitGetAsEntry?.();
      if (entry) file.isDirectory = entry.isDirectory;
    });
    onFile(files);
  };

  const handleDragover = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setDragover(true);
  };

  const handleDragleave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // 拖到子元素上也会触发 dragleave，用 contains 过滤掉内部移动
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setDragover(false);
    }
  };

  return (
    <div
      className={["el-upload-dragger", dragover && "is-dragover"]
        .filter(Boolean)
        .join(" ")}
      onDrop={handleDrop}
      onDragOver={handleDragover}
      onDragLeave={handleDragleave}
    >
      {children}
    </div>
  );
}
