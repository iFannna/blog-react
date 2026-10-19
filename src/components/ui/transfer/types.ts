/** 官方 TransferKey：数据项的标识类型。 */
export type TransferKey = string | number;

/** 官方 TransferDirection：面板方向。 */
export type TransferDirection = "left" | "right";

/**
 * 官方 TransferDataItem：数据源里的单项，字段名可由 optionProps 重命名。
 * 官方声明即为 Record<string, any>，这里保持一致，否则 `option.label` 会是 unknown。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransferDataItem = Record<string, any>;

/** 官方 TransferFormat：面板头部的勾选统计文案模板。 */
export interface TransferFormat {
  noChecked?: string;
  hasChecked?: string;
}

/** 官方 TransferPropsAlias：数据源字段别名。 */
export interface TransferPropsAlias {
  label?: string;
  key?: string;
  disabled?: string;
}

/** 官方 TransferCheckedState：两侧面板的勾选集合。 */
export interface TransferCheckedState {
  leftChecked: TransferKey[];
  rightChecked: TransferKey[];
}

export const DEFAULT_PROPS_ALIAS: Required<TransferPropsAlias> = {
  label: "label",
  key: "key",
  disabled: "disabled",
};

/**
 * 用「类型 + 值」拼签名，避免把 1 与 "1" 当成同一个 key
 * （官方用 includes 的严格相等比较，签名也必须保持同样的区分度）。
 * 取 JSON 序列化，免去自己挑分隔符带来的拼串歧义。
 */
export function keysSignature(keys: TransferKey[]): string {
  return JSON.stringify(keys.map((key) => [typeof key, key]));
}
