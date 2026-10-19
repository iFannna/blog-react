export { ElTableV2 } from "./ElTableV2";
export type { ElTableV2Props } from "./ElTableV2";

// 与 table 模块同名的类型统一加 TableV2 前缀，避免根 barrel 冲突
export { SortOrder as TableV2SortOrder } from "./constants";
export { FixedDir as TableV2FixedDir } from "./constants";

export type {
  Alignment as TableV2Alignment,
  Column as TableV2Column,
  HeaderCellSlotProps as TableV2HeaderCellSlotProps,
  KeyType as TableV2KeyType,
  ScrollParams as TableV2ScrollParams,
  SortBy as TableV2SortBy,
  SortState as TableV2SortState,
  TableV2CustomizedHeaderSlotParam,
  TableV2Expose,
  TableV2HeaderRendererParams,
  TableV2Props,
  TableV2Row,
  TableV2RowCellRenderParam,
  TableV2RowSlotProps,
} from "./types";
