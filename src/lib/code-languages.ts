/** Shiki 已配置加载的语言，编辑器下拉与前台高亮共用这一份清单 */
const CODE_LANGUAGES = [
	{ label: "Bash", value: "bash" },
	{ label: "CSS", value: "css" },
	{ label: "Dockerfile", value: "dockerfile" },
	{ label: "Go", value: "go" },
	{ label: "HTML", value: "html" },
	{ label: "Java", value: "java" },
	{ label: "JavaScript", value: "javascript" },
	{ label: "JSON", value: "json" },
	{ label: "Markdown", value: "markdown" },
	{ label: "Python", value: "python" },
	{ label: "SQL", value: "sql" },
	{ label: "TSX", value: "tsx" },
	{ label: "TypeScript", value: "typescript" },
	{ label: "Vue", value: "vue" },
	{ label: "XML", value: "xml" },
	{ label: "YAML", value: "yaml" },
] as const;

export type CodeLanguage = (typeof CODE_LANGUAGES)[number]["value"];

/** 首项为纯文本，空值表示不做高亮 */
export const CODE_LANGUAGE_OPTIONS: { label: string; value: string }[] = [
	{ label: "Plain text", value: "" },
	...CODE_LANGUAGES,
];

const LANGUAGE_ALIASES: Record<string, CodeLanguage> = {
	ts: "typescript",
	typescript: "typescript",
	tsx: "tsx",
	js: "javascript",
	javascript: "javascript",
	jsx: "tsx",
	vue: "vue",
	bash: "bash",
	sh: "bash",
	shell: "bash",
	zsh: "bash",
	html: "html",
	css: "css",
	json: "json",
	go: "go",
	golang: "go",
	java: "java",
	py: "python",
	python: "python",
	sql: "sql",
	mysql: "sql",
	yaml: "yaml",
	yml: "yaml",
	xml: "xml",
	md: "markdown",
	markdown: "markdown",
	dockerfile: "dockerfile",
	docker: "dockerfile",
};

/** 未知语言回退为纯文本，避免 Shiki 抛错中断整页渲染 */
export function normalizeCodeLang(lang?: string): string {
	if (!lang) return "text";
	return LANGUAGE_ALIASES[lang.toLowerCase()] ?? "text";
}
