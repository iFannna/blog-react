import apiFetch from '@/services/gutenberg/api-fetch';
import {
	BASE,
	CATEGORIES,
	GLOBAL_STYLES,
	GLOBAL_STYLES_ID,
	MEDIA,
	POST_ID,
	POSTS_INDEX,
	SITE_SETTINGS,
	TAGS,
	TAXONOMIES,
	THEME,
	TYPES,
	USER,
	createMediaRecord,
	createPost,
} from './data.js';
import themeGlobalStyles from '@/lib/gutenberg/fixtures/theme.json';

const ALLOW_HEADER = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const SETTINGS_SCHEMA = {
	schema: {
		properties: {
			title: { type: 'string', title: 'Title' },
			description: { type: 'string', title: 'Tagline' },
			url: { type: 'string', title: 'Site URL' },
		},
	},
};

function normalize( options ) {
	let raw = options.path || options.url || '/';
	if ( /^https?:/i.test( raw ) ) {
		const url = new URL( raw );
		raw = url.pathname + url.search;
	}
	const [ pathname, search = '' ] = raw.split( '?' );
	return { pathname, query: new URLSearchParams( search ) };
}

function readFileAsDataURL( file ) {
	return new Promise( ( resolve, reject ) => {
		const reader = new FileReader();
		reader.onload = () => resolve( reader.result );
		reader.onerror = () => reject( reader.error );
		reader.readAsDataURL( file );
	} );
}

function getImageDimensions( url ) {
	return new Promise( ( resolve ) => {
		const image = new Image();
		image.onload = () =>
			resolve( {
				width: image.naturalWidth || 1200,
				height: image.naturalHeight || 800,
			} );
		image.onerror = () => resolve( { width: 1200, height: 800 } );
		image.src = url;
	} );
}

function mergePost( post, data = {} ) {
	const next = { ...post };
	for ( const [ key, value ] of Object.entries( data ) ) {
		next[ key ] = value;
	}
	const now = new Date().toISOString().replace( /\.\d+Z$/, '' );
	next.modified = now;
	next.modified_gmt = now;
	return next;
}

function toString( value ) {
	return JSON.stringify( value ?? null );
}

let mockLocale = 'zh_CN';
const isEnglish = () => mockLocale === 'en_US';

const EN_TYPE_LABELS = {
	post: {
		name: 'Posts',
		singular_name: 'Post',
		view_item: 'View post',
		view_items: 'View posts',
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
		view_item: 'View page',
		view_items: 'View pages',
		item_published: 'Page published.',
		item_published_privately: 'Page published privately.',
		item_scheduled: 'Page scheduled.',
		item_updated: 'Page updated.',
		item_reverted_to_draft: 'Page reverted to draft.',
		item_trashed: 'Page moved to trash.',
	},
	attachment: { name: 'Media', singular_name: 'Media' },
	wp_block: { name: 'Patterns', singular_name: 'Pattern' },
};

function localizeTypes( types ) {
	if ( ! isEnglish() ) {
		return types;
	}
	return Object.fromEntries(
		Object.entries( types ).map( ( [ key, type ] ) => [
			key,
			type?.labels
				? { ...type, labels: { ...type.labels, ...( EN_TYPE_LABELS[ key ] || {} ) } }
				: type,
		] )
	);
}

function localizeUser( user ) {
	return isEnglish()
		? { ...user, name: 'Admin', nickname: 'Admin', locale: 'en_US' }
		: user;
}

