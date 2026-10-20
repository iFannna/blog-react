"use client";

import {
  cloneElement,
  isValidElement,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { ArrowLeft, ArrowRight, CaretLeft, CaretRight, MoreFilled } from "../icons";
import { ElSelect, type SelectOption } from "../select/ElSelect";
import { useTranslator } from "../config-provider/context";

export type PaginationLayoutKey =
  | "prev"
  | "pager"
  | "next"
  | "jumper"
  | "total"
  | "sizes"
  | "->";

export interface PaginationProps {
  /** 每页条数 */
  pageSize?: number;
  /** 总条数 */
  total?: number;
  /** 总页数，传入后优先于 total/pageSize 的计算 */
  pageCount?: number;
  /** 当前页 */
  currentPage?: number;
  /** 页码按钮数量，必须为 5~21 之间的奇数 */
  pagerCount?: number;
  /** 组件布局，逗号分隔 */
  layout?: string;
  /** sizes 下拉的可选值 */
  pageSizes?: number[];
  /** 每页条数变化 */
  onPageSizeChange?: (size: number) => void;
  /** 当前页变化 */
  onCurrentPageChange?: (page: number) => void;
  /** 是否显示背景色 */
  background?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 只有一页时是否隐藏 */
  hideOnSinglePage?: boolean;
  /** 小号分页 */
  small?: boolean;
  /** 尺寸 */
  size?: "large" | "default" | "small";
  /** 上一页文字，传入后替换箭头图标 */
  prevText?: string;
  /** 下一页文字 */
  nextText?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * 对应官方 ElPagination 的 pager 部分。
 *
 * 页码折叠算法逐行移植官方 pager.vue 的 pagers computed：
 * - pageCount 超过 pagerCount 时才出现「更多」
 * - currentPage 越过中段后显示前置更多，未到末尾段显示后置更多
 * - 三种组合分别给出中间页码数组
 */
function computePagers(currentPage: number, pageCount: number, pagerCount: number) {
  const halfPagerCount = (pagerCount - 1) / 2;
  let showPrevMore = false;
  let showNextMore = false;

  if (pageCount > pagerCount) {
    if (currentPage > pagerCount - halfPagerCount) showPrevMore = true;
    if (currentPage < pageCount - halfPagerCount) showNextMore = true;
  }

  const array: number[] = [];

  if (showPrevMore && !showNextMore) {
    const startPage = pageCount - (pagerCount - 2);
    for (let i = startPage; i < pageCount; i++) array.push(i);
  } else if (!showPrevMore && showNextMore) {
    for (let i = 2; i < pagerCount; i++) array.push(i);
  } else if (showPrevMore && showNextMore) {
    const offset = Math.floor(pagerCount / 2) - 1;
    for (let i = currentPage - offset; i <= currentPage + offset; i++) {
      array.push(i);
    }
  } else {
    for (let i = 2; i < pageCount; i++) array.push(i);
  }

  return { pagers: array, showPrevMore, showNextMore };
}

/** 对应官方 ElPagination。 */
export function ElPagination({
  pageSize = 10,
  total = 0,
  pageCount: pageCountProp,
  currentPage: currentPageProp,
  pagerCount = 7,
  layout = "prev, pager, next, jumper, ->, total",
  pageSizes = [10, 20, 30, 40, 50, 100],
  onPageSizeChange,
  onCurrentPageChange,
  background = false,
  disabled = false,
  hideOnSinglePage = false,
  small = false,
  size,
  prevText,
  nextText,
  className,
  style,
}: PaginationProps) {
  const [uncontrolledPage, setUncontrolledPage] = useState(1);
  const [uncontrolledSize, setUncontrolledSize] = useState(pageSize);

  // 分页内置文案全部走 locale，缺省语言包为英文（与官方一致）
  const t = useTranslator();

  const currentPage = currentPageProp ?? uncontrolledPage;
  const effectivePageSize = pageSize ?? uncontrolledSize;

  const pageCount =
    pageCountProp ?? Math.max(1, Math.ceil(total / effectivePageSize));

  const setPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), pageCount);
    if (clamped === currentPage) return;
    setUncontrolledPage(clamped);
    onCurrentPageChange?.(clamped);
  };

  const setPageSize = (next: number) => {
    setUncontrolledSize(next);
    onPageSizeChange?.(next);
  };

  const { pagers, showPrevMore, showNextMore } = useMemo(
    () => computePagers(currentPage, pageCount, pagerCount),
    [currentPage, pageCount, pagerCount],
  );

  const [jumperValue, setJumperValue] = useState("");

  if (hideOnSinglePage && pageCount <= 1) return null;

  const resolvedSize = small ? "small" : (size ?? "default");
  const rootClasses = [
    "el-pagination",
    `el-pagination--${resolvedSize}`,
    background && "is-background",
    disabled && "is-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // layout 里的 `->` 之后的元素进右对齐区，对应官方 rightwrapper
  const parts = layout.split(",").map((p) => p.trim()) as PaginationLayoutKey[];
  const arrowIndex = parts.indexOf("->");
  const leftParts = arrowIndex === -1 ? parts : parts.slice(0, arrowIndex);
  const rightParts = arrowIndex === -1 ? [] : parts.slice(arrowIndex + 1);

  const sizeOptions: SelectOption[] = pageSizes.map((s) => ({
    value: s,
    label: `${s}${t("el.pagination.pagesize")}`,
  }));

  const renderPart = (part: PaginationLayoutKey, keyPrefix: string) => {
    switch (part) {
      case "total":
        return (
          <span className="el-pagination__total" key={`${keyPrefix}-total`}>
            {t("el.pagination.total", { total })}
          </span>
        );

      case "sizes":
        return (
          <span className="el-pagination__sizes" key={`${keyPrefix}-sizes`}>
            <ElSelect
              value={effectivePageSize}
              options={sizeOptions}
              onChange={(value) => setPageSize(Number(value))}
              disabled={disabled}
            />
          </span>
        );

      case "prev":
        return (
          <button
            type="button"
            key={`${keyPrefix}-prev`}
            className="btn-prev"
            disabled={disabled || currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            {prevText ?? (
              <ElIcon>
                <ArrowLeft />
              </ElIcon>
            )}
          </button>
        );

      case "next":
        return (
          <button
            type="button"
            key={`${keyPrefix}-next`}
            className="btn-next"
            disabled={disabled || currentPage >= pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            {nextText ?? (
              <ElIcon>
                <ArrowRight />
              </ElIcon>
            )}
          </button>
        );

      case "pager":
        return (
          <ul className="el-pager" key={`${keyPrefix}-pager`}>
            <li
              className={[
                "number",
                currentPage === 1 && "is-active",
                disabled && "is-disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-disabled={disabled || undefined}
              tabIndex={0}
              onClick={() => !disabled && setPage(1)}
              onKeyDown={(event) => {
                if (disabled) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setPage(1);
                }
              }}
            >
              1
            </li>

            {showPrevMore && (
              <li
                className={[
                  "more",
                  "btn-quickprev",
                  "el-icon",
                  disabled && "is-disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-disabled={disabled || undefined}
                tabIndex={0}
                onClick={() => !disabled && setPage(currentPage - pagerCount + 2)}
                onKeyDown={(event) => {
                  if (disabled) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setPage(currentPage - pagerCount + 2);
                  }
                }}
              >
                <MoreFilled />
              </li>
            )}

            {pagers.map((page) => (
              <li
                key={page}
                className={[
                  "number",
                  currentPage === page && "is-active",
                  disabled && "is-disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-disabled={disabled || undefined}
                tabIndex={0}
                onClick={() => !disabled && setPage(page)}
                onKeyDown={(event) => {
                  if (disabled) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setPage(page);
                  }
                }}
              >
                {page}
              </li>
            ))}

            {showNextMore && (
              <li
                className={[
                  "more",
                  "btn-quicknext",
                  "el-icon",
                  disabled && "is-disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-disabled={disabled || undefined}
                tabIndex={0}
                onClick={() => !disabled && setPage(currentPage + pagerCount - 2)}
                onKeyDown={(event) => {
                  if (disabled) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setPage(currentPage + pagerCount - 2);
                  }
                }}
              >
                <MoreFilled />
              </li>
            )}

            {pageCount > 1 && (
              <li
                className={[
                  "number",
                  currentPage === pageCount && "is-active",
                  disabled && "is-disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-disabled={disabled || undefined}
                tabIndex={0}
                onClick={() => !disabled && setPage(pageCount)}
                onKeyDown={(event) => {
                  if (disabled) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setPage(pageCount);
                  }
                }}
              >
                {pageCount}
              </li>
            )}
          </ul>
        );

      case "jumper":
        return (
          <span className="el-pagination__jump" key={`${keyPrefix}-jumper`}>
            <span className="el-pagination__goto">{t("el.pagination.goto")}</span>
            <div
              className={`el-input el-input--${resolvedSize} el-pagination__editor is-in-pagination`}
            >
              <div className="el-input__wrapper">
                <input
                  type="number"
                  className="el-input__inner"
                  value={jumperValue}
                  disabled={disabled}
                  aria-label={t("el.pagination.page")}
                  onChange={(event) => setJumperValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    const page = Number.parseInt(jumperValue, 10);
                    if (!Number.isNaN(page)) setPage(page);
                    setJumperValue("");
                  }}
                />
              </div>
            </div>
            <span className="el-pagination__classifier">
              {t("el.pagination.pageClassifier")}
            </span>
          </span>
        );

      default:
        return null;
    }
  };

  // 官方会给首尾布局项加 is-first / is-last，用于抵消按钮自带的左右外边距
  const withPosition = (node: ReactNode, first: boolean, last: boolean) => {
    if (!isValidElement(node)) return node;
    const element = node as ReactElement<{ className?: string }>;
    const className = [
      element.props.className,
      first && "is-first",
      last && "is-last",
    ]
      .filter(Boolean)
      .join(" ");
    return cloneElement(element, { className });
  };

  return (
    <div className={rootClasses} style={style}>
      {leftParts.map((part, index) =>
        withPosition(
          renderPart(part, "l"),
          index === 0,
          rightParts.length === 0 && index === leftParts.length - 1,
        ),
      )}
      {rightParts.length > 0 && (
        <div className="el-pagination__rightwrapper">
          {rightParts.map((part) => renderPart(part, "r"))}
        </div>
      )}
    </div>
  );
}

/** 供需要自定义插槽的场景使用，当前未实现 slot 布局项。 */
export type PaginationSlot = ReactNode;

/** 快速跳转时的箭头图标，保留导出以便自定义渲染时复用。 */
export const PaginationIcons = { CaretLeft, CaretRight };
