import memoize from 'memize';
import { calendar as icon } from '@/components/gutenberg/icons';
import { Placeholder, Spinner as WCSpinner } from '@/components/gutenberg/ui';
import { useSelect } from '@/stores/gutenberg/data';
import { useServerSideRender } from '@/components/gutenberg/server-side-render';
import { useBlockProps } from '@/components/gutenberg/block-editor';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { useDisabled } from '@/hooks/gutenberg/compose';
import HtmlRenderer from '../utils/html-renderer';
import {
	archiveItemLink,
	getProjectLocale,
	isProjectContentSource,
	useProjectArchives,
} from '@/services/gutenberg/project/content';

/**
 * Returns the year and month of a specified date.
 *
 * @see `WP_REST_Posts_Controller::prepare_date_response()`.
 *
 * @param {string} date Date in `ISO8601/RFC3339` format.
 * @return {Object} Year and date of the specified date.
 */
const getYearMonth = memoize( ( date ) => {
	if ( ! date ) {
		return {};
	}
	const dateObj = new Date( date );
	return {
		year: dateObj.getFullYear(),
		month: dateObj.getMonth() + 1,
	};
} );

function parseDate( value ) {
	if ( ! value ) return null;
	const date = new Date( String( value ).replace( ' ', 'T' ) );
	return Number.isNaN( date.getTime() ) ? null : date;
}

function buildMonthWeeks( year, month ) {
	const firstDay = new Date( year, month - 1, 1 );
	const daysInMonth = new Date( year, month, 0 ).getDate();
	// 周一作为一周的第一天
	const offset = ( firstDay.getDay() + 6 ) % 7;
	const cells = Array( offset ).fill( null );
	for ( let day = 1; day <= daysInMonth; day++ ) {
		cells.push( day );
	}
	while ( cells.length % 7 !== 0 ) {
		cells.push( null );
	}
	const weeks = [];
	for ( let index = 0; index < cells.length; index += 7 ) {
		weeks.push( cells.slice( index, index + 7 ) );
	}
	return weeks;
}

function ProjectCalendar() {
	const postDate = useSelect(
		( select ) => {
			const editor = select( 'core/editor' );
			return editor?.getEditedPostAttribute?.( 'date' ) || '';
		},
		[]
	);
	const { items, loading, error } = useProjectArchives( 'daily' );
	const blockProps = useBlockProps();

	const targetDate = parseDate( postDate ) || new Date();
	const year = targetDate.getFullYear();
	const month = targetDate.getMonth() + 1;
	const locale = getProjectLocale();
	const today = new Date();

	if ( loading ) {
		return (
			<div { ...blockProps }>
				<WCSpinner />
			</div>
		);
	}

	if ( error ) {
		return (
			<div { ...blockProps }>
				<p>{ sprintf( __( 'Error: %s' ), error ) }</p>
			</div>
		);
	}

	if ( ! items?.length ) {
		return (
			<div { ...blockProps }>
				<Placeholder icon={ icon } label={ __( 'Calendar' ) }>
					{ __( 'No published posts found.' ) }
				</Placeholder>
			</div>
		);
	}

	const countByDay = new Map();
	for ( const item of items ) {
		if ( item.year === year && item.month === month ) {
			countByDay.set( item.day, item.count );
		}
	}

	const weeks = buildMonthWeeks( year, month );
	const weekdayLabels = Array.from( { length: 7 }, ( _, index ) =>
		new Intl.DateTimeFormat( locale, { weekday: 'narrow' } ).format(
			new Date( 2024, 0, 1 + index )
		)
	);
	const weekdayTitles = Array.from( { length: 7 }, ( _, index ) =>
		new Intl.DateTimeFormat( locale, { weekday: 'long' } ).format(
			new Date( 2024, 0, 1 + index )
		)
	);
	const caption = new Intl.DateTimeFormat( locale, {
		year: 'numeric',
		month: 'long',
	} ).format( new Date( year, month - 1, 1 ) );

	const isToday = ( day ) =>
		today.getFullYear() === year &&
		today.getMonth() + 1 === month &&
		today.getDate() === day;

	return (
		<div { ...blockProps }>
			<table className="wp-calendar-table">
				<caption>{ caption }</caption>
				<thead>
					<tr>
						{ weekdayLabels.map( ( label, index ) => (
							<th key={ index } scope="col">
								<abbr title={ weekdayTitles[ index ] }>
									{ label }
								</abbr>
							</th>
						) ) }
					</tr>
				</thead>
				<tbody>
					{ weeks.map( ( week, weekIndex ) => (
						<tr key={ weekIndex }>
							{ week.map( ( day, dayIndex ) => {
								if ( day === null ) {
									return (
										<td
											key={ `${ weekIndex }-${ dayIndex }` }
											className="pad"
										>
											&nbsp;
										</td>
									);
								}
								const count = countByDay.get( day ) || 0;
								return (
									<td
										key={ `${ weekIndex }-${ dayIndex }` }
										id={
											isToday( day )
												? 'today'
												: undefined
										}
									>
										{ count > 0 ? (
											<a
												href={ archiveItemLink( {
													year,
													month,
													day,
													count,
												} ) }
												onClick={ ( event ) =>
													event.preventDefault()
												}
											>
												{ day }
											</a>
										) : (
											day
										) }
									</td>
								);
							} ) }
						</tr>
					) ) }
				</tbody>
			</table>
		</div>
	);
}