export function installMockApi( locale = 'zh_CN' ) {
	mockLocale = locale;
	let post = createPost();
	try {
		const persisted = JSON.parse(
			localStorage.getItem( 'gutenberg-editor-post' ) || 'null'
		);
		if ( persisted ) {
			post = { ...post, ...persisted };
			// Drop the old demo brand from already-persisted state.
			if ( post.slug === 'gutenberg-editor-demo' ) {
				post.slug = 'editor-demo';
			}
		}
	} catch {
		// Ignore corrupted demo state.
	}

	const persist = () => {
		localStorage.setItem(
			'gutenberg-editor-post',
			JSON.stringify( {
				title: post.title,
				content: post.content,
				excerpt: post.excerpt,
				status: post.status,
				slug: post.slug,
				comment_status: post.comment_status,
				ping_status: post.ping_status,
				categories: post.categories,
				tags: post.tags,
				modified: post.modified,
			} )
		);
	};

	const uploadedMedia = [];
	let nextMediaId = 600;
	let nextTermId = 100;

	const handler = async ( options ) => {
		const method = ( options.method || 'GET' ).toUpperCase();
		const wantsRawResponse = options.parse === false;
		const { pathname, query } = normalize( options );

		// OPTIONS: `canUser` reads the Allow header (parse: false), while the
		// site entity loader reads the schema body (parse: true).
		if ( method === 'OPTIONS' ) {
			if ( ! wantsRawResponse && pathname === '/wp/v2/settings' ) {
				return Promise.resolve( SETTINGS_SCHEMA );
			}
			return Promise.resolve(
				new Response( null, {
					status: 200,
					headers: { allow: ALLOW_HEADER },
				} )
			);
		}

		if ( process.env.NODE_ENV !== 'production' ) {
			// eslint-disable-next-line no-console
			console.info(
				'[mock]',
				method,
				pathname + ( query.toString() ? `?${ query }` : '' )
			);
		}

		const respond = ( payload, allow = ALLOW_HEADER ) => {
			if ( ! wantsRawResponse ) {
				return Promise.resolve( payload );
			}
			const headers = {
				allow,
				'Content-Type': 'application/json',
			};
			if ( Array.isArray( payload ) ) {
				headers[ 'X-WP-Total' ] = String( payload.length );
				headers[ 'X-WP-TotalPages' ] = '1';
			}
			return Promise.resolve(
				new Response( toString( payload ), {
					status: 200,
					headers,
				} )
			);
		};

		const notFound = () => {
			if ( wantsRawResponse ) {
				return Promise.resolve(
					new Response(
						toString( {
							code: 'rest_no_route',
							message: 'No route was found matching the URL and request method.',
							data: { status: 404 },
						} ),
						{
							status: 404,
							headers: { 'Content-Type': 'application/json' },
						}
					)
				);
			}
			return Promise.reject( {
				code: 'rest_no_route',
				message: 'No route was found matching the URL and request method.',
				data: { status: 404 },
			} );
		};

		// REST root (base entity).
		if ( pathname === '/' || pathname === '' ) {
			return respond( BASE );
		}
		if ( pathname === '/wp/v2' || pathname === '/wp/v2/' ) {
			return respond( POSTS_INDEX );
		}

		// Users.
		if ( pathname === '/wp/v2/users/me' ) {
			return respond( localizeUser( USER ) );
		}
		if ( pathname === '/wp/v2/users' ) {
			return respond( [ localizeUser( USER ) ] );
		}

		// Post types & taxonomies (collection and single record).
		if ( pathname === '/wp/v2/types' ) {
			return respond( localizeTypes( TYPES ) );
		}
		const typeMatch = pathname.match( /^\/wp\/v2\/types\/([^/]+)$/ );
		if ( typeMatch ) {
			return respond( localizeTypes( TYPES )[ typeMatch[ 1 ] ] ?? {} );
		}
		if ( pathname === '/wp/v2/taxonomies' ) {
			return respond( TAXONOMIES );
		}
		const taxonomyMatch = pathname.match( /^\/wp\/v2\/taxonomies\/([^/]+)$/ );
		if ( taxonomyMatch ) {
			return respond( TAXONOMIES[ taxonomyMatch[ 1 ] ] ?? {} );
		}

		// Themes & global styles.
		if ( pathname === '/wp/v2/themes' ) {
			return respond( [ THEME ] );
		}
		if ( /^\/wp\/v2\/global-styles\/themes\/[^/]+\/variations$/.test( pathname ) ) {
			return respond( [] );
		}
		if ( /^\/wp\/v2\/global-styles\/themes\/[^/]+$/.test( pathname ) ) {
			// Base theme.json config. The editor merges this into
			// __experimentalFeatures; returning empty settings makes it forget
			// the color palette and breaks preset overlay colors, etc.
			return respond( themeGlobalStyles );
		}
		if ( pathname === `/wp/v2/global-styles/${ GLOBAL_STYLES_ID }` ) {
			if ( method === 'GET' ) {
				return respond( GLOBAL_STYLES );
			}
			return respond( GLOBAL_STYLES );
		}
		if ( pathname === `/wp/v2/global-styles/${ GLOBAL_STYLES_ID }/revisions` ) {
			return respond( [] );
		}

		// Patterns.
		if ( pathname === '/wp/v2/block-patterns/categories' ) {
			return respond( [] );
		}
		if ( pathname === '/wp/v2/block-patterns/patterns' ) {
			return respond( [] );
		}
		if ( pathname === '/wp/v2/wp_pattern_category' ) {
			return respond( method === 'GET' ? [] : {} );
		}

		// Site settings.
		if ( pathname === '/wp/v2/settings' ) {
			if ( method === 'GET' ) {
				return respond( SITE_SETTINGS );
			}
			return respond( { ...SITE_SETTINGS, ...( options.data || {} ) } );
		}

		// Editor package endpoints.
		if ( pathname === '/wp-block-editor/v1/settings' ) {
			return respond( {} );
		}
		if ( pathname === '/wp-block-editor/v1/assets' ) {
			return respond( {} );
		}

		// Server-registered view/fields/actions config (WP 7.x).
		if ( pathname === '/wp/v2/view-config' ) {
			return respond( {
				form: {
					layout: { type: 'panel' },
					fields: [
						{
							id: 'excerpt',
							layout: {
								type: 'panel',
								labelPosition: 'top',
								summary: 'excerpt',
								showPlaceholderIfEmpty: true,
							},
						},
						{
							id: 'status',
							label: isEnglish() ? 'Status' : '状态',
							layout: { type: 'panel', summary: 'status' },
							children: [
								{
									id: 'status',
									layout: {
										type: 'regular',
										labelPosition: 'none',
									},
								},
								'scheduled_date',
								'password',
								'sticky',
							],
						},
						'date',
						'author',
						{
							id: 'discussion',
							label: '讨论',
							children: [ 'comment_status' ],
							layout: { type: 'panel', summary: 'discussion' },
						},
					],
				},
			} );
		}
		if ( pathname === '/wp/v2/entity-fields' ) {
			const commentStatusElements = isEnglish()
				? [
						{
							value: 'open',
							label: 'Open',
							description:
								'Visitors can add new comments and replies.',
						},
						{
							value: 'closed',
							label: 'Closed',
							description:
								'Visitors cannot add new comments or replies. Existing comments remain visible.',
						},
				  ]
				: [
						{
							value: 'open',
							label: '开放',
							description: '访客可以添加新评论和回复。',
						},
						{
							value: 'closed',
							label: '已关闭',
							description:
								'访客无法添加新评论或回复。现有评论保持可见。',
						},
				  ];
			return respond( {
				kind: query.get( 'kind' ),
				name: query.get( 'name' ),
				fields: [
					{
						id: 'status',
						type: 'text',
						label: isEnglish() ? 'Status' : '状态',
						elements: isEnglish()
							? [
									{ value: 'draft', label: 'Draft' },
									{ value: 'pending', label: 'Pending' },
									{ value: 'publish', label: 'Published' },
									{ value: 'future', label: 'Scheduled' },
									{ value: 'private', label: 'Private' },
							  ]
							: [
									{ value: 'draft', label: '草稿' },
									{ value: 'pending', label: '待审' },
									{ value: 'publish', label: '已发布' },
									{ value: 'future', label: '定时' },
									{ value: 'private', label: '私密' },
							  ],
					},
					{ id: 'date', type: 'datetime', label: isEnglish() ? 'Date' : '日期' },
					{
						id: 'author',
						type: 'integer',
						label: isEnglish() ? 'Author' : '作者',
						elements: [
							{ value: 1, label: isEnglish() ? 'Admin' : '管理员' },
						],
					},
					{
						id: 'excerpt',
						type: 'text',
						label: isEnglish() ? 'Excerpt' : '摘要',
						placeholder: isEnglish()
							? 'Add an excerpt…'
							: '添加摘要…',
						Edit: { control: 'textarea', rows: 3 },
					},
					{
						id: 'comment_status',
						type: 'text',
						label: isEnglish() ? 'Comment status' : '评论状态',
						Edit: 'radio',
						elements: commentStatusElements,
					},
					{
						id: 'discussion',
						type: 'text',
						label: isEnglish() ? 'Discussion' : '讨论',
						render: ( { item } ) => {
							const commentsOpen =
								item.comment_status === 'open';
							if ( isEnglish() ) {
								return commentsOpen
									? 'Comments only'
									: 'Comments closed';
							}
							return commentsOpen ? '开放' : '已关闭';
						},
					},
				],
				script_modules: [],
			} );
		}
		if ( pathname === '/wp/v2/entity-actions' ) {
			return respond( {
				kind: query.get( 'kind' ),
				name: query.get( 'name' ),
				actions: [],
				script_modules: [],
			} );
		}

		// Template lookup.
		if ( pathname === '/wp/v2/templates/lookup' ) {
			return respond( {} );
		}

		// Terms.
		if (
			pathname === '/wp/v2/categories' ||
			pathname === '/wp/v2/tags'
		) {
			const isCategory = pathname === '/wp/v2/categories';
			if ( method === 'POST' ) {
				const name = options.data?.name || '';
				const slug = options.data?.slug || name;
				const term = {
					id: nextTermId++,
					name,
					slug,
					taxonomy: isCategory ? 'category' : 'post_tag',
					count: 0,
					...( isCategory
						? { parent: options.data?.parent || 0 }
						: {} ),
				};
				( isCategory ? CATEGORIES : TAGS ).push( term );
				return respond( term );
			}
			return respond( isCategory ? CATEGORIES : TAGS );
		}
		const termMatch = pathname.match( /^\/wp\/v2\/(categories|tags)\/(\d+)$/ );
		if ( termMatch ) {
			const terms = termMatch[ 1 ] === 'categories' ? CATEGORIES : TAGS;
			return respond(
				terms.find( ( term ) => String( term.id ) === termMatch[ 2 ] ) || {}
			);
		}

		// Media.
		if ( pathname === '/wp/v2/media' && method === 'POST' ) {
			const file = options.body?.get?.( 'file' );
			if ( ! ( file instanceof File ) ) {
				return respond( {
					code: 'rest_invalid_param',
					message: '缺少要上传的文件。',
				} );
			}
			const url = await readFileAsDataURL( file );
			const dimensions = await getImageDimensions( url );
			const title = file.name.replace( /\.[^.]+$/, '' );
			const item = createMediaRecord( {
				id: nextMediaId++,
				url,
				file: file.name,
				title,
				alt: title,
				mimeType: file.type || 'image/png',
				width: dimensions.width,
				height: dimensions.height,
				filesize: file.size,
			} );
			uploadedMedia.unshift( item );
			return respond( item );
		}
		if ( pathname === '/wp/v2/media' && method === 'GET' ) {
			let items = [ ...uploadedMedia, ...MEDIA ];
			const include = query.get( 'include' );
			if ( include ) {
				const ids = include.split( ',' );
				items = items.filter( ( item ) =>
					ids.includes( String( item.id ) )
				);
			}
			const mediaType = query.get( 'media_type' );
			if ( mediaType ) {
				const types = mediaType.split( ',' );
				items = items.filter( ( item ) =>
					types.includes( item.media_type )
				);
			}
			const mimeType = query.get( 'mime_type' );
			if ( mimeType ) {
				const types = mimeType.split( ',' );
				items = items.filter( ( item ) =>
					types.some( ( type ) =>
						type.endsWith( '/*' )
							? item.mime_type.startsWith(
									type.replace( /\*$/, '' )
							  )
							: item.mime_type === type
					)
				);
			}
			const search = query.get( 'search' );
			if ( search ) {
				const term = search.toLowerCase();
				items = items.filter(
					( item ) =>
						item.title.raw.toLowerCase().includes( term ) ||
						item.alt_text.toLowerCase().includes( term )
				);
			}
			const perPage = Number( query.get( 'per_page' ) ) || 10;
			if ( perPage > 0 ) {
				items = items.slice( 0, perPage );
			}
			return respond( items );
		}
		const mediaMatch = pathname.match( /^\/wp\/v2\/media\/(\d+)$/ );
		if ( mediaMatch && method === 'GET' ) {
			const item = [ ...uploadedMedia, ...MEDIA ].find(
				( media ) => String( media.id ) === mediaMatch[ 1 ]
			);
			return item ? respond( item ) : notFound();
		}

		// Revisions and autosaves for the edited page.
		if ( pathname === `/wp/v2/pages/${ POST_ID }/autosaves` ) {
			if ( method === 'POST' ) {
				post = mergePost( post, options.data );
				persist();
				return respond( { ...post, autosave: true } );
			}
			return respond( [] );
		}
		if ( pathname === `/wp/v2/pages/${ POST_ID }/revisions` ) {
			return respond( [] );
		}

		// The edited page itself.
		if ( pathname === `/wp/v2/pages/${ POST_ID }` ) {
			if ( method === 'GET' ) {
				return respond( post );
			}
			post = mergePost( post, options.data );
			persist();
			return respond( post );
		}
		if ( pathname === '/wp/v2/pages' ) {
			if ( method === 'POST' ) {
				return respond( post );
			}
			return respond( [ post ] );
		}

		// Collection endpoints the UI probes for but does not need data from.
		const emptyCollections = [
			'/wp/v2/blocks',
			'/wp/v2/templates',
			'/wp/v2/template-parts',
			'/wp/v2/navigation',
			'/wp/v2/comments',
			'/wp/v2/font-families',
			'/wp/v2/font-collections',
			'/wp/v2/search',
			'/wp/v2/block-directory/search',
		];
		if (
			emptyCollections.some(
				( base ) => pathname === base || pathname.startsWith( `${ base }/` )
			)
		) {
			return respond( method === 'GET' ? [] : {} );
		}

		if ( process.env.NODE_ENV !== 'production' ) {
			// eslint-disable-next-line no-console
			console.warn(
				'[mock] unhandled request:',
				method,
				pathname,
				query.toString()
			);
		}
		return notFound();
	};

	apiFetch.setFetchHandler( handler );
}
