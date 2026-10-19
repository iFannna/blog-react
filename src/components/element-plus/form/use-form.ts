"use client";

import { useContext, useEffect, useId, useRef } from "react";
import { FormContextKey, FormItemContextKey } from "./constants";
import { useGlobalConfig } from "../config-provider/context";
import type { FormItemContext, UseFormItemInputProps } from "./context";

/** 对应官方 inject(formContextKey, undefined)。 */
export function useFormContext() {
  return useContext(FormContextKey);
}

/** 对应官方 inject(formItemContextKey, undefined)。 */
export function useFormItemContext(): FormItemContext | undefined {
  return useContext(FormItemContextKey);
}

/**
 * 对应官方 useFormItem：拿到所在的 Form 与 FormItem 上下文。
 */
export function useFormItem() {
  const form = useFormContext();
  const formItem = useFormItemContext();
  return { form, formItem };
}

/**
 * 对应官方 useFormSize：尺寸优先级为
 * 组件自己的 size > fallback > FormItem > Form > 全局配置（ConfigProvider 的 size）。
 *
 * FormItem 自身计算 size 时官方会传 `{ formItem: false }` 忽略父 FormItem，
 * 避免嵌套 FormItem 继承外层 FormItem 的尺寸；普通控件保持默认查找链。
 */
export function useFormSize(
  ownSize: string | undefined,
  fallback?: string,
  options?: { ignoreFormItem?: boolean },
): string {
  const { form, formItem } = useFormItem();
  const globalSize = useGlobalConfig("size");
  const itemSize = options?.ignoreFormItem ? undefined : formItem?.size;
  return ownSize || fallback || itemSize || form?.size || globalSize || "";
}

/**
 * 对应官方 useFormDisabled：
 * 组件自己的 disabled > fallback > Form 的 disabled。
 * 官方 2.12.0 之后改为「内部组件配置优先」，这里沿用该语义。
 */
export function useFormDisabled(
  ownDisabled: boolean | undefined,
  fallback?: boolean,
): boolean {
  const form = useFormContext();
  return ownDisabled ?? fallback ?? form?.disabled ?? false;
}

/**
 * 对应官方 useFormItemInputId。
 *
 * 把输入类组件的 id 注册到 FormItem：让 label 的 for 能指向它，
 * 并在没有显式 label 时由 FormItem 的 labelId 兜底关联。
 */
export function useFormItemInputId(props: UseFormItemInputProps) {
  const formItemContext = useFormItemContext();
  const generatedId = useId();
  // id 完全由 props.id 或 useId 推导，无需再存 state
  const inputId = props.id ?? generatedId;
  const registeredRef = useRef<string | undefined>(undefined);

  // 官方：组件自己没有 label / ariaLabel，且 FormItem 下只有一个输入时，
  // 认为该输入由 FormItem 的 label 标注
  const isLabeledByFormItem = !(
    props.label ||
    props.ariaLabel ||
    !formItemContext ||
    formItemContext.inputIds.length > 1
  );

  const addInputId = formItemContext?.addInputId;
  const removeInputId = formItemContext?.removeInputId;

  useEffect(() => {
    if (registeredRef.current && removeInputId) {
      removeInputId(registeredRef.current);
    }
    if (inputId && addInputId) {
      addInputId(inputId);
      registeredRef.current = inputId;
    }

    return () => {
      if (registeredRef.current && removeInputId) {
        removeInputId(registeredRef.current);
        registeredRef.current = undefined;
      }
    };
  }, [inputId, addInputId, removeInputId]);

  return { isLabeledByFormItem, inputId };
}

/** 输入类组件取 id 的便捷封装，等价官方 useFormItemInputId(props).inputId。 */
export function useInputId(id?: string) {
  return useFormItemInputId({ id }).inputId;
}

export { FormItemContextKey };
