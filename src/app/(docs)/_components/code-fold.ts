/**
 * 按缩进计算可折叠区域，对齐 VSCode 的 indentation folding：
 * 起始行非空且下一非空行缩进更深；区域到第一条缩进回退到起始行同等或更浅的非空行之前结束。
 */

export interface FoldRegion {
  /** 起始行下标，折叠后仍保留 */
  start: number;
  /** 最后一条被隐藏的行下标（包含） */
  end: number;
}

// 与代码块的 tab-size: 4 保持一致，混用 tab/空格时缩进宽度才能对应渲染结果
const TAB_SIZE = 4;

export function getIndent(line: string): number {
  let indent = 0;

  for (const char of line) {
    if (char === " ") indent += 1;
    else if (char === "\t")
      indent = Math.floor(indent / TAB_SIZE) * TAB_SIZE + TAB_SIZE;
    else break;
  }

  return indent;
}

const isBlank = (line: string) => line.trim() === "";

export function computeFoldRegions(lines: string[]): FoldRegion[] {
  const regions: FoldRegion[] = [];

  for (let start = 0; start < lines.length - 1; start++) {
    if (isBlank(lines[start])) continue;

    const indent = getIndent(lines[start]);
    let bound = lines.length;

    for (let line = start + 1; line < lines.length; line++) {
      if (isBlank(lines[line])) continue;
      if (getIndent(lines[line]) <= indent) {
        bound = line;
        break;
      }
    }

    let end = bound - 1;
    while (end > start && isBlank(lines[end])) end--;

    if (end > start) regions.push({ start, end });
  }

  return regions;
}
