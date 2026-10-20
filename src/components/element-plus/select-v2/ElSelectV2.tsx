"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { useResizeObserver } from "../hooks";
import { ElIcon } from "../icon/ElIcon";
import {
  ArrowDown,
  CircleCheck,
  CircleClose,
  Loading,
} from "../icons";
import { ElTag } from "../tag";
import { ElTooltip } from "../tooltip";

import { BORDER_HORIZONTAL_WIDTH } from "./defaults";
import { SelectDropdown } from "./SelectDropdown";
import { useSelect } from "./use-select";

import type { Ref } from "react";
import type {
  SelectV2Expose,
  SelectV2Option,
  SelectV2OptionType,
  SelectV2Props,
} from "./types";

/** 把元素同时写入调用方的 ref 与本地 state，后者供 useResizeObserver 使用。 */
function useElementState<T extends Element>(
  ref: { current: T | null },
): [(node: T | null) => void, T | null] {
  const [element, setElement] = useState<T | null>(null);

  const setNode = useCallback(
    (node: T | null) => {
      ref.current = node;
      setElement(node);
    },
    [ref],
  );

  return [setNode, element];
}

/**
 * 对应官方 ElSelectV2。
 *
 * DOM 与官方 select.vue 一致：触发器 .el-select__wrapper 承载标签、输入框与后缀，
 * 下拉通过纯样式的 Tooltip 定位，所以浮层结构、类名、偏移与官方保持一致。
 */
