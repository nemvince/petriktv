import { useState, useEffect, useMemo } from 'react';
import { TableData } from '@/schema/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';

type usePaginationProps = {
	data: TableData;
};
const usePagination = ({ data }: usePaginationProps) => {
	const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPage((prev) => (prev % totalPages) + 1);
		}, 5000);
		return () => clearInterval(interval);
	}, [totalPages]);

	const currentData = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return data.slice(start, end);
	}, [currentPage, data]);

	return { currentData, currentPage, totalPages };
};

export default usePagination;
