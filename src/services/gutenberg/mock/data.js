const SITE_URL =
	typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

export const POST_ID = 97589;

const POST_CONTENT = `<!-- wp:heading -->
<h2 class="wp-block-heading">演示内容</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这段文字用于演示 Gutenberg 编辑器的正文区域。你可以直接在这里输入、删除或调整区块，侧边栏中的字数与阅读时长会随正文实时变化。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>编辑器支持标题、段落、列表、图片、引用等多种区块，也可以通过左上角的加号打开区块插入器，或在画布中按回车新建区块。</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item --><li>摘要、分类和标签显示在右侧文档设置中。</li><!-- /wp:list-item --><!-- wp:list-item --><li>讨论面板用于切换是否允许评论。</li><!-- /wp:list-item --><!-- wp:list-item --><li>点击右上角的发布按钮可以打开预发布面板。</li><!-- /wp:list-item --></ul>
<!-- /wp:list -->`;

const ALL_TRUE_CAPS = {
	read: true,
	edit_posts: true,
	edit_others_posts: true,
	delete_posts: true,
	publish_posts: true,
	upload_files: true,
	edit_pages: true,
	edit_others_pages: true,
	delete_pages: true,
	publish_pages: true,
	read_private_pages: true,
	read_private_posts: true,
	edit_private_pages: true,
	edit_private_posts: true,
	edit_published_pages: true,
	edit_published_posts: true,
	delete_private_pages: true,
	delete_private_posts: true,
	delete_published_pages: true,
	delete_published_posts: true,
	delete_others_pages: true,
	delete_others_posts: true,
	manage_categories: true,
	manage_options: true,
	edit_theme_options: true,
	unfiltered_html: true,
	edit_blocks: true,
	edit_block_binding: true,
};

export const USER = {
	id: 1,
	username: 'admin',
	name: '管理员',
	first_name: '',
	last_name: '',
	email: 'admin@example.com',
	url: '',
	description: '',
	link: `${ SITE_URL }/author/admin/`,
	locale: 'zh_CN',
	nickname: '管理员',
	slug: 'admin',
	roles: [ 'administrator' ],
	registered_date: '2024-01-01T00:00:00',
	avatar_urls: {
		24: '/avatar.svg',
		48: '/avatar.svg',
		96: '/avatar.svg',
	},
	capabilities: ALL_TRUE_CAPS,
	extra_capabilities: { administrator: true },
	meta: {},
};

const MEDIA_FILES = [
	{
		id: 501,
		file: 'morning-ridge.svg',
		title: '晨光山脊',
		description: '晨光中的山脉与天空',
		alt: '暖色天空下的层叠山脊',
	},
	{
		id: 502,
		file: 'forest-path.svg',
		title: '林间小径',
		description: '薄雾森林里的小路',
		alt: '薄雾中的森林与林间小路',
	},
	{
		id: 503,
		file: 'coast-line.svg',
		title: '海岸线',
		description: '晴朗天气下的海岸与浪花',
		alt: '蓝色海面上的海岸线与浪花',
	},
	{
		id: 504,
		file: 'studio-shapes.svg',
		title: '几何静物',
		description: '暖色背景上的几何图形',
		alt: '暖色背景上的圆形、三角形与拱形',
	},
];

