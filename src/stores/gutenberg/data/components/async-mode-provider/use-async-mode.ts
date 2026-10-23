import { useContext } from '@/lib/gutenberg/element';
import { Context } from './context';

export default function useAsyncMode(): boolean {
	return useContext( Context );
}
