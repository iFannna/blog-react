import { createContext, useContext } from '@/lib/gutenberg/element';

const RovingTabIndexContext = createContext<
	| {
			lastFocusedElement: HTMLElement | undefined;
			setLastFocusedElement: React.Dispatch<
				React.SetStateAction< HTMLElement | undefined >
			>;
	  }
	| undefined
>( undefined );
RovingTabIndexContext.displayName = 'RovingTabIndexContext';

export const useRovingTabIndexContext = () =>
	useContext( RovingTabIndexContext );
export const RovingTabIndexProvider = RovingTabIndexContext.Provider;
