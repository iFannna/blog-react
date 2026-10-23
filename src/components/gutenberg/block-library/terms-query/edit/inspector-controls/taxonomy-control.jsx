import { SelectControl as WCSelectControl } from '@/components/gutenberg/ui';
import { usePublicTaxonomies } from '../../utils';

export default function TaxonomyControl( { value, onChange, ...props } ) {
	const taxonomies = usePublicTaxonomies();
	const taxonomyOptions = taxonomies.map( ( taxonomy ) => ( {
		label: taxonomy.name,
		value: taxonomy.slug,
	} ) );

	return (
		<WCSelectControl
			options={ taxonomyOptions }
			value={ value }
			onChange={ onChange }
			{ ...props }
		/>
	);
}
