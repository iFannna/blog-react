"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElInput } from "../input/ElInput";
import { ElPopperArrow } from "../popper/ElPopperArrow";
import { useFormDisabled } from "../form/use-form";
import type { InputProps } from "../input/types";
import type { Options } from "@popperjs/core";
import {
  ElMentionDropdown,
  type MentionDropdownExpose,
} from "./ElMentionDropdown";
import {
  EVENT_CODE,
  filterOption as defaultFilterOption,
  getCursorPosition,
  getEventCode,
  getMentionCtx,
} from "./helper";
import type { MentionCtx, MentionOption, MentionOptionProps } from "./types";

/** 官方 mentionDefaultProps 的等价物。 */
const MENTION_DEFAULT_PROPS: Required<MentionOptionProps> = {
  value: "value",
  label: "label",
  disabled: "disabled",
};

export interface MentionProps extends Omit<InputProps, "onSelect"> {
  /** 选项列表 */
  options?: MentionOption[];
  /** 触发提及的前缀字符，长度必须为 1，可传数组 */
  prefix?: string | string[];
  /** 分隔提及的字符，长度必须为 1 */
  split?: string;
  /** 自定义过滤逻辑，传 false 关闭过滤 */
  filterOption?: false | ((pattern: string, option: MentionOption) => boolean);
  /** 弹出位置 */
  placement?: "bottom" | "top";
  /** 弹层是否带箭头 */
  showArrow?: boolean;
  /** 弹层与输入框的偏移 */
  offset?: number;
  /** 按退格时是否把整个提及词作为整体删除 */
  whole?: boolean;
  /** 自定义「整词」判定逻辑 */
  checkIsWhole?: (pattern: string, prefix: string) => boolean;
  /** 下拉是否处于加载中 */
  loading?: boolean;
  /** 弹层自定义类名 */
  popperClass?: string;
  /** 弹层自定义样式 */
  popperStyle?: CSSProperties;
  /** 透传给 popper.js 的配置，当前未接入 */
  popperOptions?: Partial<Options>;
  /** 选项字段别名配置 */
  props?: MentionOptionProps;
  /** 触发前缀时回调 */
  onSearch?: (pattern: string, prefix: string) => void;
  /** 选中选项时回调 */
  onSelect?: (option: MentionOption, prefix: string) => void;
  /** 整体删除提及词时回调 */
  onWholeRemove?: (pattern: string, prefix: string) => void;
  /** 自定义选项内容，对应官方 label 插槽 */
  labelSlot?: (props: { item: MentionOption; index: number }) => ReactNode;
  /** 自定义加载内容，对应官方 loading 插槽 */
  loadingSlot?: ReactNode;
  /** 下拉顶部内容，对应官方 header 插槽 */
  headerSlot?: ReactNode;
  /** 下拉底部内容，对应官方 footer 插槽 */
  footerSlot?: ReactNode;
  /** 原生输入框元素，供使用方在 selected 事件后自行聚焦/定位 */
  inputRef?: (el: HTMLInputElement | null) => void;
  /** 原生 textarea 元素，type 为 textarea 时生效 */
  textareaRef?: (el: HTMLTextAreaElement | null) => void;
}

/** 对应官方 defineExpose：input / tooltip / dropdownVisible（tooltip 实例无 React 等价物）。 */
export interface MentionExpose {
  readonly input: HTMLInputElement | null;
  readonly textarea: HTMLTextAreaElement | null;
  readonly dropdownVisible: boolean;
}

/**
 * 官方锚点（一条竖线宽的空白 div）的固定高度：34px 输入框加上下各 1px 边框。
 * 弹层底部定位时以此为基准向下偏移，再叠加 offset。
 */
const ANCHOR_HEIGHT = 36;

/**
 * 对应官方 ElMention。
 *
 * 复刻要点：
 * - 组合 ElInput，v-bind 透传 input 相关属性；结构为 .el-mention 包裹输入框、弹层与光标锚点
 * - 锚点是一条竖线宽的空白 div，位置由镜像 div 测量出的文本光标坐标决定
 * - 弹层是「纯定位」（.el-popper.is-pure）面板，不带 popper.js 的翻转与溢出处理，
 *   位置直接由光标坐标换算，效果与官方默认场景一致（贴住光标、宽度由内容决定）
 */
