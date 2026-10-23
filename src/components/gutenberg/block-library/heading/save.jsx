import { RichText, useBlockProps } from '@/components/gutenberg/block-editor';

export default function save( { attributes } ) {
	const { content, level } = attributes;
	const TagName = 'h' + level;

	return (
		<TagName { ...useBlockProps.save() }>
			<RichText.Content value={ content } />
		</TagName>
	);
}
