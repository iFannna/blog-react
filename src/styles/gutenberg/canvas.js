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
	settings.__unstableResolvedAssets.styles = CANVAS_STYLESHEETS.map(
		( href ) => `<link rel="stylesheet" href="${ base }${ href.replace( /^\//, '' ) }" />`
	).join( '\n' );
	settings.__unstableResolvedAssets.scripts = '';
}
