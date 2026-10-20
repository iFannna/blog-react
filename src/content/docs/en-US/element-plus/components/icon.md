---
title: Icon
description: Element Plus provides a set of common icons.
group: Basic
order: 50
---

# Icon

Element Plus provides a set of common icons.

## Simple Usage

`ElIcon` provides size and color attributes for the SVG icon. An icon can also be used on its own.

:::demo

icon/simple

:::

## Combined with ElIcon

`ElIcon` gives raw SVG icons extra attributes. Add the `is-loading` class to make an icon rotate 360 degrees in 2 seconds; you can override this animation.

:::demo

icon/combined

:::

## Using SVG icon directly

SVG icons do not carry any attributes by default. Provide `width` / `height` or a class when using them directly.

:::demo

icon/direct

:::

## Icon Collection

All 293 official icons are generated from `@element-plus/icons-vue`; the SVG data matches the official icons byte for byte.

:::demo

icon/collection

:::

## API

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| size | SVG icon size, size x size | ^[number] / ^[string] | inherit from font size |
| color | SVG tag's fill attribute | ^[string] | inherit from color |

## Differences from the Vue version

The official icon package exports Vue components. In React, icons are generated from the same SVG sources by `scripts/build-element-icons.mjs` and used directly, without a Vue runtime.

| Vue | React |
| --- | --- |
| `import { Edit } from '@element-plus/icons-vue'` | `import { Edit } from "@/components/element-plus/icons"` |
| Register icons globally with `app.component(name, Icon)` | Import icons on demand or look them up from the `icons` module |
| `<el-icon :size="24">` | `<ElIcon size={24}>` |
| `class="is-loading"` | `className="is-loading"` |

Run `npm run build:icons` after upgrading the icon package to regenerate the components.
