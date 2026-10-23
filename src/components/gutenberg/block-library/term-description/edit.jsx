import { __ } from '@/lib/gutenberg/i18n';
import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useTermDescription } from './use-term-description';

export default function TermDescriptionEdit( {
	context: { termId, taxonomy },
} ) {
	const { termDescription } = useTermDescription( termId, taxonomy );
	const blockProps = useBlockProps();

	return (
		<>
			<div { ...blockProps }>
				{ termDescription ? (
					<div
						dangerouslySetInnerHTML={ { __html: termDescription } }
					/>
				) : (
					<div className="wp-block-term-description__placeholder">
						<span>{ __( 'Term Description' ) }</span>
					</div>
				) }
			</div>
		</>
	);
}