export function createMediaRecord( {
	id,
	url,
	file,
	title,
	description = '',
	alt = '',
	mimeType = 'image/svg+xml',
	width = 1200,
	height = 800,
	filesize = 2048,
} ) {
	const size = {
		file,
		width,
		height,
		mime_type: mimeType,
		source_url: url,
		url,
	};
	const sizes = {
		full: size,
		medium: { ...size, width: 600, height: 400 },
		thumbnail: { ...size, width: 300, height: 200 },
	};
	return {
		id,
		date: '2026-10-20T10:00:00',
		date_gmt: '2026-10-20T02:00:00',
		guid: { rendered: url },
		modified: '2026-10-20T10:00:00',
		modified_gmt: '2026-10-20T02:00:00',
		slug: String( file ).replace( /\.[^.]+$/, '' ),
		status: 'inherit',
		type: 'attachment',
		link: url,
		title: { raw: title, rendered: title },
		author: USER.id,
		comment_status: 'closed',
		ping_status: 'closed',
		meta: [],
		description: { raw: description, rendered: description },
		caption: { raw: '', rendered: '' },
		alt_text: alt,
		media_type: mimeType.split( '/' )[ 0 ],
		mime_type: mimeType,
		media_details: {
			width,
			height,
			file,
			filesize,
			sizes,
		},
		post: null,
		source_url: url,
		missing_image_sizes: [],
		width,
		height,
		sizes,
		_embedded: {
			author: [
				{
					id: USER.id,
					name: USER.name,
					url: USER.url,
					description: USER.description,
					link: USER.link,
					slug: USER.slug,
					avatar_urls: USER.avatar_urls,
				},
			],
			'wp:attached-to': [],
		},
		_links: {
			self: [
				{
					href: `${ SITE_URL }/wp/v2/media/${ id }?context=edit`,
				},
			],
			about: [ { href: `${ SITE_URL }/wp/v2/types/attachment` } ],
			author: [ { href: `${ SITE_URL }/wp/v2/users/${ USER.id }` } ],
			'wp:action-delete': [
				{ href: `${ SITE_URL }/wp/v2/media/${ id }` },
			],
			'wp:action-edit': [
				{ href: `${ SITE_URL }/wp/v2/media/${ id }` },
			],
		},
	};
}

export const MEDIA = MEDIA_FILES.map( ( item ) =>
	createMediaRecord( {
		id: item.id,
		url: `${ SITE_URL }/media/uploads/${ item.file }`,
		file: item.file,
		title: item.title,
		description: item.description,
		alt: item.alt,
	} )
);

const postTypeCapabilities = ( singular, plural ) => ( {
	edit_post: `edit_${ singular }`,
	read_post: `read_${ singular }`,
	delete_post: `delete_${ singular }`,
	edit_posts: `edit_${ plural }`,
	edit_others_posts: `edit_others_${ plural }`,
	delete_posts: `delete_${ plural }`,
	publish_posts: `publish_${ plural }`,
	read_private_posts: `read_private_${ plural }`,
	read: 'read',
	delete_private_posts: `delete_private_${ plural }`,
	delete_published_posts: `delete_published_${ plural }`,
	delete_others_posts: `delete_others_${ plural }`,
	edit_private_posts: `edit_private_${ plural }`,
	edit_published_posts: `edit_published_${ plural }`,
	create_posts: `edit_${ plural }`,
} );

const baseType = {
	description: '',
	hierarchical: false,
	viewable: true,
	labels: {
		name: '项目',
		singular_name: '项目',
		add_new: '新建',
		add_new_item: '新建项目',
		edit_item: '编辑项目',
		new_item: '新项目',
		view_item: '查看项目',
		view_items: '查看项目',
		search_items: '搜索项目',
		not_found: '未找到项目。',
		not_found_in_trash: '回收站中未找到项目。',
		parent_item_colon: '父级：',
		all_items: '全部项目',
		menu_name: '项目',
	},
	supports: {
		title: true,
		editor: true,
		author: true,
		thumbnail: true,
		excerpt: true,
		trackbacks: false,
		'custom-fields': true,
		comments: false,
		revisions: true,
		'post-formats': false,
		'page-attributes': false,
	},
	taxonomies: [],
	rest_namespace: 'wp/v2',
	visibility: {
		public: true,
		publicly_queryable: true,
		show_ui: true,
		show_in_menu: true,
		show_in_nav_menus: true,
		show_in_admin_bar: true,
		show_in_rest: true,
	},
};

