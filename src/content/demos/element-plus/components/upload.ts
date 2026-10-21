import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "upload/basic": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadBasic",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/limit-cover": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadLimitCover",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/avatar": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadAvatar",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/photo-wall": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadPhotoWall",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/custom-thumbnail": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadCustomThumbnail",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/file-list-with-thumbnail": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadFileListWithThumbnail",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/file-list": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadFileList",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/drag-and-drop": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadDragAndDrop",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/directory": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadDirectory",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
  "upload/manual": {
    load: () => import("@/components/docs/examples/upload"),
    exportName: "UploadManual",
    sourceFile: "src/components/docs/examples/upload/index.tsx",
  },
};

export default manifest;
