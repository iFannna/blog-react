import type { CSSProperties } from 'react';

export interface PositionRender {
	className: string;
	css: string;
}

export interface ButtonWidthRender {
	className: string;
	style: CSSProperties;
}

function sanitizeCssValue(value: unknown): string | undefined {
	if ( typeof value !== 'string' && typeof value !== 'number' ) {
		return undefined;
	}
	const trimmed = String( value ).trim();
	if ( ! trimmed || /[;{}<>]/.test( trimmed ) ) {
		return undefined;
	}
	return trimmed;
}

/** group 等支持 position 的静态区块，保存 HTML 不包含 sticky/fixed 样式。 */
export function renderPosition(
	attributes: { style?: { position?: Record<string, unknown> } },
	instanceId: number
): PositionRender | null {
	const position = attributes.style?.position;
	const type = sanitizeCssValue( position?.type );
	if ( ! position || ( type !== 'sticky' && type !== 'fixed' ) ) {
		return null;
	}

	const className = `wp-container-position-${ instanceId }`;
	const declarations = [ `position: ${ type }` ];
	for ( const side of [ 'top', 'right', 'bottom', 'left' ] ) {
		const value = sanitizeCssValue( position[ side ] );
		if ( value ) {
			declarations.push( `${ side }: ${ value }` );
		}
	}
	declarations.push( 'z-index: 10' );

	return {
		className,
		css: `.gutenberg-content .${ className } { ${ declarations.join( '; ' ) }; }`,
	};
}

const LEGACY_WIDTH_CLASSES: Record<string, string> = {
	'25%': 'wp-block-button__width-25',
	'50%': 'wp-block-button__width-50',
	'75%': 'wp-block-button__width-75',
	'100%': 'wp-block-button__width-100',
};

export interface TabsStateRender {
	className: string;
	css: string;
}

/**
 * Tabs 的 activeTabIndex 只存在区块注释里；没有运行时脚本时，
 * 用它决定初始展示的面板与高亮的标签。
 */
export function renderTabsState(attributes: {
	activeTabIndex?: unknown;
}): TabsStateRender | null {
	const index = Number( attributes.activeTabIndex );
	if ( ! Number.isFinite( index ) || index < 0 ) {
		return null;
	}

	// activeTabIndex 是 0-based，CSS nth-child 是 1-based。
	const column = Math.floor( index ) + 1;
	const className = `is-active-tab-${ column }`;
	const scope = `.gutenberg-content .wp-block-tabs.${ className }`;

	return {
		className,
		css: `${ scope } .wp-block-tab-panels > .wp-block-tab-panel { display: none; }
${ scope } .wp-block-tab-panels > .wp-block-tab-panel:nth-child(${ column }) { display: block; }
${ scope } .wp-block-tab-list > button { border-bottom: 0; }
${ scope } .wp-block-tab-list > button:nth-child(${ column }) { border-bottom: 2px solid currentColor; }`,
	};
}

interface ChildLayout {
	selfStretch?: string;
	flexSize?: string;
	columnStart?: number;
	columnSpan?: number;
	rowStart?: number;
	rowSpan?: number;
}

/**
 * flex/grid 子区块的 selfStretch、flexSize 与网格定位保存在区块注释里，
 * 保存 HTML 不包含这些布局声明。
 */
export function renderChildLayout(attributes: {
	layout?: ChildLayout;
}): CSSProperties | null {
	const layout = attributes.layout;
	if ( ! layout ) {
		return null;
	}

	const style: CSSProperties = {};
	const selfStretch = layout.selfStretch;
	const flexSize = sanitizeCssValue( layout.flexSize );

	if (
		( selfStretch === 'fixed' || selfStretch === 'fixedNoShrink' ) &&
		flexSize
	) {
		style.flexBasis = flexSize;
		style.boxSizing = 'border-box';
		if ( selfStretch === 'fixedNoShrink' ) {
			style.flexShrink = 0;
		}
	} else if ( selfStretch === 'fill' ) {
		style.flexGrow = 1;
	}

	if ( layout.columnStart && layout.columnSpan ) {
		style.gridColumn = `${ layout.columnStart } / span ${ layout.columnSpan }`;
	} else if ( layout.columnStart ) {
		style.gridColumn = `${ layout.columnStart }`;
	} else if ( layout.columnSpan ) {
		style.gridColumn = `span ${ layout.columnSpan }`;
	}

	if ( layout.rowStart && layout.rowSpan ) {
		style.gridRow = `${ layout.rowStart } / span ${ layout.rowSpan }`;
	} else if ( layout.rowStart ) {
		style.gridRow = `${ layout.rowStart }`;
	} else if ( layout.rowSpan ) {
		style.gridRow = `span ${ layout.rowSpan }`;
	}

	return Object.keys( style ).length ? style : null;
}

/**
 * Button 的 dimensions.width 声明了 __experimentalSkipSerialization，
 * save 不会输出宽度类与 CSS 变量，需要在渲染时补回。
 */
export function renderButtonWidth(attributes: {
	style?: { dimensions?: Record<string, unknown> };
}): ButtonWidthRender | null {
	const rawWidth = attributes.style?.dimensions?.width;
	const width = sanitizeCssValue( rawWidth );
	if ( ! width ) {
		return null;
	}

	const classes = [ 'has-custom-width' ];
	const style: CSSProperties = {};
	const percentage = /^(\d+(?:\.\d+)?)%$/.exec( width );

	if ( percentage ) {
		classes.push( 'wp-block-button__width' );
		const legacy = LEGACY_WIDTH_CLASSES[ width ];
		if ( legacy ) {
			classes.push( legacy );
		}
		( style as Record<string, string | number> )[ '--wp--block-button--width' ] =
			Number.parseFloat( percentage[ 1 ] );
	} else {
		const preset = /^var:preset\|dimension\|(.+)$/.exec( width );
		style.width = preset
			? `var(--wp--preset--dimension--${ preset[ 1 ] })`
			: width;
	}

	return { className: classes.join( ' ' ), style };
}
