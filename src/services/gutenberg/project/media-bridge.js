import { setMediaDataSource } from "@/services/gutenberg/media/source";
import { goProjectMediaSource } from "./api";

const SIZE_WIDTHS = [
	[ "thumbnail", 150 ],
	[ "medium", 300 ],
	[ "large", 1024 ],
];

// 带客户端过滤时按全量分页读取，避免只过滤当前页造成总数和翻页错误
const MAX_PAGES = 100;
const FULL_PAGE_SIZE = 100;

function readText( value ) {
	if ( typeof value === "string" ) {
		return value;
	}
	if ( value && typeof value.raw === "string" ) {
		return value.raw;
	}
	return "";
}

function normalizeDate( value ) {
	return typeof value === "string" ? value.replace( " ", "T" ) : "";
}

function resizedURL( media, width ) {
	if ( ! media.url || ! width || media.storage !== "oss" ) {
		return media.url;
	}
	if ( ! media.width || width >= media.width ) {
		return media.url;
	}
	const separator = media.url.includes( "?" ) ? "&" : "?";
	return `${ media.url }${ separator }x-oss-process=image/resize,w_${ width }`;
}

function buildSizes( media ) {
	const makeSize = ( width ) => {
		const targetWidth = width && media.width
			? Math.min( width, media.width )
			: media.width;
		const targetHeight =
			media.width && media.height
				? Math.round( ( media.height * targetWidth ) / media.width )
				: media.height;
		const url = resizedURL( media, width );
		return {
			file: media.file_name,
			width: targetWidth,
			height: targetHeight,
			mime_type: media.mime_type,
			source_url: url,
			url,
		};
	};
	const sizes = { full: makeSize( 0 ) };
	for ( const [ name, width ] of SIZE_WIDTHS ) {
		sizes[ name ] = makeSize( width );
	}
	return sizes;
}

/** 把项目媒体映射成编辑器使用的 attachment 实体 */
export function toAttachment( media ) {
	const date = normalizeDate( media.created_at );
	const modified = normalizeDate( media.updated_at ) || date;
	const sizes = buildSizes( media );
	return {
		id: media.id,
		date,
		date_gmt: date,
		guid: { rendered: media.url },
		modified,
		modified_gmt: modified,
		slug: media.slug || String( media.id ),
		status: "inherit",
		type: "attachment",
		link: media.url,
		title: { raw: media.title, rendered: media.title },
		author: media.created_by,
		comment_status: "closed",
		ping_status: "closed",
		meta: {},
		description: { raw: media.description, rendered: media.description },
		caption: { raw: media.caption, rendered: media.caption },
		alt_text: media.alt_text,
		media_type: media.media_type || "image",
		mime_type: media.mime_type,
		media_details: {
			width: media.width,
			height: media.height,
			file: media.file_name,
			filesize: media.file_size,
			sizes,
		},
		post: media.post_id ?? null,
		source_url: media.url,
		missing_image_sizes: [],
		width: media.width,
		height: media.height,
		sizes,
		_links: {
			// 指向项目后台地址，避免把项目媒体伪装成 WP REST 资源；
			// targetHints 供 core-data 判断读/写/删权限。
			self: [
				{
					href: `/admin/media/${ media.id }`,
					targetHints: {
						allow: "GET, POST, PUT, PATCH, DELETE",
					},
				},
			],
			author: [],
			"wp:action-delete": [ { href: `/admin/media/${ media.id }` } ],
			"wp:action-edit": [ { href: `/admin/media/${ media.id }` } ],
		},
	};
}

function toArray( value ) {
	if ( value === undefined || value === null || value === "" ) {
		return [];
	}
	return Array.isArray( value )
		? value.filter( ( item ) => item !== "" && item !== null )
		: String( value )
				.split( "," )
				.map( ( item ) => item.trim() )
				.filter( Boolean );
}

function parseIds( value ) {
	return toArray( value )
		.map( ( item ) => Number( item ) )
		.filter( ( id ) => Number.isInteger( id ) && id > 0 );
}

function normalizeParentId( media ) {
	return Number( media.post_id ) || 0;
}

function matchesMimeType( mimeType, pattern ) {
	if ( ! pattern ) {
		return false;
	}
	if ( pattern.endsWith( "/*" ) ) {
		return ( mimeType || "" ).startsWith( pattern.slice( 0, -1 ) );
	}
	return mimeType === pattern;
}

