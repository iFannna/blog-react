"use client";

import { ElButton } from "@/components/element-plus/button";
import { Delete, Edit, Search, Share, Upload } from "@/components/element-plus/icons";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { exampleRow } from "./styles";

export default function ButtonIcon() {
  return (
    <div style={exampleRow}>
      <ElButton type="primary" icon={<Edit />} aria-label="edit" />
      <ElButton type="primary" icon={<Share />} aria-label="share" />
      <ElButton type="primary" icon={<Delete />} aria-label="delete" />
      <ElButton type="primary" icon={<Search />}>
        Search
      </ElButton>
      <ElButton type="primary">
        Upload
        {/* 官方用 el-icon--right 让图标贴到文字右侧 */}
        <ElIcon className="el-icon--right">
          <Upload />
        </ElIcon>
      </ElButton>
    </div>
  );
}
