import { TableContextType } from '@/contexts/TableContext';
import { createContext, useContext } from 'react';

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
