"use client";

import { ElButton } from "@/components/element-plus/button";
import { Search } from "@/components/element-plus/icons";
import { flexRow, flexRowLast } from "./styles";

export default function ButtonSize() {
  return (
    <>
      <div className={flexRow}>
        <ElButton size="large">Large</ElButton>
        <ElButton>Default</ElButton>
        <ElButton size="small">Small</ElButton>
        <ElButton size="large" icon={<Search />}>
          Search
        </ElButton>
        <ElButton icon={<Search />}>Search</ElButton>
        <ElButton size="small" icon={<Search />}>
          Search
        </ElButton>
      </div>

      <div className={flexRow}>
        <ElButton size="large" round>Large</ElButton>
        <ElButton round>Default</ElButton>
        <ElButton size="small" round>Small</ElButton>
        <ElButton size="large" icon={<Search />} round>
          Search
        </ElButton>
        <ElButton icon={<Search />} round>
          Search
        </ElButton>
        <ElButton size="small" icon={<Search />} round>
          Search
        </ElButton>
      </div>

      <div className={flexRowLast}>
        <ElButton icon={<Search />} size="large" circle aria-label="search" />
        <ElButton icon={<Search />} circle aria-label="search" />
        <ElButton icon={<Search />} size="small" circle aria-label="search" />
      </div>
    </>
  );
}
