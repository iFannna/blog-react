export const mockExploreLinks = [
  {
    title: "About Me",
    description: "Learn more about the developer behind this blog.",
    href: "/about",
  },
  {
    title: "Guestbook",
    description: "Leave a message and say hello!",
    href: "/guestbook",
  },
  {
    title: "Friend Links",
    description: "Check out blogs from friends and fellow developers.",
    href: "/friendlink",
  },
];

// 仅技术栈仍用 mock：后端 developer_stack 是字符串、结构与图标数组不符，暂不接入
export const developerProfile = {
  techStack: [
    { name: "Node.js", icon: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/nodejs.png" },
    { name: "Vue", icon: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/vue.png" },
    { name: "Spring", icon: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/spring.png" },
    { name: "MySQL", icon: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/mysql.png" },
    { name: "Redis", icon: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/redis.png" },
    { name: "Git", icon: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/git.png" },
    { name: "Nginx", icon: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/nginx.png" },
  ],
};

// ── 评论区 mock 数据（接后端时整块删除） ──

export const DEFAULT_AVATAR = "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/2025/04/312b700a-e1c7-42bf-aa23-5db8dc7121a6.jpg";

// 当前登录访客（mock，接后端时换成真实用户态）
export const mockViewer = {
  userId: 1,
  nickname: "赵瑾瑜",
  avatar: DEFAULT_AVATAR,
  isAdmin: true,
};

export interface MockComment {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  likeCount: number;
  liked: boolean;
  replyCount: number;
  canDelete: boolean;
  createTime: string;
  previewReplyContent?: string;
  previewReplyAuthorName?: string;
}

export interface MockReply {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string;
  replyToName: string;
  content: string;
  likeCount: number;
  liked: boolean;
  canDelete: boolean;
  createTime: string;
}

export const mockCommentList: MockComment[] = [
  {
    id: 1,
    userId: 2,
    authorName: "林思远",
    authorAvatar: DEFAULT_AVATAR,
    content: "写得很清楚，特别是状态管理那部分，帮了我大忙！已经照着重构了项目里的几个模块。",
    likeCount: 24,
    liked: false,
    replyCount: 2,
    canDelete: false,
    createTime: "2026-07-08 14:30:00",
    previewReplyContent: "状态管理那部分我也反复看了好几遍，确实经典。",
    previewReplyAuthorName: "苏沐",
  },
  {
    id: 2,
    userId: 3,
    authorName: "陈晓",
    authorAvatar: DEFAULT_AVATAR,
    content: "请问文中提到的缓存策略在生产环境实际效果如何？想评估是否引入到我们的服务里。",
    likeCount: 8,
    liked: true,
    replyCount: 1,
    canDelete: false,
    createTime: "2026-07-08 11:20:00",
    previewReplyContent: "线上用了三个月，命中率稳定在 92% 左右。",
    previewReplyAuthorName: "赵瑾瑜",
  },
  {
    id: 3,
    userId: 1,
    authorName: "赵瑾瑜",
    authorAvatar: DEFAULT_AVATAR,
    content: "感谢分享，已收藏！期待下一篇关于服务端渲染的实践内容。",
    likeCount: 3,
    liked: false,
    replyCount: 0,
    canDelete: true,
    createTime: "2026-07-07 22:10:00",
  },
  {
    id: 4,
    userId: 4,
    authorName: "王浩然",
    authorAvatar: DEFAULT_AVATAR,
    content: "代码示例可以直接拿来用吗？有没有对应的 GitHub 仓库可以对照着看？",
    likeCount: 15,
    liked: false,
    replyCount: 0,
    canDelete: false,
    createTime: "2026-07-07 16:45:00",
  },
  {
    id: 5,
    userId: 5,
    authorName: "苏沐",
    authorAvatar: DEFAULT_AVATAR,
    content: "这篇文章的排版和配图都很用心，读起来很舒服，一口气看完了。",
    likeCount: 42,
    liked: false,
    replyCount: 3,
    canDelete: false,
    createTime: "2026-07-06 09:30:00",
    previewReplyContent: "谢谢认可，后续会保持这个质量。",
    previewReplyAuthorName: "赵瑾瑜",
  },
  {
    id: 6,
    userId: 6,
    authorName: "周明",
    authorAvatar: DEFAULT_AVATAR,
    content: "有个小疑问：第三方依赖的版本有要求吗？我用的是较新的版本，运行时报错了。",
    likeCount: 2,
    liked: false,
    replyCount: 0,
    canDelete: false,
    createTime: "2026-07-05 18:00:00",
  },
];

export const mockReplyMap: Record<number, MockReply[]> = {
  1: [
    { id: 101, userId: 5, authorName: "苏沐", authorAvatar: DEFAULT_AVATAR, replyToName: "林思远", content: "状态管理那部分我也反复看了好几遍，确实经典。", likeCount: 5, liked: false, canDelete: false, createTime: "2026-07-08 15:00:00" },
    { id: 102, userId: 2, authorName: "林思远", authorAvatar: DEFAULT_AVATAR, replyToName: "苏沐", content: "哈哈，英雄所见略同！", likeCount: 1, liked: false, canDelete: false, createTime: "2026-07-08 16:30:00" },
  ],
  2: [
    { id: 103, userId: 1, authorName: "赵瑾瑜", authorAvatar: DEFAULT_AVATAR, replyToName: "陈晓", content: "线上用了三个月，命中率稳定在 92% 左右，整体很稳，可以放心引入。", likeCount: 6, liked: false, canDelete: true, createTime: "2026-07-08 12:00:00" },
  ],
  5: [
    { id: 104, userId: 1, authorName: "赵瑾瑜", authorAvatar: DEFAULT_AVATAR, replyToName: "苏沐", content: "谢谢认可，后续会保持这个质量。", likeCount: 2, liked: false, canDelete: true, createTime: "2026-07-06 10:00:00" },
    { id: 105, userId: 4, authorName: "王浩然", authorAvatar: DEFAULT_AVATAR, replyToName: "赵瑾瑜", content: "期待下一篇！", likeCount: 0, liked: false, canDelete: false, createTime: "2026-07-06 11:00:00" },
    { id: 106, userId: 7, authorName: "李娜", authorAvatar: DEFAULT_AVATAR, replyToName: "苏沐", content: "排版确实专业，请问用的什么排版方案？", likeCount: 1, liked: false, canDelete: false, createTime: "2026-07-06 14:00:00" },
  ],
};
