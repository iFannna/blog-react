import {
	setDefaultBlockName,
	setUnregisteredTypeHandlerName,
	setGroupingBlockName,
	registerBlockType,
	store as blocksStore,
} from '@/lib/gutenberg/blocks';
import { useDisabled } from '@/hooks/gutenberg/compose';
import { select } from '@/stores/gutenberg/data';
import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useServerSideRender } from '@/components/gutenberg/server-side-render';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import HtmlRenderer from './utils/html-renderer';
// Experimental blocks are only registered in the Gutenberg plugin (see
// `__experimentalRegisterExperimentalCoreBlocks`). `registerCoreBlocks`
// filters them out via `isBlockMetadataExperimental`, so they are never
// available in WordPress core regardless of what ends up in the bundle.
import * as accordion from './accordion';
import * as accordionItem from './accordion-item';
import * as accordionHeading from './accordion-heading';
import * as accordionPanel from './accordion-panel';
import * as archives from './archives';
import * as avatar from './avatar';
import * as audio from './audio';
import * as breadcrumbs from './breadcrumbs';
import * as button from './button';
import * as buttons from './buttons';
import * as calendar from './calendar';
import * as categories from './categories';
import * as code from './code';
import * as column from './column';
import * as columns from './columns';
import * as cover from './cover';
import * as details from './details';
import * as file from './file';
import * as gallery from './gallery';
import * as group from './group';
import * as heading from './heading';
import * as homeLink from './home-link';
import * as html from './html';
import * as icon from './icon';
import * as image from './image';
import * as latestComments from './latest-comments';
import * as latestPosts from './latest-posts';
import * as list from './list';
import * as math from './math';
import * as listItem from './list-item';
import * as logInOut from './loginout';
import * as mediaText from './media-text';
import * as missing from './missing';
import * as more from './more';
import * as navigation from './navigation';
import * as navigationLink from './navigation-link';
import * as navigationSubmenu from './navigation-submenu';
import * as nextpage from './nextpage';
import * as navigationOverlayClose from './navigation-overlay-close';
import * as pattern from './pattern';
import * as paragraph from './paragraph';
import * as playlist from './playlist';
import * as playlistTrack from './playlist-track';
import * as postAuthorName from './post-author-name';
import * as postAuthorBiography from './post-author-biography';
import * as postCommentsCount from './post-comments-count';
import * as postCommentsLink from './post-comments-link';
import * as postContent from './post-content';
import * as postDate from './post-date';
import * as postExcerpt from './post-excerpt';
import * as postFeaturedImage from './post-featured-image';
import * as postNavigationLink from './post-navigation-link';
import * as postTemplate from './post-template';
import * as postTerms from './post-terms';
import * as postTimeToRead from './post-time-to-read';
import * as postTitle from './post-title';
import * as preformatted from './preformatted';
import * as pullquote from './pullquote';
import * as query from './query';
import * as queryNoResults from './query-no-results';
import * as queryPagination from './query-pagination';
import * as queryPaginationNext from './query-pagination-next';
import * as queryPaginationNumbers from './query-pagination-numbers';
import * as queryPaginationPrevious from './query-pagination-previous';
import * as queryTitle from './query-title';
import * as queryTotal from './query-total';
import * as quote from './quote';
import * as reusableBlock from './block';
import * as readMore from './read-more';
import * as rss from './rss';
import * as search from './search';
import * as separator from './separator';
import * as siteLogo from './site-logo';
import * as siteTagline from './site-tagline';
import * as siteTitle from './site-title';
import * as socialLink from './social-link';
import * as socialLinks from './social-links';
import * as spacer from './spacer';
import * as tabPanel from './tab-panel';
import * as tabPanels from './tab-panels';
import * as table from './table';
import * as tableOfContents from './table-of-contents';
import * as tabList from './tab-list';
import * as tabs from './tabs';
import * as tagCloud from './tag-cloud';
import * as templatePart from './template-part';
import * as termCount from './term-count';
import * as termName from './term-name';
import * as termsQuery from './terms-query';
import * as termTemplate from './term-template';
import * as verse from './verse';
import * as video from './video';
import * as footnotes from './footnotes';
import isBlockMetadataExperimental from './utils/is-block-metadata-experimental';
import { unlock } from './lock-unlock';

/**
 * Function to get all the block-library blocks in an array
 */
