import { setProjectMediaHandler } from "@/services/gutenberg/mock/api.js";
import { goProjectMediaSource } from "./api";

const SIZE_WIDTHS = [
	[ "thumbnail", 150 ],
	[ "medium", 300 ],
	[ "large", 1024 ],
];

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
			self: [ { href: `/wp/v2/media/${ media.id }?context=edit` } ],
			author: [],
			"wp:action-delete": [ { href: `/wp/v2/media/${ media.id }` } ],
			"wp:action-edit": [ { href: `/wp/v2/media/${ media.id }` } ],
		},
	};
}

function respond( payload, wantsRawResponse, headers = {} ) {
	if ( ! wantsRawResponse ) {
		return Promise.resolve( payload );
	}
	return Promise.resolve(
		new Response( JSON.stringify( payload ), {
			status: 200,
			headers: {
				allow: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
				"Content-Type": "application/json",
				...headers,
			},
		} )
	);
}

async function handleMediaRequest( {
	method,
	pathname,
	query,
	options,
	wantsRawResponse,
} ) {
	if ( pathname === "/wp/v2/media" && method === "GET" ) {
		const include = query.get( "include" );
		if ( include ) {
			const ids = include
				.split( "," )
				.map( ( value ) => Number( value ) )
				.filter( ( value ) => Number.isInteger( value ) && value > 0 );
			const items = await Promise.all(
				ids.map( ( id ) =>
					goProjectMediaSource.get( id ).catch( () => null )
				)
			);
			return respond(
				items.filter( Boolean ).map( toAttachment ),
				wantsRawResponse
			);
		}
		const mediaType = query.get( "media_type" );
		if ( mediaType && ! mediaType.split( "," ).includes( "image" ) ) {
			return respond( [], wantsRawResponse );
		}
		const perPage = Math.min(
			Math.max( Number( query.get( "per_page" ) ) || 20, 1 ),
			100
		);
		const page = Math.max( Number( query.get( "page" ) ) || 1, 1 );
		const search = query.get( "search" ) || "";
		const data = await goProjectMediaSource.list( page, perPage, search );
		return respond(
			data.list.map( toAttachment ),
			wantsRawResponse,
			{
				"X-WP-Total": String( data.total ),
				"X-WP-TotalPages": String(
					Math.max( Math.ceil( data.total / perPage ), 1 )
				),
			}
		);
	}

	if ( pathname === "/wp/v2/media" && method === "POST" ) {
		const file = options.body?.get?.( "file" );
		if ( ! ( file instanceof File ) ) {
			throw { code: "rest_invalid_param", message: "缺少要上传的文件。" };
		}
		const media = await goProjectMediaSource.upload( file );
		return respond( toAttachment( media ), wantsRawResponse );
	}

	const match = pathname.match( /^\/wp\/v2\/media\/(\d+)$/ );
	if ( match ) {
		const id = Number( match[ 1 ] );
		if ( method === "GET" ) {
			const media = await goProjectMediaSource.get( id );
			return respond( toAttachment( media ), wantsRawResponse );
		}
		if ( method === "POST" || method === "PUT" || method === "PATCH" ) {
			const data = options.data ?? {};
			const media = await goProjectMediaSource.update( id, {
				title: readText( data.title ),
				altText: readText( data.alt_text ),
				caption: readText( data.caption ),
				description: readText( data.description ),
			} );
			return respond( toAttachment( media ), wantsRawResponse );
		}
		if ( method === "DELETE" ) {
			const previous = await goProjectMediaSource.get( id );
			await goProjectMediaSource.delete( id );
			return respond(
				{ deleted: true, previous: toAttachment( previous ) },
				wantsRawResponse
			);
		}
	}

	throw { code: "rest_no_route", message: "媒体接口不存在" };
}

/** 让编辑器媒体弹窗改用项目媒体接口，不再走 mock 的 WP REST 数据 */
export function installProjectMediaBridge() {
	setProjectMediaHandler( async ( request ) => {
		try {
			return await handleMediaRequest( request );
		} catch ( error ) {
			if ( error && typeof error.code === "string" ) {
				throw error;
			}
			throw {
				code: "project_media_error",
				message: error?.message || "媒体操作失败",
			};
		}
	} );
}
