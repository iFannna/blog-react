import { addFilter } from '@/hooks/gutenberg/hooks';
import { privateApis as patternsPrivateApis } from '@/components/gutenberg/patterns';
import { createHigherOrderComponent } from '@/hooks/gutenberg/compose';
import {
	store as blockEditorStore,
	useBlockEditingMode,
} from '@/components/gutenberg/block-editor';
import { useSelect } from '@/stores/gutenberg/data';
import { getBlockBindingsSource } from '@/lib/gutenberg/blocks';
import { store as editorStore } from '../store';
import { unlock } from '../lock-unlock';

/** @typedef {import('@/lib/gutenberg/blocks').WPBlockSettings} WPBlockSettings */

const {
	PatternOverridesControls,
	ResetOverridesControl,
	PATTERN_TYPES,
	PATTERN_SYNC_TYPES,
} = unlock( patternsPrivateApis );

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning a partial syncing controls to supported blocks in the pattern editor.
 *
 * @param {Component} BlockEdit Original component.
 *
 * @return {Component} Wrapped component.
 */
const withPatternOverrideControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const isSupportedBlock = useSelect(
			( select ) => {
				const { __experimentalBlockBindingsSupportedAttributes } =
					select( blockEditorStore ).getSettings();
				return !! __experimentalBlockBindingsSupportedAttributes?.[
					props.name
				];
			},
			[ props.name ]
		);

		return (
			<>
				<BlockEdit key="edit" { ...props } />
				{ props.isSelected && isSupportedBlock && (
					<ControlsWithStoreSubscription { ...props } />
				) }
			</>
		);
	},
	'withPatternOverrideControls'
);

// Split into a separate component to avoid a store subscription
// on every block.
function ControlsWithStoreSubscription( props ) {
	const blockEditingMode = useBlockEditingMode();
	const { hasPatternOverridesSource, isEditingSyncedPattern } = useSelect(
		( select ) => {
			const { getCurrentPostType, getEditedPostAttribute } =
				select( editorStore );

			return {
				// For editing link to the site editor if the theme and user permissions support it.
				hasPatternOverridesSource: !! getBlockBindingsSource(
					'core/pattern-overrides'
				),
				isEditingSyncedPattern:
					getCurrentPostType() === PATTERN_TYPES.user &&
					getEditedPostAttribute( 'meta' )?.wp_pattern_sync_status !==
						PATTERN_SYNC_TYPES.unsynced &&
					getEditedPostAttribute( 'wp_pattern_sync_status' ) !==
						PATTERN_SYNC_TYPES.unsynced,
			};
		},
		[]
	);

	const bindings = props.attributes.metadata?.bindings;
	const hasPatternBindings =
		!! bindings &&
		Object.values( bindings ).some(
			( binding ) => binding.source === 'core/pattern-overrides'
		);

	const shouldShowPatternOverridesControls =
		isEditingSyncedPattern && blockEditingMode === 'default';
	const shouldShowResetOverridesControl =
		! isEditingSyncedPattern &&
		!! props.attributes.metadata?.name &&
		blockEditingMode !== 'disabled' &&
		hasPatternBindings;

	if ( ! hasPatternOverridesSource ) {
		return null;
	}

	return (
		<>
			{ shouldShowPatternOverridesControls && (
				<PatternOverridesControls { ...props } />
			) }
			{ shouldShowResetOverridesControl && (
				<ResetOverridesControl { ...props } />
			) }
		</>
	);
}

addFilter(
	'editor.BlockEdit',
	'core/editor/with-pattern-override-controls',
	withPatternOverrideControls
);
