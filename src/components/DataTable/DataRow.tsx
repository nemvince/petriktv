import { ITEMS_PER_PAGE } from '@/lib/constants';
import { RoomSubstitutionEntry, Substitution } from '@/schema/types';
import { useMemo } from 'react';

type DataRowProps = {
	data: Substitution | RoomSubstitutionEntry;
	rowNumber: number;
};
const DataRow = ({ rowNumber }: DataRowProps) => {
	const height = useMemo(() => {
		return `h-1/${ITEMS_PER_PAGE} max-h-1/${ITEMS_PER_PAGE}`;
	}, [ITEMS_PER_PAGE]);
	const bgColor = useMemo(() => {
		return rowNumber % 2 == 0 ? 'bg-opacity-20' : 'bg-opacity-0';
	}, [rowNumber]);

	return (
		<div
			className={`flex items-center justify-between border-b border-petrik-3 bg-black last:border-opacity-80 ${bgColor} ${height}`}
		>
			DataRow
		</div>
	);
};

export default DataRow;
