import { RawHTML } from '@/lib/gutenberg/element';

export default function save( { attributes } ) {
	// Preserve the missing block's content.
	return <RawHTML>{ attributes.originalContent }</RawHTML>;
}
