import { useContext } from '@/lib/gutenberg/element';
import DataViewsContext from '../dataviews-context';
import Filters from './filters';

function FiltersToggled( props: { className?: string } ) {
	const { isShowingFilter } = useContext( DataViewsContext );
	if ( ! isShowingFilter ) {
		return null;
	}
	return <Filters { ...props } />;
}

export default FiltersToggled;
