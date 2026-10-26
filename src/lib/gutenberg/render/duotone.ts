import {
	getDuotoneFilter,
	getDuotoneStylesheet,
} from '@/lib/gutenberg/global-styles-engine/utils/duotone';

export interface DuotoneRender {
	className: string;
	css: string;
	svg: string;
	id: string;
}

interface DuotonePreset {
	name: string;
	slug: string;
	colors: string[];
}

/** 与编辑器 theme.json 的全局 duotone 预设保持一致。 */
const DUOTONE_PRESETS: DuotonePreset[] = [
	{ name: 'Dark grayscale', slug: 'dark-grayscale', colors: [ '#000000', '#7f7f7f' ] },
	{ name: 'Grayscale', slug: 'grayscale', colors: [ '#000000', '#ffffff' ] },
	{ name: 'Purple and yellow', slug: 'purple-yellow', colors: [ '#8c00b7', '#fcff41' ] },
	{ name: 'Blue and red', slug: 'blue-red', colors: [ '#000097', '#ff4747' ] },
	{ name: 'Midnight', slug: 'midnight', colors: [ '#000000', '#00a5ff' ] },
	{ name: 'Magenta and yellow', slug: 'magenta-yellow', colors: [ '#c7005a', '#fff278' ] },
	{ name: 'Purple and green', slug: 'purple-green', colors: [ '#a60072', '#67ff66' ] },
	{ name: 'Blue and orange', slug: 'blue-orange', colors: [ '#1900d8', '#ffa96b' ] },
];

/** supports.filter.duotone 对应的前台选择器（来自各 block.json selectors）。 */
const DUOTONE_SELECTORS: Record<string, string> = {
	'core/cover':
		'.wp-block-cover > .wp-block-cover__image-background, .wp-block-cover > .wp-block-cover__video-background',
	'core/gallery': '.wp-block-gallery :where(img)',
	'core/image': '.wp-block-image img',
	'core/media-text':
		'.wp-block-media-text > .wp-block-media-text__media img, .wp-block-media-text > .wp-block-media-text__media video',
	'core/video': '.wp-block-video video',
};

function sanitizeColor( color: unknown ): string | null {
	if ( typeof color !== 'string' ) {
		return null;
	}
	const value = color.trim();
	return value && !/[;{}<>]/.test( value ) ? value : null;
}

function presetSlug( value: string ): string | null {
	const reference = /^var:preset\|duotone\|(.+)$/.exec( value );
	if ( reference ) {
		return reference[ 1 ];
	}
	const cssVar = /^var\(--wp--preset--duotone--(.+)\)$/.exec( value );
	return cssVar ? cssVar[ 1 ] : null;
}

function hashColors( colors: string[] ): string {
	let hash = 2166136261;
	for ( const character of colors.join( '|' ) ) {
		hash ^= character.charCodeAt( 0 );
		hash = Math.imul( hash, 16777619 );
	}
	return ( hash >>> 0 ).toString( 36 );
}

function scopeSelector( selector: string, className: string ): string {
	return selector
		.split( ',' )
		.map( ( part ) => `.gutenberg-content .${ className }${ part.trim() }` )
		.join( ', ' );
}

/**
 * 把区块注释里的 style.color.duotone 还原成前台需要的类名、CSS 与 SVG。
 * 保存后的 HTML 不包含这些内容，必须由渲染器补齐。
 */
export function renderDuotone(
	blockName: string,
	attributes: { style?: { color?: { duotone?: unknown } }; duotone?: unknown }
): DuotoneRender | null {
	const selector = DUOTONE_SELECTORS[ blockName ];
	if ( ! selector ) {
		return null;
	}

	const value =
		attributes.style?.color?.duotone ?? attributes.duotone;
	if ( ! value || value === 'unset' ) {
		return null;
	}

	let colors: string[] = [];
	let id: string;

	if ( Array.isArray( value ) ) {
		colors = value.map( sanitizeColor ).filter( ( color ): color is string => !! color );
		id = `custom-${ hashColors( colors ) }`;
	} else if ( typeof value === 'string' ) {
		const slug = presetSlug( value );
		const preset = DUOTONE_PRESETS.find( ( item ) => item.slug === slug );
		if ( ! preset ) {
			return null;
		}
		colors = preset.colors;
		id = preset.slug;
	} else {
		return null;
	}

	if ( colors.length < 2 ) {
		return null;
	}

	const filterId = `wp-duotone-${ id }`;
	const className = filterId;
	const scoped = scopeSelector( selector, className );

	return {
		className,
		css: getDuotoneStylesheet( scoped, filterId ),
		svg: getDuotoneFilter( filterId, colors ),
		id: filterId,
	};
}
