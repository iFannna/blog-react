"use client";

import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { ElTag, type TagEffect, type TagType } from "../tag";
import { ElTooltip, type TooltipExpose } from "../tooltip";
import { CircleCheck, CircleClose, Loading } from "../generated/icons";
import {
  useFormDisabled,
  useFormItem,
  useFormItemInputId,
  useFormSize,
} from "../form/use-form";
import type { ComponentSize } from "../button/types";
import type { PopperEffect, PopperPlacement } from "../popper/use-popper";

/** 官方 EVENT_CODE 里与键盘码同名的取值，用于事件码回退推断。 */
const EVENT_KEY_CODES = [
  "Tab",
  "Enter",
  "Space",
  "ArrowLeft",
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "Escape",
  "Delete",
  "Backspace",
  "NumpadEnter",
  "PageUp",
  "PageDown",
  "Home",
  "End",
];

/** 官方常量 MINIMUM_INPUT_WIDTH，输入框的最小宽度。 */
const MINIMUM_INPUT_WIDTH = 11;

/** 对应官方 ValidateComponentsMap：按 FormItem 的校验状态选择图标。 */
const VALIDATE_ICON_MAP = {
  validating: Loading,
  success: CircleCheck,
  error: CircleClose,
} as const;

/** 对应官方 getEventCode：Android 上 code 恒为空，退回用 key 推断。 */
function getEventCode(event: { code?: string; key?: string }): string {
  if (event.code && event.code !== "Unidentified") return event.code;

  const key = event.key;
  if (key) {
    if (EVENT_KEY_CODES.includes(key)) return key;
    if (key === " ") return "Space";
  }
  return "";
}

function isAndroid(): boolean {
  return typeof window !== "undefined" && /android/i.test(window.navigator.userAgent);
}

/** 对应官方 isFocusable，只用于判断点击目标是可聚焦元素。 */
function isFocusable(element: HTMLElement): boolean {
  if (
    element.tabIndex > 0 ||
    (element.tabIndex === 0 && element.getAttribute("tabIndex") !== null)
  ) {
    return true;
  }
  if (
    element.tabIndex < 0 ||
    element.hasAttribute("disabled") ||
    element.getAttribute("aria-disabled") === "true"
  ) {
    return false;
  }

  switch (element.nodeName) {
    case "A":
      return !!(element as HTMLAnchorElement).href;
    case "INPUT":
      return !["hidden", "file"].includes((element as HTMLInputElement).type);
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA":
      return true;
    default:
      return false;
  }
}

/** 对应官方 ensureArray。 */
function toArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

export type InputTagTrigger = "Enter" | "Space";

