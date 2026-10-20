---
title: CheckTag
description: A tag that can be checked, used to quickly toggle the selected state.
group: Data
order: 260
---

# CheckTag

A tag that can be checked, used to quickly toggle the selected state.

## Basic usage

Click the tag to toggle the checked state.

:::demo

check-tag/basic

:::

## Types

Set the tag type with `type`.

:::demo

check-tag/types

:::

## Disabled

Clicking no longer toggles the state after `disabled` is set.

:::demo

check-tag/disabled

:::

## CheckTag API

### CheckTag Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Whether the tag is checked | ^[boolean] | false |
| type | Tag type | ^[enum]`'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'` | primary |
| disabled | Whether the tag is disabled | ^[boolean] | false |

### CheckTag Events

| Name | Description | Parameters |
| --- | --- | --- |
| onCheckedChange | Triggered when the checked state changes | ^[Function]`(checked: boolean) => void` |

### CheckTag Slots

| Name | Description | React prop |
| --- | --- | --- |
| default | Tag content | `children` |
