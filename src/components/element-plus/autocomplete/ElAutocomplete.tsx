"use client";

import {
  forwardRef,
  useEffect,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElInput } from "../input";
import { ElScrollbar } from "../scrollbar";
import { ElIcon } from "../icon/ElIcon";
import { ElPopperContent } from "../popper/ElPopperContent";
import { ElPopperArrow } from "../popper/ElPopperArrow";
import { Loading } from "../generated/icons";
import { useFormDisabled } from "../form/use-form";
import type { PopperPlacement } from "../popper";
import type { Options } from "@popperjs/core";
import type { ComponentSize } from "../button/types";
import type { InputProps } from "../input/types";

/** 单条建议项，对应官方 AutocompleteDataItem。 */
export type AutocompleteDataItem = Record<string, unknown>;
export type AutocompleteData = AutocompleteDataItem[];
export type AutocompleteFetchSuggestionsCallback = (
  data: AutocompleteData,
) => void;

/**
 * 拉取建议的方式：直接给数组，或给一个 (queryString, callback) 函数。
 * 函数可以直接返回数组，也可以只调 callback（异步场景）。
 */
export type AutocompleteFetchSuggestions =
  | ((
      queryString: string,
      callback: AutocompleteFetchSuggestionsCallback,
    ) => void | AutocompleteData | Promise<AutocompleteData | void>)
  | AutocompleteData;

/** 官方只暴露这六向，不含 left / right。 */
export type AutocompletePlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

/**
 * 官方 AutocompleteProps 继承 InputProps，这里同样把输入框属性整体透传，
 * 仅排除被组件接管或类型更宽的字段。
 */
export interface AutocompleteProps
  extends Omit<
    InputProps,
    | "value"
    | "onChange"
    | "onValueChange"
    | "onFocus"
    | "onBlur"
    | "onClear"
    | "onSelect"
    | "clearable"
    | "disabled"
    | "size"
    | "name"
    | "readOnly"
    | "prefix"
    | "suffix"
    | "prepend"
    | "append"
    | "inputRef"
    | "textareaRef"
    | "className"
    | "style"
  > {
  /** 绑定值 */
  value?: string | number;
  /** 输入值变化，对应官方 v-model 与 input 事件 */
  onChange?: (value: string | number) => void;
  /** 失焦或回车时触发，对应官方 change 事件 */
  onValueChange?: (value: string | number) => void;
  /** 点击某条建议时触发 */
  onSelect?: (item: AutocompleteDataItem) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** 点清空图标时触发 */
  onClear?: () => void;

  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: ComponentSize;
  name?: string;
  ariaLabel?: string;

  /** 建议对象里用作显示与回填的字段名 */
  valueKey?: string;
  /** 输入防抖延迟，毫秒 */
  debounce?: number;
  /** 下拉方位 */
  placement?: AutocompletePlacement;
  /** 拉取建议 */
  fetchSuggestions?: AutocompleteFetchSuggestions;
  /** 聚焦时是否拉取建议 */
  triggerOnFocus?: boolean;
  /** 无匹配项时回车是否派发 select */
  selectWhenUnmatched?: boolean;
  /** 远程搜索时是否隐藏 loading 图标 */
  hideLoading?: boolean;
  /** 下拉的附加类名 */
  popperClass?: string;
  /** 下拉的附加样式 */
  popperStyle?: CSSProperties;
  /** 透传给 popper.js 的参数 */
  popperOptions?: Partial<Options>;
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** 是否把下拉挂到 body */
  teleported?: boolean;
  /** 下拉的挂载目标，对应官方 append-to */
  appendTo?: string | HTMLElement;
  /** 是否默认高亮第一条建议 */
  highlightFirstItem?: boolean;
  /** 下拉宽度是否与输入框一致 */
  fitInputWidth?: boolean;
  /** 键盘上下导航是否从末尾回绕到开头 */
  loopNavigation?: boolean;

  /** 自定义建议项内容，对应官方 default 插槽 */
  renderItem?: (item: AutocompleteDataItem) => ReactNode;
  /** 下拉顶部内容，对应官方 header 插槽 */
  header?: ReactNode;
  /** 下拉底部内容，对应官方 footer 插槽 */
  footer?: ReactNode;
  /** 自定义加载内容，对应官方 loading 插槽 */
  loading?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  prepend?: ReactNode;
  append?: ReactNode;

  className?: string;
  style?: CSSProperties;
}

