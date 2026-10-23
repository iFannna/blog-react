declare module 'mousetrap' {
	export interface ExtendedKeyboardEvent extends KeyboardEvent {
		returnValue: boolean;
	}

	export default class Mousetrap {
		constructor( element?: Element | string );

		bind(
			keys: string | string[],
			callback: ( event: ExtendedKeyboardEvent, combo: string ) => void,
			action?: string
		): this;
		unbind( keys: string | string[], action?: string ): this;
		trigger( keys: string, action?: string ): this;
		reset(): this;

		static bind(
			keys: string | string[],
			callback: ( event: ExtendedKeyboardEvent, combo: string ) => void,
			action?: string
		): typeof Mousetrap;
		static unbind(
			keys: string | string[],
			action?: string
		): typeof Mousetrap;
		static trigger( keys: string, action?: string ): typeof Mousetrap;
		static reset(): typeof Mousetrap;
	}
}

declare namespace Mousetrap {
	interface ExtendedKeyboardEvent extends KeyboardEvent {
		returnValue: boolean;
	}
}

declare module 'highlight-words-core' {
	export interface FindChunksArgs {
		autoEscape?: boolean;
		caseSensitive?: boolean;
		sanitize?: ( text: string ) => string;
		searchWords: string[];
		textToHighlight: string;
	}

	export interface FindAllArgs extends FindChunksArgs {}

	export interface Chunk {
		start: number;
		end: number;
		highlight: boolean;
	}

	export function findAll( args: FindAllArgs ): Chunk[];
	export function findChunks( args: FindChunksArgs ): Chunk[];
}

declare module 'react-is' {
	export function isValidElementType( type: unknown ): boolean;
}

declare module 'postcss-prefix-selector' {
	import type { PluginCreator } from 'postcss';

	interface PrefixSelectorOptions {
		prefix: string;
		transform?: (
			prefix: string,
			selector: string,
			prefixedSelector: string
		) => string;
		exclude?: RegExp | string | string[];
		includeFiles?: RegExp | string | string[];
		ignoreFiles?: RegExp | string | string[];
	}

	const prefixSelector: PluginCreator< PrefixSelectorOptions >;
	export default prefixSelector;
}
