import globalStylesCss from './compiled/inline/global-styles.js';
import formatLibraryCss from './compiled/inline/format-library.js';
import editPostInlineCss from './compiled/inline/edit-post.js';

// WordPress prints these as identified <style> tags. The editor copies styles
// with an id into the canvas iframe, so they must exist as strings at runtime.
const INLINE_STYLES = [
	[ 'global-styles-inline-css', globalStylesCss ],
	[ 'wp-edit-post-inline-css', editPostInlineCss ],
	[ 'wp-format-library-inline-css', formatLibraryCss ],
];

for ( const [ id, css ] of INLINE_STYLES ) {
	if ( document.getElementById( id ) ) {
		continue;
	}
	const style = document.createElement( 'style' );
	style.id = id;
	style.textContent = css;
	document.head.appendChild( style );
}