function createFilters( query ) {
	return {
		mediaTypes: toArray( query.media_type ),
		mimeTypes: toArray( query.mime_type ),
		parents: toArray( query.parent )
			.map( ( value ) => Number( value ) )
			.filter( Number.isFinite ),
		authors: toArray( query.author )
			.map( ( value ) => Number( value ) )
			.filter( Number.isFinite ),
		authorsExclude: toArray( query.author_exclude )
			.map( ( value ) => Number( value ) )
			.filter( Number.isFinite ),
		exclude: parseIds( query.exclude ),
		before: typeof query.before === "string" ? query.before : "",
		after: typeof query.after === "string" ? query.after : "",
	};
}

function hasClientFilters( filters ) {
	return !! (
		filters.mediaTypes.length ||
		filters.mimeTypes.length ||
		filters.parents.length ||
		filters.authors.length ||
		filters.authorsExclude.length ||
		filters.exclude.length ||
		filters.before ||
		filters.after
	);
}

function matchesFilters( media, filters ) {
	const mimeType = media.mime_type || "";
	if (
		filters.mediaTypes.length &&
		! filters.mediaTypes.includes( media.media_type )
	) {
		return false;
	}
	if (
		filters.mimeTypes.length &&
		! filters.mimeTypes.some( ( pattern ) =>
			matchesMimeType( mimeType, pattern )
		)
	) {
		return false;
	}
	if (
		filters.parents.length &&
		! filters.parents.includes( normalizeParentId( media ) )
	) {
		return false;
	}
	const author = Number( media.created_by );
	if ( filters.authors.length && ! filters.authors.includes( author ) ) {
		return false;
	}
	if ( filters.authorsExclude.length && filters.authorsExclude.includes( author ) ) {
		return false;
	}
	if ( filters.exclude.includes( Number( media.id ) ) ) {
		return false;
	}
	const created = Date.parse( normalizeDate( media.created_at ) );
	if ( filters.after ) {
		const after = Date.parse( filters.after );
		if ( Number.isFinite( created ) && Number.isFinite( after ) && created < after ) {
			return false;
		}
	}
	if ( filters.before ) {
		const before = Date.parse( filters.before );
		if ( Number.isFinite( created ) && Number.isFinite( before ) && created > before ) {
			return false;
		}
	}
	return true;
}

async function fetchAllMedia( search ) {
	const items = [];
	let page = 1;
	let total = Infinity;
	while ( page <= MAX_PAGES ) {
		const data = await goProjectMediaSource.list(
			page,
			FULL_PAGE_SIZE,
			search
		);
		const list = Array.isArray( data?.list ) ? data.list : [];
		items.push( ...list );
		total = Number( data?.total ) || 0;
		if ( ! list.length || items.length >= total ) {
			break;
		}
		page += 1;
	}
	return items;
}

/** 读取附件列表，参数沿用 core-data 的 WP 查询语义 */
async function listRecords( query = {} ) {
	const include = parseIds( query.include );
	if ( include.length ) {
		const records = (
			await Promise.all(
				include.map( ( id ) =>
					goProjectMediaSource
						.get( id )
						.then( toAttachment )
						.catch( () => null )
				)
			)
		).filter( Boolean );
		return {
			records,
			totalItems: records.length,
			totalPages: 1,
		};
	}

	const search = typeof query.search === "string" ? query.search : "";
	const requestedPerPage = Number( query.per_page );
	const perPage =
		requestedPerPage === -1
			? -1
			: Math.min( Math.max( requestedPerPage || 20, 1 ), 100 );
	const page = Math.max( Number( query.page ) || 1, 1 );
	const filters = createFilters( query );

	if ( perPage === -1 || hasClientFilters( filters ) ) {
		const items = ( await fetchAllMedia( search ) ).filter( ( media ) =>
			matchesFilters( media, filters )
		);
		const pageItems =
			perPage === -1
				? items
				: items.slice( ( page - 1 ) * perPage, page * perPage );
		return {
			records: pageItems.map( toAttachment ),
			totalItems: items.length,
			totalPages:
				perPage === -1
					? 1
					: Math.max( Math.ceil( items.length / perPage ), 1 ),
		};
	}

	const data = await goProjectMediaSource.list( page, perPage, search );
	const list = Array.isArray( data?.list ) ? data.list : [];
	const total = Number( data?.total ) || 0;
	return {
		records: list.map( toAttachment ),
		totalItems: total,
		totalPages: Math.max( Math.ceil( total / perPage ), 1 ),
	};
}

