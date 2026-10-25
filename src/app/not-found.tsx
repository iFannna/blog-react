import type { Metadata } from "next";
import StatusPage, { createStatusMetadata } from "@/components/common/status-page";

export const metadata: Metadata = createStatusMetadata("404");

export default function NotFound() {
  return <StatusPage code="404" homeHref="/" />;
}
