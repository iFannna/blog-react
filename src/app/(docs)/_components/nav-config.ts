/**
 * 文档站侧边栏导航。
 *
 * 分组与顺序、条目文案、归属组件全部对齐官方
 * docs/.vitepress/crowdin/en-US/pages/component.json。
 * check-tag 在官方 JSON 中缺失，由生成器额外注入到 Data 分组。
 * done 表示该组件已有对应 page.tsx，缺失的实现会被置灰。
 */

export interface DocNavItem {
  /** 路由末段，对应 /docs/element-plus/components/[slug] */
  slug: string;
  /** 官方侧边栏里的英文标题 */
  title: string;
  /** 是否已实现 */
  done?: boolean;
}

export interface DocNavGroup {
  title: string;
  items: DocNavItem[];
}

export const DOC_NAV: DocNavGroup[] = [
  {
    title: "Overview 组件总览",
    items: [
      { slug: "overview", title: "Overview", done: true },
    ],
  },
  {
    title: "Basic 基础组件",
    items: [
      { slug: "button", title: "Button", done: true },
      { slug: "border", title: "Border", done: true },
      { slug: "color", title: "Color", done: true },
      { slug: "container", title: "Layout Container", done: true },
      { slug: "icon", title: "Icon", done: true },
      { slug: "layout", title: "Layout", done: true },
      { slug: "link", title: "Link", done: true },
      { slug: "text", title: "Text", done: true },
      { slug: "scrollbar", title: "Scrollbar", done: true },
      { slug: "space", title: "Space", done: true },
      { slug: "splitter", title: "Splitter", done: true },
      { slug: "typography", title: "Typography", done: true },
    ],
  },
  {
    title: "Configuration 全局配置",
    items: [
      { slug: "config-provider", title: "Config Provider", done: true },
    ],
  },
  {
    title: "Form 表单组件",
    items: [
      { slug: "autocomplete", title: "Autocomplete", done: true },
      { slug: "cascader", title: "Cascader", done: true },
      { slug: "checkbox", title: "Checkbox", done: true },
      { slug: "color-picker-panel", title: "Color Picker Panel", done: true },
      { slug: "color-picker", title: "Color Picker", done: true },
      { slug: "date-picker-panel", title: "Date Picker Panel", done: true },
      { slug: "date-picker", title: "Date Picker", done: true },
      { slug: "datetime-picker", title: "DateTime Picker", done: true },
      { slug: "form", title: "Form", done: true },
      { slug: "input", title: "Input", done: true },
      { slug: "input-number", title: "Input Number", done: true },
      { slug: "input-tag", title: "Input Tag", done: true },
      { slug: "input-otp", title: "Input OTP", done: true },
      { slug: "mention", title: "Mention", done: true },
      { slug: "radio", title: "Radio", done: true },
      { slug: "rate", title: "Rate", done: true },
      { slug: "select", title: "Select", done: true },
      { slug: "select-v2", title: "Virtualized Select", done: true },
      { slug: "slider", title: "Slider", done: true },
      { slug: "switch", title: "Switch", done: true },
      { slug: "time-picker", title: "Time Picker", done: true },
      { slug: "time-select", title: "Time Select", done: true },
      { slug: "transfer", title: "Transfer", done: true },
      { slug: "tree-select", title: "TreeSelect", done: true },
      { slug: "upload", title: "Upload", done: true },
    ],
  },
  {
    title: "Data 数据展示",
    items: [
      { slug: "avatar", title: "Avatar", done: true },
      { slug: "badge", title: "Badge", done: true },
      { slug: "calendar", title: "Calendar", done: true },
      { slug: "card", title: "Card", done: true },
      { slug: "carousel", title: "Carousel", done: true },
      { slug: "collapse", title: "Collapse", done: true },
      { slug: "descriptions", title: "Descriptions", done: true },
      { slug: "empty", title: "Empty", done: true },
      { slug: "image", title: "Image", done: true },
      { slug: "infinite-scroll", title: "Infinite Scroll", done: true },
      { slug: "pagination", title: "Pagination", done: true },
      { slug: "progress", title: "Progress", done: true },
      { slug: "result", title: "Result", done: true },
      { slug: "skeleton", title: "Skeleton", done: true },
      { slug: "table", title: "Table", done: true },
      { slug: "table-v2", title: "Virtualized Table", done: true },
      { slug: "tag", title: "Tag", done: true },
      { slug: "check-tag", title: "Check Tag", done: true },
      { slug: "timeline", title: "Timeline", done: true },
      { slug: "tour", title: "Tour", done: true },
      { slug: "tree", title: "Tree", done: true },
      { slug: "tree-v2", title: "Virtualized Tree", done: true },
      { slug: "statistic", title: "Statistic", done: true },
      { slug: "segmented", title: "Segmented", done: true },
    ],
  },
  {
    title: "Navigation 导航",
    items: [
      { slug: "affix", title: "Affix", done: true },
      { slug: "anchor", title: "Anchor", done: true },
      { slug: "backtop", title: "Backtop", done: true },
      { slug: "breadcrumb", title: "Breadcrumb", done: true },
      { slug: "dropdown", title: "Dropdown", done: true },
      { slug: "menu", title: "Menu", done: true },
      { slug: "page-header", title: "Page Header", done: true },
      { slug: "steps", title: "Steps", done: true },
      { slug: "tabs", title: "Tabs", done: true },
    ],
  },
  {
    title: "Feedback 反馈组件",
    items: [
      { slug: "alert", title: "Alert", done: true },
      { slug: "dialog", title: "Dialog", done: true },
      { slug: "drawer", title: "Drawer", done: true },
      { slug: "loading", title: "Loading", done: true },
      { slug: "message", title: "Message", done: true },
      { slug: "message-box", title: "Message Box", done: true },
      { slug: "notification", title: "Notification", done: true },
      { slug: "popconfirm", title: "Popconfirm", done: true },
      { slug: "popover", title: "Popover", done: true },
      { slug: "tooltip", title: "Tooltip", done: true },
    ],
  },
  {
    title: "Others 其他",
    items: [
      { slug: "divider", title: "Divider", done: true },
      { slug: "watermark", title: "Watermark", done: true },
    ],
  },
];

/** 扁平列表，用于按 slug 查标题。 */
export const DOC_NAV_FLAT: DocNavItem[] = DOC_NAV.flatMap((g) => g.items);

export function findNavItem(slug: string) {
  return DOC_NAV_FLAT.find((item) => item.slug === slug);
}
