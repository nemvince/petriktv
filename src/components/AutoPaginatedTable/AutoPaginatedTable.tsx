import { ReactElement, useEffect, useRef, useState } from 'react';
import AnimatedPlaceholder from '@/components/AutoPaginatedTable/AnimatedPlaceholder';

type HeaderConfig<T> = {
	title?: string;
	icon?: ReactElement;
	center?: boolean;
	addClasses?: string;
	key: keyof T;
	render?: (value: any) => ReactElement | string;
};

type AutoPaginatedTableProps<T> = {
	cycleInterval?: number;
	tableHeight?: number;
	headerHeight?: number;
	header: HeaderConfig<T>[];
	data: T[];
	emptyStateMessage?: string;
	enableLogging?: boolean;
	keyExtractor?: (item: T, index: number) => string | number;
};

function AutoPaginatedTable<T>(props: AutoPaginatedTableProps<T>) {
	const [currentPage, setCurrentPage] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(props.data.length);
	const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const tableRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLTableSectionElement | null>(null);
	const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	// Enhanced logging function
	const log = (message: string, data?: any) => {
		if (props.enableLogging) {
			console.group('AutoPaginatedTable Log');
			console.log(message);
			if (data !== undefined) {
				console.log(JSON.stringify(data, null, 2));
			}
			console.groupEnd();
		}
	};

	const calculateItemsPerPage = () => {
		log('Calculating items per page', {
			tableHeight: props.tableHeight,
			dataLength: props.data.length,
		});

		if (!tableRef.current) {
			log('Table ref not set, returning full data length');
			return props.data.length;
		}

		const validRowRefs = rowRefs.current.filter((ref) => ref !== null);
		if (validRowRefs.length === 0) {
			log('No valid row refs found, returning full data length');
			return props.data.length;
		}

		const tableHeight = props.tableHeight || 500;
		const headerHeight =
			props.headerHeight || headerRef.current?.offsetHeight || 0;
		const availableHeight = tableHeight - headerHeight - 1;

		log('Height Calculations', {
			tableHeight,
			headerHeight,
			availableHeight,
		});

		let totalHeight = 0;
		let calculatedItemsPerPage = 0;
		const rowHeights: number[] = [];

		for (const row of validRowRefs) {
			if (row) {
				const rowHeight = row.offsetHeight;
				rowHeights.push(rowHeight);
				totalHeight += rowHeight;

				log('Row Height Check', {
					currentRow: calculatedItemsPerPage,
					rowHeight,
					totalHeight,
					availableHeight,
				});

				if (totalHeight > availableHeight) {
					break;
				}
				calculatedItemsPerPage++;
			}
		}

		log('Final Calculation Result', {
			calculatedItemsPerPage,
			totalHeight,
			rowHeights,
		});

		return Math.min(calculatedItemsPerPage, props.data.length);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			const calculatedItemsPerPage = calculateItemsPerPage();
			setItemsPerPage(calculatedItemsPerPage);
		}, 100);

		return () => clearTimeout(timer);
	}, [props.data, props.tableHeight]);

	useEffect(() => {
		setCurrentPage(0);
	}, [props.data.length]);

	const totalPages = Math.max(1, Math.ceil(props.data.length / itemsPerPage));

	const getCurrentPageData = () => {
		const startIndex = currentPage * itemsPerPage;
		return props.data.slice(startIndex, startIndex + itemsPerPage);
	};

	const cyclePages = () => {
		setCurrentPage((prevPage) => {
			if (totalPages <= 1) return 0;

			return prevPage < totalPages - 1 ? prevPage + 1 : 0;
		});
	};

	useEffect(() => {
		if (cycleTimerRef.current) {
			clearInterval(cycleTimerRef.current);
		}

		if (totalPages > 1) {
			cycleTimerRef.current = setInterval(
				cyclePages,
				props.cycleInterval || 3000,
			);
		}

		return () => {
			if (cycleTimerRef.current) {
				clearInterval(cycleTimerRef.current);
			}
		};
	}, [currentPage, totalPages, props.cycleInterval]);

	// Setup ResizeObserver for dynamic height tracking
	useEffect(() => {
		// Create ResizeObserver
		resizeObserverRef.current = new ResizeObserver((entries) => {
			log('ResizeObserver Triggered', {
				entries: entries.map((entry) => ({
					contentRect: {
						width: entry.contentRect.width,
						height: entry.contentRect.height,
					},
				})),
			});

			// Recalculate items per page on resize
			const calculatedItemsPerPage = calculateItemsPerPage();
			setItemsPerPage(calculatedItemsPerPage);
		});

		// Observe table ref if available
		if (tableRef.current) {
			resizeObserverRef.current.observe(tableRef.current);
		}

		// Cleanup observer on unmount
		return () => {
			if (resizeObserverRef.current) {
				resizeObserverRef.current.disconnect();
			}
		};
	}, [props.data, props.tableHeight]);

	// Default key extractor if not provided
	const getKey = props.keyExtractor || ((_: T, index: number) => index);

	if (props.data.length === 0) {
		return (
			<div className='flex h-full w-full flex-col items-center justify-center'>
				<AnimatedPlaceholder
					title={props.emptyStateMessage || 'Nincs adat!'}
				/>
			</div>
		);
	}

	return (
		<div className='h-full rounded-lg'>
			<div
				ref={tableRef}
				className='w-full'
				style={{
					height: `${props.tableHeight}px`,
					maxHeight: `${props.tableHeight}px`,
				}}
			>
				<table className='h-full w-full'>
					<thead ref={headerRef}>
						<tr className='border-b border-petrik-3'>
							{props.header.map((header, index) => (
								<th
									key={index}
									className={`border-petrik-3 px-2 py-1 font-semibold [&:not(:first-child)]:border-l ${header.center ? 'text-center' : 'text-left'} ${header.addClasses || ''} `}
								>
									<div className='flex items-center justify-center gap-1'>
										{header.icon}
										{header.title}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody className='table-auto'>
						{getCurrentPageData().map((item, index) => (
							<tr
								key={getKey(item, index)}
								ref={(el) => {
									rowRefs.current[index] = el;
								}}
								className={`border-b border-petrik-3 last:border-petrik-3/80 ${index % 2 == 0 ? 'bg-black/20' : 'bg-transparent'}`}
							>
								{props.header.map((header, colIndex) => (
									<td
										key={colIndex}
										className='border-petrik-3 text-center [&:not(:first-child)]:border-l'
									>
										{header.render
											? header.render(item[header.key])
											: String(item[header.key])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='mx-4 mt-2 flex items-center justify-between'>
				<span>Összesen: {props.data.length}</span>
				{totalPages > 1 && (
					<span className='font-bold'>
						{currentPage + 1}/{totalPages}
					</span>
				)}
			</div>
		</div>
	);
}

export default AutoPaginatedTable;
