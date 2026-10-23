import { createReduxStore, register } from '@/stores/gutenberg/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as privateActions from './private-actions';
import * as privateSelectors from './private-selectors';
import { unlock } from '../lock-unlock';

const STORE_NAME = 'core/commands';

/**
 * Store definition for the commands namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @example
 * ```js
 * import { store as commandsStore } from '@/lib/gutenberg/commands';
 * import { useDispatch } from '@/stores/gutenberg/data';
 * ...
 * const { open: openCommandCenter } = useDispatch( commandsStore );
 * ```
 */
export const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );

register( store );
unlock( store ).registerPrivateActions( privateActions );
unlock( store ).registerPrivateSelectors( privateSelectors );
