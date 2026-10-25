import { FormTokenField } from '@/components/gutenberg/ui';
import { useState, useEffect, useMemo } from '@/lib/gutenberg/element';
import { useDebounce } from '@/hooks/gutenberg/compose';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { useTermRecords } from '../../../utils/use-term-records';

const EMPTY_ARRAY = [];
const BASE_QUERY = {
	order: 'asc',
	_fields: 'id,name',
	context: 'view',
};

export default function IncludeControl( {
	value: include,
	taxonomy,
	onChange,
	...props
} ) {
	const [ search, setSearch ] = useState( '' );
	const [ value, setValue ] = useState( EMPTY_ARRAY );
	const [ suggestions, setSuggestions ] = useState( EMPTY_ARRAY );
	const debouncedSearch = useDebounce( setSearch, 250 );

	const searchQuery = useMemo(
		() => ( {
			...BASE_QUERY,
			search,
			orderby: 'name',
			exclude: include,
			per_page: 20,
		} ),
		[ search, include ]
	);
	const searchData = useTermRecords( taxonomy, searchQuery );
	const searchResults = search ? searchData.records : EMPTY_ARRAY;
	const searchHasResolved = search ? searchData.hasResolved : true;

	const includeQuery = useMemo(
		() => ( {
			...BASE_QUERY,
			include,
			per_page: include?.length,
		} ),
		[ include ]
	);
	const includeData = useTermRecords( taxonomy, includeQuery );
	const currentTerms = include?.length ? includeData.records : EMPTY_ARRAY;

	// Update the `value` state only after the selectors are resolved
	// to avoid emptying the input when we're changing terms.
	useEffect( () => {
		if ( ! include?.length ) {
			setValue( EMPTY_ARRAY );
		}
		if ( ! currentTerms?.length ) {
			return;
		}
		// Returns only the existing entity ids. This prevents the component
		// from crashing in the editor, when non existing ids are provided.
		const sanitizedValue = include.reduce( ( accumulator, id ) => {
			const entity = currentTerms.find( ( term ) => term.id === id );
			if ( entity ) {
				accumulator.push( {
					id,
					value: decodeEntities( entity.name ),
				} );
			}
			return accumulator;
		}, [] );
		setValue( sanitizedValue );
	}, [ include, currentTerms ] );

	const entitiesInfo = useMemo( () => {
		if ( ! searchResults?.length ) {
			return { names: EMPTY_ARRAY, mapByName: {} };
		}
		const names = [];
		const mapByName = {};
		searchResults.forEach( ( result ) => {
			const decodedName = decodeEntities( result.name );
			names.push( decodedName );
			mapByName[ decodedName ] = result;
		} );
		return { names, mapByName };
	}, [ searchResults ] );

	// Update suggestions only when the query has resolved.
	useEffect( () => {
		if ( ! searchHasResolved ) {
			return;
		}
		setSuggestions( entitiesInfo.names );
	}, [ entitiesInfo.names, searchHasResolved ] );

	const getIdByValue = ( entitiesMappedByName, entity ) =>
		entity?.id || entitiesMappedByName?.[ entity ]?.id;

	const onTermChange = ( newValue ) => {
		const ids = Array.from(
			newValue.reduce( ( accumulator, entity ) => {
				// Verify that new values point to existing entities.
				const id = getIdByValue( entitiesInfo.mapByName, entity );
				if ( id ) {
					accumulator.add( id );
				}
				return accumulator;
			}, new Set() )
		);
		setSuggestions( EMPTY_ARRAY );
		onChange( ids );
	};

	return (
		<FormTokenField
			value={ value }
			onInputChange={ debouncedSearch }
			suggestions={ suggestions }
			onChange={ onTermChange }
			help=""
			{ ...props }
		/>
	);
}
