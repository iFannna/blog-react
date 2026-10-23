import { forwardRef } from '@/lib/gutenberg/element';
import styles from './style.module.css';

const Separator = forwardRef< HTMLSpanElement, Record< never, never > >(
	function UnforwardedSeparator( _props, ref ) {
		return (
			<span ref={ ref } aria-hidden="true" className={ styles.separator }>
				/
			</span>
		);
	}
);

export { Separator };
