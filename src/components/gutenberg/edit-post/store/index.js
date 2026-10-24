import { createReduxStore, register } from '@/stores/gutenberg/data';
import * as actions from './actions';
import * as selectors from './selectors';
import { STORE_NAME } from './constants';

/**
 * Store definition for the edit post namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
export const store = createReduxStore( STORE_NAME, {
	// The store is a compatibility surface for plugin APIs; all of its current
	// state lives in the preferences store.
	reducer: ( state = {} ) => state,
	actions,
	selectors,
} );
register( store );
