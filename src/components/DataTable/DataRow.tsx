import useTable from '@/hooks/useTable';
import { useMemo } from 'react';
import TableCell from './TableCell';
import { TableData } from '@/schema/types';

type DataRowProps<T> = {
	data: T;
	rowNumber: number;
};

const DataRow = <T extends TableData>({ rowNumber, data }: DataRowProps<T>) => {
	const { headers } = useTable();
	const bgColor = useMemo(() => {
		return rowNumber % 2 == 0 ? 'bg-opacity-0' : 'bg-opacity-20';
	}, [rowNumber]);

	return (
		<div
			className={`flex h-fit flex-grow items-center justify-between border-b border-petrik-3 bg-black last:border-opacity-80 ${bgColor} `}
		>
			{headers.map((header, colIndex) => (
				<TableCell key={colIndex}>
					{header.render
						? header.render(data[header.headerKey as keyof T])
						: (data[header.headerKey as keyof T] as string)}
				</TableCell>
			))}
		</div>
	);
};

export default DataRow;
