import type { Ref } from 'react';
import { Button } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { forwardRef } from '@/lib/gutenberg/element';
// eslint-disable-next-line @wordpress/use-recommended-components -- Intentional early adoption of the new Menu, pending WordPress/gutenberg#76135.
import { Menu } from '@/components/gutenberg/design-system';
import type { NormalizedFilter, View } from '../../types';

interface AddFilterProps {
	filters: NormalizedFilter[];
	view: View;
	onChangeView: ( view: View ) => void;
	setOpenedFilter: ( filter: string | null ) => void;
}

export function AddFilterMenu( {
	filters,
	view,
	onChangeView,
	setOpenedFilter,
	triggerProps,
}: AddFilterProps & {
	triggerProps: React.ComponentProps< typeof Menu.Trigger >;
} ) {
	const inactiveFilters = filters.filter( ( filter ) => ! filter.isVisible );
	return (
		<Menu.Root>
			<Menu.Trigger
				{ ...triggerProps }
				disabled={ ! inactiveFilters.length || triggerProps.disabled }
			/>
			<Menu.Popup>
				{ inactiveFilters.map( ( filter ) => {
					return (
						<Menu.Item
							key={ filter.field }
							onClick={ () => {
								setOpenedFilter( filter.field );
								onChangeView( {
									...view,
									page: 1,
									filters: [
										...( view.filters || [] ),
										{
											field: filter.field,
											value: undefined,
											operator: filter.operators[ 0 ],
										},
									],
								} );
							} }
						>
							<Menu.ItemLabel>{ filter.name }</Menu.ItemLabel>
						</Menu.Item>
					);
				} ) }
			</Menu.Popup>
		</Menu.Root>
	);
}

function AddFilter(
	{ filters, view, onChangeView, setOpenedFilter }: AddFilterProps,
	ref: Ref< HTMLButtonElement >
) {
	if ( ! filters.length || filters.every( ( { isPrimary } ) => isPrimary ) ) {
		return null;
	}
	return (
		<AddFilterMenu
			triggerProps={ {
				render: (
					<Button
						accessibleWhenDisabled
						size="compact"
						className="dataviews-filters-button"
						variant="tertiary"
						ref={ ref }
					/>
				),
				children: __( 'Add filter' ),
			} }
			{ ...{ filters, view, onChangeView, setOpenedFilter } }
		/>
	);
}

export default forwardRef( AddFilter );
