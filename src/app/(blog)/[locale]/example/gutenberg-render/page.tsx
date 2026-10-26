import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/blog/common/Breadcrumbs";
import SiteLayout from "@/components/blog/layout/SiteLayout";
import GutenbergContent from "@/components/blog/article/GutenbergContent";
import { DOC_LOCALES, isDocLocale } from "@/lib/docs/types";
import { localePath } from "@/lib/locale";
import { notFound } from "next/navigation";
import "@/styles/blog/gutenberg.css";

export const dynamic = "force-static";

/**
 * 覆盖所有可见静态区块与渲染期属性的回归样例。
 * force-static 下内容在构建时读取并固化，运行时不依赖源码目录。
 */
const sample = readFileSync(
	path.join(process.cwd(), "src/lib/gutenberg/fixtures/render-sample.html"),
	"utf8",
);

export function generateStaticParams() {
	return DOC_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
	title: "Gutenberg 区块渲染样例",
	description: "Gutenberg 静态区块与属性渲染回归样例",
};

export default async function GutenbergRenderSamplePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!isDocLocale(locale)) {
		notFound();
	}

	return (
		<SiteLayout
			locale={locale}
			breadcrumbs={
				<Breadcrumbs
					items={[
						{ name: "Home", path: localePath(locale, "/") },
						{
							name: "Gutenberg 渲染样例",
							path: localePath(locale, "/example/gutenberg-render"),
						},
					]}
				/>
			}
		>
			<div id="primary" className="content-area">
				<article className="page-entry">
					<header className="entry-header">
						<h1 className="entry-title">Gutenberg 静态区块渲染样例</h1>
					</header>
					<div className="entry-content page-entry-content">
						<GutenbergContent content={sample} />
					</div>
				</article>
			</div>
		</SiteLayout>
	);
}
