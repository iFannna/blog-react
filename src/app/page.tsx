import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/layout/Sidebar";
import ArticleFeed from "@/components/ui/ArticleFeed";

export default function HomePage() {
  return (
    <SiteLayout showSidebar sidebar={<Sidebar />}>
      <h1 className="sr-only">Blog</h1>
      <ArticleFeed />
    </SiteLayout>
  );
}
