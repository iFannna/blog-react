import type { DocLocale } from "./types";

export interface DocsMessages {
  copyCode: string;
  copied: string;
  copyFailed: string;
  copyUnsupported: string;
  viewSource: string;
  hideSource: string;
  foldCodeRegion: string;
  unfoldCodeRegion: string;
  foldedLine: string;
  foldedLines: string;
  previous: string;
  next: string;
  missingDemo: string;
  fallbackNotice: string;
  switchLanguage: string;
  switchToLight: string;
  switchToDark: string;
  pagerLabel: string;
  tocTitle: string;
}

export const DOCS_MESSAGES: Record<DocLocale, DocsMessages> = {
  "zh-CN": {
    copyCode: "复制代码",
    copied: "已复制！",
    copyFailed: "复制失败",
    copyUnsupported: "当前浏览器不支持自动复制！",
    viewSource: "查看源代码",
    hideSource: "隐藏源代码",
    foldCodeRegion: "折叠代码区域",
    unfoldCodeRegion: "展开代码区域",
    foldedLine: "已折叠 {lines} 行",
    foldedLines: "已折叠 {lines} 行",
    previous: "上一篇",
    next: "下一篇",
    missingDemo: "该示例尚未提供",
    fallbackNotice: "该页面暂无中文版本，以下显示英文内容。",
    switchLanguage: "切换语言",
    switchToLight: "切换到亮色模式",
    switchToDark: "切换到暗色模式",
    pagerLabel: "文档翻页",
    tocTitle: "目录",
  },
  "en-US": {
    copyCode: "Copy code",
    copied: "Copied!",
    copyFailed: "Copy failed",
    copyUnsupported: "Clipboard is not available in this browser.",
    viewSource: "View source",
    hideSource: "Hide source",
    foldCodeRegion: "Fold code region",
    unfoldCodeRegion: "Unfold code region",
    foldedLine: "{lines} line",
    foldedLines: "{lines} lines",
    previous: "Previous",
    next: "Next",
    missingDemo: "This demo is not available yet",
    fallbackNotice:
      "This page is not available in English yet. Showing the Chinese version below.",
    switchLanguage: "Switch language",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    pagerLabel: "Docs pager",
    tocTitle: "Table of contents",
  },
};
