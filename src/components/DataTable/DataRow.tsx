import { RoomSubstitutionEntry, Substitution } from '@/schema/types';

type DataRowProps = {
	data: Substitution | RoomSubstitutionEntry;
	rowNumber: number;
};
const DataRow = ({ rowNumber }: DataRowProps) => {
	return (
		<div
			className={`border-b border-petrik-3 bg-black last:border-opacity-80 ${rowNumber % 2 == 0 ? 'bg-opacity-20' : 'bg-opacity-0'}`}
		>
			DataRow
		</div>
	);
};

export default DataRow;
