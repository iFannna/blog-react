const SITE_URL =
	typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

export const POST_ID = 97589;

const CATEGORY_ROWS = [
	{ id: 1, slug: 'uncategorized', count: 0, parent: 0 },
	{ id: 3, slug: 'tech', count: 12, parent: 0 },
	{ id: 4, slug: 'frontend', count: 8, parent: 3 },
	{ id: 5, slug: 'backend', count: 4, parent: 3 },
	{ id: 6, slug: 'life', count: 6, parent: 0 },
	{ id: 7, slug: 'tutorials', count: 9, parent: 0 },
];

const TAG_ROWS = [
	{ id: 2, slug: 'example', count: 0 },
	{ id: 8, slug: 'editor', count: 5 },
	{ id: 9, slug: 'react', count: 7 },
	{ id: 10, slug: 'nextjs', count: 6 },
	{ id: 11, slug: 'go', count: 3 },
	{ id: 12, slug: 'frontend', count: 8 },
	{ id: 13, slug: 'css', count: 4 },
	{ id: 14, slug: 'performance', count: 2 },
];

const MEDIA_ROWS = [
	{ id: 501, file: 'morning-ridge.svg' },
	{ id: 502, file: 'forest-path.svg' },
	{ id: 503, file: 'coast-line.svg' },
	{ id: 504, file: 'studio-shapes.svg' },
];

const PATTERN_CATEGORY_ROWS = [ 'featured', 'call-to-action', 'layout' ];

const PATTERN_ROWS = [
	{
		id: 101,
		name: 'demo/hero',
		categories: [ 'featured', 'call-to-action' ],
	},
	{
		id: 102,
		name: 'demo/features',
		categories: [ 'featured', 'layout' ],
	},
	{
		id: 103,
		name: 'demo/contact',
		categories: [ 'call-to-action' ],
	},
];

const REVISION_ROWS = [
	{ id: 97803, key: 'v3', date: '2026-10-20T10:00:00', date_gmt: '2026-10-20T02:00:00' },
	{ id: 97802, key: 'v2', date: '2026-10-19T15:20:00', date_gmt: '2026-10-19T07:20:00' },
	{ id: 97801, key: 'v1', date: '2026-10-18T09:30:00', date_gmt: '2026-10-18T01:30:00' },
];

