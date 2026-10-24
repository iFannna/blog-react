import type { Field, FieldTypeName, Form } from '@/components/gutenberg/dataviews';
import type { AutoGenerateAttribute } from './types';

/**
 * Generates DataForm field definitions from block attributes.
 *
 * This utility enables auto-generated inspector controls for blocks registered
 * with attribute markers, converting block attribute definitions into DataForm
 * field definitions.
 *
 * Attribute schema validation happens during attribute registration, which
 * marks eligible attributes with the `autoGenerateControl` flag. This function
 * processes only those pre-validated attributes.
 *
 * @param attributes - Block type attributes from block registration
 * @return DataForm fields and form definitions
 */
export function generateFieldsFromAttributes(
	attributes: Record< string, AutoGenerateAttribute >
): { fields: Field< Record< string, unknown > >[]; form: Form } {
	const fields: Field< Record< string, unknown > >[] = [];
	const fieldIds: string[] = [];

	Object.entries( attributes ).forEach( ( [ name, def ] ) => {
		if ( ! def.autoGenerateControl ) {
			return;
		}

		const field = createFieldFromAttribute( name, def );
		if ( field ) {
			fields.push( field );
			fieldIds.push( name );
		}
	} );

	return {
		fields,
		form: { fields: fieldIds },
	};
}

/**
 * Creates a DataForm field definition from a block attribute definition.
 *
 * @param name - The attribute name
 * @param def  - The attribute definition from block.json
 * @return DataForm field definition
 */
function createFieldFromAttribute(
	name: string,
	def: AutoGenerateAttribute
): Field< Record< string, unknown > > {
	const type = def.type;
	const field: Field< Record< string, unknown > > = {
		id: name,
		label: def.label || name,
		// Only 'string' needs mapping to 'text'; others are 1:1 with DataForm types.
		// This mapping will be unnecessary once #74105 lands.
		// Only attributes whose type DataForm supports are marked.
		type: ( type === 'string' ? 'text' : type ) as FieldTypeName,
	};

	// Add elements for enums (DataForm idiom)
	if ( type === 'array' && Array.isArray( def.items?.enum ) ) {
		field.elements = def.items.enum.map( ( value ) => ( {
			value,
			label: String( value ),
		} ) );
	} else if ( def.enum && Array.isArray( def.enum ) ) {
		field.elements = def.enum.map( ( value ) => ( {
			value,
			label: String( value ),
		} ) );
	}

	return field;
}