/** 读取单条附件 */
async function getRecord( id ) {
	return toAttachment( await goProjectMediaSource.get( Number( id ) ) );
}

const EDITABLE_FIELDS = [
	[ "title", "title" ],
	[ "alt_text", "altText" ],
	[ "caption", "caption" ],
	[ "description", "description" ],
];

/**
 * 更新附件元数据。Go 接口只接受标题/替代文本/说明/描述，
 * 其余字段（典型如归属文章）不写回，避免整条记录被清空。
 */
async function updateRecord( id, record = {}, persistedRecord ) {
	const numericId = Number( id );
	const hasPostEdit = Object.prototype.hasOwnProperty.call( record, "post" );
	const hasMetadataEdit = EDITABLE_FIELDS.some( ( [ key ] ) =>
		Object.prototype.hasOwnProperty.call( record, key )
	);
	if ( ! hasMetadataEdit ) {
		if ( hasPostEdit ) {
			// 归属文章由 Go 媒体接口维护，项目模式暂不提供改写入口，
			// 明确失败而不是返回成功造成“已附加”的假象。
			throw new Error( "项目媒体暂不支持调整媒体归属文章。" );
		}
		return toAttachment( await goProjectMediaSource.get( numericId ) );
	}

	const base =
		persistedRecord ?? toAttachment( await goProjectMediaSource.get( numericId ) );
	if (
		hasPostEdit &&
		( Number( record.post ) || 0 ) !== ( Number( base?.post ) || 0 )
	) {
		throw new Error( "项目媒体暂不支持调整媒体归属文章。" );
	}
	const readField = ( key ) =>
		Object.prototype.hasOwnProperty.call( record, key )
			? readText( record[ key ] )
			: readText( base?.[ key ] );
	const media = await goProjectMediaSource.update( numericId, {
		title: readField( "title" ),
		altText: readField( "alt_text" ),
		caption: readField( "caption" ),
		description: readField( "description" ),
	} );
	return toAttachment( media );
}

/** 删除附件，返回 core-data 期望的 deleted/previous 结构 */
async function deleteRecord( id ) {
	const numericId = Number( id );
	let previous;
	try {
		previous = toAttachment( await goProjectMediaSource.get( numericId ) );
	} catch {
		previous = undefined;
	}
	await goProjectMediaSource.delete( numericId );
	return previous ? { deleted: true, previous } : { deleted: true };
}

/** 上传文件并返回 attachment 实体 */
async function uploadFile( file ) {
	return toAttachment( await goProjectMediaSource.upload( file ) );
}

/** 从外链下载后上传；跨域且未开放 CORS 的地址会失败 */
async function uploadFromUrl( url ) {
	const response = await fetch( url );
	if ( ! response.ok ) {
		throw new Error( "无法下载要上传的媒体文件。" );
	}
	const blob = await response.blob();
	let fileName = "media";
	try {
		const pathname = new URL( url, window.location.href ).pathname;
		fileName = decodeURIComponent(
			pathname.split( "/" ).filter( Boolean ).pop() || fileName
		);
	} catch {
		// 保留默认文件名
	}
	if ( ! /\.[^.]+$/.test( fileName ) && blob.type ) {
		const subtype = blob.type.split( "/" )[ 1 ]?.split( "+" )[ 0 ];
		if ( subtype ) {
			fileName = `${ fileName }.${ subtype }`;
		}
	}
	const file = new File( [ blob ], fileName, {
		type: blob.type || "application/octet-stream",
	} );
	return uploadFile( file );
}

export const projectMediaDataSource = {
	getRecord,
	listRecords,
	updateRecord,
	deleteRecord,
	uploadFile,
	uploadFromUrl,
};

/** 让编辑器媒体读写改用项目媒体接口，不再经过 mock 的 WP REST 数据 */
export function installProjectMediaBridge() {
	setMediaDataSource( projectMediaDataSource );
}