/** 对应官方 defineExpose 暴露的实例。状态位以 getter 形式给出。 */
export interface AutocompleteExpose {
  focus: () => void;
  blur: () => void;
  close: () => void;
  handleSelect: (item: AutocompleteDataItem) => void;
  handleKeyEnter: () => Promise<void>;
  highlight: (index: number) => void;
  getData: (queryString?: string) => Promise<void>;
  readonly activated: boolean;
  readonly loading: boolean;
  readonly highlightedIndex: number;
  readonly suggestions: AutocompleteData;
  /** 对应官方 inputRef（这里是原生 input 元素） */
  readonly input: HTMLInputElement | null;
  /** 对应官方 popperRef（这里是浮层容器元素） */
  readonly popper: HTMLDivElement | null;
}

/** 官方 fetchSuggestions 的默认值 NOOP。 */
function NOOP() {}

/**
 * 对应官方 ElAutocomplete。
 *
 * 结构对齐官方：
 *   .el-autocomplete（role=combobox）
 *     > .el-input
 *     > .el-autocomplete__popper.is-popper（浮层，纯定位无内边距）
 *       > .el-autocomplete-suggestion[.is-loading]
 *         > __header? / __wrap > __list（ElScrollbar）> li / __footer?
 *
 * 下拉用 popper.js 定位，未走 ElTooltip（官方用 tooltip 的 manual-mode，
 * 这里直接复用 ElPopperContent，行为等价且少一层受控逻辑）。
 */
