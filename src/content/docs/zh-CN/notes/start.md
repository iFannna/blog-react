---
title: 快速开始
description: 技术笔记的编写指南：文件结构、frontmatter、内容语法与示例配置。
group: 入门
order: 10
---

# 快速开始

技术笔记使用 Markdown 编写，页面由内容文件自动生成，无需编写 React 组件。本文覆盖从创建文件到本地预览的完整流程。

## 创建文档

### 文件位置

文档按语言存放在 `src/content/docs/<locale>/notes/` 目录：

| 文件 | 访问地址 |
| --- | --- |
| `zh-CN/notes/deploy.md` | `/zh-CN/docs/notes/deploy` |
| `en-US/notes/deploy.md` | `/en-US/docs/notes/deploy` |

文件名决定 URL 的最后一段，支持子目录：`notes/server/deploy.md` 对应 `/docs/notes/server/deploy`。以 `_` 开头的文件或目录不会被收录。

两种语言建议使用相同文件名。若仅在一种语言中创建文档，另一种语言的 URL 仍可访问，页面会展示回退提示，但该文档不会出现在对应语言的侧边栏中。

### frontmatter

每个文件开头都需要一段 YAML frontmatter：

```yaml
---
title: 部署流程
description: 将站点发布到生产环境的步骤。
group: 入门
order: 30
draft: false
---
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文档标题，用于侧边栏与页面标题 |
| `description` | 否 | 页面描述，写入 meta description |
| `group` | 否 | 侧边栏分组，默认为「文档」 |
| `order` | 否 | 排序权重，值越小越靠前，默认 1000；分组按组内最小值排序 |
| `draft` | 否 | 设为 `true` 时隐藏且不可访问 |

缺少 `title` 会导致构建失败，其余字段均可省略。

## 编写内容

frontmatter 之后为正文，支持标准 Markdown 语法。二级、三级标题会自动生成右侧目录与锚点。

### 提示块

使用 `:::tip`、`:::warning`、`:::danger`、`:::info` 标记提示内容。类型名后可直接写标题；省略标题时显示类型名。内容以单独一行 `:::` 结束。

:::tip 可选标题
标题与 `:::` 写在同一行，正文从下一行开始。
:::

:::warning
提示块正文支持多行 Markdown。
:::

:::danger 注意
`danger` 用于可能造成数据丢失或不可逆操作的说明。
:::

### 相对链接

Markdown 链接按当前文档所在目录解析，`.md` 后缀会被移除，锚点保持不变：

| 写法 | 解析结果 |
| --- | --- |
| `[快速开始](./start.md)` | `/zh-CN/docs/notes/start` |
| `[frontmatter](./start.md#frontmatter)` | 指向对应小节 |

`../` 可引用上级目录中的文档。以 `/` 开头的站内绝对路径与 `http(s)://` 外部链接不会改写，外部链接在新窗口打开。

### 代码块

在围栏代码块中标注语言即可启用高亮：

```ts
const order: number = 10;
```

支持 ts、tsx、js、json、html、css、bash、go、java、python、sql、yaml、xml、markdown、dockerfile；无法识别的语言按纯文本渲染。

### 表格与类型标记

表格使用标准 Markdown 语法，类型列支持简写标记：

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| `disabled` | ^[boolean] | 是否禁用 |
| `size` | ^[enum]`'large' \| 'default' \| 'small'` | 组件尺寸 |

- `^[boolean]` 渲染为行内代码；
- `^[enum]` 后紧跟行内代码时，生成可点击查看详情的类型标记；
- `^(2.2.0)` 渲染为版本标签，`^(beta)` 等字母标记使用对应的徽标样式，例如 ^(2.2.0)、^(beta)。

### 原始 HTML

正文支持原始 HTML 片段，其中 `<el-tag>` 会渲染为本地标签组件：

<el-tag round effect="plain" size="small">2.2.0</el-tag>

## 添加示例

可交互示例通过 `:::demo` 容器嵌入。容器开头的文字为示例说明，第一行非空内容为示例路径，以单独一行 `:::` 结束：

:::demo 点击按钮，计数会加一。
hello/basic

:::

示例路径需要在清单中注册。清单位于 `src/content/demos/<section>/<文件名>.ts`，例如 `src/content/demos/notes/start.ts`：

```ts
import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "hello/basic": {
    load: () => import("@/components/docs/demos/HelloDemo"),
    sourceFile: "src/components/docs/demos/HelloDemo.tsx",
  },
};

export default manifest;
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `load` | 是 | 返回示例组件的动态 import |
| `sourceFile` | 是 | 示例源码文件，源码面板直接读取该文件 |
| `exportName` | 否 | 单文件包含多个示例时指定导出名 |
| `lang` | 否 | 源码语言，默认 `tsx` |
| `plain` | 否 | 设为 `true` 时隐藏源码面板 |

新增清单后，还需在 `src/content/demos/registry.generated.ts` 中注册对应条目。仓库当前未提供生成脚本，需要手动添加。

## 本地预览

保存文件后刷新页面即可看到更新，开发环境会自动同步导航与内容。部署前执行生产构建，新文档会被写入静态参数。
