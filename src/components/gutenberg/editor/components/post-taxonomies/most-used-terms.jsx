import { BaseControl, Button } from '@/components/gutenberg/ui';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { unescapeTerms } from '../../utils/terms';

const MIN_MOST_USED_TERMS = 3;
const DEFAULT_QUERY = {
	per_page: 10,
	orderby: 'count',
	order: 'desc',
	hide_empty: true,
	_fields: 'id,name,count',
	context: 'view',
};

export default function MostUsedTerms( { onSelect, taxonomy, terms: providedTerms } ) {
	const hasProvidedTerms = providedTerms != null;
	const { _terms, showTerms } = useSelect(
		( select ) => {
			if ( hasProvidedTerms ) {
				return {
					_terms: providedTerms,
					showTerms: providedTerms.length > 0,
				};
			}
			const mostUsedTerms = select( coreStore ).getEntityRecords(
				'taxonomy',
				taxonomy.slug,
				DEFAULT_QUERY
			);
			return {
				_terms: mostUsedTerms,
				showTerms: mostUsedTerms?.length >= MIN_MOST_USED_TERMS,
			};
		},
		[ taxonomy.slug, hasProvidedTerms, providedTerms ]
	);

	if ( ! showTerms ) {
		return null;
	}

	const terms = unescapeTerms( _terms );
	// 项目数据没有使用次数，展示全部已有术语
	const label = hasProvidedTerms
		? taxonomy?.labels?.all_items ?? taxonomy.labels.most_used
		: taxonomy.labels.most_used;

	return (
		<div className="editor-post-taxonomies__flat-term-most-used">
			<BaseControl.VisualLabel
				as="h3"
				className="editor-post-taxonomies__flat-term-most-used-label"
			>
				{ label }
			</BaseControl.VisualLabel>
			{ /*
			 * Disable reason: The `list` ARIA role is redundant but
			 * Safari+VoiceOver won't announce the list otherwise.
			 */
			/* eslint-disable jsx-a11y/no-redundant-roles */ }
			<ul
				role="list"
				className="editor-post-taxonomies__flat-term-most-used-list"
			>
				{ terms.map( ( term ) => (
					<li key={ term.id }>
						<Button
							__next40pxDefaultSize
							variant="link"
							onClick={ () => onSelect( term ) }
						>
							{ term.name }
						</Button>
					</li>
				) ) }
			</ul>
			{ /* eslint-enable jsx-a11y/no-redundant-roles */ }
		</div>
	);
}