export const TYPES = {
	post: {
		...baseType,
		name: 'post',
		slug: 'post',
		rest_base: 'posts',
		capabilities: postTypeCapabilities( 'post', 'posts' ),
		hierarchical: false,
		supports: { ...baseType.supports, comments: true, 'post-formats': true },
		taxonomies: [ 'category', 'post_tag' ],
		labels: {
			...baseType.labels,
			name: '文章',
			singular_name: '文章',
			view_item: '查看文章',
			view_items: '查看文章',
			item_published: '文章已发布。',
			item_published_privately: '文章已私密发布。',
			item_scheduled: '文章已定时。',
			item_updated: '文章已更新。',
			item_reverted_to_draft: '文章已恢复为草稿。',
			item_trashed: '文章已移至回收站。',
		},
	},
	page: {
		...baseType,
		name: 'page',
		slug: 'page',
		rest_base: 'pages',
		capabilities: postTypeCapabilities( 'page', 'pages' ),
		hierarchical: true,
		supports: { ...baseType.supports, 'page-attributes': true, comments: true },
		taxonomies: [ 'category', 'post_tag' ],
		labels: {
			...baseType.labels,
			name: '页面',
			singular_name: '页面',
			view_item: '查看页面',
			view_items: '查看页面',
			item_published: '页面已发布。',
			item_published_privately: '页面已私密发布。',
			item_scheduled: '页面已定时。',
			item_updated: '页面已更新。',
			item_reverted_to_draft: '页面已恢复为草稿。',
			item_trashed: '页面已移至回收站。',
		},
	},
	attachment: {
		...baseType,
		name: 'attachment',
		slug: 'attachment',
		rest_base: 'media',
		capabilities: postTypeCapabilities( 'attachment', 'media' ),
		hierarchical: false,
		supports: { title: true, editor: true, author: true, comments: true },
		taxonomies: [],
		labels: { ...baseType.labels, name: '媒体', singular_name: '媒体' },
	},
	wp_block: {
		...baseType,
		name: 'wp_block',
		slug: 'wp_block',
		rest_base: 'blocks',
		capabilities: postTypeCapabilities( 'wp_block', 'blocks' ),
		supports: { title: true, editor: true, author: false, revisions: true },
		labels: { ...baseType.labels, name: '模式', singular_name: '模式' },
	},
	wp_template: {
		...baseType,
		name: 'wp_template',
		slug: 'wp_template',
		rest_base: 'templates',
		capabilities: postTypeCapabilities( 'wp_template', 'templates' ),
		hierarchical: false,
		labels: { ...baseType.labels, name: '模板', singular_name: '模板' },
	},
	wp_template_part: {
		...baseType,
		name: 'wp_template_part',
		slug: 'wp_template_part',
		rest_base: 'template-parts',
		capabilities: postTypeCapabilities( 'wp_template_part', 'template_parts' ),
		labels: {
			...baseType.labels,
			name: '模板部件',
			singular_name: '模板部件',
		},
	},
	wp_navigation: {
		...baseType,
		name: 'wp_navigation',
		slug: 'wp_navigation',
		rest_base: 'navigation',
		capabilities: postTypeCapabilities( 'wp_navigation', 'navigation' ),
		labels: { ...baseType.labels, name: '导航', singular_name: '导航' },
	},
};

const baseTaxonomy = {
	rest_namespace: 'wp/v2',
	visibility: {
		public: true,
		publicly_queryable: true,
		show_ui: true,
		show_in_menu: true,
		show_in_nav_menus: true,
		show_in_admin_bar: true,
		show_in_rest: true,
	},
	capabilities: {
		manage_terms: 'manage_categories',
		edit_terms: 'manage_categories',
		delete_terms: 'manage_categories',
		assign_terms: 'edit_posts',
	},
	labels: {
		name: '分类',
		singular_name: '分类',
		search_items: '搜索分类',
		all_items: '全部分类',
		edit_item: '编辑分类',
		update_item: '更新分类',
		add_new_item: '新建分类',
		new_item_name: '新分类名称',
		parent_item: '父级分类',
		parent_item_colon: '父级分类：',
		menu_name: '分类',
	},
};

