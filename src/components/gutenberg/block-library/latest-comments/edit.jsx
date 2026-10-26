import { InspectorControls, useBlockProps } from '@/components/gutenberg/block-editor';
import {
	RangeControl,
	SelectControl as WCSelectControl,
	Spinner as WCSpinner,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { useServerSideRender } from '@/components/gutenberg/server-side-render';
import { useDisabled } from '@/hooks/gutenberg/compose';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';
import HtmlRenderer from '../utils/html-renderer';
import {
	commentArticleLink,
	getProjectLocale,
	isProjectContentSource,
	useProjectLatestComments,
} from '@/services/gutenberg/project/content';

/**
 * Minimum number of comments a user can show using this block.
 *
 * @type {number}
 */
const MIN_COMMENTS = 1;
/**
 * Maximum number of comments a user can show using this block.
 *
 * @type {number}
 */
const MAX_COMMENTS = 100;

const EXCERPT_LENGTH = 100;

function formatCommentDate( value ) {
	if ( ! value ) return '';
	const date = new Date( String( value ).replace( /-/g, '/' ) );
	if ( Number.isNaN( date.getTime() ) ) return '';
	return new Intl.DateTimeFormat( getProjectLocale(), {
		dateStyle: 'medium',
	} ).format( date );
}

function trimContent( value ) {
	const text = String( value || '' ).trim();
	if ( text.length <= EXCERPT_LENGTH ) return text;
	return `${ text.slice( 0, EXCERPT_LENGTH ) }…`;
}

function ProjectPreview( { attributes } ) {
	const { commentsToShow, displayAvatar, displayDate, displayContent } =
		attributes;
	const { comments, loading, error } = useProjectLatestComments(
		commentsToShow
	);
	const blockProps = useBlockProps();

	if ( loading ) {
		return (
			<div { ...blockProps }>
				<WCSpinner />
			</div>
		);
	}

	if ( error ) {
		return (
			<div { ...blockProps }>
				<p>{ sprintf( __( 'Error: %s' ), error ) }</p>
			</div>
		);
	}

	if ( ! comments?.length ) {
		return (
			<div { ...blockProps }>
				<p>{ __( 'No comments found.' ) }</p>
			</div>
		);
	}

	const preventNavigation = ( event ) => event.preventDefault();

	return (
		<ol { ...blockProps }>
			{ comments.map( ( comment ) => {
				const link = commentArticleLink( comment );
				return (
					<li
						key={ comment.id }
						className="wp-block-latest-comments__comment"
					>
						<article>
							<footer className="wp-block-latest-comments__comment-meta">
								{ displayAvatar && (
									<img
										className="avatar avatar-48 photo wp-block-latest-comments__comment-avatar"
										src={ comment.author_avatar }
										alt={ comment.author_name }
										width={ 48 }
										height={ 48 }
										decoding="async"
									/>
								) }
								<a
									className="wp-block-latest-comments__comment-author"
									href={ link }
									onClick={ preventNavigation }
								>
									{ comment.author_name || __( 'Anonymous' ) }
								</a>
								{ ` ${ __( 'on' ) } ` }
								<a
									className="wp-block-latest-comments__comment-link"
									href={ link }
									onClick={ preventNavigation }
								>
									{ comment.article_title }
								</a>
								{ displayDate && (
									<time
										className="wp-block-latest-comments__comment-date"
										dateTime={ String( comment.created_at ).replace(
											' ',
											'T'
										) }
									>
										{ formatCommentDate( comment.created_at ) }
									</time>
								) }
							</footer>
							{ displayContent !== 'none' && (
								<div className="wp-block-latest-comments__comment-excerpt">
									<p>
										{ displayContent === 'full'
											? comment.content
											: trimContent( comment.content ) }
									</p>
								</div>
							) }
						</article>
					</li>
				);
			} ) }
		</ol>
	);
}

function CorePreview( { attributes, name } ) {
	const { content, status, error } = useServerSideRender( {
		attributes,
		skipBlockSupportAttributes: true,
		block: name,
		urlQueryArgs: {
			// The preview uses the site's locale to make it more true to how
			// the block appears on the frontend. Setting the locale
			// explicitly prevents any middleware from setting it to 'user'.
			_locale: 'site',
		},
	} );

	const disabledRef = useDisabled();
	const blockProps = useBlockProps( { ref: disabledRef } );

	return (
		<>
			{ status === 'loading' && (
				<div { ...blockProps }>
					<WCSpinner />
				</div>
			) }
			{ status === 'error' && (
				<div { ...blockProps }>
					<p>
						{ sprintf(
							/* translators: %s: error message returned when rendering the block. */
							__( 'Error: %s' ),
							error
						) }
					</p>
				</div>
			) }
			{ status === 'success' && (
				<HtmlRenderer wrapperProps={ blockProps } html={ content } />
			) }
		</>
	);
}

export default function LatestComments( { attributes, setAttributes, name } ) {
	const { commentsToShow, displayAvatar, displayDate, displayContent } =
		attributes;

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							commentsToShow: 5,
							displayAvatar: true,
							displayDate: true,
							displayContent: 'excerpt',
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => ! displayAvatar }
						label={ __( 'Display avatar' ) }
						onDeselect={ () =>
							setAttributes( { displayAvatar: true } )
						}
						isShownByDefault
					>
						<ToggleControl
							label={ __( 'Display avatar' ) }
							checked={ displayAvatar }
							onChange={ () =>
								setAttributes( {
									displayAvatar: ! displayAvatar,
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => ! displayDate }
						label={ __( 'Display date' ) }
						onDeselect={ () =>
							setAttributes( { displayDate: true } )
						}
						isShownByDefault
					>
						<ToggleControl
							label={ __( 'Display date' ) }
							checked={ displayDate }
							onChange={ () =>
								setAttributes( { displayDate: ! displayDate } )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => displayContent !== 'excerpt' }
						label={ __( 'Display content' ) }
						onDeselect={ () =>
							setAttributes( { displayContent: 'excerpt' } )
						}
						isShownByDefault
					>
						<WCSelectControl
							label={ __( 'Display content' ) }
							value={ displayContent }
							options={ [
								{ label: __( 'No content' ), value: 'none' },
								{ label: __( 'Excerpt' ), value: 'excerpt' },
								{ label: __( 'Full content' ), value: 'full' },
							] }
							onChange={ ( value ) =>
								setAttributes( {
									displayContent: value,
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => commentsToShow !== 5 }
						label={ __( 'Number of comments' ) }
						onDeselect={ () =>
							setAttributes( { commentsToShow: 5 } )
						}
						isShownByDefault
					>
						<RangeControl
							label={ __( 'Number of comments' ) }
							value={ commentsToShow }
							onChange={ ( value ) =>
								setAttributes( { commentsToShow: value } )
							}
							min={ MIN_COMMENTS }
							max={ MAX_COMMENTS }
							required
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			{ isProjectContentSource() ? (
				<ProjectPreview attributes={ attributes } />
			) : (
				<CorePreview attributes={ attributes } name={ name } />
			) }
		</>
	);
}
