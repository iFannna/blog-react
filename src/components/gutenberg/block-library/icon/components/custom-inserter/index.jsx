import { __ } from '@/lib/gutenberg/i18n';
import { Modal, SearchControl } from '@/components/gutenberg/ui';
import { Stack, Tabs } from '@/components/gutenberg/design-system';
import { useState, useMemo } from '@/lib/gutenberg/element';
import { useDebounce } from '@/hooks/gutenberg/compose';
import {
	iconCollections,
	getIconsByCollection,
} from '@/services/gutenberg/icons/catalog';
import IconGrid from './icon-grid';
import { normalizeSearchInput } from '../../../utils/search-patterns';

export default function CustomInserterModal( { onClose, value, onChange } ) {
	const [ searchInput, setSearchInput ] = useState( '' );
	const [ currentCollection, setCurrentCollection ] = useState( null );

	const debouncedSetSearchInput = useDebounce( setSearchInput, 300 );

	const collections = iconCollections;

	// Default to the collection the selected icon belongs to, otherwise the
	// first collection.
	const selectedCollection = value?.split( '/' )[ 0 ];
	const collectionSlug =
		currentCollection ??
		( collections.some( ( { slug } ) => slug === selectedCollection )
			? selectedCollection
			: collections[ 0 ]?.slug ) ??
		null;

	const icons = useMemo(
		() =>
			collectionSlug === null
				? null
				: getIconsByCollection( collectionSlug ),
		[ collectionSlug ]
	);

	const filteredIcons = useMemo( () => {
		if ( ! icons ) {
			return [];
		}
		if ( searchInput ) {
			const input = normalizeSearchInput( searchInput );
			return icons.filter( ( icon ) => {
				const iconName = normalizeSearchInput( icon.name );
				const iconLabel = normalizeSearchInput( icon.label );

				return (
					iconName.includes( input ) ||
					iconLabel.includes( input ) ||
					( icon.keywords ?? [] ).some( ( keyword ) =>
						normalizeSearchInput( keyword ).includes( input )
					)
				);
			} );
		}

		return icons;
	}, [ searchInput, icons ] );

	return (
		<Modal
			className="wp-block-icon__inserter-modal"
			title={ __( 'Icon library' ) }
			onRequestClose={ onClose }
			isFullScreen
		>
			<Tabs.Root
				className="wp-block-icon__inserter"
				orientation="vertical"
				value={ collectionSlug }
				onValueChange={ setCurrentCollection }
			>
				<Stack
					direction="column"
					gap="lg"
					className="wp-block-icon__inserter-sidebar"
				>
					<SearchControl
						value={ searchInput }
						onChange={ debouncedSetSearchInput }
					/>
					<Tabs.List>
						<Tabs.Tab value="">{ __( 'All' ) }</Tabs.Tab>
						{ collections.map( ( collection ) => (
							<Tabs.Tab
								key={ collection.slug }
								value={ collection.slug }
							>
								{ collection.label }
							</Tabs.Tab>
						) ) }
					</Tabs.List>
				</Stack>
				{ [ { slug: '' }, ...collections ].map( ( collection ) => (
					<Tabs.Panel
						tabIndex={ -1 }
						key={ collection.slug }
						value={ collection.slug }
						className="wp-block-icon__inserter-panel"
					>
						<IconGrid
							icons={ filteredIcons }
							onChange={ onChange }
							value={ value }
							collections={
								collectionSlug === '' &&
								collections.length > 1
									? collections
									: undefined
							}
						/>
					</Tabs.Panel>
				) ) }
			</Tabs.Root>
		</Modal>
	);
}
