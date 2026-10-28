<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blog React

## 技术栈

- Next.js 16 App Router，TypeScript strict
- 博客与文档双站，共用组件库与设计 token
- 样式分三份：`styles/blog`、`styles/docs`、`styles/element-plus`，博客与文档根布局都加载主题
- axios：服务端经 `services/` 直连后端，客户端走 `/api` 代理
- 界面手写 React，Element Plus 为源码级复刻，不引入第三方 UI 库

## 结构

```text
src/
├── app/                        # 只放路由与根布局
│   ├── (blog)/[locale]/        # 博客 /<locale>/...
│   ├── (docs)/[locale]/docs/   # 文档 /<locale>/docs/<section>/...
│   ├── (gutenberg)/[locale]/   # 编辑器 /<locale>/gutenberg
│   └── (root)/                 # 无语言前缀入口
├── components/                 # blog、docs、gutenberg、element-plus
├── content/                    # docs 文档与 demos 示例
├── services/                   # 请求与 VO 到界面模型映射
├── lib/                        # 文档管线、locale、高亮、区块渲染
├── styles/                     # blog、docs、element-plus
└── hooks/  stores/  utils/  types/
```

- `/` 与 `/docs` 固定 307 到 `zh-CN`，`en-US` 只可直达，不做浏览器语言识别
- 归档索引页只保留路由、面包屑与 You May Like，主内容为空
- 默认 Server Components，交互组件加 `"use client"`

## 命令与验证

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run lint` | ESLint |
| `npx next start` | 生产预览 |
| `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json` | 类型检查 |

- 开发服务器由用户管理，不占用端口
- 改动后跑类型检查与 ESLint，构建相关再跑 `npm run build`
- 页面视觉效果由用户确认

## 命名

- 组件用 PascalCase，与主导出同名
- 其余模块用 kebab-case
- `app/` 只放路由文件，组件放 `components/`
- Element Plus 保留上游命名，生成图标不手改
- 文档示例放 `components/docs/examples/`

## 样式与单位

- token 定义在 `:root`，暗色用 `[data-theme="dark"]` 覆盖变量
- 博客与文档样式互不叠加
- 禁止硬编码颜色、间距、圆角
- 内联 style 只用于 Shiki 等无法用 class 表达的场景
- 少用 `!important`
- 基准 1rem = 16px
- 尺寸与间距用 rem，接近视口用 vw 或 vh
- 跟字号成比例的间距用 em
- 边框、细线、图标、阴影用 px
- 小数一位优先，旧基准换算的 rem 保留原精度

## 注释

- 单独一行放在代码上方，禁止行尾注释
- 只写为什么，不写是什么
- 不使用括号，需要补充就拆短句
- JSX 用中文，CSS 用英文且只划分组件块
- 不留冗余与过时注释

## 移植代码豁免

以下目录保留上游写法，不按本站命名、注释、样式规范检查：

- `components/gutenberg`、`services/gutenberg`、`stores/gutenberg`、`lib/gutenberg`、`hooks/gutenberg`、`utils/gutenberg`
- `components/element-plus`
- `components/docs/examples`

`GutenbergContent` 注入的文章级样式属于数据驱动，不受禁止 `<style>` 的约束。

## Git

- 格式 `type: subject`
- type 取 feat、fix、style、refactor、chore、docs
- subject 英文祈使句，小写开头，不加句号
- 不带 scope 与 body

## 版本号

- `version` 使用改动日期 `YY.MM.DD`
- 同一天多次改动保持同一版本
- 用 `npm version YY.MM.DD --no-git-tag-version` 更新
