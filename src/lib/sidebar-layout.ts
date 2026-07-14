// 桌面端侧边栏布局：right(默认) / left / none
// 客户端切换时写 localStorage + 设 <html data-sidebar-layout>；
// 首屏由 layout.tsx 内联脚本同步读取该值，避免右侧默认再跳变的闪烁
export type SidebarLayout = "right" | "left" | "none";

export const SIDEBAR_LAYOUT_KEY = "sidebar-layout";

export function setSidebarLayout(layout: SidebarLayout) {
  try {
    localStorage.setItem(SIDEBAR_LAYOUT_KEY, layout);
  } catch {
    // 隐私模式或存储禁用时忽略，不影响当次切换
  }
  document.documentElement.setAttribute("data-sidebar-layout", layout);
}