const COPY = {
	zh_CN: {
		categories: {
			uncategorized: '未分类',
			tech: '技术',
			frontend: '前端',
			backend: '后端',
			life: '生活随笔',
			tutorials: '教程',
		},
		tags: {
			example: '示例标签',
			editor: '编辑器',
			react: 'React',
			nextjs: 'Next.js',
			go: 'Go',
			frontend: '前端',
			css: 'CSS',
			performance: '性能优化',
		},
		media: {
			'morning-ridge.svg': {
				title: '晨光山脊',
				description: '晨光中的山脉与天空',
				alt: '暖色天空下的层叠山脊',
			},
			'forest-path.svg': {
				title: '林间小径',
				description: '薄雾森林里的小路',
				alt: '薄雾中的森林与林间小路',
			},
			'coast-line.svg': {
				title: '海岸线',
				description: '晴朗天气下的海岸与浪花',
				alt: '蓝色海面上的海岸线与浪花',
			},
			'studio-shapes.svg': {
				title: '几何静物',
				description: '暖色背景上的几何图形',
				alt: '暖色背景上的圆形、三角形与拱形',
			},
		},
		patternCategories: {
			featured: '精选',
			'call-to-action': '行动号召',
			layout: '布局',
		},
		patterns: {
			'demo/hero': {
				title: '首屏：标题与按钮',
				description: '标题、说明文字和两个按钮组成的首屏区域。',
				content: `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">为你的下一篇博客写一个漂亮的开头</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>用标题、说明和按钮快速搭出首屏，插入后可以直接修改文字和样式。</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"url":"#"} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#">立即开始</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline","url":"#"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="#">了解更多</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`,
			},
			'demo/features': {
				title: '三栏特性介绍',
				description: '三列并排的标题与说明，适合介绍功能或服务。',
				content: `<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">快速</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>几分钟内拼出完整页面。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">一致</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>复用同一套设计语言。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">灵活</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>插入后随时调整内容和布局。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`,
			},
			'demo/contact': {
				title: '订阅与搜索',
				description: '居中的标题、说明和一个搜索框。',
				content: `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"center","level":2} -->
<h2 class="wp-block-heading has-text-align-center">保持联系</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">订阅更新，第一时间读到新文章。</p>
<!-- /wp:paragraph -->

<!-- wp:search {"label":"搜索","buttonText":"搜索"} /--></div>
<!-- /wp:group -->`,
			},
		},
		revisions: {
			v1: {
				excerpt: '第一版摘要',
				content: `<!-- wp:heading -->
<h2 class="wp-block-heading">演示内容</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这是最早的修订版本，只包含一段介绍文字。拖动顶部的修订滑块或点击右侧时间线，可以查看后续版本带来的变化。</p>
<!-- /wp:paragraph -->`,
			},
			v2: {
				excerpt: '第二版摘要',
				content: `<!-- wp:heading -->
<h2 class="wp-block-heading">演示内容</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这是第二版正文：编辑器的字数统计会随正文实时更新，右侧摘要与讨论设置已经改为 DataForm 行。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这个版本还没有加入底部的列表区块，可以用来对比第三次修订的差异。</p>
<!-- /wp:paragraph -->`,
			},
			v3: {
				excerpt: '',
				content: `<!-- wp:heading -->
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
<!-- /wp:list -->`,
			},
		},
		post: {
			title: '使用 Gutenberg 编辑页面',
			slug: 'editor-demo',
		},
		site: {
			name: '站点',
			description: '独立编辑器',
		},
		theme: {
			name: '本地主题',
			author: '本地站点',
		},
		globalStyles: {
			title: '自定义样式',
		},
		user: {
			name: '管理员',
			nickname: '管理员',
			locale: 'zh_CN',
		},
		dateFormat: 'Y年n月j日',
	},
	en_US: {
		categories: {
			uncategorized: 'Uncategorized',
			tech: 'Technology',
			frontend: 'Frontend',
			backend: 'Backend',
			life: 'Life',
			tutorials: 'Tutorials',
		},
		tags: {
			example: 'Example',
			editor: 'Editor',
			react: 'React',
			nextjs: 'Next.js',
			go: 'Go',
			frontend: 'Frontend',
			css: 'CSS',
			performance: 'Performance',
		},
		media: {
			'morning-ridge.svg': {
				title: 'Morning Ridge',
				description: 'Mountains and sky in the morning light',
				alt: 'Layered ridges under a warm sky',
			},
			'forest-path.svg': {
				title: 'Forest Path',
				description: 'A path through a misty forest',
				alt: 'A misty forest with a path between the trees',
			},
			'coast-line.svg': {
				title: 'Coastline',
				description: 'Coast and waves on a clear day',
				alt: 'A coastline and waves on a blue sea',
			},
			'studio-shapes.svg': {
				title: 'Geometric Still Life',
				description: 'Shapes on a warm background',
				alt: 'Circles, triangles, and arches on a warm background',
			},
		},
		patternCategories: {
			featured: 'Featured',
			'call-to-action': 'Call to Action',
			layout: 'Layout',
		},
		patterns: {
			'demo/hero': {
				title: 'Hero: heading and buttons',
				description: 'A hero section with a heading, description, and two buttons.',
				content: `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Write a beautiful intro for your next post</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Use a heading, description, and buttons to quickly build a hero section. After inserting, you can edit the text and styles directly.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"url":"#"} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#">Get started</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline","url":"#"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="#">Learn more</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`,
			},
			'demo/features': {
				title: 'Three-column features',
				description: 'Three side-by-side headings and descriptions for features or services.',
				content: `<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Fast</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Build a complete page in minutes.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Consistent</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Reuse the same design language.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Flexible</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Adjust content and layout anytime after inserting.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`,
			},
			'demo/contact': {
				title: 'Subscribe and search',
				description: 'A centered heading, description, and search field.',
				content: `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"center","level":2} -->
<h2 class="wp-block-heading has-text-align-center">Stay in touch</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Subscribe for updates and be the first to read new posts.</p>
<!-- /wp:paragraph -->

<!-- wp:search {"label":"Search","buttonText":"Search"} /--></div>
<!-- /wp:group -->`,
			},
		},
		revisions: {
			v1: {
				excerpt: 'First draft excerpt',
				content: `<!-- wp:heading -->
<h2 class="wp-block-heading">Demo content</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This is the earliest revision, with only an introductory paragraph. Drag the revision slider at the top or click a point on the timeline to see what later versions changed.</p>
<!-- /wp:paragraph -->`,
			},
			v2: {
				excerpt: 'Second draft excerpt',
				content: `<!-- wp:heading -->
<h2 class="wp-block-heading">Demo content</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This is the second version: the word count updates as you type, and the excerpt and discussion settings now use DataForm rows.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This version does not have the list block at the bottom yet, which makes it easy to compare against the third revision.</p>
<!-- /wp:paragraph -->`,
			},
			v3: {
				excerpt: '',
				content: `<!-- wp:heading -->
<h2 class="wp-block-heading">Demo content</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This text demonstrates the Gutenberg editor canvas. You can type, delete, or rearrange blocks right here, and the word count and reading time in the sidebar update as you edit.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The editor supports headings, paragraphs, lists, images, quotes, and many other blocks. Use the plus button in the top-left corner to open the block inserter, or press Enter in the canvas to add a block.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item --><li>The excerpt, categories, and tags appear in the document settings on the right.</li><!-- /wp:list-item --><!-- wp:list-item --><li>The discussion panel toggles whether comments are allowed.</li><!-- /wp:list-item --><!-- wp:list-item --><li>Click the publish button in the top-right corner to open the pre-publish panel.</li><!-- /wp:list-item --></ul>
<!-- /wp:list -->`,
			},
		},
		post: {
			title: 'Edit a page with Gutenberg',
			slug: 'editor-demo',
		},
		site: {
			name: 'Site',
			description: 'Standalone editor',
		},
		theme: {
			name: 'Local theme',
			author: 'Local site',
		},
		globalStyles: {
			title: 'Custom styles',
		},
		user: {
			name: 'Admin',
			nickname: 'Admin',
			locale: 'en_US',
		},
		dateFormat: 'F j, Y',
	},
};

