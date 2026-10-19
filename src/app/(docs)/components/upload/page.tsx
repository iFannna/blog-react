import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  UploadBasic,
  UploadLimitCover,
  UploadAvatar,
  UploadPhotoWall,
  UploadCustomThumbnail,
  UploadFileListWithThumbnail,
  UploadFileList,
  UploadDragAndDrop,
  UploadDirectory,
  UploadManual,
} from "@/components/docs/examples/upload";

export const metadata: Metadata = { title: "Upload 上传" };

const SOURCES = {
  basic: `const [fileList, setFileList] = useState<UploadUserFile[]>([
  { name: "element-plus-logo.svg", url: "https://element-plus.org/images/element-plus-logo.svg" },
  { name: "element-plus-logo2.svg", url: "https://element-plus.org/images/element-plus-logo.svg" },
]);

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  message.warning(\`The limit is 3, you selected \${files.length} files this time\`);
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile) =>
  MessageBox.confirm(\`Cancel the transfer of \${uploadFile.name} ?\`).then(
    () => true,
    () => false,
  );

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
  tip={<div className="el-upload__tip">jpg/png files with a size less than 500KB.</div>}
>
  <ElButton type="primary">Click to upload</ElButton>
</ElUpload>`,

  limitCover: `const uploadRef = useRef<UploadExpose>(null);

const handleExceed: UploadProps["onExceed"] = (files) => {
  uploadRef.current?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.current?.handleStart(file);
};

<ElUpload
  ref={uploadRef}
  action={ACTION}
  limit={1}
  onExceed={handleExceed}
  autoUpload={false}
  trigger={<ElButton type="primary">select file</ElButton>}
  tip={<div className="el-upload__tip">limit 1 file, new file will cover the old file</div>}
>
  <ElButton type="success" onClick={() => uploadRef.current?.submit()}>
    upload to server
  </ElButton>
</ElUpload>`,

  avatar: `const [imageUrl, setImageUrl] = useState("");

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

<ElUpload
  className="avatar-uploader"
  style={avatarUploaderStyle}
  action={ACTION}
  showFileList={false}
  onSuccess={handleAvatarSuccess}
  beforeUpload={beforeAvatarUpload}
>
  {imageUrl ? <img src={imageUrl} style={avatarImgStyle} alt="" /> : <ElIcon className="avatar-uploader-icon" style={avatarIconStyle}><Plus /></ElIcon>}
</ElUpload>`,

  photoWall: `const [fileList, setFileList] = useState<UploadUserFile[]>(PHOTO_WALL_FILES);
const [dialogImageUrl, setDialogImageUrl] = useState("");
const [dialogVisible, setDialogVisible] = useState(false);

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  setDialogImageUrl(uploadFile.url ?? "");
  setDialogVisible(true);
};

<ElUpload
  fileList={fileList}
  onFileListChange={setFileList}
  action={ACTION}
  listType="picture-card"
  onPreview={handlePictureCardPreview}
  onRemove={handleRemove}
>
  <ElIcon><Plus /></ElIcon>
</ElUpload>

<ElDialog visible={dialogVisible} onVisibleChange={setDialogVisible}>
  <img src={dialogImageUrl} alt="Preview Image" style={{ width: "100%" }} />
</ElDialog>`,

  customThumbnail: `<ElUpload
  action="#"
  listType="picture-card"
  autoUpload={false}
  renderFile={(file) => (
    <div>
      <img className="el-upload-list__item-thumbnail" src={file.url} alt="" />
      <span className="el-upload-list__item-actions">
        <span className="el-upload-list__item-preview" onClick={() => handlePictureCardPreview(file)}>
          <ElIcon><ZoomIn /></ElIcon>
        </span>
        <span className="el-upload-list__item-delete" onClick={() => handleDownload(file)}>
          <ElIcon><Download /></ElIcon>
        </span>
        <span className="el-upload-list__item-delete" onClick={() => handleRemove(file)}>
          <ElIcon><Delete /></ElIcon>
        </span>
      </span>
    </div>
  )}
>
  <ElIcon><Plus /></ElIcon>
</ElUpload>`,

  fileListWithThumbnail: `<ElUpload
  fileList={fileList}
  onFileListChange={setFileList}
  action={ACTION}
  onPreview={handlePreview}
  onRemove={handleRemove}
  listType="picture"
  tip={<div className="el-upload__tip">jpg/png files with a size less than 500kb</div>}
>
  <ElButton type="primary">Click to upload</ElButton>
</ElUpload>`,

  fileList: `// 官方示例在 on-change 里把列表裁到最近 3 条
const handleChange: UploadProps["onChange"] = () => {
  setFileList((prev) => prev.slice(-3));
};

<ElUpload
  fileList={fileList}
  onFileListChange={setFileList}
  action={ACTION}
  onChange={handleChange}
  tip={<div className="el-upload__tip">jpg/png files with a size less than 500kb</div>}
>
  <ElButton type="primary">Click to upload</ElButton>
</ElUpload>`,

  dragAndDrop: `<ElUpload
  action={ACTION}
  drag
  multiple
  tip={<div className="el-upload__tip">jpg/png files with a size less than 500kb</div>}
>
  <ElIcon className="el-icon--upload"><UploadFilled /></ElIcon>
  <div className="el-upload__text">
    Drop file here or <em>click to upload</em>
  </div>
</ElUpload>`,

  directory: `<ElUpload action={ACTION} drag directory multiple onChange={handleChange}>
  <ElIcon className="el-icon--upload"><UploadFilled /></ElIcon>
  <div className="el-upload__text">
    Drop directory here or <em>click to upload</em>
  </div>
</ElUpload>`,

  manual: `const uploadRef = useRef<UploadExpose>(null);

<ElUpload
  ref={uploadRef}
  action={ACTION}
  autoUpload={false}
  trigger={<ElButton type="primary">select file</ElButton>}
  tip={<div className="el-upload__tip">jpg/png files with a size less than 500kb</div>}
>
  <ElButton type="success" onClick={() => uploadRef.current?.submit()}>
    upload to server
  </ElButton>
</ElUpload>`,
};

