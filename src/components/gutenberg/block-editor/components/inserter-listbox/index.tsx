import { Composite } from '@/components/gutenberg/ui';
import { Fragment } from '@/lib/gutenberg/element';
export { default as InserterListboxGroup } from './group';
export { default as InserterListboxRow } from './row';
export { default as InserterListboxItem } from './item';
import type {
	InserterListBoxWrapperProps,
	InserterListboxProps,
} from './types';

function InserterListBoxWrapper( {
	key,
	children,
}: InserterListBoxWrapperProps ) {
	return <Fragment key={ key }>{ children }</Fragment>;
}

function InserterListbox( { children }: InserterListboxProps ) {
	return (
		<Composite
			focusShift
			focusWrap="horizontal"
			render={ InserterListBoxWrapper }
		>
			{ children }
		</Composite>
	);
}

export default InserterListbox;
