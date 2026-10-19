"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { ValidateFieldsError } from "async-validator";
import { FormContextKey } from "./constants";
import type {
  FormContext,
  FormItemContext,
  FormItemProp,
  FormLabelWidthContext,
  FormRules,
  FormValidateCallback,
} from "./context";
import {
  debugWarn,
  ensureArray,
  filterFields,
  isFunction,
  normalizeProp,
  setPropValue,
} from "./utils";
import { useFormSize } from "./use-form";
import type { ComponentSize } from "../button/types";

const COMPONENT_NAME = "ElForm";

export interface FormProps {
  /** 表单数据对象 */
  model?: Record<string, unknown>;
  /** 表单校验规则 */
  rules?: FormRules;
  /** 表单内组件尺寸 */
  size?: ComponentSize;
  /** 是否禁用表单内全部组件 */
  disabled?: boolean;
  /** 标签位置 */
  labelPosition?: "left" | "right" | "top";
  /** 星号位置 */
  requireAsteriskPosition?: "left" | "right";
  /** 标签宽度，传 'auto' 时按最长标签自适应 */
  labelWidth?: string | number;
  /** 标签后缀 */
  labelSuffix?: string;
  /** 是否行内表单 */
  inline?: boolean;
  /** 错误信息是否显示为行内样式 */
  inlineMessage?: boolean;
  /** 是否显示校验结果图标 */
  statusIcon?: boolean;
  /** 是否显示错误信息 */
  showMessage?: boolean;
  /** rules 变化时是否立即触发校验 */
  validateOnRuleChange?: boolean;
  /** 是否隐藏必填字段标签旁的红色星号 */
  hideRequiredAsterisk?: boolean;
  /** 校验失败时是否滚动到第一个错误项 */
  scrollToError?: boolean;
  /** scrollIntoView 的参数 */
  scrollIntoViewOptions?: ScrollIntoViewOptions | boolean;
  /** 校验完成后触发，参数为字段 prop、是否通过、错误信息 */
  onValidate?: (prop: FormItemProp, isValid: boolean, message: string) => void;
  /**
   * resetFields 需要回写 model。
   * React 的 props 不可变，这里把「还原后的整个 model」交回使用方，由使用方 setState。
   * 对应官方 `getProp(model, prop).value = ...` 的就地修改。
   */
  onModelChange?: (model: Record<string, unknown>) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 defineExpose 暴露的实例方法。 */
export interface FormExpose {
  validate: (callback?: FormValidateCallback) => Promise<boolean>;
  validateField: (
    props?: FormItemProp | FormItemProp[],
    callback?: FormValidateCallback,
  ) => Promise<boolean>;
  resetFields: (props?: FormItemProp | FormItemProp[]) => void;
  clearValidate: (props?: FormItemProp | FormItemProp[]) => void;
  scrollToField: (prop: FormItemProp) => void;
  getField: (prop: FormItemProp) => FormItemContext | undefined;
  fields: FormItemContext[];
  setInitialValues: (initModel: Record<string, unknown>) => void;
}

/** 官方 cloneDeep 只用到「把初始值快照一份」，这里按 JSON 可序列化范围等价实现。 */
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

/**
 * 对应官方 ElForm。
 *
 * 校验引擎用官方的 async-validator，规则语义与官方一致。
 * 与官方的差异：官方用 `getProp(model, prop).value` 拿到的是响应式引用，
 * 可以直接 `computedValue.value = x` 回写；React 的 props 不可变，
 * 所以 resetFields / setInitialValues 通过 `onModelChange` 回调把整个新 model 交给使用方。
 */
export const ElForm = forwardRef<FormExpose, FormProps>(function ElForm(
  {
    model,
    rules,
    size,
    disabled,
    labelPosition = "right",
    requireAsteriskPosition = "left",
    labelWidth = "",
    labelSuffix = "",
    inline = false,
    inlineMessage = false,
    statusIcon = false,
    showMessage = true,
    validateOnRuleChange = true,
    hideRequiredAsterisk = false,
    scrollToError = false,
    scrollIntoViewOptions = true,
    onValidate,
    onModelChange,
    className,
    style,
    children,
  },
  ref,
) {
  const formRef = useRef<HTMLFormElement>(null);
  const fieldsRef = useRef<FormItemContext[]>([]);
  const initialValuesRef = useRef(new Map<string, unknown>());
  const formSize = useFormSize(size);

  // 「自动标签宽度」官方用响应式数组统计，这里同样用 ref + 强制刷新
  const labelWidthsRef = useRef<number[]>([]);
  const [labelWidthSeed, setLabelWidthSeed] = useState(0);
  const autoLabelWidth = useMemo(() => {
    void labelWidthSeed;
    if (labelWidthsRef.current.length === 0) return "0";
    const max = Math.max(...labelWidthsRef.current);
    return max ? `${max}px` : "";
  }, [labelWidthSeed]);

  const labelWidthContext: FormLabelWidthContext = useMemo(
    () => ({
      autoLabelWidth,
      registerLabelWidth(val: number, oldVal: number) {
        const list = labelWidthsRef.current;
        if (val && oldVal) {
          const index = list.indexOf(oldVal);
          if (index > -1) list.splice(index, 1, val);
        } else if (val) {
          list.push(val);
        }
        setLabelWidthSeed((n) => n + 1);
      },
      deregisterLabelWidth(val: number) {
        const index = labelWidthsRef.current.indexOf(val);
        if (index > -1) {
          labelWidthsRef.current.splice(index, 1);
          setLabelWidthSeed((n) => n + 1);
        }
      },
    }),
    [autoLabelWidth],
  );

  const getField = useCallback(
    (prop: FormItemProp) => filterFields(fieldsRef.current, [prop])[0],
    [],
  );

  const addField = useCallback((field: FormItemContext) => {
    if (!fieldsRef.current.includes(field)) fieldsRef.current.push(field);

    if (field.propString) {
      if (initialValuesRef.current.has(field.propString)) {
        field.setInitialValue(initialValuesRef.current.get(field.propString));
      } else {
        initialValuesRef.current.set(
          field.propString,
          cloneDeep(field.fieldValue),
        );
      }
    }
  }, []);

  const removeField = useCallback(
    (field: FormItemContext, oldPropString?: string) => {
      // prop 被改过的存活字段：删掉旧 key，字段本身留在列表里
      if (oldPropString) {
        initialValuesRef.current.delete(oldPropString);
        return;
      }
      const index = fieldsRef.current.indexOf(field);
      if (index > -1) {
        fieldsRef.current.splice(index, 1);
        if (field.propString) {
          initialValuesRef.current.set(
            field.propString,
            cloneDeep(field.getInitialValue()),
          );
        }
      }
    },
    [],
  );

  const setInitialValues = useCallback(
    (initModel: Record<string, unknown>) => {
      if (!model) {
        debugWarn(COMPONENT_NAME, "model is required for setInitialValues");
        return;
      }
      if (!initModel) return;

      // 与官方一致：setInitialValues 只更新「resetFields 要还原到哪些值」，
      // 不修改当前 model；真正写回发生在后续 resetFields。
      for (const key of initialValuesRef.current.keys()) {
        initialValuesRef.current.set(key, cloneDeep(getFieldValue(initModel, key)));
      }
      fieldsRef.current.forEach((field) => {
        if (field.propString) {
          field.setInitialValue(getFieldValue(initModel, field.propString));
        }
      });
    },
    [model],
  );

  const resetFields = useCallback(
    (properties: FormItemProp | FormItemProp[] = []) => {
      if (!model) {
        debugWarn(COMPONENT_NAME, "model is required for resetFields");
        return;
      }

      // 每个 FormItem 单独写 model 时，React 会拿到同一份旧 model 并互相覆盖，
      // 因此这里合并所有字段初值后只回调一次 onModelChange。
      const next = cloneDeep(model);
      let changed = false;
      filterFields(fieldsRef.current, properties).forEach((field) => {
        field.resetField(false);
        if (field.propString) {
          setPropValue(
            next,
            field.propString,
            cloneDeep(field.getInitialValue()),
          );
          changed = true;
        }
      });

      const activePropStrings = new Set(
        fieldsRef.current.map((f) => f.propString).filter(Boolean),
      );
      const propsToCheck =
        ensureArray(properties).length > 0
          ? ensureArray(properties).map(normalizeProp)
          : [...initialValuesRef.current.keys()];

      // 不在场但仍缓存过初值的字段（条件渲染后隐藏），也要一起还原
      for (const propString of propsToCheck) {
        if (
          !activePropStrings.has(propString) &&
          initialValuesRef.current.has(propString)
        ) {
          setPropValue(
            next,
            propString,
            cloneDeep(initialValuesRef.current.get(propString)),
          );
          changed = true;
        }
      }
      if (changed) onModelChange?.(next);
    },
    [model, onModelChange],
  );

  const clearValidate = useCallback(
    (props: FormItemProp | FormItemProp[] = []) => {
      filterFields(fieldsRef.current, props).forEach((field) =>
        field.clearValidate(),
      );
    },
    [],
  );

  const obtainValidateFields = useCallback(
    (props: FormItemProp | FormItemProp[]) => {
      if (fieldsRef.current.length === 0) return [];

      const filtered = filterFields(fieldsRef.current, props);
      if (!filtered.length) {
        debugWarn(COMPONENT_NAME, "please pass correct props");
        return [];
      }
      return filtered;
    },
    [],
  );

  const doValidateField = useCallback(
    async (props: FormItemProp | FormItemProp[] = []): Promise<boolean> => {
      if (!model) {
        debugWarn(COMPONENT_NAME, "model is required for validate");
        return false;
      }

      const fields = obtainValidateFields(props);
      if (fields.length === 0) return true;

      let validationErrors: ValidateFieldsError = {};
      for (const field of fields) {
        try {
          await field.validate("");
          if (field.getValidateState() === "error" && !field.error) {
            field.resetField();
          }
        } catch (fieldsError) {
          validationErrors = {
            ...validationErrors,
            ...(fieldsError as ValidateFieldsError),
          };
        }
      }

      if (Object.keys(validationErrors).length === 0) return true;
      return Promise.reject(validationErrors);
    },
    [model, obtainValidateFields],
  );

  const validateField = useCallback(
    async (
      modelProps: FormItemProp | FormItemProp[] = [],
      callback?: FormValidateCallback,
    ) => {
      let result = false;
      const shouldThrow = !isFunction(callback);

      try {
        result = await doValidateField(modelProps);
        if (result === true) await callback?.(result);
        return result;
      } catch (error) {
        if (error instanceof Error) throw error;

        const invalidFields = error as ValidateFieldsError;
        if (scrollToError && formRef.current) {
          // 错误项的渲染顺序不确定，直接在 DOM 里找第一个 is-error。
          // 校验状态是 React state，此刻尚未提交到 DOM，等下一帧再滚动。
          const formEl = formRef.current;
          window.requestAnimationFrame(() => {
            formEl
              .querySelector(".el-form-item.is-error")
              ?.scrollIntoView(scrollIntoViewOptions as ScrollIntoViewOptions);
          });
        }
        if (!result) await callback?.(false, invalidFields);
        if (!shouldThrow) return false;
        return Promise.reject(invalidFields);
      }
    },
    [doValidateField, scrollIntoViewOptions, scrollToError],
  );

  const validate = useCallback(
    (callback?: FormValidateCallback) => validateField([], callback),
    [validateField],
  );

  const scrollToField = useCallback(
    (prop: FormItemProp) => {
      const field = getField(prop);
      field?.$el.current?.scrollIntoView(
        scrollIntoViewOptions as ScrollIntoViewOptions,
      );
    },
    [getField, scrollIntoViewOptions],
  );

  // rules 变化时按官方默认行为重新校验一次
  useEffect(() => {
    if (!validateOnRuleChange) return;
    validate().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules, validateOnRuleChange]);

  const context: FormContext = {
    model,
    rules,
    size,
    disabled,
    labelPosition,
    requireAsteriskPosition,
    labelWidth,
    labelSuffix,
    inline,
    inlineMessage,
    statusIcon,
    showMessage,
    hideRequiredAsterisk,
    ...labelWidthContext,
    emitValidate: (prop, isValid, message) => onValidate?.(prop, isValid, message),
    onModelChange,
    getField,
    addField,
    removeField,
    resetFields,
    setInitialValues,
    clearValidate,
    validateField,
  };

  useImperativeHandle(
    ref,
    () => ({
      validate,
      validateField,
      resetFields,
      clearValidate,
      scrollToField,
      getField,
      fields: fieldsRef.current,
      setInitialValues,
    }),
    [
      clearValidate,
      getField,
      resetFields,
      scrollToField,
      setInitialValues,
      validate,
      validateField,
    ],
  );

  const rootClasses = [
    "el-form",
    `el-form--${formSize || "default"}`,
    labelPosition && `el-form--label-${labelPosition}`,
    inline && "el-form--inline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FormContextKey.Provider value={context}>
      <form ref={formRef} className={rootClasses} style={style}>
        {children}
      </form>
    </FormContextKey.Provider>
  );
});

/** 从任意嵌套对象按路径读值，供 setInitialValues 使用。 */
function getFieldValue(source: Record<string, unknown>, prop: string): unknown {
  let current: unknown = source;
  for (const key of prop.split(".")) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}