export const ElSelectV2 = forwardRef<SelectV2Expose, SelectV2Props>(
  function ElSelectV2(props, ref) {
    const {
      className,
      style,
      header,
      footer,
      empty,
      loadingSlot,
      prefix,
      tag,
      label,
    } = props;
    const renderOption = props.children;

    const api = useSelect(props);
    const {
      inputId,
      contentId,
      modelValue,
      cachedOptions,
      filteredOptions,
      allOptionsValueMap,
      inputValue,
      inputStyle,
      emptyText,
      popupHeight,
      popperSize,
      dropdownVisible,
      expanded,
      hasModelValue,
      shouldShowPlaceholder,
      currentPlaceholder,
      selectedLabel,
      showClearBtn,
      showTagList,
      collapseTagList,
      collapseTagSize,
      tagStyle,
      collapseTagStyle,
      iconReverse,
      selectDisabled,
      selectSize,
      isFocused,
      inputHovering,
      tagType,
      tagEffect,
      effect,
      teleported,
      persistent,
      placement,
      fallbackPlacements,
      tabindex,
      autocomplete,
      ariaLabel,
      multiple,
      multipleLimit,
      valueKey,
      popperClass,
      popperStyle,
      appendTo,
      showArrow,
      offset,
      clearIcon,
      iconComponent,
      needStatusIcon,
      validateState,
      rootRef,
      wrapperRef,
      selectionRef,
      inputRef,
      suffixRef,
      collapseItemRef,
      calculatorRef,
      popperRef,
      tagMenuRef,
      menuRef,
      getLabel,
      getValue,
      getDisabled,
      getIndex,
      getValueKey,
      toggleMenu,
      focus,
      blur,
      scrollTo,
      onSelect,
      deleteTag,
      handleClear,
      handleDel,
      handleEsc,
      onKeyboardNavigate,
      onKeyboardSelect,
      onHover,
      onInputChange,
      debouncedInputChange,
      handleFocus,
      handleBlur,
      resetCalculatorWidth,
      resetSelectionWidth,
      resetCollapseItemWidth,
      handleResize,
      onEndReached,
      setInputValue,
      setDebouncing,
      setInputHovering,
      composingRef,
    } = api;

    const [setRootNode, rootEl] = useElementState(rootRef);
    const [setWrapperNode, wrapperEl] = useElementState(wrapperRef);
    const [setSelectionNode, selectionEl] = useElementState(selectionRef);
    const [setCalculatorNode, calculatorEl] = useElementState(calculatorRef);
    const [setCollapseItemNode, collapseItemEl] =
      useElementState(collapseItemRef);

    useResizeObserver(rootEl, handleResize);
    useResizeObserver(wrapperEl, () => {
      // 输入框宽度变化会改变下拉的贴合宽度，需重新测量
      api.updatePopperSize();
    });
    useResizeObserver(selectionEl, resetSelectionWidth);
    useResizeObserver(calculatorEl, resetCalculatorWidth);
    useResizeObserver(collapseItemEl, resetCollapseItemWidth);

    useImperativeHandle(
      ref,
      () => ({
        focus,
        blur,
        scrollTo,
        selectedLabel,
      }),
      [focus, blur, scrollTo, selectedLabel],
    );

    const inputDisabled = selectDisabled;

    const handleInputChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const value = event.target.value;
      setInputValue(value);

      if (props.remote) {
        setDebouncing(true);
        debouncedInputChange(value);
      } else {
        onInputChange(value);
      }
    };

    const handleCompositionStart = () => {
      composingRef.current = true;
    };

    const handleCompositionUpdate = (
      event: React.CompositionEvent<HTMLInputElement>,
    ) => {
      const value = event.currentTarget.value;
      const lastCharacter = value[value.length - 1] ?? "";
      // 韩文输入时最后一个字符可能仍是组合中的字母，继续等待
      composingRef.current = !/[가-힣]/.test(lastCharacter);
    };

    const handleCompositionEnd = (
      event: React.CompositionEvent<HTMLInputElement>,
    ) => {
      if (!composingRef.current) return;
      composingRef.current = false;
      handleInputChange(
        event as unknown as React.ChangeEvent<HTMLInputElement>,
      );
    };

    const handleInputKeydown = (
      event: ReactKeyboardEvent<HTMLInputElement>,
    ) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          onKeyboardNavigate("backward");
          break;
        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          onKeyboardNavigate("forward");
          break;
        case "Enter":
          event.preventDefault();
          event.stopPropagation();
          onKeyboardSelect();
          break;
        case "Escape":
          event.preventDefault();
          event.stopPropagation();
          handleEsc();
          break;
        case "Delete":
        case "Backspace":
          event.stopPropagation();
          handleDel(event);
          break;
        default:
          break;
      }
    };

    const placeholderIndex =
      !multiple && hasModelValue
        ? (allOptionsValueMap.get(modelValue)?.index ?? -1)
        : -1;

    const renderLabelContent = (option: SelectV2Option) => {
      const params = {
        index: getIndex(option),
        label: getLabel(option),
        value: getValue(option),
      };
      return label ? label(params) : getLabel(option);
    };

    const inputElement = (
      <div
        className={[
          "el-select__selected-item",
          "el-select__input-wrapper",
          (!props.filterable ||
            inputDisabled ||
            (multiple && !inputValue && !isFocused)) &&
            "is-hidden",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          id={inputId}
          ref={inputRef}
          value={inputValue}
          style={inputStyle}
          autoComplete={autocomplete}
          tabIndex={Number(tabindex)}
          aria-autocomplete="none"
          aria-haspopup="listbox"
          autoCapitalize="off"
          aria-expanded={expanded}
          aria-label={ariaLabel}
          className={[
            "el-select__input",
            selectSize && `is-${selectSize}`,
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={inputDisabled}
          role="combobox"
          aria-controls={contentId}
          aria-activedescendant={
            api.hover >= 0 ? `${contentId}-${api.hover}` : ""
          }
          readOnly={!props.filterable}
          spellCheck={false}
          type="text"
          name={props.name}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleInputKeydown}
          onClick={(event) => {
            event.stopPropagation();
            toggleMenu(event);
          }}
        />
        {props.filterable && (
          <span
            ref={setCalculatorNode}
            aria-hidden="true"
            className="el-select__input-calculator"
          >
            {inputValue}
          </span>
        )}
      </div>
    );

    const labelElement = (
      <div
        className={[
          "el-select__selected-item",
          "el-select__placeholder",
          (!hasModelValue || (expanded && !inputValue)) && "is-transparent",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {hasModelValue && label ? (
          label({
            index: placeholderIndex,
            label: currentPlaceholder,
            value: modelValue,
          })
        ) : (
          <span>{currentPlaceholder}</span>
        )}
      </div>
    );

    const tagElement = (option: SelectV2Option) => (
      <div
        key={String(getValueKey(getValue(option)))}
        className="el-select__selected-item"
      >
        <ElTag
          closable={!inputDisabled && !getDisabled(option)}
          size={collapseTagSize}
          type={tagType}
          effect={tagEffect}
          disableTransitions
          style={tagStyle}
          onClose={(event) => deleteTag(event, option)}
        >
          <span className="el-select__tags-text">
            {renderLabelContent(option)}
          </span>
        </ElTag>
      </div>
    );

    const collapseTooltipContent = (
      <div ref={tagMenuRef} className="el-select__selection">
        {collapseTagList.map((option) => (
          <div
            key={String(getValueKey(getValue(option)))}
            className="el-select__selected-item"
          >
            <ElTag
              className="in-tooltip"
              closable={!inputDisabled && !getDisabled(option)}
              size={collapseTagSize}
              type={tagType}
              effect={tagEffect}
              disableTransitions
              onClose={(event) => deleteTag(event, option)}
            >
              <span className="el-select__tags-text">
                {renderLabelContent(option)}
              </span>
            </ElTag>
          </div>
        ))}
      </div>
    );

    const collapseTooltip =
      props.collapseTags &&
      cachedOptions.length > (props.maxCollapseTags ?? 1) ? (
        <ElTooltip
          disabled={dropdownVisible || !props.collapseTagsTooltip}
          fallbackPlacements={
            props.tagTooltip?.fallbackPlacements ?? [
              "bottom",
              "top",
              "right",
              "left",
            ]
          }
          effect={props.tagTooltip?.effect ?? effect}
          placement={props.tagTooltip?.placement ?? "bottom"}
          popperClass={props.tagTooltip?.popperClass ?? popperClass}
          popperStyle={props.tagTooltip?.popperStyle ?? popperStyle}
          teleported={props.tagTooltip?.teleported ?? teleported}
          appendTo={props.tagTooltip?.appendTo ?? appendTo}
          showAfter={props.tagTooltip?.showAfter}
          hideAfter={props.tagTooltip?.hideAfter}
          autoClose={props.tagTooltip?.autoClose}
          offset={props.tagTooltip?.offset}
          content={collapseTooltipContent}
          triggerRef={setCollapseItemNode as unknown as Ref<HTMLElement>}
        >
          <div className="el-select__selected-item">
            <ElTag
              closable={false}
              size={collapseTagSize}
              type={tagType}
              effect={tagEffect}
              style={collapseTagStyle}
              disableTransitions
            >
              <span className="el-select__tags-text">
                + {cachedOptions.length - (props.maxCollapseTags ?? 1)}
              </span>
            </ElTag>
          </div>
        </ElTooltip>
      ) : null;

    const tags = tag ? (
      tag({
        data: cachedOptions,
        selectDisabled: inputDisabled,
        deleteTag,
      })
    ) : (
      <>
        {showTagList.map((option) => tagElement(option))}
        {collapseTooltip}
      </>
    );

    const renderedSuffixIcon =
      iconComponent === null ? null : (iconComponent ?? <ArrowDown />);

    const emptyContent =
      loadingSlot !== undefined && props.loading ? (
        <div className="el-select-dropdown__loading">{loadingSlot}</div>
      ) : props.loading || filteredOptions.length === 0 ? (
        <div className="el-select-dropdown__empty">
          {empty !== undefined ? empty : <span>{emptyText}</span>}
        </div>
      ) : undefined;

    const dropdown = (
      <SelectDropdown
        ref={menuRef}
        data={filteredOptions}
        width={popperSize - BORDER_HORIZONTAL_WIDTH}
        height={popupHeight}
        itemHeight={props.itemHeight ?? 34}
        estimatedOptionHeight={props.estimatedOptionHeight}
        hoveringIndex={api.hover}
        id={contentId}
        ariaLabel={ariaLabel}
        multiple={multiple}
        scrollbarAlwaysOn={props.scrollbarAlwaysOn}
        modelValue={modelValue}
        multipleLimit={multipleLimit}
        disabled={inputDisabled}
        valueKey={valueKey}
        getLabel={getLabel}
        getValue={getValue}
        getDisabled={getDisabled}
        renderOption={renderOption}
        header={header}
        footer={footer}
        empty={emptyContent}
        onSelect={(item: SelectV2OptionType) => onSelect(item)}
        onHover={onHover}
        onEndReached={onEndReached}
      />
    );

    return (
      <div
        ref={setRootNode}
        className={[
          "el-select",
          selectSize && `el-select--${selectSize}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
        onMouseEnter={() => setInputHovering(true)}
        onMouseLeave={() => setInputHovering(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <ElTooltip
          visible={dropdownVisible}
          teleported={teleported}
          popperClass={["el-select__popper", popperClass]
            .filter(Boolean)
            .join(" ")}
          popperStyle={popperStyle}
          fallbackPlacements={fallbackPlacements}
          effect={effect}
          placement={placement}
          pure
          trigger={[]}
          persistent={persistent}
          appendTo={appendTo}
          showArrow={showArrow}
          offset={offset}
          contentRef={popperRef}
          triggerRef={setWrapperNode as unknown as Ref<HTMLElement>}
          content={dropdown}
        >
          <div
            className={[
              "el-select__wrapper",
              isFocused && "is-focused",
              inputHovering && "is-hovering",
              props.filterable && "is-filterable",
              inputDisabled && "is-disabled",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={(event: ReactMouseEvent<HTMLDivElement>) => {
              event.preventDefault();
              toggleMenu(event);
            }}
          >
            {prefix !== undefined && prefix !== null && (
              <div className="el-select__prefix">{prefix}</div>
            )}

            <div
              ref={setSelectionNode}
              className={[
                "el-select__selection",
                multiple &&
                  prefix === undefined &&
                  Array.isArray(modelValue) &&
                  modelValue.length > 0 &&
                  "is-near",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {multiple && tags}

              {inputElement}

              {shouldShowPlaceholder && labelElement}
            </div>

            <div ref={suffixRef} className="el-select__suffix">
              {renderedSuffixIcon && (
                <ElIcon
                  className={[
                    "el-select__caret",
                    "el-select__icon",
                    iconReverse,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={showClearBtn ? { display: "none" } : undefined}
                >
                  {renderedSuffixIcon}
                </ElIcon>
              )}

              {showClearBtn && (
                <ElIcon
                  className="el-select__caret el-select__icon el-select__clear"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleClear();
                  }}
                >
                  {clearIcon ?? <CircleClose />}
                </ElIcon>
              )}

              {validateState && needStatusIcon && (
                <ElIcon
                  className={[
                    "el-input__validateIcon",
                    validateState === "validating" && "is-loading",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {validateState === "validating" ? (
                    <Loading />
                  ) : validateState === "success" ? (
                    <CircleCheck />
                  ) : (
                    <CircleClose />
                  )}
                </ElIcon>
              )}
            </div>
          </div>
        </ElTooltip>
      </div>
    );
  },
);

export default ElSelectV2;
