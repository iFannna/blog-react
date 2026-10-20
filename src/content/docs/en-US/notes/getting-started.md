---
title: Getting Started
description: Markdown authoring, demo references and syntax highlighting for the docs section.
group: Basics
order: 10
---

# Getting Started

The notes section is written in plain Markdown and mirrors the Element Plus
documentation pipeline:

- `:::demo` renders a local React example and shows its source;
- `:::tip` / `:::warning` become callouts;
- code fences are highlighted by Shiki with the same light and dark themes.

:::tip
Writing docs does not require React or MDX knowledge — plain Markdown is enough.
:::

## Your first demo

The text after `:::demo` is the description. The first line inside the container
is the demo path from the page manifest.

:::demo A minimal stateful example: the counter grows when the button is clicked.

hello/basic

:::

## Code blocks

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

## Tables and type markers

The API type markers used by the official docs work here too:

| Name | Type | Description |
| --- | --- | --- |
| `disabled` | ^[boolean] | Whether the component is disabled |
| `size` | ^[enum]`'large' \| 'default' \| 'small'` | Component size |

Version markers render as a small tag, for example ^(2.2.0).

:::warning Migration note
The 84 Element Plus component pages are still rendered by the legacy pages. They
will be migrated to this Markdown pipeline in batches.
:::

## Keep reading

The next page covers containers, links and demo manifests: [Markdown syntax](./markdown-syntax.md).