export const TAXONOMIES = {
	category: {
		...baseTaxonomy,
		name: 'category',
		slug: 'category',
		rest_base: 'categories',
		types: [ 'post', 'page' ],
		hierarchical: true,
	},
	post_tag: {
		...baseTaxonomy,
		name: 'post_tag',
		slug: 'post_tag',
		rest_base: 'tags',
		types: [ 'post', 'page' ],
		hierarchical: false,
		labels: {
			...baseTaxonomy.labels,
			name: '标签',
			singular_name: '标签',
			menu_name: '标签',
			search_items: '搜索标签',
			all_items: '全部标签',
			edit_item: '编辑标签',
			update_item: '更新标签',
			add_new_item: '新建标签',
			new_item_name: '新标签名称',
		},
	},
	wp_pattern_category: {
		...baseTaxonomy,
		name: 'wp_pattern_category',
		slug: 'wp_pattern_category',
		rest_base: 'wp_pattern_category',
		types: [ 'wp_block' ],
		hierarchical: false,
		labels: {
			...baseTaxonomy.labels,
			name: '模式分类',
			singular_name: '模式分类',
		},
	},
};

export const THEME = {
	stylesheet: 'wporg-gutenberg',
	template: 'blockbase',
	name: { raw: '本地主题', rendered: '本地主题' },
	description: { raw: '', rendered: '' },
	author: { raw: '本地站点', rendered: '本地站点' },
	version: '1.0.1',
	status: 'active',
	is_block_theme: true,
	textdomain: 'wporg-gutenberg',
	theme_supports: {
		'align-wide': true,
		'automatic-feed-links': true,
		'editor-styles': true,
		html5: [ 'comment-form', 'comment-list', 'search-form', 'gallery', 'caption', 'style', 'script' ],
		'post-thumbnails': true,
		'responsive-embeds': true,
	},
	_links: {
		'wp:user-global-styles': [
			{ href: `${ SITE_URL }/wp/v2/global-styles/100` },
		],
	},
};

export const GLOBAL_STYLES_ID = 100;

export const GLOBAL_STYLES = {
	id: GLOBAL_STYLES_ID,
	title: { raw: '自定义样式', rendered: '自定义样式' },
	styles: {},
	settings: {},
	_links: {},
};

export const BASE = {
	description: '独立编辑器',
	gmt_offset: 8,
	home: SITE_URL,
	name: '站点',
	site_icon: null,
	site_icon_url: '/favicon.svg',
	site_logo: 0,
	timezone_string: 'Asia/Shanghai',
	url: SITE_URL,
	page_for_posts: 0,
	page_on_front: 0,
	show_on_front: 'posts',
	image_sizes: {},
	image_size_threshold: 2560,
	image_strip_meta: true,
	image_max_bit_depth: 16,
	generate_animated_image_subsizes: false,
};

export const SITE_SETTINGS = {
	title: '站点',
	description: '独立编辑器',
	url: SITE_URL,
	email: 'admin@example.com',
	timezone: 'Asia/Shanghai',
	date_format: 'Y年n月j日',
	time_format: 'H:i',
	start_of_week: 1,
	language: 'zh_CN',
	use_smilies: true,
	default_category: 1,
	default_post_format: '0',
	posts_per_page: 10,
	show_on_front: 'posts',
	page_on_front: 0,
	page_for_posts: 0,
	default_ping_status: 'open',
	default_comment_status: 'open',
};

export const CATEGORIES = [
	{ id: 1, name: '未分类', slug: 'uncategorized', taxonomy: 'category', count: 0, parent: 0, link: `${ SITE_URL }/category/uncategorized/` },
	{ id: 3, name: '技术', slug: 'tech', taxonomy: 'category', count: 12, parent: 0, link: `${ SITE_URL }/category/tech/` },
	{ id: 4, name: '前端', slug: 'frontend', taxonomy: 'category', count: 8, parent: 3, link: `${ SITE_URL }/category/frontend/` },
	{ id: 5, name: '后端', slug: 'backend', taxonomy: 'category', count: 4, parent: 3, link: `${ SITE_URL }/category/backend/` },
	{ id: 6, name: '生活随笔', slug: 'life', taxonomy: 'category', count: 6, parent: 0, link: `${ SITE_URL }/category/life/` },
	{ id: 7, name: '教程', slug: 'tutorials', taxonomy: 'category', count: 9, parent: 0, link: `${ SITE_URL }/category/tutorials/` },
];

