"use client";

import { useState } from "react";
import "@/components/element-plus/cascader/cascader-menu.module.css";

import { ElButton } from "@/components/element-plus/button";
import { ElCascader } from "@/components/element-plus/cascader";
import { ElCascaderPanel } from "@/components/element-plus/cascader-panel";
import { ElCheckbox } from "@/components/element-plus/checkbox";
import { CloseBold } from "@/components/element-plus/generated/icons";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElTag } from "@/components/element-plus/tag";
import type { Tag } from "@/components/element-plus/cascader-panel";
import type { CascaderOption, CascaderValue } from "@/components/element-plus/cascader-panel";

const stack = { display: "block" } as const;
const section = { margin: "16px" } as const;
const demoParagraph = { margin: "0 0 16px" } as const;
const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  alignItems: "center",
} as const;
const checkStack = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
} as const;
const sectionRow = {
  display: "flex",
  flexWrap: "wrap",
} as const;

const OPTIONS: CascaderOption[] = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          { value: "consistency", label: "Consistency" },
          { value: "feedback", label: "Feedback" },
          { value: "efficiency", label: "Efficiency" },
          { value: "controllability", label: "Controllability" },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          { value: "side nav", label: "Side Navigation" },
          { value: "top nav", label: "Top Navigation" },
        ],
      },
    ],
  },
  {
    value: "component",
    label: "Component",
    children: [
      {
        value: "basic",
        label: "Basic",
        children: [
          { value: "layout", label: "Layout" },
          { value: "color", label: "Color" },
          { value: "typography", label: "Typography" },
          { value: "icon", label: "Icon" },
          { value: "button", label: "Button" },
        ],
      },
      {
        value: "form",
        label: "Form",
        children: [
          { value: "radio", label: "Radio" },
          { value: "checkbox", label: "Checkbox" },
          { value: "input", label: "Input" },
          { value: "input-number", label: "InputNumber" },
          { value: "select", label: "Select" },
          { value: "cascader", label: "Cascader" },
          { value: "switch", label: "Switch" },
          { value: "slider", label: "Slider" },
          { value: "time-picker", label: "TimePicker" },
          { value: "date-picker", label: "DatePicker" },
          { value: "datetime-picker", label: "DateTimePicker" },
          { value: "upload", label: "Upload" },
          { value: "rate", label: "Rate" },
          { value: "form", label: "Form" },
        ],
      },
      {
        value: "data",
        label: "Data",
        children: [
          { value: "table", label: "Table" },
          { value: "tag", label: "Tag" },
          { value: "progress", label: "Progress" },
          { value: "tree", label: "Tree" },
          { value: "pagination", label: "Pagination" },
          { value: "badge", label: "Badge" },
        ],
      },
      {
        value: "notice",
        label: "Notice",
        children: [
          { value: "alert", label: "Alert" },
          { value: "loading", label: "Loading" },
          { value: "message", label: "Message" },
          { value: "message-box", label: "MessageBox" },
          { value: "notification", label: "Notification" },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          { value: "menu", label: "Menu" },
          { value: "tabs", label: "Tabs" },
          { value: "breadcrumb", label: "Breadcrumb" },
          { value: "dropdown", label: "Dropdown" },
          { value: "steps", label: "Steps" },
        ],
      },
      {
        value: "others",
        label: "Others",
        children: [
          { value: "dialog", label: "Dialog" },
          { value: "tooltip", label: "Tooltip" },
          { value: "popover", label: "Popover" },
          { value: "card", label: "Card" },
          { value: "carousel", label: "Carousel" },
          { value: "collapse", label: "Collapse" },
        ],
      },
    ],
  },
  {
    value: "resource",
    label: "Resource",
    children: [
      { value: "axure", label: "Axure Components" },
      { value: "sketch", label: "Sketch Templates" },
      { value: "docs", label: "Design Documentation" },
    ],
  },
];

