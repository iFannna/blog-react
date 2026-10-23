import { RawHTML } from '@/lib/gutenberg/element';

export default function save( { attributes } ) {
	return <RawHTML>{ attributes.text }</RawHTML>;
}