const API_MD = `
## Upload API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| action | 请求 URL | ^[string] | '#' |
| headers | 请求头 | ^[object]\`Headers \\| Record<string, string \\| number \\| null \\| undefined>\` | — |
| method | 请求方法 | ^[string] | post |
| data | 附加请求参数，支持对象 / Promise / \`(rawFile) => Awaitable\` | ^[object] / ^[Function] | {} |
| multiple | 是否允许多选 | ^[boolean] | false |
| name | 上传字段名 | ^[string] | file |
| withCredentials | 是否携带 cookie | ^[boolean] | false |
| showFileList | 是否展示文件列表 | ^[boolean] | true |
| drag | 是否开启拖拽上传 | ^[boolean] | false |
| accept | 接受的文件类型 | ^[string] | '' |
| crossorigin | 原生 crossorigin | ^[enum]\`'' \\| 'anonymous' \\| 'use-credentials'\` | — |
| directory | 是否支持选择目录（选中后扁平化） | ^[boolean] | false |
| autoUpload | 是否自动上传 | ^[boolean] | true |
| listType | 文件列表类型 | ^[enum]\`'text' \\| 'picture' \\| 'picture-card'\` | text |
| httpRequest | 覆盖默认 xhr 行为 | ^[Function]\`(options: UploadRequestOptions) => XMLHttpRequest \\| Promise<unknown>\` | ajaxUpload |
| disabled | 是否禁用 | ^[boolean] | false |
| limit | 最大上传数量 | ^[number] | — |
| fileList | 默认文件列表 | ^[array]\`UploadUserFile[]\` | [] |
| beforeUpload | 上传前钩子，返回 false 或 reject 会中断 | ^[Function]\`(rawFile) => Awaitable<void \\| boolean \\| File \\| Blob>\` | — |
| beforeRemove | 移除前钩子，返回 false 或 reject 会中断 | ^[Function]\`(file, files) => Awaitable<boolean>\` | — |
| className / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onFileListChange | 文件列表变化，对应官方 v-model:file-list | ^[Function]\`(files: UploadFiles) => void\` |
| onRemove | 移除文件时触发 | ^[Function]\`(file, files) => void\` |
| onChange | 选择文件 / 上传成功 / 上传失败时触发 | ^[Function]\`(file, files) => void\` |
| onPreview | 点击已上传文件时触发 | ^[Function]\`(file) => void\` |
| onSuccess | 上传成功 | ^[Function]\`(response, file, files) => void\` |
| onProgress | 上传进度变化 | ^[Function]\`(evt, file, files) => void\` |
| onError | 上传出错 | ^[Function]\`(error, file, files) => void\` |
| onExceed | 超出 limit 时触发 | ^[Function]\`(files: File[], files) => void\` |

### Slots（以 props 表达）

| 属性名 | 说明 | 类型 |
| --- | --- | --- |
| children | 默认内容，无 trigger 时作为触发器 | ^[ReactNode] |
| trigger | 触发器内容，对应官方 trigger 插槽 | ^[ReactNode] |
| tip | 提示文案，对应官方 tip 插槽 | ^[ReactNode] |
| renderFile | 自定义缩略图模板，对应官方 file 插槽 | ^[Function]\`(file, index) => ReactNode\` |

### Exposes（通过 ref 访问）

| 名称 | 说明 |
| --- | --- |
| abort | 取消上传请求，传 file 只取消对应文件，省略则取消全部 |
| submit | 手动上传列表中 ready 状态的文件 |
| clearFiles | 清空文件列表，可按状态过滤 |
| handleStart | 手动把原始文件加入列表 |
| handleRemove | 手动移除文件 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model:file-list\` | \`fileList\` + \`onFileListChange\` | React 惯用受控写法；内部变更（选择 / 成功 / 失败 / 移除）都会回抛最新列表 |
| 具名插槽 \`trigger\` / \`tip\` / \`file\` | \`trigger\` / \`tip\` / \`renderFile\` props | 插槽参数以函数入参表达 |
| \`class\` | \`className\` | 落在最外层包裹 div 上 |
| 通过 \`ref\` 调用导出方法 | \`ref\` 上的 \`UploadExpose\` | \`abort / submit / clearFiles / handleStart / handleRemove\` 同名保留 |
| \`http-request\` 默认 \`ajaxUpload\` | 同名，且已导出 \`ajaxUpload\` | 可整体替换 |

**实现说明**：组件拆分为 \`ElUpload\`（状态与钩子编排）/ \`ElUploadContent\`（选取、上传、中止）/ \`ElUploadList\`（展示）/ \`ElUploadDragger\`（拖拽），
与官方分层一致，四个组件均已导出。DOM 结构、类名（\`.el-upload--picture-card\`、\`.el-upload-list--picture\` 等）与官方逐层对齐。

**未实现的官方能力**：
- \`list-type\` 从 \`text\` 切到 \`picture\`/\`picture-card\` 时，官方会 watch 该 prop 并给已有 \`raw\` 文件补 \`URL.createObjectURL\`，此处未做该补链（切换类型前已入列的文件不会生成缩略图）。
- 官方 \`ElUploadList\` 用 Vue \`transition-group\` 做列表项进入 / 离开动画，React 版未复刻该过渡（官方 upload.scss 里本就是 \`transition: all 0.5s\` 的静态过渡，视觉差异极小）。
- 官方 \`ElUploadDragger\` 独立挂载时会抛 \`usage: <el-upload><el-upload-dragger /></el-upload>\` 错误；本项目未做该校验，单独使用 \`ElUploadDragger\` 不会报错（需自行传 \`onFile\`）。
- 官方 \`ElUploadContent\` 支持通过 \`ref\` 单独调用 \`abort\` / \`upload\`；本项目仅在 \`ElUpload\` 的 ref 上暴露 \`abort / submit / clearFiles / handleStart / handleRemove\`。
`;

