import { useEffect, useState } from '@/lib/gutenberg/element';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import {
	Placeholder,
	Spinner as WCSpinner,
} from '@/components/gutenberg/ui';
import { useServerSideRender } from '@/components/gutenberg/server-side-render';
import { isProjectContentSource } from '@/services/gutenberg/project/content';
import { fetchRssFeed } from '@/services/rss';
import HtmlRenderer from '../utils/html-renderer';

const DEFAULT_ITEMS = 5;
const MIN_EXCERPT = 10;
const MAX_EXCERPT = 100;

function clamp( value, min, max ) {
	return Math.min( Math.max( Number( value ) || min, min ), max );
}

function escapeHtml( value ) {
	return String( value )
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' );
}

function safeLink( value ) {
	try {
		const url = new URL( value );
		return url.protocol === 'http:' || url.protocol === 'https:'
			? url.toString()
			: '';
	} catch {
		return '';
	}
}

function formatDate( value ) {
	const date = new Date( value );
	if ( Number.isNaN( date.getTime() ) ) {
		return '';
	}
	const locale =
		typeof navigator !== 'undefined' && navigator.language
			? navigator.language
			: 'zh-CN';
	return date.toLocaleDateString( locale );
}

function buildHtml( feed, attributes ) {
	const items = ( feed?.items ?? [] ).slice(
		0,
		clamp( attributes.itemsToShow ?? DEFAULT_ITEMS, 1, 20 )
	);
	const classes = [ 'wp-block-rss' ];
	if ( attributes.blockLayout === 'grid' ) {
		classes.push( 'is-grid', `columns-${ clamp( attributes.columns ?? 2, 2, 6 ) }` );
	}
	const openInNewTab = !! attributes.openInNewTab;
	const rel = [
		attributes.rel || '',
		openInNewTab ? 'noopener noreferrer' : '',
	]
		.filter( Boolean )
		.join( ' ' );
	const excerptLength = clamp(
		attributes.excerptLength ?? 55,
		MIN_EXCERPT,
		MAX_EXCERPT
	);

	const rows = items.map( ( item ) => {
		const title = escapeHtml( item.title || __( '(no title)' ) );
		const href = safeLink( item.link );
		const titleNode = href
			? `<a href="${ escapeHtml( href ) }"${
					openInNewTab ? ' target="_blank"' : ''
			  }${ rel ? ` rel="${ escapeHtml( rel ) }"` : '' }>${ title }</a>`
			: title;
		const author =
			attributes.displayAuthor && item.author
				? `<div class="wp-block-rss__item-author">${ escapeHtml(
						item.author
				  ) }</div>`
				: '';
		const dateText =
			attributes.displayDate && item.publishedAt
				? formatDate( item.publishedAt )
				: '';
		const date = dateText
			? `<time class="wp-block-rss__item-publish-date"${
					item.publishedAt
						? ` datetime="${ escapeHtml( item.publishedAt ) }"`
						: ''
			  }>${ escapeHtml( dateText ) }</time>`
			: '';
		let excerpt = '';
		if ( attributes.displayExcerpt && item.excerpt ) {
			const characters = Array.from( item.excerpt );
			const text =
				characters.length > excerptLength
					? `${ characters.slice( 0, excerptLength ).join( '' ) }…`
					: item.excerpt;
			excerpt = `<div class="wp-block-rss__item-excerpt">${ escapeHtml(
				text
			) }</div>`;
		}
		return `<li class="wp-block-rss__item"><div class="wp-block-rss__item-title">${ titleNode }</div>${ author }${ date }${ excerpt }</li>`;
	} );

	return `<ul class="${ classes.join( ' ' ) }">${ rows.join( '' ) }</ul>`;
}

function ProjectRssPreview( { attributes, blockProps } ) {
	const feedURL = ( attributes.feedURL || '' ).trim();
	const itemsToShow = attributes.itemsToShow ?? DEFAULT_ITEMS;
	const [ status, setStatus ] = useState( 'idle' );
	const [ feed, setFeed ] = useState( null );
	const [ error, setError ] = useState( '' );

	useEffect( () => {
		if ( ! feedURL ) {
			setStatus( 'idle' );
			setFeed( null );
			return;
		}
		const controller = new AbortController();
		const timer = window.setTimeout( () => {
			setStatus( 'loading' );
			fetchRssFeed( feedURL, itemsToShow, controller.signal )
				.then( ( data ) => {
					if ( controller.signal.aborted ) {
						return;
					}
					setFeed( data );
					setStatus( 'success' );
				} )
				.catch( ( fetchError ) => {
					if ( controller.signal.aborted ) {
						return;
					}
					setError(
						fetchError instanceof Error
							? fetchError.message
							: __( 'Unknown error' )
					);
					setStatus( 'error' );
				} );
		}, 400 );

		return () => {
			window.clearTimeout( timer );
			controller.abort();
		};
	}, [ feedURL, itemsToShow ] );

	if ( status === 'loading' ) {
		return (
			<div { ...blockProps }>
				<WCSpinner />
			</div>
		);
	}
	if ( status === 'error' ) {
		return (
			<div { ...blockProps }>
				<p>
					{ sprintf(
						/* translators: %s: error message returned when rendering the block. */
						__( 'Error: %s' ),
						error
					) }
				</p>
			</div>
		);
	}
	if ( status === 'success' && ( ! feed || feed.items.length === 0 ) ) {
		return (
			<div { ...blockProps }>
				<Placeholder>{ __( 'Block rendered as empty.' ) }</Placeholder>
			</div>
		);
	}
	if ( status === 'success' ) {
		return (
			<HtmlRenderer
				wrapperProps={ blockProps }
				html={ buildHtml( feed, attributes ) }
			/>
		);
	}
	return null;
}

function MockRssPreview( { attributes, blockProps, block } ) {
	const { content, status, error } = useServerSideRender( {
		attributes,
		skipBlockSupportAttributes: true,
		block,
	} );

	if ( status === 'loading' ) {
		return (
			<div { ...blockProps }>
				<WCSpinner />
			</div>
		);
	}
	if ( status === 'error' ) {
		return (
			<div { ...blockProps }>
				<p>
					{ sprintf(
						/* translators: %s: error message returned when rendering the block. */
						__( 'Error: %s' ),
						error
					) }
				</p>
			</div>
		);
	}
	if ( status === 'success' ) {
		return <HtmlRenderer wrapperProps={ blockProps } html={ content } />;
	}
	return null;
}

export default function RssPreview( props ) {
	return isProjectContentSource() ? (
		<ProjectRssPreview { ...props } />
	) : (
		<MockRssPreview { ...props } />
	);
}
