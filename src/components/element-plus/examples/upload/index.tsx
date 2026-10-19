"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  ElUpload,
  genFileId,
  type UploadExpose,
  type UploadFile,
  type UploadProps,
  type UploadRawFile,
  type UploadUserFile,
} from "@/components/element-plus/upload";
import { ElButton } from "@/components/element-plus/button";
import { ElDialog } from "@/components/element-plus/dialog";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Delete, Download, Plus, UploadFilled, ZoomIn } from "@/components/element-plus/icons";
import { message } from "@/components/element-plus/message";
import { MessageBox } from "@/components/element-plus/message-box";

const ACTION = "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15";

/**
 * 官方示例用 <style scoped> 定义 .avatar-uploader / .avatar-uploader-icon，
 * 本项目禁止 <style> 标签与新增 docs.css 规则，改为等值的样式对象。
 */
const avatarUploaderStyle: CSSProperties = {
  display: "inline-block",
  border: "1px dashed var(--el-border-color)",
  borderRadius: 6,
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  transition: "var(--el-transition-duration-fast)",
  lineHeight: 0,
};

const avatarIconStyle: CSSProperties = {
  fontSize: 28,
  color: "#8c939d",
  width: 178,
  height: 178,
  textAlign: "center",
};

const avatarImgStyle: CSSProperties = {
  width: 178,
  height: 178,
  display: "block",
};

/** 两个示例里的「上传到服务器」按钮，官方用 ml-3 工具类（margin-left: 12px）。 */
const gapLeftStyle: CSSProperties = { marginLeft: 12 };

const INITIAL_FILES: UploadUserFile[] = [
  {
    name: "element-plus-logo.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
  {
    name: "element-plus-logo2.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
];

export function UploadBasic() {
  const [fileList, setFileList] = useState<UploadUserFile[]>(INITIAL_FILES);

  const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
    console.log(file, uploadFiles);
  };

  const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
    console.log(uploadFile);
  };

  const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
    message.warning(
      `The limit is 3, you selected ${files.length} files this time, add up to ${
        files.length + uploadFiles.length
      } totally`,
    );
  };

  const beforeRemove: UploadProps["beforeRemove"] = (uploadFile) => {
    return MessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
      () => true,
      () => false,
    );
  };

  return (
    <ElUpload
      fileList={fileList}
      onFileListChange={setFileList}
      action={ACTION}
      multiple
      onPreview={handlePreview}
      onRemove={handleRemove}
      beforeRemove={beforeRemove}
      limit={3}
      onExceed={handleExceed}
      tip={
        <div className="el-upload__tip">
          jpg/png files with a size less than 500KB.
        </div>
      }
    >
      <ElButton type="primary">Click to upload</ElButton>
    </ElUpload>
  );
}

export function UploadLimitCover() {
  const uploadRef = useRef<UploadExpose>(null);

  const handleExceed: UploadProps["onExceed"] = (files) => {
    uploadRef.current?.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    uploadRef.current?.handleStart(file);
  };

  const submitUpload = () => {
    uploadRef.current?.submit();
  };

  return (
    <ElUpload
      ref={uploadRef}
      action={ACTION}
      limit={1}
      onExceed={handleExceed}
      autoUpload={false}
      trigger={<ElButton type="primary">select file</ElButton>}
      tip={
        <div className="el-upload__tip" style={{ color: "var(--el-color-danger)" }}>
          limit 1 file, new file will cover the old file
        </div>
      }
    >
      <ElButton type="success" style={gapLeftStyle} onClick={submitUpload}>
        upload to server
      </ElButton>
    </ElUpload>
  );
}

export function UploadAvatar() {
  const [imageUrl, setImageUrl] = useState("");

  const handleAvatarSuccess: UploadProps["onSuccess"] = (_response, uploadFile) => {
    if (uploadFile.raw) setImageUrl(URL.createObjectURL(uploadFile.raw));
  };

  const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
    if (rawFile.type !== "image/jpeg") {
      message.error("Avatar picture must be JPG format!");
      return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
      message.error("Avatar picture size can not exceed 2MB!");
      return false;
    }
    return true;
  };

  return (
    <ElUpload
      className="avatar-uploader"
      style={avatarUploaderStyle}
      action={ACTION}
      showFileList={false}
      onSuccess={handleAvatarSuccess}
      beforeUpload={beforeAvatarUpload}
    >
      {imageUrl ? (
        <img src={imageUrl} style={avatarImgStyle} alt="" />
      ) : (
        <ElIcon className="avatar-uploader-icon" style={avatarIconStyle}>
          <Plus />
        </ElIcon>
      )}
    </ElUpload>
  );
}

const PHOTO_WALL_FILES: UploadUserFile[] = [
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "plant-1.png",
    url: "/images/plant-1.png",
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "plant-2.png",
    url: "/images/plant-2.png",
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "figure-1.png",
    url: "/images/figure-1.png",
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "figure-2.png",
    url: "/images/figure-2.png",
  },
];