export const ElMention = forwardRef<MentionExpose, MentionProps>(
  function ElMention(
    {
  value,
  onChange,
  type = "text",
  disabled,
  options = [],
  prefix = "@",
  split = " ",
  filterOption = defaultFilterOption,
  placement = "bottom",
  showArrow = false,
  offset = 0,
  whole = false,
  checkIsWhole,
  loading = false,
  popperClass,
  popperStyle,
  popperOptions: _popperOptions,
  props: aliasPropsProp,
  onSearch,
  onSelect,
  onWholeRemove,
  onKeyDown,
  onMouseDown,
  className,
  inputRef,
  textareaRef,
  labelSlot,
  loadingSlot,
  headerSlot,
  footerSlot,
  ...restProps
}: MentionProps,
    ref,
  ) {
  // popper-options 仍不参与本实现的纯定位，这里显式消费以保留 API 兼容
  void _popperOptions;

  const aliasProps: Required<MentionOptionProps> = {
    ...MENTION_DEFAULT_PROPS,
    ...aliasPropsProp,
  };

  const disabledValue = useFormDisabled(disabled);
  const contentId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const inputElRef = useRef<HTMLInputElement | null>(null);
  const textareaElRef = useRef<HTMLTextAreaElement | null>(null);
  const dropdownRef = useRef<MentionDropdownExpose>(null);

  const [visible, setVisible] = useState(false);
  const [hoveringIndex, setHoveringIndex] = useState(-1);
  const [mentionCtx, setMentionCtx] = useState<MentionCtx | undefined>();
  const [cursorStyle, setCursorStyle] = useState<CSSProperties>({
    position: "absolute",
    width: 0,
    height: 0,
  });
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);

  // 事件处理器需要同步读到最新值，而 state 更新有延迟，故另存 ref
  const mentionCtxRef = useRef<MentionCtx | undefined>(undefined);
  const mappedOptionsRef = useRef<MentionOption[]>([]);
  const filteredOptionsRef = useRef<MentionOption[]>([]);
  const visibleRef = useRef(false);
  const hoveringIndexRef = useRef(-1);

  // --- 选项映射与过滤 ---

  const valueKey = aliasProps.value;
  const labelKey = aliasProps.label;
  const disabledKey = aliasProps.disabled;

  const mappedOptions = options.map(
    (option): MentionOption => ({
      ...option,
      value: option[valueKey] as string | undefined,
      label: option[labelKey] as string | undefined,
      disabled: option[disabledKey] as boolean | undefined,
    }),
  );

  // 对应 filteredOptions：只在有提及词且未关闭过滤时筛选
  const filteredOptions =
    !mentionCtx || filterOption === false
      ? mappedOptions
      : mappedOptions.filter((option) => filterOption(mentionCtx.pattern, option));

  mappedOptionsRef.current = mappedOptions;
  filteredOptionsRef.current = filteredOptions;

  // 对应 dropdownVisible：有内容或加载中才真正显示
  const dropdownVisible = visible && (filteredOptions.length > 0 || loading);

  const setVisibleBoth = useCallback((next: boolean) => {
    visibleRef.current = next;
    setVisible(next);
  }, []);

  /** 对应官方：把最新提及上下文同时写入 ref 与 state（浅比较避免多余渲染）。 */
  const applyMentionCtx = useCallback((next: MentionCtx | undefined) => {
    mentionCtxRef.current = next;
    setMentionCtx((prev) => {
      if (!prev || !next) return prev === next ? prev : next;
      return prev.pattern === next.pattern &&
        prev.start === next.start &&
        prev.end === next.end &&
        prev.prefix === next.prefix &&
        prev.splitIndex === next.splitIndex
        ? prev
        : next;
    });
  }, []);

  const getInputEl = useCallback(
    () => (type === "textarea" ? textareaElRef.current : inputElRef.current),
    [type],
  );

  const attachInput = useCallback(
    (node: HTMLInputElement | null) => {
      inputElRef.current = node;
      inputRef?.(node);
    },
    [inputRef],
  );

  const attachTextarea = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaElRef.current = node;
      textareaRef?.(node);
    },
    [textareaRef],
  );

  // --- 光标与下拉同步 ---

  /** 对应官方 syncCursor：把光标坐标换算成相对 .el-mention 的偏移。 */
  const syncCursor = useCallback(() => {
    const inputEl = getInputEl();
    const wrapper = rootRef.current;
    if (!inputEl || !wrapper) return;

    const caretPosition = getCursorPosition(inputEl);
    const inputRect = inputEl.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const left = `${caretPosition.left + inputRect.left - wrapperRect.left}px`;
    const top = `${caretPosition.top + inputRect.top - wrapperRect.top}px`;
    const height = `${caretPosition.height}px`;

    setCursorStyle((prev) =>
      prev.left === left && prev.top === top && prev.height === height
        ? prev
        : { position: "absolute", width: 0, height, left, top },
    );
  }, [getInputEl]);

  /** 对应官方 syncDropdownVisible。 */
  const syncDropdownVisible = useCallback(() => {
    const inputEl = getInputEl();
    if (!inputEl || document.activeElement !== inputEl) {
      setVisibleBoth(false);
      return;
    }

    const ctxValue = getMentionCtx(inputEl, prefix, split);
    applyMentionCtx(ctxValue);

    if (ctxValue && ctxValue.splitIndex === -1) {
      setVisibleBoth(true);
      onSearch?.(ctxValue.pattern, ctxValue.prefix);
      return;
    }

    setVisibleBoth(false);
  }, [getInputEl, setVisibleBoth, applyMentionCtx, prefix, split, onSearch]);

  /**
   * 对应官方 syncAfterCursorMove：光标移动后光标位置与下拉都要重算。
   * 延后一拍执行，等浏览器完成 mousedown 的选区更新，否则读到的是旧光标。
   */
  const syncAfterCursorMove = useCallback(() => {
    hoveringIndexRef.current = -1;
    setHoveringIndex(-1);
    window.setTimeout(() => {
      syncCursor();
      syncDropdownVisible();
    }, 0);
  }, [syncCursor, syncDropdownVisible]);

  // --- 键盘导航 ---

  const navigateOptions = useCallback((direction: "next" | "prev") => {
    const list = filteredOptionsRef.current;
    if (list.length === 0 || list.every((item) => item.disabled)) return;

    // 只在下标集合里循环，等价于官方「跳过 disabled」的递归
    const enabledIndexes = list
      .map((item, index) => (item.disabled ? -1 : index))
      .filter((index) => index !== -1);
    const current = enabledIndexes.indexOf(hoveringIndexRef.current);
    const next =
      current === -1
        ? direction === "next"
          ? enabledIndexes[0]
          : enabledIndexes[enabledIndexes.length - 1]
        : enabledIndexes[
            direction === "next"
              ? (current + 1) % enabledIndexes.length
              : (current - 1 + enabledIndexes.length) % enabledIndexes.length
          ];

    hoveringIndexRef.current = next;
    setHoveringIndex(next);
    dropdownRef.current?.scrollToIndex(next);
  }, []);

  /** 对应官方 watch(options)：选项变化后重置悬停项到第一个可用项。 */
  useEffect(() => {
    const list = filteredOptionsRef.current;
    const allDisabled =
      disabledValue || list.every((item) => item.disabled);
    const next =
      allDisabled || list.length === 0
        ? -1
        : list.findIndex((item) => !item.disabled);

    // React 对相同值会跳过更新，故即使依赖频繁变化也不会死循环
    hoveringIndexRef.current = next;
    setHoveringIndex(next);
    // 依赖逐项列出：选项数组与其字段别名、整体禁用状态
  }, [disabledValue, options, valueKey, labelKey, disabledKey]);

  /** 对应官方 getOriginalOption：把映射后的值还原成用户传入的原始选项。 */
  const getOriginalOption = useCallback(
    (mentionOption: MentionOption) =>
      options.find(
        (option) =>
          mentionOption.value === (option[valueKey] as string | undefined),
      ),
    [options, valueKey],
  );

  /** 对应官方 handleSelect。 */
  const handleSelect = useCallback(
    (item: MentionOption) => {
      // 对应官方 dropdown 的 selectHoverOption / handleSelect 对禁用项的拦截
      if (item.disabled || disabledValue) return;

      const ctxValue = mentionCtxRef.current;
      const inputEl = getInputEl();
      if (!ctxValue || !inputEl) return;

      const inputValue = inputEl.value;
      const newEndPart = inputValue.slice(ctxValue.end);
      const alreadySeparated = newEndPart.startsWith(split);
      const newMiddlePart = `${item.value}${alreadySeparated ? "" : split}`;
      const newValue =
        inputValue.slice(0, ctxValue.start) + newMiddlePart + newEndPart;
      const newSelectionEnd =
        ctxValue.start + newMiddlePart.length + (alreadySeparated ? 1 : 0);

      onChange?.(newValue);
      onSelect?.(getOriginalOption(item) as MentionOption, ctxValue.prefix);

      // 官方在 nextTick 里等值落地后设置光标；这里等一帧，与输入框的受控写回错开
      window.requestAnimationFrame(() => {
        inputEl.focus();
        inputEl.selectionStart = newSelectionEnd;
        inputEl.selectionEnd = newSelectionEnd;
        syncDropdownVisible();
      });
    },
    [
      disabledValue,
      getInputEl,
      split,
      onChange,
      onSelect,
      getOriginalOption,
      syncDropdownVisible,
    ],
  );

  /** 对应官方 handleInputChange。 */
  const handleInput = useCallback(
    (nextValue: string) => {
      onChange?.(nextValue);
      syncAfterCursorMove();
    },
    [onChange, syncAfterCursorMove],
  );

  /** 对应官方 handleInputKeyDown。 */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onKeyDown?.(event);

      if ((event.nativeEvent as KeyboardEvent).isComposing) return;

      const code = getEventCode(event.nativeEvent);

      switch (code) {
        case EVENT_CODE.left:
        case EVENT_CODE.right:
          syncAfterCursorMove();
          break;

        case EVENT_CODE.up:
        case EVENT_CODE.down:
          if (!visibleRef.current) return;
          event.preventDefault();
          navigateOptions(code === EVENT_CODE.up ? "prev" : "next");
          break;

        case EVENT_CODE.enter:
        case EVENT_CODE.numpadEnter:
          if (!visibleRef.current) {
            // textarea 里回车是换行，只有单行输入框才重算下拉
            if (type !== "textarea") syncAfterCursorMove();
            return;
          }
          event.preventDefault();
          if (filteredOptionsRef.current[hoveringIndexRef.current]) {
            handleSelect(filteredOptionsRef.current[hoveringIndexRef.current]);
          } else {
            setVisibleBoth(false);
          }
          break;

        case EVENT_CODE.esc:
          if (!visibleRef.current) return;
          event.preventDefault();
          setVisibleBoth(false);
          break;

        case EVENT_CODE.backspace: {
          if (!whole || !mentionCtxRef.current) return;

          const {
            splitIndex,
            selectionEnd,
            pattern,
            prefixIndex,
            prefix: hitPrefix,
          } = mentionCtxRef.current;
          const inputEl = getInputEl();
          if (!inputEl) return;

          const inputValue = inputEl.value;
          // 官方在全部选项里查找，自定义 filter-option 可能已把该项滤掉
          const matchOption = mappedOptionsRef.current.find(
            (item) => item.value === pattern,
          );
          const isWhole = checkIsWhole
            ? checkIsWhole(pattern, hitPrefix)
            : Boolean(matchOption);

          if (isWhole && splitIndex !== -1 && splitIndex + 1 === selectionEnd) {
            event.preventDefault();
            const newValue =
              inputValue.slice(0, prefixIndex) + inputValue.slice(splitIndex + 1);

            onChange?.(newValue);
            onWholeRemove?.(pattern, hitPrefix);

            const newSelectionEnd = prefixIndex;
            window.requestAnimationFrame(() => {
              inputEl.selectionStart = newSelectionEnd;
              inputEl.selectionEnd = newSelectionEnd;
              syncDropdownVisible();
            });
          }
          break;
        }
      }
    },
    [
      onKeyDown,
      syncAfterCursorMove,
      type,
      navigateOptions,
      handleSelect,
      whole,
      getInputEl,
      checkIsWhole,
      onChange,
      onWholeRemove,
      syncDropdownVisible,
      setVisibleBoth,
    ],
  );

  /** 对应官方 useFocusController 的 afterFocus。 */
  const handleRootFocus = useCallback(() => {
    syncAfterCursorMove();
  }, [syncAfterCursorMove]);

  /**
   * 对应官方 beforeBlur：焦点若落在弹层内容里则不关闭。
   * 弹层平时靠 mousedown 阻止默认行为维持输入框焦点，这里只作兜底。
   */
  const handleRootBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const related = event.relatedTarget as Node | null;
      if (related && popperEl?.contains(related)) return;
      setVisibleBoth(false);
    },
    [popperEl, setVisibleBoth],
  );

  // 挂载后量一次光标，保证锚点在未聚焦时也落在正确位置
  useEffect(() => {
    syncCursor();
    // 仅挂载与 type 切换时需要
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useImperativeHandle(
    ref,
    () => ({
      get input() {
        return inputElRef.current;
      },
      get textarea() {
        return textareaElRef.current;
      },
      get dropdownVisible() {
        return dropdownVisible;
      },
    }),
    [dropdownVisible],
  );

  // --- 弹层定位 ---

  const resolvedPlacement = showArrow ? placement : `${placement}-start`;

  const popperStyleMerged: CSSProperties = {
    position: "absolute",
    left: 0,
    top: cursorStyle.top,
    marginLeft: cursorStyle.left,
    zIndex: 2000,
    ...popperStyle,
    // 官方 contentStyle 会带上 offset：底部向下顶开锚点高度，顶部由自身高度反推
    transform:
      placement === "bottom"
        ? `translateY(${ANCHOR_HEIGHT + offset}px)`
        : `translateY(calc(-100% - ${offset}px))`,
  };

  const popperClasses = ["el-popper", "is-light", "is-pure", "el-mention__popper", popperClass]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={rootRef}
      className={["el-mention", className].filter(Boolean).join(" ")}
      onFocus={handleRootFocus}
      onBlur={handleRootBlur}
    >
      <ElInput
        {...restProps}
        value={value ?? ""}
        type={type}
        disabled={disabledValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        // 对应官方 handleInputMouseDown：已聚焦时点击新位置也要重算光标与下拉
        onMouseDown={(event) => {
          onMouseDown?.(event);
          syncAfterCursorMove();
        }}
        inputRef={attachInput}
        textareaRef={attachTextarea}
        // 对应官方 :role：ElInput 把 role 落在 containerRole 上
        containerRole={dropdownVisible ? "combobox" : undefined}
        aria-activedescendant={
          dropdownVisible ? `${contentId}-${hoveringIndex}` : undefined
        }
        aria-controls={dropdownVisible ? contentId : undefined}
        aria-expanded={dropdownVisible || undefined}
        aria-autocomplete={dropdownVisible ? "none" : undefined}
        aria-haspopup={dropdownVisible ? "listbox" : undefined}
      />

      <div
        ref={setPopperEl}
        className={popperClasses}
        style={popperStyleMerged}
        // 常驻挂载、用 hidden 切换，保证 aria-controls 指向的列表节点始终存在
        hidden={!dropdownVisible}
        tabIndex={-1}
        data-popper-placement={showArrow ? resolvedPlacement : undefined}
        // 阻止默认行为以免输入框失焦导致下拉先被卸载、选项点击丢失
        onMouseDown={(event) => event.preventDefault()}
      >
        {/* 箭头由 popper 定位于浮层边缘中线上，这里按 10px 宽做水平居中 */}
        {showArrow && (
          <ElPopperArrow style={{ position: "absolute", left: "calc(50% - 5px)" }} />
        )}
        <ElMentionDropdown
          ref={dropdownRef}
          options={filteredOptions}
          loading={loading}
          disabled={disabledValue}
          contentId={contentId}
          ariaLabel={restProps["aria-label"]}
          hoveringIndex={hoveringIndex}
          onHoveringChange={(index) => {
            hoveringIndexRef.current = index;
            setHoveringIndex(index);
          }}
          onSelect={handleSelect}
          onRootClick={() => getInputEl()?.focus()}
          labelSlot={labelSlot}
          loadingSlot={loadingSlot}
          headerSlot={headerSlot}
          footerSlot={footerSlot}
        />
      </div>

      <div style={cursorStyle} />
    </div>
  );
  },
);
