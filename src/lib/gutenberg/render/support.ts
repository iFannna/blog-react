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
	attributes: { style?: Record<string, unknown> },
	instanceId: number
): PositionRender | null {
	const style = attributes.style;
	const base = style?.position as Record<string, unknown> | undefined;
	const type = sanitizeCssValue( base?.type );
	// 主题只声明支持 sticky（theme.json settings.position）
	const allowed = type === 'sticky';
	const hasViewportPosition = Object.keys( VIEWPORT_MEDIA ).some( ( state ) => {
		const viewport = style?.[ state ];
		return (
			viewport &&
			typeof viewport === 'object' &&
			Boolean( ( viewport as { position?: unknown } ).position )
		);
	} );

	if ( ! allowed && ! hasViewportPosition ) {
		return null;
	}

	const className = `wp-container-position-${ instanceId }`;
	const classes = new Set< string >();
	const declarations: string[] = [];
	const addPositionDeclarations = (
		position: Record< string, unknown >
	): boolean => {
		const positionType = sanitizeCssValue( position.type );
		if ( positionType !== 'sticky' ) {
			return false;
		}
		classes.add( `is-position-${ positionType }` );
		for ( const side of [ 'top', 'right', 'bottom', 'left' ] ) {
			const value = sanitizeCssValue( position[ side ] );
			if ( value ) {
				declarations.push( `${ side }: ${ value }` );
			}
		}
		declarations.push( `position: ${ positionType }`, 'z-index: 10' );
		return true;
	};

	if ( base ) {
		addPositionDeclarations( base );
	}

	const rules: string[] = [];
	if ( declarations.length > 0 ) {
		rules.push(
			`.gutenberg-content .${ className } { ${ declarations.join( '; ' ) }; }`
		);
	}

	for ( const [ state, media ] of Object.entries( VIEWPORT_MEDIA ) ) {
		const viewport = style?.[ state ];
		if ( ! viewport || typeof viewport !== 'object' ) {
			continue;
		}
		const position = {
			...( base || {} ),
			...(
				( viewport as { position?: Record< string, unknown > } )
					.position || {}
			),
		};
		const positionType = sanitizeCssValue( position.type );
		const viewportDeclarations: string[] = [];
		if ( positionType === 'sticky' ) {
			classes.add( `is-position-${ positionType }` );
			for ( const side of [ 'top', 'right', 'bottom', 'left' ] ) {
				const value = sanitizeCssValue( position[ side ] );
				if ( value ) {
					viewportDeclarations.push( `${ side }: ${ value }` );
				}
			}
			viewportDeclarations.push(
				`position: ${ positionType }`,
				'z-index: 10'
			);
		} else if ( base ) {
			// 视口状态显式清除了基础定位
			viewportDeclarations.push( 'position: static' );
		}
		if ( viewportDeclarations.length > 0 ) {
			rules.push(
				`${ media } { .gutenberg-content .${ className } { ${ viewportDeclarations.join(
					'; '
				) }; } }`
			);
		}
	}

	if ( rules.length === 0 ) {
		return null;
	}

	return {
		className: [ className, ...classes ].join( ' ' ),
		css: rules.join( '\n' ),
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

const VIEWPORT_MEDIA: Record<string, string> = {
	'@mobile': '@media (width <= 480px)',
	'@tablet': '@media (480px < width <= 782px)',
};

function childLayoutStyle( layout: ChildLayout ): CSSProperties {
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

	return style;
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
	const style = childLayoutStyle( layout );
	return Object.keys( style ).length ? style : null;
}

/**
 * 子区块的视口状态布局只能输出为实例级媒体查询。
 */
export function renderChildStateLayout(
	attributes: { style?: Record<string, unknown> },
	scopeClass: string
): PositionRender | null {
	const style = attributes.style;
	if ( ! style ) {
		return null;
	}

	const rules: string[] = [];
	for ( const [ state, media ] of Object.entries( VIEWPORT_MEDIA ) ) {
		const viewport = style[ state ];
		if ( ! viewport || typeof viewport !== 'object' ) {
			continue;
		}
		const layout = ( viewport as { layout?: ChildLayout } ).layout;
		if ( ! layout ) {
			continue;
		}
		const declarations = childLayoutStyle( layout );
		const entries = Object.entries( declarations );
		if ( entries.length === 0 ) {
			continue;
		}
		const body = entries
			.map( ( [ key, value ] ) => {
				const property = key.startsWith( '--' )
					? key
					: key.replace(
							/[A-Z]/g,
							( letter ) => `-${ letter.toLowerCase() }`
						);
				return `${ property }: ${ value }`;
			} )
			.join( '; ' );
		rules.push(
			`${ media } { .gutenberg-content .${ scopeClass } { ${ body } } }`
		);
	}

	if ( rules.length === 0 ) {
		return null;
	}
	return { className: scopeClass, css: rules.join( '\n' ) };
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
