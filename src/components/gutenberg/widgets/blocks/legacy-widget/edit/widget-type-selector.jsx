import { Spinner as WCSpinner } from '@/components/gutenberg/ui';
import { SelectControl } from '@/components/gutenberg/design-system';
import { __ } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';

export default function WidgetTypeSelector( { selectedId, onSelect } ) {
	const widgetTypes = useSelect( ( select ) => {
		const hiddenIds =
			select( blockEditorStore ).getSettings()
				?.widgetTypesToHideFromLegacyWidgetBlock ?? [];
		return select( coreStore )
			.getWidgetTypes( { per_page: -1 } )
			?.filter( ( widgetType ) => ! hiddenIds.includes( widgetType.id ) );
	}, [] );

	if ( ! widgetTypes ) {
		return <WCSpinner />;
	}

	if ( widgetTypes.length === 0 ) {
		return __( 'There are no widgets available.' );
	}

	const items = [
		{ value: '', label: __( 'Select widget' ) },
		...widgetTypes.map( ( widgetType ) => ( {
			value: widgetType.id,
			label: widgetType.name,
		} ) ),
	];

	return (
		<SelectControl
			label={ __( 'Legacy widget' ) }
			value={
				items.find( ( item ) => item.value === selectedId ) ??
				items[ 0 ]
			}
			items={ items }
			onValueChange={ ( item ) => {
				const value = item?.value;
				if ( value ) {
					const selected = widgetTypes.find(
						( widgetType ) => widgetType.id === value
					);
					onSelect( {
						selectedId: selected.id,
						isMulti: selected.is_multi,
					} );
				} else {
					onSelect( { selectedId: null } );
				}
			} }
		/>
	);
}