export default function UploadPage() {
  return (
    <>
      <h1>Upload 上传</h1>
      <p>上传文件，支持点击或拖拽两种方式。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>trigger</code> 自定义触发按钮的类型与文案。
        <code>limit</code> 与 <code>onExceed</code> 用于限制最大上传数量并处理超限；
        <code>beforeRemove</code> 里返回被拒绝的 Promise 可中止移除。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <UploadBasic />
      </DemoBlock>

      <Heading level={2}>覆盖前一个文件</Heading>
      <p>
        使用 <code>limit</code> 与 <code>onExceed</code> 在重新选择文件时自动替换上一个文件。
      </p>
      <DemoBlock source={SOURCES.limitCover}>
        <UploadLimitCover />
      </DemoBlock>

      <Heading level={2}>用户头像</Heading>
      <p>
        用 <code>beforeUpload</code> 限制上传文件的格式与大小。
      </p>
      <DemoBlock source={SOURCES.avatar}>
        <UploadAvatar />
      </DemoBlock>

      <Heading level={2}>照片墙</Heading>
      <p>
        用 <code>listType</code> 改变文件列表的样式。
      </p>
      <DemoBlock source={SOURCES.photoWall}>
        <UploadPhotoWall />
      </DemoBlock>

      <Heading level={2}>自定义缩略图</Heading>
      <p>
        用 <code>renderFile</code> 替换默认的缩略图模板。
      </p>
      <DemoBlock source={SOURCES.customThumbnail}>
        <UploadCustomThumbnail />
      </DemoBlock>

      <Heading level={2}>图片列表缩略图</Heading>
      <p>
        <code>listType</code> 设为 <code>picture</code> 时列表项左侧展示缩略图。
      </p>
      <DemoBlock source={SOURCES.fileListWithThumbnail}>
        <UploadFileListWithThumbnail />
      </DemoBlock>

      <Heading level={2}>文件列表控制</Heading>
      <p>
        通过 <code>onChange</code> 钩子控制上传文件列表。
      </p>
      <DemoBlock source={SOURCES.fileList}>
        <UploadFileList />
      </DemoBlock>

      <Heading level={2}>拖拽上传</Heading>
      <p>把文件拖到指定区域即可上传。</p>
      <DemoBlock source={SOURCES.dragAndDrop}>
        <UploadDragAndDrop />
      </DemoBlock>

      <Heading level={2}>上传目录</Heading>
      <p>
        开启 <code>directory</code> 后仅能选择文件夹，选中后文件夹内的文件会被扁平化。
      </p>
      <DemoBlock source={SOURCES.directory}>
        <UploadDirectory />
      </DemoBlock>

      <Heading level={2}>手动上传</Heading>
      <p>
        设置 <code>autoUpload</code> 为 <code>false</code> 后，通过 ref 上的{" "}
        <code>submit</code> 手动发起上传。
      </p>
      <DemoBlock source={SOURCES.manual}>
        <UploadManual />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
