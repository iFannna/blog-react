export function areBlocksDirty( originalBlocks, blocks ) {
	return ! isDeepEqual( originalBlocks, blocks );
}

/**
 * Compares two candidates for deep equality.
 *
 * @param {*} x 1st candidate for comparison
 * @param {*} y 2nd candidate for comparison
 * @return {boolean} whether the two candidates are deeply equal.
 */
const isDeepEqual = ( x, y ) => {
	if ( x === y ) {
		return true;
	} else if (
		typeof x === 'object' &&
		x !== null &&
		x !== undefined &&
		typeof y === 'object' &&
		y !== null &&
		y !== undefined
	) {
		if ( Object.keys( x ).length !== Object.keys( y ).length ) {
			return false;
		}

		for ( const prop in x ) {
			if ( y.hasOwnProperty( prop ) ) {
				if ( ! isDeepEqual( x[ prop ], y[ prop ] ) ) {
					return false;
				}
			} else {
				return false;
			}
		}

		return true;
	}

	return false;
};
