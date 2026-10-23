import globalStylesCss from './compiled/inline/global-styles.js';

const CANVAS_STYLESHEETS = [
	'/canvas/components.css',
	'/canvas/block-library.css',
	'/canvas/block-editor-content.css',
	'/canvas/block-library-editor.css',
	'/canvas/theme-editor.css',
];

export function configureCanvasAssets( settings ) {
	const base = '/';
	settings.__unstableResolvedAssets = settings.__unstableResolvedAssets || {};
	const assets = CANVAS_STYLESHEETS.map(
		( href ) => `<link rel="stylesheet" href="${ base }${ href.replace( /^\//, '' ) }" />`
	);
	// 全局样式改走官方资源通道，id 与 inline.js 注入外层 <head> 的同名：
	// 画布已带有该 id 时，iframe 的兼容样式拷贝会跳过它，不再重复克隆并告警。
	// 追加在画布样式表之后，保持原来“最后生效”的层叠顺序。
	assets.push(
		`<style id="global-styles-inline-css">${ globalStylesCss }</style>`
	);
	settings.__unstableResolvedAssets.styles = assets.join( '\n' );
	settings.__unstableResolvedAssets.scripts = '';
}