const DISABLED_OPTIONS: CascaderOption[] = [
  {
    value: "guide",
    label: "Guide",
    disabled: true,
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          { value: "consistency", label: "Consistency" },
          { value: "feedback", label: "Feedback" },
          { value: "efficiency", label: "Efficiency" },
          { value: "controllability", label: "Controllability" },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          { value: "side nav", label: "Side Navigation" },
          { value: "top nav", label: "Top Navigation" },
        ],
      },
    ],
  },
  ...OPTIONS.slice(1),
];

export function CascaderBasic() {
  const [value, setValue] = useState<CascaderValue>([]);

  return (
    <div style={stack}>
      <div style={section}>
        <p style={demoParagraph}>Child options expand when clicked (default)</p>
        <ElCascader value={value} options={OPTIONS} onChange={setValue} />
      </div>
      <div style={section}>
        <p style={demoParagraph}>Child options expand when hovered</p>
        <ElCascader
          value={value}
          options={OPTIONS}
          props={{ expandTrigger: "hover" }}
          onChange={setValue}
        />
      </div>
    </div>
  );
}

export function CascaderOptionDisabling() {
  return (
    <div style={stack}>
      <ElCascader options={DISABLED_OPTIONS} />
    </div>
  );
}

export function CascaderClearable() {
  const [value, setValue] = useState<CascaderValue>([]);

  return (
    <div style={stack}>
      <ElCascader
        value={value}
        options={OPTIONS}
        clearable
        onChange={setValue}
      />
    </div>
  );
}

export function CascaderClearIcon() {
  const [value, setValue] = useState<CascaderValue>([]);

  return (
    <div style={stack}>
      <ElCascader
        value={value}
        options={OPTIONS}
        clearable
        clearIcon={<CloseBold />}
        placeholder="Custom clear icon"
        onChange={setValue}
      />
    </div>
  );
}

export function CascaderMultipleSelection() {
  return (
    <div style={stack}>
      <div style={section}>
        <p style={demoParagraph}>Display all tags (default)</p>
        <ElCascader options={OPTIONS} props={{ multiple: true }} clearable />
      </div>
      <div style={section}>
        <p style={demoParagraph}>Collapse tags</p>
        <ElCascader
          options={OPTIONS}
          props={{ multiple: true }}
          collapseTags
          clearable
        />
      </div>
      <div style={section}>
        <p style={demoParagraph}>Collapse tags tooltip</p>
        <ElCascader
          options={OPTIONS}
          props={{ multiple: true }}
          collapseTags
          collapseTagsTooltip
          clearable
        />
      </div>
      <div style={section}>
        <p style={demoParagraph}>Max Collapse Tags</p>
        <ElCascader
          options={OPTIONS}
          props={{ multiple: true }}
          collapseTags
          collapseTagsTooltip
          maxCollapseTags={3}
          clearable
        />
      </div>
    </div>
  );
}

export function CascaderLastLevel() {
  const [value, setValue] = useState<CascaderValue>([]);

  return (
    <div style={stack}>
      <ElCascader
        value={value}
        options={OPTIONS}
        showAllLevels={false}
        onChange={setValue}
      />
    </div>
  );
}

export function CascaderAnyLevel() {
  return (
    <div style={stack}>
      <div style={section}>
        <p style={demoParagraph}>Select any level of options (Single selection)</p>
        <ElCascader
          options={OPTIONS}
          props={{ checkStrictly: true }}
          clearable
        />
      </div>
      <div style={section}>
        <p style={demoParagraph}>Select any level of options (Multiple selection)</p>
        <ElCascader
          options={OPTIONS}
          props={{ multiple: true, checkStrictly: true }}
          clearable
        />
      </div>
    </div>
  );
}

let lazyId = 0;

