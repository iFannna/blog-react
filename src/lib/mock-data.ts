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

// ── 评论区 mock 数据（接后端时整块删除） ──

export const DEFAULT_AVATAR = "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/2025/04/312b700a-e1c7-42bf-aa23-5db8dc7121a6.jpg";

// 当前登录访客（mock，接后端时换成真实用户态）
export const mockViewer = {
  userId: 1,
  nickname: "赵瑾瑜",
  avatar: DEFAULT_AVATAR,
  isAdmin: true,
};
