/**
 * 文档站侧边栏导航。
 *
 * 分组与顺序、条目文案、归属组件全部对齐官方
 * docs/.vitepress/crowdin/en-US/pages/component.json。
 * titleZh 取自 zh-CN markdown frontmatter，即官方中文文档的「英文 + 中文」写法。
 * check-tag 在官方 JSON 中缺失，由生成器额外注入到 Data 分组。
 * done 表示该组件已有对应 page.tsx，缺失的实现会被置灰。
 */

export interface DocNavItem {
  /** 路由末段，对应 /docs/element-plus/components/[slug] */
  slug: string;
  /** 官方侧边栏里的英文标题 */
  title: string;
  /** 官方中文侧边栏标题，如 "Button 按钮"；无中文文档时省略 */
  titleZh?: string;
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
      { slug: "overview", title: "Overview", titleZh: "Overview 组件总览", done: true },
    ],
  },
  {
    title: "Basic 基础组件",
    items: [
      { slug: "button", title: "Button", titleZh: "Button 按钮", done: true },
      { slug: "border", title: "Border", titleZh: "Border 边框", done: true },
      { slug: "color", title: "Color", titleZh: "Color 色彩", done: true },
      { slug: "container", title: "Layout Container", titleZh: "Container 布局容器", done: true },
      { slug: "icon", title: "Icon", titleZh: "Icon 图标", done: true },
      { slug: "layout", title: "Layout", titleZh: "Layout 布局", done: true },
      { slug: "link", title: "Link", titleZh: "Link 链接", done: true },
      { slug: "text", title: "Text", titleZh: "Text 文本", done: true },
      { slug: "scrollbar", title: "Scrollbar", titleZh: "Scrollbar 滚动条", done: true },
      { slug: "space", title: "Space", titleZh: "Space 间距", done: true },
      { slug: "splitter", title: "Splitter", titleZh: "Splitter 分隔面板", done: true },
      { slug: "typography", title: "Typography", titleZh: "Typography 排版", done: true },
    ],
  },
  {
    title: "Configuration 全局配置",
    items: [
      { slug: "config-provider", title: "Config Provider", titleZh: "Config Provider 全局配置", done: true },
    ],
  },
  {
    title: "Form 表单组件",
    items: [
      { slug: "autocomplete", title: "Autocomplete", titleZh: "Autocomplete 自动补全", done: true },
      { slug: "cascader", title: "Cascader", titleZh: "Cascader 级联选择器", done: true },
      { slug: "checkbox", title: "Checkbox", titleZh: "Checkbox 多选框", done: true },
      { slug: "color-picker-panel", title: "Color Picker Panel", titleZh: "ColorPickerPanel 颜色选择面板", done: true },
      { slug: "color-picker", title: "Color Picker", titleZh: "ColorPicker 颜色选择器", done: true },
      { slug: "date-picker-panel", title: "Date Picker Panel", titleZh: "DatePickerPanel 日期选择器面板", done: true },
      { slug: "date-picker", title: "Date Picker", titleZh: "DatePicker 日期选择器", done: true },
      { slug: "datetime-picker", title: "DateTime Picker", titleZh: "DateTimePicker 日期时间选择器", done: true },
      { slug: "form", title: "Form", titleZh: "Form 表单组件", done: true },
      { slug: "input", title: "Input", titleZh: "Input 输入框", done: true },
      { slug: "input-number", title: "Input Number", titleZh: "Input Number 数字输入框", done: true },
      { slug: "input-tag", title: "Input Tag", titleZh: "InputTag 标签输入框", done: true },
      { slug: "input-otp", title: "Input OTP", titleZh: "InputOtp 一次性密码输入框", done: true },
      { slug: "mention", title: "Mention", titleZh: "Mention 提及", done: true },
      { slug: "radio", title: "Radio", titleZh: "Radio 单选框", done: true },
      { slug: "rate", title: "Rate", titleZh: "Rate 评分", done: true },
      { slug: "select", title: "Select", titleZh: "Select 选择器", done: true },
      { slug: "select-v2", title: "Virtualized Select", titleZh: "Select V2 虚拟化选择器", done: true },
      { slug: "slider", title: "Slider", titleZh: "Slider 滑块", done: true },
      { slug: "switch", title: "Switch", titleZh: "Switch 开关", done: true },
      { slug: "time-picker", title: "Time Picker", titleZh: "TimePicker 时间选择器", done: true },
      { slug: "time-select", title: "Time Select", titleZh: "TimeSelect 时间选择器", done: true },
      { slug: "transfer", title: "Transfer", titleZh: "Transfer 穿梭框", done: true },
      { slug: "tree-select", title: "TreeSelect", titleZh: "TreeSelect 树形选择器", done: true },
      { slug: "upload", title: "Upload", titleZh: "Upload 上传", done: true },
    ],
  },
  {
    title: "Data 数据展示",
    items: [
      { slug: "avatar", title: "Avatar", titleZh: "Avatar 头像", done: true },
      { slug: "badge", title: "Badge", titleZh: "Badge 徽章", done: true },
      { slug: "calendar", title: "Calendar", titleZh: "Calendar 日历", done: true },
      { slug: "card", title: "Card", titleZh: "Card 卡片", done: true },
      { slug: "carousel", title: "Carousel", titleZh: "Carousel 走马灯", done: true },
      { slug: "collapse", title: "Collapse", titleZh: "Collapse 折叠面板", done: true },
      { slug: "descriptions", title: "Descriptions", titleZh: "Descriptions 描述列表", done: true },
      { slug: "empty", title: "Empty", titleZh: "Empty 空状态", done: true },
      { slug: "image", title: "Image", titleZh: "Image 图片", done: true },
      { slug: "infinite-scroll", title: "Infinite Scroll", titleZh: "Infinite Scroll 无限滚动", done: true },
      { slug: "pagination", title: "Pagination", titleZh: "Pagination 分页", done: true },
      { slug: "progress", title: "Progress", titleZh: "Progress 进度条", done: true },
      { slug: "result", title: "Result", titleZh: "Result 结果", done: true },
      { slug: "skeleton", title: "Skeleton", titleZh: "Skeleton 骨架屏", done: true },
      { slug: "table", title: "Table", titleZh: "Table 表格", done: true },
      { slug: "table-v2", title: "Virtualized Table", titleZh: "Table V2 虚拟化表格", done: true },
      { slug: "tag", title: "Tag", titleZh: "Tag 标签", done: true },
      { slug: "check-tag", title: "Check Tag", titleZh: "CheckTag 可勾选标签", done: true },
      { slug: "timeline", title: "Timeline", titleZh: "Timeline 时间线", done: true },
      { slug: "tour", title: "Tour", titleZh: "Tour 漫游式引导", done: true },
      { slug: "tree", title: "Tree", titleZh: "Tree 树形控件", done: true },
      { slug: "tree-v2", title: "Virtualized Tree", titleZh: "Tree V2 虚拟化树形控件", done: true },
      { slug: "statistic", title: "Statistic", titleZh: "Statistic 统计组件", done: true },
      { slug: "segmented", title: "Segmented", titleZh: "Segmented 分段控制器", done: true },
    ],
  },
  {
    title: "Navigation 导航",
    items: [
      { slug: "affix", title: "Affix", titleZh: "Affix 固钉", done: true },
      { slug: "anchor", title: "Anchor", titleZh: "Anchor 锚点", done: true },
      { slug: "backtop", title: "Backtop", titleZh: "Backtop 回到顶部", done: true },
      { slug: "breadcrumb", title: "Breadcrumb", titleZh: "Breadcrumb 面包屑", done: true },
      { slug: "dropdown", title: "Dropdown", titleZh: "Dropdown 下拉菜单", done: true },
      { slug: "menu", title: "Menu", titleZh: "Menu 菜单", done: true },
      { slug: "page-header", title: "Page Header", titleZh: "Page Header 页头", done: true },
      { slug: "steps", title: "Steps", titleZh: "Steps 步骤条", done: true },
      { slug: "tabs", title: "Tabs", titleZh: "Tabs 标签页", done: true },
    ],
  },
  {
    title: "Feedback 反馈组件",
    items: [
      { slug: "alert", title: "Alert", titleZh: "Alert 提示", done: true },
      { slug: "dialog", title: "Dialog", titleZh: "Dialog 对话框", done: true },
      { slug: "drawer", title: "Drawer", titleZh: "Drawer 抽屉", done: true },
      { slug: "loading", title: "Loading", titleZh: "Loading 加载", done: true },
      { slug: "message", title: "Message", titleZh: "Message 消息提示", done: true },
      { slug: "message-box", title: "Message Box", titleZh: "MessageBox 消息弹出框", done: true },
      { slug: "notification", title: "Notification", titleZh: "Notification 通知", done: true },
      { slug: "popconfirm", title: "Popconfirm", titleZh: "Popconfirm 气泡确认框", done: true },
      { slug: "popover", title: "Popover", titleZh: "Popover 弹出框", done: true },
      { slug: "tooltip", title: "Tooltip", titleZh: "Tooltip 文字提示", done: true },
    ],
  },
  {
    title: "Others 其他",
    items: [
      { slug: "divider", title: "Divider", titleZh: "Divider 分割线", done: true },
      { slug: "watermark", title: "Watermark", titleZh: "Watermark 水印", done: true },
    ],
  },
];

/** 扁平列表，用于按 slug 查标题。 */
export const DOC_NAV_FLAT: DocNavItem[] = DOC_NAV.flatMap((g) => g.items);

export function findNavItem(slug: string) {
  return DOC_NAV_FLAT.find((item) => item.slug === slug);
}
