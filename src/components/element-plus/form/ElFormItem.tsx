"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Schema from "async-validator";
import type { RuleItem, ValidateFieldsError } from "async-validator";
import { FormItemContextKey } from "./constants";
import FormLabelWrap from "./FormLabelWrap";
import { useFormItem, useFormSize } from "./use-form";
import type {
  FormItemContext,
  FormItemProp,
  FormItemRule,
  FormItemValidateState,
  FormValidateCallback,
} from "./context";
import {
  addUnit,
  ensureArray,
  getPropValue,
  isArray,
  isBoolean,
  isFunction,
  normalizeProp,
} from "./utils";
import type { ComponentSize } from "../button/types";

export interface FormItemProps {
  /** 标签文本 */
  label?: string;
  /** 标签宽度 */
  labelWidth?: string | number;
  /** 标签位置，省略时继承 Form */
  labelPosition?: "left" | "right" | "top" | "";
  /** model 中的字段路径，可以是字符串或路径数组 */
  prop?: FormItemProp;
  /** 是否必填，省略时由校验规则决定 */
  required?: boolean;
  /** 校验规则 */
  rules?: FormItemRule | FormItemRule[];
  /** 手动设置错误信息，传入后立即显示该错误 */
  error?: string;
  /** 校验状态 */
  validateStatus?: FormItemValidateState;
  /** 同原生 label 的 for */
  htmlFor?: string;
  /** 官方属性名 for 的别名，与 htmlFor 等价 */
  for?: string;
  /** 错误信息是否显示为行内样式 */
  inlineMessage?: boolean;
  /** 是否显示错误信息 */
  showMessage?: boolean;
  /** 表单内组件尺寸 */
  size?: ComponentSize;
  /** 自定义标签内容，对应官方 label 插槽 */
  labelSlot?: (label: string) => ReactNode;
  /** 自定义错误内容，对应官方 error 插槽 */
  errorSlot?: (error: string) => ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 defineExpose 暴露的实例方法。 */
export interface FormItemExpose {
  size?: ComponentSize;
  validateMessage: string;
  validateState: FormItemValidateState;
  validate: (trigger: string, callback?: FormValidateCallback) => Promise<boolean>;
  clearValidate: () => void;
  resetField: () => void;
  setInitialValue: (value: unknown) => void;
}

/** 官方 cloneDeep 的等价实现，仅用于初值快照。 */
function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => cloneDeep(item)) as T;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    result[key] = cloneDeep(item);
  }
  return result as T;
}

/** resetField 用的路径写入。 */
function setValueByPath(
  target: Record<string, unknown>,
  prop: FormItemProp,
  value: unknown,
) {
  const path = Array.isArray(prop) ? prop : prop.split(".");
  let current: Record<string, unknown> | undefined = target;
  for (let i = 0; i < path.length - 1; i++) {
    current = current?.[path[i]] as Record<string, unknown> | undefined;
  }
  if (current) current[path[path.length - 1]] = value;
}

/**
 * 对应官方 ElFormItem。
 *
 * 与官方一致地维护 validateState / validateMessage，按 trigger 过滤规则后用
 * async-validator 校验。官方把 validateState 经 refDebounced(100ms) 再用于
 * 决定错误是否露出，这里用等价的定时器实现，避免输入过程中错误信息闪动。
 */
