"use client";

import { useState, type CSSProperties } from "react";
import { ElTransfer } from "@/components/element-plus/transfer";
import { ElButton } from "@/components/element-plus/button";
import { ElEmpty } from "@/components/element-plus/empty";
import type {
  TransferDataItem,
  TransferDirection,
  TransferKey,
} from "@/components/element-plus/transfer";

interface Option {
  key: number;
  label: string;
  disabled?: boolean;
}

/** 官方 basic / customizable / empty-content 共用的 15 条数据生成器。 */
function generateData(count = 15, disabledEvery = 4): Option[] {
  const data: Option[] = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: disabledEvery > 0 && i % disabledEvery === 0,
    });
  }
  return data;
}

/** 官方示例里 el-transfer 的 text-align 覆盖，等价于 style="text-align: left; display: inline-block"。 */
const transferStyle: CSSProperties = {
  textAlign: "left",
  display: "inline-block",
};

const centered: CSSProperties = { textAlign: "center", margin: "0 0 20px" };

export function TransferBasic() {
  const [value, setValue] = useState<TransferKey[]>([]);

  return (
    <ElTransfer
      value={value}
      onChange={(next) => setValue(next)}
      data={generateData()}
    />
  );
}

export function TransferFilterable() {
  const [value, setValue] = useState<TransferKey[]>([]);

  const data: TransferDataItem[] = [
    "California",
    "Illinois",
    "Maryland",
    "Texas",
    "Florida",
    "Colorado",
    "Connecticut ",
  ].map((city, index) => ({
    label: city,
    key: index,
    initial: ["CA", "IL", "MD", "TX", "FL", "CO", "CT"][index],
  }));

  return (
    <ElTransfer
      value={value}
      onChange={(next) => setValue(next)}
      filterable
      filterMethod={(query, item) =>
        String(item.initial).toLowerCase().includes(query.toLowerCase())
      }
      filterPlaceholder="State Abbreviations"
      data={data}
    />
  );
}

export function TransferCustomizable() {
  const data = generateData();
  // 两组的初始右侧列表都含 key 1，与官方示例一致
  const [leftValue, setLeftValue] = useState<TransferKey[]>([1]);
  const [rightValue, setRightValue] = useState<TransferKey[]>([1]);

  const format = {
    noChecked: "${total}",
    hasChecked: "${checked}/${total}",
  };

  const handleChange = (
    value: TransferKey[],
    direction: TransferDirection,
    movedKeys: TransferKey[],
  ) => {
    console.log(value, direction, movedKeys);
  };

  const footer = (
    <ElButton
      className="transfer-footer"
      size="small"
      style={{ marginLeft: 15, padding: "6px 5px" }}
    >
      Operation
    </ElButton>
  );

  return (
    <>
      <p style={centered}>Customize data items using render-content</p>
      <div style={{ textAlign: "center" }}>
        <ElTransfer
          value={leftValue}
          onChange={(next, direction, movedKeys) => {
            setLeftValue(next);
            handleChange(next, direction, movedKeys);
          }}
          style={transferStyle}
          filterable
          leftDefaultChecked={[2, 3]}
          rightDefaultChecked={[1]}
          renderContent={(option) => <span>{option.label}</span>}
          titles={["Source", "Target"]}
          buttonTexts={["To left", "To right"]}
          format={format}
          data={data}
          leftFooter={footer}
          rightFooter={footer}
        />

        <p style={{ ...centered, margin: "50px 0 20px" }}>
          Customize data items using scoped slot
        </p>

        <div style={{ textAlign: "center" }}>
          <ElTransfer
            value={rightValue}
            onChange={(next, direction, movedKeys) => {
              setRightValue(next);
              handleChange(next, direction, movedKeys);
            }}
            style={transferStyle}
            filterable
            leftDefaultChecked={[2, 3]}
            rightDefaultChecked={[1]}
            titles={["Source", "Target"]}
            buttonTexts={["To left", "To right"]}
            format={format}
            data={data}
            leftFooter={footer}
            rightFooter={footer}
          >
            {(option) => (
              <span>
                {option.key} - {option.label}
              </span>
            )}
          </ElTransfer>
        </div>
      </div>
    </>
  );
}

export function TransferEmptyContent() {
  const [value, setValue] = useState<TransferKey[]>([]);

  const empty = <ElEmpty imageSize={60} description="No data" />;

  return (
    <ElTransfer
      value={value}
      onChange={(next) => setValue(next)}
      data={generateData()}
      leftEmpty={empty}
      rightEmpty={empty}
    />
  );
}

export function TransferPropAlias() {
  const [value, setValue] = useState<TransferKey[]>([]);

  // 数据项没有 key / label，改用 value / desc，经 optionProps 声明别名
  const data = generateData().map((item) => ({
    value: item.key,
    desc: item.label,
    disabled: item.disabled,
  }));

  return (
    <ElTransfer
      value={value}
      onChange={(next) => setValue(next)}
      optionProps={{ key: "value", label: "desc" }}
      data={data}
    />
  );
}

export function TransferVirtualScroll() {
  const [value, setValue] = useState<TransferKey[]>([]);

  return (
    <ElTransfer
      value={value}
      onChange={(next) => setValue(next)}
      data={generateData(2000)}
      virtualScroll
      itemSize={30}
    />
  );
}
