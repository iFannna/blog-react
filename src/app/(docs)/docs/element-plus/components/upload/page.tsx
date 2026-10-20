import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
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
} from "@/components/element-plus/examples/upload";

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
`;

export default function UploadPage() {
  return (
    <>
      <h1>Upload 上传</h1>
      <p>通过点击或者拖拽上传文件。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>slot</code> 你可以传入自定义的上传按钮类型和文字提示。可通过设置{" "}
        <code>limit</code> 和 <code>on-exceed</code>{" "}
        来限制上传文件的个数和定义超出限制时的行为。可通过设置{" "}
        <code>before-remove</code> 来阻止文件移除操作。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <UploadBasic />
      </DemoBlock>

      <Heading level={2}>覆盖前一个文件</Heading>
      <p>
        设置 <code>limit</code> 和 <code>on-exceed</code>{" "}
        可以在选中时自动替换上一个文件。
      </p>
      <DemoBlock source={SOURCES.limitCover}>
        <UploadLimitCover />
      </DemoBlock>

      <Heading level={2}>用户头像</Heading>
      <p>
        在 <code>before-upload</code> 钩子中限制用户上传文件的格式和大小。
      </p>
      <DemoBlock source={SOURCES.avatar}>
        <UploadAvatar />
      </DemoBlock>

      <Heading level={2}>照片墙</Heading>
      <p>
        使用 <code>list-type</code> 属性来设定文件列表的样式。
      </p>
      <DemoBlock source={SOURCES.photoWall}>
        <UploadPhotoWall />
      </DemoBlock>

      <Heading level={2}>自定义缩略图</Heading>
      <p>
        使用 <code>scoped-slot</code> 属性来改变默认的缩略图模板样式。
      </p>
      <DemoBlock source={SOURCES.customThumbnail}>
        <UploadCustomThumbnail />
      </DemoBlock>

      <Heading level={2}>图片列表缩略图</Heading>
      <DemoBlock source={SOURCES.fileListWithThumbnail}>
        <UploadFileListWithThumbnail />
      </DemoBlock>

      <Heading level={2}>上传文件列表控制</Heading>
      <p>
        通过 <code>on-change</code> 钩子函数来对上传文件的列表进行控制。
      </p>
      <DemoBlock source={SOURCES.fileList}>
        <UploadFileList />
      </DemoBlock>

      <Heading level={2}>拖拽上传</Heading>
      <p>你可以将文件拖拽到特定区域以进行上传。</p>
      <DemoBlock source={SOURCES.dragAndDrop}>
        <UploadDragAndDrop />
      </DemoBlock>

      <Heading level={2} id="上传目录">
        上传目录 <span className="docs-version-tag">2.13.1</span>
      </Heading>
      <p>
        通过 <code>directory</code> 属性启用文件夹上传。
      </p>
      <p>
        启用后，只能选择文件夹；选择文件夹后，文件夹内的文件将被扁平化处理。
      </p>
      <DemoBlock source={SOURCES.directory}>
        <UploadDirectory />
      </DemoBlock>

      <Heading level={2}>手动上传</Heading>
      <DemoBlock source={SOURCES.manual}>
        <UploadManual />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
