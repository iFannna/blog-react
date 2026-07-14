"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
}

// 多级下拉菜单显隐 hook:openKeys + toggle(祖先连锁/同级互斥/子孙连锁)+ 点外部收起
export function useDropdownMenu(scope: string) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
  const toggle = useCallback((key: string) => {
    setOpenKeys((prev) => {
      // 取消:点已固定的项 → 关闭它及其子孙
      if (prev.has(key)) {
        return new Set([...prev].filter((k) => k !== key && !k.startsWith(`${key}/`)));
      }
      // 固定:开启该项 + 全部祖先（祖先不固定会因父级 hover 移出而连带塌掉）
      const ancestors: string[] = [];
      key.split("/").reduce<string>((acc, part) => {
        const path = acc ? `${acc}/${part}` : part;
        ancestors.push(path);
        return path;
      }, "");
      const parent = ancestors.length > 1 ? ancestors[ancestors.length - 2] : "";
      // 同级互斥:清除同 parent 下其他分支及其子孙
      const next = new Set<string>(ancestors);
      prev.forEach((k) => {
        if (ancestors.includes(k)) return;
        const inParent = parent ? k.startsWith(`${parent}/`) : !k.includes("/");
        if (inParent) return;
        next.add(k);
      });
      return next;
    });
  }, []);
  const clear = useCallback(() => setOpenKeys(new Set()), []);
  useEffect(() => {
    if (openKeys.size === 0) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(scope)) clear();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openKeys, clear, scope]);
  return { openKeys, toggle, clear };
}

interface MenuListProps {
  items: MenuItem[];
  openKeys: Set<string>;
  toggle: (key: string) => void;
  onLeafClick?: () => void;
  parentId?: string;
  pathname?: string;
}

// 递归渲染多级菜单:父级 button 切换固定展开，叶子 Link 跳转或 button 触发动作
export function MenuList({ items, openKeys, toggle, onLeafClick, parentId = "", pathname }: MenuListProps) {
  return (
    <>
      {items.map((item) => {
        const key = parentId ? `${parentId}/${item.label}` : item.label;
        const hasChildren = !!item.children?.length;
        const isOpen = openKeys.has(key);
        const liClass = `menu-item${hasChildren ? " menu-has-children" : ""}${isOpen ? " is-fixed" : ""}`;
        return (
          <li key={key} className={liClass}>
            {hasChildren ? (
              <button
                type="button"
                className={`submenu-toggle${isOpen ? " is-active" : ""}`}
                aria-expanded={isOpen}
                onClick={() => toggle(key)}
              >
                <span>{item.label}</span>
                <ChevronIcon />
              </button>
            ) : item.href !== undefined ? (
              <Link
                href={item.href}
                className={`nav-link${pathname && !parentId && pathname === item.href ? " active" : ""}`}
                onClick={onLeafClick}
              >
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                className="nav-link"
                onClick={() => {
                  item.onClick?.();
                  onLeafClick?.();
                }}
              >
                <span>{item.label}</span>
              </button>
            )}
            {hasChildren && (
              <ul className="sub-menu">
                <MenuList
                  items={item.children!}
                  openKeys={openKeys}
                  toggle={toggle}
                  onLeafClick={onLeafClick}
                  parentId={key}
                  pathname={pathname}
                />
              </ul>
            )}
          </li>
        );
      })}
    </>
  );
}

export function ChevronIcon() {
  return (
    <svg className="submenu-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M24.958 10.483a1.29 1.29 0 00-1.868 0l-7.074 7.074-7.074-7.074c-.534-.534-1.335-.534-1.868 0s-.534 1.335 0 1.868l8.008 8.008c.267.267.667.4.934.4s.667-.133.934-.4l8.008-8.008a1.29 1.29 0 000-1.868z" />
    </svg>
  );
}
