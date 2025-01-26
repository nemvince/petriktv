import { TableContext } from '@/hooks/useTable';
import { CYCLE_INTERVAL, SUBS_PER_PAGE, ROOMS_PER_PAGE } from '@/lib/constants';
import { HeaderConfig, TableData } from '@/schema/types';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

export type TableContextType = {
	headers: HeaderConfig[];
	data: TableData[];
	totalPages: number;
	currentPage: number;
	totalItems: number;
	emptyMessage: string | null;
};

type TableProviderProps = PropsWithChildren & {
	data: TableData[];
	headers: HeaderConfig[];
	emptyMessage?: string;
};
const TableProvider = ({
	children,
	data,
	headers,
	emptyMessage,
}: TableProviderProps) => {
	const ITEMS_PER_PAGE = useMemo(() => {
		const headerKeys = headers.map((header) => header.headerKey);
		if ('consolidated' in headerKeys) return SUBS_PER_PAGE;
		else return ROOMS_PER_PAGE;
	}, [headers]);
	const totalItems = useMemo(() => data.length, [data]);
	const totalPages = useMemo(
		() => (totalItems === 0 ? 1 : Math.ceil(totalItems / ITEMS_PER_PAGE)),
		[totalItems],
	);
	const [currentPage, setCurrentPage] = useState(1);

	const currentData = useMemo(() => {
		if (totalItems === 0) return [];

		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return data.slice(start, end);
	}, [currentPage, totalItems, data]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPage((prev) => (prev % totalPages) + 1);
		}, CYCLE_INTERVAL);
		return () => clearInterval(interval);
	}, [totalPages, data]);

	return (
		<TableContext.Provider
			value={{
				headers,
				data: currentData,
				totalPages,
				currentPage,
				totalItems,
				emptyMessage:
					data.length === 0 ? emptyMessage || 'Nincs adat!' : null,
			}}
		>
			{children}
		</TableContext.Provider>
	);
};

export default TableProvider;
