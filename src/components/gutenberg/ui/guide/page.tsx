import { useEffect } from '@/lib/gutenberg/element';
import deprecated from '@/utils/gutenberg/deprecated';
import type { WordPressComponentProps } from '../context';

export default function GuidePage(
	props: WordPressComponentProps< {}, 'div', false >
) {
	useEffect( () => {
		deprecated( '<GuidePage>', {
			since: '5.5',
			alternative: 'the `pages` prop in <Guide>',
		} );
	}, [] );

	return <div { ...props } />;
}