export function UploadPhotoWall() {
  const [fileList, setFileList] = useState<UploadUserFile[]>(PHOTO_WALL_FILES);
  const [dialogImageUrl, setDialogImageUrl] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles);
  };

  const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
    setDialogImageUrl(uploadFile.url ?? "");
    setDialogVisible(true);
  };

  return (
    <>
      <ElUpload
        fileList={fileList}
        onFileListChange={setFileList}
        action={ACTION}
        listType="picture-card"
        onPreview={handlePictureCardPreview}
        onRemove={handleRemove}
      >
        <ElIcon>
          <Plus />
        </ElIcon>
      </ElUpload>

      <ElDialog visible={dialogVisible} onVisibleChange={setDialogVisible}>
        <img src={dialogImageUrl} alt="Preview Image" style={{ width: "100%" }} />
      </ElDialog>
    </>
  );
}

export function UploadCustomThumbnail() {
  const [dialogImageUrl, setDialogImageUrl] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleRemove = (file: UploadFile) => {
    console.log(file);
  };

  const handlePictureCardPreview = (file: UploadFile) => {
    setDialogImageUrl(file.url ?? "");
    setDialogVisible(true);
  };

  const handleDownload = (file: UploadFile) => {
    console.log(file);
  };

  return (
    <>
      <ElUpload
        action="#"
        listType="picture-card"
        autoUpload={false}
        renderFile={(file) => (
          <div>
            <img className="el-upload-list__item-thumbnail" src={file.url} alt="" />
            <span className="el-upload-list__item-actions">
              <span
                className="el-upload-list__item-preview"
                onClick={() => handlePictureCardPreview(file)}
              >
                <ElIcon>
                  <ZoomIn />
                </ElIcon>
              </span>
              <span
                className="el-upload-list__item-delete"
                onClick={() => handleDownload(file)}
              >
                <ElIcon>
                  <Download />
                </ElIcon>
              </span>
              <span
                className="el-upload-list__item-delete"
                onClick={() => handleRemove(file)}
              >
                <ElIcon>
                  <Delete />
                </ElIcon>
              </span>
            </span>
          </div>
        )}
      >
        <ElIcon>
          <Plus />
        </ElIcon>
      </ElUpload>

      <ElDialog visible={dialogVisible} onVisibleChange={setDialogVisible}>
        <img src={dialogImageUrl} alt="Preview Image" style={{ width: "100%" }} />
      </ElDialog>
    </>
  );
}

const PICTURE_FILES: UploadUserFile[] = [
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "food2.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
];

export function UploadFileListWithThumbnail() {
  const [fileList, setFileList] = useState<UploadUserFile[]>(PICTURE_FILES);

  const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles);
  };

  const handlePreview: UploadProps["onPreview"] = (file) => {
    console.log(file);
  };

  return (
    <ElUpload
      fileList={fileList}
      onFileListChange={setFileList}
      action={ACTION}
      onPreview={handlePreview}
      onRemove={handleRemove}
      listType="picture"
      tip={
        <div className="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      }
    >
      <ElButton type="primary">Click to upload</ElButton>
    </ElUpload>
  );
}

export function UploadFileList() {
  const [fileList, setFileList] = useState<UploadUserFile[]>(PICTURE_FILES);

  // 官方示例在 on-change 里把列表裁到最近 3 条
  const handleChange: UploadProps["onChange"] = () => {
    setFileList((prev) => prev.slice(-3));
  };

  return (
    <ElUpload
      fileList={fileList}
      onFileListChange={setFileList}
      action={ACTION}
      onChange={handleChange}
      tip={
        <div className="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      }
    >
      <ElButton type="primary">Click to upload</ElButton>
    </ElUpload>
  );
}

export function UploadDragAndDrop() {
  return (
    <ElUpload
      action={ACTION}
      drag
      multiple
      tip={
        <div className="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      }
    >
      <ElIcon className="el-icon--upload">
        <UploadFilled />
      </ElIcon>
      <div className="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </ElUpload>
  );
}

export function UploadDirectory() {
  const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
    console.log(uploadFile, uploadFiles);
  };

  return (
    <ElUpload
      action={ACTION}
      drag
      directory
      multiple
      onChange={handleChange}
    >
      <ElIcon className="el-icon--upload">
        <UploadFilled />
      </ElIcon>
      <div className="el-upload__text">
        Drop directory here or <em>click to upload</em>
      </div>
    </ElUpload>
  );
}

export function UploadManual() {
  const uploadRef = useRef<UploadExpose>(null);

  const submitUpload = () => {
    uploadRef.current?.submit();
  };

  return (
    <ElUpload
      ref={uploadRef}
      action={ACTION}
      autoUpload={false}
      trigger={<ElButton type="primary">select file</ElButton>}
      tip={
        <div className="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      }
    >
      <ElButton type="success" style={gapLeftStyle} onClick={submitUpload}>
        upload to server
      </ElButton>
    </ElUpload>
  );
}
