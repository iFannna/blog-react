import clsx from 'clsx';
import { isRTL } from '@/lib/gutenberg/i18n';
import { chevronDown, Icon } from '@/components/gutenberg/icons';
import InputControlSuffixWrapper from '../input-control/input-suffix-wrapper';
import styles from './style.module.css';

const SelectControlChevronDown = () => {
	return (
		<InputControlSuffixWrapper
			className={ clsx( styles.suffix, {
				[ styles[ 'is-rtl' ] ]: isRTL(),
			} ) }
		>
			<div className={ styles[ 'down-arrow' ] }>
				<Icon icon={ chevronDown } size={ 18 } />
			</div>
		</InputControlSuffixWrapper>
	);
};

export default SelectControlChevronDown;