const LAZY_PROPS = {
  lazy: true,
  lazyLoad(
    node: { level: number },
    resolve: (nodes: CascaderOption[]) => void,
  ) {
    const { level } = node;
    window.setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map(() => {
        lazyId += 1;
        return {
          value: lazyId,
          label: `Option - ${lazyId}`,
          leaf: level >= 2,
        };
      });
      resolve(nodes);
    }, 1000);
  },
};

export function CascaderDynamicLoading() {
  return (
    <div style={stack}>
      <ElCascader props={LAZY_PROPS} />
    </div>
  );
}

export function CascaderFilterable() {
  return (
    <div style={stack}>
      <div style={section}>
        <p style={demoParagraph}>Filterable (Single selection)</p>
        <ElCascader
          placeholder="Try searchingL Guide"
          options={OPTIONS}
          filterable
        />
      </div>
      <div style={section}>
        <p style={demoParagraph}>Filterable (Multiple selection)</p>
        <ElCascader
          placeholder="Try searchingL Guide"
          options={OPTIONS}
          props={{ multiple: true }}
          filterable
        />
      </div>
    </div>
  );
}

export function CascaderCustomContent() {
  return (
    <div style={stack}>
      <ElCascader
        options={OPTIONS}
        renderLabel={({ node, data }) => (
          <span>
            {data.label}
            {!node.isLeaf ? ` (${data.children?.length})` : ""}
          </span>
        )}
      />
    </div>
  );
}

const TAG_OPTIONS: CascaderOption[] = [
  {
    value: 1,
    label: "Asia",
    children: [
      {
        value: 2,
        label: "China",
        children: [
          { value: 3, label: "Beijing" },
          { value: 4, label: "Shanghai" },
          { value: 5, label: "Hangzhou" },
        ],
      },
      {
        value: 6,
        label: "Japan",
        children: [
          { value: 7, label: "Tokyo" },
          { value: 8, label: "Osaka" },
          { value: 9, label: "Kyoto" },
        ],
      },
      {
        value: 10,
        label: "Korea",
        children: [
          { value: 11, label: "Seoul" },
          { value: 12, label: "Busan" },
          { value: 13, label: "Taegu" },
        ],
      },
    ],
  },
  {
    value: 14,
    label: "Europe",
    children: [
      {
        value: 15,
        label: "France",
        children: [
          { value: 16, label: "Paris" },
          { value: 17, label: "Marseille" },
          { value: 18, label: "Lyon" },
        ],
      },
      {
        value: 19,
        label: "UK",
        children: [
          { value: 20, label: "London" },
          { value: 21, label: "Birmingham" },
          { value: 22, label: "Manchester" },
        ],
      },
    ],
  },
  {
    value: 23,
    label: "North America",
    children: [
      {
        value: 24,
        label: "US",
        children: [
          { value: 25, label: "New York" },
          { value: 26, label: "Los Angeles" },
          { value: 27, label: "Washington" },
        ],
      },
      {
        value: 28,
        label: "Canada",
        children: [
          { value: 29, label: "Toronto" },
          { value: 30, label: "Montreal" },
          { value: 31, label: "Ottawa" },
        ],
      },
    ],
  },
];

function getTopLevelLabels(data: Tag[]) {
  const set = new Set<string>();
  for (const item of data) {
    let parent = item.node?.parent;
    while (parent && parent.level !== 1) parent = parent.parent;
    const label = parent?.data.label as string | undefined;
    if (label) set.add(label);
  }
  return [...set];
}

export function CascaderCustomTag() {
  return (
    <div style={section}>
      <p style={demoParagraph}>Using slots allows for more flexible control over the display.</p>
      <ElCascader
        options={TAG_OPTIONS}
        props={{ multiple: true }}
        clearable
        renderTag={({ data }) => (
          <>
            {data.map((item, index) => (
              <ElTag key={item.key} color={index % 2 === 0 ? "#FFDE0A" : ""}>
                {item.text}
              </ElTag>
            ))}
          </>
        )}
      />
      <p style={{ margin: "16px 0" }}>Display top-level tags only</p>
      <ElCascader
        options={TAG_OPTIONS}
        props={{ multiple: true }}
        clearable
        renderTag={({ data }) => (
          <>
            {getTopLevelLabels(data).map((label) => (
              <ElTag key={label}>{label}</ElTag>
            ))}
          </>
        )}
      />
    </div>
  );
}

