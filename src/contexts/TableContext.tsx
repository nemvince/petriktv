import { TableContext } from '@/hooks/useTable';
import { CYCLE_INTERVAL, ITEMS_PER_PAGE } from '@/lib/constants';
import { HeaderConfig, TableData } from '@/schema/types';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

type TableProviderProps = PropsWithChildren & {
	data: TableData;
	headers: HeaderConfig[];
	emptyMessage?: string;
};
const TableProvider = ({
	children,
	data,
	headers,
	emptyMessage,
}: TableProviderProps) => {
	const totalItems = useMemo(() => data.length, [data]);
	const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
	const [currentPage, setCurrentPage] = useState(1);

	const currentData = useMemo(() => {
		if (data.length === 0) return [];

		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return data.slice(start, end);
	}, [currentPage, data]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPage((prev) => (prev % totalPages) + 1);
		}, CYCLE_INTERVAL);
		return () => clearInterval(interval);
	}, [totalPages]);

	return (
		<TableContext.Provider
			value={{
				headers,
				data: currentData,
				totalPages,
				currentPage,
				totalItems,
				emptyMessage: emptyMessage || 'Nincs adat!',
			}}
		>
			{children}
		</TableContext.Provider>
	);
};

export default TableProvider;
