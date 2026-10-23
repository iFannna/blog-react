import { _x } from '@/lib/gutenberg/i18n';
import { RawHTML } from '@/lib/gutenberg/element';
import { Disabled } from '@/components/gutenberg/ui';
import { useEntityProp } from '@/stores/gutenberg/core-data';
import { useBlockProps } from '@/components/gutenberg/block-editor';
import useDeprecatedTextAlign from '../utils/deprecated-text-align-attributes';

export default function Edit( props ) {
	const {
		context: { commentId },
	} = props;
	useDeprecatedTextAlign( props );
	const blockProps = useBlockProps();
	const [ content ] = useEntityProp(
		'root',
		'comment',
		'content',
		commentId
	);

	if ( ! commentId || ! content ) {
		return (
			<>
				<div { ...blockProps }>
					<p>{ _x( 'Comment Content', 'block title' ) }</p>
				</div>
			</>
		);
	}

	return (
		<>
			<div { ...blockProps }>
				<Disabled>
					<RawHTML key="html">{ content.rendered }</RawHTML>
				</Disabled>
			</div>
		</>
	);
}
