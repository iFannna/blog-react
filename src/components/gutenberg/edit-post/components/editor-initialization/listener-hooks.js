import { useSelect } from '@/stores/gutenberg/data';
import { useEffect, useRef } from '@/lib/gutenberg/element';
import { store as editorStore } from '@/components/gutenberg/editor';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import {
	VIEW_AS_LINK_SELECTOR,
	VIEW_AS_PREVIEW_LINK_SELECTOR,
} from '../../store/constants';

/**
 * This listener hook monitors any change in permalink and updates the view
 * post link in the admin bar.
 */
export const useUpdatePostLinkListener = () => {
	const { isViewable, newPermalink } = useSelect( ( select ) => {
		const { getPostType } = select( coreStore );
		const { getCurrentPost, getEditedPostAttribute } =
			select( editorStore );
		const postType = getPostType( getEditedPostAttribute( 'type' ) );
		return {
			isViewable: postType?.viewable,
			newPermalink: getCurrentPost().link,
		};
	}, [] );

	const nodeToUpdateRef = useRef();

	useEffect( () => {
		nodeToUpdateRef.current =
			document.querySelector( VIEW_AS_PREVIEW_LINK_SELECTOR ) ||
			document.querySelector( VIEW_AS_LINK_SELECTOR );
	}, [] );

	useEffect( () => {
		if ( ! newPermalink || ! nodeToUpdateRef.current ) {
			return;
		}

		if ( ! isViewable ) {
			nodeToUpdateRef.current.style.display = 'none';
			return;
		}

		nodeToUpdateRef.current.style.display = '';
		nodeToUpdateRef.current.setAttribute( 'href', newPermalink );
	}, [ newPermalink, isViewable ] );
};
