import { dispatch, select } from '@/stores/gutenberg/data';
import { store as blocksStore } from '../store';
import type { BlockCategory } from '../types';

/**
 * Returns all the block categories.
 * Ignored from documentation as the recommended usage is via useSelect from `@wordpress/data`.
 *
 * @ignore
 *
 * @return Block categories.
 */
export function getCategories(): BlockCategory[] {
	return select( blocksStore ).getCategories();
}

/**
 * Sets the block categories.
 *
 * @param categories Block categories.
 *
 * @example
 * ```js
 * import { __ } from '@/lib/gutenberg/i18n';
 * import { store as blocksStore, setCategories } from '@/lib/gutenberg/blocks';
 * import { useSelect } from '@/stores/gutenberg/data';
 * import { Button } from '@/components/gutenberg/ui';
 *
 * const ExampleComponent = () => {
 *     // Retrieve the list of current categories.
 *     const blockCategories = useSelect(
 *         ( select ) => select( blocksStore ).getCategories(),
 *         []
 *     );
 *
 *     return (
 *         <Button
 *             onClick={ () => {
 *                 // Add a custom category to the existing list.
 *                 setCategories( [
 *                     ...blockCategories,
 *                     { title: 'Custom Category', slug: 'custom-category' },
 *                 ] );
 *             } }
 *         >
 *             { __( 'Add a new custom block category' ) }
 *         </Button>
 *     );
 * };
 * ```
 */
export function setCategories( categories: BlockCategory[] ): void {
	dispatch( blocksStore ).setCategories( categories );
}

/**
 * Updates a category.
 *
 * @param slug     Block category slug.
 * @param category Object containing the category properties
 *                 that should be updated.
 *
 * @example
 * ```js
 * import { __ } from '@/lib/gutenberg/i18n';
 * import { updateCategory } from '@/lib/gutenberg/blocks';
 * import { Button } from '@/components/gutenberg/ui';
 *
 * const ExampleComponent = () => {
 *     return (
 *         <Button
 *             onClick={ () => {
 *                 updateCategory( 'text', { title: __( 'Written Word' ) } );
 *             } }
 *         >
 *             { __( 'Update Text category title' ) }
 *         </Button>
 * )    ;
 * };
 * ```
 */
export function updateCategory(
	slug: string,
	category: Partial< BlockCategory >
): void {
	dispatch( blocksStore ).updateCategory( slug, category );
}
