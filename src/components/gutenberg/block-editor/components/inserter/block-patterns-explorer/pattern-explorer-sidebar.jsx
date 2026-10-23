import { SearchControl } from '@/components/gutenberg/ui';
import { Stack, Tabs } from '@/components/gutenberg/design-system';
import { __ } from '@/lib/gutenberg/i18n';

function PatternExplorerSidebar( {
	patternCategories,
	searchValue,
	setSearchValue,
} ) {
	return (
		<Stack
			direction="column"
			gap="lg"
			className="block-editor-block-patterns-explorer__sidebar"
		>
			<SearchControl
				onChange={ setSearchValue }
				value={ searchValue }
				label={ __( 'Search' ) }
				placeholder={ __( 'Search' ) }
			/>
			<Tabs.List>
				{ patternCategories.map( ( { name, label } ) => (
					<Tabs.Tab key={ name } value={ name }>
						{ label }
					</Tabs.Tab>
				) ) }
			</Tabs.List>
		</Stack>
	);
}

export default PatternExplorerSidebar;
