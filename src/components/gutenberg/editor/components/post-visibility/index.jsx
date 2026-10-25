import { __ } from '@/lib/gutenberg/i18n';
import {
	RadioControl,
	__experimentalVStack as VStack,
} from '@/components/gutenberg/ui';
import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@/components/gutenberg/block-editor';
import { Text } from '@/components/gutenberg/design-system';
import { VISIBILITY_OPTIONS } from './utils';
import { store as editorStore } from '../../store';

/**
 * Allows users to set the visibility of a post.
 *
 * @param {Object}   props         The component props.
 * @param {Function} props.onClose Function to call when the popover is closed.
 * @return {React.ReactNode} The rendered component.
 */
export default function PostVisibility( props ) {
	return <PrivatePostVisibility { ...props } showPopoverHeader />;
}

/**
 * Allows users to set the visibility of a post.
 *
 * @param {Object}   props                   The component props.
 * @param {Function} props.onClose           Function to call when the popover is closed.
 * @param {boolean}  props.showPopoverHeader Whether to render the popover header. Set it
 *                                           to `false` when the component is rendered
 *                                           inline, where the surrounding UI already
 *                                           provides a heading.
 * @return {React.ReactNode} The rendered component.
 */
export function PrivatePostVisibility( { onClose, showPopoverHeader } ) {
	const { status, visibility } = useSelect( ( select ) => ( {
		status: select( editorStore ).getEditedPostAttribute( 'status' ),
		visibility: select( editorStore ).getEditedPostVisibility(),
	} ) );

	const { editPost } = useDispatch( editorStore );

	function updateVisibility( value ) {
		editPost( {
			status:
				value === 'private'
					? 'private'
					: visibility === 'private'
						? 'draft'
						: status,
		} );
	}

	const help = __( 'Control how this post is viewed.' );

	return (
		<div className="editor-post-visibility">
			{ showPopoverHeader && (
				<InspectorPopoverHeader
					title={ __( 'Visibility' ) }
					help={ help }
					onClose={ onClose }
				/>
			) }
			<VStack spacing={ 4 }>
				{ ! showPopoverHeader && (
					<Text render={ <p /> }>{ help }</Text>
				) }
				<RadioControl
					label={ __( 'Visibility' ) }
					hideLabelFromVision
					options={ VISIBILITY_OPTIONS }
					selected={ visibility }
					onChange={ updateVisibility }
				/>
			</VStack>
		</div>
	);
}
