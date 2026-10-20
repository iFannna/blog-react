"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { CircleCheck, CircleClose, Hide, Loading, View } from "../icons";
import {
  useFormDisabled,
  useFormItem,
  useFormItemInputId,
  useFormSize,
} from "../form/use-form";
import { calcTextareaHeight, looseToNumber } from "./utils";
import type { InputExpose, InputProps, InputType } from "./types";

type TargetElement = HTMLInputElement | HTMLTextAreaElement;

/** 对应官方 ValidateComponentsMap：按 FormItem 的校验状态选择图标。 */
const VALIDATE_ICON_MAP = {
  validating: Loading,
  success: CircleCheck,
  error: CircleClose,
} as const;

function isNil(value: unknown) {
  return value === null || value === undefined;
}

/** 官方 noop，用于 clear / password 图标上阻止默认行为。 */
function NOOP() {}

function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList,
) {
  const isomorphic =
    typeof window === "undefined" ? useEffect : useLayoutEffect;
  return isomorphic(effect, deps);
}

export const ElInput = forwardRef<InputExpose, InputProps>(function ElInput(
  props,
  ref,
) {
  const {
    size,
    value = "",
    modelModifiers = {},
    maxlength,
    minlength,
    type = "text",
    resizable,
    autosize = false,
    formatter,
    parser,
    placeholder,
    readOnly = false,
    clearable = false,
    clearIcon,
    showPassword = false,
    showWordLimit = false,
    wordLimitPosition = "inside",
    suffixIcon,
    prefixIcon,
    containerRole,
    tabIndex = 0,
    validateEvent = true,
    inputStyle = {},
    rows = 2,
    countGraphemes,
    prefix,
    suffix,
    prepend,
    append,
    passwordIcon,
    disabled,
    inputRef: inputRefProp,
    textareaRef: textareaRefProp,
    onChange,
    onValueChange,
    onClear,
    onFocus,
    onBlur,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    className,
    style,
    ...restProps
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // textarea 横向拉伸时，字数与清除图标要跟着右边界走
  const countRef = useRef<HTMLSpanElement>(null);
  const clearRef = useRef<HTMLElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  // 组合结束时要在下一帧重跑 handleInput，闭包里的 state 仍是旧值，故用 ref 判断
  const isComposingRef = useRef(false);
  const [textareaHeight, setTextareaHeight] = useState<string | undefined>();

  const isTextarea = type === "textarea";

  // 与官方一致：尺寸与禁用状态优先取 Form / FormItem 上下文
  const inputSize = useFormSize(size);
  const isDisabled = useFormDisabled(disabled);

  const { form, formItem } = useFormItem();

  // 把 id 注册给 FormItem，让 label 的 for 与 aria-labelledby 能指向它
  const { inputId } = useFormItemInputId({
    id: restProps.id as string | undefined,
    label: restProps["aria-label"] as string | undefined,
  });

  const needStatusIcon = form?.statusIcon ?? false;
  const validateState = formItem?.validateState || "";
  const ValidateIcon = validateState ? VALIDATE_ICON_MAP[validateState] : null;

  /**
   * 对应官方 useFocusController 对 wrapper 的处理：disabled 时移除 tabindex，
   * 否则设为 -1，让 wrapper 可聚焦但不进入 Tab 序列。
   */
  useIsomorphicLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el || isTextarea) return;

    if (isDisabled) el.removeAttribute("tabindex");
    else el.setAttribute("tabindex", "-1");
  }, [isDisabled, isTextarea]);

  const element = useCallback(
    () => (isTextarea ? textareaRef.current : inputRef.current),
    [isTextarea],
  );

  // 把原生元素交给组合型组件（Mention 需读取光标与文本值），对应官方 input 实例的 input / textarea
  useIsomorphicLayoutEffect(() => {
    textareaRefProp?.(textareaRef.current);
    inputRefProp?.(inputRef.current);
  }, [textareaRefProp, inputRefProp, isTextarea]);

  const nativeInputValue = isNil(value) ? "" : String(value);

  const maxlengthStr = maxlength === undefined ? undefined : String(maxlength);

  // --- 派生状态，逐条对应官方同名 computed ---

  const renderClear = clearable && !isDisabled && !readOnly;
  const showClear =
    renderClear && !!nativeInputValue && (isFocused || hovering);

  const showPwdVisible = showPassword && !isDisabled && !!nativeInputValue;

  const isWordLimitVisible =
    showWordLimit &&
    !!maxlengthStr &&
    (type === "text" || type === "textarea") &&
    !isDisabled &&
    !readOnly &&
    !showPassword;

  const textLength = useMemo(() => {
    if (countGraphemes && showWordLimit) return countGraphemes(nativeInputValue);
    return nativeInputValue.length;
  }, [countGraphemes, showWordLimit, nativeInputValue]);

  // 初始值超过 maxlength 时标记超出
  const inputExceed =
    !!isWordLimitVisible && textLength > Number(maxlengthStr ?? 0);

  const suffixVisible =
    !!suffix ||
    !!suffixIcon ||
    clearable ||
    showPassword ||
    isWordLimitVisible ||
    (!!validateState && needStatusIcon);

  // --- 原生值同步 ---

  // rAF 里调用 setNativeInputValue 时闭包可能还停在旧 value 上，
  // 会把上一次的值写回 DOM；用 ref 始终读到最近一次提交的受控值。
  const nativeInputValueRef = useRef(nativeInputValue);

  const setNativeInputValue = useCallback(() => {
    const el = element();
    if (!el) return;

    const value = nativeInputValueRef.current;
    const formatted = formatter ? formatter(value) : value;
    if (el.value === formatted || type === "file") return;

    el.value = formatted;
  }, [formatter, type, element]);

  /**
   * 官方全程手动写 el.value 而不是绑定 value，以保住输入法组合与光标位置。
   * React 里同样在布局阶段同步，等价于官方 onMounted + watch(nativeInputValue)。
   */
  useIsomorphicLayoutEffect(() => {
    nativeInputValueRef.current = nativeInputValue;
    setNativeInputValue();
  }, [nativeInputValue, setNativeInputValue, isTextarea, type]);

  // 记录光标，供 formatter 改写值后恢复
  const selectionRef = useRef<{
    beforeTxt: string;
    afterTxt: string;
    selectionStart: number;
  } | null>(null);

  const recordCursor = useCallback(() => {
    const el = element();
    if (!el) return;

    const { selectionStart, selectionEnd } = el;

    if (selectionStart == null || selectionEnd == null) return;

    selectionRef.current = {
      selectionStart,
      beforeTxt: el.value.slice(0, Math.max(0, selectionStart)),
      afterTxt: el.value.slice(Math.max(0, selectionEnd)),
    };
  }, [element]);

  const setCursor = useCallback(() => {
    const el = element();
    const info = selectionRef.current;
    if (!el || !info) return;

    const { beforeTxt, afterTxt, selectionStart } = info;
    if (beforeTxt == undefined || afterTxt == undefined || selectionStart == undefined)
      return;

    let startPos = el.value.length;

    if (el.value.endsWith(afterTxt)) {
      startPos = el.value.length - afterTxt.length;
    } else if (el.value.startsWith(beforeTxt)) {
      startPos = beforeTxt.length;
    } else {
      const beforeLastChar = beforeTxt[selectionStart - 1];
      const newIndex = el.value.indexOf(beforeLastChar, selectionStart - 1);
      if (newIndex !== -1) startPos = newIndex + 1;
    }

    el.setSelectionRange(startPos, startPos);
  }, [element]);

  const formatValue = useCallback(
    (raw: string) => {
      let next = raw;
      if (modelModifiers.trim) next = next.trim();
      if (modelModifiers.number) next = `${looseToNumber(next)}`;
      if (formatter && parser) next = parser(next);
      return next;
    },
    [modelModifiers.trim, modelModifiers.number, formatter, parser],
  );

  // 对应官方 saveValue，被 countGraphemes 的截断逻辑使用。
  // 它不参与渲染，用 ref 保存可避免输入时多一轮渲染。
  const saveValueRef = useRef(nativeInputValue);

  useEffect(() => {
    saveValueRef.current = nativeInputValue;
  }, [nativeInputValue]);

  // 对应官方 watch(modelValue)：值变化后触发 FormItem 的 change 校验
  const lastValidatedValue = useRef(nativeInputValue);
  useEffect(() => {
    if (lastValidatedValue.current === nativeInputValue) return;
    lastValidatedValue.current = nativeInputValue;
    if (validateEvent) formItem?.validate?.("change").catch(NOOP);
  }, [nativeInputValue, validateEvent, formItem]);

  const emitValue = useCallback(
    (next: string) => {
      onChange?.(next);
    },
    [onChange],
  );

  const handleInput = useCallback(
    (event: React.FormEvent<TargetElement>) => {
      if (isComposingRef.current) return;

      const target = event.target as TargetElement;
      let nextValue = target.value;
      let shouldForceNativeUpdate = false;

      // lazy 修饰符：只发 input，等 change 时才提交值
      if (modelModifiers.lazy) {
        return;
      }

      nextValue = formatValue(nextValue);

      // 官方 countGraphemes 截断：只接受可用字素数量内的新内容，
      // 已超限时阻止继续输入，行为尽量贴近原生 maxlength。
      if (countGraphemes && maxlengthStr != null) {
        const limit = Number(maxlengthStr);
        const graphemes = countGraphemes(nextValue);
        const saveGraphemes = countGraphemes(saveValueRef.current);

        if (graphemes > limit && graphemes > saveGraphemes) {
          if (saveGraphemes > limit) {
            nextValue = saveValueRef.current;
            shouldForceNativeUpdate = true;
          } else {
            const prevValue = saveValueRef.current;
            let prefixLen = 0;

            while (
              prefixLen < prevValue.length &&
              prefixLen < nextValue.length &&
              prevValue[prefixLen] === nextValue[prefixLen]
            ) {
              prefixLen++;
            }

            let prevSuffixIndex = prevValue.length;
            let nextSuffixIndex = nextValue.length;
            while (
              prevSuffixIndex > prefixLen &&
              nextSuffixIndex > prefixLen &&
              prevValue[prevSuffixIndex - 1] === nextValue[nextSuffixIndex - 1]
            ) {
              prevSuffixIndex--;
              nextSuffixIndex--;
            }

            const before = nextValue.slice(0, prefixLen);
            const removed = prevValue.slice(prefixLen, prevSuffixIndex);
            const inserted = nextValue.slice(prefixLen, nextSuffixIndex);
            const after = nextValue.slice(nextSuffixIndex);

            const removedCount = countGraphemes(removed);
            const baseCount = saveGraphemes - removedCount;
            const availableInserted = Math.max(0, limit - baseCount);

            let acceptedInserted = "";
            if (availableInserted > 0) {
              if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
                const segmenter = new Intl.Segmenter(undefined, {
                  granularity: "grapheme",
                });
                for (const { segment } of segmenter.segment(inserted)) {
                  const candidate = acceptedInserted + segment;
                  if (countGraphemes(candidate) > availableInserted) break;
                  acceptedInserted = candidate;
                }
              } else {
                // 老环境按码点迭代，与官方 fallback 一致
                for (const char of Array.from(inserted)) {
                  const candidate = acceptedInserted + char;
                  if (countGraphemes(candidate) > availableInserted) break;
                  acceptedInserted = candidate;
                }
              }
            }

            nextValue = before + acceptedInserted + after;
            shouldForceNativeUpdate = true;
          }
        }
      }

      if (String(nextValue) === nativeInputValue) {
        // 值没变但原生值被浏览器改过（如 formatter 场景），拉回受控状态
        if (formatter || shouldForceNativeUpdate) {
          const blockedValue = target.value;
          const selectionStart = target.selectionStart;
          const selectionEnd = target.selectionEnd;
          setNativeInputValue();

          // 输入被截断时保持光标位置稳定
          const el = element();
          if (
            shouldForceNativeUpdate &&
            el &&
            selectionStart != null &&
            selectionEnd != null
          ) {
            const restoredValue = el.value;
            const afterTxt = blockedValue.slice(Math.max(0, selectionEnd));
            let caretPos = Math.min(selectionStart, restoredValue.length);

            if (afterTxt && restoredValue.endsWith(afterTxt)) {
              caretPos = restoredValue.length - afterTxt.length;
            }
            el.setSelectionRange(caretPos, caretPos);
          }
        }
        return;
      }

      recordCursor();
      saveValueRef.current = nextValue;
      emitValue(nextValue);

      // 受控同步后恢复光标
      window.requestAnimationFrame(() => {
        setNativeInputValue();
        setCursor();
      });
    },
    [
      modelModifiers.lazy,
      formatValue,
      countGraphemes,
      maxlengthStr,
      nativeInputValue,
      formatter,
      setNativeInputValue,
      setCursor,
      emitValue,
      element,
      recordCursor,
    ],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<TargetElement>) => {
      const target = event.target;
      const nextValue = formatValue(target.value);

      if (modelModifiers.lazy) emitValue(nextValue);

      onValueChange?.(nextValue, event.nativeEvent);
      setNativeInputValue();
    },
    [formatValue, modelModifiers.lazy, emitValue, onValueChange, setNativeInputValue],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<TargetElement>) => {
      if (isDisabled || isFocused) return;
      setIsFocused(true);
      onFocus?.(event);
    },
    [isDisabled, isFocused, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<TargetElement>) => {
      // 焦点仍落在组件内部（如点到前后缀插槽里的按钮）时不视为失焦
      const related = event.relatedTarget as Node | null;
      const scope = wrapperRef.current ?? event.currentTarget.parentElement;
      if (isDisabled || (related && scope?.contains(related))) return;
      setIsFocused(false);
      if (validateEvent) formItem?.validate?.("blur").catch(NOOP);
      onBlur?.(event);
    },
    [isDisabled, onBlur, validateEvent, formItem],
  );

  // --- textarea 自适应高度 ---

  /**
   * 自适应高度是「测量 → 写入 → 再测量」的布局计算，不是渲染输入，
   * 因此按官方 shallowRef 的语义直接写 DOM，不走 setState，
   * 否则高度会晚一帧落地、拖拽 resize 时还会抖动。
   */
  const resizeTextarea = useCallback(() => {
    if (!isTextarea) return;
    const el = textareaRef.current;
    if (!el) return;

    if (autosize) {
      const minRows = typeof autosize === "object" ? autosize.minRows : undefined;
      const maxRows = typeof autosize === "object" ? autosize.maxRows : undefined;
      const next = calcTextareaHeight(el, minRows, maxRows);

      // 先隐藏滚动条，等下一帧再恢复，否则出现过的滚动条不会消失
      el.style.overflowY = "hidden";
      if (next.minHeight) el.style.minHeight = next.minHeight;
      el.style.height = next.height;

      window.requestAnimationFrame(() => {
        // 强制重排，确保上面写的高度已生效
        void el.offsetHeight;
        el.style.overflowY = "";
      });
    } else {
      const { minHeight } = calcTextareaHeight(el);
      if (minHeight) el.style.minHeight = minHeight;
    }
  }, [isTextarea, autosize]);

  useIsomorphicLayoutEffect(() => {
    resizeTextarea();
  }, [resizeTextarea, nativeInputValue, type]);

  /**
   * 用户手动拉伸（resize 为 both / horizontal）后，官方会把当前高度记为基准高度，
   * 后续 autosize 以它为准。这里在 resize 结束后记录。
   */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || !isTextarea || resizable === "none" || !resizable) return;

    const handleResizeEnd = () => {
      setTextareaHeight(el.style.height);
    };

    el.addEventListener("mouseup", handleResizeEnd);
    return () => el.removeEventListener("mouseup", handleResizeEnd);
  }, [isTextarea, resizable]);

  const handlePasswordVisible = useCallback(() => {
    setPasswordVisible((v) => !v);
  }, []);

  /**
   * 对应官方 useFocusController 的 handleClick：点 wrapper 空白处聚焦输入框，
   * 但如果点的是本身就可聚焦的元素（如按钮），或焦点已在组件内部，则不抢焦点。
   */
  const handleWrapperClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      if (
        isDisabled ||
        target.closest(
          'input, textarea, button, a[href], select, [tabindex]:not([tabindex="-1"])',
        ) ||
        (event.currentTarget.contains(document.activeElement) &&
          event.currentTarget !== document.activeElement)
      )
        return;

      element()?.focus();
    },
    [isDisabled, element],
  );

  const clear = useCallback(
    (event?: React.MouseEvent) => {
      emitValue("");
      onValueChange?.("", event?.nativeEvent ?? new Event("change"));
      onClear?.();
      window.requestAnimationFrame(() => {
        setNativeInputValue();
      });
    },
    [emitValue, onValueChange, onClear, setNativeInputValue],
  );

  // textareaStyle 同时用于渲染与实例暴露，按官方顺序合并
  const textareaStyle = useMemo<CSSProperties>(
    () => ({
      ...inputStyle,
      ...(resizable ? { resize: resizable } : {}),
      ...(isTextarea && textareaHeight ? { height: textareaHeight } : {}),
    }),
    [inputStyle, resizable, isTextarea, textareaHeight],
  );

  // 对应官方 defineExpose；DOM 引用用 getter 保持最新
  useImperativeHandle(
    ref,
    () => ({
      get input() {
        return inputRef.current;
      },
      get textarea() {
        return textareaRef.current;
      },
      get ref() {
        return element();
      },
      get textareaStyle() {
        return textareaStyle;
      },
      get isComposing() {
        return isComposing;
      },
      get passwordVisible() {
        return passwordVisible;
      },
      get autosize() {
        return autosize;
      },
      focus: () => element()?.focus(),
      blur: () => element()?.blur(),
      select: () => element()?.select(),
      clear: () => clear(),
      resizeTextarea,
    }),
    [
      autosize,
      clear,
      element,
      isComposing,
      passwordVisible,
      resizeTextarea,
      textareaStyle,
    ],
  );

  // --- 类名，逐条对应官方 containerKls / wrapperKls ---

  const base = isTextarea ? "el-textarea" : "el-input";

  // 官方 containerKls 里的块级修饰，按插槽与属性是否存在决定
  const hasPrefix = !!prefix || !!prefixIcon;
  const hasSuffix = !!suffix || !!suffixIcon || clearable || showPassword;
  const hasGroup = !!prepend || !!append;

  const containerClasses = [
    base,
    inputSize && `el-input--${inputSize}`,
    isDisabled && "is-disabled",
    inputExceed && "is-exceed",
    hasGroup && "el-input-group",
    // 官方在模板上额外挂的两个 group 方向修饰
    append && "el-input-group--append",
    prepend && "el-input-group--prepend",
    hasPrefix && "el-input--prefix",
    hasSuffix && "el-input--suffix",
    // nsInput.bm('suffix', 'password-clear')
    showClear && showPwdVisible && "el-input-suffix--password-clear",
    type === "hidden" && "el-input-hidden",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClasses = ["el-input__wrapper", isFocused && "is-focus"]
    .filter(Boolean)
    .join(" ");

  const textareaClasses = [
    "el-textarea__inner",
    isFocused && "is-focus",
    clearable && "is-clearable",
  ]
    .filter(Boolean)
    .join(" ");

  const renderPasswordIcon = () =>
    passwordVisible ? <View /> : <Hide />;

  const passwordIconNode = passwordIcon
    ? passwordIcon(passwordVisible)
    : renderPasswordIcon();

  /**
   * 对应官方 useResizeObserver(textarea)：textarea 横向可拉伸时，
   * 让字数统计与清除图标跟着右边界移动。
   */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || !isTextarea) return;

    const observer = new ResizeObserver((entries) => {
      if (
        (!isWordLimitVisible && !renderClear) ||
        (resizable !== "both" && resizable !== "horizontal")
      )
        return;

      const width = entries[0].target.getBoundingClientRect().width;

      if (countRef.current) {
        countRef.current.style.right = `calc(100% - ${width - 10}px)`;
      }
      if (clearRef.current) {
        clearRef.current.style.right = `calc(100% - ${width - 11}px)`;
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isTextarea, isWordLimitVisible, renderClear, resizable]);

  const countNode = (withInner: boolean) => (
    <span
      ref={countRef}
      className={[
        "el-input__count",
        wordLimitPosition === "outside" && "is-outside",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {withInner ? (
        <span className="el-input__count-inner">
          {textLength} / {maxlengthStr}
        </span>
      ) : (
        <>
          {textLength} / {maxlengthStr}
        </>
      )}
    </span>
  );

  const commonNativeProps = {
    name: restProps.name as string | undefined,
    minLength: countGraphemes ? undefined : (minlength as number | undefined),
    maxLength: countGraphemes ? undefined : (maxlength as number | undefined),
    disabled: isDisabled,
    readOnly,
    autoComplete: restProps.autoComplete ?? "off",
    tabIndex,
    placeholder,
    form: restProps.form,
    autoFocus: restProps.autoFocus,
    role: containerRole,
    inputMode: restProps.inputMode,
    onCompositionStart: (event: React.CompositionEvent<TargetElement>) => {
      isComposingRef.current = true;
      setIsComposing(true);
      // 原生处理器按 input 类型声明，textarea 分支的事件结构一致，仅类型不兼容
      restProps.onCompositionStart?.(
        event as unknown as React.CompositionEvent<HTMLInputElement>,
      );
    },
    onCompositionUpdate: (event: React.CompositionEvent<TargetElement>) => {
      isComposingRef.current = true;
      setIsComposing(true);
      restProps.onCompositionUpdate?.(
        event as unknown as React.CompositionEvent<HTMLInputElement>,
      );
    },
    onCompositionEnd: (event: React.CompositionEvent<TargetElement>) => {
      if (isComposingRef.current) {
        isComposingRef.current = false;
        setIsComposing(false);
        // 官方在 nextTick 后再走一次 handleInput
        window.requestAnimationFrame(() => handleInput(event));
      }
      restProps.onCompositionEnd?.(
        event as unknown as React.CompositionEvent<HTMLInputElement>,
      );
    },
    onInput: handleInput,
    onChange: handleChange,
    onKeyDown: onKeyDown as React.KeyboardEventHandler<TargetElement>,
  };

  const rootProps = {
    className: containerClasses,
    style,
    onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => {
      setHovering(true);
      onMouseEnter?.(event);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => {
      setHovering(false);
      onMouseLeave?.(event);
    },
  };

  // textarea 分支
  if (isTextarea) {
    return (
      <div {...rootProps}>
        <textarea
          {...(restProps as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...commonNativeProps}
          ref={textareaRef}
          id={inputId}
          rows={rows}
          className={textareaClasses}
          style={textareaStyle}
          aria-label={restProps["aria-label"]}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showClear && (
          <ElIcon
            ref={clearRef}
            className="el-textarea__clear"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clear}
          >
            {clearIcon ?? <CircleClose />}
          </ElIcon>
        )}
        {isWordLimitVisible && countNode(false)}
      </div>
    );
  }

  // input 分支
  return (
    <div {...rootProps}>
      {prepend && <div className="el-input-group__prepend">{prepend}</div>}

      <div className={wrapperClasses} ref={wrapperRef} onClick={handleWrapperClick}>
        {(prefix || prefixIcon) && (
          <span className="el-input__prefix">
            <span className="el-input__prefix-inner">
              {prefix}
              {prefixIcon && (
                <ElIcon className="el-input__icon">{prefixIcon}</ElIcon>
              )}
            </span>
          </span>
        )}

        <input
          {...restProps}
          {...commonNativeProps}
          ref={inputRef}
          id={inputId}
          className="el-input__inner"
          style={inputStyle}
          type={
            showPassword
              ? passwordVisible
                ? "text"
                : "password"
              : (type as string)
          }
          aria-label={restProps["aria-label"]}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {suffixVisible && (
          <span className="el-input__suffix">
            <span className="el-input__suffix-inner">
              {renderClear && (
                <ElIcon
                  className="el-input__icon el-input__clear"
                  style={{ visibility: showClear ? "visible" : "hidden" }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={clear}
                >
                  {clearIcon ?? <CircleClose />}
                </ElIcon>
              )}

              {(!showClear || !showPwdVisible || !isWordLimitVisible) && (
                <>
                  {suffix}
                  {suffixIcon && (
                    <ElIcon className="el-input__icon">{suffixIcon}</ElIcon>
                  )}
                </>
              )}

              {showPwdVisible && (
                <ElIcon
                  className="el-input__icon el-input__password"
                  onClick={handlePasswordVisible}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseUp={(event) => event.preventDefault()}
                >
                  {passwordIconNode}
                </ElIcon>
              )}

              {isWordLimitVisible && countNode(true)}

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
            </span>
          </span>
        )}
      </div>

      {append && <div className="el-input-group__append">{append}</div>}
    </div>
  );
}) as (props: InputProps & { ref?: React.Ref<InputExpose> }) => ReactNode;

export type { InputType };
