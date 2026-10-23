import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@/components/gutenberg/ui';
import { __, _x } from '@/lib/gutenberg/i18n';
import { useContext } from '@/lib/gutenberg/element';
import DataViewsContext from '../../dataviews-context';
import type {
	ViewTable,
	ViewList,
	ViewGrid,
	ViewPickerGrid,
	Density,
} from '../../../types';

export default function DensityPicker() {
	const context = useContext( DataViewsContext );
	const view = context.view as
		ViewTable | ViewList | ViewGrid | ViewPickerGrid;
	return (
		<ToggleGroupControl
			label={ __( 'Density' ) }
			value={ view.layout?.density || 'balanced' }
			onChange={ ( value ) => {
				context.onChangeView( {
					...view,
					layout: {
						...view.layout,
						density: value as Density,
					},
				} );
			} }
			isBlock
		>
			<ToggleGroupControlOption
				key="comfortable"
				value="comfortable"
				label={ _x(
					'Comfortable',
					'Density option for DataView layout'
				) }
			/>
			<ToggleGroupControlOption
				key="balanced"
				value="balanced"
				label={ _x( 'Balanced', 'Density option for DataView layout' ) }
			/>
			<ToggleGroupControlOption
				key="compact"
				value="compact"
				label={ _x( 'Compact', 'Density option for DataView layout' ) }
			/>
		</ToggleGroupControl>
	);
}
