import { useMemo, useState } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import { Dropdown, Button } from '@/components/gutenberg/ui';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { safeDecodeURIComponent } from '@/utils/gutenberg/url';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { Link } from '@/components/gutenberg/design-system';
import PostURLCheck from './check';
import PostURL from './index';
import PostPanelRow from '../post-panel-row';
import { store as editorStore } from '../../store';

/**
 * Renders the `PostURLPanel` component.
 *
 * @return {React.ReactNode} The rendered PostURLPanel component.
 */
export default function PostURLPanel() {
	const { isFrontPage } = useSelect( ( select ) => {
		const { getCurrentPostId } = select( editorStore );
		const { getEditedEntityRecord, canUser } = select( coreStore );
		const siteSettings = canUser( 'read', {
			kind: 'root',
			name: 'site',
		} )
			? getEditedEntityRecord( 'root', 'site' )
			: undefined;
		const _id = getCurrentPostId();
		return {
			isFrontPage: siteSettings?.page_on_front === _id,
		};
	}, [] );
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ( {
			// Anchor the popover to the middle of the entire row so that it doesn't
			// move around when the label changes.
			anchor: popoverAnchor,
			placement: 'left-start',
			offset: 36,
			shift: true,
		} ),
		[ popoverAnchor ]
	);

	const label = isFrontPage ? __( 'Link' ) : __( 'Slug' );

	return (
		<PostURLCheck>
			<PostPanelRow label={ label } ref={ setPopoverAnchor }>
				{ ! isFrontPage && (
					<Dropdown
						popoverProps={ popoverProps }
						className="editor-post-url__panel-dropdown"
						contentClassName="editor-post-url__panel-dialog"
						focusOnMount
						renderToggle={ ( { isOpen, onToggle } ) => (
							<PostURLToggle
								isOpen={ isOpen }
								onClick={ onToggle }
							/>
						) }
						renderContent={ ( { onClose } ) => (
							<PostURL onClose={ onClose } />
						) }
					/>
				) }
				{ isFrontPage && <FrontPageLink /> }
			</PostPanelRow>
		</PostURLCheck>
	);
}

function PostURLToggle( { isOpen, onClick } ) {
	const { slug } = useSelect( ( select ) => {
		return {
			slug: select( editorStore ).getEditedPostSlug(),
		};
	}, [] );
	// A draft without a slug or a title has no slug yet.
	const decodedSlug = safeDecodeURIComponent( slug ) || __( 'None' );
	return (
		<Button
			size="compact"
			className="editor-post-url__panel-toggle"
			variant="tertiary"
			aria-expanded={ isOpen }
			aria-label={
				// translators: %s: Current post link.
				sprintf( __( 'Change link: %s' ), decodedSlug )
			}
			onClick={ onClick }
		>
			<>{ decodedSlug }</>
		</Button>
	);
}

function FrontPageLink() {
	const { postLink } = useSelect( ( select ) => {
		const { getCurrentPost } = select( editorStore );
		return {
			postLink: getCurrentPost()?.link,
		};
	}, [] );

	return (
		<Link
			className="editor-post-url__front-page-link"
			href={ postLink }
			openInNewTab
		>
			{ postLink }
		</Link>
	);
}