const TYPE_LABELS = {
	zh_CN: {
		base: {
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
		post: {
			name: '文章',
			singular_name: '文章',
			add_new_item: '新建文章',
			edit_item: '编辑文章',
			new_item: '新文章',
			view_item: '查看文章',
			view_items: '查看文章',
			search_items: '搜索文章',
			not_found: '未找到文章。',
			not_found_in_trash: '回收站中未找到文章。',
			all_items: '全部文章',
			menu_name: '文章',
			item_published: '文章已发布。',
			item_published_privately: '文章已私密发布。',
			item_scheduled: '文章已定时。',
			item_updated: '文章已更新。',
			item_reverted_to_draft: '文章已恢复为草稿。',
			item_trashed: '文章已移至回收站。',
		},
		page: {
			name: '页面',
			singular_name: '页面',
			add_new_item: '新建页面',
			edit_item: '编辑页面',
			new_item: '新页面',
			view_item: '查看页面',
			view_items: '查看页面',
			search_items: '搜索页面',
			not_found: '未找到页面。',
			not_found_in_trash: '回收站中未找到页面。',
			all_items: '全部页面',
			menu_name: '页面',
			item_published: '页面已发布。',
			item_published_privately: '页面已私密发布。',
			item_scheduled: '页面已定时。',
			item_updated: '页面已更新。',
			item_reverted_to_draft: '页面已恢复为草稿。',
			item_trashed: '页面已移至回收站。',
		},
		attachment: { name: '媒体', singular_name: '媒体' },
		wp_block: { name: '模式', singular_name: '模式' },
		wp_template: { name: '模板', singular_name: '模板' },
		wp_template_part: { name: '模板部件', singular_name: '模板部件' },
		wp_navigation: { name: '导航', singular_name: '导航' },
	},
	en_US: {
		base: {
			name: 'Items',
			singular_name: 'Item',
			add_new: 'Add New',
			add_new_item: 'Add New Item',
			edit_item: 'Edit Item',
			new_item: 'New Item',
			view_item: 'View Item',
			view_items: 'View Items',
			search_items: 'Search Items',
			not_found: 'No items found.',
			not_found_in_trash: 'No items found in Trash.',
			parent_item_colon: 'Parent:',
			all_items: 'All Items',
			menu_name: 'Items',
		},
		post: {
			name: 'Posts',
			singular_name: 'Post',
			add_new_item: 'Add New Post',
			edit_item: 'Edit Post',
			new_item: 'New Post',
			view_item: 'View post',
			view_items: 'View posts',
			search_items: 'Search Posts',
			not_found: 'No posts found.',
			not_found_in_trash: 'No posts found in Trash.',
			all_items: 'All Posts',
			menu_name: 'Posts',
			item_published: 'Post published.',
			item_published_privately: 'Post published privately.',
			item_scheduled: 'Post scheduled.',
			item_updated: 'Post updated.',
			item_reverted_to_draft: 'Post reverted to draft.',
			item_trashed: 'Post moved to trash.',
		},
		page: {
			name: 'Pages',
			singular_name: 'Page',
			add_new_item: 'Add New Page',
			edit_item: 'Edit Page',
			new_item: 'New Page',
			view_item: 'View page',
			view_items: 'View pages',
			search_items: 'Search Pages',
			not_found: 'No pages found.',
			not_found_in_trash: 'No pages found in Trash.',
			all_items: 'All Pages',
			menu_name: 'Pages',
			item_published: 'Page published.',
			item_published_privately: 'Page published privately.',
			item_scheduled: 'Page scheduled.',
			item_updated: 'Page updated.',
			item_reverted_to_draft: 'Page reverted to draft.',
			item_trashed: 'Page moved to trash.',
		},
		attachment: { name: 'Media', singular_name: 'Media' },
		wp_block: { name: 'Patterns', singular_name: 'Pattern' },
		wp_template: { name: 'Templates', singular_name: 'Template' },
		wp_template_part: { name: 'Template Parts', singular_name: 'Template Part' },
		wp_navigation: { name: 'Navigation', singular_name: 'Navigation' },
	},
};

const TAXONOMY_LABELS = {
	zh_CN: {
		base: {
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
		post_tag: {
			name: '标签',
			singular_name: '标签',
			menu_name: '标签',
			search_items: '搜索标签',
			all_items: '全部标签',
			edit_item: '编辑标签',
			update_item: '更新标签',
			add_new_item: '新建标签',
			new_item_name: '新标签名称',
			parent_item: '父级标签',
			parent_item_colon: '父级标签：',
		},
	},
	en_US: {
		base: {
			name: 'Categories',
			singular_name: 'Category',
			search_items: 'Search Categories',
			all_items: 'All Categories',
			edit_item: 'Edit Category',
			update_item: 'Update Category',
			add_new_item: 'Add New Category',
			new_item_name: 'New Category Name',
			parent_item: 'Parent Category',
			parent_item_colon: 'Parent Category:',
			menu_name: 'Categories',
		},
		post_tag: {
			name: 'Tags',
			singular_name: 'Tag',
			menu_name: 'Tags',
			search_items: 'Search Tags',
			all_items: 'All Tags',
			edit_item: 'Edit Tag',
			update_item: 'Update Tag',
			add_new_item: 'Add New Tag',
			new_item_name: 'New Tag Name',
			parent_item: 'Parent Tag',
			parent_item_colon: 'Parent Tag:',
		},
	},
};

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

const TYPE_ROWS = {
	post: {
		rest_base: 'posts',
		capabilities: [ 'post', 'posts' ],
		hierarchical: false,
		supports: { comments: true, 'post-formats': true },
		taxonomies: [ 'category', 'post_tag' ],
	},
	page: {
		rest_base: 'pages',
		capabilities: [ 'page', 'pages' ],
		hierarchical: true,
		supports: { 'page-attributes': true, comments: true },
		taxonomies: [ 'category', 'post_tag' ],
	},
	attachment: {
		rest_base: 'media',
		capabilities: [ 'attachment', 'media' ],
		supports: { comments: true, excerpt: false, thumbnail: false, revisions: false },
	},
	wp_block: {
		rest_base: 'blocks',
		capabilities: [ 'wp_block', 'blocks' ],
		supports: { author: false },
	},
	wp_template: {
		rest_base: 'templates',
		capabilities: [ 'wp_template', 'templates' ],
	},
	wp_template_part: {
		rest_base: 'template-parts',
		capabilities: [ 'wp_template_part', 'template_parts' ],
	},
	wp_navigation: {
		rest_base: 'navigation',
		capabilities: [ 'wp_navigation', 'navigation' ],
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
};

const TAXONOMY_ROWS = {
	category: {
		slug: 'category',
		rest_base: 'categories',
		types: [ 'post', 'page' ],
		hierarchical: true,
	},
	post_tag: {
		name: 'tag',
		slug: 'post_tag',
		rest_base: 'tags',
		types: [ 'post', 'page' ],
		hierarchical: false,
	},
};

function buildTypes( locale ) {
	const labels = TYPE_LABELS[ locale ];
	return Object.fromEntries(
		Object.entries( TYPE_ROWS ).map( ( [ name, row ] ) => {
			const { capabilities: [ singular, plural ], supports, ...rest } = row;
			return [
				name,
				{
					...baseType,
					name,
					slug: name,
					capabilities: postTypeCapabilities( singular, plural ),
					supports: { ...baseType.supports, ...supports },
					...rest,
					labels: { ...labels.base, ...( labels[ name ] || {} ) },
				},
			];
		} )
	);
}

function buildTaxonomies( locale ) {
	const labels = TAXONOMY_LABELS[ locale ];
	return Object.fromEntries(
		Object.entries( TAXONOMY_ROWS ).map( ( [ name, row ] ) => [
			name,
			{
				...baseTaxonomy,
				name,
				...row,
				labels: { ...labels.base, ...( labels[ name ] || {} ) },
			},
		] )
	);
}

function createMediaRecord(
	{
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
	},
	user
) {
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
		author: user.id,
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
					id: user.id,
					name: user.name,
					url: user.url,
					description: user.description,
					link: user.link,
					slug: user.slug,
					avatar_urls: user.avatar_urls,
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
			author: [ { href: `${ SITE_URL }/wp/v2/users/${ user.id }` } ],
			'wp:action-delete': [
				{ href: `${ SITE_URL }/wp/v2/media/${ id }` },
			],
			'wp:action-edit': [
				{ href: `${ SITE_URL }/wp/v2/media/${ id }` },
			],
		},
	};
}

export function createMockData( locale = 'zh_CN' ) {
	const copy = COPY[ locale ] ?? COPY.zh_CN;
	const user = {
		id: 1,
		username: 'admin',
		name: copy.user.name,
		first_name: '',
		last_name: '',
		email: 'admin@example.com',
		url: '',
		description: '',
		link: `${ SITE_URL }/author/admin/`,
		locale: copy.user.locale,
		nickname: copy.user.nickname,
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

	const categories = CATEGORY_ROWS.map( ( row ) => ( {
		id: row.id,
		name: copy.categories[ row.slug ] ?? row.slug,
		slug: row.slug,
		taxonomy: 'category',
		count: row.count,
		parent: row.parent,
		link: `${ SITE_URL }/category/${ row.slug }/`,
	} ) );

	const tags = TAG_ROWS.map( ( row ) => ( {
		id: row.id,
		name: copy.tags[ row.slug ] ?? row.slug,
		slug: row.slug,
		taxonomy: 'post_tag',
		count: row.count,
		link: `${ SITE_URL }/tag/${ row.slug }/`,
	} ) );

	const media = MEDIA_ROWS.map( ( row ) => {
		const text = copy.media[ row.file ] ?? {};
		return createMediaRecord(
			{
				id: row.id,
				url: `${ SITE_URL }/media/uploads/${ row.file }`,
				file: row.file,
				title: text.title ?? row.file,
				description: text.description ?? '',
				alt: text.alt ?? '',
			},
			user
		);
	} );

	const blockPatternCategories = PATTERN_CATEGORY_ROWS.map( ( name ) => ( {
		name,
		label: copy.patternCategories[ name ] ?? name,
	} ) );

	const blockPatterns = PATTERN_ROWS.map( ( row ) => {
		const pattern = copy.patterns[ row.name ] ?? {};
		return {
			id: row.id,
			name: row.name,
			title: pattern.title ?? row.name,
			description: pattern.description ?? '',
			categories: row.categories,
			viewport_width: 1200,
			block_types: [],
			post_types: [ 'page' ],
			source: 'theme',
			inserter: true,
			content: pattern.content ?? '',
		};
	} );

	const revisions = REVISION_ROWS.map( ( row ) => {
		const revision = copy.revisions[ row.key ] ?? {};
		return {
			id: row.id,
			parent: POST_ID,
			author: 1,
			date: row.date,
			date_gmt: row.date_gmt,
			modified: row.date,
			modified_gmt: row.date_gmt,
			slug: `${ POST_ID }-revision-${ row.key }`,
			title: { raw: copy.post.title, rendered: copy.post.title },
			content: {
				raw: revision.content ?? '',
				rendered: '',
				protected: false,
				block_version: 1,
			},
			excerpt: { raw: revision.excerpt ?? '', rendered: '', protected: false },
			meta: {},
		};
	} );

	const base = {
		description: copy.site.description,
		gmt_offset: 8,
		home: SITE_URL,
		name: copy.site.name,
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

	const siteSettings = {
		title: copy.site.name,
		description: copy.site.description,
		url: SITE_URL,
		email: 'admin@example.com',
		timezone: 'Asia/Shanghai',
		date_format: copy.dateFormat,
		time_format: 'H:i',
		start_of_week: 1,
		language: copy.user.locale,
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

	const post = {
		id: POST_ID,
		date: '2026-10-20T10:00:00',
		date_gmt: '2026-10-20T02:00:00',
		guid: {
			raw: `${ SITE_URL }/?page_id=${ POST_ID }`,
			rendered: `${ SITE_URL }/?page_id=${ POST_ID }`,
		},
		modified: '2026-10-20T10:00:00',
		modified_gmt: '2026-10-20T02:00:00',
		slug: copy.post.slug,
		status: 'draft',
		type: 'page',
		link: `${ SITE_URL }/?page_id=${ POST_ID }`,
		title: { raw: copy.post.title, rendered: copy.post.title },
		content: {
			raw: '',
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
		generated_slug: copy.post.slug,
		_links: {
			self: [ { href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }` } ],
			'version-history': [
				{
					href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }/revisions`,
					count: revisions.length,
				},
			],
			'predecessor-version': [
				{
					href: `${ SITE_URL }/wp/v2/pages/${ POST_ID }/revisions/${ revisions[ 0 ].id }`,
					id: revisions[ 0 ].id,
				},
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
	};

	return {
		categories,
		tags,
		media,
		user,
		types: buildTypes( locale ),
		taxonomies: buildTaxonomies( locale ),
		blockPatternCategories,
		blockPatterns,
		revisions,
		base,
		siteSettings,
		postsIndex: {
			name: copy.site.name,
			description: copy.site.description,
			url: SITE_URL,
			home: SITE_URL,
			gmt_offset: 8,
			timezone_string: 'Asia/Shanghai',
			namespaces: [ 'wp/v2', 'wp/v2/block-renderer', 'wp/v2/block-types', 'wp-block-editor/v1' ],
			authentication: [],
		},
		theme: {
			stylesheet: 'wporg-gutenberg',
			template: 'blockbase',
			name: { raw: copy.theme.name, rendered: copy.theme.name },
			description: { raw: '', rendered: '' },
			author: { raw: copy.theme.author, rendered: copy.theme.author },
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
		},
		globalStyles: {
			id: 100,
			title: { raw: copy.globalStyles.title, rendered: copy.globalStyles.title },
			styles: {},
			settings: {},
			_links: {},
		},
		post,
		createMediaRecord: ( overrides ) => createMediaRecord( overrides, user ),
	};
}
