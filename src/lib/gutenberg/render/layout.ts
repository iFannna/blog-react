import { kebabCase } from '@/utils/gutenberg/kebab-case';

export interface BlockLayout {
	type?: string;
	inherit?: boolean;
	orientation?: string;
	justifyContent?: string;
	verticalAlignment?: string;
	flexWrap?: string;
	contentSize?: string;
	wideSize?: string;
	columnCount?: number;
	minimumColumnWidth?: string;
	rowCount?: number;
	autoFit?: boolean;
	selfStretch?: string;
	flexSize?: string;
	columnStart?: number;
	columnSpan?: number;
	rowStart?: number;
	rowSpan?: number;
}

export interface BlockGapValue {
	top?: string;
	left?: string;
}

export interface RenderableAttributes {
	layout?: BlockLayout;
	style?: {
		spacing?: { blockGap?: string | BlockGapValue };
		position?: Record<string, unknown>;
		dimensions?: Record<string, unknown>;
		color?: Record<string, unknown>;
	};
	[key: string]: unknown;
}

export interface LayoutRender {
	className: string;
	css: string;
}

const LAYOUT_SLUGS: Record<string, string> = {
	default: 'flow',
	constrained: 'constrained',
	flex: 'flex',
	grid: 'grid',
};

/** 区块未显式保存 layout 时的默认布局（来自各自 block.json）。 */
const DEFAULT_LAYOUTS: Record<string, BlockLayout> = {
	'core/buttons': { type: 'flex' },
	'core/columns': { type: 'flex', flexWrap: 'nowrap' },
	'core/gallery': { type: 'flex' },
	'core/social-links': { type: 'flex' },
	'core/tab-list': { type: 'flex', flexWrap: 'wrap' },
};

/** 支持 layout/blockGap 的静态区块，用于没有显式 layout 时的 flow 间距。 */
const LAYOUT_SUPPORT = new Set( [
	'core/accordion',
	'core/accordion-item',
	'core/accordion-panel',
	'core/buttons',
	'core/column',
	'core/columns',
	'core/gallery',
	'core/group',
	'core/quote',
	'core/social-links',
	'core/tab-list',
	'core/tab-panel',
	'core/tab-panels',
	'core/tabs',
] );

const FLEX_JUSTIFY: Record<string, string> = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
	'space-between': 'space-between',
};

const VERTICAL_ALIGN: Record<string, string> = {
	top: 'flex-start',
	center: 'center',
	bottom: 'flex-end',
	stretch: 'stretch',
	'space-between': 'space-between',
};

const VERTICAL_ALIGN_TO_JUSTIFY: Record<string, string> = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
	stretch: 'stretch',
};

