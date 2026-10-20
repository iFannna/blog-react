---
title: Markdown 语法
description: 容器、相对链接与示例清单的约定。
group: 进阶
order: 20
---

# Markdown 语法

## 提示容器

支持 `tip`、`warning`、`danger` 与 `info` 四种容器：

:::tip 可选标题
标题写在 `:::` 同一行，内容从下一行开始。
:::

:::warning
容器必须以单独一行 `:::` 结束。
:::

## 相对链接

正文里的 Markdown 链接会按当前文档所在目录解析，并去掉 `.md` 后缀。
例如 [快速开始](./getting-started.md#第一个示例) 会被改写成对应的文档 URL。

## 示例清单

每个有示例的页面在 `src/content/demos/<section>/<slug>.ts` 维护一份清单：

```ts
const manifest: DemoManifest = {
  "hello/basic": {
    load: () => import("@/components/docs/notes/hello-demo"),
    sourceFile: "src/components/docs/notes/hello-demo.tsx",
  },
};
```

`sourceFile` 指向实际渲染的 React 组件；展开「查看源代码」时读取该文件，
因此面板里看到的就是页面上真正运行的代码。

## 原始 HTML

正文中的 `<el-tag round effect="plain">2.2.0</el-tag>` 会被映射为本仓库的
ElTag 组件，例如 <el-tag round effect="plain" size="small">2.2.0</el-tag>。
