import SiteLayout from "@/components/blog/layout/SiteLayout";
import Breadcrumbs from "@/components/blog/common/Breadcrumbs";
import { localePath } from "@/lib/locale";

/** 归档索引页：内容已移除，只保留路由、面包屑与站点框架 */
export default function ArchiveIndex({ locale }: { locale: string }) {
  return (
    <SiteLayout
      locale={locale}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { name: "Home", path: localePath(locale, "/") },
            { name: "Archive", path: "" },
          ]}
        />
      }
      showYouMayLike
    >
      {null}
    </SiteLayout>
  );
}
