import { useContext } from '@/lib/gutenberg/element';
import DataViewsContext from '../dataviews-context';
import getFooterMessage from '../../utils/get-footer-message';

export default function DataViewsItemCount() {
	const { data, paginationInfo, view } = useContext( DataViewsContext );
	return (
		<span className="dataviews-footer__item-count">
			{ getFooterMessage(
				0,
				data.length,
				paginationInfo.totalItems,
				!! view.infiniteScrollEnabled
			) }
		</span>
	);
}
