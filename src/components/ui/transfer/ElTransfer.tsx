"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElButton } from "../button/ElButton";
import { ElIcon } from "../icon/ElIcon";
import { ArrowLeft, ArrowRight } from "../icons";
import { useTranslator } from "../config-provider/context";
import { useFormItem } from "../form/use-form";
import { TransferPanel, type TransferPanelHandle } from "./TransferPanel";
import { DEFAULT_PROPS_ALIAS, keysSignature } from "./types";
import type {
  TransferDataItem,
  TransferDirection,
  TransferFormat,
  TransferKey,
  TransferPropsAlias,
} from "./types";

/** 官方 TransferInstance 暴露的能力，React 侧经 ref 访问。 */
export interface TransferHandle {
  /** 对应官方 clearQuery(which) */
  clearQuery: (which: TransferDirection) => void;
  /** 对应官方 leftPanel ref */
  leftPanel: React.RefObject<TransferPanelHandle | null>;
  /** 对应官方 rightPanel ref */
  rightPanel: React.RefObject<TransferPanelHandle | null>;
}

export interface TransferProps {
  /** 数据源 */
  data?: TransferDataItem[];
  /** 右侧列表的绑定值，对应官方 modelValue / v-model */
  value?: TransferKey[];
  /** 绑定值变化，对应官方 update:modelValue */
  onChange?: (
    value: TransferKey[],
    direction: TransferDirection,
    movedKeys: TransferKey[],
  ) => void;
  /** 自定义列表标题，对应官方 titles */
  titles?: [string, string] | string[];
  /** 自定义按钮文案，对应官方 button-texts */
  buttonTexts?: [string, string] | string[];
  /** 是否可搜索 */
  filterable?: boolean;
  /** 搜索框占位文本 */
  filterPlaceholder?: string;
  /** 自定义搜索方法 */
  filterMethod?: (query: string, item: TransferDataItem) => boolean;
  /** 数据项的渲染函数，对应官方 render-content */
  renderContent?: (option: TransferDataItem) => ReactNode;
  /** 头部勾选统计文案模板，对应官方 format */
  format?: TransferFormat;
  /** 数据源字段别名，对应官方 props（React 侧改名以避开 props 语义混淆） */
  optionProps?: TransferPropsAlias;
  /** 右侧列表的排序策略 */
  targetOrder?: "original" | "push" | "unshift";
  /** 左侧列表初始勾选项 */
  leftDefaultChecked?: TransferKey[];
  /** 右侧列表初始勾选项 */
  rightDefaultChecked?: TransferKey[];
  /** 左侧勾选变化 */
  onLeftCheckChange?: (value: TransferKey[], movedKeys?: TransferKey[]) => void;
  /** 右侧勾选变化 */
  onRightCheckChange?: (value: TransferKey[], movedKeys?: TransferKey[]) => void;
  /** 是否触发表单校验 */
  validateEvent?: boolean;
  /** 是否启用虚拟滚动 */
  virtualScroll?: boolean;
  /** 虚拟滚动的行高 */
  itemSize?: number;
  /** 数据项自定义渲染，对应官方默认作用域插槽 { option } */
  children?: (option: TransferDataItem) => ReactNode;
  /** 左侧面板底部内容，对应官方 left-footer 插槽 */
  leftFooter?: ReactNode;
  /** 右侧面板底部内容，对应官方 right-footer 插槽 */
  rightFooter?: ReactNode;
  /** 左侧面板空态内容，对应官方 left-empty 插槽 */
  leftEmpty?: ReactNode;
  /** 右侧面板空态内容，对应官方 right-empty 插槽 */
  rightEmpty?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 对应官方 ElTransfer。
 *
 * 双向绑定用 value + onChange；勾选态是组件内部状态（官方在 checkedState 里），
 * 移动时按官方 useMove 的三种 targetOrder 策略算出新的右侧列表顺序。
 */
export const ElTransfer = forwardRef<TransferHandle, TransferProps>(
  function ElTransfer(
    {
      data = [],
      value = [],
      onChange,
      titles = [],
      buttonTexts = [],
      filterable = false,
      filterPlaceholder,
      filterMethod,
      renderContent,
      format = {},
      optionProps: propsAlias,
      targetOrder = "original",
      leftDefaultChecked = [],
      rightDefaultChecked = [],
      onLeftCheckChange,
      onRightCheckChange,
      validateEvent = true,
      virtualScroll = false,
      itemSize = 30,
      children,
      leftFooter,
      rightFooter,
      leftEmpty,
      rightEmpty,
      className,
      style,
    },
    ref,
  ) {
    const t = useTranslator();
    const alias = { ...DEFAULT_PROPS_ALIAS, ...propsAlias };
    const { formItem } = useFormItem();

    const leftPanel = useRef<TransferPanelHandle | null>(null);
    const rightPanel = useRef<TransferPanelHandle | null>(null);

    const [checkedState, setCheckedState] = useState<{
      leftChecked: TransferKey[];
      rightChecked: TransferKey[];
    }>({ leftChecked: [], rightChecked: [] });

    const keyOf = (item: TransferDataItem): TransferKey => item[alias.key];

    // 官方 useComputedData，按别名取 key 建索引
    const dataObj = useMemo(
      () =>
        data.reduce<Record<string, TransferDataItem>>(
          (acc, item) => ((acc[keyOf(item)] = item), acc),
          {},
        ),
      // keyOf 依赖 alias，alias 每次渲染都是新对象，故以 data 与别名字段为依赖
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [data, alias.key],
    );

    const sourceData = data.filter((item) => !value.includes(keyOf(item)));

    const targetData = (() => {
      if (targetOrder === "original") {
        return data.filter((item) => value.includes(keyOf(item)));
      }
      return value.reduce<TransferDataItem[]>((arr, key) => {
        const item = dataObj[key];
        if (item) arr.push(item);
        return arr;
      }, []);
    })();

    // --- 移动逻辑，逐条对应官方 useMove ---

    const emitChange = (
      next: TransferKey[],
      direction: TransferDirection,
      movedKeys: TransferKey[],
    ) => {
      onChange?.(next, direction, movedKeys);
    };

    const addToLeft = () => {
      const currentValue = value.slice();
      checkedState.rightChecked.forEach((key) => {
        const index = currentValue.indexOf(key);
        if (index > -1) currentValue.splice(index, 1);
      });
      emitChange(currentValue, "left", checkedState.rightChecked);
    };

    const addToRight = () => {
      let currentValue = value.slice();

      const itemsToBeMoved = data
        .filter((item) => {
          const itemKey = keyOf(item);
          return (
            checkedState.leftChecked.includes(itemKey) &&
            !value.includes(itemKey)
          );
        })
        .map(keyOf);

      currentValue =
        targetOrder === "unshift"
          ? itemsToBeMoved.concat(currentValue)
          : currentValue.concat(itemsToBeMoved);

      if (targetOrder === "original") {
        currentValue = data
          .filter((item) => currentValue.includes(keyOf(item)))
          .map(keyOf);
      }

      emitChange(currentValue, "right", checkedState.leftChecked);
    };

    // --- 勾选变化，对应官方 useCheckedChange ---

    const handleSourceCheckedChange = (
      checked: TransferKey[],
      movedKeys?: TransferKey[],
    ) => {
      setCheckedState((prev) => ({ ...prev, leftChecked: checked }));
      if (!movedKeys) return;
      onLeftCheckChange?.(checked, movedKeys);
    };

    const handleTargetCheckedChange = (
      checked: TransferKey[],
      movedKeys?: TransferKey[],
    ) => {
      setCheckedState((prev) => ({ ...prev, rightChecked: checked }));
      if (!movedKeys) return;
      onRightCheckChange?.(checked, movedKeys);
    };

    const hasButtonTexts = buttonTexts.length === 2;
    const leftPanelTitle = titles[0] || t("el.transfer.titles.0");
    const rightPanelTitle = titles[1] || t("el.transfer.titles.1");
    const panelFilterPlaceholder =
      filterPlaceholder || t("el.transfer.filterPlaceholder");

    // 对应官方 watch(modelValue) 里的 formItem.validate('change')
    const valueSignature = keysSignature(value);
    useEffect(() => {
      if (!validateEvent) return;
      formItem?.validate?.("change").catch(() => {});
      // valueSignature 已经概括了 value 的内容
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueSignature, validateEvent]);

    const optionRender = (option: TransferDataItem): ReactNode => {
      if (renderContent) return renderContent(option);
      if (children) {
        const content = children(option);
        // 官方默认插槽没有有效节点时回退到 label/key 文本
        if (content !== null && content !== undefined) return content;
      }
      return <span>{option[alias.label] || option[alias.key]}</span>;
    };

    useImperativeHandle(
      ref,
      () => ({
        clearQuery: (which: TransferDirection) => {
          if (which === "left") leftPanel.current?.setQuery("");
          else rightPanel.current?.setQuery("");
        },
        leftPanel,
        rightPanel,
      }),
      [],
    );

    const buttonClasses = ["el-transfer__button", hasButtonTexts && "is-with-texts"]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={["el-transfer", className].filter(Boolean).join(" ")}
        style={style}
      >
        <TransferPanel
          data={sourceData}
          optionRender={optionRender}
          placeholder={panelFilterPlaceholder}
          title={leftPanelTitle}
          filterable={filterable}
          format={format}
          filterMethod={filterMethod}
          defaultChecked={leftDefaultChecked}
          optionProps={alias}
          virtualScroll={virtualScroll}
          itemSize={itemSize}
          onCheckedChange={handleSourceCheckedChange}
          emptyNode={leftEmpty}
          footer={leftFooter}
          instanceRef={leftPanel}
        />

        <div className="el-transfer__buttons">
          <ElButton
            type="primary"
            className={buttonClasses}
            disabled={checkedState.rightChecked.length === 0}
            onClick={addToLeft}
          >
            <ElIcon>
              <ArrowLeft />
            </ElIcon>
            {buttonTexts[0] !== undefined && <span>{buttonTexts[0]}</span>}
          </ElButton>
          <ElButton
            type="primary"
            className={buttonClasses}
            disabled={checkedState.leftChecked.length === 0}
            onClick={addToRight}
          >
            {buttonTexts[1] !== undefined && <span>{buttonTexts[1]}</span>}
            <ElIcon>
              <ArrowRight />
            </ElIcon>
          </ElButton>
        </div>

        <TransferPanel
          data={targetData}
          optionRender={optionRender}
          placeholder={panelFilterPlaceholder}
          title={rightPanelTitle}
          filterable={filterable}
          format={format}
          filterMethod={filterMethod}
          defaultChecked={rightDefaultChecked}
          optionProps={alias}
          virtualScroll={virtualScroll}
          itemSize={itemSize}
          onCheckedChange={handleTargetCheckedChange}
          emptyNode={rightEmpty}
          footer={rightFooter}
          instanceRef={rightPanel}
        />
      </div>
    );
  },
);
