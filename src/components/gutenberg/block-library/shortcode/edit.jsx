import { __ } from '@/lib/gutenberg/i18n';
import { PlainText, useBlockProps } from '@/components/gutenberg/block-editor';
import { useInstanceId } from '@/hooks/gutenberg/compose';
import { Placeholder } from '@/components/gutenberg/ui';
import { shortcode } from '@/components/gutenberg/icons';

export default function ShortcodeEdit( { attributes, setAttributes } ) {
	const instanceId = useInstanceId( ShortcodeEdit );
	const inputId = `blocks-shortcode-input-${ instanceId }`;

	return (
		<div { ...useBlockProps() }>
			<Placeholder icon={ shortcode } label={ __( 'Shortcode' ) }>
				<PlainText
					className="blocks-shortcode__textarea"
					id={ inputId }
					value={ attributes.text }
					aria-label={ __( 'Shortcode text' ) }
					placeholder={ __( 'Write shortcode here…' ) }
					onChange={ ( text ) => setAttributes( { text } ) }
				/>
			</Placeholder>
		</div>
	);
}
