import useTable from '@/hooks/useTable';
import TableCell from './TableCell';

const TableHeader = () => {
	const { headers } = useTable();
	return (
		<header className='flex w-full flex-row items-center justify-between border-b border-petrik-3'>
			{headers.map((header, idx) => (
				<TableCell
					className={`gap-x-1 font-semibold ${header.icon && header.title ? `w-1/${headers.length}` : `w-1/${headers.length + 1}`}`}
					key={idx}
				>
					<span>{header.icon}</span>
					<span>{header.title}</span>
				</TableCell>
			))}
		</header>
	);
};

export default TableHeader;