export interface InputTagProps {
  /** 绑定值，对应官方 v-model */
  value?: string[];
  /** 绑定值变化，对应官方 v-model + change */
  onChange?: (value: string[] | undefined) => void;
  /** 输入框文本变化，对应官方 input 事件 */
  onInput?: (value: string) => void;
  /** 新增标签，对应官方 add-tag 事件 */
  onAddTag?: (value: string | string[]) => void;
  /** 移除标签，对应官方 remove-tag 事件 */
  onRemoveTag?: (value: string, index: number) => void;
  /** 拖拽标签，对应官方 drag-tag 事件 */
  onDragTag?: (oldIndex: number, newIndex: number, value: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** 点击清空图标，对应官方 clear 事件 */
  onClear?: () => void;
  /** 最多可输入的标签数 */
  max?: number;
  /** 标签主题类型 */
  tagType?: TagType;
  /** 标签主题 */
  tagEffect?: TagEffect;
  /** 折叠提示的浮层主题 */
  effect?: PopperEffect;
  /** 触发新增标签的按键 */
  trigger?: InputTagTrigger;
  /** 标签是否可拖拽 */
  draggable?: boolean;
  /** 匹配到分隔符即创建标签，字符串或正则 */
  delimiter?: string | RegExp;
  /** 尺寸 */
  size?: ComponentSize;
  /** 是否可清空 */
  clearable?: boolean;
  /** 自定义清空图标 */
  clearIcon?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否触发表单校验 */
  validateEvent?: boolean;
  /** 原生只读 */
  readonly?: boolean;
  /** 原生自动聚焦 */
  autofocus?: boolean;
  /** 原生 id */
  id?: string;
  /** 原生 tabindex */
  tabindex?: string | number;
  /** 原生 maxlength */
  maxlength?: string | number;
  /** 原生 minlength */
  minlength?: string | number;
  /** 占位文本 */
  placeholder?: string;
  /** 原生 autocomplete */
  autocomplete?: string;
  /** 失焦时是否保存输入内容为标签 */
  saveOnBlur?: boolean;
  /** 是否折叠多余标签 */
  collapseTags?: boolean;
  /** 折叠标签悬停时是否展示全部，开启后 max 失效 */
  collapseTagsTooltip?: boolean;
  /** 折叠时保留的标签数 */
  maxCollapseTags?: number;
  /** 原生 aria-label */
  ariaLabel?: string;
  /** 原生 name */
  name?: string;
  className?: string;
  style?: CSSProperties;
  /** 前缀插槽 */
  prefix?: ReactNode;
  /** 后缀插槽 */
  suffix?: ReactNode;
  /** 标签内容插槽：函数形式可拿到当前值，对应官方 tag 作用域插槽 */
  children?: ReactNode | ((value: string, index: number) => ReactNode);
}

/** 对应官方 defineExpose({ focus, blur })。 */
export interface InputTagExpose {
  focus: () => void;
  blur: () => void;
}

/**
 * 对应官方 ElInputTag。
 *
 * DOM 结构沿用官方 .el-input-tag__wrapper / __inner / __input-wrapper：
 * 标签（ElTag）、折叠计数（ElTooltip + ElTag）、输入框、拖拽指示条依次排在 __inner 里。
 *
 * 官方把 input 的值放在 useInputTag 内部的 ref 上（v-model 直接绑定），
 * React 侧用本地 state 承载，外部只通过 value/onChange 拿到标签数组。
 *
 * 拖拽：官方给 el-tag 本身挂 draggable 与 drag 事件，本项目的 ElTag 不转发任意 DOM 属性，
 * 故仅在 draggable 开启时给标签外面套一层同样 draggable 的 span 承载事件。
 */
export const ElInputTag = forwardRef<InputTagExpose, InputTagProps>(
  function ElInputTag(
    {
      value,
      onChange,
      onInput,
      onAddTag,
      onRemoveTag,
      onDragTag,
      onFocus,
      onBlur,
      onClear,
      max,
      tagType = "info",
      tagEffect = "light",
      effect = "light",
      trigger = "Enter",
      draggable = false,
      delimiter = "",
      size,
      clearable = false,
      clearIcon,
      disabled,
      validateEvent = true,
      readonly = false,
      autofocus = false,
      id,
      tabindex = 0,
      maxlength,
      minlength,
      placeholder,
      autocomplete = "off",
      saveOnBlur = true,
      collapseTags = false,
      collapseTagsTooltip = false,
      maxCollapseTags = 1,
      ariaLabel,
      name,
      className,
      style,
      prefix,
      suffix,
      children,
    },
    ref,
  ) {
    const [inputValue, setInputValue] = useState<string | undefined>(undefined);
    const [isFocused, setIsFocused] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [showDropIndicator, setShowDropIndicator] = useState(false);
    const [innerWidth, setInnerWidth] = useState(0);
    const [collapseWidth, setCollapseWidth] = useState(0);
    const [calculatorWidth, setCalculatorWidth] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const calculatorRef = useRef<HTMLSpanElement>(null);
    const dropIndicatorRef = useRef<HTMLDivElement>(null);
    const tagTooltipRef = useRef<TooltipExpose>(null);

    // 组合输入期间（中文输入法）不处理按键与分隔符，避免把拼音拆成标签
    const isComposingRef = useRef(false);
    // 拖拽期间的临时状态，不参与渲染，与官方的局部变量对应
    const dragStateRef = useRef<{
      draggingIndex?: number;
      draggingTag: HTMLElement | null;
      dropIndex?: number;
      dropType?: "before" | "after";
    }>({ draggingTag: null });

    const tagSize = useFormSize(size);
    const isDisabled = useFormDisabled(disabled);
    const { form, formItem } = useFormItem();
    const { inputId } = useFormItemInputId({ id, ariaLabel });

    // 与 ElInput 一致：只有 Form 开启 status-icon 时才展示校验状态图标
    const needStatusIcon = form?.statusIcon ?? false;
    const validateState = formItem?.validateState || "";
    const ValidateIcon = validateState ? VALIDATE_ICON_MAP[validateState] : null;

    const tagSizeResolved: ComponentSize = tagSize === "small" ? "small" : "default";

    // 固定引用，避免下游 useCallback 的依赖每次渲染都变化
    const valueList = useMemo(() => value ?? [], [value]);
    const closable = !(readonly || isDisabled);
    const inputLimit = max !== undefined && valueList.length >= max;
    const resolvedPlaceholder = valueList.length ? undefined : placeholder;

    const showTagList = collapseTags
      ? valueList.slice(0, maxCollapseTags)
      : valueList;
    const collapseTagList = collapseTags ? valueList.slice(maxCollapseTags) : [];

    // --- 值操作，逐条对应官方 useInputTag 的同名方法 ---

    const addTagsEmit = useCallback(
      (added: string | string[]) => {
        const list = [...valueList, ...toArray(added)];
        onChange?.(list);
        onAddTag?.(added);
        setInputValue(undefined);
      },
      [valueList, onChange, onAddTag],
    );

    const getDelimitedTags = useCallback(
      (input: string) => {
        const parts = input.split(delimiter as string | RegExp);
        const tags =
          parts.length > 1 ? parts.map((val) => val.trim()).filter(Boolean) : [];
        if (max) {
          const maxInsert = max - valueList.length;
          tags.splice(maxInsert);
        }
        return tags.length === 1 ? tags[0] : tags;
      },
      [delimiter, max, valueList.length],
    );

    /**
     * 新增标签。rawValue 用于失焦场景：React 的 onBlur 早于最后一次 onInput 的
     * 状态提交，直接读 inputValue 会拿到上一帧的文本，这里允许调用方显式传入。
     */
    const handleAddTag = useCallback(
      (rawValue?: string) => {
        const next = (rawValue ?? inputValue)?.trim();
        if (!next || inputLimit) return;
        addTagsEmit(next);
      },
      [inputValue, inputLimit, addTagsEmit],
    );

    const handleRemoveTag = useCallback(
      (index: number) => {
        const list = valueList.slice();
        const [item] = list.splice(index, 1);
        onChange?.(list);
        onRemoveTag?.(item, index);
      },
      [valueList, onChange, onRemoveTag],
    );

    const handleClear = useCallback(() => {
      setInputValue(undefined);
      onChange?.(undefined);
      onClear?.();
    }, [onChange, onClear]);

    const handleDragged = useCallback(
      (draggingIndex: number, dropIndex: number, type: "before" | "after") => {
        const list = valueList.slice();
        const [draggedItem] = list.splice(draggingIndex, 1);
        // 官方按落点相对拖起位置的偏移修正插入下标
        const step =
          dropIndex > draggingIndex && type === "before"
            ? -1
            : dropIndex < draggingIndex && type === "after"
              ? 1
              : 0;

        list.splice(dropIndex + step, 0, draggedItem);
        onChange?.(list);
        onDragTag?.(draggingIndex, dropIndex + step, draggedItem);
      },
      [valueList, onChange, onDragTag],
    );

    // --- 输入相关 ---

    const handleInputValue = useCallback(
      (next: string, composing = false) => {
        if (inputLimit) {
          // 到达上限后清空输入：若 inputValue 已是 undefined，state 不再变化、
          // 上面的布局副作用不会重跑，这里直接写 DOM 才能让刚键入的字符消失
          setInputValue(undefined);
          if (inputRef.current) inputRef.current.value = "";
          return;
        }

        // 组合输入期间仍要回写文本，否则受控输入框会把拼音吃掉
        setInputValue(next);
        // 官方在组合态下直接 return：既不拆分分隔符，也不派发 input 事件
        if (composing) return;

        if (delimiter && next) {
          const tags = getDelimitedTags(next);
          if (tags.length) addTagsEmit(tags);
        }
        onInput?.(next);
      },
      [inputLimit, delimiter, getDelimitedTags, addTagsEmit, onInput],
    );

    const handlePaste = useCallback(
      (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = event.clipboardData?.getData("text");
        if (readonly || inputLimit || !delimiter || !pasted) return;

        const target = event.currentTarget;
        const current = target.value;
        // selectionStart/End 在非文本框上可能为 null，此处按 0 处理
        const selectionStart = target.selectionStart ?? 0;
        const selectionEnd = target.selectionEnd ?? 0;
        const nextValue =
          current.slice(0, selectionStart) + pasted + current.slice(selectionEnd);
        const tags = getDelimitedTags(nextValue);
        if (tags.length) {
          addTagsEmit(tags);
          onInput?.(nextValue);
          event.preventDefault();
        }
      },
      [readonly, inputLimit, delimiter, getDelimitedTags, addTagsEmit, onInput],
    );

    const focus = useCallback(() => inputRef.current?.focus(), []);
    const blur = useCallback(() => inputRef.current?.blur(), []);

    const handleKeydown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (isComposingRef.current) return;
        const code = getEventCode(event);

        switch (code) {
          case trigger:
            event.preventDefault();
            event.stopPropagation();
            handleAddTag();
            break;
          case "NumpadEnter":
            if (trigger === "Enter") {
              event.preventDefault();
              event.stopPropagation();
              handleAddTag();
            }
            break;
          case "Backspace":
            // 输入框为空时退格删除最后一个标签
            if (!inputValue && valueList.length) {
              event.preventDefault();
              event.stopPropagation();
              handleRemoveTag(valueList.length - 1);
            }
            break;
        }
      },
      [trigger, handleAddTag, inputValue, valueList, handleRemoveTag],
    );

