import { remove } from '@/utils/gutenberg/dom';

/**
 * Looks for comments, and removes them.
 *
 * @param node The node to be processed.
 */
export default function commentRemover( node: Node ): void {
	if ( node.nodeType === node.COMMENT_NODE ) {
		remove( node );
	}
}