export const TAGS = [
	{ id: 2, name: '示例标签', slug: 'example', taxonomy: 'post_tag', count: 0, link: `${ SITE_URL }/tag/example/` },
	{ id: 8, name: 'WordPress', slug: 'wordpress', taxonomy: 'post_tag', count: 5, link: `${ SITE_URL }/tag/wordpress/` },
	{ id: 9, name: 'React', slug: 'react', taxonomy: 'post_tag', count: 7, link: `${ SITE_URL }/tag/react/` },
	{ id: 10, name: 'Next.js', slug: 'nextjs', taxonomy: 'post_tag', count: 6, link: `${ SITE_URL }/tag/nextjs/` },
	{ id: 11, name: 'Go', slug: 'go', taxonomy: 'post_tag', count: 3, link: `${ SITE_URL }/tag/go/` },
	{ id: 12, name: '前端', slug: 'frontend', taxonomy: 'post_tag', count: 8, link: `${ SITE_URL }/tag/frontend/` },
	{ id: 13, name: 'CSS', slug: 'css', taxonomy: 'post_tag', count: 4, link: `${ SITE_URL }/tag/css/` },
	{ id: 14, name: '性能优化', slug: 'performance', taxonomy: 'post_tag', count: 2, link: `${ SITE_URL }/tag/performance/` },
];

export const POSTS_INDEX = {
	name: '站点',
	description: '独立编辑器',
	url: SITE_URL,
	home: SITE_URL,
	gmt_offset: 8,
	timezone_string: 'Asia/Shanghai',
	namespaces: [ 'wp/v2', 'wp/v2/block-renderer', 'wp/v2/block-types', 'wp-block-editor/v1' ],
	authentication: [],
};

export const createPost = () => ( {
	id: POST_ID,
	date: '2026-10-20T10:00:00',
	date_gmt: '2026-10-20T02:00:00',
	guid: {
		raw: `${ SITE_URL }/?page_id=${ POST_ID }`,
		rendered: `${ SITE_URL }/?page_id=${ POST_ID }`,
	},
	modified: '2026-10-20T10:00:00',
	modified_gmt: '2026-10-20T02:00:00',
	slug: 'editor-demo',
	status: 'draft',
	type: 'page',
	link: `${ SITE_URL }/?page_id=${ POST_ID }`,
	title: { raw: '使用 Gutenberg 编辑页面', rendered: '使用 Gutenberg 编辑页面' },
	content: {
		raw: POST_CONTENT,
		rendered: '',
		protected: false,
		block_version: 1,
	},
	excerpt: { raw: '', rendered: '', protected: false },
	author: 1,
	featured_media: 0,
	comment_status: 'closed',
	ping_status: 'closed',
	sticky: false,
	template: '',
	format: 'standard',
	meta: {},
	categories: [],
	tags: [],
	permalink_template: `${ SITE_URL }/%pagename%`,
	generated_slug: 'editor-demo',
	_links: {
		self: [ { href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` } ],
		'version-history': [
			{ href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }/revisions` },
		],
		'wp:action-publish': [
			{ href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` },
		],
		'wp:action-unfiltered-html': [
			{ href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` },
		],
		'wp:action-assign-author': [
			{ href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` },
		],
		'wp:action-trash': [
			{ href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` },
		],
		'wp:action-assign-categories': [
			{ href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` },
		],
		'wp:action-create-categories': [
			{ href: `${ SITE_URL }/wp/v2/categories` },
		],
		'wp:action-assign-tags': [
			{ href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` },
		],
		'wp:action-create-tags': [
			{ href: `${ SITE_URL }/wp/v2/tags` },
		],
	},
} );
