---
title: Markdown Syntax
description: Containers, relative links and demo manifest conventions.
group: Advanced
order: 20
---

# Markdown Syntax

## Callout containers

Four container types are supported: `tip`, `warning`, `danger` and `info`.

:::tip Optional title
The title lives on the same line as `:::`, and the body starts on the next line.
:::

:::warning
A container must be closed by `:::` on its own line.
:::

## Relative links

Markdown links are resolved from the directory of the current document and lose
their `.md` extension. For example, [Getting started](./getting-started.md#your-first-demo)
is rewritten to the matching docs URL.

## Demo manifests

Every page with demos keeps a manifest at
`src/content/demos/<section>/<slug>.ts`:

```ts
const manifest: DemoManifest = {
  "hello/basic": {
    load: () => import("@/components/docs/notes/hello-demo"),
    sourceFile: "src/components/docs/notes/hello-demo.tsx",
  },
};
```

`sourceFile` points at the React component that actually renders, so the source
panel shows the code that is really running on the page.

## Raw HTML

`<el-tag round effect="plain">2.2.0</el-tag>` in the body maps to the local ElTag
component, for example <el-tag round effect="plain" size="small">2.2.0</el-tag>.
