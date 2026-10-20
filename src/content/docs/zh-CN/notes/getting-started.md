---
title: 快速开始
description: 了解通用文档页的 Markdown 写法、示例引用与代码高亮。
group: 入门
order: 10
---

# 快速开始

技术笔记 section 使用纯 Markdown 编写，渲染管线对齐 Element Plus 官方文档：

- `:::demo` 引用本地 React 示例，并展示示例源码；
- `:::tip` / `:::warning` 生成提示块；
- 代码块由 Shiki 高亮，明暗主题与官方一致。

:::tip
文档正文不需要 React 或 MDX 知识，只要会写 Markdown 就能新增页面。
:::

## 第一个示例

`:::demo` 后面的文字是示例说明，容器内第一行对应 demo manifest 里的路径。

:::demo 这是一个带状态的最小示例，点击按钮后计数会增加。

hello/basic

:::

## 代码块

```tsx
import { ElButton } from "@/components/element-plus/button";

export default function Demo() {
  return (
    <div>
      <ElButton type="primary">Hello</ElButton>
    </div>
  );
}
```

## 表格与类型标记

官方 API 表格里的类型标记同样可用：

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| `disabled` | ^[boolean] | 是否禁用 |
| `size` | ^[enum]`'large' \| 'default' \| 'small'` | 组件尺寸 |

版本标记会渲染成小标签，例如这个能力在 ^(2.2.0) 引入。

:::warning 迁移提示
Element Plus 的 84 个组件文档目前仍由旧页面渲染，后续会分批迁移到这套 Markdown 管线。
:::

## 继续阅读

下一篇文章介绍了容器、链接与示例清单的约定：[Markdown 语法](./markdown-syntax.md)。
