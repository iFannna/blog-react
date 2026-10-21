---
title: Getting Started
description: A guide to writing docs — file layout, frontmatter, content syntax and demos.
group: Basics
order: 10
---

# Getting Started

Docs are written in Markdown and served from content files, so no React components are required. This guide covers the full workflow from creating a file to previewing the page.

## Create a document

### File location

Documents live under `src/content/docs/<locale>/notes/`:

| File | URL |
| --- | --- |
| `zh-CN/notes/deploy.md` | `/zh-CN/docs/notes/deploy` |
| `en-US/notes/deploy.md` | `/en-US/docs/notes/deploy` |

The filename becomes the last URL segment. Subdirectories are supported: `notes/server/deploy.md` maps to `/docs/notes/server/deploy`. Files or directories starting with `_` are ignored.

Use the same filename in both locales. A document that exists in only one language remains reachable from the other locale with a fallback notice, but it is not listed in that locale's sidebar.

### Frontmatter

Every document starts with a YAML frontmatter block:

```yaml
---
title: Deployment
description: Steps for shipping the site to production.
group: Basics
order: 30
draft: false
---
```

| Field | Required | Description |
| --- | --- | --- |
| `title` | Yes | Page title, also used in the sidebar |
| `description` | No | Meta description |
| `group` | No | Sidebar group, defaults to "Documents" |
| `order` | No | Sort weight; lower comes first, defaults to 1000; groups sort by their smallest value |
| `draft` | No | When `true`, the document is hidden and inaccessible |

A missing `title` fails the build. All other fields are optional.

## Write content

The body supports standard Markdown. H2 and H3 headings automatically become table-of-contents entries with anchors.

### Callouts

Use `:::tip`, `:::warning`, `:::danger` or `:::info` to highlight content. An optional title follows the type; without one, the type name is displayed. Close the block with a standalone `:::`.

:::tip Optional title
The title shares the line with `:::`, and the body starts on the next line.
:::

:::warning
Callout bodies support multi-line Markdown.
:::

:::danger Heads up
Use `danger` for data loss or irreversible operations.
:::

### Relative links

Markdown links resolve from the directory of the current document. The `.md` extension is removed and anchors are preserved:

| Syntax | Result |
| --- | --- |
| `[Getting Started](./start.md)` | `/en-US/docs/notes/start` |
| `[frontmatter](./start.md#frontmatter)` | The matching section |

`../` reaches documents in a parent directory. Site-absolute paths starting with `/` and `http(s)://` links are not rewritten; external links open in a new tab.

### Code blocks

Add a language to the fence to enable highlighting:

```ts
const order: number = 10;
```

Supported languages: ts, tsx, js, json, html, css, bash, go, java, python, sql, yaml, xml, markdown and dockerfile. Unknown languages render as plain text.

### Tables and type markers

Tables use standard Markdown, and the type column accepts shorthand markers:

| Name | Type | Description |
| --- | --- | --- |
| `disabled` | ^[boolean] | Whether the component is disabled |
| `size` | ^[enum]`'large' \| 'default' \| 'small'` | Component size |

- `^[boolean]` renders as inline code;
- `^[enum]` followed by an inline code span produces a clickable type marker;
- `^(2.2.0)` renders as a version tag; letter markers such as `^(beta)` use a matching badge style, for example ^(2.2.0) and ^(beta).

### Raw HTML

Raw HTML is supported in the body. `<el-tag>` renders as the local tag component:

<el-tag round effect="plain" size="small">2.2.0</el-tag>

## Add a demo

Embed interactive examples with a `:::demo` container. The text after `:::demo` is the description, the first non-empty line is the demo key, and a standalone `:::` closes the block:

:::demo Click the button and the counter increases.
hello/basic

:::

The demo key must be registered in a manifest at `src/content/demos/<section>/<page>.ts`, for example `src/content/demos/notes/start.ts`:

```ts
import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "hello/basic": {
    load: () => import("@/components/docs/notes/hello-demo"),
    sourceFile: "src/components/docs/notes/hello-demo.tsx",
  },
};

export default manifest;
```

| Field | Required | Description |
| --- | --- | --- |
| `load` | Yes | Dynamic import that returns the demo component |
| `sourceFile` | Yes | File read by the source panel |
| `exportName` | No | Export name when one file contains multiple demos |
| `lang` | No | Source language, defaults to `tsx` |
| `plain` | No | When `true`, the source panel is hidden |

After adding a manifest, register it in `src/content/demos/registry.generated.ts`. This repo no longer ships a generator script, so add the entry manually.

## Preview

Save the file and refresh the page; development updates navigation and content automatically. Run a production build before deployment so new documents are included in the static params.
