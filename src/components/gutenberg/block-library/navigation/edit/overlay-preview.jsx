import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useMemo } from '@/lib/gutenberg/element';
import { parse } from '@/lib/gutenberg/blocks';
import { Spinner as WCSpinner } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { BlockPreview } from '@/components/gutenberg/block-editor';
import { createTemplatePartId } from '../../template-part/edit/utils/create-template-part-id';

/**
 * Component that displays a read-only visual preview of the selected overlay template part.
 *
 * @param {Object} props              Component props.
 * @param {string} props.overlay      The overlay template part slug.
 * @param {string} props.currentTheme The current theme stylesheet name.
 * @return {React.JSX.Element} The overlay preview component or null if no overlay is selected.
 */
export default function OverlayPreview( { overlay, currentTheme } ) {
	const templatePartId = useMemo( () => {
		if ( ! overlay || ! currentTheme ) {
			return null;
		}
		return createTemplatePartId( currentTheme, overlay );
	}, [ currentTheme, overlay ] );

	const { content, editedBlocks, hasResolved } = useSelect(
		( select ) => {
			if ( ! templatePartId ) {
				return {
					content: null,
					editedBlocks: null,
					hasResolved: true,
				};
			}

			const { getEditedEntityRecord, hasFinishedResolution } =
				select( coreStore );

			const editedRecord = getEditedEntityRecord(
				'postType',
				'wp_template_part',
				templatePartId,
				{ context: 'view' }
			);

			return {
				content: editedRecord?.content,
				editedBlocks: editedRecord?.blocks,
				hasResolved: hasFinishedResolution( 'getEditedEntityRecord', [
					'postType',
					'wp_template_part',
					templatePartId,
					{ context: 'view' },
				] ),
			};
		},
		[ templatePartId ]
	);

	const blocks = useMemo( () => {
		if ( ! templatePartId ) {
			return null;
		}

		if ( editedBlocks && editedBlocks.length > 0 ) {
			return editedBlocks;
		}

		if ( content && typeof content === 'string' ) {
			return parse( content );
		}

		return [];
	}, [ templatePartId, editedBlocks, content ] );

	if ( ! overlay ) {
		return null;
	}

	if ( ! hasResolved ) {
		return (
			<div className="wp-block-navigation__overlay-preview-loading">
				<WCSpinner />
			</div>
		);
	}

	return (
		<div
			className="wp-block-navigation__overlay-preview"
			aria-label={ __( 'Navigation Overlay template part preview' ) }
			role="region"
		>
			<BlockPreview.Async
				placeholder={
					<div className="wp-block-navigation__overlay-preview-placeholder" />
				}
			>
				<BlockPreview
					blocks={ blocks }
					viewportWidth={ 400 }
					minHeight={ 200 }
				/>
			</BlockPreview.Async>
		</div>
	);
}