export function CascaderCustomSuggestionItem() {
  return (
    <div style={stack}>
      <ElCascader
        options={OPTIONS}
        filterable
        placeholder="Try searching: Guide"
        renderSuggestionItem={({ item }) => (
          <span>🔍 {item.pathLabels.join(" > ")}</span>
        )}
      />
    </div>
  );
}

export function CascaderPanelDemo() {
  return (
    <div style={stack}>
      <ElCascaderPanel options={OPTIONS} />
    </div>
  );
}

const STRATEGY_OPTIONS: CascaderOption[] = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [{ value: "consistency", label: "Consistency" }],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [{ value: "side nav", label: "Side Navigation" }],
      },
    ],
  },
  {
    value: "component",
    label: "Component",
    children: [
      {
        value: "basic",
        label: "Basic",
        children: [{ value: "layout", label: "Layout" }],
      },
      {
        value: "form",
        label: "Form",
        children: [{ value: "radio", label: "Radio" }],
      },
    ],
  },
  {
    value: "resource",
    label: "Resource",
    children: [{ value: "axure", label: "Axure Components" }],
  },
];

export function CascaderShowCheckedStrategy() {
  const [value1, setValue1] = useState<CascaderValue>([]);
  const [value2, setValue2] = useState<CascaderValue>([]);

  return (
    <div style={stack}>
      <div style={section}>
        <p style={demoParagraph}>Strategy: child (default, show all selected child nodes)</p>
        <ElCascader
          value={value1}
          options={STRATEGY_OPTIONS}
          props={{ multiple: true }}
          showCheckedStrategy="child"
          clearable
          onChange={setValue1}
        />
      </div>
      <div style={section}>
        <p style={demoParagraph}>
          Strategy: parent (show only parent nodes when all children are
          selected)
        </p>
        <ElCascader
          value={value2}
          options={STRATEGY_OPTIONS}
          props={{ multiple: true }}
          showCheckedStrategy="parent"
          clearable
          onChange={setValue2}
        />
      </div>
    </div>
  );
}

export function CascaderCheckOnClickNode() {
  const [showPrefix, setShowPrefix] = useState(true);
  const [value, setValue] = useState<CascaderValue>();
  const [value2, setValue2] = useState<CascaderValue>();

  return (
    <div style={checkStack}>
      <ElSwitch
        checked={showPrefix}
        activeText="show prefix"
        inactiveText="hide prefix"
        onCheckedChange={setShowPrefix}
      />
      <div style={sectionRow}>
        <div style={section}>
          <p style={demoParagraph}>checkStrictly | Single mode</p>
          <ElCascader
            value={value}
            options={OPTIONS}
            props={{
              showPrefix,
              checkStrictly: true,
              checkOnClickNode: true,
            }}
            clearable
            onChange={setValue}
          />
        </div>
        <div style={section}>
          <p style={demoParagraph}>Multiple mode</p>
          <ElCascader
            value={value2}
            options={OPTIONS}
            showCheckedStrategy="parent"
            props={{ showPrefix, multiple: true, checkOnClickNode: true }}
            clearable
            onChange={setValue2}
          />
        </div>
      </div>
    </div>
  );
}

const HEADER_FOOTER_OPTIONS: CascaderOption[] = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          { value: "consistency", label: "Consistency" },
          { value: "feedback", label: "Feedback" },
          { value: "efficiency", label: "Efficiency" },
          { value: "controllability", label: "Controllability" },
        ],
      },
    ],
  },
];

