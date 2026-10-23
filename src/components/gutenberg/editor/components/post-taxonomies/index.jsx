import { Fragment } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import HierarchicalTermSelector from './hierarchical-term-selector';
import FlatTermSelector from './flat-term-selector';
import { store as editorStore } from '../../store';

const identity = ( x ) => x;

export function PostTaxonomies( { taxonomyWrapper = identity } ) {
	const { postType, taxonomies } = useSelect( ( select ) => {
		return {
			postType: select( editorStore ).getCurrentPostType(),
			taxonomies: select( coreStore ).getEntityRecords(
				'root',
				'taxonomy'
			),
		};
	}, [] );
	const visibleTaxonomies = ( taxonomies ?? [] ).filter(
		( taxonomy ) =>
			// In some circumstances .visibility can end up as undefined so optional chaining operator required.
			// https://github.com/WordPress/gutenberg/issues/40326
			taxonomy.types.includes( postType ) && taxonomy.visibility?.show_ui
	);

	return visibleTaxonomies.map( ( taxonomy ) => {
		const TaxonomyComponent = taxonomy.hierarchical
			? HierarchicalTermSelector
			: FlatTermSelector;

		return (
			<Fragment key={ `taxonomy-${ taxonomy.slug }` }>
				{ taxonomyWrapper(
					<TaxonomyComponent slug={ taxonomy.slug } />,
					taxonomy
				) }
			</Fragment>
		);
	} );
}

/**
 * Renders the taxonomies associated with a post.
 *
 * @param {Object}   props                 The component props.
 * @param {Function} props.taxonomyWrapper The wrapper function for each taxonomy component.
 *
 * @return {Array} An array of JSX elements representing the visible taxonomies.
 */
export default PostTaxonomies;