function CoreCalendar( { attributes, name } ) {
	const { date, hasPosts, hasPostsResolved } = useSelect( ( select ) => {
		const { getEntityRecords, hasFinishedResolution } = select( coreStore );

		const singlePublishedPostQuery = {
			status: 'publish',
			per_page: 1,
		};
		const posts = getEntityRecords(
			'postType',
			'post',
			singlePublishedPostQuery
		);
		const postsResolved = hasFinishedResolution( 'getEntityRecords', [
			'postType',
			'post',
			singlePublishedPostQuery,
		] );

		let _date;

		// FIXME: @wordpress/block-library should not depend on @wordpress/editor.
		// Blocks can be loaded into a *non-post* block editor.
		const editorSelectors = select( 'core/editor' );
		if ( editorSelectors ) {
			const postType = editorSelectors.getEditedPostAttribute( 'type' );
			// Dates are used to overwrite year and month used on the calendar.
			// This overwrite should only happen for 'post' post types.
			// For other post types the calendar always displays the current month.
			if ( postType === 'post' ) {
				_date = editorSelectors.getEditedPostAttribute( 'date' );
			}
		}

		return {
			date: _date,
			hasPostsResolved: postsResolved,
			hasPosts: postsResolved && posts?.length === 1,
		};
	}, [] );

	const { content, status, error } = useServerSideRender( {
		attributes: {
			...attributes,
			...getYearMonth( date ),
		},
		block: name,
	} );

	const disabledRef = useDisabled();
	const blockProps = useBlockProps( { ref: disabledRef } );

	if ( ! hasPosts ) {
		return (
			<div { ...blockProps }>
				<Placeholder icon={ icon } label={ __( 'Calendar' ) }>
					{ ! hasPostsResolved ? (
						<WCSpinner />
					) : (
						__( 'No published posts found.' )
					) }
				</Placeholder>
			</div>
		);
	}

	return (
		<>
			{ status === 'loading' && (
				<div { ...blockProps }>
					<WCSpinner />
				</div>
			) }
			{ status === 'error' && (
				<div { ...blockProps }>
					<p>
						{ sprintf(
							/* translators: %s: error message returned when rendering the block. */
							__( 'Error: %s' ),
							error
						) }
					</p>
				</div>
			) }
			{ status === 'success' && (
				<HtmlRenderer wrapperProps={ blockProps } html={ content } />
			) }
		</>
	);
}

export default function CalendarEdit( props ) {
	return isProjectContentSource() ? (
		<ProjectCalendar { ...props } />
	) : (
		<CoreCalendar { ...props } />
	);
}
