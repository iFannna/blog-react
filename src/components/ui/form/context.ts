import type { RuleItem, ValidateFieldsError } from "async-validator";
import type { CSSProperties, ReactNode, RefObject } from "react";
import type { ComponentSize } from "../button/types";

/** 官方 form-item 的 prop 支持字符串或路径数组。 */
export type FormItemProp = string | string[];

export type FormItemValidateState = "" | "error" | "validating" | "success";

/** 官方 FormItemRule，比 async-validator 的 RuleItem 多一个 trigger。 */
export interface FormItemRule extends RuleItem {
  trigger?: string | string[];
}

export type FormRules = Record<string, FormItemRule | FormItemRule[]>;

export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError,
) => void | Promise<void>;

export interface FormLabelWidthContext {
  autoLabelWidth: string;
  registerLabelWidth: (val: number, oldVal: number) => void;
  deregisterLabelWidth: (val: number) => void;
}

export interface FormContext {
  model?: Record<string, unknown>;
  rules?: FormRules;
  size?: ComponentSize;
  disabled?: boolean;
  labelPosition: "left" | "right" | "top";
  requireAsteriskPosition: "left" | "right";
  labelWidth: string | number;
  labelSuffix: string;
  inline: boolean;
  inlineMessage: boolean;
  statusIcon: boolean;
  showMessage: boolean;
  hideRequiredAsterisk: boolean;
  autoLabelWidth: string;
  registerLabelWidth: (val: number, oldVal: number) => void;
  deregisterLabelWidth: (val: number) => void;
  emitValidate: (prop: FormItemProp, isValid: boolean, message: string) => void;
  /**
   * resetField 需要回写 model。React props 不可变，这里把新的整个 model 交回使用方。
   * 对应官方 `getProp(model, prop).value = x` 的就地修改。
   */
  onModelChange?: (model: Record<string, unknown>) => void;
  getField: (prop: FormItemProp) => FormItemContext | undefined;
  addField: (field: FormItemContext) => void;
  removeField: (field: FormItemContext, oldPropString?: string) => void;
  resetFields: (props?: FormItemProp | FormItemProp[]) => void;
  setInitialValues: (initModel: Record<string, unknown>) => void;
  clearValidate: (props?: FormItemProp | FormItemProp[]) => void;
  validateField: (
    props?: FormItemProp | FormItemProp[],
    callback?: FormValidateCallback,
  ) => Promise<boolean>;
}

export interface FormItemContext {
  $el: RefObject<HTMLDivElement | null>;
  /** FormItem 上显式传入的 size，优先于 Form */
  size?: ComponentSize;
  /** 手动指定的错误信息，供 Form.validate 判断是否需要重置字段 */
  error?: string;
  validateMessage: string;
  validateState: FormItemValidateState;
  /**
   * 同步读取最新校验状态。
   * React 的 setState 到下一次渲染之间存在延迟，Form 在 await validate 之后
   * 直接读 validateState 可能拿到上一帧的值，故单独提供 ref 读取口。
   */
  getValidateState: () => FormItemValidateState;
  isGroup: boolean;
  labelId: string;
  inputIds: string[];
  hasLabel: boolean;
  fieldValue: unknown;
  propString: string;
  labelPosition: "left" | "right" | "top";
  labelWidth?: string | number;
  addInputId: (id: string) => void;
  removeInputId: (id: string) => void;
  validate: (trigger: string, callback?: FormValidateCallback) => Promise<boolean>;
  /**
   * emitModelChange=false 供 Form.resetFields 使用：
   * Form 会一次性合并所有字段的初值后只回写一次 model，避免多次 setState 互相覆盖。
   */
  resetField: (emitModelChange?: boolean) => void;
  clearValidate: () => void;
  setInitialValue: (value: unknown) => void;
  getInitialValue: () => unknown;
}

/** 官方 IUseFormItemInputCommonProps：输入类组件用来自动挂 id 的字段。 */
export interface UseFormItemInputProps {
  id?: string;
  label?: string | number | boolean | Record<string, unknown>;
  ariaLabel?: string | number | boolean | Record<string, unknown>;
}

export interface LabelWrapProps {
  isAutoWidth: boolean;
  updateAll: boolean;
  children: ReactNode;
  labelPosition?: "left" | "right" | "top";
  style?: CSSProperties;
}
