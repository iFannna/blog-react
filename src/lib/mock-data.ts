export interface Article {
  id: number;
  type: 1 | 2; // 1 = standard, 2 = quote
  title: string;
  summary: string;
  coverImage: string | null;
  authorName: string;
  authorAvatar: string;
  categories: { id: number; name: string }[];
  publishTime: string; // ISO string
  url: string;
}

export interface Category {
  id: number;
  name: string;
  count: number;
}

export interface Tag {
  id: number;
  name: string;
}

export const mockArticles: Article[] = [
  {
    id: 1,
    type: 1,
    title: "Getting Started with Next.js: A Complete Guide",
    summary:
      "Learn how to build modern web applications with Next.js, React's most popular framework. This guide covers everything from project setup to deployment.",
    coverImage: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg",
    authorName: "SAu",
    authorAvatar: "",
    categories: [{ id: 1, name: "Technology" }],
    publishTime: "2025-05-28T10:00:00Z",
    url: "/article/2025/05/28/getting-started-nextjs",
  },
  {
    id: 2,
    type: 1,
    title: "Understanding React Server Components",
    summary:
      "React Server Components represent a paradigm shift in how we build React applications. They allow you to render components on the server, reducing client-side JavaScript.",
    coverImage: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg",
    authorName: "SAu",
    authorAvatar: "",
    categories: [
      { id: 1, name: "Technology" },
      { id: 2, name: "Frontend" },
    ],
    publishTime: "2025-05-25T08:30:00Z",
    url: "/article/2025/05/25/react-server-components",
  },
  {
    id: 3,
    type: 2,
    title: "The best time to plant a tree was 20 years ago.",
    summary:
      "The second best time is now. Every expert was once a beginner. Keep building, keep learning, keep shipping.",
    coverImage: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg",
    authorName: "SAu",
    authorAvatar: "",
    categories: [{ id: 3, name: "Thoughts" }],
    publishTime: "2025-05-20T15:00:00Z",
    url: "/article/2025/05/20/plant-a-tree",
  },
  {
    id: 4,
    type: 1,
    title: "Tailwind CSS: Why Utility-First Matters",
    summary:
      "Explore why utility-first CSS frameworks like Tailwind have gained massive adoption and how they solve common styling challenges in modern web development.",
    coverImage: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg",
    authorName: "SAu",
    authorAvatar: "",
    categories: [{ id: 2, name: "Frontend" }],
    publishTime: "2025-05-18T12:00:00Z",
    url: "/article/2025/05/18/tailwind-utility-first",
  },
  {
    id: 5,
    type: 1,
    title: "Building a Blog with Spring Boot and Vue",
    summary:
      "A step-by-step tutorial on creating a full-stack blog application using Spring Boot for the backend and Vue.js for the frontend.",
    coverImage: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg",
    authorName: "SAu",
    authorAvatar: "",
    categories: [
      { id: 1, name: "Technology" },
      { id: 4, name: "Backend" },
    ],
    publishTime: "2025-05-15T09:00:00Z",
    url: "/article/2025/05/15/spring-boot-vue-blog",
  },
  {
    id: 6,
    type: 1,
    title: "TypeScript Best Practices for 2025",
    summary:
      "Level up your TypeScript skills with these best practices, including type narrowing, generics patterns, and advanced utility types.",
    coverImage: "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg",
    authorName: "SAu",
    authorAvatar: "",
    categories: [{ id: 2, name: "Frontend" }],
    publishTime: "2025-05-10T14:00:00Z",
    url: "/article/2025/05/10/typescript-best-practices",
  },
];

export const mockCategories: Category[] = [
  { id: 1, name: "Technology", count: 12 },
  { id: 2, name: "Frontend", count: 8 },
  { id: 3, name: "Thoughts", count: 5 },
  { id: 4, name: "Backend", count: 6 },
];

export const mockTags: Tag[] = [
  { id: 1, name: "React" },
  { id: 2, name: "Next.js" },
  { id: 3, name: "TypeScript" },
  { id: 4, name: "CSS" },
  { id: 5, name: "Spring Boot" },
  { id: 6, name: "Vue" },
  { id: 7, name: "Tailwind" },
  { id: 8, name: "Node.js" },
];

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
  bio: "你好！我是赵瑾瑜，一位在读的大学生。该博客使用 Vue + Spring Boot 独立开发。",
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