function blockSuffix(blockName: string): string {
	return blockName.startsWith('core/')
		? blockName.slice('core/'.length)
		: blockName.replace(/\//g, '-');
}

function sanitizeCssValue(value: unknown): string | undefined {
	if ( typeof value !== 'string' ) {
		return undefined;
	}
	const trimmed = value.trim();
	if ( ! trimmed || /[;{}<>]/.test( trimmed ) ) {
		return undefined;
	}
	return trimmed;
}

function hasContainerLayout( layout?: BlockLayout | null ): boolean {
	if ( ! layout ) {
		return false;
	}
	return Boolean(
		layout.type ||
			layout.inherit ||
			layout.contentSize ||
			layout.wideSize ||
			layout.orientation ||
			layout.justifyContent ||
			layout.verticalAlignment ||
			layout.flexWrap ||
			layout.columnCount ||
			layout.minimumColumnWidth ||
			layout.rowCount ||
			layout.autoFit
	);
}

function normalizeLayout(layout?: BlockLayout | null): BlockLayout | undefined {
	if ( ! layout ) {
		return undefined;
	}
	if ( ! layout.type && ( layout.inherit || layout.contentSize || layout.wideSize ) ) {
		return { ...layout, type: 'constrained' };
	}
	return layout;
}

function spacingPresetCssVar(value: unknown): string | undefined {
	const raw = sanitizeCssValue( value );
	if ( ! raw ) {
		return undefined;
	}
	const preset = /^var:preset\|spacing\|(.+)$/.exec( raw );
	if ( preset ) {
		return `var(--wp--preset--spacing--${ preset[ 1 ] })`;
	}
	return raw;
}

function getBlockGap(
	attributes: RenderableAttributes
): { row?: string; column?: string } {
	const value = attributes.style?.spacing?.blockGap;
	if ( ! value ) {
		return {};
	}
	if ( typeof value === 'string' ) {
		const gap = spacingPresetCssVar( value );
		return gap ? { row: gap, column: gap } : {};
	}
	return {
		row: spacingPresetCssVar( value.top ),
		column: spacingPresetCssVar( value.left ),
	};
}

/** 供媒体类区块把 blockGap 映射到自身的 CSS 变量。 */
export function getBlockGapCssValue(
	attributes: RenderableAttributes,
	axis: 'row' | 'column' = 'column'
): string | undefined {
	const gap = getBlockGap( attributes );
	return axis === 'row' ? gap.row : gap.column;
}

function gapDeclaration( gap: { row?: string; column?: string } ): string {
	if ( ! gap.row && ! gap.column ) {
		return '';
	}
	if ( gap.row && gap.column && gap.row !== gap.column ) {
		return `gap: ${ gap.row } ${ gap.column };`;
	}
	return `gap: ${ gap.row || gap.column };`;
}

function constrainedSize( size?: string, fallback = '100%' ): string {
	const value = sanitizeCssValue( size ) || fallback;
	return `min(${ value }, 100%)`;
}

function flowGapCss( selector: string, gap: { row?: string } ): string {
	if ( ! gap.row ) {
		return '';
	}
	return [
		`${ selector } > * { margin-block-start: ${ gap.row }; margin-block-end: 0; }`,
		`${ selector } > :first-child { margin-block-start: 0; }`,
		`${ selector } > :last-child { margin-block-end: 0; }`,
	].join( '\n' );
}

function flexCss(
	selector: string,
	layout: BlockLayout,
	gap: { row?: string; column?: string }
): string {
	const orientation = layout.orientation || 'horizontal';
	const justify = FLEX_JUSTIFY[ layout.justifyContent || '' ];
	const vertical = VERTICAL_ALIGN[ layout.verticalAlignment || '' ];
	const rules: string[] = [];

	if ( layout.flexWrap === 'nowrap' ) {
		rules.push( 'flex-wrap: nowrap' );
	} else {
		rules.push( 'flex-wrap: wrap' );
	}

	if ( orientation === 'vertical' ) {
		rules.push( 'flex-direction: column' );
		if ( vertical ) {
			rules.push( `justify-content: ${ vertical }` );
		}
		// 纵向时水平对齐由 justifyContent 映射到 align-items。
		rules.push(
			`align-items: ${
				VERTICAL_ALIGN_TO_JUSTIFY[ layout.justifyContent || '' ] ||
				'flex-start'
			}`
		);
	} else {
		if ( vertical ) {
			rules.push( `align-items: ${ vertical }` );
		}
		if ( justify ) {
			rules.push( `justify-content: ${ justify }` );
		}
	}

	const gapRule = gapDeclaration( gap );
	if ( gapRule ) {
		rules.push( gapRule.slice( 0, -1 ) );
	}

	return `${ selector } { ${ rules.join( '; ' ) }; }
${ selector } > :is(*, div) { margin: 0; }`;
}

function gridCss(
	selector: string,
	layout: BlockLayout,
	gap: { row?: string; column?: string }
): string {
	const columnCount = Number( layout.columnCount ) || 0;
	const rowCount = Number( layout.rowCount ) || 0;
	const minimumColumnWidth = sanitizeCssValue( layout.minimumColumnWidth );
	const autoPlacement = layout.autoFit ? 'auto-fit' : 'auto-fill';
	const fallbackGap = gap.column || 'var(--gb-gap, 1.2rem)';
	const fallbackGapValue =
		fallbackGap === '0' ? '0px' : fallbackGap;
	const rules: string[] = [];

	if ( minimumColumnWidth && columnCount > 0 ) {
		const maxValue = `max(min( ${ minimumColumnWidth }, 100%), ( 100% - (${ fallbackGapValue } * ${
			columnCount - 1
		}) ) / ${ columnCount })`;
		rules.push(
			`grid-template-columns: repeat(${ autoPlacement }, minmax(${ maxValue }, 1fr))`
		);
	} else if ( columnCount ) {
		rules.push(
			`grid-template-columns: repeat(${ columnCount }, minmax(0, 1fr))`
		);
	} else {
		rules.push(
			`grid-template-columns: repeat(${ autoPlacement }, minmax(min(${ minimumColumnWidth || '12rem' }, 100%), 1fr))`
		);
	}

	rules.push( 'container-type: inline-size' );

	if ( rowCount ) {
		rules.push(
			`grid-template-rows: repeat(${ rowCount }, minmax(1rem, auto))`
		);
	}

	const gapRule = gapDeclaration( gap );
	if ( gapRule ) {
		rules.push( gapRule.slice( 0, -1 ) );
	} else {
		rules.push( 'gap: var(--gb-gap, 1.2rem)' );
	}

	return `${ selector } { ${ rules.join( '; ' ) }; }
${ selector } > :is(*, div) { margin: 0; }`;
}

function constrainedCss(
	selector: string,
	layout: BlockLayout,
	gap: { row?: string; column?: string }
): string {
	const contentSize = constrainedSize(
		layout.contentSize,
		'var(--wp--style--global--content-size, 800px)'
	);
	const wideSize = constrainedSize(
		layout.wideSize || layout.contentSize,
		'var(--wp--style--global--wide-size, 1440px)'
	);
	const justify = layout.justifyContent;
	const marginLeft = justify === 'left' ? '0' : 'auto';
	const marginRight = justify === 'right' ? '0' : 'auto';

	return `${ selector } > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {
	max-width: ${ contentSize };
	margin-left: ${ marginLeft };
	margin-right: ${ marginRight };
}
${ selector } > .alignwide { max-width: ${ wideSize }; }
${ selector } > .alignfull { max-width: none; width: 100%; }
${ flowGapCss( selector, gap ) }`;
}

/**
 * 依据区块注释里的 layout 与 block.json 默认布局，生成 WordPress 前台
 * 等价的布局类名和实例级 CSS。返回的 selector 使用 wp-container 唯一类，
 * 避免多个同名区块互相覆盖。
 */
export function renderLayout(
	blockName: string,
	attributes: RenderableAttributes,
	instanceId: number
): LayoutRender | null {
	const explicitLayout = attributes.layout;
	const defaultLayout = DEFAULT_LAYOUTS[ blockName ];
	let layout = normalizeLayout(
		hasContainerLayout( explicitLayout )
			? { ...( defaultLayout || {} ), ...explicitLayout }
			: defaultLayout
	);
	// 没有 layout 属性但设置了 blockGap 的区块，仍按 flow 布局输出子元素间距。
	if (
		! layout &&
		LAYOUT_SUPPORT.has( blockName ) &&
		attributes.style?.spacing?.blockGap
	) {
		layout = { type: 'default' };
	}
	if ( ! layout ) {
		return null;
	}

	const type = layout.type || 'default';
	const slug = LAYOUT_SLUGS[ type ] || 'flow';
	const suffix = blockSuffix( blockName );
	const classes = [ `is-layout-${ slug }`, `wp-block-${ suffix }-is-layout-${ slug }` ];

	if ( layout.orientation ) {
		classes.push( `is-${ kebabCase( layout.orientation ) }` );
	}
	if ( layout.justifyContent ) {
		classes.push(
			`is-content-justification-${ kebabCase( layout.justifyContent ) }`
		);
	}
	if ( layout.flexWrap === 'nowrap' ) {
		classes.push( 'is-nowrap' );
	}

	const selector = `.gutenberg-content .wp-container-${ suffix }-${ instanceId }`;
	classes.push( `wp-container-${ suffix }-${ instanceId }` );

	const gap = getBlockGap( attributes );
	let css = '';
	switch ( type ) {
		case 'flex':
			css = flexCss( selector, layout, gap );
			break;
		case 'grid':
			css = gridCss( selector, layout, gap );
			break;
		case 'constrained':
			css = constrainedCss( selector, layout, gap );
			break;
		default:
			css = flowGapCss( selector, gap );
			break;
	}

	return { className: classes.join( ' ' ), css };
}
