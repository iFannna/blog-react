import { __ } from '@/lib/gutenberg/i18n';
import { useBlockProps } from '@/components/gutenberg/block-editor';

export default function NextPageEdit() {
	return (
		<div { ...useBlockProps() }>
			<span>{ __( 'Page break' ) }</span>
		</div>
	);
}
