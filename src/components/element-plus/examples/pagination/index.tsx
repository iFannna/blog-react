"use client";

import { useState } from "react";
import { ElPagination } from "@/components/element-plus/pagination";
import { ElRadio } from "@/components/element-plus/radio/ElRadio";
import { ElRadioGroup } from "@/components/element-plus/radio/ElRadioGroup";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElConfigProvider, en } from "@/components/element-plus/config-provider";

type DemoSize = "large" | "default" | "small";

const block = { marginTop: 10 } as const;
const demonstration = { marginBottom: 16 } as const;
const row = { display: "flex", alignItems: "center", marginBottom: 16 } as const;
const divider = {
  margin: "16px 0",
  border: "none",
  borderTop: "1px solid var(--el-border-color-lighter)",
} as const;

export function PaginationBasic() {
  return (
    <ElConfigProvider locale={en}>
      <div>
        <div style={demonstration}>When you have few pages</div>
        <ElPagination layout="prev, pager, next" total={50} />
      </div>
      <div style={block}>
        <div style={demonstration}>When you have more than 7 pages</div>
        <ElPagination layout="prev, pager, next" total={1000} />
      </div>
    </ElConfigProvider>
  );
}

export function PaginationMore() {
  const [size, setSize] = useState<DemoSize>("default");
  const [background, setBackground] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [currentPage1, setCurrentPage1] = useState(5);
  const [currentPage2, setCurrentPage2] = useState(5);
  const [pageSize2, setPageSize2] = useState(100);
  const [currentPage3, setCurrentPage3] = useState(5);
  const [pageSize3, setPageSize3] = useState(100);
  const [currentPage4, setCurrentPage4] = useState(4);
  const [pageSize4, setPageSize4] = useState(100);

  return (
    <ElConfigProvider locale={en}>
      <div className="flex items-center mb-4" style={row}>
        <ElRadioGroup
          type="button"
          value={size}
          onChange={(value) => setSize(value as DemoSize)}
          className="mr-4"
          style={{ marginRight: 12 }}
        >
          <ElRadio value="default" label="default" />
          <ElRadio value="large" label="large" />
          <ElRadio value="small" label="small" />
        </ElRadioGroup>
        <div>
          background:
          <ElSwitch
            checked={background}
            onCheckedChange={setBackground}
            className="ml-2"
            style={{ marginLeft: 8 }}
          />
        </div>
        <div className="ml-4" style={{ marginLeft: 16 }}>
          disabled:
          <ElSwitch
            checked={disabled}
            onCheckedChange={setDisabled}
            className="ml-2"
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>

      <hr className="my-4" style={divider} />

      <div>
        <div style={demonstration}>Total item count</div>
        <ElPagination
          currentPage={currentPage1}
          onCurrentPageChange={setCurrentPage1}
          pageSize={100}
          size={size}
          disabled={disabled}
          background={background}
          layout="total, prev, pager, next"
          total={1000}
        />
      </div>

      <div style={block}>
        <div style={demonstration}>Change page size</div>
        <ElPagination
          currentPage={currentPage2}
          onCurrentPageChange={setCurrentPage2}
          pageSize={pageSize2}
          onPageSizeChange={setPageSize2}
          pageSizes={[100, 200, 300, 400]}
          size={size}
          disabled={disabled}
          background={background}
          layout="sizes, prev, pager, next"
          total={1000}
        />
      </div>

      <div style={block}>
        <div style={demonstration}>Jump to</div>
        <ElPagination
          currentPage={currentPage3}
          onCurrentPageChange={setCurrentPage3}
          pageSize={pageSize3}
          onPageSizeChange={setPageSize3}
          size={size}
          disabled={disabled}
          background={background}
          layout="prev, pager, next, jumper"
          total={1000}
        />
      </div>

      <div style={block}>
        <div style={demonstration}>All combined</div>
        <ElPagination
          currentPage={currentPage4}
          onCurrentPageChange={setCurrentPage4}
          pageSize={pageSize4}
          onPageSizeChange={setPageSize4}
          pageSizes={[100, 200, 300, 400]}
          size={size}
          disabled={disabled}
          background={background}
          layout="total, sizes, prev, pager, next, jumper"
          total={400}
        />
      </div>
    </ElConfigProvider>
  );
}

export function PaginationPagerCount() {
  return (
    <ElConfigProvider locale={en}>
      <ElPagination
        pageSize={20}
        pagerCount={11}
        layout="prev, pager, next"
        total={1000}
      />
    </ElConfigProvider>
  );
}

export function PaginationBackground() {
  return (
    <ElConfigProvider locale={en}>
      <ElPagination background layout="prev, pager, next" total={1000} />
    </ElConfigProvider>
  );
}

export function PaginationSmall() {
  return (
    <ElConfigProvider locale={en}>
      <ElPagination size="small" layout="prev, pager, next" total={50} />
      <ElPagination
        size="small"
        background
        layout="prev, pager, next"
        total={50}
        style={{ marginTop: 16 }}
      />
    </ElConfigProvider>
  );
}

export function PaginationHideOnSinglePage() {
  const [value, setValue] = useState(false);

  return (
    <ElConfigProvider locale={en}>
      <div>
        <ElSwitch checked={value} onCheckedChange={setValue} />
        <hr style={divider} />
        <ElPagination
          hideOnSinglePage={value}
          total={5}
          layout="prev, pager, next"
        />
      </div>
    </ElConfigProvider>
  );
}