export const ElAutocomplete = forwardRef<AutocompleteExpose, AutocompleteProps>(
  function ElAutocomplete(
    {
      value,
      onChange,
      onValueChange,
      onSelect,
      onFocus,
      onBlur,
      onClear,
      placeholder,
      clearable = false,
      disabled,
      readOnly = false,
      size,
      name,
      ariaLabel,
      valueKey = "value",
      debounce = 300,
      placement = "bottom-start",
      fetchSuggestions = NOOP,
      triggerOnFocus = true,
      selectWhenUnmatched = false,
      hideLoading = false,
      popperClass,
      popperStyle,
      popperOptions,
      showArrow = true,
      teleported = true,
      appendTo,
      highlightFirstItem = false,
      fitInputWidth = false,
      loopNavigation = true,
      renderItem,
      header,
      footer,
      loading: loadingSlot,
      prefix,
      suffix,
      prepend,
      append,
      className,
      style,
      onKeyDown: userOnKeyDown,
      ...restProps
    },
    ref,
  ) {
    const [activated, setActivated] = useState(false);
    const [suggestions, setSuggestions] = useState<AutocompleteData>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [dropdownWidth, setDropdownWidth] = useState("");

    const rootRef = useRef<HTMLDivElement>(null);
    const inputElRef = useRef<HTMLInputElement | null>(null);
    const attachInput = useCallback((el: HTMLInputElement | null) => {
      inputElRef.current = el;
    }, []);
    // popper.js 需要真实 DOM 节点，首帧拿不到，用 state 在挂载后触发一次定位
    const [referenceEl, setReferenceEl] = useState<HTMLDivElement | null>(null);
    const regionRef = useRef<HTMLDivElement | null>(null);
    const popperContentRef = useRef<HTMLDivElement | null>(null);

    /**
     * 以下三个在事件回调里既要读又要写，且不能受渲染批次影响，
     * 因此逐条对应官方组件作用域的 let。
     */
    const suggestionDisabledRef = useRef(false);
    const ignoreFocusEventRef = useRef(false);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const autocompleteDisabled = useFormDisabled(disabled);
    // React 的 useId 会带上环境相关的分隔符，剥掉后拼一个合法的 DOM id
    const listboxId = `el-autocomplete-${useId().replace(/[^\w-]/g, "")}`;

    const suggestionVisible =
      (suggestions.length > 0 || loading) && activated;
    const suggestionLoading = !hideLoading && loading;

    const getData = async (queryString: string) => {
      if (suggestionDisabledRef.current) return;

      const cb = (suggestionList: AutocompleteData) => {
        setLoading(false);
        if (suggestionDisabledRef.current) return;

        if (Array.isArray(suggestionList)) {
          setSuggestions(suggestionList);
          // 空列表即使开启 highlightFirstItem 也不应留下高亮（官方 hide 时会清掉）
          setHighlightedIndex(
            highlightFirstItem && suggestionList.length > 0 ? 0 : -1,
          );
        } else if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[ElAutocomplete] fetchSuggestions callback must receive an array",
          );
        }
      };

      setLoading(true);
      if (Array.isArray(fetchSuggestions)) {
        cb(fetchSuggestions);
      } else {
        const result = await fetchSuggestions(queryString, cb);
        if (Array.isArray(result)) cb(result);
      }
    };

    // 防抖只做「推迟调用」，取调用那一刻最新的 getData，避免闭包过期
    const getDataRef = useRef(getData);
    useEffect(() => {
      getDataRef.current = getData;
    });

    const debouncedGetData = (queryString: string) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        void getDataRef.current(queryString);
      }, debounce);
    };

    useEffect(
      () => () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      },
      [],
    );

    // 对应官方 tooltip @hide：收起时同步清掉高亮下标
    const close = () => {
      setActivated(false);
      setHighlightedIndex(-1);
    };

    const focus = () => {
      inputElRef.current?.focus();
    };

    const blur = () => {
      inputElRef.current?.blur();
    };

    const handleSelect = (item: AutocompleteDataItem) => {
      const raw = item[valueKey];
      onChange?.(typeof raw === "number" ? raw : String(raw ?? ""));
      onSelect?.(item);
      setSuggestions([]);
      setHighlightedIndex(-1);
    };

    const handleKeyEnter = async () => {
      if (
        suggestionVisible &&
        highlightedIndex >= 0 &&
        highlightedIndex < suggestions.length
      ) {
        handleSelect(suggestions[highlightedIndex]);
      } else {
        if (selectWhenUnmatched) {
          // 官方此处固定用 value 作键名，不取 valueKey
          onSelect?.({ value: value ?? "" });
          setSuggestions([]);
          setHighlightedIndex(-1);
        }
        setActivated(true);
        debouncedGetData(String(value ?? ""));
      }
    };

    /**
     * 高亮第 index 条并让它进入可视区。
     * 官方把滚动交给外部容器，这里同样直接读写 wrap 的 scrollTop。
     */
    const highlight = (index: number) => {
      if (!suggestionVisible || loading) return;

      if (index < 0) {
        if (!loopNavigation) {
          setHighlightedIndex(-1);
          return;
        }
        index = suggestions.length - 1;
      }

      if (index >= suggestions.length) {
        index = loopNavigation ? 0 : suggestions.length - 1;
      }

      const wrap = regionRef.current?.querySelector<HTMLElement>(
        ".el-autocomplete-suggestion__wrap",
      );
      const list = regionRef.current?.querySelectorAll<HTMLElement>(
        ".el-autocomplete-suggestion__list li",
      );
      const item = list?.[index];
      if (!wrap || !item) return;

      const scrollTop = wrap.scrollTop;
      const { offsetTop, scrollHeight } = item;

      if (offsetTop + scrollHeight > scrollTop + wrap.clientHeight) {
        wrap.scrollTop = offsetTop + scrollHeight - wrap.clientHeight;
      }
      if (offsetTop < scrollTop) {
        wrap.scrollTop = offsetTop;
      }

      setHighlightedIndex(index);
      rootRef.current
        ?.querySelector("input")
        ?.setAttribute("aria-activedescendant", `${listboxId}-item-${index}`);
    };

    const handleInput = (next: string) => {
      const valuePresented = !!next;

      onChange?.(next);
      suggestionDisabledRef.current = false;
      // 对应官方 activated.value ||= valuePresented
      if (valuePresented) setActivated(true);

      if (!triggerOnFocus && !next) {
        suggestionDisabledRef.current = true;
        setSuggestions([]);
        setHighlightedIndex(-1);
        return;
      }

      debouncedGetData(next);
    };

    const handleChange = (next: string) => {
      onValueChange?.(next);
    };

    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (!ignoreFocusEventRef.current) {
        setActivated(true);
        onFocus?.(event);
        if (triggerOnFocus && !readOnly) {
          setSuggestions([]);
          setHighlightedIndex(-1);
          debouncedGetData(String(value ?? ""));
        }
      } else {
        ignoreFocusEventRef.current = false;
      }
    };

    const handleBlur = (
      event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      // 等一拍：点击建议项时先让它走完 click，再决定是否关闭
      setTimeout(() => {
        // 焦点仍在浮层内容里（对应官方 popperRef.isFocusInsideContent）
        if (popperContentRef.current?.contains(document.activeElement)) {
          ignoreFocusEventRef.current = true;
          return;
        }
        close();
        onBlur?.(event);
      });
    };

    const handleClear = () => {
      setActivated(false);
      setHighlightedIndex(-1);
      onChange?.("");
      onClear?.();
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      if (autocompleteDisabled) return;

      const target = event.target as HTMLElement;
      const inputs = Array.from(rootRef.current?.querySelectorAll("input") ?? []);

      if (
        target?.tagName !== "INPUT" ||
        inputs.includes(document.activeElement as HTMLInputElement)
      ) {
        setActivated(true);
      }
    };

    const handleKeydown = (
      event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          highlight(highlightedIndex - 1);
          break;
        case "ArrowDown":
          event.preventDefault();
          highlight(highlightedIndex + 1);
          break;
        case "Enter":
          // 对应官方 handleKeyEnter 里的 isComposing 判断：组合输入中回车不选建议
          if ((event.nativeEvent as KeyboardEvent).isComposing) return;
          event.preventDefault();
          void handleKeyEnter();
          break;
        case "Tab":
          close();
          break;
        case "Escape":
          // 只有建议可见时才拦截，避免抢掉外层的 Esc 语义
          if (suggestionVisible) {
            event.preventDefault();
            event.stopPropagation();
            close();
          }
          break;
        case "Home":
          event.preventDefault();
          highlight(0);
          break;
        case "End":
          event.preventDefault();
          highlight(suggestions.length - 1);
          break;
        case "PageUp":
          event.preventDefault();
          highlight(Math.max(0, highlightedIndex - 10));
          break;
        case "PageDown":
          event.preventDefault();
          highlight(Math.min(suggestions.length - 1, highlightedIndex + 10));
          break;
      }
    };

    // 点击组件与浮层之外时收起建议
    useEffect(() => {
      if (!suggestionVisible) return;

      const onDocMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (rootRef.current?.contains(target)) return;
        // teleported 时浮层不在 root 内，点击建议项不能被当成外部点击
        if (popperContentRef.current?.contains(target)) return;
        if (popperContentRef.current?.contains(document.activeElement)) return;
        setActivated(false);
        setHighlightedIndex(-1);
      };

      document.addEventListener("mousedown", onDocMouseDown);
      return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [suggestionVisible]);

    // 展开时量一次输入框宽度，供 fitInputWidth 决定 width / minWidth
    useEffect(() => {
      if (!suggestionVisible) return;

      const width =
        rootRef.current?.querySelector(".el-input")?.clientWidth ??
        rootRef.current?.offsetWidth ??
        0;
      if (width) setDropdownWidth(`${width}px`);
    }, [suggestionVisible]);

    useImperativeHandle(ref, () => ({
      focus,
      blur,
      close,
      handleSelect,
      handleKeyEnter,
      highlight,
      getData: (queryString?: string) => getData(queryString ?? ""),
      get activated() {
        return activated;
      },
      get loading() {
        return loading;
      },
      get highlightedIndex() {
        return highlightedIndex;
      },
      get suggestions() {
        return suggestions;
      },
      get input() {
        return inputElRef.current;
      },
      get popper() {
        return popperContentRef.current;
      },
    }));

    const suggestionStyle: CSSProperties = { outline: "none" };
    if (dropdownWidth) {
      if (fitInputWidth) suggestionStyle.width = dropdownWidth;
      else suggestionStyle.minWidth = dropdownWidth;
    }

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          setReferenceEl(node);
        }}
        className={["el-autocomplete", className].filter(Boolean).join(" ")}
        style={style}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={suggestionVisible}
        aria-owns={listboxId}
        aria-controls={listboxId}
        onMouseDown={handleMouseDown}
      >
        <ElInput
          {...restProps}
          value={value ?? ""}
          disabled={autocompleteDisabled}
          size={size}
          name={name}
          placeholder={placeholder}
          clearable={clearable}
          readOnly={readOnly}
          containerRole="textbox"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-controls={listboxId}
          prefix={prefix}
          suffix={suffix}
          prepend={prepend}
          append={append}
          onChange={handleInput}
          onValueChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClear={handleClear}
          onKeyDown={(event) => {
            userOnKeyDown?.(event as React.KeyboardEvent<HTMLInputElement>);
            handleKeydown(event);
          }}
          inputRef={attachInput}
          aria-activedescendant={`${listboxId}-item-${highlightedIndex}`}
        />

        <ElPopperContent
          referenceEl={referenceEl}
          visible={suggestionVisible}
          placement={placement as PopperPlacement}
          effect="light"
          pure
          popperClass={["el-autocomplete__popper", popperClass]
            .filter(Boolean)
            .join(" ")}
          popperStyle={popperStyle}
          popperOptions={popperOptions}
          fallbackPlacements={["bottom-start", "top-start"]}
          role="listbox"
          teleported={teleported}
          appendTo={appendTo}
          // 对应官方 tooltip 的 persistent：收起时保留 DOM，aria-controls 不悬空
          persistent
          contentRef={popperContentRef}
        >
          <div
            ref={regionRef}
            className={[
              "el-autocomplete-suggestion",
              suggestionLoading && "is-loading",
            ]
              .filter(Boolean)
              .join(" ")}
            style={suggestionStyle}
            role="region"
          >
            {header && (
              // 官方对头部/底部都阻止冒泡，避免点它们时收起下拉
              <div
                className="el-autocomplete-suggestion__header"
                onClick={(event) => event.stopPropagation()}
              >
                {header}
              </div>
            )}

            <ElScrollbar
              id={listboxId}
              tag="ul"
              wrapClass="el-autocomplete-suggestion__wrap"
              viewClass="el-autocomplete-suggestion__list"
              role="listbox"
            >
              {suggestionLoading ? (
                <li>
                  {loadingSlot ?? (
                    <ElIcon className="is-loading">
                      <Loading />
                    </ElIcon>
                  )}
                </li>
              ) : (
                suggestions.map((item, index) => (
                  <li
                    key={index}
                    id={`${listboxId}-item-${index}`}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    className={highlightedIndex === index ? "highlighted" : undefined}
                    onClick={() => handleSelect(item)}
                  >
                    {renderItem
                      ? renderItem(item)
                      : (item[valueKey] as ReactNode)}
                  </li>
                ))
              )}
            </ElScrollbar>

            {footer && (
              <div
                className="el-autocomplete-suggestion__footer"
                onClick={(event) => event.stopPropagation()}
              >
                {footer}
              </div>
            )}
          </div>

          {showArrow && <ElPopperArrow style={{ position: "absolute" }} />}
        </ElPopperContent>
      </div>
    );
  },
);
