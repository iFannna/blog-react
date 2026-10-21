"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CompositionEvent,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { ElCascaderPanel } from "../cascader-panel";
import { useEmptyValues, useTranslator } from "../config-provider/context";
import { useFormDisabled, useFormItem, useFormSize } from "../form/use-form";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, Check, CircleClose } from "../generated/icons";
import { ElInput } from "../input/ElInput";
import { ElScrollbar } from "../scrollbar";
import { ElTag } from "../tag";
import { ElTooltip } from "../tooltip";
import { ElFixedSizeList } from "../virtual-list";
import { clamp } from "../utils";

import type { ComponentSize } from "../button/types";
import type { ScrollbarExpose } from "../scrollbar";
import type { VirtualListHandle } from "../virtual-list";
import type Node from "../cascader-panel/node";
import type {
  CascaderPanelHandle,
  CascaderValue,
  Tag,
} from "../cascader-panel/types";
import type { CascaderProps } from "./types";

const DEFAULT_FALLBACK_PLACEMENTS: CascaderProps["fallbackPlacements"] = [
  "bottom-start",
  "bottom",
  "top-start",
  "top",
  "right",
  "left",
];

const defaultFilterMethod = (node: Node, keyword: string) =>
  node.text.includes(keyword);

const ALLOW_FILTER = () => true;

