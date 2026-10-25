import { registerFormatType } from '@/components/gutenberg/rich-text';
import formats from './default-formats';

formats.forEach( ( { name, ...settings } ) =>
	registerFormatType( name, settings )
);
