import { RichText, useBlockProps } from '@/components/gutenberg/block-editor';
import { escape } from './utils';

export default function save( { attributes } ) {
	return (
		<pre { ...useBlockProps.save() }>
			<RichText.Content
				tagName="code"
				// To do: `escape` encodes characters in shortcodes and URLs to
				// prevent embedding issues.
				value={ escape(
					typeof attributes.content === 'string'
						? attributes.content
						: attributes.content.toHTMLString( {
								preserveWhiteSpace: true,
							} )
				) }
			/>
		</pre>
	);
}
