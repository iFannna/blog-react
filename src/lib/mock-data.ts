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

const COVER = "";
const AVATAR = "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/2025/04/312b700a-e1c7-42bf-aa23-5db8dc7121a6.jpg";

const CAT_POOL = [
  [{ id: 1, name: "Technology" }],
  [{ id: 2, name: "Frontend" }],
  [{ id: 3, name: "Backend" }],
  [{ id: 1, name: "Technology" }, { id: 2, name: "Frontend" }],
  [{ id: 2, name: "Frontend" }, { id: 3, name: "Backend" }],
  [{ id: 4, name: "DevOps" }],
  [{ id: 5, name: "Database" }],
  [{ id: 6, name: "Security" }],
];

const STD_TITLES = [
  "Mastering Git Workflows for Teams",
  "Docker containerization guide for developers",
  "Introduction to Kubernetes orchestration",
  "RESTful API design best practices",
  "GraphQL vs REST: When to use what",
  "Microservices architecture explained simply",
  "CI/CD pipeline with GitHub Actions",
  "Web performance optimization techniques",
  "Accessibility in modern web apps",
  "State management patterns in React",
  "CSS Grid and Flexbox mastery",
  "Progressive Web Apps: A complete guide",
  "Node.js streams and buffering explained",
  "Database indexing strategies for MySQL",
  "Redis caching patterns and best practices",
  "Nginx configuration for production servers",
  "OAuth 2.0 authentication flow guide",
  "WebSocket real-time communication",
  "Serverless functions with AWS Lambda",
  "Testing strategies for frontend apps",
  "Monorepo vs polyrepo: Making the choice",
  "Webpack 5 module federation guide",
  "Responsive design in 2025",
  "Browser rendering pipeline deep dive",
  "JavaScript event loop explained",
  "Python for web development beginners",
  "Machine learning basics for developers",
  "Introduction to WebAssembly",
  "Design systems from scratch",
  "Code review best practices",
  "Logging and monitoring in production",
  "SQL vs NoSQL: Choosing the right database",
  "React hooks deep dive and patterns",
  "Vue 3 composition API guide",
  "CSS custom properties and theming",
  "SVG animations and interactive graphics",
  "Web scraping with Python and Scrapy",
  "Message queues with RabbitMQ",
  "Functional programming in TypeScript",
  "Error handling patterns in Node.js",
  "Build tools comparison: Vite vs Webpack",
  "SEO optimization for single-page apps",
  "Introduction to Rust for web developers",
  "Real-time databases with Firebase",
  "Responsive images and lazy loading",
  "Web security vulnerabilities and prevention",
  "Agile methodology for solo developers",
];

const QUOTE_TITLES = [
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand.",
  "Simplicity is the soul of efficiency.",
  "Talk is cheap. Show me the code.",
  "Programs must be written for people to read.",
  "The best error message is the one that never shows up.",
  "Make it work, make it right, make it fast.",
  "Experience is the name everyone gives to their mistakes.",
  "Before software can be reusable it first has to be usable.",
  "Debugging is twice as hard as writing the code.",
  "The function of good software is to make the complex appear to be simple.",
  "In order to be irreplaceable, one must always be different.",
  "It's not a bug; it's an undocumented feature.",
  "Software is a great combination between artistry and engineering.",
  "The most damaging phrase in the language is 'We've always done it this way.'",
  "Measuring programming progress by lines of code is wrong.",
  "The best way to predict the future is to implement it.",
  "Perfection is achieved not when there is nothing more to add.",
  "Walking on water and developing software are easy if both are frozen.",
];

function makeArticle(id: number): Article {
  const isQuote = id % 3 === 0 && id > 6;
  const daysAgo = (id - 1) * 2;
  const date = new Date("2025-05-28T10:00:00Z");
  date.setDate(date.getDate() - daysAgo);
  const slug = isQuote
    ? `quote-${id}`
    : STD_TITLES[id - 7]?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `article-${id}`;

  return {
    id,
    type: isQuote ? 2 : 1,
    title: isQuote ? QUOTE_TITLES[Math.floor((id - 7) / 3)] || `Quote #${id}` : STD_TITLES[id - 7] || `Article #${id}`,
    summary: isQuote
      ? "A thought-provoking quote about software development and the craft of programming."
      : "Explore this topic in depth with practical examples, code snippets, and real-world applications for modern developers.",
    coverImage: COVER,
    authorName: "SAu",
    authorAvatar: AVATAR,
    categories: CAT_POOL[(id - 1) % CAT_POOL.length],
    publishTime: date.toISOString(),
    url: `/article/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${slug}`,
  };
}

export const mockArticles: Article[] = [
  {
    id: 1,
    type: 1,
    title: "Getting Started with Next.js: A Complete Guide",
    summary:
      "Learn how to build modern web applications with Next.js, React's most popular framework. This guide covers everything from project setup to deployment.",
    coverImage: COVER,
    authorName: "SAu",
    authorAvatar: AVATAR,
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
    coverImage: COVER,
    authorName: "SAu",
    authorAvatar: AVATAR,
    categories: [
      { id: 1, name: "Technology" },
      { id: 2, name: "Frontend" },
      { id: 3, name: "Backend" },
      { id: 4, name: "React" },
      { id: 5, name: "Next.js" },
      { id: 6, name: "TypeScript" },
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
    coverImage: COVER,
    authorName: "SAu",
    authorAvatar: AVATAR,
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
    coverImage: COVER,
    authorName: "SAu",
    authorAvatar: AVATAR,
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
    coverImage: COVER,
    authorName: "SAu",
    authorAvatar: AVATAR,
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
    coverImage: COVER,
    authorName: "SAu",
    authorAvatar: AVATAR,
    categories: [{ id: 2, name: "Frontend" }],
    publishTime: "2025-05-10T14:00:00Z",
    url: "/article/2025/05/10/typescript-best-practices",
  },
  ...Array.from({ length: 58 }, (_, i) => makeArticle(i + 7)),
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

export const mockYouMayLikeArticles = mockArticles.slice(0, 4);

export const mockFooterData = {
  siteName: "赵瑾瑜的个人博客",
  email: "example@email.com",
  phone: "138****8888",
  icp: "京ICP备XXXXXXXX号",
  police: "京公网安备XXXXXXXXXXXX号",
  guestbookCount: 128,
  friendLinkCount: 32,
};