function noop() {}

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return (
    !!value &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

/**
 * 对应官方 ElCascader。
 *
 * 面板、标签与搜索建议共享同一份勾选状态：面板内部由 PanelController
 * 维护，组件通过 onCheckedNodesChange 拿到快照后计算标签与展示文本。
 */
export function ElCascader({
  value = null,
  options = [],
  props: propsConfig = {},
  size,
  placeholder,
  disabled,
  clearable = false,
  clearIcon,
  filterable = false,
  filterMethod = defaultFilterMethod,
  separator = " / ",
  showAllLevels = true,
  collapseTags = false,
  maxCollapseTags = 1,
  collapseTagsTooltip = false,
  maxCollapseTagsTooltipHeight,
  debounce = 300,
  beforeFilter = ALLOW_FILTER,
  placement = "bottom-start",
  fallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
  popperClass,
  popperStyle,
  teleported = true,
  effect = "light",
  tagType = "info",
  tagEffect = "light",
  validateEvent = true,
  persistent = true,
  showCheckedStrategy = "child",
  fitInputWidth = false,
  virtualScroll = false,
  itemSize = 34,
  height = 204,
  emptyValues,
  valueOnClear,
  renderLabel,
  empty,
  prefix,
  renderTag,
  renderSuggestionItem,
  header,
  footer,
  id,
  className,
  style,
  onChange,
  onVisibleChange,
  onExpandChange,
  onRemoveTag,
  onClear,
  onFocus,
  onBlur,
  ref,
}: CascaderProps) {
  const t = useTranslator();
  const { formItem } = useFormItem();
  const isDisabled = useFormDisabled(disabled);
  const realSize = useFormSize(size) as ComponentSize | "";
  const { valueOnClear: resolvedValueOnClear } = useEmptyValues({
    emptyValues,
    valueOnClear,
  });

  const multiple = !!propsConfig.multiple;
  const readonly = !filterable || multiple;

  const [popperVisible, setPopperVisible] = useState(false);
  const [inputHover, setInputHover] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [suggestions, setSuggestions] = useState<Node[]>([]);
  const [checkedNodes, setCheckedNodes] = useState<Node[]>([]);
  const [allCheckedNodes, setAllCheckedNodes] = useState<Node[]>([]);
  const [hitKey, setHitKey] = useState<number | null>(null);
  // present 记录 input 文本当前对应的选中文本，选中变化时在渲染期同步
  const [inputState, setInputState] = useState({
    present: "",
    input: "",
    search: "",
  });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const tagWrapperRef = useRef<HTMLDivElement | null>(null);
  const inputNativeRef = useRef<HTMLInputElement | null>(null);
  const contentElRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<CascaderPanelHandle | null>(null);
  const suggestionScrollRef = useRef<ScrollbarExpose | null>(null);
  const suggestionVirtualListRef = useRef<VirtualListHandle | null>(null);
  const tooltipUpdateRef = useRef<(() => void) | null>(null);
  const filterTimerRef = useRef<number | null>(null);
  const pressDeleteCountRef = useRef(0);
  const inputInitialHeightRef = useRef(0);

  const presentText = checkedNodes.length
    ? multiple
      ? ""
      : checkedNodes[0].calcText(showAllLevels, separator)
    : "";

  if (inputState.present !== presentText) {
    // 对应官方 watch(presentText)：选中文本变化时回填输入框
    setInputState({
      present: presentText,
      input: presentText,
      search: presentText,
    });
  }

  const strategyNodes: Node[] =
    showCheckedStrategy === "parent"
      ? allCheckedNodes.filter(
          (node) =>
            !node.parent ||
            !allCheckedNodes.some((item) => item.value === node.parent?.value),
        )
      : checkedNodes;

  const tags: Tag[] = strategyNodes.map((node) => ({
    node,
    key: node.uid,
    text: node.calcText(showAllLevels, separator),
    hitState: hitKey === node.uid,
    closable: !isDisabled && !node.isDisabled,
  }));

  const showTagList = multiple
    ? collapseTags
      ? tags.slice(0, maxCollapseTags)
      : tags
    : [];
  const collapseTagList =
    multiple && collapseTags ? tags.slice(maxCollapseTags) : [];

  const inputPlaceholder =
    placeholder ?? t("el.cascader.placeholder");
  const currentPlaceholder =
    inputState.search || tags.length > 0 || isComposing
      ? ""
      : inputPlaceholder;
  const tagSize = realSize === "small" ? "small" : "default";
  const clampedSuggestionListHeight = clamp(
    suggestions.length * itemSize,
    itemSize,
    height,
  );

  const handleCheckedNodesChange = useCallback(
    (nodes: Node[], allNodes: Node[]) => {
      setCheckedNodes(nodes);
      setAllCheckedNodes(allNodes);
    },
    [],
  );

  const handleTooltipUpdate = useCallback((update: (() => void) | null) => {
    tooltipUpdateRef.current = update;
  }, []);

  const updatePopperPosition = () => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => tooltipUpdateRef.current?.());
  };

  const syncPresentTextValue = () => {
    setInputState({
      present: presentText,
      input: presentText,
      search: presentText,
    });
  };

  const emitValue = (next: CascaderValue | null | undefined) => {
    const resolved = (next ?? resolvedValueOnClear) as CascaderValue;
    onChange?.(resolved);
    if (validateEvent) formItem?.validate("change").catch(noop);
  };

  const togglePopperVisible = (visible?: boolean) => {
    if (isDisabled) return;

    const next = visible ?? !popperVisible;
    if (next === popperVisible) return;

    setPopperVisible(next);
    if (next) {
      updatePopperPosition();
      window.setTimeout(() => panelRef.current?.scrollToExpandingNode(), 0);
    } else if (filterable) {
      syncPresentTextValue();
    }
    onVisibleChange?.(next);
  };

  const focusFirstNode = () => {
    const content = contentElRef.current;
    if (!content) return;

    let firstNode: HTMLElement | null;
    if (filtering) {
      firstNode = content.querySelector<HTMLElement>(
        ".el-cascader__suggestion-item",
      );
    } else {
      firstNode = content.querySelector<HTMLElement>(
        '.el-cascader-node[tabindex="-1"]',
      );
    }

    if (firstNode) {
      firstNode.focus();
      if (
        !filtering &&
        firstNode.getAttribute("aria-haspopup") === "true"
      ) {
        firstNode.click();
      }
    }
  };

  const calculateSuggestions = (keyword: string) => {
    const nodes =
      panelRef.current?.getFlattedNodes(!propsConfig.checkStrictly) ?? [];
    const result = nodes.filter((node) => {
      if (node.isDisabled) return false;
      node.calcText(showAllLevels, separator);
      return filterMethod(node, keyword);
    });

    setHitKey(null);
    setFiltering(true);
    setSuggestions(result);

    window.setTimeout(() => {
      suggestionScrollRef.current?.setScrollTop(0);
      suggestionVirtualListRef.current?.scrollToItem(0);
      updatePopperPosition();
    }, 0);
  };

  const resetFilter = () => {
    const passed = beforeFilter("");
    if (isPromiseLike(passed)) passed.catch(noop);
    setFiltering(false);
  };

  const scheduleFilter = (keyword: string) => {
    if (filterTimerRef.current) window.clearTimeout(filterTimerRef.current);
    filterTimerRef.current = window.setTimeout(() => {
      filterTimerRef.current = null;
      const passed = beforeFilter(keyword);
      if (isPromiseLike(passed)) {
        passed
          .then(() => calculateSuggestions(keyword))
          .catch(noop);
      } else if (passed !== false) {
        calculateSuggestions(keyword);
      } else {
        setFiltering(false);
      }
    }, debounce);
  };

  const openAndFilter = (keyword: string) => {
    if (!popperVisible) togglePopperVisible(true);
    if (keyword) scheduleFilter(keyword);
    else resetFilter();
  };

  const handleSingleInput = (val: string) => {
    setInputState((prev) => ({ ...prev, input: val }));
    if (isComposing) return;
    openAndFilter(val);
  };

  const handleSearchInput = (val: string) => {
    setInputState((prev) => ({ ...prev, search: val }));
    if (isComposing) return;
    openAndFilter(val);
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionUpdate = () => setIsComposing(true);
  const handleCompositionEnd = (
    event: CompositionEvent<HTMLInputElement>,
  ) => {
    const val = event.currentTarget.value;
    setIsComposing(false);
    setInputState((prev) => ({
      ...prev,
      [multiple ? "search" : "input"]: val,
    }));
    if (!popperVisible) togglePopperVisible(true);
    if (val) scheduleFilter(val);
    else resetFilter();
  };

  const deleteTag = (tag: Tag) => {
    const node = tag.node;
    if (!node) return;

    node.doCheck(false);
    panelRef.current?.calculateCheckedValue();
    setHitKey(null);
    onRemoveTag?.(node.valueByOption);
  };

  const handleDelete = () => {
    const lastTag = tags[tags.length - 1];
    pressDeleteCountRef.current = inputState.search
      ? 0
      : pressDeleteCountRef.current + 1;

    if (
      !lastTag ||
      !pressDeleteCountRef.current ||
      (collapseTags && tags.length > 1)
    ) {
      return;
    }

    if (lastTag.hitState) deleteTag(lastTag);
    else setHitKey(lastTag.key);
  };

  const handleClear = () => {
    panelRef.current?.clearCheckedNodes();
    if (!popperVisible && filterable) syncPresentTextValue();
    togglePopperVisible(false);
    onClear?.();
  };

  const handleSuggestionClick = (node: Node) => {
    if (multiple) {
      panelRef.current?.handleCheckChange(node, !node.checked, false);
    } else {
      if (!node.checked) {
        panelRef.current?.handleCheckChange(node, true, false);
      }
      togglePopperVisible(false);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (isComposing) return;

    switch (event.key) {
      case "Enter":
      case "NumpadEnter":
        togglePopperVisible();
        break;
      case "ArrowDown":
        togglePopperVisible(true);
        window.setTimeout(focusFirstNode, 0);
        event.preventDefault();
        break;
      case "Escape":
        if (popperVisible) {
          event.preventDefault();
          event.stopPropagation();
          togglePopperVisible(false);
        }
        break;
      case "Tab":
        togglePopperVisible(false);
        break;
    }
  };

  const handleSuggestionKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
  ) => {
    const target = event.target as HTMLElement;

    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        const distance = event.key === "ArrowUp" ? -1 : 1;

        if (virtualScroll && suggestionVirtualListRef.current) {
          const item = target.closest<HTMLElement>("[data-suggestion-index]");
          const rawIndex = item?.dataset.suggestionIndex;
          const currentIndex = rawIndex ? Number.parseInt(rawIndex, 10) : -1;

          if (
            currentIndex >= 0 &&
            currentIndex < suggestions.length &&
            suggestions.length > 0
          ) {
            const nextIndex =
              (currentIndex + distance + suggestions.length) %
              suggestions.length;
            suggestionVirtualListRef.current.scrollToItem(nextIndex);
            window.setTimeout(() => {
              contentElRef.current
                ?.querySelector<HTMLElement>(
                  `#suggestion-${suggestions[nextIndex].uid}`,
                )
                ?.focus();
            }, 0);
            return;
          }
        }

        focusSibling(
          target,
          distance,
          '.el-cascader__suggestion-item[tabindex="-1"]',
        );
        break;
      }
      case "Enter":
      case "NumpadEnter":
        target.click();
        break;
    }
  };

  const handleInputFocus = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setIsFocused(true);
    onFocus?.(event as FocusEvent<HTMLInputElement>);
  };

  const handleInputBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onBlur?.(event as FocusEvent<HTMLInputElement>);
    if (validateEvent) formItem?.validate("blur").catch(noop);

    const related = event.relatedTarget as globalThis.Node | null;
    if (
      related &&
      (rootRef.current?.contains(related) ||
        contentElRef.current?.contains(related))
    ) {
      return;
    }

    window.setTimeout(() => {
      const active = document.activeElement;
      if (
        active &&
        (rootRef.current?.contains(active) ||
          contentElRef.current?.contains(active))
      ) {
        return;
      }
      setIsFocused(false);
    }, 0);
  };

  // 点击输入框与浮层之外的区域关闭
  useEffect(() => {
    if (!popperVisible) return;

    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target as globalThis.Node;
      if (rootRef.current?.contains(target)) return;
      if (contentElRef.current?.contains(target)) return;

      setPopperVisible(false);
      if (filterable) {
        setInputState({
          present: presentText,
          input: presentText,
          search: presentText,
        });
      }
      onVisibleChange?.(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [popperVisible, filterable, presentText, onVisibleChange]);

  useEffect(
    () => () => {
      if (filterTimerRef.current) window.clearTimeout(filterTimerRef.current);
    },
    [],
  );

  // 输入框初始高度：多选标签换行时以它作为下限，对应官方 inputInitialHeight
  useEffect(() => {
    const input = inputNativeRef.current;
    if (input) inputInitialHeightRef.current = input.offsetHeight;
  }, [realSize]);

  useEffect(() => {
    const input = inputNativeRef.current;
    if (!input) return;

    const initial = inputInitialHeightRef.current;
    if (tags.length > 0 && tagWrapperRef.current) {
      input.style.height = `${
        Math.max(tagWrapperRef.current.offsetHeight, initial) - 2
      }px`;
    } else if (initial) {
      input.style.height = `${initial}px`;
    }
  }, [tags.length, realSize]);

  // 建议面板宽度跟随输入框，对应官方 updateSuggestionPanelWidth
  useEffect(() => {
    if (!filtering) return;

    const input = rootRef.current?.querySelector<HTMLElement>(".el-input");
    const panel = contentElRef.current?.querySelector<HTMLElement>(
      ".el-cascader__suggestion-panel",
    );
    if (!input || !panel) return;

    const width = input.getBoundingClientRect().width;
    if (fitInputWidth !== false) {
      panel.style.width =
        typeof fitInputWidth === "number" ? `${fitInputWidth}px` : `${width}px`;
      panel.style.minWidth = "";
    } else {
      panel.style.width = "";
      panel.style.minWidth = `${width}px`;
    }
  }, [filtering, suggestions, fitInputWidth]);

  useImperativeHandle(ref, () => ({
    getCheckedNodes: (leafOnly = false) =>
      panelRef.current?.getCheckedNodes(leafOnly) ?? [],
    panelRef: panelRef.current,
    togglePopperVisible,
    contentRef: contentElRef.current,
    presentText,
    focus: () => inputNativeRef.current?.focus(),
    blur: () => inputNativeRef.current?.blur(),
  }));

  const clearBtnVisible =
    clearable &&
    !isDisabled &&
    !filtering &&
    (inputHover || isFocused) &&
    checkedNodes.length > 0;

  const rootClasses = [
    "el-cascader",
    realSize && `el-cascader--${realSize}`,
    isDisabled && "is-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const suffix = clearBtnVisible ? (
    <ElIcon
      key="clear"
      className="el-input__icon icon-circle-close"
      onClick={(event) => {
        event.stopPropagation();
        handleClear();
      }}
    >
      {clearIcon ?? <CircleClose />}
    </ElIcon>
  ) : (
    <ElIcon
      key="arrow-down"
      className={[
        "el-input__icon",
        "icon-arrow-down",
        popperVisible && "is-reverse",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(event) => {
        event.stopPropagation();
        togglePopperVisible();
      }}
    >
      <ArrowDown />
    </ElIcon>
  );

  const suggestionEmpty = empty ?? t("el.cascader.noMatch");

  return (
    <ElTooltip
      visible={popperVisible}
      trigger={[]}
      teleported={teleported}
      popperClass={["el-cascader__dropdown", popperClass]
        .filter(Boolean)
        .join(" ")}
      popperStyle={popperStyle}
      fallbackPlacements={fallbackPlacements}
      placement={placement}
      effect={effect}
      pure
      persistent={persistent}
      showArrow={false}
      role="dialog"
      onUpdate={handleTooltipUpdate}
      contentRef={contentElRef}
      triggerRef={rootRef}
      content={
        <>
          {header ? (
            <div
              className="el-cascader__header"
              onClick={(event) => event.stopPropagation()}
            >
              {header}
            </div>
          ) : null}

          <ElCascaderPanel
            ref={panelRef}
            value={value}
            options={options}
            props={propsConfig}
            border={false}
            renderLabel={renderLabel}
            empty={empty}
            virtualScroll={virtualScroll}
            itemSize={itemSize}
            height={height}
            style={filtering ? { display: "none" } : undefined}
            onChange={emitValue}
            onClose={() => togglePopperVisible(false)}
            onExpandChange={(next) => {
              updatePopperPosition();
              onExpandChange?.(next);
            }}
            onCheckedNodesChange={handleCheckedNodesChange}
          />

          {filterable ? (
            virtualScroll ? (
              <div
                className="el-cascader__suggestion-panel"
                style={!filtering ? { display: "none" } : undefined}
                onKeyDown={handleSuggestionKeyDown}
              >
                {suggestions.length > 0 ? (
                  <ElFixedSizeList
                    ref={suggestionVirtualListRef}
                    height={clampedSuggestionListHeight}
                    itemSize={itemSize}
                    data={suggestions}
                    total={suggestions.length}
                    className="el-cascader__suggestion-list"
                    innerElement="ul"
                  >
                    {({ index, style: itemStyle }) => {
                      const item = suggestions[index];
                      return (
                        <li
                          id={`suggestion-${item.uid}`}
                          key={item.uid}
                          data-suggestion-index={index}
                          className={[
                            "el-cascader__suggestion-item",
                            item.checked && "is-checked",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          tabIndex={-1}
                          style={itemStyle}
                          onClick={() => handleSuggestionClick(item)}
                        >
                          {renderSuggestionItem ? (
                            renderSuggestionItem({ item })
                          ) : (
                            <>
                              <span>{item.text}</span>
                              {item.checked && (
                                <ElIcon>
                                  <Check />
                                </ElIcon>
                              )}
                            </>
                          )}
                        </li>
                      );
                    }}
                  </ElFixedSizeList>
                ) : (
                  <ul className="el-cascader__suggestion-list">
                    <li className="el-cascader__empty-text">
                      {suggestionEmpty}
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <ElScrollbar
                ref={suggestionScrollRef}
                tag="ul"
                className="el-cascader__suggestion-panel"
                wrapClass="el-cascader__suggestion-wrap"
                viewClass="el-cascader__suggestion-list"
                style={!filtering ? { display: "none" } : undefined}
                onKeyDown={handleSuggestionKeyDown}
              >
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <li
                      key={item.uid}
                      className={[
                        "el-cascader__suggestion-item",
                        item.checked && "is-checked",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      tabIndex={-1}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {renderSuggestionItem ? (
                        renderSuggestionItem({ item })
                      ) : (
                        <>
                          <span>{item.text}</span>
                          {item.checked && (
                            <ElIcon>
                              <Check />
                            </ElIcon>
                          )}
                        </>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="el-cascader__empty-text">{suggestionEmpty}</li>
                )}
              </ElScrollbar>
            )
          ) : null}

          {footer ? (
            <div
              className="el-cascader__footer"
              onClick={(event) => event.stopPropagation()}
            >
              {footer}
            </div>
          ) : null}
        </>
      }
    >
      <div
        className={rootClasses}
        style={style}
        onMouseEnter={() => setInputHover(true)}
        onMouseLeave={() => setInputHover(false)}
        onClick={() => togglePopperVisible(readonly ? undefined : true)}
        onKeyDown={handleKeyDown}
      >
        <ElInput
          id={id}
          value={inputState.input}
          placeholder={currentPlaceholder}
          readOnly={readonly}
          disabled={isDisabled}
          validateEvent={false}
          size={realSize || undefined}
          className={isFocused ? "is-focus" : undefined}
          tabIndex={multiple && filterable && !isDisabled ? -1 : undefined}
          inputRef={(el) => {
            inputNativeRef.current = el;
          }}
          aria-expanded={popperVisible}
          aria-haspopup="listbox"
          prefix={prefix}
          suffix={suffix}
          onChange={handleSingleInput}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
        />

        {multiple ? (
          <div
            ref={tagWrapperRef}
            className={[
              "el-cascader__tags",
              formItem?.validateState && "is-validate",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {renderTag ? (
              // eslint-disable-next-line react-hooks/refs -- deleteTag 仅在点击时读取 panelRef
              renderTag({ data: tags, deleteTag })
            ) : (
              <>
                {showTagList.map((tag) => (
                  <ElTag
                    key={tag.key}
                    type={tagType}
                    size={tagSize}
                    effect={tagEffect}
                    hit={tag.hitState}
                    closable={tag.closable}
                    disableTransitions
                    onClose={(event) => {
                      event.stopPropagation();
                      deleteTag(tag);
                    }}
                  >
                    <span>{tag.text}</span>
                  </ElTag>
                ))}

                {collapseTags && tags.length > maxCollapseTags ? (
                  <ElTooltip
                    disabled={popperVisible || !collapseTagsTooltip}
                    fallbackPlacements={["bottom", "top", "right", "left"]}
                    placement="bottom"
                    popperClass={popperClass}
                    popperStyle={popperStyle}
                    effect={effect}
                    persistent={persistent}
                    content={
                      <ElScrollbar maxHeight={maxCollapseTagsTooltipHeight}>
                        <div className="el-cascader__collapse-tags">
                          {collapseTagList.map((tag) => (
                            <div
                              key={tag.key}
                              className="el-cascader__collapse-tag"
                            >
                              <ElTag
                                className="in-tooltip"
                                type={tagType}
                                size={tagSize}
                                effect={tagEffect}
                                hit={tag.hitState}
                                closable={tag.closable}
                                disableTransitions
                                onClose={() => deleteTag(tag)}
                              >
                                <span>{tag.text}</span>
                              </ElTag>
                            </div>
                          ))}
                        </div>
                      </ElScrollbar>
                    }
                  >
                    <ElTag
                      closable={false}
                      size={tagSize}
                      type={tagType}
                      effect={tagEffect}
                      disableTransitions
                    >
                      <span className="el-cascader__tags-text">
                        + {tags.length - maxCollapseTags}
                      </span>
                    </ElTag>
                  </ElTooltip>
                ) : null}
              </>
            )}

            {filterable && !isDisabled ? (
              <input
                type="text"
                className="el-cascader__search-input"
                value={inputState.search}
                placeholder={presentText ? "" : inputPlaceholder}
                onClick={(event) => {
                  event.stopPropagation();
                  togglePopperVisible(true);
                }}
                onChange={(event) => handleSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" || event.key === "Delete") {
                    handleDelete();
                  }
                }}
                onCompositionStart={handleCompositionStart}
                onCompositionUpdate={handleCompositionUpdate}
                onCompositionEnd={handleCompositionEnd}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </ElTooltip>
  );
}

/** 对应官方 getSibling：只在同一父节点下按选择器找相邻项。 */
function focusSibling(
  target: HTMLElement,
  distance: number,
  selector: string,
) {
  const parent = target.parentNode as HTMLElement | null;
  if (!parent) return;

  const siblings = Array.from(
    parent.querySelectorAll<HTMLElement>(selector),
  ).filter((item) => item.parentNode === parent);
  const index = siblings.indexOf(target);
  siblings[index + distance]?.focus();
}
