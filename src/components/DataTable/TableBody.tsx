import useTable from '@/hooks/useTable';
import DataRow from './DataRow';

const TableBody = () => {
	const { data } = useTable();
	return (
		<section className='h-full flex-grow'>
			{data.map((row, idx) => (
				<DataRow
					key={idx}
					rowNumber={idx + 1}
					data={row}
				/>
			))}
		</section>
	);
};

export default TableBody;
