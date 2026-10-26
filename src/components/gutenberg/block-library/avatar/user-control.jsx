import { __ } from '@/lib/gutenberg/i18n';
import { ComboboxControl } from '@/components/gutenberg/ui';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useMemo, useState } from '@/lib/gutenberg/element';
import { debounce } from '@/hooks/gutenberg/compose';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import {
	isProjectContentSource,
	useProjectUserOptions,
} from '@/services/gutenberg/project/content';

const AUTHORS_QUERY = {
	who: 'authors',
	per_page: 100,
	_fields: 'id,name',
	context: 'view',
};

export default function UserControl( { value, onChange } ) {
	const [ filterValue, setFilterValue ] = useState( '' );
	const projectActive = isProjectContentSource();
	const projectUsers = useProjectUserOptions();
	const { authors, isLoading } = useSelect(
		( select ) => {
			if ( isProjectContentSource() ) {
				return { authors: null, isLoading: false };
			}

			const { getUsers, isResolving } = select( coreStore );

			const query = { ...AUTHORS_QUERY };
			if ( filterValue ) {
				query.search = filterValue;
				query.search_columns = [ 'name' ];
			}

			return {
				authors: getUsers( query ),
				isLoading: isResolving( 'getUsers', [ query ] ),
			};
		},
		[ filterValue ]
	);

	const options = useMemo( () => {
		if ( projectActive ) {
			const keyword = filterValue.trim().toLowerCase();
			return ( projectUsers ?? [] )
				.filter(
					( user ) =>
						! keyword ||
						user.nickname.toLowerCase().includes( keyword )
				)
				.map( ( user ) => {
					return {
						value: user.id,
						label: decodeEntities( user.nickname ),
					};
				} );
		}

		return ( authors ?? [] ).map( ( author ) => {
			return {
				value: author.id,
				label: decodeEntities( author.name ),
			};
		} );
	}, [ authors, filterValue, projectActive, projectUsers ] );

	return (
		<ComboboxControl
			label={ __( 'User' ) }
			help={ __(
				'Select the avatar user to display, if it is blank it will use the post/page author.'
			) }
			value={ value }
			onChange={ onChange }
			options={ options }
			onFilterValueChange={ debounce( setFilterValue, 300 ) }
			isLoading={ projectActive ? projectUsers === null : isLoading }
		/>
	);
}
