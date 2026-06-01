import type { Article } from "@/types/ui";

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
    href: "/friend-link",
  },
];

export const developerProfile = {
  name: "赵瑾瑜",
  role: "开发者 & 编辑",
  bio: "你好！我是赵瑾瑜，一位在读的大学生。该博客使用 Next.js + Spring Boot 独立开发。",
  avatar: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/2025/04/312b700a-e1c7-42bf-aa23-5db8dc7121a6.jpg",
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

export const mockFooterData = {
  siteName: "赵瑾瑜的个人博客",
  email: "example@email.com",
  phone: "138****8888",
  icp: "京ICP备XXXXXXXX号",
  police: "京公网安备XXXXXXXXXXXX号",
  guestbookCount: 128,
  friendLinkCount: 32,
};
