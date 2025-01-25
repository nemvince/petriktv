import { HeaderConfig, TableData } from '@/schema/types';
import { createContext, useContext } from 'react';

type TableContextType = {
	headers: HeaderConfig[];
	data: TableData;
	totalPages: number;
	currentPage: number;
	totalItems: number;
	emptyMessage: string;
};
export const TableContext = createContext<TableContextType | undefined>(
	undefined,
);

const useTable = () => {
	const context = useContext<TableContextType | undefined>(TableContext);

	if (!context) {
		throw new Error('useTable must be used within a TableProvider');
	}

	return context;
};

export default useTable;
