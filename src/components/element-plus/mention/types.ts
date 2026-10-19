export interface MentionOption {
  value?: string;
  label?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

/**
 * 选项字段别名配置，对应官方 MentionOptionProps。
 * 官方默认 { value: 'value', label: 'label', disabled: 'disabled' }。
 */
export interface MentionOptionProps {
  value?: string;
  label?: string;
  disabled?: string;
  [key: string]: string | undefined;
}

/** 提及词上下文，对应官方 MentionCtx。 */
export interface MentionCtx {
  /** 前缀与光标之间的文本 */
  pattern: string;
  /** pattern 的起始下标 */
  start: number;
  /** pattern 的结束下标（即光标或分隔符位置） */
  end: number;
  /** 命中的前缀字符 */
  prefix: string;
  /** 前缀字符的下标 */
  prefixIndex: number;
  /** 最近的分隔符下标，-1 表示光标后还没有分隔符 */
  splitIndex: number;
  /** 触发时的光标位置 */
  selectionEnd: number;
}