    // Android 上 Space 的 keydown 无法可靠拿到 code，改在 keyup 里处理，与官方一致
    const handleKeyup = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (isComposingRef.current || !isAndroid()) return;
        if (getEventCode(event) === "Space" && trigger === "Space") {
          event.preventDefault();
          event.stopPropagation();
          handleAddTag();
        }
      },
      [trigger, handleAddTag],
    );

    const handleCompositionStart = useCallback(() => {
      isComposingRef.current = true;
    }, []);

    const handleCompositionUpdate = useCallback(() => {
      isComposingRef.current = true;
    }, []);

    const handleCompositionEnd = useCallback(
      (event: React.CompositionEvent<HTMLInputElement>) => {
        // 组合结束后再处理一次输入，确保分隔符在组合态之外才生效
        const target = event.currentTarget;
        isComposingRef.current = false;
        queueMicrotask(() => {
          // 再次组合输入期间不补这一枪，交给下一次 compositionend
          if (isComposingRef.current) return;
          handleInputValue(target.value);
        });
      },
      [handleInputValue],
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        if (isDisabled || isFocused) return;
        setIsFocused(true);
        onFocus?.(event);
      },
      [isDisabled, isFocused, onFocus],
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        const related = event.relatedTarget as Node | null;
        if (isDisabled) return;
        // 焦点仍落在组件内部（如点到标签的关闭按钮）不算失焦
        if (related && wrapperRef.current?.contains(related)) return;
        // 折叠提示的浮层是 teleport 出去的，relatedTarget 落在浮层里同样不算失焦
        const activeElement = related ?? document.activeElement;
        if (
          activeElement &&
          tagTooltipRef.current?.popperRef?.contains(activeElement)
        ) {
          return;
        }

        setIsFocused(false);
        // 官方先派发 blur，再执行 afterBlur（保存输入 / 触发校验）
        onBlur?.(event);
        if (saveOnBlur) handleAddTag(event.currentTarget.value);
        else setInputValue(undefined);

        if (validateEvent) formItem?.validate("blur").catch(() => {});
      },
      [isDisabled, saveOnBlur, handleAddTag, validateEvent, formItem, onBlur],
    );

    // 点击容器空白处把焦点交给输入框，对应官方 useFocusController 的 handleClick
    const handleWrapperClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (isDisabled) return;
        if (isFocusable(event.target as HTMLElement)) return;
        // wrapper 自身持有焦点时仍应把焦点交给输入框
        if (
          wrapperRef.current?.contains(document.activeElement) &&
          wrapperRef.current !== document.activeElement
        ) {
          return;
        }
        inputRef.current?.focus();
      },
      [isDisabled],
    );

    // --- 拖拽，对应官方 useDragTag ---

    // 官方把拖拽属性直接挂在 .el-tag 上，这里同样从容器里取标签节点
    const getTagElement = (index: number) =>
      innerRef.current?.querySelectorAll<HTMLElement>(".el-tag")[index] ?? null;

    const handleDragStart = useCallback(
      (event: DragEvent<HTMLElement>, index: number) => {
        const state = dragStateRef.current;
        state.draggingIndex = index;
        state.draggingTag = getTagElement(index);

        if (state.draggingTag) state.draggingTag.style.opacity = "0.5";
        if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
      },
      [],    );

    const handleDragOver = useCallback(
      (event: DragEvent<HTMLElement>, index: number) => {
        const state = dragStateRef.current;
        state.dropIndex = index;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";

        if (state.draggingIndex === undefined || state.draggingIndex === index) {
          setShowDropIndicator(false);
          return;
        }

        const dropEl = getTagElement(index);
        const innerEl = innerRef.current;
        if (!dropEl || !innerEl) return;

        const dropPosition = dropEl.getBoundingClientRect();
        const dropPrev = state.draggingIndex + 1 !== index;
        const dropNext = state.draggingIndex - 1 !== index;
        const distance = event.clientX - dropPosition.left;
        const prevPercent = dropPrev ? (dropNext ? 0.5 : 1) : -1;
        const nextPercent = dropNext ? (dropPrev ? 0.5 : 0) : 1;

        if (distance <= dropPosition.width * prevPercent) state.dropType = "before";
        else if (distance > dropPosition.width * nextPercent) state.dropType = "after";
        else state.dropType = undefined;

        const innerPosition = innerEl.getBoundingClientRect();
        const gap = Number.parseFloat(getComputedStyle(innerEl).gap || "6px") / 2;

        const indicatorTop = dropPosition.top - innerPosition.top;
        let indicatorLeft = -9999;

        if (state.dropType === "before") {
          indicatorLeft = Math.max(
            dropPosition.left - innerPosition.left - gap,
            Math.floor(-gap / 2),
          );
        } else if (state.dropType === "after") {
          const left = dropPosition.right - innerPosition.left;
          indicatorLeft =
            left + (innerPosition.width === left ? Math.floor(gap / 2) : gap);
        }

        if (dropIndicatorRef.current) {
          dropIndicatorRef.current.style.top = `${indicatorTop}px`;
          dropIndicatorRef.current.style.left = `${indicatorLeft}px`;
        }
        setShowDropIndicator(!!state.dropType);
      },
      [],
    );

    const handleDragEnd = useCallback(
      (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        const state = dragStateRef.current;

        if (state.draggingTag) state.draggingTag.style.opacity = "";

        if (
          state.dropType &&
          state.draggingIndex !== undefined &&
          state.dropIndex !== undefined &&
          state.draggingIndex !== state.dropIndex
        ) {
          handleDragged(state.draggingIndex, state.dropIndex, state.dropType);
        }

        setShowDropIndicator(false);
        state.draggingIndex = undefined;
        state.draggingTag = null;
        state.dropIndex = undefined;
        state.dropType = undefined;
        // 官方 afterDragged: focus
        focus();
      },
      [handleDragged, focus],
    );

    // --- 尺寸测量 ---

    /**
     * 折叠模式下标签的最大宽度依赖容器实际宽度与折叠块宽度，
     * 官方用 useResizeObserver 监听，这里用 ResizeObserver + 窗口 resize 兜底。
     */
    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const measure = () => {
        const width = Number.parseFloat(getComputedStyle(el).width);
        setInnerWidth((prev) => (prev === width ? prev : width));

        const collapseEl = el.querySelector<HTMLElement>(".el-input-tag__collapse-tag");
        const collapseW = collapseEl ? collapseEl.getBoundingClientRect().width : 0;
        setCollapseWidth((prev) => (prev === collapseW ? prev : collapseW));
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      window.addEventListener("resize", measure);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [collapseTags, maxCollapseTags, valueList.length]);

    /** 输入框最小宽度跟随已输入文本的宽度，官方用 useCalcInputWidth 实现。 */
    useLayoutEffect(() => {
      const el = calculatorRef.current;
      if (!el) return;

      const measure = () => {
        const width = el.getBoundingClientRect().width;
        setCalculatorWidth((prev) => (prev === width ? prev : width));
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, [inputValue]);

    // 官方 watch(modelValue) 里按 change 触发校验
    useEffect(() => {
      if (!validateEvent) return;
      formItem?.validate("change").catch(() => {});
      // 依赖 value 的内容签名即可，避免同内容的数组每次重建都触发校验
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueList.join("|"), validateEvent]);

    /**
     * 与官方一致地手动写 el.value，而不是绑定 value 属性：
     * 受控 value 若配 onInput（而非 onChange）会触发 React 的只读告警，
     * 在布局阶段直接写 DOM，等价于官方 onMounted + watch(inputValue)。
     */
    useLayoutEffect(() => {
      const el = inputRef.current;
      if (!el) return;

      const next = inputValue ?? "";
      if (el.value !== next) el.value = next;
    }, [inputValue]);

    /** 对应官方 useFocusController 对 wrapper 的处理：可聚焦但不进入 Tab 序列。 */
    useLayoutEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;

      if (isDisabled) el.removeAttribute("tabindex");
      else el.setAttribute("tabindex", "-1");
    }, [isDisabled]);

    useImperativeHandle(ref, () => ({ focus, blur }), [focus, blur]);

    // --- 派生样式 ---

    const tagStyle = useMemo<CSSProperties>(() => {
      if (!collapseTags) return {};

      const innerEl = innerRef.current;
      const gapWidth = innerEl
        ? Number.parseFloat(getComputedStyle(innerEl).gap || "6px")
        : 0;
      const inputSlotWidth = gapWidth + MINIMUM_INPUT_WIDTH;
      const maxWidth =
        collapseWidth && maxCollapseTags === 1
          ? innerWidth - collapseWidth - gapWidth - inputSlotWidth
          : innerWidth - inputSlotWidth;

      return { maxWidth: `${Math.max(maxWidth, 0)}px` };
    }, [collapseTags, collapseWidth, innerWidth, maxCollapseTags]);

    const inputStyle: CSSProperties = {
      minWidth: `${Math.max(calculatorWidth, MINIMUM_INPUT_WIDTH)}px`,
    };

    const showClear =
      clearable &&
      !isDisabled &&
      !readonly &&
      !!(valueList.length || inputValue) &&
      (isFocused || hovering);

    const showSuffix =
      !!suffix || showClear || (!!validateState && !!ValidateIcon && needStatusIcon);

    const containerClasses = [
      "el-input-tag",
      isFocused && "is-focused",
      hovering && "is-hovering",
      isDisabled && "is-disabled",
      tagSize && `el-input-tag--${tagSize}`,
      "el-input-tag__wrapper",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const innerClasses = [
      "el-input-tag__inner",
      draggable && "is-draggable",
      !valueList.length && !prefix && "is-left-space",
      !valueList.length && !showSuffix && "is-right-space",
    ]
      .filter(Boolean)
      .join(" ");

    const renderTagContent = (item: string, index: number): ReactNode =>
      typeof children === "function" ? children(item, index) : children ?? item;

    const renderTag = (item: string, index: number) => {
      // 官方把 draggable 与拖拽事件直接放在 el-tag 元素上，不能再包一层
      // span，否则行盒会被撑高 1px 以上。
      const dragProps =
        closable && draggable
          ? {
              draggable: true,
              onDragStart: (event: DragEvent<HTMLSpanElement>) =>
                handleDragStart(event, index),
              onDragOver: (event: DragEvent<HTMLSpanElement>) =>
                handleDragOver(event, index),
              onDragEnd: handleDragEnd,
              onDrop: (event: DragEvent<HTMLSpanElement>) =>
                event.stopPropagation(),
            }
          : {};

      return (
        <ElTag
          size={tagSizeResolved}
          closable={closable}
          type={tagType}
          effect={tagEffect}
          disableTransitions
          style={tagStyle}
          onClose={() => handleRemoveTag(index)}
          {...dragProps}
        >
          {renderTagContent(item, index)}
        </ElTag>
      );
    };

    return (
      <div
        className={containerClasses}
        style={style}
        ref={wrapperRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={handleWrapperClick}
      >
        {prefix && <div className="el-input-tag__prefix">{prefix}</div>}

        <div className={innerClasses} ref={innerRef}>
          {showTagList.map((item, index) => (
            <Fragment key={index}>
              {renderTag(item, index)}
            </Fragment>
          ))}

          {collapseTags && valueList.length > maxCollapseTags && (
            <ElTooltip
              ref={tagTooltipRef}
              content={
                <div className="el-input-tag__input-tag-list">
                  {collapseTagList.map((item, index) => (
                    <ElTag
                      key={index}
                      size={tagSizeResolved}
                      closable={closable}
                      type={tagType}
                      effect={tagEffect}
                      disableTransitions
                      onClose={() => handleRemoveTag(index + maxCollapseTags)}
                    >
                      {renderTagContent(item, index + maxCollapseTags)}
                    </ElTag>
                  ))}
                </div>
              }
              disabled={!collapseTagsTooltip}
              effect={effect}
              placement="bottom"
              // 官方 fallback-placements: ['bottom', 'top', 'right', 'left']
              fallbackPlacements={
                ["bottom", "top", "right", "left"] as PopperPlacement[]
              }
            >
              <div className="el-input-tag__collapse-tag">
                <ElTag
                  size={tagSizeResolved}
                  type={tagType}
                  effect={tagEffect}
                  disableTransitions
                >
                  {`+ ${valueList.length - maxCollapseTags}`}
                </ElTag>
              </div>
            </ElTooltip>
          )}

          <div className="el-input-tag__input-wrapper">
            <input
              id={inputId}
              ref={inputRef}
              className="el-input-tag__input"
              style={inputStyle}
              type="text"
              name={name}
              minLength={minlength === undefined ? undefined : Number(minlength)}
              maxLength={maxlength === undefined ? undefined : Number(maxlength)}
              disabled={isDisabled}
              readOnly={readonly}
              autoComplete={autocomplete}
              tabIndex={tabindex === undefined ? undefined : Number(tabindex)}
              placeholder={resolvedPlaceholder}
              autoFocus={autofocus}
              aria-label={ariaLabel}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onInput={(event) => handleInputValue(event.currentTarget.value)}
              onCompositionStart={handleCompositionStart}
              onCompositionUpdate={handleCompositionUpdate}
              onCompositionEnd={handleCompositionEnd}
              onPaste={handlePaste}
              onKeyDown={handleKeydown}
              onKeyUp={handleKeyup}
            />
            <span
              ref={calculatorRef}
              aria-hidden="true"
              className="el-input-tag__input-calculator"
            >
              {inputValue}
            </span>
          </div>

          <div
            ref={dropIndicatorRef}
            className="el-input-tag__drop-indicator"
            style={{ display: showDropIndicator ? undefined : "none" }}
          />
        </div>

        {showSuffix && (
          <div className="el-input-tag__suffix">
            {suffix}
            {showClear && (
              <ElIcon
                className="el-input-tag__icon el-input-tag__clear"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClear}
              >
                {clearIcon ?? <CircleClose />}
              </ElIcon>
            )}
            {ValidateIcon && needStatusIcon && (
              <ElIcon
                className={[
                  "el-input__icon",
                  "el-input__validateIcon",
                  validateState === "validating" && "is-loading",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <ValidateIcon />
              </ElIcon>
            )}
          </div>
        )}
      </div>
    );
  },
);
