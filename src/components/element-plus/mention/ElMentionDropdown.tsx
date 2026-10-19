"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
import { ElScrollbar, type ScrollbarExpose } from "../scrollbar";
import { useTranslator } from "../config-provider/context";
import { scrollIntoView } from "./helper";
import type { MentionOption } from "./types";

export interface MentionDropdownProps {
  /** 已按别名映射、并过滤后的选项 */
  options?: MentionOption[];
  /** 加载中：隐藏列表，改显示 loading 文案 */
  loading?: boolean;
  /** 整体禁用 */
  disabled?: boolean;
  /** 列表容器的 id，供输入框的 aria-controls 指向 */
  contentId?: string;
  /** 列表容器的 aria-label */
  ariaLabel?: string;
  /** 当前悬停项下标，-1 表示无 */
  hoveringIndex?: number;
  /** 鼠标移入某项 */
  onHoveringChange?: (index: number) => void;
  /** 选中某项 */
  onSelect?: (option: MentionOption) => void;
  /** 自定义选项内容，对应官方 label 插槽 */
  labelSlot?: (props: { item: MentionOption; index: number }) => ReactNode;
  /** 自定义加载内容，对应官方 loading 插槽 */
  loadingSlot?: ReactNode;
  /** 下拉顶部内容，对应官方 header 插槽 */
  headerSlot?: ReactNode;
  /** 下拉底部内容，对应官方 footer 插槽 */
  footerSlot?: ReactNode;
  /** 点击下拉面板（非选项）时触发，用于把焦点交回输入框 */
  onRootClick?: () => void;
}

/** 对应官方 defineExpose 暴露给 mention 的实例方法。 */
export interface MentionDropdownExpose {
  /** 把第 index 项滚动到可视区 */
  scrollToIndex: (index: number) => void;
}

/**
 * 对应官方 ElMentionDropdown。
 *
 * 结构：.el-mention-dropdown > [header] + .el-scrollbar(ul.el-mention-dropdown__list) + [loading] + [footer]。
 * 官方把 hover 状态与键盘导航放在本组件内、通过 expose 暴露给 mention 调用；
 * React 里由 ElMention 持有 hoveringIndex 并下发，这里只负责渲染与滚动定位。
 */
export const ElMentionDropdown = forwardRef<
  MentionDropdownExpose,
  MentionDropdownProps
>(function ElMentionDropdown(
  {
    options = [],
    loading = false,
    disabled = false,
    contentId,
    ariaLabel,
    hoveringIndex = -1,
    onHoveringChange,
    onSelect,
    labelSlot,
    loadingSlot,
    headerSlot,
    footerSlot,
    onRootClick,
  },
  ref,
) {
  const t = useTranslator();
  const scrollbarRef = useRef<ScrollbarExpose>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  /**
   * 官方在 nextTick 里用 querySelector 找 wrap，再由 scrollIntoView 对齐。
   * 这里直接取 ElScrollbar 暴露的 wrapRef，等价且不需要查 DOM。
   */
  useImperativeHandle(ref, () => ({
    scrollToIndex(index: number) {
      const target = optionRefs.current[index];
      const wrap = scrollbarRef.current?.wrapRef.current;
      if (target && wrap) scrollIntoView(wrap, target);
      scrollbarRef.current?.handleScroll();
    },
  }));

  return (
    <div
      className="el-mention-dropdown"
      // 阻止默认行为，避免 mousedown 触发输入框失焦导致下拉先被卸载、click 丢失
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onRootClick?.();
      }}
    >
      {headerSlot != null && (
        <div className="el-mention-dropdown__header">{headerSlot}</div>
      )}

      <ElScrollbar
        ref={scrollbarRef}
        id={contentId}
        tag="ul"
        role="listbox"
        ariaLabel={ariaLabel}
        ariaOrientation="vertical"
        wrapClass="el-mention-dropdown__wrap"
        viewClass="el-mention-dropdown__list"
        // 对应官方 v-show：加载中或没有选项时隐藏列表
        style={
          options.length > 0 && !loading ? undefined : { display: "none" }
        }
      >
        {options.map((item, index) => (
          <li
            key={index}
            id={contentId === undefined ? undefined : `${contentId}-${index}`}
            ref={(el) => {
              optionRefs.current[index] = el;
            }}
            className={[
              "el-mention-dropdown__item",
              hoveringIndex === index && "is-hovering",
              (item.disabled || disabled) && "is-disabled",
            ]
              .filter(Boolean)
              .join(" ")}
            role="option"
            aria-disabled={item.disabled || disabled || undefined}
            aria-selected={hoveringIndex === index}
            onMouseMove={() => onHoveringChange?.(index)}
            onClick={(event) => {
              event.stopPropagation();
              // 官方 handleSelect 会忽略禁用项与整体禁用
              if (item.disabled || disabled) return;
              onSelect?.(item);
            }}
          >
            {labelSlot ? (
              labelSlot({ item, index })
            ) : (
              <span>{item.label ?? item.value}</span>
            )}
          </li>
        ))}
      </ElScrollbar>

      {loading && (
        <div className="el-mention-dropdown__loading">
          {loadingSlot ?? t("el.mention.loading")}
        </div>
      )}

      {footerSlot != null && (
        <div className="el-mention-dropdown__footer">{footerSlot}</div>
      )}
    </div>
  );
});