const getAllBlocks = () => {
	const blocks = [
		// Common blocks are grouped at the top to prioritize their display
		// in various contexts — like the inserter and auto-complete components.
		paragraph,
		image,
		heading,
		gallery,
		list,
		listItem,
		quote,

		// Register all remaining core blocks.
		accordion,
		accordionItem,
		accordionHeading,
		accordionPanel,
		archives,
		audio,
		button,
		buttons,
		calendar,
		categories,
		code,
		column,
		columns,
		cover,
		details,
		file,
		group,
		html,
		math,
		latestComments,
		latestPosts,
		mediaText,
		missing,
		more,
		nextpage,
		pattern,
		playlist,
		playlistTrack,
		preformatted,
		pullquote,
		reusableBlock,
		rss,
		search,
		separator,
		socialLink,
		socialLinks,
		spacer,
		table,
		tabs,
		tabList,
		tabPanels,
		tabPanel,
		tagCloud,
		verse,
		video,
		footnotes,

		// theme blocks
		navigation,
		navigationLink,
		navigationSubmenu,
		siteLogo,
		siteTitle,
		siteTagline,
		query,
		templatePart,
		avatar,
		postTitle,
		postExcerpt,
		postFeaturedImage,
		postContent,
		postAuthorName,
		postCommentsCount,
		postCommentsLink,
		postDate,
		postTerms,
		postNavigationLink,
		postTemplate,
		postTimeToRead,
		queryPagination,
		queryPaginationNext,
		queryPaginationNumbers,
		queryPaginationPrevious,
		queryNoResults,
		queryTotal,
		readMore,
		tableOfContents,
		homeLink,
		icon,
		logInOut,
		navigationOverlayClose,
		termCount,
		termName,
		termsQuery,
		termTemplate,
		queryTitle,
		postAuthorBiography,
		breadcrumbs,
	];

	if ( window?.__experimentalEnableBlockExperiments ) {
		// Blocks added here are only registered when the "Block experiments"
		// option is enabled in the Gutenberg > Experiments settings page.
	}

	return blocks.filter( Boolean );
};

/**
 * Function to get all the core blocks in an array.
 *
 * @example
 * ```js
 * import { __experimentalGetCoreBlocks } from '@/components/gutenberg/block-library';
 *
 * const coreBlocks = __experimentalGetCoreBlocks();
 * ```
 */
export const __experimentalGetCoreBlocks = () =>
	getAllBlocks().filter(
		( { metadata } ) => ! isBlockMetadataExperimental( metadata )
	);

/**
 * Function to register core blocks provided by the block editor.
 *
 * @param {Array} blocks An optional array of the core blocks being registered.
 *
 * @example
 * ```js
 * import { registerCoreBlocks } from '@/components/gutenberg/block-library';
 *
 * registerCoreBlocks();
 * ```
 */
export const registerCoreBlocks = (
	blocks = __experimentalGetCoreBlocks()
) => {
	blocks.forEach( ( { init } ) => init() );

	// Auto-register server-registered blocks with ServerSideRender
	if ( window.__unstableAutoRegisterBlocks ) {
		window.__unstableAutoRegisterBlocks.forEach( ( blockName ) => {
			const bootstrappedBlockType = unlock(
				select( blocksStore )
			).getBootstrappedBlockType( blockName );

			registerBlockType( blockName, {
				// Use all metadata from block registration,
				// but fall back title to block name if not provided,
				// ensure minimum apiVersion 3 for block wrapper support,
				// and override with a ServerSideRender-based edit function.
				...bootstrappedBlockType,
				title: bootstrappedBlockType?.title || blockName,
				...( ( bootstrappedBlockType?.apiVersion ?? 0 ) < 3 && {
					apiVersion: 3,
				} ),
				// Always pass the postId context so the server-side render can
				// reproduce the same output as the front end, while preserving
				// any context declared in the block's registration.
				usesContext: Array.from(
					new Set( [
						...( bootstrappedBlockType?.usesContext ?? [] ),
						'postId',
					] )
				),
				// Inspector controls are rendered by the auto-register hook in block-editor
				edit: function Edit( { attributes, context } ) {
					const disabledRef = useDisabled();
					const blockProps = useBlockProps( { ref: disabledRef } );
					const { content, status, error } = useServerSideRender( {
						block: blockName,
						attributes,
						urlQueryArgs: { post_id: context?.postId },
					} );

					if ( status === 'loading' ) {
						return (
							<div { ...blockProps }>{ __( 'Loading…' ) }</div>
						);
					}

					if ( status === 'error' ) {
						return (
							<div { ...blockProps }>
								{ sprintf(
									/* translators: %s: error message describing the problem */
									__( 'Error loading block: %s' ),
									error
								) }
							</div>
						);
					}

					return (
						<HtmlRenderer
							wrapperProps={ blockProps }
							html={ content }
						/>
					);
				},
				save: () => null,
			} );
		} );
	}

	setDefaultBlockName( paragraph.name );
	setUnregisteredTypeHandlerName( missing.name );
	setGroupingBlockName( group.name );
};

/**
 * Function to register experimental core blocks depending on editor settings.
 *
 * @param {boolean} enableFSEBlocks Whether to enable the full site editing blocks.
 * @example
 * ```js
 * import { __experimentalRegisterExperimentalCoreBlocks } from '@/components/gutenberg/block-library';
 *
 * __experimentalRegisterExperimentalCoreBlocks( settings );
 * ```
 */
export const __experimentalRegisterExperimentalCoreBlocks =
	globalThis.IS_GUTENBERG_PLUGIN
		? ( { enableFSEBlocks } = {} ) => {
				const enabledExperiments = [ enableFSEBlocks ? 'fse' : null ];
				getAllBlocks()
					.filter( ( { metadata } ) =>
						isBlockMetadataExperimental( metadata )
					)
					.filter(
						( { metadata: { __experimental } } ) =>
							__experimental === true ||
							enabledExperiments.includes( __experimental )
					)
					.forEach( ( { init } ) => init() );
			}
		: undefined;