const ALL_VALUE_PATHS = [
  ["guide", "disciplines", "consistency"],
  ["guide", "disciplines", "feedback"],
  ["guide", "disciplines", "efficiency"],
  ["guide", "disciplines", "controllability"],
];

export function CascaderCustomHeaderFooter() {
  const [value, setValue] = useState<CascaderValue>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const handleChange = (next: CascaderValue) => {
    setValue(next);
    const length = Array.isArray(next) ? next.length : 0;
    setCheckAll(length === ALL_VALUE_PATHS.length);
    setIndeterminate(length > 0 && length < ALL_VALUE_PATHS.length);
  };

  const handleCheckAll = (checked: boolean) => {
    setIndeterminate(false);
    setCheckAll(checked);
    setValue(checked ? ALL_VALUE_PATHS : []);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, textAlign: "center" }}>
        <p style={demoParagraph}>Custom header content</p>
        <ElCascader
          value={value}
          popperClass="cascader-custom-header"
          options={HEADER_FOOTER_OPTIONS}
          props={{ multiple: true }}
          clearable
          header={
            <ElCheckbox
              checked={checkAll}
              indeterminate={indeterminate}
              onCheckedChange={handleCheckAll}
            >
              All
            </ElCheckbox>
          }
          onChange={handleChange}
        />
      </div>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          borderLeft: "1px solid var(--el-border-color)",
        }}
      >
        <p style={demoParagraph}>Custom footer content</p>
        <ElCascader
          value={value}
          options={HEADER_FOOTER_OPTIONS}
          props={{ multiple: true }}
          clearable
          footer={
            <ElButton link size="small" onClick={() => setValue([])}>
              Clear
            </ElButton>
          }
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

interface LargeOption {
  value: string;
  label: string;
  children?: LargeOption[];
}

function generateOptions(count: number): CascaderOption[] {
  return Array.from({ length: count }).map((_, index) => ({
    value: `option-${index}`,
    label: `Option ${index + 1}`,
    children: [
      {
        value: `child-${index}-1`,
        label: `Child ${index + 1}-1`,
        children: [
          {
            value: `grandchild-${index}-1-1`,
            label: `Grandchild ${index + 1}-1-1`,
          },
          {
            value: `grandchild-${index}-1-2`,
            label: `Grandchild ${index + 1}-1-2`,
          },
        ],
      },
      {
        value: `child-${index}-2`,
        label: `Child ${index + 1}-2`,
      },
    ],
  })) as LargeOption[] as CascaderOption[];
}

const LARGE_OPTIONS = generateOptions(20000);

const largeFilterMethod = (
  node: { text: string },
  keyword: string,
) => node.text.toLowerCase().includes(keyword.toLowerCase());

export function CascaderVirtualScroll() {
  const [value, setValue] = useState<CascaderValue>([]);

  return (
    <div style={stack}>
      <ElCascader
        value={value}
        options={LARGE_OPTIONS}
        filterMethod={largeFilterMethod}
        filterable
        virtualScroll
        clearable
        placeholder="Select with large data"
        onChange={setValue}
      />
    </div>
  );
}

export function CascaderFitInputWidth() {
  const [value, setValue] = useState<CascaderValue>([]);

  return (
    <div style={row}>
      <ElCascader
        value={value}
        options={OPTIONS}
        placeholder="Default expanding panel"
        filterable
        onChange={setValue}
      />
      <ElCascader
        value={value}
        options={OPTIONS}
        placeholder="Fit input width"
        filterable
        fitInputWidth
        onChange={setValue}
      />
      <ElCascader
        value={value}
        options={OPTIONS}
        placeholder="Fixed width (400px)"
        filterable
        fitInputWidth={400}
        onChange={setValue}
        renderSuggestionItem={({ item }) => (
          <div>{item.text} (Custom content that is very long)</div>
        )}
      />
    </div>
  );
}
