import { getSiteSetting } from "@/lib/api/site";
import SettingsClient from "./SettingsClient";

// 服务端组件：预先获取站点标题与开发者头像，传给客户端交互组件
export default async function SettingsPage() {
  const setting = await getSiteSetting().catch(() => null);
  const siteName = setting?.site_name || "博客";
  const avatar = setting?.developer_avatar || "";

  return <SettingsClient siteName={siteName} avatar={avatar} />;
}
