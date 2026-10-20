"use client";

import { useMemo, useState, type ComponentType, type MouseEvent, type SVGProps } from "react";
import * as AllIcons from "@/components/element-plus/icons";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElButton } from "@/components/element-plus/button";
import { ElInput } from "@/components/element-plus/input";
import { ElSwitch } from "@/components/element-plus/switch";
import { message } from "@/components/element-plus/message";
import {
  Delete,
  Edit,
  Loading,
  Search,
  Share,
} from "@/components/element-plus/icons";
import categoriesData from "./icon-categories.json";
import styles from "./icon.module.css";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const ICONS = AllIcons as unknown as Record<string, IconComponent>;

/** 与官方 icons.vue 相同的分类顺序：分类内的图标按官方列表，其余归入 Other。 */
const CATEGORIES = (() => {
  const remaining = new Set(Object.keys(ICONS));
  const categories = categoriesData.categories.map((category) => {
    const icons = category.items.flatMap((name) => {
      const Icon = ICONS[name];
      if (!Icon || !remaining.has(name)) return [];
      remaining.delete(name);
      return [{ name, Icon }];
    });
    return { name: category.name, icons };
  });

  categories.push({
    name: "Other",
    icons: [...remaining].map((name) => ({ name, Icon: ICONS[name] })),
  });

  return categories;
})();

export function IconSimple() {
  return (
    <div className="demo-icon-row">
      <div>
        <ElIcon size={30}>
          <Edit />
        </ElIcon>
        <Edit />
      </div>
    </div>
  );
}

export function IconCombined() {
  return (
    <div className={styles.combined}>
      <p>
        通过添加额外的类名 <b>is-loading</b>
        ，你的图标就可以在 2 秒内旋转 360 度，当然你也可以自己改写想要的动画。
      </p>
      <div className={styles.combinedRow}>
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
          <ElIcon className={styles.buttonIcon}>
            <Search />
          </ElIcon>
          <span className={styles.buttonIcon}>Search</span>
        </ElButton>
      </div>
    </div>
  );
}

export function IconDirect() {
  return (
    <div className={styles.directRow}>
      <Edit className="demo-icon-inline" />
      <Share className="demo-icon-inline" />
      <Delete className="demo-icon-inline" />
      <Search className="demo-icon-inline" />
    </div>
  );
}

export function IconCollection() {
  const [copyIcon, setCopyIcon] = useState(true);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return CATEGORIES.map((category) => ({
      ...category,
      icons: keyword
        ? category.icons.filter(({ name }) =>
            name.toLowerCase().includes(keyword),
          )
        : category.icons,
    })).filter((category) => category.icons.length);
  }, [query]);

  const copy = async (name: string, event: MouseEvent<HTMLLIElement>) => {
    const content = copyIcon
      ? `<el-icon><${name} /></el-icon>`
      : (event.currentTarget.querySelector("svg")?.outerHTML ?? "");

    try {
      await navigator.clipboard.writeText(content);
      message.success("复制成功");
    } catch {
      message.error("复制失败");
    }
  };

  return (
    <div className={styles.collection}>
      <div className={styles.switchRow}>
        <ElSwitch
          checked={copyIcon}
          onCheckedChange={setCopyIcon}
          activeText="Copy icon code"
          inactiveText="Copy SVG content"
        />
      </div>
      <div className={styles.searchContent}>
        <ElInput
          size="large"
          value={query}
          onChange={setQuery}
          prefixIcon={<Search />}
          placeholder="Search Icons"
        />
      </div>
      {filtered.map((category) => (
        <div className={styles.category} key={category.name}>
          <div className={styles.title}>{category.name}</div>
          <ul className={styles.list}>
            {category.icons.map(({ name, Icon }) => (
              <li
                className={styles.cell}
                key={name}
                onClick={(event) => copy(name, event)}
              >
                <span className={styles.svgIcon}>
                  <ElIcon size={20}>
                    <Icon />
                  </ElIcon>
                  <span className={styles.iconName}>{name}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
