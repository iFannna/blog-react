import { RichText, useBlockProps } from '@/components/gutenberg/block-editor';
import { escape } from './utils';

export default function save( { attributes } ) {
	return (
		<pre
			{ ...useBlockProps.save( {
				// 未选语言时不输出属性，保持旧区块标记逐字不变
				'data-code-language': attributes.language || undefined,
			} ) }
		>
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
