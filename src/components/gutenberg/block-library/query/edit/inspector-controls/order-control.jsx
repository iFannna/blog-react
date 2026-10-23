import { SelectControl as WCSelectControl } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';

const defaultOrderByOptions = [
	{
		label: __( 'Newest to oldest' ),
		value: 'date/desc',
	},
	{
		label: __( 'Oldest to newest' ),
		value: 'date/asc',
	},
	{
		/* translators: Label for ordering posts by title in ascending order. */
		label: __( 'A → Z' ),
		value: 'title/asc',
	},
	{
		/* translators: Label for ordering posts by title in descending order. */
		label: __( 'Z → A' ),
		value: 'title/desc',
	},
];

function OrderControl( {
	order,
	orderBy,
	orderByOptions = defaultOrderByOptions,
	onChange,
} ) {
	return (
		<WCSelectControl
			label={ __( 'Order by' ) }
			value={ `${ orderBy }/${ order }` }
			options={ orderByOptions }
			onChange={ ( value ) => {
				const [ newOrderBy, newOrder ] = value.split( '/' );
				onChange( { order: newOrder, orderBy: newOrderBy } );
			} }
		/>
	);
}

export default OrderControl;
