"use client";

import * as AllIcons from "@/components/element-plus/icons";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElButton } from "@/components/element-plus/button";
import { Delete, Edit, Loading, Search, Share } from "@/components/element-plus/icons";

export function IconSimple() {
  return (
    <div className="demo-icon-row">
      <ElIcon size={30}>
        <Edit />
      </ElIcon>
      <Edit />
    </div>
  );
}

export function IconCombined() {
  return (
    <div className="demo-icon-stack">
      <p>
        加上 <b>is-loading</b> 类名后，图标会在 2 秒内旋转 360 度，你也可以覆盖这段动画。
      </p>
      <div className="demo-icon-row">
        <ElIcon size={20}>
          <Edit />
        </ElIcon>
        <ElIcon color="#409efc" className="no-inherit">
          <Share />
        </ElIcon>
        <ElIcon>
          <Delete />
        </ElIcon>
        <ElIcon className="is-loading">
          <Loading />
        </ElIcon>
        <ElButton type="primary">
          <ElIcon className="demo-icon-button__icon">
            <Search />
          </ElIcon>
          <span className="demo-icon-button__text">Search</span>
        </ElButton>
      </div>
    </div>
  );
}

export function IconDirect() {
  return (
    <div className="demo-icon-row demo-icon-row--large">
      {/* SVG 图标本身不带属性，需要直接传入尺寸 */}
      <Edit className="demo-icon-inline" />
      <Share className="demo-icon-inline" />
      <Delete className="demo-icon-inline" />
      <Search className="demo-icon-inline" />
    </div>
  );
}

const ICON_NAMES = Object.keys(AllIcons).sort((a, b) => a.localeCompare(b));

export function IconCollection() {
  return (
    <div className="demo-icon-collection">
      {ICON_NAMES.map((name) => {
        const Icon =
          (AllIcons as unknown as Record<string, React.ComponentType>)[name];
        return (
          <div className="demo-icon-item" key={name}>
            <ElIcon size={24}>
              <Icon />
            </ElIcon>
            <span className="demo-icon-item__name">{name}</span>
          </div>
        );
      })}
    </div>
  );
}
