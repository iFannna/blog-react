import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/layout/Sidebar";
import ArticleFeed from "@/components/ui/ArticleFeed";

export default function HomePage() {
  return (
    <SiteLayout showSidebar sidebar={<Sidebar />}>
      <ArticleFeed />
    </SiteLayout>
  );
}
