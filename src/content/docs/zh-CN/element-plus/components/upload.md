---
title: "Upload 上传"
description: "上传文件，支持点击或拖拽两种方式。"
group: 表单组件
order: 250
---

# Upload 上传

通过点击或者拖拽上传文件。

## 基础用法

:::demo 通过 `slot` 你可以传入自定义的上传按钮类型和文字提示。可通过设置 `limit` 和 `on-exceed` 来限制上传文件的个数和定义超出限制时的行为。可通过设置 `before-remove` 来阻止文件移除操作。

upload/basic

:::

## 覆盖前一个文件

:::demo 设置 `limit` 和 `on-exceed` 可以在选中时自动替换上一个文件。

upload/limit-cover

:::

## 用户头像

:::demo 在 `before-upload` 钩子中限制用户上传文件的格式和大小。

upload/avatar

:::

## 照片墙

:::demo 使用 `list-type` 属性来设定文件列表的样式。

upload/photo-wall

:::

## 自定义缩略图

:::demo 使用 `scoped-slot` 属性来改变默认的缩略图模板样式。

upload/custom-thumbnail

:::

## 图片列表缩略图

:::demo

upload/file-list-with-thumbnail

:::

## 上传文件列表控制

:::demo 通过 `on-change` 钩子函数来对上传文件的列表进行控制。

upload/file-list

:::

## 拖拽上传

:::demo 你可以将文件拖拽到特定区域以进行上传。

upload/drag-and-drop

:::

## 上传目录 ^(2.13.1)

通过 `directory` 属性启用文件夹上传。

:::demo 启用后，只能选择文件夹；选择文件夹后，文件夹内的文件将被扁平化处理。

upload/directory

:::

## 手动上传

:::demo

upload/manual

:::

## Upload API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| action | 请求 URL | ^[string] | '#' |
| headers | 请求头 | ^[object]`Headers \| Record<string, string \| number \| null \| undefined>` | — |
| method | 请求方法 | ^[string] | post |
| data | 附加请求参数，支持对象 / Promise / `(rawFile) => Awaitable` | ^[object] / ^[Function] | {} |
| multiple | 是否允许多选 | ^[boolean] | false |
| name | 上传字段名 | ^[string] | file |
| withCredentials | 是否携带 cookie | ^[boolean] | false |
| showFileList | 是否展示文件列表 | ^[boolean] | true |
| drag | 是否开启拖拽上传 | ^[boolean] | false |
| accept | 接受的文件类型 | ^[string] | '' |
| crossorigin | 原生 crossorigin | ^[enum]`'' \| 'anonymous' \| 'use-credentials'` | — |
| directory | 是否支持选择目录（选中后扁平化） | ^[boolean] | false |
| autoUpload | 是否自动上传 | ^[boolean] | true |
| listType | 文件列表类型 | ^[enum]`'text' \| 'picture' \| 'picture-card'` | text |
| httpRequest | 覆盖默认 xhr 行为 | ^[Function]`(options: UploadRequestOptions) => XMLHttpRequest \| Promise<unknown>` | ajaxUpload |
| disabled | 是否禁用 | ^[boolean] | false |
| limit | 最大上传数量 | ^[number] | — |
| fileList | 默认文件列表 | ^[array]`UploadUserFile[]` | [] |
| beforeUpload | 上传前钩子，返回 false 或 reject 会中断 | ^[Function]`(rawFile) => Awaitable<void \| boolean \| File \| Blob>` | — |
| beforeRemove | 移除前钩子，返回 false 或 reject 会中断 | ^[Function]`(file, files) => Awaitable<boolean>` | — |
| className / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onFileListChange | 文件列表变化，对应官方 v-model:file-list | ^[Function]`(files: UploadFiles) => void` |
| onRemove | 移除文件时触发 | ^[Function]`(file, files) => void` |
| onChange | 选择文件 / 上传成功 / 上传失败时触发 | ^[Function]`(file, files) => void` |
| onPreview | 点击已上传文件时触发 | ^[Function]`(file) => void` |
| onSuccess | 上传成功 | ^[Function]`(response, file, files) => void` |
| onProgress | 上传进度变化 | ^[Function]`(evt, file, files) => void` |
| onError | 上传出错 | ^[Function]`(error, file, files) => void` |
| onExceed | 超出 limit 时触发 | ^[Function]`(files: File[], files) => void` |

### Slots（以 props 表达）

| 属性名 | 说明 | 类型 |
| --- | --- | --- |
| children | 默认内容，无 trigger 时作为触发器 | ^[ReactNode] |
| trigger | 触发器内容，对应官方 trigger 插槽 | ^[ReactNode] |
| tip | 提示文案，对应官方 tip 插槽 | ^[ReactNode] |
| renderFile | 自定义缩略图模板，对应官方 file 插槽 | ^[Function]`(file, index) => ReactNode` |

### Exposes（通过 ref 访问）

| 名称 | 说明 |
| --- | --- |
| abort | 取消上传请求，传 file 只取消对应文件，省略则取消全部 |
| submit | 手动上传列表中 ready 状态的文件 |
| clearFiles | 清空文件列表，可按状态过滤 |
| handleStart | 手动把原始文件加入列表 |
| handleRemove | 手动移除文件 |
