"use client";

import Link from "next/link";
import { ElBreadcrumb, ElBreadcrumbItem } from "@/components/element-plus/breadcrumb";
import { ArrowRight } from "@/components/element-plus/icons";
import styles from "./breadcrumb.module.css";

export function BreadcrumbBasic() {
  return (
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem to="/">homepage</ElBreadcrumbItem>
      <ElBreadcrumbItem>
        <Link className={styles.link} href="/">promotion management</Link>
      </ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion list</ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion detail</ElBreadcrumbItem>
    </ElBreadcrumb>
  );
}

export function BreadcrumbIcon() {
  return (
    <ElBreadcrumb separatorIcon={<ArrowRight />}>
      <ElBreadcrumbItem to="/">homepage</ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion management</ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion list</ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion detail</ElBreadcrumbItem>
    </ElBreadcrumb>
  );
}