export const ElFormItem = forwardRef<FormItemExpose, FormItemProps>(
  function ElFormItem(
    {
      label,
      labelWidth,
      labelPosition: labelPositionProp = "",
      prop,
      required,
      rules,
      error,
      validateStatus,
      htmlFor,
      for: forProp,
      inlineMessage,
      showMessage = true,
      size: itemSize,
      labelSlot,
      errorSlot,
      className,
      style,
      children,
    },
    ref,
  ) {
    const { form, formItem: parentFormItem } = useFormItem();
    const reactId = useId();

    const formItemRef = useRef<HTMLDivElement>(null);
    const labelId = `el-form-item-label-${reactId}`;

    const [inputIds, setInputIds] = useState<string[]>([]);
    // 官方对 error 的 watch 是 immediate，挂载时就应显示手动错误
    const [validateState, setValidateState] = useState<FormItemValidateState>(
      error ? "error" : "",
    );
    const [validateMessage, setValidateMessage] = useState(error || "");
    const [debouncedState, setDebouncedState] =
      useState<FormItemValidateState>("");

    // 与 state 同步维护一份 ref，供 Form 在 await 后立即读取最新状态
    const validateStateRef = useRef<FormItemValidateState>("");
    const setValidationState = useCallback((state: FormItemValidateState) => {
      validateStateRef.current = state;
      setValidateState(state);
    }, []);

    // 官方用 refDebounced(validateState, 100) 决定错误是否露出
    useEffect(() => {
      const timer = window.setTimeout(() => setDebouncedState(validateState), 100);
      return () => window.clearTimeout(timer);
    }, [validateState]);

    // 这两个是命令式状态，不参与渲染，放 ref 里与官方的 let 变量对应
    const initialValueRef = useRef<unknown>(undefined);
    const isResettingFieldRef = useRef(false);

    // FormItem 自身尺寸不继承父 FormItem，与官方 useFormSize(undefined, { formItem: false }) 一致
    const itemSizeResolved = useFormSize(itemSize, undefined, {
      ignoreFormItem: true,
    });
    const isNested = !!parentFormItem;

    const labelPosition = labelPositionProp || form?.labelPosition;
    const propString = prop ? normalizeProp(prop) : "";

    // 先取出依赖再做 memo，让 React Compiler 能推断出与手写依赖一致的来源
    const formModel = form?.model;
    const formRules = form?.rules;

    const fieldValue = useMemo(() => {
      if (!formModel || !prop) return undefined;
      return getPropValue(formModel, prop);
    }, [formModel, prop]);

    const normalizedRules = useMemo(() => {
      const collected: FormItemRule[] = [];

      if (rules) collected.push(...ensureArray(rules));

      if (formRules && prop) {
        const fieldRules = getPropValue(formRules, prop);
        if (fieldRules) {
          collected.push(
            ...ensureArray(fieldRules as FormItemRule | FormItemRule[]),
          );
        }
      }

      if (required !== undefined) {
        const requiredRules = collected
          .map((rule, index) => [rule, index] as const)
          .filter(([rule]) => "required" in rule);

        if (requiredRules.length > 0) {
          for (const [rule, index] of requiredRules) {
            if (rule.required === required) continue;
            collected[index] = { ...rule, required };
          }
        } else {
          collected.push({ required });
        }
      }

      return collected;
    }, [formRules, prop, required, rules]);

    const isRequired = normalizedRules.some((rule) => rule.required);

    const getFilteredRule = useCallback(
      (trigger: string): RuleItem[] =>
        normalizedRules
          .filter((rule) => {
            if (!rule.trigger || !trigger) return true;
            return isArray(rule.trigger)
              ? (rule.trigger as string[]).includes(trigger)
              : rule.trigger === trigger;
          })
          // 校验时不把 trigger 交给 async-validator
          .map((rule) => {
            const next = { ...rule };
            delete next.trigger;
            return next as RuleItem;
          }),
      [normalizedRules],
    );

    const addInputId = useCallback((id: string) => {
      setInputIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    const removeInputId = useCallback((id: string) => {
      setInputIds((prev) => prev.filter((item) => item !== id));
    }, []);

    const hasLabel = !!(label || labelSlot);
    const labelFor =
      htmlFor ??
      forProp ??
      (inputIds.length === 1 ? inputIds[0] : undefined);
    const isGroup = !labelFor && hasLabel;

    const setInitialValue = useCallback((value: unknown) => {
      initialValueRef.current = cloneDeep(value);
    }, []);

    const getInitialValue = useCallback(() => initialValueRef.current, []);

    const clearValidate = useCallback(() => {
      setValidationState("");
      setValidateMessage("");
      setDebouncedState("");
      isResettingFieldRef.current = false;
    }, [setValidationState]);

    const validate = useCallback(
      async (
        trigger: string,
        callback?: FormValidateCallback,
      ): Promise<boolean> => {
        // resetField 触发的校验直接跳过
        if (isResettingFieldRef.current || !prop) return false;

        const hasCallback = isFunction(callback);

        if (normalizedRules.length === 0) {
          callback?.(false);
          return false;
        }

        const targetRules = getFilteredRule(trigger);
        if (targetRules.length === 0) {
          callback?.(true);
          return true;
        }

        setValidationState("validating");

        const modelName = propString;
        const validator = new Schema({ [modelName]: targetRules });

        try {
          await validator.validate(
            { [modelName]: fieldValue },
            { firstFields: true },
          );
          setValidationState("success");
          form?.emitValidate(prop, true, "");
          callback?.(true);
          return true;
        } catch (err) {
          const failure = err as {
            errors?: { message?: string }[] | null;
            fields: ValidateFieldsError;
          };

          if (!failure.errors || !failure.fields) {
            console.error(err);
          }

          setValidationState("error");
          const message = failure.errors
            ? (failure.errors[0]?.message ?? `${propString} is required`)
            : "";
          setValidateMessage(message);

          form?.emitValidate(prop, false, message);
          callback?.(false, failure.fields);
          if (hasCallback) return false;
          return Promise.reject(failure.fields);
        }
      },
      [
        fieldValue,
        form,
        getFilteredRule,
        normalizedRules.length,
        prop,
        propString,
        setValidationState,
      ],
    );

    const resetField = useCallback(
      (emitModelChange = true) => {
        const model = form?.model;
        if (!model || !prop) return;

        // 复原过程中不要让校验被触发
        isResettingFieldRef.current = true;

        if (emitModelChange) {
          const next = cloneDeep(model);
          setValueByPath(next, prop, cloneDeep(initialValueRef.current));
          form.onModelChange?.(next);
        }

        window.setTimeout(() => {
          clearValidate();
          isResettingFieldRef.current = false;
        }, 0);
      },
      [clearValidate, form, prop],
    );

    // error / validateStatus 为受控覆盖项，与官方 watch 一样双向同步：
    // error 被清空时校验状态也要回到空，否则旧的错误样式会残留。
    // 采用「渲染期对比 prop 调整 state」，避免 effect 内同步 setState 造成的级联渲染。
    const [prevError, setPrevError] = useState<string | undefined>(error);
    if (error !== prevError) {
      setPrevError(error);
      setValidateMessage(error || "");
      // 渲染期只改 state；ref 由下方 effect 统一同步
      setValidateState(error ? "error" : "");
    }

    const [prevValidateStatus, setPrevValidateStatus] = useState<
      FormItemValidateState | undefined
    >(validateStatus);
    if (validateStatus !== prevValidateStatus) {
      setPrevValidateStatus(validateStatus);
      setValidateState(validateStatus || "");
    }

    // 渲染期调整的 state 不经过 setValidationState，这里补一次 ref 同步
    useEffect(() => {
      validateStateRef.current = validateState;
    }, [validateState]);

    const context: FormItemContext = {
      $el: formItemRef,
      size: (itemSizeResolved || undefined) as ComponentSize | undefined,
      error,
      validateMessage,
      validateState,
      getValidateState: () => validateStateRef.current,
      isGroup,
      labelId,
      inputIds,
      hasLabel,
      fieldValue,
      propString,
      labelPosition: labelPosition || "right",
      labelWidth,
      addInputId,
      removeInputId,
      validate,
      resetField,
      clearValidate,
      setInitialValue,
      getInitialValue,
    };

    // Form 的 fieldsRef 里保存的是注册时的对象。若只在挂载时注册，
    // Form.validate 会一直调用首帧的闭包（旧的 fieldValue / rules）。
    // 因此每次提交后把最新上下文同步进同一个对象。
    const registeredRef = useRef(false);
    const registeredFieldRef = useRef<FormItemContext | null>(null);
    const registeredPropStringRef = useRef(propString);

    useEffect(() => {
      const registered = registeredFieldRef.current;

      if (!form || !propString) {
        if (registeredRef.current && registered) {
          form?.removeField(registered);
          registeredRef.current = false;
          registeredFieldRef.current = null;
        }
        return;
      }

      if (!registeredRef.current) {
        setInitialValue(fieldValue);
        form.addField(context);
        registeredRef.current = true;
        registeredFieldRef.current = context;
        registeredPropStringRef.current = propString;
        return;
      }

      if (registered && registeredPropStringRef.current !== propString) {
        // prop 变更：删除旧 key（字段本身保留），再按新 prop 重新取初值
        const oldPropString = registeredPropStringRef.current;
        registeredPropStringRef.current = propString;
        form.removeField(registered, oldPropString);
        Object.assign(registered, context);
        form.addField(registered);
        return;
      }

      if (registered) Object.assign(registered, context);
    });

    // 卸载时从 Form 摘除，并缓存初值供重新挂载时恢复。
    // 依赖稳定的 removeField：ElForm 每次渲染都会新建 context 对象，
    // 若直接依赖 form 会导致每次渲染都卸载重注册。
    const removeField = form?.removeField;
    useEffect(
      () => () => {
        const registered = registeredFieldRef.current;
        if (removeField && registeredRef.current && registered) {
          removeField(registered);
        }
        registeredRef.current = false;
        registeredFieldRef.current = null;
      },
      [removeField],
    );

    useImperativeHandle(
      ref,
      () => ({
        size: (itemSizeResolved || undefined) as ComponentSize | undefined,
        validateMessage,
        validateState,
        validate,
        clearValidate,
        resetField,
        setInitialValue,
      }),
      [
        clearValidate,
        itemSizeResolved,
        resetField,
        setInitialValue,
        validate,
        validateMessage,
        validateState,
      ],
    );

    const labelStyle: CSSProperties =
      labelPosition === "top"
        ? {}
        : { width: addUnit(labelWidth ?? form?.labelWidth) };

    const contentStyle: CSSProperties = (() => {
      if (labelPosition === "top" || form?.inline) return {};
      if (!label && !labelWidth && isNested) return {};
      const width = addUnit(labelWidth ?? form?.labelWidth);
      if (!label && !labelSlot) return { marginLeft: width };
      return {};
    })();

    const shouldShowError =
      debouncedState === "error" && showMessage && (form?.showMessage ?? true);

    const currentLabel = `${label || ""}${form?.labelSuffix || ""}`;

    const inlineMessageResolved = isBoolean(inlineMessage)
      ? inlineMessage
      : form?.inlineMessage || false;

    const rootClasses = [
      "el-form-item",
      itemSizeResolved && `el-form-item--${itemSizeResolved}`,
      validateState === "error" && "is-error",
      validateState === "validating" && "is-validating",
      validateState === "success" && "is-success",
      (isRequired || required) && "is-required",
      form?.hideRequiredAsterisk && "is-no-asterisk",
      form?.requireAsteriskPosition === "right"
        ? "asterisk-right"
        : "asterisk-left",
      form?.statusIcon && "el-form-item--feedback",
      labelPosition && `el-form-item--label-${labelPosition}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <FormItemContextKey.Provider value={context}>
        <div
          ref={formItemRef}
          className={rootClasses}
          style={style}
          role={isGroup ? "group" : undefined}
          aria-labelledby={isGroup ? labelId : undefined}
        >
          <FormLabelWrap
            isAutoWidth={labelStyle.width === "auto"}
            updateAll={form?.labelWidth === "auto"}
            labelPosition={labelPosition}
          >
            {(label || labelSlot) && (
              <LabelOrDiv
                as={labelFor ? "label" : "div"}
                id={labelId}
                htmlFor={labelFor}
                className="el-form-item__label"
                style={labelStyle}
              >
                {labelSlot ? labelSlot(currentLabel) : currentLabel}
              </LabelOrDiv>
            )}
          </FormLabelWrap>

          <div className="el-form-item__content" style={contentStyle}>
            {children}
            {shouldShowError && (
              <div
                className={[
                  "el-form-item__error",
                  inlineMessageResolved && "el-form-item__error--inline",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {errorSlot ? errorSlot(validateMessage) : validateMessage}
              </div>
            )}
          </div>
        </div>
      </FormItemContextKey.Provider>
    );
  },
);

/** 官方用动态 <component :is> 决定 label / div，这里等价的薄封装。 */
function LabelOrDiv({
  as,
  htmlFor,
  children,
  ...rest
}: {
  as: "label" | "div";
  htmlFor?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  if (as === "label") {
    return (
      <label htmlFor={htmlFor} {...rest}>
        {children}
      </label>
    );
  }
  return <div {...rest}>{children}</div>;
}
